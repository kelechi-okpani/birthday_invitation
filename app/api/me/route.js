import { NextResponse } from 'next/server';
import { getStaff } from '@/lib/server';

export async function GET(req) {
    const s = await getStaff(req);
    return NextResponse.json({ role: s?.role || null });
}