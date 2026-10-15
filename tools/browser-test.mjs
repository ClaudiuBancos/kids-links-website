// Checks the site in headless Chrome: who sees which page, signing in and out, and that every
// picture loads. Runs in test mode (?test), so it never signs in to Supabase or changes anything.
//   node tools/browser-test.mjs      (or npm test)

import { openHeadlessPage } from "./headless-chrome.mjs";
import { startServer } from "./serve.mjs";

const port = 8131;
const base = `http://localhost:${port}`;
const server = await startServer(port);
const page = await openHeadlessPage();

let failures = 0;
function check(what, ok, detail = "") {
	console.log(`${ok ? "ok  " : "FAIL"} ${what}${ok || !detail ? "" : `: ${detail}`}`);
	if (!ok) failures++;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(expression, timeout = 8000) {
	const end = Date.now() + timeout;
	while (Date.now() < end) {
		if (await page.evaluate(`!!(${expression})`)) return true;
		await sleep(50);
	}
	return false;
}

async function open(path) {
	await page.send("Page.navigate", { url: base + path });
	await waitFor(`document.readyState === "complete" && document.querySelector("h1, dialog[open]")`);
	await sleep(200); // let redirects settle
}

const pathname = () => page.evaluate("location.pathname");
const heading = () => page.evaluate(`document.querySelector("h1")?.textContent`);
const linkTitles = () => page.evaluate(`[...document.querySelectorAll(".link-div p")].map((p) => p.textContent)`);
const dialogOpen = () => page.evaluate(`!!document.querySelector("dialog[open]")`);
const navNames = () => page.evaluate(`[...document.querySelectorAll(".page-nav a")].map((a) => a.textContent)`);

async function signIn(email) {
	if (!(await dialogOpen())) await page.evaluate(`[...document.querySelectorAll("button")].find((b) => b.textContent === "Log in").click()`);
	await waitFor(`document.querySelector("dialog[open] form")`);
	await page.evaluate(`(() => {
		const form = document.querySelector("dialog[open] form");
		form.email.value = ${JSON.stringify(email)};
		form.password.value = "anything";
		form.requestSubmit();
	})()`);
	await waitFor(`!document.querySelector("dialog[open]")`);
	await sleep(300);
}

async function signOut() {
	await page.evaluate(`[...document.querySelectorAll("button")].find((b) => b.textContent === "Sign out").click()`);
	await sleep(300);
}

const count = (selector) => page.evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`);
const rowTitles = (row) => page.evaluate(`[...document.querySelectorAll(".flex")[${row}].querySelectorAll(".link-div p")].map((p) => p.textContent)`);

async function clickButton(text) {
	await page.evaluate(`[...document.querySelectorAll("button")].find((b) => b.textContent === ${JSON.stringify(text)}).click()`);
	await sleep(300);
}

// Types into the first matching field of the open box, the way a person would (so Preact hears it).
async function fill(selector, value) {
	await page.evaluate(`(() => {
		const input = document.querySelector("dialog[open]").querySelector(${JSON.stringify(selector.replace("dialog[open] ", ""))});
		input.value = ${JSON.stringify(value)};
		input.dispatchEvent(new Event("input", { bubbles: true }));
	})()`);
}

async function saveDialog() {
	await page.evaluate(`document.querySelector("dialog[open] form").requestSubmit()`);
	await waitFor(`!document.querySelector("dialog[open]")`);
	await sleep(300);
}

async function brokenImages() {
	await waitFor(`[...document.images].every((img) => img.complete)`);
	return page.evaluate(`[...document.images].filter((img) => !img.naturalWidth).map((img) => img.getAttribute("src"))`);
}

try {
	// The real database, signed out: only reads, before this tab is switched to test mode
	await open("/");
	await waitFor(`document.querySelectorAll(".link-div").length > 0`);
	const liveLinks = await linkTitles();
	check("live: home loads its links from Supabase", liveLinks.length > 40, String(liveLinks.length));
	check("live: signed out gets no personal links", !liveLinks.some((t) => /Daily Bancos|IXL Assignment/.test(t)));
	check("live: not in test mode", !(await page.evaluate(`!!document.querySelector(".test-badge")`)));
	await open("/luke");
	check("live: Luke's page asks you to log in", await dialogOpen());

	// Test mode from here on. Signed out
	await open("/?test");
	check("home page shows", (await heading()) === "Bancos Kids' Links", await heading());
	check("home has a Log in button", await page.evaluate(`[...document.querySelectorAll("button")].some((b) => b.textContent === "Log in")`));
	const homeLinks = await linkTitles();
	check("home has links", homeLinks.length > 40, String(homeLinks.length));
	check("home has no personal links", !homeLinks.some((t) => /Daily Bancos|IXL Assignment/.test(t)), homeLinks.join(", "));
	check("no admin page list when signed out", (await navNames()).length === 0);
	const broken = await brokenImages();
	check("every picture on home loads", broken.length === 0, broken.join(", "));

	await open("/luke");
	check("someone's page asks you to log in", await dialogOpen());
	await page.evaluate(`[...document.querySelectorAll("dialog[open] button")].find((b) => b.textContent === "Cancel").click()`);
	await sleep(200);
	check("cancelling goes home", (await pathname()) === "/", await pathname());

	await open("/nobody");
	check("an unknown page goes home", (await pathname()) === "/", await pathname());

	// Luke
	await signIn("luke@test");
	check("logging in from home goes to your page", (await pathname()) === "/luke", await pathname());
	check("Luke's page shows", (await heading()) === "Luke's Links", await heading());
	const lukeLinks = await linkTitles();
	check("Luke sees his own links", lukeLinks.includes("Luke Daily Bancos") && lukeLinks.includes("Luke's IXL Assignment"));
	check("Luke doesn't see Nathan's links", !lukeLinks.some((t) => t.startsWith("Nathan Daily")));
	check("Luke gets no page list", (await navNames()).length === 0);
	check("every picture on Luke's page loads", (await brokenImages()).length === 0);

	await open("/nathan");
	check("Luke can't open Nathan's page", (await pathname()) === "/luke", await pathname());
	await open("/");
	check("Luke at / goes to his page", (await pathname()) === "/luke", await pathname());

	await signOut();
	check("signing out goes home", (await pathname()) === "/" && (await heading()) === "Bancos Kids' Links");

	// Signing in from someone's page, as someone else
	await open("/luke");
	await signIn("nathan@test");
	check("Nathan logging in at /luke ends up at /nathan", (await pathname()) === "/nathan", await pathname());
	check("Nathan sees his own links", (await linkTitles()).includes("Nathan Daily Bancos"));
	await signOut();

	// Daniel
	await signIn("daniel@test");
	check("Daniel lands on his page", (await pathname()) === "/daniel" && (await heading()) === "Daniel's Links");
	await signOut();

	// Claudiu, the admin
	await signIn("claudiu@test");
	check("Claudiu lands on his page", (await pathname()) === "/claudiu", await pathname());
	check("Claudiu gets the page list", (await navNames()).join() === "Home,Luke,Nathan,Daniel,Claudiu", (await navNames()).join());
	await page.evaluate(`[...document.querySelectorAll(".page-nav a")].find((a) => a.textContent === "Luke").click()`);
	await waitFor(`document.querySelector("h1")?.textContent === "Luke's Links"`);
	check("Claudiu can open Luke's page", (await pathname()) === "/luke" && (await linkTitles()).includes("Luke Daily Bancos"));
	await open("/");
	check("Claudiu can see the home page", (await pathname()) === "/" && (await heading()) === "Bancos Kids' Links");
	await open("/nathan");
	check("Claudiu can open Nathan's page", (await pathname()) === "/nathan");

	// Claudiu's edit mode (test mode: changes stay in this tab's memory)
	await open("/luke");
	await page.evaluate(`window.confirm = () => true`);
	await clickButton("✎ Edit");
	check("edit mode shows a bar per section", (await count(".section-bar")) === (await count(".page-bar")) * 13, String(await count(".section-bar")));

	// Add a link to Luke's top row; the title comes from the address
	await page.evaluate(`document.querySelector(".add-link").click()`);
	await waitFor(`document.querySelector("dialog[open]")`);
	await fill("input[type=url]", "https://www.ixl.com/math/grade-4/add-fractions-with-like-denominators");
	check("a new link's title comes from its address", (await page.evaluate(`document.querySelectorAll("dialog[open] input")[1].value`)) === "Add Fractions With Like Denominators");
	await fill(".picture-inputs input", "LukeTypingBulbasaur.png");
	await saveDialog();
	let top = await rowTitles(0);
	check("the new link is at the end of Luke's top row", top.at(-1) === "Add Fractions With Like Denominators", top.join(", "));

	// Move it left, rename it, then delete it
	await page.evaluate(`[...document.querySelectorAll(".flex")[0].querySelectorAll(".link-div")].at(-1).querySelector("button[title='Move left']").click()`);
	await sleep(300);
	top = await rowTitles(0);
	check("moving a link left", top.at(-2) === "Add Fractions With Like Denominators", top.join(", "));
	await page.evaluate(`[...document.querySelectorAll(".flex")[0].querySelectorAll(".link-div")].at(-2).querySelector("a").click()`);
	await waitFor(`document.querySelector("dialog[open]")`);
	await fill("dialog[open] input:not([type])", "Fractions!");
	await saveDialog();
	check("renaming a link", (await rowTitles(0)).includes("Fractions!"), (await rowTitles(0)).join(", "));
	await page.evaluate(`[...document.querySelectorAll(".link-div")].find((d) => d.textContent.includes("Fractions!")).querySelector("button[title='Delete']").click()`);
	await sleep(300);
	check("deleting a link", !(await linkTitles()).includes("Fractions!"));

	// A new section, only on Luke's page
	await clickButton("+ New section");
	await waitFor(`document.querySelector("dialog[open]")`);
	await fill("dialog[open] input", "Test Section");
	await saveDialog();
	check("a new section appears at the end", (await page.evaluate(`[...document.querySelectorAll(".section-name")].at(-1).textContent`)) === "Test Section");
	await page.evaluate(`[...document.querySelectorAll(".add-link")].at(-1).click()`);
	await waitFor(`document.querySelector("dialog[open]")`);
	await fill("input[type=url]", "https://example.com/");
	await fill("dialog[open] input:not([type])", "Example");
	await saveDialog();
	check("a link in the new section", (await linkTitles()).includes("Example"));

	// Move the new section up one
	await page.evaluate(`[...document.querySelectorAll(".section-bar")].at(-1).querySelector("button[title='Move up']").click()`);
	await sleep(300);
	check("moving a section up", (await page.evaluate(`[...document.querySelectorAll(".section-name")].at(-2).textContent`)) === "Test Section");

	await page.evaluate(`[...document.querySelectorAll(".page-nav a")].find((a) => a.textContent === "Nathan").click()`);
	await waitFor(`document.querySelector("h1")?.textContent === "Nathan's Links"`);
	await sleep(300);
	check("the new section isn't on Nathan's page", !(await linkTitles()).includes("Example"));

	// Put the new section on Nathan's page too, from "Add a section"
	await page.evaluate(`(() => {
		const select = document.querySelector(".add-existing");
		select.value = [...select.options].find((o) => o.text.startsWith("Test Section")).value;
		select.dispatchEvent(new Event("change", { bubbles: true }));
	})()`);
	await sleep(400);
	check("adding an existing section to another page", (await linkTitles()).includes("Example"));
	check("a shared section says where else it is", (await page.evaluate(`[...document.querySelectorAll(".section-bar")].at(-1).textContent`)).includes("also on Luke"));

	// Delete the section everywhere
	await page.evaluate(`[...document.querySelectorAll(".section-bar")].at(-1).querySelector("button:last-child").click()`);
	await waitFor(`document.querySelector("dialog[open]")`);
	await page.evaluate(`[...document.querySelectorAll("dialog[open] button")].find((b) => b.textContent === "Delete").click()`);
	await sleep(400);
	check("deleting a section", !(await linkTitles()).includes("Example") && !(await dialogOpen()));

	// The page's heading and name
	await clickButton("✎ Heading");
	await waitFor(`document.querySelector("dialog[open]")`);
	await fill("dialog[open] input", "Nathan's Great Links");
	await saveDialog();
	await sleep(300);
	check("changing a page's heading", (await heading()) === "Nathan's Great Links");

	await clickButton("Done editing");
	check("done editing hides the editing bars", (await count(".edit-bar")) === 0 && (await count(".link-tools")) === 0);
	await signOut();

	await signIn("luke@test");
	check("Luke gets no Edit button", !(await page.evaluate(`[...document.querySelectorAll("button")].some((b) => b.textContent.includes("Edit"))`)));
	await signOut();
} finally {
	page.close();
	server.close();
}

console.log(failures ? `\n${failures} failed` : "\nAll passed");
process.exit(failures ? 1 : 0);
