import { h } from "preact";
import htm from "htm";
const html = htm.bind(h);

// Pictures are paths under images/, or full URLs (uploaded ones live in Supabase Storage).
export function imageUrl(image) {
	if (!image) return "";
	return image.includes("://") ? image : `/images/${image}`;
}

// One titled picture link: { title, url, image, style } (style is a class such as "br-20").
export function Link({ link }) {
	return html`
		<div class="link-div">
			<a href=${link.url}>
				<p>${link.title}</p>
				<img src=${imageUrl(link.image)} alt=${link.title} class=${link.style ?? ""} />
			</a>
		</div>
	`;
}
