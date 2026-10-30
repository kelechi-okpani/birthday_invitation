'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/browser';

export default function Admin() {
  const router = useRouter();
  const [guests, setGuests] = useState([]);
  const [csv, setCsv] = useState('');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function load() {
    const r = await api('/api/admin/guests');
    if (r.error) {
      const me = await api('/api/me');
      return router.push(me.role ? '/scan' : '/login');
    }
    setGuests(r.guests);
    setReady(true);
  }

  useEffect(() => { load(); }, []);

  if (!ready) {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#07080C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'system-ui, sans-serif' }}>
          Loading dashboard...
        </div>
    );
  }

  async function importGuests() {
    if (!csv.trim()) return;
    setIsImporting(true);
    const rows = csv
        .split('\n')
        .map((l) => l.split(',').map((s) => s.trim()))
        .filter((c) => c[0] && c[0].toLowerCase() !== 'name')
        .map((c) => ({ name: c[0], email: c[1] || null, phone: c[2] || null, seats: Number(c[3]) || 1 }));

    const r = await api('/api/admin/guests', { method: 'POST', body: JSON.stringify({ rows }) });
    setMsg(r.error || `Successfully imported ${rows.length} guests.`);
    if (!r.error) setCsv('');
    setIsImporting(false);
    load();
  }

  async function sendInvites() {
    setIsSending(true);
    let sent = 0, failed = 0, left = 1;
    while (left > 0) {
      setMsg(`Sending invitations… ${sent} sent`);
      const r = await api('/api/admin/send', { method: 'POST' });
      if (r.error) {
        setIsSending(false);
        return setMsg(`Stopped: ${r.error}`);
      }
      sent += r.sent; failed += r.failed; left = r.remaining;
      if (r.sent === 0 && r.failed > 0) {
        setIsSending(false);
        return setMsg(`${sent} sent, ${failed} failed. ${r.detail}`);
      }
    }
    setMsg(`Done! Sent: ${sent}, Failed: ${failed}`);
    setIsSending(false);
    load();
  }

  async function setRsvp(id, rsvp) {
    await api('/api/admin/guests', { method: 'PATCH', body: JSON.stringify({ id, rsvp }) });
    load();
  }

  return (
      <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', padding: '32px 24px 64px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflowX: 'hidden' }}>

        {/* Background Ambient Glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(107,33,168,0.04) 50%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1050px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* Top Navigation / Header */}
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', textDecoration: 'none', color: '#FCD34D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
                <span>70th Jubilee</span>
              </Link>
              <span style={{ fontSize: '12px', color: '#64748B' }}>/</span>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94A3B8', letterSpacing: '0.05em' }}>Admin Management</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/scan" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                Switch to Scanner →
              </Link>
            </div>
          </header>

          {/* Dashboard Title & Stats Summary */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Guest Management Dashboard
              </h1>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                Manage RSVPs, import batch records, and dispatch invitations.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ padding: '12px 20px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#FCD34D' }}>{guests.length}</div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B', textTransform: 'uppercase' }}>Total Guests</div>
              </div>
            </div>
          </div>

          {/* Action Grid: Import & Email Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>

            {/* Import Card */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(20px)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#FFFFFF', margin: '0 0 8px 0' }}>Import Guests (CSV)</h2>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Format one guest per line: <code style={{ color: '#FCD34D', fontFamily: 'monospace' }}>name, email, phone, seats</code>
              </p>
              <textarea
                  rows={4}
                  value={csv}
                  onChange={(e) => setCsv(e.target.value)}
                  placeholder="Ada Obi, ada@example.com, 08012345678, 2"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace', marginBottom: '16px' }}
              />
              <button
                  onClick={importGuests}
                  disabled={isImporting}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', border: 'none', cursor: 'pointer', fontSize: '13px', opacity: isImporting ? 0.7 : 1 }}
              >
                {isImporting ? 'Importing records...' : 'Import Guests'}
              </button>
            </div>

            {/* Email Broadcast Card */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#FFFFFF', margin: '0 0 8px 0' }}>Automated Invitations</h2>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  Dispatch personalized invitation emails in batches to all guests who have not yet been notified.
                </p>
              </div>

              <div>
                <button
                    onClick={sendInvites}
                    disabled={isSending}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600, color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', cursor: 'pointer', fontSize: '13px', transition: 'background 0.2s', opacity: isSending ? 0.7 : 1 }}
                >
                  {isSending ? 'Sending batch emails...' : 'Email Unsent Invitations'}
                </button>
              </div>
            </div>

          </div>

          {/* Status Message Display */}
          {msg && (
              <div role="status" style={{ padding: '14px 18px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#FCD34D', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span>{msg}</span>
              </div>
          )}

          {/* Guest List Table Container */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#FFFFFF', margin: 0 }}>Registered Guest Records</h2>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B' }}>LIVE SYNCED</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 20px' }}>Name</th>
                  <th style={{ padding: '16px 20px' }}>Email</th>
                  <th style={{ padding: '16px 20px' }}>RSVP Status</th>
                  <th style={{ padding: '16px 20px' }}>Checked In</th>
                  <th style={{ padding: '16px 20px' }}>Invited</th>
                </tr>
                </thead>
                <tbody>
                {guests.map((g) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '16px 20px', color: '#FFFFFF', fontWeight: 500 }}>{g.name}</td>
                      <td style={{ padding: '16px 20px', color: '#94A3B8', fontFamily: 'monospace', fontSize: '12px' }}>
                        {g.email || <span style={{ color: '#64748B' }}>—</span>}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                            value={g.rsvp}
                            onChange={(e) => setRsvp(g.id, e.target.value)}
                            aria-label={`RSVP for ${g.name}`}
                            style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="pending" style={{ background: '#0F172A', color: '#FFF' }}>Pending</option>
                          <option value="confirmed" style={{ background: '#0F172A', color: '#FFF' }}>Confirmed</option>
                          <option value="declined" style={{ background: '#0F172A', color: '#FFF' }}>Declined</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {g.checked_in_at ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '11px', fontFamily: 'monospace' }}>
                          Yes
                        </span>
                        ) : (
                            <span style={{ color: '#64748B', fontFamily: 'monospace', fontSize: '11px' }}>No</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#94A3B8', fontFamily: 'monospace', fontSize: '12px' }}>
                        {g.invited_at ? new Date(g.invited_at).toLocaleDateString() : 'Not sent'}
                      </td>
                    </tr>
                ))}
                {guests.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                        No guest records found. Use the CSV import tool above to add guests.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
  );
}