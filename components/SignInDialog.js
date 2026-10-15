import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import htm from "htm";
import { signIn, testMode } from "../auth.js";
const html = htm.bind(h);

// The sign-in box: email + password, the same account as the platformer game. A real <form>,
// so the browser can offer to remember the password. onDone(user) after signing in; onCancel otherwise.
export default function SignInDialog({ onDone, onCancel }) {
	const dialog = useRef(null);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		dialog.current.showModal();
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		setBusy(true);
		setError("");
		try {
			const user = await signIn(form.email.value.trim(), form.password.value);
			onDone(user);
		} catch (err) {
			setError(err.message ?? String(err));
			setBusy(false);
		}
	};

	return html`
		<dialog ref=${dialog} class="dialog sign-in" onCancel=${(e) => (e.preventDefault(), onCancel())}>
			<form onSubmit=${submit}>
				<h2>Log in</h2>
				${testMode && html`<p class="hint">Test mode: any password, and an email starting with a name (luke@test).</p>`}
				<label>Email <input name="email" type="email" autocomplete="username" required autofocus /></label>
				<label>Password <input name="password" type="password" autocomplete="current-password" required /></label>
				${error && html`<p class="error">${error}</p>`}
				<div class="buttons">
					<button type="button" onClick=${onCancel}>Cancel</button>
					<button type="submit" class="primary" disabled=${busy}>${busy ? "Logging in…" : "Log in"}</button>
				</div>
			</form>
		</dialog>
	`;
}
