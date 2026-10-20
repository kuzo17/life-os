import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, relative } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = resolve(root, 'src');
const files = (await readdir(sourceRoot, { recursive: true })).filter(name => name.endsWith('.mjs'));

test('HTML is a shell with a single module entry and no embedded program/styles', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  assert.ok(Buffer.byteLength(html) < 9000);
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  assert.match(html, /<script type="module" src="src\/main.mjs"><\/script>/);
  assert.doesNotMatch(html, /<style>|<script>(?!\s*<\/script>)|\sonclick=/i);
});

test('all modules link, dependencies are acyclic and data cannot import UI', async () => {
  await import('../src/app/bootstrap.mjs');
  const graph = new Map();
  for (const name of files) {
    const file = resolve(sourceRoot, name);
    const text = await readFile(file, 'utf8');
    assert.ok(Buffer.byteLength(text) < 35000, `Module too large: ${name}`);
    assert.doesNotMatch(text, /\beval\s*\(|new Function\(|window\.[\w$]+\s*=/, `Global/eval bridge: ${name}`);
    const deps = [...text.matchAll(/\b(?:from\s*|import\s*\()(['"])(\.[^'"]+)\1/g)]
      .map(match => resolve(dirname(file), match[2]));
    if (name.startsWith('data')) for (const dependency of deps) assert.ok(relative(sourceRoot, dependency).startsWith('data'), `Data depends on UI: ${name}`);
    if (name.startsWith('domains') && name.includes('commands') && !name.endsWith('runtime.mjs')) {
      assert.doesNotMatch(text, /\b(?:document|window|localStorage)\b/, `Domain command depends on browser: ${name}`);
    }
    graph.set(file, deps);
  }
  const visited = new Set();
  function visit(file, stack = []) {
    assert.ok(!stack.includes(file), `Dependency cycle: ${[...stack, file].map(item => relative(sourceRoot, item)).join(' → ')}`);
    if (visited.has(file)) return;
    assert.ok(graph.has(file), `Missing module: ${file}`);
    for (const dependency of graph.get(file)) visit(dependency, [...stack, file]);
    visited.add(file);
  }
  for (const file of graph.keys()) visit(file);
});
