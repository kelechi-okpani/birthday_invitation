# Birthday QR check-in

Guests get an invitation card by email with their own QR code. Only staff and admins scan, at the venue.

## Setup
1. Create a free project at supabase.com. In SQL Editor, run `supabase/schema.sql`.
2. In Authentication > Users, add a user for yourself and one for each door staff member.
3. Add each of them to the staff table (commented lines at the end of schema.sql). Use role `admin` for yourself.
4. Create a free account at resend.com, verify your sending domain, and create an API key.
5. Copy `.env.local.example` to `.env.local` and fill in all values. Keep the secret key and Resend key private.
6. Run `npm install`, then `npm run dev`, and open http://localhost:3000.
7. In Supabase Table Editor > event, enter the celebrant's name, date, time, and venue.

## Use
- /admin: import guests, set RSVP status, and email everyone their invitation card.
- /login then /scan: door staff scan the QR codes.
- `npm run qr`: optional, saves every QR code as an image in ./qr-codes.

## Deploy
Push to GitHub, import the repo into Vercel, and add the five environment variables.
