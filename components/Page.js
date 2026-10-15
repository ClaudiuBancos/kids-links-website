import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import htm from "htm";
import Section from "./Section.js";
import { LinkDialog, PageDialog, SectionDialog, sectionLabel } from "./Dialogs.js";
import * as store from "../store.js";
const html = htm.bind(h);

// One person's links (or the home page's), loaded from the store, with a line between sections.
// With `editing` (the admin only) everything on it can be changed: links, sections, the page's heading.
// pages: every page (for "Shown on"); onPagesChanged() after the page's heading or name changes.
export default function Page({ page, editing, pages, onPagesChanged }) {
	const slug = page.slug;
	const [sections, setSections] = useState(null);
	const [allSections, setAllSections] = useState([]); // edit mode: every section, with the pages it's on
	const [loadError, setLoadError] = useState(null);
	const [actionError, setActionError] = useState(null);
	const [version, setVersion] = useState(0);
	const [dialog, setDialog] = useState(null);

	useEffect(() => {
		let live = true;
		setLoadError(null);
		Promise.all([store.loadPage(slug), editing ? store.listSections() : []]).then(
			([loaded, all]) => {
				if (!live) return;
				setSections(loaded);
				setAllSections(all);
			},
			(e) => live && setLoadError(e.message ?? String(e)),
		);
		return () => (live = false);
	}, [slug, editing, version]);

	const reload = () => setVersion((v) => v + 1);

	// Runs one change, then reloads. Errors show in a banner above the links.
	const act = async (change) => {
		setActionError(null);
		try {
			await change();
		} catch (e) {
			setActionError(e.message ?? String(e));
		}
		reload();
	};

	if (loadError) return html`<p class="message error">Couldn't load the links: ${loadError}</p>`;
	if (!sections) return html`<p class="message">Loading…</p>`;

	const pagesOf = (sectionId) => allSections.find((s) => s.id === sectionId)?.pages ?? [];
	const pageName = (s) => pages.find((p) => p.slug === s)?.name ?? s;

	const swap = (ids, i, dir) => {
		const next = [...ids];
		[next[i], next[i + dir]] = [next[i + dir], next[i]];
		return next;
	};

	const sectionEdit = (section) =>
		editing && {
			onEditLink: (link) => setDialog({ kind: "link", link, sectionId: section.id }),
			onAddLink: () => setDialog({ kind: "link", link: null, sectionId: section.id }),
			onMoveLink: (i, dir) => act(() => store.setLinkOrder(swap(section.links.map((l) => l.id), i, dir))),
			onDeleteLink: (link) => confirm(`Delete "${link.title}"?`) && act(() => store.deleteLink(link.id)),
		};

	// Saving a link moved to another section puts it at the end there.
	const saveLink = async (values) => {
		const target = sections.find((s) => s.id === values.section_id);
		const moved = dialog.link && dialog.link.section_id !== values.section_id;
		await store.saveLink(moved ? { ...values, sort: target.links.length } : values);
		reload();
	};

	const saveSection = async (values, shownOn) => {
		const id = await store.saveSection(values);
		await store.setSectionPages(id, shownOn);
		reload();
	};

	const notHere = allSections.filter((s) => !s.pages.includes(slug));

	return html`
		${editing &&
		html`<div class="edit-bar page-bar">
			<span>Editing <b>${page.name}</b>'s page. Changes save straight away; sections shared with other pages change there too.</span>
			<button onClick=${() => setDialog({ kind: "page" })}>✎ Heading</button>
		</div>`}
		${actionError && html`<p class="message error">Couldn't save that: ${actionError}</p>`}
		${!sections.length && html`<p class="message">No links here yet.</p>`}

		${sections.map((section, i) => {
			const elsewhere = pagesOf(section.id).filter((s) => s !== slug);
			return html`
				<${Fragment} key=${section.id}>
					${editing &&
					html`<div class="edit-bar section-bar">
						<span class="section-name">${sectionLabel(section)}</span>
						${elsewhere.length > 0 && html`<span class="shared">also on ${elsewhere.map(pageName).join(", ")}</span>`}
						<span class="spacer"></span>
						<button title="Move up" disabled=${i === 0} onClick=${() => act(() => store.setSectionOrder(slug, swap(sections.map((s) => s.id), i, -1)))}>▲</button>
						<button title="Move down" disabled=${i === sections.length - 1}
							onClick=${() => act(() => store.setSectionOrder(slug, swap(sections.map((s) => s.id), i, 1)))}>▼</button>
						<button onClick=${() => setDialog({ kind: "section", section })}>✎ Section</button>
					</div>`}
					<${Section} section=${section} edit=${sectionEdit(section)} />
					${i < sections.length - 1 && html`<hr class="divider" />`}
				<//>
			`;
		})}

		${editing &&
		html`<div class="edit-bar add-bar">
			<button onClick=${() => setDialog({ kind: "section", section: null })}>+ New section</button>
			${notHere.length > 0 &&
			html`<select class="add-existing" value=""
				onChange=${(e) => {
					const id = e.currentTarget.value;
					if (id) act(() => store.setSectionPages(id, [...pagesOf(id), slug]));
				}}>
				<option value="">+ Add a section from another page…</option>
				${notHere.map((s) => html`<option value=${s.id}>${sectionLabel(s)}${s.pages.length ? ` (on ${s.pages.map(pageName).join(", ")})` : " (on no page)"}</option>`)}
			</select>`}
		</div>`}

		${dialog?.kind === "link" &&
		html`<${LinkDialog} link=${dialog.link} sectionId=${dialog.sectionId} sections=${sections}
			onSave=${saveLink} onDelete=${(link) => act(() => store.deleteLink(link.id))} onClose=${() => setDialog(null)} />`}
		${dialog?.kind === "section" &&
		html`<${SectionDialog} section=${dialog.section} pages=${pages}
			onPages=${dialog.section ? pagesOf(dialog.section.id) : [slug]}
			onSave=${saveSection} onDelete=${(section) => act(() => store.deleteSection(section.id))} onClose=${() => setDialog(null)} />`}
		${dialog?.kind === "page" &&
		html`<${PageDialog} page=${page}
			onSave=${async (values) => (await store.savePage(values), onPagesChanged())} onClose=${() => setDialog(null)} />`}
	`;
}
