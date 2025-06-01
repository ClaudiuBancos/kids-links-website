import { h } from "https://esm.sh/preact";
import htm from "https://esm.sh/htm";
const html = htm.bind(h);

export default function Section({ children, noBorder }) {
	return html`
		<div class="flex">${children}</div>
		${!noBorder && html`<hr style="width: 100%; border: 1px solid #ccc;" />`}
	`;
}
