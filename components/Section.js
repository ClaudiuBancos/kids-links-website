import { h } from "preact";
import htm from "htm";
import { Link } from "./Link.js";
const html = htm.bind(h);

// A row of links: { title, collapsed, links }. Sections with a title are collapsible: a native
// <details> element that remembers each section's open/closed state in localStorage, keyed by its title.
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

export default function Section({ section }) {
	const { title, collapsed } = section;
	const links = html`<div class="flex">${section.links.map((link) => html`<${Link} key=${link.id} link=${link} />`)}</div>`;
	if (!title) return links;
	return html`
		<details class="section" open=${loadOpen(title, collapsed)}
			onToggle=${(e) => saveOpen(title, e.currentTarget.open)}>
			<summary class="section-title">${title}</summary>
			${links}
		</details>
	`;
}
