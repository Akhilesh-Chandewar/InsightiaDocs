import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const file_key = req.body.file_key;
    const filePath = path.join('downloads/', file_key);
    const csvAbsolutePath = await fs.realpath(filePath);
    const data = await fs.readFile(csvAbsolutePath, 'utf8');
    const rows = data.split('\n');
    const columns = rows.map(row => row.split(','));
    res.status(200).json({ columns });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
