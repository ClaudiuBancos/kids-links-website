# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Check off done items with `- [x]`; they get removed (git log is the record).
Ideas set aside for later: [docs/MAYBE_SOMEDAY.md](docs/MAYBE_SOMEDAY.md).

## Try it for real
- [ ] Push, and check on Netlify that `/luke` etc. load (needs `_redirects`) and that each kid's login lands on their page
- [ ] Look over which sections ended up on which page (a first guess: each kid's page is their personal row plus everything shared; Luke also has Science; Claudiu's has Tools) and rearrange in edit mode
- [ ] The Bancos Family Database has three older tables with Row Level Security off (`pokemon`, `expenses`, `check_in_responses`), so anyone with the publishable key can read and change them. Not this site's, but it shares the key. Decide whether to lock them down

## Later
- [ ] Make a new page (say, for Isaiah) from the admin panel; today it takes an insert into `links_page` with the account's ID
- [ ] Remove uploaded pictures from Storage when no link uses them any more
