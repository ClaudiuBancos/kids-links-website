import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "preact/hooks";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

// Signing in, with the same email + password accounts as the platformer game. Supabase keeps
// the sign-in in a cookie, so people stay signed in until they sign out.
// A user here is { id, name }: the Auth account ID and its display name ("Luke").
//
// The family's sites on claudiu.win (this one, the platformer, the retro card game) all keep the
// sign-in in the same cookie, set for the whole domain: signing in on one signs in on all of them,
// and signing out signs out of all of them, in this browser. Anywhere else (the dev server) the
// cookie is this site's alone. Each of those projects has a copy of this; keep them alike.
// (@supabase/ssr is esm.sh's build that uses the supabase-js in index.html's import map.)

const SHARED_DOMAIN = "claudiu.win";
const shared = location.hostname === SHARED_DOMAIN || location.hostname.endsWith(`.${SHARED_DOMAIN}`);

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
	cookieOptions: { secure: location.protocol === "https:", ...(shared ? { domain: SHARED_DOMAIN } : {}) },
});

// Before the shared cookie, each site kept its own sign-in in localStorage, under this name
const OLD_SIGN_IN_KEY = `sb-${new URL(SUPABASE_URL).hostname.split(".")[0]}-auth-token`;

// Moves a sign-in left in localStorage from before the shared cookie into it, so nobody has to sign in again.
async function adoptOldSignIn() {
	let old = null;
	try {
		old = localStorage.getItem(OLD_SIGN_IN_KEY);
		if (old) localStorage.removeItem(OLD_SIGN_IN_KEY);
	} catch {
		return; // storage blocked, so there's nothing left in it
	}
	if (!old) return;
	const { data } = await supabase.auth.getSession();
	if (data.session) return; // already signed in through the cookie, maybe on another family site
	try {
		const { access_token, refresh_token } = JSON.parse(old);
		await supabase.auth.setSession({ access_token, refresh_token });
	} catch {
		// unreadable or long expired: they'll sign in again
	}
}

// Test mode, for trying things on this computer without touching Supabase: open any address
// with ?test on localhost. It lasts for this tab. Anyone can sign in with any password and an
// email that starts with their name (luke@test), and the links come from data/links.js (store.js).
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
export const testMode = LOCAL_HOSTS.includes(location.hostname) && rememberTestMode();

function rememberTestMode() {
	try {
		if (new URLSearchParams(location.search).has("test")) sessionStorage.setItem("links:test", "1");
		return sessionStorage.getItem("links:test") === "1";
	} catch {
		return new URLSearchParams(location.search).has("test");
	}
}

// Done once the old sign-in, if any, has moved into the cookie (test mode never touches it)
const adopted = testMode ? Promise.resolve() : adoptOldSignIn();

function toUser(account) {
	if (!account) return null;
	return { id: account.id, name: account.user_metadata?.display_name ?? account.email.split("@")[0] };
}

// --- Test mode's pretend accounts ---

const TEST_USER_KEY = "links:test-user";
const testListeners = new Set();

function testUser() {
	try {
		return JSON.parse(sessionStorage.getItem(TEST_USER_KEY)) ?? null;
	} catch {
		return null;
	}
}

function setTestUser(user) {
	try {
		sessionStorage.setItem(TEST_USER_KEY, JSON.stringify(user));
	} catch {}
	testListeners.forEach((listener) => listener(user));
}

// --- The real thing ---

// Throws with a readable message if the email or password is wrong. Returns the user.
export async function signIn(email, password) {
	if (testMode) {
		const word = email.split("@")[0].trim();
		if (!word) throw new Error("Type an email.");
		const name = word[0].toUpperCase() + word.slice(1).toLowerCase();
		const user = { id: `test-${name.toLowerCase()}`, name };
		setTestUser(user);
		return user;
	}
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw new Error(error.message);
	return toUser(data.user);
}

// Signs out of this browser (on all the family sites at once). Anyone signed in to the same
// account on another computer stays signed in there.
export async function signOut() {
	if (testMode) return setTestUser(null);
	await supabase.auth.signOut({ scope: "local" });
}

// The signed-in user: undefined while finding out, then null or { id, name }.
export function useUser() {
	const [user, setUser] = useState(testMode ? testUser() : undefined);
	useEffect(() => {
		if (testMode) {
			testListeners.add(setUser);
			return () => testListeners.delete(setUser);
		}
		// Fires straight away with the remembered session (INITIAL_SESSION), then on every change.
		let subscription = null;
		let done = false;
		adopted.then(() => {
			if (done) return;
			subscription = supabase.auth.onAuthStateChange((_event, session) => {
				const next = toUser(session?.user);
				// Token refreshes come through here too; keep the same object so pages don't reload.
				setUser((current) => (current?.id === next?.id && current !== undefined ? current : next));
			}).data.subscription;
		});
		return () => {
			done = true;
			subscription?.unsubscribe();
		};
	}, []);
	return user;
}
