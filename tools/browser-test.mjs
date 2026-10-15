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

async function brokenImages() {
	await waitFor(`[...document.images].every((img) => img.complete)`);
	return page.evaluate(`[...document.images].filter((img) => !img.naturalWidth).map((img) => img.getAttribute("src"))`);
}

try {
	// Signed out
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
	await signOut();
} finally {
	page.close();
	server.close();
}

console.log(failures ? `\n${failures} failed` : "\nAll passed");
process.exit(failures ? 1 : 0);
