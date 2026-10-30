import { NextResponse } from 'next/server';
import { db, getStaff } from '@/lib/server';

export async function GET(req, { params }) {
    if (!(await getStaff(req))) return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
    const { data: guest } = await db
        .from('guests')
        .select('name,email,phone,invited_at,rsvp,confirmed_at,seats,checked_in_at')
        .eq('id', params.id)
        .single();
    return NextResponse.json(guest ? { status: 'found', guest } : { status: 'notfound' });
}