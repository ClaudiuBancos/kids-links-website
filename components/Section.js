import { h } from "https://esm.sh/preact";
import htm from "https://esm.sh/htm";
const html = htm.bind(h);

// Sections with a title are collapsible. Uses a native <details> element (no hooks,
// since App.js and the components load Preact from different CDNs) and remembers
// each section's open/closed state in localStorage, keyed by its title.
const storageKey = (title) => `section-open:${title}`;

function loadOpen(title, collapsed) {
	try {
		const saved = localStorage.getItem(storageKey(title));
		if (saved !== null) return saved === "true";
	} catch {}
	return !collapsed;
}

function saveOpen(title, open) {
	try {
		localStorage.setItem(storageKey(title), String(open));
	} catch {}
}

export default function Section({ children, noBorder, title, collapsed }) {
	const links = html`<div class="flex">${children}</div>`;
	return html`
		${title
			? html`
				<details class="section" open=${loadOpen(title, collapsed)}
					onToggle=${(e) => saveOpen(title, e.currentTarget.open)}>
					<summary class="section-title">${title}</summary>
					${links}
				</details>`
			: links}
		${!noBorder && html`<hr style="width: 100%; border: 1px solid #ccc;" />`}
	`;
}
