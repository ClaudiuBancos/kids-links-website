# Architecture

Picture links for the kids, with a page per person. Build-free: Preact, htm and supabase-js load as ES modules from esm.sh (pinned versions, mapped to bare names by an import map in `index.html`). Hosted on Netlify, publishing the repo folder as it is.

The links live in Supabase (project "Bancos Family Database", the same accounts as the platformer game). `/` is the home page for when nobody is signed in; `/luke`, `/nathan`, `/daniel` are only for that kid; `/claudiu` is the admin's page, who can open every page and edit them all in place.

## The page
- `index.html` — Page shell and import map; renders `App`. Paths are root-absolute so they load at `/luke` too.
- `_redirects` — Netlify: every address that isn't a file serves `index.html`.
- `App.js` — Picks the page from the address and sends people where they're allowed (a kid only to their own page; signed out, someone's page asks you to log in). Draws the top bar: Log in / Sign out, and for the admin the list of pages and the Edit switch.
- `router.js` — `usePath()`, `navigate()`, `NavLink` (links between pages without reloading).
- `auth.js` — The Supabase client, `signIn`/`signOut`, `useUser()` (`{ id, name }` from the account's display name). Also **test mode**: `?test` on localhost signs anyone in by name (luke@test, any password) without Supabase, for the rest of that tab.
- `config.js` — The Supabase URL and publishable key (public by design).
- `store.js` — Every read and write of links goes through here. Uses `store/db.js` (Supabase), or `store/local.js` in test mode (data/links.js, in memory). `ownsPage(page, user)`.
- `components/Page.js` — One page's sections, with a line between. In edit mode, also a bar per section (move up/down, edit), "+ New section", "+ Add a section from another page", and the page's heading.
- `components/Section.js` — A row of links. A titled one collapses (native `<details>`, open/closed remembered per title in localStorage). In edit mode, "+ Add a link" at the end.
- `components/Link.js` — One titled picture link. `imageUrl()`: a path under `images/`, or a full URL (uploads). In edit mode, clicking opens it for editing, with move/delete buttons below.
- `components/Dialogs.js` — The admin's boxes: `LinkDialog` (address, title filled in from the address, picture by path, upload or paste, corners, section), `SectionDialog` (heading, starts closed, which pages it's on, delete), `PageDialog` (heading, name).
- `components/SignInDialog.js` — Email + password.
- `index.css` — All styling.
- `images/` — Thumbnails for the links (new ones are uploaded to Storage instead). `images/archive/`, `images/homeschooling/archive/` are unused ones kept for swapping back in.

## Data
- `supabase/migrations/` — The database setup, applied to the "Bancos Family Database" project; file names match the applied versions. Add a new file for each change; don't edit applied ones.
  - `links_page` (slug, name, title, owner account, `is_admin`), `links_section` (title, collapsed), `links_page_section` (which sections are on which page, in order; a section can be on several), `links_link`.
  - Row Level Security: anyone sees the page list and the home page's sections; signed in, also your own page's; the admin (`links_is_admin()`: owner of a page with `is_admin`) sees and changes everything.
  - `links-images` Storage bucket: public pictures, uploaded only by the admin.
- `data/links.js` — The starting links as data. Test mode's links, and the source of `supabase/seed/links.sql` (made by `tools/make-seed.mjs`, run once). Real changes happen in the admin panel, not here.

## Tools
- `tools/serve.mjs` — Local server that serves `index.html` for every address, like Netlify (`npm run dev`, port 8130). VS Code's Live Server can't do that.
- `tools/browser-test.mjs` — `npm test`: headless Chrome checks of the routing, signing in and out, and the admin's editing (all in test mode), plus a signed-out read of the real database.
- `tools/headless-chrome.mjs` — Opens headless Chrome (or Edge) over the DevTools Protocol (from the platformer game).
- `tools/make-seed.mjs` — `data/links.js` → `supabase/seed/links.sql`.
