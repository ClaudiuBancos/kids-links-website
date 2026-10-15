# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Use `- [ ]` for open items and `- [x]` for done ones (move done items to the Done section at the bottom).
ARCHITECTURE.md maps the code; this file just tracks the work.

## Try it for real
- [ ] Push, and check on Netlify that `/luke` etc. load (needs `_redirects`) and that each kid's login lands on their page
- [ ] Log in as Claudiu on the live site and edit something: the database's rules were tested in SQL, but no real admin save or picture upload has run from a browser yet
- [ ] Look over which sections ended up on which page (a first guess: each kid's page is their personal row plus everything shared; Luke also has Science; Claudiu's has Tools) and rearrange in edit mode
- [ ] The Bancos Family Database has three older tables with Row Level Security off (`pokemon`, `expenses`, `check_in_responses`), so anyone with the publishable key can read and change them. Not this site's, but it shares the key. Decide whether to lock them down

## Later
- [ ] Make a new page (say, for Isaiah) from the admin panel; today it takes an insert into `links_page` with the account's ID
- [ ] Remove uploaded pictures from Storage when no link uses them any more

## Maybe Someday
- [ ] Drag and drop to reorder links and sections, instead of the arrow buttons

## Done
- [x] Per-child pages, phase 3: `/claudiu` as an admin panel
	- [x] ✎ Edit switch for the admin: add, edit, delete, reorder and move links; add, edit, reorder and delete sections, and choose which pages each is on; change a page's heading
	- [x] Pictures by path, uploaded to Supabase Storage (`links-images` bucket), or pasted from the clipboard
	- [x] Swapping an IXL assignment: click the link, paste the new address (the title fills itself in when empty) and paste a screenshot
- [x] Per-child pages, phase 2: the links live in Supabase (`links_` tables in the Bancos Family Database), seeded from `data/links.js`, with Row Level Security: home readable by anyone, your own page by you, everything by the admin
- [x] Per-child pages, phase 1: Supabase sign-in (the platformer's accounts), a page per person at `/luke`, `/nathan`, `/daniel`, `/claudiu`, Netlify `_redirects`, local dev server, test mode, headless Chrome tests
- [x] Links kept as data instead of hand-written markup
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
