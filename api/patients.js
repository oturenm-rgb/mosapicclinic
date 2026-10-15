import { getDb } from './db.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const sql = getDb();
  await sql`CREATE TABLE IF NOT EXISTS patients (id SERIAL PRIMARY KEY, name TEXT, age INT, gender TEXT, phone TEXT, address TEXT, created_at TIMESTAMP DEFAULT NOW())`;
  if (req.method === 'GET') {
    const patients = await sql`SELECT * FROM patients ORDER BY id DESC`;
    return res.status(200).json(patients);
  }
  if (req.method === 'POST') {
    const { name, age, gender, phone, address } = req.body;
    const result = await sql`INSERT INTO patients (name, age, gender, phone, address) VALUES (${name}, ${age}, ${gender}, ${phone}, ${address}) RETURNING *`;
    return res.status(200).json(result[0]);
  }
}
