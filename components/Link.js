import { h } from "https://esm.sh/preact";
import htm from "https://esm.sh/htm";
const html = htm.bind(h);

function Link({ title, url, image, style }) {
	return html`
		<div class="link-div">
			<a href=${url}>
				<p>${title}</p>
				<img src="images/${image}" alt="${title}" class="${style}" />
			</a>
		</div>
	`;
}

function Border() {
	return html`
		<hr style="width: 100%; border: 1px solid #ccc;"/>
	`
}

export { Link, Border };