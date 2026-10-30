-- Run in Supabase: SQL Editor > New query > Run
create extension if not exists pgcrypto;

create table if not exists event (
                                     id int primary key default 1,
                                     celebrant text, event_date text, event_time text,
                                     venue text, address text, map_url text
);

-- Party details shown on every invitation card.
-- Replace the values below with the real ones before running.
-- Running this again later updates the row instead of keeping the old one.
insert into event (id, celebrant, event_date, event_time, venue, address)
values (1, 'Celebrant Name', 'Date TBD', 'Time TBD', 'Venue TBD', 'Address TBD')
    on conflict (id) do update set
    celebrant = excluded.celebrant,
                            event_date = excluded.event_date,
                            event_time = excluded.event_time,
                            venue = excluded.venue,
                            address = excluded.address;

create table if not exists guests (
                                      id uuid primary key default gen_random_uuid(),
    name text not null,
    email text, phone text,
    seats int default 1,
    invited_at date,
    rsvp text default 'pending' check (rsvp in ('pending','confirmed','declined')),
    confirmed_at timestamptz,
    checked_in_at timestamptz
    );

create table if not exists staff (
                                     email text primary key,
                                     role text default 'staff' check (role in ('staff','admin'))
    );

-- No public policies: only the server (secret key) can read or write.
alter table event enable row level security;
alter table guests enable row level security;
alter table staff enable row level security;

-- After creating users in Authentication > Users, add them here:
-- insert into staff (email, role) values ('you@example.com', 'admin');
-- insert into staff (email, role) values ('door1@example.com', 'staff');