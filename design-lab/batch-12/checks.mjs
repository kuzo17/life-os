import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const [html, css, hardening] = await Promise.all([
  readFile(join(here, "index.html"), "utf8"),
  readFile(join(here, "hardening.css"), "utf8"),
  readFile(join(here, "hardening.js"), "utf8")
]);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
for (const source of inlineScripts) new Function(source);
new Function(hardening);

const requiredSections = ["today", "projects", "agenda", "fitos", "finance", "collections", "inbox", "review"];
for (const section of requiredSections) {
  const button = new RegExp(`<button[^>]+data-nav=["']${section}["'][^>]+aria-label=["'][^"']+["']`, "i");
  assert(button.test(html), `Manca il nome accessibile per ${section}`);
}

assert(html.includes('class="skip-link"'), "Manca il link salta-al-contenuto");
assert(html.includes('src="hardening.js"'), "hardening.js non è collegato");
assert(html.includes('href="hardening.css"'), "hardening.css non è collegato");
assert(html.includes("Cattura → Controlla → Destina") || html.includes("Cattura</span>"), "Contratto Cattura non trovato");
assert(html.includes('data-action="inbox-classify"'), "Inbox non espone Classifica ora");
assert(css.includes(".sidebar .brand-name{display:inline"), "Il breakpoint mobile non ripristina le etichette");
assert(hardening.includes('event.key !== "Tab"'), "Focus trap drawer non trovato");
assert(hardening.includes("workspace.inert = open"), "Sfondo drawer non reso inerte");
assert(!/https?:\/\/[^"']*(firebase|firestore)/i.test(html + hardening), "Riferimento Firebase remoto non consentito");

console.log(`Batch 12 static checks OK: ${inlineScripts.length} script inline + hardening.js`);
