import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import htm from "htm";
import { supabase, testMode } from "../auth.js";

const html = htm.bind(h);

// /blocked?game=platformer&back=<the game's address>: where the family games send a kid a parent has blocked
// (game_access in the database; its migration and switches are in the personal-admin-panel repo). Try Again asks again:
// allowed now, it goes back to the game; still blocked, it stays. It only goes back to claudiu.win (or this
// computer's) addresses, so the link can't be used to send someone elsewhere.

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

function safeBack(back) {
	try {
		const url = new URL(back);
		const host = url.hostname;
		const family = host === "claudiu.win" || host.endsWith(".claudiu.win") || LOCAL_HOSTS.includes(host);
		return /^https?:$/.test(url.protocol) && family ? url.href : null;
	} catch {
		return null;
	}
}

// False only when the database says no (a failed check doesn't keep anyone here; the game checks again anyway).
// Test mode: only the game "test-blocked" is blocked.
async function hasGameAccess(game) {
	if (testMode) return game !== "test-blocked";
	const { data, error } = await supabase.rpc("has_game_access", { game });
	if (error) console.warn("Couldn't check game access:", error.message);
	return error ? true : data !== false;
}

export default function Blocked() {
	const params = new URLSearchParams(location.search);
	const game = params.get("game") ?? "";
	const back = safeBack(params.get("back"));
	const [checking, setChecking] = useState(false);

	useEffect(() => {
		document.title = "Blocked";
	}, []);

	const tryAgain = async () => {
		setChecking(true);
		if (await hasGameAccess(game)) location.replace(back ?? "/");
		else setTimeout(() => setChecking(false), 600); // long enough to see it tried
	};

	return html`
		<main class="blocked">
			<p>Blocked by Daddy. Fix the problem and try again.</p>
			<button class="primary" disabled=${checking} onClick=${tryAgain}>Try again</button>
		</main>
	`;
}
