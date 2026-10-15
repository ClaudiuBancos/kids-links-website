# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Use `- [ ]` for open items and `- [x]` for done ones (move done items to the Done section at the bottom).
ARCHITECTURE.md maps the code; this file just tracks the work.

## Per-child pages, phase 1: sign-in and a page per person
A default page for everyone when nobody is signed in, plus a page each for Luke, Nathan, Daniel and Claudiu.
Same sign-in as the platformer game: email + password accounts in the "Bancos Family Database" Supabase project (not the Sticker Chart one).
Security isn't a goal; anyone may read the code. A signed-in kid sees only their own page.
- [ ] Supabase client
	- [ ] Add `@supabase/supabase-js` to the import map in `index.html`, pinned, from esm.sh
	- [ ] `config.js` with the project URL and publishable key (both public by design; no build step, so no `.env`)
	- [ ] `auth.js`: sign in, sign out, who is signed in (their page name = their `display_name`, lowercased: luke, nathan, daniel, claudiu)
- [ ] Routing
	- [ ] Netlify `_redirects` (`/* /index.html 200`) so `/luke` etc. serve the one page
	- [ ] Switch `index.html` to root-absolute paths (`/index.css`, `/App.js`, `/images/...`) so they still load under `/luke`
	- [ ] `/` shows the default page; a signed-in person landing on `/` goes to their own page
	- [ ] `/luke` when you aren't Luke goes back to `/` (or opens the sign-in box)
	- [ ] Small Node dev server in `tools/` that does the same fallback, since Live Server can't
- [ ] Pages as separate files, loaded with `import()` only once the right person is signed in
	- [ ] `pages/default.js`, `pages/luke.js`, `pages/nathan.js`, `pages/daniel.js`, `pages/claudiu.js`
	- [ ] Split today's `App.js` links among them (decide together which links go where)
	- [ ] `App.js` becomes the shell: header, sign-in button, and whichever page is current
- [ ] Sign-in UI
	- [ ] "Log in" button at the top right; "Sign out" (and the person's name) when signed in
	- [ ] Sign-in box: email + password, a real `<form>` so the browser offers to remember the password
- [ ] Decide: can Claudiu open the kids' pages too (e.g. links to them from `/claudiu`)?
- [ ] Generic page title instead of "Links for Luke and Nathan"
- [ ] Headless Chrome check of each route, signed in and out
- [ ] Update ARCHITECTURE.md

## Per-child pages, phase 2: links as data
- [ ] Keep the links as data (sections and links) instead of hand-written markup, so adding one is a single line
	- [ ] Tables in the Bancos Family Database with a `links_` prefix, like the platformer's `platformer_` ones: sections, links, and which page each section is on
	- [ ] Row Level Security: default page readable by anyone; each person reads their own page; Claudiu can edit everything
	- [ ] One-time Node script to load the phase 1 page files into the tables
	- [ ] Pages load their links from Supabase instead of `pages/*.js`

## Per-child pages, phase 3: `/claudiu` as an admin panel
- [ ] Add, edit, reorder and move links and sections on any page
- [ ] Upload thumbnails (Supabase Storage) instead of committing them to `images/`
- [ ] An easier way to swap the weekly IXL assignment links

## Maybe Someday

## Done
- [x] Moved the 69 images no link uses into an `archive/` subfolder next to where they were (`images/archive/`, `images/homeschooling/archive/`), as a stash for swapping assignments back in
- [x] Deleted `tixy.html` (nothing linked to it; "Nathan's Tixy" points at tixy-quest on GitHub Pages)
- [x] Removed the unused `Border` export from `components/Link.js`
- [x] Renamed the 30 linked images whose files were `.PNG` to `.png`, so they match App.js on case-sensitive hosts
- [x] Preact and htm load once, from esm.sh at pinned versions, via an import map in `index.html` (hooks now usable)
- [x] Moved the `index.html` `<script>` inside `<body>`
- [x] Fixed the double slash at the end of the "Custom Wordle" URL
- [x] Titled sections collapse when their title is clicked, start closed with `collapsed`, and remember open/closed per title in `localStorage`
- [x] Links grouped into sections: Tools, Chess, Typing, Misc. Learning Stuff, Learning Games, Entertaining Games, Math, Reading, IXL Math Games, IXL English Games
- [x] Custom games (Super Pokemon World, Pokemon TCG Retro, Pokemon Uno, Frozen Assets, Nathan's Tixy, Lode Runner) gathered into one row
