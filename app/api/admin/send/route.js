import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { db, getStaff } from '@/lib/server';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});



function card(g, e) {
  return `<div style="max-width:640px; margin:auto; background-color:#07080C; color:#F8FAFC; font-family:system-ui, -apple-system, sans-serif; padding:40px; border-radius:24px; border:1px solid rgba(255,255,255,0.08); box-sizing:border-box;">
    
    <div style="text-align:center; margin-bottom:28px;">
      <span style="display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:9999px; background-color:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); color:#FCD34D; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">
        70th Jubilee • Platinum Celebration
      </span>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:20px; overflow:hidden;">
      <tr>
        <td style="padding:32px; vertical-align:middle; width:55%;">
          <span style="font-size:11px; font-family:monospace; text-transform:uppercase; letter-spacing:0.1em; color:#94A3B8; display:block; margin-bottom:6px;">
            Official Invitation
          </span>
          <h1 style="font-size:24px; font-weight:300; color:#FFFFFF; margin:0 0 12px 0; letter-spacing:-0.02em; line-height:1.2;">
            You are invited,<br/><strong style="font-weight:600; color:#FCD34D;">${esc(g.name)}</strong>
          </h1>
          <h2 style="font-size:14px; font-weight:400; color:#CBD5E1; margin:0 0 20px 0;">
            ${esc(e.celebrant)}'s 70th Birthday Jubilee
          </h2>
          
          <div style="font-size:13px; color:#94A3B8; line-height:1.6; border-top:1px solid rgba(255,255,255,0.06); padding-top:16px; margin-top:16px;">
            <strong style="color:#FFFFFF;">${esc(e.event_date)}</strong> at <strong style="color:#FFFFFF;">${esc(e.event_time)}</strong><br/>
            ${esc(e.venue)}<br/>
            <span style="font-size:12px; color:#64748B;">${esc(e.address)}</span>
          </div>
        </td>

        <td style="padding:24px; background:rgba(0,0,0,0.3); text-align:center; vertical-align:middle; width:45%; border-left:1px solid rgba(255,255,255,0.06);">
          <div style="background:#FFFFFF; padding:12px; border-radius:16px; display:inline-block; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <img src="cid:qr" width="160" height="160" alt="Your entry QR code" style="display:block; border-radius:8px;" />
          </div>
          <div style="font-size:10px; font-family:monospace; color:#64748B; margin-top:10px; text-transform:uppercase; letter-spacing:0.05em;">
            Single-Use Entry Code
          </div>
        </td>
      </tr>
    </table>

    <div style="text-align:center; margin-top:24px;">
      <p style="font-size:12px; color:#64748B; margin:0; line-height:1.5;">
        Show this QR code at the entrance. It works once, so please do not share it.
      </p>
      <div style="font-size:10px; font-family:monospace; color:#475569; margin-top:16px; text-transform:uppercase; letter-spacing:0.1em;">
        Event Management & Check-In System • v2.0
      </div>
    </div>

  </div>`;
}



export async function POST(req) {
  const s = await getStaff(req);
  if (s?.role !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: e } = await db.from('event').select('*').eq('id', 1).single();
  const { data: batch } = await db.from('guests').select('id,name,email').is('invited_at', null).not('email', 'is', null).limit(8);

  let sent = 0, failed = 0, detail = '';
  for (const g of batch) {
    try {
      await mailer.sendMail({
        from: `Birthday Invites <${process.env.GMAIL_USER}>`,
        to: g.email,
        subject: `You are invited to ${e.celebrant}'s birthday`,
        html: card(g, e),
        // attachments: [{ filename: 'qr.png', content: await QRCode.toBuffer(g.id, { width: 500, margin: 2 }), cid: 'qr' }],
        attachments: [{
          filename: 'qr.png',
          content: await QRCode.toBuffer(`${process.env.NEXT_PUBLIC_SITE_URL}/check/${g.id}`, { width: 500, margin: 2 }),
          cid: 'qr',
        }],
      });
      await db.from('guests').update({ invited_at: new Date().toISOString().slice(0, 10) }).eq('id', g.id);
      sent++;
    } catch (err) {
      failed++;
      detail = err.message;
    }
    await wait(300);
  }

  const { count } = await db.from('guests').select('id', { count: 'exact', head: true }).is('invited_at', null).not('email', 'is', null);
  return NextResponse.json({ sent, failed, remaining: count, detail });
}