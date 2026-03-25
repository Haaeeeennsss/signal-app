-- ============================================================
-- SIGNAL APP — Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================


-- ============================================================
-- TABLES
-- ============================================================

-- Squads: one squad per group of friends
create table if not exists squads (
  id               uuid    default gen_random_uuid() primary key,
  name             text    not null,
  invite_code      text    unique not null,
  hp               integer not null default 100,
  streak           integer not null default 0,
  last_streak_date date,   -- tracks which day the streak was last incremented
  created_at       timestamptz default now(),
  constraint hp_range check (hp >= 0 and hp <= 100)
);

-- Squad Members: each user belongs to one squad
create table if not exists squad_members (
  id                uuid    default gen_random_uuid() primary key,
  squad_id          uuid    references squads(id) on delete cascade not null,
  user_id           uuid    references auth.users(id) on delete cascade not null,
  display_name      text    not null,
  screen_time_goal  integer not null default 120, -- in minutes per day
  joined_at         timestamptz default now(),
  unique(squad_id, user_id),
  unique(user_id)  -- one squad per user for MVP
);

-- Check-ins: daily record of hit or missed
create table if not exists check_ins (
  id              uuid  default gen_random_uuid() primary key,
  squad_id        uuid  references squads(id) on delete cascade not null,
  user_id         uuid  references auth.users(id) on delete cascade not null,
  check_in_date   date  not null default current_date,
  status          text  not null,
  created_at      timestamptz default now(),
  unique(squad_id, user_id, check_in_date),
  constraint status_check check (status in ('hit', 'missed'))
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table squads        enable row level security;
alter table squad_members enable row level security;
alter table check_ins     enable row level security;

create policy "squads_select" on squads
  for select to authenticated using (true);

create policy "squads_insert" on squads
  for insert to authenticated with check (true);

create policy "squads_update" on squads
  for update to authenticated using (
    exists (
      select 1 from squad_members
      where squad_id = squads.id and user_id = auth.uid()
    )
  );

create policy "squad_members_select" on squad_members
  for select to authenticated using (true);

create policy "squad_members_insert" on squad_members
  for insert to authenticated with check (user_id = auth.uid());

create policy "check_ins_select" on check_ins
  for select to authenticated using (
    exists (
      select 1 from squad_members
      where squad_id = check_ins.squad_id and user_id = auth.uid()
    )
  );

create policy "check_ins_insert" on check_ins
  for insert to authenticated with check (user_id = auth.uid());


-- ============================================================
-- REALTIME
-- ============================================================

alter publication supabase_realtime add table squads;
alter publication supabase_realtime add table check_ins;
