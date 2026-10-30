import { NextResponse } from 'next/server';
import { db, getStaff } from '@/lib/server';

export async function POST(req) {
  if (!(await getStaff(req))) return NextResponse.json({ status: 'unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const { data: g } = await db
    .from('guests')
    .select('name,invited_at,rsvp,confirmed_at,seats,checked_in_at')
    .eq('id', id)
    .single();

  if (!g) return NextResponse.json({ status: 'notfound' });
  if (g.checked_in_at) return NextResponse.json({ status: 'duplicate', guest: g });
  if (g.rsvp === 'declined') return NextResponse.json({ status: 'declined', guest: g });

  const now = new Date().toISOString();
  await db.from('guests').update({ checked_in_at: now }).eq('id', id);
  return NextResponse.json({ status: 'ok', guest: { ...g, checked_in_at: now } });
}
