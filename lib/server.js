import { createClient } from '@supabase/supabase-js';

export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);


// Returns { role } for a logged-in staff or admin account, otherwise null.
export async function getStaff(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  const email = data?.user?.email;
  if (!email) return null;
  const { data: s } = await db.from('staff').select('role').eq('email', email).single();
  return s || null;
}
