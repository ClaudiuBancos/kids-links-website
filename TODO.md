# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Use `- [ ]` for open items and `- [x]` for done ones (move done items to the Done section at the bottom).
ARCHITECTURE.md maps the code; this file just tracks the work.

## Later
- [ ] An easier way to swap the weekly IXL assignment links at the top
- [ ] Keep the links as data (a list of sections and links) instead of hand-written markup in App.js, so adding one is a single line

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
