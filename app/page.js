import Link from 'next/link';


export default function Home() {
    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#07080C', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
            {/* Background Ambient Glows */}
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: '400px', height: '400px', background: 'rgba(245, 158, 11, 0.08)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Main Horizontal Card Container */}
            <div style={{ width: '100%', maxWidth: '860px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px', alignItems: 'center', position: 'relative', zIndex: 10, backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

                {/* Left Section: Branding */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', width: 'fit-content' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FCD34D' }}>
              70th Jubilee • Platinum
            </span>
                    </div>

                    <div>
                        <h1 style={{ fontSize: '4rem', fontWeight: 200, margin: '0 0 10px 0', lineHeight: 1, letterSpacing: '-0.03em' }}>
                            70<span style={{ color: '#F59E0B', fontWeight: 300 }}>th</span>
                        </h1>
                        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                            Welcome to the guest check-in portal. Choose your operational workspace below to proceed.
                        </p>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                        SECURED ENCRYPTION ACTIVE
                    </div>
                </div>

                {/* Right Section: Interactive Action Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Staff Scanner Card */}
                    <Link
                        href="/scan"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.05))', border: '1px solid rgba(245, 158, 11, 0.35)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>Scan Guests (Staff)</div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Launch QR code scanner</div>
                            </div>
                        </div>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#FCD34D' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    {/* Admin Management Card */}
                    <Link
                        href="/admin"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.06)', color: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>Manage Guests (Admin)</div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>View logs and configure settings</div>
                            </div>
                        </div>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#64748B' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                </div>

            </div>

        </main>
    );
}