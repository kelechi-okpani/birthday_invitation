create extension if not exists pgcrypto;

create table if not exists event (
                                     id int primary key default 1,
                                     celebrant text, event_date text, event_time text,
                                     venue text, address text, map_url text
);
insert into event (id, celebrant, event_date, event_time, venue, address)
values (1, 'Birthday celebrant', 'Date TBD', 'Time TBD', 'Venue TBD', 'Address TBD')
    on conflict do nothing;

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

alter table event enable row level security;
alter table guests enable row level security;
alter table staff enable row level security;