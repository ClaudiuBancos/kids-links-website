import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import htm from "htm";
import { imageUrl } from "./Link.js";
import { uploadImage } from "../store.js";
const html = htm.bind(h);

// The admin's editing boxes: a link, a section, a page. Each one calls onSave(values), which
// saves and resolves (or throws, and the box shows the message), then closes.

function Dialog({ title, onClose, onSubmit, children, buttons, className = "", onPaste }) {
	const dialog = useRef(null);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		dialog.current.showModal();
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			await onSubmit();
			onClose();
		} catch (err) {
			setError(err.message ?? String(err));
			setBusy(false);
		}
	};

	return html`
		<dialog ref=${dialog} class="dialog ${className}" onCancel=${(e) => (e.preventDefault(), onClose())} onPaste=${onPaste}>
			<form onSubmit=${submit}>
				<h2>${title}</h2>
				${children}
				${error && html`<p class="error">${error}</p>`}
				<div class="buttons">
					${buttons}
					<span class="spacer"></span>
					<button type="button" onClick=${onClose}>Cancel</button>
					<button type="submit" class="primary" disabled=${busy}>${busy ? "Saving…" : "Save"}</button>
				</div>
			</form>
		</dialog>
	`;
}

const CORNERS = [
	["", "Square"],
	["br-5", "A little rounded"],
	["br-10", "Rounded"],
	["br-20", "Very rounded"],
];

// "https://www.ixl.com/social-studies/grade-1/paul-revere" -> "Paul Revere"
function titleFromUrl(url) {
	try {
		const last = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
		const words = decodeURIComponent(last).replace(/\.[a-z]+$/i, "").split(/[-_]+/).filter(Boolean);
		if (!words.length || words.some((w) => !/^[a-z0-9']+$/i.test(w))) return "";
		return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
	} catch {
		return "";
	}
}

// A new link (link is null) or an existing one. sections: the page's sections, for moving it.
export function LinkDialog({ link, sectionId, sections, onSave, onDelete, onClose }) {
	const [title, setTitle] = useState(link?.title ?? "");
	const [url, setUrl] = useState(link?.url ?? "");
	const [image, setImage] = useState(link?.image ?? "");
	const [style, setStyle] = useState(link?.style ?? "");
	const [section, setSection] = useState(link?.section_id ?? sectionId);
	const [uploading, setUploading] = useState("");

	const upload = async (file) => {
		if (!file || !file.type.startsWith("image/")) return;
		setUploading("Uploading the picture…");
		try {
			setImage(await uploadImage(file));
			setUploading("");
		} catch (err) {
			setUploading(`Couldn't upload it: ${err.message ?? err}`);
		}
	};

	const onUrl = (value) => {
		setUrl(value);
		if (!title) setTitle(titleFromUrl(value));
	};

	// A picture pasted anywhere in the box (say, a screenshot) is uploaded as the link's picture.
	const onPaste = (e) => {
		const file = [...(e.clipboardData?.files ?? [])].find((f) => f.type.startsWith("image/"));
		if (file) {
			e.preventDefault();
			upload(file);
		}
	};

	const save = () => onSave({ id: link?.id, section_id: section, title: title.trim(), url: url.trim(), image: image.trim(), style });

	return html`
		<${Dialog} title=${link ? "Edit link" : "New link"} className="link-dialog" onClose=${onClose} onSubmit=${save} onPaste=${onPaste}
			buttons=${link && html`<button type="button" class="danger" onClick=${async () => confirm(`Delete "${link.title}"?`) && (await onDelete(link), onClose())}>Delete</button>`}>
			<label>Address <input type="url" required value=${url} onInput=${(e) => onUrl(e.currentTarget.value)} placeholder="https://…" /></label>
			<label>Title <input required value=${title} onInput=${(e) => setTitle(e.currentTarget.value)} /></label>
			<div class="picture-field">
				<div class="picture-preview">
					${image ? html`<img src=${imageUrl(image)} class=${style} alt="" />` : html`<span>No picture</span>`}
				</div>
				<div class="picture-inputs">
					<label>Picture <input value=${image} onInput=${(e) => setImage(e.currentTarget.value)} placeholder="a file in images/, or a web address" /></label>
					<label class="upload">Upload a picture… <input type="file" accept="image/*" onChange=${(e) => upload(e.currentTarget.files[0])} /></label>
					<p class="hint">${uploading || "Or paste a picture (Ctrl+V) anywhere in this box."}</p>
				</div>
			</div>
			<label>Corners
				<select value=${style} onChange=${(e) => setStyle(e.currentTarget.value)}>
					${CORNERS.map(([value, label]) => html`<option value=${value}>${label}</option>`)}
				</select>
			</label>
			<label>Section
				<select value=${section} onChange=${(e) => setSection(e.currentTarget.value)}>
					${sections.map((s) => html`<option value=${s.id}>${sectionLabel(s)}</option>`)}
				</select>
			</label>
		<//>
	`;
}

export function sectionLabel(section) {
	if (section.title) return section.title;
	const titles = section.links?.map((l) => l.title) ?? section.linkTitles ?? [];
	return titles.length ? `(no heading) ${titles.slice(0, 3).join(", ")}${titles.length > 3 ? "…" : ""}` : "(no heading, empty)";
}

// A new section (section is null) or an existing one. pages: every page, for "Shown on".
export function SectionDialog({ section, onPages, pages, onSave, onDelete, onClose }) {
	const [title, setTitle] = useState(section?.title ?? "");
	const [collapsed, setCollapsed] = useState(!!section?.collapsed);
	const [shownOn, setShownOn] = useState(onPages);

	const toggle = (slug) => setShownOn((now) => (now.includes(slug) ? now.filter((s) => s !== slug) : [...now, slug]));
	const save = () => onSave({ id: section?.id, title: title.trim(), collapsed: collapsed && !!title.trim() }, shownOn);
	const linkCount = section?.links?.length ?? 0;

	return html`
		<${Dialog} title=${section ? "Edit section" : "New section"} onClose=${onClose} onSubmit=${save}
			buttons=${section &&
			html`<button type="button" class="danger"
				onClick=${async () => confirm(`Delete this section and its ${linkCount} link${linkCount === 1 ? "" : "s"} from every page?`) && (await onDelete(section), onClose())}>Delete</button>`}>
			<label>Heading <input value=${title} onInput=${(e) => setTitle(e.currentTarget.value)} placeholder="None: always open, no heading" /></label>
			<label class="checkbox"><input type="checkbox" checked=${collapsed} disabled=${!title.trim()} onChange=${(e) => setCollapsed(e.currentTarget.checked)} /> Starts closed</label>
			<fieldset>
				<legend>Shown on</legend>
				${pages.map(
					(p) => html`<label class="checkbox"><input type="checkbox" checked=${shownOn.includes(p.slug)} onChange=${() => toggle(p.slug)} /> ${p.name}</label>`,
				)}
			</fieldset>
			${!shownOn.length && html`<p class="hint">It won't be on any page. You can put it back with "Add a section" on any page.</p>`}
		<//>
	`;
}

export function PageDialog({ page, onSave, onClose }) {
	const [name, setName] = useState(page.name);
	const [title, setTitle] = useState(page.title);
	return html`
		<${Dialog} title="Edit page" onClose=${onClose} onSubmit=${() => onSave({ slug: page.slug, name: name.trim(), title: title.trim() })}>
			<label>Heading <input required value=${title} onInput=${(e) => setTitle(e.currentTarget.value)} /></label>
			<label>Name in the page list <input required value=${name} onInput=${(e) => setName(e.currentTarget.value)} /></label>
			<p class="hint">Address: /${page.slug === "home" ? "" : page.slug}</p>
		<//>
	`;
}
