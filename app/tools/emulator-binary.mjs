import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Buffer } from 'node:buffer';
import console from 'node:console';

// Manifest ufficiale Firebase CLI v15.34.0. Nessuna risoluzione automatica a latest.
const sha256 = 'b70d99344caf17c98b6f910fa8f6edf32a7c016cb1035e8915f70d38901eb97f';
const url = 'https://storage.googleapis.com/firebase-preview-drop/emulator/firebase-database-emulator-v4.11.2.jar';
export const jarPath = resolve('.cache/emulators/firebase-database-emulator-v4.11.2.jar');

function verify(bytes) {
  if (bytes.length !== 34495935 || createHash('sha256').update(bytes).digest('hex') !== sha256) throw new Error('Binario emulatore non corrispondente al manifest fissato.');
}

export async function verifyBinary() { verify(await readFile(jarPath)); }

export async function installBinary() {
  try { await verifyBinary(); console.log('Emulatore già presente e verificato.'); return; }
  catch (error) { if (error?.code !== 'ENOENT') throw error; }
  await mkdir(resolve('.cache/emulators'), { recursive: true });
  const response = await globalThis.fetch(url, { redirect: 'error', signal: globalThis.AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error('Download emulatore non riuscito.');
  const bytes = Buffer.from(await response.arrayBuffer());
  verify(bytes);
  const temp = `${jarPath}.verified-download`;
  await writeFile(temp, bytes, { flag: 'wx' });
  await rename(temp, jarPath);
  console.log('Emulatore RTDB 4.11.2 verificato con SHA-256, nella sola cache locale.');
}
