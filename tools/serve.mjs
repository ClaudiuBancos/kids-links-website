// A local web server that behaves like Netlify with our _redirects: real files are served as
// they are, and any other address (/luke) gets index.html. VS Code's Live Server can't do that.
//   node tools/serve.mjs            (or npm run dev), then open http://localhost:8130/
//   PORT=9000 node tools/serve.mjs
// Add ?test to any address for test mode (no Supabase; see auth.js).

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.PORT) || 8130;

const types = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".jfif": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
};

async function fileFor(urlPath) {
	const path = normalize(join(root, decodeURIComponent(urlPath)));
	if (!path.startsWith(root.replace(/[\\/]$/, "") + sep) && path !== root) return null; // no ../ escapes
	try {
		return (await stat(path)).isFile() ? path : null;
	} catch {
		return null;
	}
}

export function startServer(listenPort = port) {
	const server = createServer(async (req, res) => {
		const urlPath = new URL(req.url, "http://x").pathname;
		const path = (await fileFor(urlPath)) ?? join(root, "index.html");
		try {
			const body = await readFile(path);
			res.writeHead(200, { "Content-Type": types[extname(path).toLowerCase()] ?? "application/octet-stream", "Cache-Control": "no-store" });
			res.end(body);
		} catch {
			res.writeHead(500).end("Couldn't read the file");
		}
	});
	return new Promise((resolve) => server.listen(listenPort, () => resolve(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1])) {
	await startServer();
	console.log(`Serving on http://localhost:${port}/  (add ?test for test mode)`);
}
