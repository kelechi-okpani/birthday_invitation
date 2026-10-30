'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, api } from '@/lib/browser';

const fmt = (d) => (d ? new Date(d).toLocaleString() : 'Not yet');

export default function Check({ params: paramsPromise }) {
    // Unwrap params for Next.js 15 / App Router compatibility
    const params = typeof paramsPromise?.then === 'function' ? use(paramsPromise) : paramsPromise;
    const guestId = params?.id;

    const router = useRouter();
    const [data, setData] = useState(null);
    const [note, setNote] = useState('');
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    useEffect(() => {
        if (!guestId) return;
        (async () => {
            const { data: s } = await supabase.auth.getSession();
            const back = `/login?next=/check/${guestId}`;
            if (!s?.session) return router.push(back);
            const r = await api(`/api/guest/${guestId}`);
            if (r.status === 'unauthorized') return router.push(back);
            setData(r);
        })();
    }, [guestId, router]);

    async function checkIn() {
        if (!guestId) return;
        setIsCheckingIn(true);
        const r = await api('/api/scan', { method: 'POST', body: JSON.stringify({ id: guestId }) });
        setNote(
            r.status === 'ok' ? 'Checked in successfully. Let them in.'
                : r.status === 'declined' ? 'This guest declined the invitation.'
                    : 'Guest is already checked in.'
        );
        setData(await api(`/api/guest/${guestId}`));
        setIsCheckingIn(false);
    }

    // Loading state
    if (!data) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#07080C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'system-ui, sans-serif' }}>
                Loading guest record...
            </div>
        );
    }

    // Not found state
    if (data.status === 'notfound') {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%', backdropFilter: 'blur(20px)' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 300, color: '#FFFFFF', marginBottom: '12px' }}>Invitation Not Found</h1>
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>The requested guest record could not be located in the system.</p>
                    <Link href="/scan" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', textDecoration: 'none', fontSize: '14px' }}>
                        Scan Another Guest
                    </Link>
                </div>
            </main>
        );
    }

    const g = data.guest;
    const state = g.checked_in_at ? 'warn' : g.rsvp === 'declined' ? 'bad' : 'ok';

    // Status badge styling map
    const badgeStyles = {
        ok: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', color: '#34D399' },
        warn: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', color: '#FCD34D' },
        bad: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', color: '#FCA5A5' },
    };

    const currentBadge = badgeStyles[state];

    const label = g.checked_in_at
        ? `Already checked in at ${fmt(g.checked_in_at)}`
        : g.rsvp === 'declined' ? 'Guest declined the invitation'
            : 'Valid invitation, ready for check-in';

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflowX: 'hidden' }}>

            {/* Background Ambient Glow */}
            <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(107,33,168,0.04) 50%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* Top Header */}
            <header style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', textDecoration: 'none', color: '#FCD34D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
                    <span>70th Jubilee</span>
                </Link>
                <Link href="/scan" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>
                    ← Scanner
                </Link>
            </header>

            {/* Main Guest Card Container */}
            <div style={{ width: '100%', maxWidth: '520px', margin: '32px auto', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>

                {/* Guest Name & Status Badge */}
                <div style={{ marginBottom: '28px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
                        Guest Verification Record
                    </span>
                    <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#FFFFFF', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                        {g.name}
                    </h1>
                    <div role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', backgroundColor: currentBadge.bg, border: `1px solid ${currentBadge.border}`, color: currentBadge.color, fontSize: '12px', fontFamily: 'monospace' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentBadge.color }} />
                        <span>{label}</span>
                    </div>
                </div>

                {/* Detailed Info Grid */}
                <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '0 0 28px 0', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div>
                        <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>RSVP Status</dt>
                        <dd style={{ color: '#FFFFFF', fontWeight: 600, margin: 0, textTransform: 'capitalize', fontSize: '14px' }}>{g.rsvp}</dd>
                    </div>
                    <div>
                        <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Allocated Seats</dt>
                        <dd style={{ color: '#FFFFFF', fontWeight: 600, margin: 0, fontSize: '14px' }}>{g.seats}</dd>
                    </div>
                    <div>
                        <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Email</dt>
                        <dd style={{ color: '#CBD5E1', margin: 0, fontSize: '12px', wordBreak: 'break-all' }}>{g.email || 'None'}</dd>
                    </div>
                    <div>
                        <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Phone</dt>
                        <dd style={{ color: '#CBD5E1', margin: 0, fontSize: '12px' }}>{g.phone || 'None'}</dd>
                    </div>
                    <div>
                        <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Invited On</dt>
                        <dd style={{ color: '#CBD5E1', margin: 0, fontSize: '12px' }}>{g.invited_at ? new Date(g.invited_at).toLocaleDateString() : 'Not sent'}</dd>
                    </div>
                    <div>
                        <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Confirmed On</dt>
                        <dd style={{ color: '#CBD5E1', margin: 0, fontSize: '12px' }}>{fmt(g.confirmed_at)}</dd>
                    </div>
                </dl>

                {/* Action Button */}
                {!g.checked_in_at && g.rsvp !== 'declined' && (
                    <button
                        onClick={checkIn}
                        disabled={isCheckingIn}
                        style={{ width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', transition: 'opacity 0.2s', opacity: isCheckingIn ? 0.7 : 1 }}
                    >
                        {isCheckingIn ? 'Processing check-in...' : 'Check In Guest'}
                    </button>
                )}

                {/* Note / Feedback Message */}
                {note && (
                    <div role="status" style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#FCD34D', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                        {note}
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    <Link href="/scan" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>
                        ← Scan next guest
                    </Link>
                </div>

            </div>

            {/* Footer */}
            <footer style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', position: 'relative', zIndex: 10 }}>
                <span>Event Management & Check-In System</span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#475569' }}>v2.0 • Encryption Active</span>
            </footer>

        </main>
    );
}