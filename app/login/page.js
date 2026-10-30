'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, api } from '@/lib/browser';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function signIn(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setIsLoading(false);
      return setError(authError.message);
    }

    try {
      const me = await api('/api/me');
      if (!me.role) {
        await supabase.auth.signOut();
        setIsLoading(false);
        return setError('This account is not on the staff list.');
      }
      router.push(me.role === 'admin' ? '/admin' : '/scan');
    } catch {
      setIsLoading(false);
      setError('Failed to verify user permissions.');
    }
  }

  return (
      <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>

        {/* Background Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(107,33,168,0.05) 50%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Top Header */}
        <header style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', textDecoration: 'none', color: '#FCD34D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
            <span>70th Jubilee</span>
          </Link>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B', letterSpacing: '0.1em' }}>SECURED PORTAL</span>
        </header>

        {/* Center Card Container */}
        <div style={{ width: '100%', maxWidth: '420px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FCD34D', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
            Authorized Personnel Only
          </span>
            <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#FFFFFF', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Staff Sign In
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
              Enter your credentials to launch the check-in scanner interface.
            </p>
          </div>

          <form onSubmit={signIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                  type="email"
                  placeholder="staff@jubilee.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', marginBottom: '8px' }}>
                Password
              </label>
              <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
                <div role="alert" style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#FCA5A5', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '12px', fontWeight: 600, color: '#0F172A', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'opacity 0.2s', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Verifying credentials...' : 'Sign In to Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" style={{ fontSize: '12px', color: '#64748B', textDecoration: 'none' }}>
              ← Back to portal selection
            </Link>
          </div>

        </div>

        {/* Footer */}
        <footer style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', position: 'relative', zIndex: 10 }}>
          <span>Event Management & Check-In System</span>
          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#475569' }}>v2.0 • Encryption Active</span>
        </footer>

      </main>
  );
}