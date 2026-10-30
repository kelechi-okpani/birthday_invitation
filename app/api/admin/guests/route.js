import { NextResponse } from 'next/server';
import { db, getStaff } from '@/lib/server';

async function isAdmin(req) {
  const s = await getStaff(req);
  return s?.role === 'admin';
}
const deny = () => NextResponse.json({ error: 'unauthorized' }, { status: 401 });

export async function GET(req) {
  if (!(await isAdmin(req))) return deny();
  const { data } = await db.from('guests').select('*').order('name');
  return NextResponse.json({ guests: data });
}

export async function POST(req) {
  if (!(await isAdmin(req))) return deny();
  const { rows } = await req.json();
  const { error } = await db.from('guests').insert(rows);
  return NextResponse.json({ error: error?.message });
}

export async function PATCH(req) {
  if (!(await isAdmin(req))) return deny();
  const { id, rsvp } = await req.json();
  const confirmed_at = rsvp === 'confirmed' ? new Date().toISOString() : null;
  const { error } = await db.from('guests').update({ rsvp, confirmed_at }).eq('id', id);
  return NextResponse.json({ error: error?.message });
}
