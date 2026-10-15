import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import htm from "htm";
import Section from "./Section.js";
import { loadPage } from "../store.js";
const html = htm.bind(h);

// One person's links (or the home page's), loaded from the store, with a line between sections.
export default function Page({ slug }) {
	const [sections, setSections] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let live = true;
		setSections(null);
		setError(null);
		loadPage(slug).then(
			(loaded) => live && setSections(loaded),
			(e) => live && setError(e.message ?? String(e)),
		);
		return () => (live = false);
	}, [slug]);

	if (error) return html`<p class="message error">Couldn't load the links: ${error}</p>`;
	if (!sections) return html`<p class="message">Loading…</p>`;
	if (!sections.length) return html`<p class="message">No links here yet.</p>`;
	return sections.map(
		(section, i) => html`
			<${Fragment} key=${section.id}>
				<${Section} section=${section} />
				${i < sections.length - 1 && html`<hr class="divider" />`}
			<//>
		`,
	);
}
