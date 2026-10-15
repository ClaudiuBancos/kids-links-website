import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "preact/hooks";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

// Signing in, with the same email + password accounts as the platformer game. Supabase keeps
// the sign-in in this browser's localStorage, so people stay signed in until they sign out.
// A user here is { id, name }: the Auth account ID and its display name ("Luke").

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

export async function signOut() {
	if (testMode) return setTestUser(null);
	await supabase.auth.signOut();
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
		const { data } = supabase.auth.onAuthStateChange((_event, session) => {
			const next = toUser(session?.user);
			// Token refreshes come through here too; keep the same object so pages don't reload.
			setUser((current) => (current?.id === next?.id && current !== undefined ? current : next));
		});
		return () => data.subscription.unsubscribe();
	}, []);
	return user;
}
