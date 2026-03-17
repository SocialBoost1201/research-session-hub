-- comments テーブル
-- スレッド配下のコメント
create table comments (
  id                uuid primary key default gen_random_uuid(),
  thread_id         uuid not null references threads(id) on delete cascade,
  paper_id          uuid not null references papers(id) on delete cascade,
  user_id           uuid not null references profiles(id) on delete restrict,
  parent_comment_id uuid references comments(id) on delete set null,
  body              text not null check (trim(body) <> ''),
  is_deleted        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table comments is 'コメント投稿（論理削除対応）';
