import { pages as dataPages, sections as dataSections } from "./data/links.js";

// Where the links come from. Everything the pages need goes through here:
//   listPages()          -> [{ slug, title, owner, admin }]  every page, for routing
//   ownsPage(page, user) -> whether this is the user's own page
//   loadPage(slug)       -> [{ id, title, collapsed, links: [{ id, title, url, image, style }] }]

export async function listPages() {
	return dataPages.map(({ slug, title, owner, admin }) => ({ slug, title, owner, admin: !!admin }));
}

export function ownsPage(page, user) {
	return !!user && page.owner === user.name;
}

export async function loadPage(slug) {
	const page = dataPages.find((p) => p.slug === slug);
	if (!page) return [];
	return page.sections.map((key) => ({
		id: key,
		title: dataSections[key].title,
		collapsed: !!dataSections[key].collapsed,
		links: dataSections[key].links.map((link, i) => ({ id: `${key}-${i}`, style: null, ...link })),
	}));
}
