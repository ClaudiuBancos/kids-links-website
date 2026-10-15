// Shared by the browser tests in tools/: opens one page in headless Chrome (or Edge) and talks to it over the
// Chrome DevTools Protocol. Each run gets a fresh, empty browser profile, so nobody is signed in and
// localStorage starts empty. Set CHROME_PATH to use a specific browser.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

function findBrowser() {
  const candidates = [process.env.CHROME_PATH];
  const puppeteerChrome = join(homedir(), '.cache', 'puppeteer', 'chrome');
  if (existsSync(puppeteerChrome)) {
    for (const version of readdirSync(puppeteerChrome).sort().reverse()) {
      candidates.push(join(puppeteerChrome, version, 'chrome-win64', 'chrome.exe'));
    }
  }
  candidates.push(
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  );
  const found = candidates.find((path) => path && existsSync(path));
  if (!found) throw new Error('No Chrome or Edge found; set CHROME_PATH');
  return found;
}

// Starts the browser and connects to its page. Returns:
//   send(method, params): sends a DevTools Protocol command, resolves with its reply
//   evaluate(expression): runs JS in the page (awaiting promises) and returns the value; throws if the JS throws
//   close(): shuts the browser down and deletes its profile
// onEvent(method, params) is called for every DevTools event (enable a domain, e.g. 'Network.enable', to get its events).
// Uncaught page errors are always printed.
export async function openHeadlessPage({ onEvent } = {}) {
  const debugPort = 9300 + Math.floor(Math.random() * 600);
  const profile = mkdtempSync(join(tmpdir(), 'headless-test-'));
  const browser = spawn(findBrowser(), [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--window-size=1200,800',
    'about:blank',
  ]);
  const close = () => {
    browser.kill();
    setTimeout(() => rmSync(profile, { recursive: true, force: true }), 500); // after the browser lets go of it
  };

  try {
    let targets;
    for (let i = 0; i < 100 && !targets; i++) {
      try {
        targets = await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json();
      } catch {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let nextId = 0;
    const pending = new Map();
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data);
        pending.delete(data.id);
        return;
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('Page error:', data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text);
      }
      onEvent?.(data.method, data.params);
    };
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const id = ++nextId;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    const evaluate = async (expression) => {
      const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      const thrown = response.result?.exceptionDetails;
      if (thrown) throw new Error(thrown.exception?.description ?? thrown.text);
      return response.result?.result?.value;
    };
    await send('Runtime.enable');
    await send('Page.enable');
    return {
      send,
      evaluate,
      close: () => {
        ws.close();
        close();
      },
    };
  } catch (error) {
    close();
    throw error;
  }
}
