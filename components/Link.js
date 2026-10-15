import { h } from "preact";
import htm from "htm";
const html = htm.bind(h);

// Pictures are paths under images/, or full URLs (uploaded ones live in Supabase Storage).
export function imageUrl(image) {
	if (!image) return "";
	return /^(https?:|data:)/.test(image) ? image : `/images/${image}`;
}

// One titled picture link: { title, url, image, style } (style is a class such as "br-20").
// With `edit` (the admin's edit mode), clicking it opens it for editing, and buttons below move or delete it:
//   edit = { onEdit(), onMove(-1 | 1), onDelete(), first, last }
export function Link({ link, edit }) {
	const onClick = edit && ((e) => (e.preventDefault(), edit.onEdit()));
	return html`
		<div class="link-div">
			<a href=${link.url} onClick=${onClick} title=${edit ? "Edit this link" : undefined}>
				<p>${link.title}</p>
				<img src=${imageUrl(link.image)} alt=${link.title} class=${link.style ?? ""} />
			</a>
			${edit &&
			html`<div class="link-tools">
				<button title="Move left" disabled=${edit.first} onClick=${() => edit.onMove(-1)}>◀</button>
				<button title="Edit" onClick=${edit.onEdit}>✎ Edit</button>
				<button title="Delete" class="danger" onClick=${edit.onDelete}>✕</button>
				<button title="Move right" disabled=${edit.last} onClick=${() => edit.onMove(1)}>▶</button>
			</div>`}
		</div>
	`;
}
