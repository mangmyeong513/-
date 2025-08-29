
import fs from 'fs/promises';
import path from 'path';
import { tables } from '../storage.js';

async function main() {
  await fs.mkdir('./data', { recursive: true });
  // create empty json arrays if missing
  for (const name of Object.keys(tables)) {
    const p = path.join('./data', `${name}.json`);
    try {
      await fs.access(p);
    } catch {
      await fs.writeFile(p, '[]', 'utf8');
      console.log('created', p);
    }
  }
  console.log('Data dir ready.');
}

main();
