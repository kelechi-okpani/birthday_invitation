// Optional backup: one QR PNG per guest in ./qr-codes. Each QR holds the staff check-in link.
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import fs from 'node:fs';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const { data: guests, error } = await db.from('guests').select('id,name');
if (error) throw error;

fs.mkdirSync('qr-codes', { recursive: true });
for (const g of guests) {
  const safe = g.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  await QRCode.toFile(
      `qr-codes/${safe}-${g.id.slice(0, 6)}.png`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/check/${g.id}`,
      { width: 600, margin: 2 }
  );
}
console.log(`Created ${guests.length} QR codes in ./qr-codes`);