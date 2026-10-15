import { h } from "preact";
import htm from "htm";
const html = htm.bind(h);

function Link({ title, url, image, style }) {
	return html`
		<div class="link-div">
			<a href=${url}>
				<p>${title}</p>
				<img src="images/${image}" alt="${title}" class="${style}" loading="lazy" />
			</a>
		</div>
	`;
}

export { Link };
