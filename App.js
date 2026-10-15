import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import htm from "htm";
import Page from "./components/Page.js";
import SignInDialog from "./components/SignInDialog.js";
import { NavLink, navigate, usePath } from "./router.js";
import { signOut, testMode, useUser } from "./auth.js";
import { listPages, ownsPage } from "./store.js";

const html = htm.bind(h);

// The shell: picks the page from the address, sends people where they're allowed to be, and draws
// the bar at the top (Log in / Sign out, plus every page for the admin).
//   /         the home page, for when nobody is signed in. A signed-in kid is sent to their own page.
//   /luke     Luke's page: only for Luke, and for the admin (Claudiu). Signed out, it asks you to log in.
// The links themselves live in the store (store.js); App.js only decides which page to show.

function usePages() {
	const [pages, setPages] = useState(undefined);
	const [error, setError] = useState(null);
	useEffect(() => {
		listPages().then(setPages, (e) => setError(e.message ?? String(e)));
	}, []);
	return { pages, error };
}

// Where this person should be instead, or null if they may stay.
function redirectFor(slug, page, user, mine) {
	if (!page) return "/";
	if (slug === "home") return mine && !mine.admin ? `/${mine.slug}` : null;
	if (!user) return null; // they'll be asked to log in
	if (mine?.admin || mine?.slug === slug) return null;
	return mine ? `/${mine.slug}` : "/";
}

export default function App() {
	const path = usePath();
	const user = useUser();
	const { pages, error } = usePages();
	const [signingIn, setSigningIn] = useState(false);

	const slug = decodeURIComponent(path.split("/")[1] ?? "").toLowerCase() || "home";
	const page = pages?.find((p) => p.slug === slug);
	const mine = user && pages ? pages.find((p) => ownsPage(p, user)) ?? null : null;
	const ready = user !== undefined && pages !== undefined;
	const redirect = ready ? redirectFor(slug, page, user, mine) : null;

	useEffect(() => {
		if (redirect) navigate(redirect, { replace: true });
	}, [redirect]);

	useEffect(() => {
		if (page) document.title = page.title;
	}, [page]);

	if (error) return html`<p class="message error">Couldn't load the pages: ${error}</p>`;
	if (!ready || redirect) return null;

	// Someone else's page while signed out: show home behind the sign-in box.
	const mustSignIn = !user && slug !== "home";
	const shown = mustSignIn ? pages.find((p) => p.slug === "home") : page;

	const signedIn = (newUser) => {
		setSigningIn(false);
		// Logging in from the home page takes you to your own page. Anywhere else, App's rules decide.
		const theirs = pages.find((p) => ownsPage(p, newUser));
		if (slug === "home" && theirs) navigate(`/${theirs.slug}`);
	};

	const leave = async () => {
		await signOut();
		navigate("/");
	};

	return html`
		<header class="top-bar">
			<nav class="page-nav">
				${mine?.admin &&
				pages.map(
					(p) => html`<${NavLink} key=${p.slug} href=${p.slug === "home" ? "/" : `/${p.slug}`}
						class=${p.slug === shown.slug ? "current" : ""}>${p.slug === "home" ? "Home" : p.owner ?? p.title}<//>`,
				)}
			</nav>
			<div class="account">
				${testMode && html`<span class="test-badge">Test mode</span>`}
				${user
					? html`<span class="user-name">${user.name}</span> <button onClick=${leave}>Sign out</button>`
					: html`<button class="primary" onClick=${() => setSigningIn(true)}>Log in</button>`}
			</div>
		</header>

		<h1>${shown.title}</h1>
		<${Page} key=${`${shown.slug}:${user?.id ?? ""}`} slug=${shown.slug} />

		${(signingIn || mustSignIn) &&
		html`<${SignInDialog}
			onDone=${signedIn}
			onCancel=${() => (setSigningIn(false), mustSignIn && navigate("/", { replace: true }))} />`}
	`;
}
