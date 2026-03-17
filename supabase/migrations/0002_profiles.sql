-- profiles テーブル
-- auth.users に紐づく業務プロフィール
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'viewer'
                check (role in ('viewer', 'presenter', 'office')),
  display_name text not null,
  affiliation  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table profiles is '会員プロフィール（auth.users に 1:1 で紐づく）';
comment on column profiles.role is 'viewer | presenter | office';
