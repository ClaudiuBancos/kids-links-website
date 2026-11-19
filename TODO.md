# To Do
A shared list. Either of us can add, edit, reorder, or check things off.
Check off done subtasks with `- [x]`; completed top-level items get removed (git log is the record).
Ideas set aside for later: docs/MAYBE_SOMEDAY.md.


## Next Steps
- [ ] Add a way to write messages as admin for the kids to read on their page

## Shared with the other family sites
- [ ] Let agents test on the real database signed in as a test account (Claude Test 1 or 2, passwords in `.env`), as the platformer and the retro card game do
	- [ ] Only the links admin writes here, so a tester can't make anything yet. Testing the admin's editing for real needs a test admin whose pages, sections and links regular kids never see: hide them with `family_is_tester`, as the platformer's `platformer_hide_testers` migration does
- [ ] Give the Supabase client (`auth.js`) the generated database types, as the platformer (`src/database.ts`) and the retro card game (`src/progress/tables.ts`) do
	- [ ] With no build step or type checker here, that means a generated `database.types.ts`, `// @ts-check` and JSDoc, checked only in the editor: decide first whether it's worth it
- [ ] `auth.js`'s header and docs/ARCHITECTURE.md say "all three" sites share the sign-in cookie: the admin panel (`personal-admin-panel/public/auth.js`) is a fourth copy. ARCHITECTURE.md's check is now `../retro-card-game/tests/browser/shared-sign-in.check.ts`

## Later
- [ ] Remove uploaded pictures from Storage when no link uses them any more
