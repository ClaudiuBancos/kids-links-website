import { testMode } from "./auth.js";
import * as db from "./store/db.js";
import * as local from "./store/local.js";

// Where the links come from: Supabase (store/db.js), or in test mode data/links.js (store/local.js).
// Both have the same functions:
//   listPages()          -> [{ slug, name, title, ownerId, admin }]  every page, for routing
//   loadPage(slug)       -> [{ id, title, collapsed, links: [{ id, section_id, title, url, image, style, sort }] }]
//   listSections()       -> every section, with the pages it's on (admin)
//   saveLink, deleteLink, setLinkOrder, saveSection, deleteSection, setSectionPages, setSectionOrder,
//   savePage, uploadImage  (admin only; the database refuses anyone else)
const store = testMode ? local : db;

export const {
	listPages,
	loadPage,
	listSections,
	saveLink,
	deleteLink,
	setLinkOrder,
	saveSection,
	deleteSection,
	setSectionPages,
	setSectionOrder,
	savePage,
	uploadImage,
} = store;

export function ownsPage(page, user) {
	return !!user && !!page.ownerId && page.ownerId === user.id;
}
