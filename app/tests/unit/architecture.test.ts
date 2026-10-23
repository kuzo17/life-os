import { readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import ts from 'typescript';
import { expect, it } from 'vitest';

const sourceRoot = resolve('src');
const sources = readdirSync(sourceRoot, { recursive: true, encoding: 'utf8' }).filter(name => /\.tsx?$/.test(name));

it('l’HTML rimane un avvio e il codice non incorpora il monolite o SDK remoti', () => {
  const html = readFileSync('index.html', 'utf8');
  expect(Buffer.byteLength(html)).toBeLessThan(2000);
  expect(html.match(/<script\b/g)).toHaveLength(1);
  expect(html).toContain('src="/src/main.tsx"');
  expect(html).not.toMatch(/<style|onclick=|<script>/i);
  for (const source of sources) {
    const text = readFileSync(resolve(sourceRoot, source), 'utf8');
    expect(Buffer.byteLength(text), source).toBeLessThan(16000);
    expect(text, source).not.toMatch(/dangerouslySetInnerHTML|\beval\s*\(|new Function\(|\bfirebase\b|design-lab\/|window\.\w+\s*=/);
  }
});

it('import risolti, grafo aciclico e confini tra dominio, dati, casi d’uso e UI', () => {
  const graph = new Map<string, string[]>();
  for (const name of sources) {
    const file = resolve(sourceRoot, name);
    const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const dependencies: string[] = [];
    const specifiers: string[] = [];
    function visit(node: ts.Node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) specifiers.push(node.moduleSpecifier.text);
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) specifiers.push(node.arguments[0].text);
      ts.forEachChild(node, visit);
    }
    visit(ast);
    for (const specifier of specifiers) {
      if (!specifier.startsWith('.')) {
        if (name.startsWith('domain')) throw new Error(`Dipendenza esterna nel dominio: ${name} → ${specifier}`);
        continue;
      }
      const base = resolve(dirname(file), specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`].find(candidate => {
        try { return readFileSync(candidate).length >= 0; } catch { return false; }
      });
      expect(target, `${name} → ${specifier}`).toBeDefined();
      if (!target) continue;
      const path = relative(sourceRoot, target).replaceAll('\\', '/');
      expect(path.startsWith('..'), name).toBe(false);
      if (name.startsWith('domain')) expect(path, name).toMatch(/^domain\//);
      if (name.startsWith('data')) expect(path, name).toMatch(/^(data|domain)\//);
      if (name.startsWith('application')) expect(path, name).toMatch(/^(application|domain|data\/ports)\//);
      if (name.startsWith('modules') || name.startsWith('ui')) expect(path, name).not.toMatch(/^data\//);
      if (/\.tsx?$/.test(target)) dependencies.push(target);
    }
    graph.set(file, dependencies);
  }
  const visited = new Set<string>();
  function visit(file: string, stack: string[]) {
    expect(stack, `Ciclo: ${[...stack, file].join(' → ')}`).not.toContain(file);
    if (visited.has(file)) return;
    expect(graph.has(file), file).toBe(true);
    for (const dependency of graph.get(file) ?? []) visit(dependency, [...stack, file]);
    visited.add(file);
  }
  for (const file of graph.keys()) visit(file, []);
  const runtimeReachable = new Set<string>();
  function reachable(file: string) {
    if (runtimeReachable.has(file)) return;
    runtimeReachable.add(file);
    for (const dependency of graph.get(file) ?? []) reachable(dependency);
  }
  reachable(resolve(sourceRoot, 'main.tsx'));
  for (const file of runtimeReachable) expect(file.replaceAll('\\', '/')).not.toContain('/adapters/rtdb/');
});
