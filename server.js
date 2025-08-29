
import express from 'express';
import { tables } from './storage.js';
import { nanoid } from 'nanoid';

const app = express();
app.use(express.json());

// CORS for quick testing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Health
app.get('/health', (_, res) => res.json({ ok: true }));

// Generic CRUD routes factory
function mount(tableName) {
  const t = tables[tableName];
  app.get(`/api/${tableName}`, async (req, res) => {
    const all = await t.all();
    res.json(all);
  });
  app.get(`/api/${tableName}/:id`, async (req, res) => {
    const item = await t.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'not_found' });
    res.json(item);
  });
  app.post(`/api/${tableName}`, async (req, res) => {
    const id = req.body.id || nanoid();
    const now = new Date().toISOString();
    const row = { id, created_at: now, ...req.body };
    await t.insert(row);
    res.status(201).json(row);
  });
  app.patch(`/api/${tableName}/:id`, async (req, res) => {
    const updated = await t.update(req.params.id, { ...req.body, updated_at: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: 'not_found' });
    res.json(updated);
  });
  app.delete(`/api/${tableName}/:id`, async (req, res) => {
    const ok = await t.delete(req.params.id);
    if (!ok) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  });
}

['assessment_results','assessments','bookmarks','comments','follows','friend_requests','likes','messages','notifications','posts','sessions','users'].forEach(mount);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`File DB API running on :${PORT}`));
