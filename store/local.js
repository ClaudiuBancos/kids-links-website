import { pages as dataPages, sections as dataSections } from "../data/links.js";

// Test mode's links: data/links.js, copied into memory when the page loads, so changes last until
// a reload. The same functions as db.js, without Row Level Security: everything is visible.
// Test accounts' IDs are "test-" plus their name (see auth.js), so page owners are written that way.

const pages = dataPages.map((p, sort) => ({
	slug: p.slug,
	name: p.name,
	title: p.title,
	ownerId: p.owner ? `test-${p.owner.toLowerCase()}` : null,
	admin: !!p.admin,
	sort,
}));
let sections = Object.entries(dataSections).map(([id, s]) => ({ id, title: s.title, collapsed: !!s.collapsed }));
let pageSections = dataPages.flatMap((p) => p.sections.map((section_id, sort) => ({ page_slug: p.slug, section_id, sort })));
let links = Object.entries(dataSections).flatMap(([section_id, s]) =>
	s.links.map((l, sort) => ({ id: `${section_id}-${sort}`, section_id, style: null, ...l, sort })),
);

const bySort = (a, b) => a.sort - b.sort;
const copy = (value) => structuredClone(value);
const nextSort = (rows) => rows.reduce((max, r) => Math.max(max, r.sort + 1), 0);
let nextId = 1;
const newId = (kind) => `${kind}-new-${nextId++}`;

export async function listPages() {
	return copy(pages.sort(bySort).map(({ sort, ...p }) => p));
}

export async function loadPage(slug) {
	return copy(
		pageSections
			.filter((ps) => ps.page_slug === slug)
			.sort(bySort)
			.map((ps) => {
				const section = sections.find((s) => s.id === ps.section_id);
				return { ...section, links: links.filter((l) => l.section_id === section.id).sort(bySort) };
			}),
	);
}

export async function listSections() {
	return copy(
		sections.map((s) => ({
			...s,
			pages: pageSections.filter((ps) => ps.section_id === s.id).map((ps) => ps.page_slug),
			linkTitles: links.filter((l) => l.section_id === s.id).sort(bySort).map((l) => l.title),
		})),
	);
}

export async function saveLink({ id, section_id, title, url, image, style, sort }) {
	const fields = { section_id, title, url, image: image ?? "", style: style || null };
	if (id) {
		const link = links.find((l) => l.id === id);
		Object.assign(link, fields, sort !== undefined ? { sort } : {});
	} else {
		links.push({ id: newId("link"), ...fields, sort: sort ?? nextSort(links.filter((l) => l.section_id === section_id)) });
	}
}

export async function deleteLink(id) {
	links = links.filter((l) => l.id !== id);
}

export async function setLinkOrder(ids) {
	ids.forEach((id, sort) => (links.find((l) => l.id === id).sort = sort));
}

export async function saveSection({ id, title, collapsed }) {
	const fields = { title: title || null, collapsed: !!collapsed };
	if (id) {
		Object.assign(sections.find((s) => s.id === id), fields);
		return id;
	}
	const section = { id: newId("section"), ...fields };
	sections.push(section);
	return section.id;
}

export async function deleteSection(id) {
	sections = sections.filter((s) => s.id !== id);
	pageSections = pageSections.filter((ps) => ps.section_id !== id);
	links = links.filter((l) => l.section_id !== id);
}

export async function setSectionPages(sectionId, slugs) {
	const current = pageSections.filter((ps) => ps.section_id === sectionId).map((ps) => ps.page_slug);
	pageSections = pageSections.filter((ps) => ps.section_id !== sectionId || slugs.includes(ps.page_slug));
	for (const page_slug of slugs.filter((s) => !current.includes(s))) {
		pageSections.push({ page_slug, section_id: sectionId, sort: nextSort(pageSections.filter((ps) => ps.page_slug === page_slug)) });
	}
}

export async function setSectionOrder(slug, sectionIds) {
	sectionIds.forEach((id, sort) => (pageSections.find((ps) => ps.page_slug === slug && ps.section_id === id).sort = sort));
}

export async function savePage({ slug, name, title }) {
	Object.assign(pages.find((p) => p.slug === slug), { name, title });
}

// No Storage in test mode: the picture becomes a data: URL, kept until a reload.
export async function uploadImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
