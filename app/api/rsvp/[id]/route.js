import { NextResponse } from 'next/server';
import { db } from '@/lib/server';

export async function GET(_req, { params }) {
    const { data: g } = await db.from('guests').select('name,rsvp,checked_in_at').eq('id', params.id).single();
    return NextResponse.json(
        g ? { found: true, name: g.name, rsvp: g.rsvp, locked: !!g.checked_in_at } : { found: false }
    );
}

export async function POST(req, { params }) {
    const { answer } = await req.json();
    if (!['confirmed', 'declined'].includes(answer)) {
        return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
    }
    const { data: g } = await db.from('guests').select('checked_in_at').eq('id', params.id).single();
    if (!g) return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    if (g.checked_in_at) return NextResponse.json({ error: 'You have already checked in.' }, { status: 409 });

    const { error } = await db
        .from('guests')
        .update({ rsvp: answer, confirmed_at: answer === 'confirmed' ? new Date().toISOString() : null })
        .eq('id', params.id);
    return NextResponse.json(error ? { error: 'Could not save your answer' } : { rsvp: answer });
}