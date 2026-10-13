# Architecture

A static, build-free page of picture links for the kids. Preact + htm are loaded as ES modules from CDNs, so the site runs straight from any static file server (e.g. VS Code Live Server).

- `index.html` — Page shell; renders `App` into `#app`.
- `index.css` — All styling: link grid, image sizes, border-radius helpers (`br-5/10/20`), collapsible section titles.
- `App.js` — The content: a list of `Section`s, each holding `Link`s. Edit this to add or move links.
- `components/Section.js` — A row of links followed by a divider (`noBorder` hides it). Giving it a `title` makes it collapsible (native `<details>`); `collapsed` makes it start closed. Open/closed state is remembered per title in `localStorage`.
- `components/Link.js` — One titled image link (`title`, `url`, `image` under `images/`, optional `style` class). Also exports an unused `Border`.
- `images/` — Thumbnails for the links.
- `tixy.html` — Standalone "Nathan's Tixy Tutorial" page (self-contained, not part of the Preact app).
