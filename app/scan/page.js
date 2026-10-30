'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, api } from '@/lib/browser';

const TITLES = {
  ok: ['Valid, let them in', 'ok'],
  duplicate: ['Already checked in', 'warn'],
  declined: ['Guest declined the invitation', 'bad'],
  notfound: ['Code not found', 'bad'],
  unauthorized: ['Session expired, sign in again', 'bad'],
};

const fmt = (d) => (d ? new Date(d).toLocaleString() : 'Not yet');

export default function Scan() {
  const router = useRouter();
  const busy = useRef(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let scanner;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push('/login');
      const { Html5Qrcode } = await import('html5-qrcode');
      scanner = new Html5Qrcode('reader');
      scanner
          .start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, async (text) => {
            if (busy.current) return;
            busy.current = true;
            const id = text.trim().split('/').pop();
            setResult(await api('/api/scan', { method: 'POST', body: JSON.stringify({ id }) }));
          })
          .catch(() => setResult({ status: 'unauthorized', camera: true }));
    })();
    return () => { scanner?.isScanning && scanner.stop().catch(() => {}); };
  }, [router]);

  function next() {
    setResult(null);
    busy.current = false;
  }

  const [title, tone] = result ? TITLES[result.status] || ['Something went wrong', 'bad'] : ['', ''];
  const g = result?.guest;

  // Tone color mapping for modal border highlight
  const toneColors = {
    ok: '#10B981',
    warn: '#F59E0B',
    bad: '#EF4444',
  };

  return (
      <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflowX: 'hidden' }}>

        {/* Background Ambient Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(107,33,168,0.04) 50%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        {/* Top Header */}
        <header style={{ width: '100%', maxWidth: '700px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', textDecoration: 'none', color: '#FCD34D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
              <span>70th Jubilee</span>
            </Link>
            <span style={{ fontSize: '12px', color: '#64748B' }}>/</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94A3B8', letterSpacing: '0.05em' }}>Staff Scanner</span>
          </div>

          <Link href="/admin" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>
            Admin View →
          </Link>
        </header>

        {/* Center Scanner Workspace */}
        <div style={{ width: '100%', maxWidth: '520px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10, textAlign: 'center' }}>

          <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FCD34D', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
            Live Check-In Terminal
          </span>
            <h1 style={{ fontSize: '26px', fontWeight: 300, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              Scan Guest QR Code
            </h1>
          </div>

          {/* Camera Viewport Container */}
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#000000' }}>
            <div id="reader" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Result Bottom Sheet / Modal Overlay */}
        {result && (
            <div role="alertdialog" aria-label={title} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(6px)', zIndex: 50, padding: '16px' }}>
              <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#0F172A', padding: '28px 24px 36px', borderTop: `6px solid ${toneColors[tone] || '#EF4444'}`, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 -20px 40px rgba(0,0,0,0.6)', animation: 'slideUp 0.2s ease-out' }}>

                <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#FFFFFF', margin: '0 0 16px 0', lineHeight: 1.3 }}>
                  {result.camera ? 'Camera unavailable. Allow camera access and reload.' : title}
                </h2>

                {g && (
                    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', margin: '0 0 24px 0', fontSize: '13px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>Guest</dt>
                      <dd style={{ color: '#FFFFFF', fontWeight: 600, margin: 0 }}>{g.name}</dd>

                      <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>Invited on</dt>
                      <dd style={{ color: '#CBD5E1', margin: 0 }}>{g.invited_at || 'Not sent'}</dd>

                      <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>RSVP</dt>
                      <dd style={{ color: '#CBD5E1', margin: 0, textTransform: 'capitalize' }}>{g.rsvp}</dd>

                      <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>Confirmed</dt>
                      <dd style={{ color: '#CBD5E1', margin: 0 }}>{fmt(g.confirmed_at)}</dd>

                      <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>Seats</dt>
                      <dd style={{ color: '#CBD5E1', margin: 0 }}>{g.seats}</dd>

                      <dt style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>Checked in</dt>
                      <dd style={{ color: g.checked_in_at ? '#34D399' : '#CBD5E1', fontWeight: g.checked_in_at ? 600 : 400, margin: 0 }}>{fmt(g.checked_in_at)}</dd>
                    </dl>
                )}

                <button
                    onClick={next}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  Scan Next Guest
                </button>
              </div>
            </div>
        )}

        {/* Footer */}
        <footer style={{ width: '100%', maxWidth: '700px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', position: 'relative', zIndex: 10 }}>
          <span>Event Management & Check-In System</span>
          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#475569' }}>v2.0 • Encryption Active</span>
        </footer>

      </main>
  );
}