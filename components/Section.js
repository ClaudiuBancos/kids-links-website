import { h } from "preact";
import htm from "htm";
import { Link } from "./Link.js";
const html = htm.bind(h);

// A row of links: { title, collapsed, links }. Sections with a title are collapsible: a native
// <details> element that remembers each section's open/closed state in localStorage, keyed by its title.
// With `edit` (the admin's edit mode) each link gets editing buttons, and the row ends with "+ Add a link":
//   edit = { onEditLink(link), onMoveLink(index, -1 | 1), onDeleteLink(link), onAddLink() }
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

export default function Section({ section, edit }) {
	const { title, collapsed } = section;
	const count = section.links.length;
	const linkEdit = (link, i) =>
		edit && {
			onEdit: () => edit.onEditLink(link),
			onMove: (dir) => edit.onMoveLink(i, dir),
			onDelete: () => edit.onDeleteLink(link),
			first: i === 0,
			last: i === count - 1,
		};
	const links = html`
		<div class="flex">
			${section.links.map((link, i) => html`<${Link} key=${link.id} link=${link} edit=${linkEdit(link, i)} />`)}
			${edit && html`<button class="add-link" onClick=${edit.onAddLink}>+ Add a link</button>`}
		</div>
	`;
	if (!title) return links;
	return html`
		<details class="section" open=${loadOpen(title, collapsed)}
			onToggle=${(e) => saveOpen(title, e.currentTarget.open)}>
			<summary class="section-title">${title}</summary>
			${links}
		</details>
	`;
}
