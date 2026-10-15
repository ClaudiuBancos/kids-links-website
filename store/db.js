import { supabase } from "../auth.js";

// The links in Supabase (the links_ tables; see supabase/migrations/). Row Level Security decides
// what each person gets back: signed out, only the home page's sections; signed in, your own page's
// too; the admin, everything. Only the admin's changes are accepted.

const BUCKET = "links-images";

function check({ data, error }) {
	if (error) throw new Error(error.message);
	return data;
}

const bySort = (a, b) => a.sort - b.sort;

export async function listPages() {
	const rows = check(await supabase.from("links_page").select("slug, name, title, owner_id, is_admin, sort").order("sort"));
	return rows.map((p) => ({ slug: p.slug, name: p.name, title: p.title, ownerId: p.owner_id, admin: p.is_admin }));
}

export async function loadPage(slug) {
	const rows = check(
		await supabase
			.from("links_page_section")
			.select("sort, section:links_section(id, title, collapsed, links:links_link(id, section_id, title, url, image, style, sort))")
			.eq("page_slug", slug),
	);
	return rows
		.filter((row) => row.section) // hidden by Row Level Security
		.sort(bySort)
		.map(({ section }) => ({ ...section, links: section.links.sort(bySort) }));
}

// Every section, with the pages it's on and its links' titles (for the admin's "add a section" list).
export async function listSections() {
	const rows = check(await supabase.from("links_section").select("id, title, collapsed, pages:links_page_section(page_slug), links:links_link(title, sort)"));
	return rows.map((s) => ({
		id: s.id,
		title: s.title,
		collapsed: s.collapsed,
		pages: s.pages.map((p) => p.page_slug),
		linkTitles: s.links.sort(bySort).map((l) => l.title),
	}));
}

// A new link (no id) goes at the end of its section unless it has a sort.
export async function saveLink({ id, section_id, title, url, image, style, sort }) {
	const fields = { section_id, title, url, image: image ?? "", style: style || null };
	if (sort !== undefined) fields.sort = sort;
	if (id) check(await supabase.from("links_link").update(fields).eq("id", id));
	else check(await supabase.from("links_link").insert(fields));
}

export async function deleteLink(id) {
	check(await supabase.from("links_link").delete().eq("id", id));
}

export async function setLinkOrder(ids) {
	await Promise.all(ids.map(async (id, sort) => check(await supabase.from("links_link").update({ sort }).eq("id", id))));
}

// Returns the section's id (new or not).
export async function saveSection({ id, title, collapsed }) {
	const fields = { title: title || null, collapsed: !!collapsed };
	if (id) {
		check(await supabase.from("links_section").update(fields).eq("id", id));
		return id;
	}
	return check(await supabase.from("links_section").insert(fields).select("id").single()).id;
}

export async function deleteSection(id) {
	check(await supabase.from("links_section").delete().eq("id", id));
}

// Puts the section on exactly these pages: at the end of any it's new to.
export async function setSectionPages(sectionId, slugs) {
	const current = check(await supabase.from("links_page_section").select("page_slug").eq("section_id", sectionId)).map((r) => r.page_slug);
	const added = slugs.filter((s) => !current.includes(s));
	const removed = current.filter((s) => !slugs.includes(s));
	if (added.length) check(await supabase.from("links_page_section").insert(added.map((page_slug) => ({ page_slug, section_id: sectionId }))));
	if (removed.length) check(await supabase.from("links_page_section").delete().eq("section_id", sectionId).in("page_slug", removed));
}

export async function setSectionOrder(slug, sectionIds) {
	await Promise.all(
		sectionIds.map(async (id, sort) => check(await supabase.from("links_page_section").update({ sort }).eq("page_slug", slug).eq("section_id", id))),
	);
}

export async function savePage({ slug, name, title }) {
	check(await supabase.from("links_page").update({ name, title }).eq("slug", slug));
}

// Uploads a picture to Storage and returns its URL, for a link's image.
export async function uploadImage(file) {
	const ext = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] ?? "png").toLowerCase();
	const path = `${crypto.randomUUID()}.${ext}`;
	check(await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" }));
	return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
