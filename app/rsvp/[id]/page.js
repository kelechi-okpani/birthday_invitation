'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Rsvp({ params: paramsPromise }) {
    const params = typeof paramsPromise?.then === 'function' ? use(paramsPromise) : paramsPromise;
    const guestId = params?.id;

    const [info, setInfo] = useState(null);
    const [choice, setChoice] = useState(null);
    const [done, setDone] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!guestId) return;
        const a = new URLSearchParams(window.location.search).get('answer');
        if (a === 'confirmed' || a === 'declined') setChoice(a);
        fetch(`/api/rsvp/${guestId}`)
            .then((r) => r.json())
            .then(setInfo);
    }, [guestId]);

    async function save(answer) {
        if (!guestId) return;
        setError('');
        setIsSaving(true);
        const r = await fetch(`/api/rsvp/${guestId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer }),
        }).then((r) => r.json());

        setIsSaving(false);
        if (r.error) return setError(r.error);
        setDone(r.rsvp);
    }

    // Loading State
    if (!info) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#07080C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'system-ui, sans-serif' }}>
                Loading invitation details...
            </div>
        );
    }

    // Not Found State
    if (!info.found) {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', position: 'relative' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%', backdropFilter: 'blur(20px)' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 300, color: '#FFFFFF', marginBottom: '12px' }}>Invitation Not Found</h1>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>Please verify your invitation link or contact the event host.</p>
                </div>
            </main>
        );
    }

    // Locked State (Already Checked In)
    if (info.locked) {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', position: 'relative' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', maxWidth: '440px', width: '100%', backdropFilter: 'blur(20px)' }}>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#FCD34D', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '16px' }}>
            Check-In Complete
          </span>
                    <h1 style={{ fontSize: '22px', fontWeight: 300, color: '#FFFFFF', marginBottom: '12px' }}>Already Checked In</h1>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>Your entrance ticket has been processed. RSVP status can no longer be updated.</p>
                </div>
            </main>
        );
    }

    // Submitted Confirmation Screen
    if (done) {
        return (
            <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflowX: 'hidden' }}>

                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(107,33,168,0.04) 50%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                <header style={{ width: '100%', maxWidth: '520px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FCD34D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
            <span>70th Jubilee</span>
          </span>
                </header>

                <div style={{ width: '100%', maxWidth: '480px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px 32px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 300, color: '#FFFFFF', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                        {done === 'confirmed' ? 'Thank you, you are confirmed' : 'Thank you for letting us know'}
                    </h1>
                    <p style={{ fontSize: '14px', color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>
                        {done === 'confirmed'
                            ? 'We look forward to seeing you. Please keep your invitation email and present the QR code upon entrance.'
                            : 'We are sorry you cannot make it. If your plans change, reopen your invitation email to respond again.'}
                    </p>
                </div>

                <footer style={{ width: '100%', maxWidth: '520px', margin: '0 auto', textAlign: 'center', fontSize: '12px', color: '#64748B', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', position: 'relative', zIndex: 10 }}>
                    <span>Event Management System • 70th Jubilee</span>
                </footer>
            </main>
        );
    }

    // Active RSVP Form Screen
    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflowX: 'hidden' }}>

            {/* Background Ambient Glow */}
            <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(107,33,168,0.04) 50%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* Top Header */}
            <header style={{ width: '100%', maxWidth: '520px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FCD34D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
          <span>70th Jubilee</span>
        </span>
            </header>

            {/* Form Card */}
            <div style={{ width: '100%', maxWidth: '480px', margin: '32px auto', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10, textAlign: 'center' }}>

        <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
          Official Guest Invitation
        </span>

                <h1 style={{ fontSize: '26px', fontWeight: 300, color: '#FFFFFF', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
                    Hello, {info.name}
                </h1>

                {info.rsvp !== 'pending' && (
                    <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: '#CBD5E1', padding: '4px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'inline-block' }}>
              Current response: <strong style={{ color: '#FCD34D', textTransform: 'capitalize' }}>{info.rsvp}</strong>
            </span>
                    </div>
                )}

                {choice ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                        <p style={{ fontSize: '14px', color: '#CBD5E1', margin: '0 0 12px 0' }}>
                            {choice === 'confirmed' ? 'Confirm that you will attend?' : 'Confirm that you cannot attend?'}
                        </p>
                        <button
                            onClick={() => save(choice)}
                            disabled={isSaving}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: isSaving ? 0.7 : 1 }}
                        >
                            {isSaving ? 'Submitting...' : choice === 'confirmed' ? 'Yes, I will attend' : 'No, I cannot attend'}
                        </button>
                        <button
                            onClick={() => setChoice(null)}
                            disabled={isSaving}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 500, color: '#CBD5E1', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', fontSize: '13px' }}
                        >
                            Change my answer
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                        <p style={{ fontSize: '14px', color: '#CBD5E1', margin: '0 0 12px 0' }}>Will you attend the celebration?</p>
                        <button
                            onClick={() => save('confirmed')}
                            disabled={isSaving}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: isSaving ? 0.7 : 1 }}
                        >
                            Yes, I will attend
                        </button>
                        <button
                            onClick={() => save('declined')}
                            disabled={isSaving}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 500, color: '#FCA5A5', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '13px' }}
                        >
                            No, I cannot attend
                        </button>
                    </div>
                )}

                {error && (
                    <div role="alert" style={{ marginTop: '20px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#FCA5A5', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

            </div>

            {/* Footer */}
            <footer style={{ width: '100%', maxWidth: '520px', margin: '0 auto', textAlign: 'center', fontSize: '12px', color: '#64748B', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', position: 'relative', zIndex: 10 }}>
                <span>Event Management System • 70th Jubilee</span>
            </footer>

        </main>
    );
}