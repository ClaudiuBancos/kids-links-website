import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import htm from "htm";
const html = htm.bind(h);

// A tiny router: the page is picked from location.pathname (/luke). Netlify's _redirects
// (and tools/serve.mjs locally) serve index.html for every address, so these all load the app.

const listeners = new Set();

export function navigate(path, { replace = false } = {}) {
	if (path === location.pathname) return;
	history[replace ? "replaceState" : "pushState"](null, "", path);
	listeners.forEach((listener) => listener(path));
}

export function usePath() {
	const [path, setPath] = useState(location.pathname);
	useEffect(() => {
		const onPop = () => setPath(location.pathname);
		listeners.add(setPath);
		addEventListener("popstate", onPop);
		return () => {
			listeners.delete(setPath);
			removeEventListener("popstate", onPop);
		};
	}, []);
	return path;
}

// A link to another page of this site, changed without reloading. Ctrl/middle-click still open a new tab.
export function NavLink({ href, children, ...rest }) {
	const onClick = (e) => {
		if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		navigate(href);
	};
	return html`<a href=${href} onClick=${onClick} ...${rest}>${children}</a>`;
}
