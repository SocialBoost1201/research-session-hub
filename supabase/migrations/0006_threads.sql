-- threads テーブル
-- 論文ごとの議論スレッド（1論文1スレッド）
create table threads (
  id         uuid primary key default gen_random_uuid(),
  paper_id   uuid not null references papers(id) on delete cascade,
  status     text not null default 'open'
               check (status in ('open', 'closed')),
  opened_at  timestamptz not null default now(),
  closed_at  timestamptz,
  visibility text not null default 'members_only'
               check (visibility in ('members_only', 'free_public')),
  created_at timestamptz not null default now(),

  -- 1論文に1スレッドのみ
  constraint threads_paper_unique unique (paper_id)
);

comment on table threads is '論文ごとの議論スレッド（1:1）';
