// Turns data/links.js into SQL that fills the links_ tables (supabase/seed/links.sql).
// Run once, when the tables were new; after that the admin panel at /claudiu changes the links.
// Page owners are found by their account's display name, so no account IDs are written down here.
//   node tools/make-seed.mjs

import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { pages, sections } from "../data/links.js";

const text = (value) => (value === null || value === undefined ? "null" : `'${String(value).replaceAll("'", "''")}'`);

const ids = Object.fromEntries(Object.keys(sections).map((key) => [key, randomUUID()]));
const lines = [
	"-- Made by tools/make-seed.mjs from data/links.js. The starting links; safe to run only once.",
	"begin;",
	"",
];

pages.forEach((page, i) => {
	const owner = page.owner ? `(select id from auth.users where raw_user_meta_data ->> 'display_name' = ${text(page.owner)})` : "null";
	lines.push(
		`insert into public.links_page (slug, name, title, owner_id, is_admin, sort) values (${text(page.slug)}, ${text(page.name)}, ${text(page.title)}, ${owner}, ${!!page.admin}, ${i});`,
	);
});
lines.push("");

for (const [key, section] of Object.entries(sections)) {
	lines.push(`-- ${key}`);
	lines.push(`insert into public.links_section (id, title, collapsed) values ('${ids[key]}', ${text(section.title)}, ${!!section.collapsed});`);
	section.links.forEach((link, i) => {
		lines.push(
			`insert into public.links_link (section_id, title, url, image, style, sort) values ('${ids[key]}', ${text(link.title)}, ${text(link.url)}, ${text(link.image)}, ${text(link.style)}, ${i});`,
		);
	});
}
lines.push("");

for (const page of pages) {
	page.sections.forEach((key, i) => {
		lines.push(`insert into public.links_page_section (page_slug, section_id, sort) values (${text(page.slug)}, '${ids[key]}', ${i});`);
	});
}

lines.push("", "commit;", "");
mkdirSync(new URL("../supabase/seed/", import.meta.url), { recursive: true });
writeFileSync(new URL("../supabase/seed/links.sql", import.meta.url), lines.join("\n"));
console.log("Wrote supabase/seed/links.sql");
