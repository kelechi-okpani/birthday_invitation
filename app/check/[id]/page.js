'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, api } from '@/lib/browser';

const fmt = (d) => (d ? new Date(d).toLocaleString() : 'Not yet');

export default function Check({ params }) {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        (async () => {
            const { data: s } = await supabase.auth.getSession();
            const back = `/login?next=/check/${params.id}`;
            if (!s.session) return router.push(back);
            const r = await api(`/api/guest/${params.id}`);
            if (r.status === 'unauthorized') return router.push(back);
            setData(r);
        })();
    }, [params.id, router]);

    async function checkIn() {
        const r = await api('/api/scan', { method: 'POST', body: JSON.stringify({ id: params.id }) });
        setNote(
            r.status === 'ok' ? 'Checked in. Let them in.'
                : r.status === 'declined' ? 'This guest declined the invitation.'
                    : 'Already checked in.'
        );
        setData(await api(`/api/guest/${params.id}`));
    }

    if (!data) return <main><p>Loading…</p></main>;
    if (data.status === 'notfound') {
        return <main><h1>Invitation not found</h1><p><a href="/scan">Scan again</a></p></main>;
    }

    const g = data.guest;
    const state = g.checked_in_at ? 'warn' : g.rsvp === 'declined' ? 'bad' : 'ok';
    const label = g.checked_in_at
        ? `Already checked in at ${fmt(g.checked_in_at)}`
        : g.rsvp === 'declined' ? 'Guest declined the invitation'
            : 'Valid invitation, not yet checked in';

    return (
        <main>
            <h1>{g.name}</h1>
            <p className={`badge ${state}`} role="status">{label}</p>
            <dl className="details">
                <dt>Invited on</dt><dd>{g.invited_at || 'Not sent'}</dd>
                <dt>RSVP</dt><dd>{g.rsvp}</dd>
                <dt>Confirmed on</dt><dd>{fmt(g.confirmed_at)}</dd>
                <dt>Seats</dt><dd>{g.seats}</dd>
                <dt>Email</dt><dd>{g.email || 'None'}</dd>
                <dt>Phone</dt><dd>{g.phone || 'None'}</dd>
            </dl>
            {!g.checked_in_at && g.rsvp !== 'declined' && <button onClick={checkIn}>Check in guest</button>}
            {note && <p role="status">{note}</p>}
            <p><a href="/scan">Scan next guest</a></p>
        </main>
    );
}