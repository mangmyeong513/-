
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.resolve('./data');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJSON(filePath, fallback) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') return fallback;
    throw e;
  }
}

async function writeJSON(filePath, data) {
  const tmp = filePath + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, filePath);
}

export class Table {
  constructor(name) {
    this.name = name;
    this.file = path.join(DATA_DIR, `${name}.json`);
  }
  async all() {
    await ensureDir();
    return readJSON(this.file, []);
  }
  async get(id) {
    const rows = await this.all();
    return rows.find(r => r.id === id) || null;
  }
  async insert(row) {
    const rows = await this.all();
    rows.push(row);
    await writeJSON(this.file, rows);
    return row;
  }
  async upsert(id, patch) {
    const rows = await this.all();
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) {
      const created = { id, ...patch };
      rows.push(created);
      await writeJSON(this.file, rows);
      return created;
    } else {
      const updated = { ...rows[idx], ...patch, id };
      rows[idx] = updated;
      await writeJSON(this.file, rows);
      return updated;
    }
  }
  async update(id, patch) {
    const rows = await this.all();
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, id };
    await writeJSON(this.file, rows);
    return rows[idx];
  }
  async delete(id) {
    const rows = await this.all();
    const filtered = rows.filter(r => r.id !== id);
    await writeJSON(this.file, filtered);
    return rows.length !== filtered.length;
  }
  async clear() {
    await writeJSON(this.file, []);
  }
}

export const tables = [
  'assessment_results','assessments','bookmarks','comments','follows',
  'friend_requests','likes','messages','notifications','posts','sessions','users'
].reduce((acc, name) => {
  acc[name] = new Table(name);
  return acc;
}, {});
