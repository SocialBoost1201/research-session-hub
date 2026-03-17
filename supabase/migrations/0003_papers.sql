-- papers テーブル
-- current_submission_id の FK はこの時点では付けない（循環参照対策）
create table papers (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null check (trim(title) <> ''),
  abstract              text not null check (trim(abstract) <> ''),
  category              text not null,
  author_name           text not null check (trim(author_name) <> ''),
  affiliation           text not null check (trim(affiliation) <> ''),
  presenter_id          uuid not null references profiles(id) on delete restrict,
  current_submission_id uuid,  -- FK は 0008_foreign_keys_late.sql で追加
  visibility            text not null default 'private'
                          check (visibility in ('private', 'members_only', 'free_public')),
  status                text not null default 'draft'
                          check (status in (
                            'draft',
                            'submitted',
                            'revision_requested',
                            'resubmitted',
                            'scheduled',
                            'published_members_only',
                            'free_public',
                            'archived'
                          )),
  scheduled_publish_at  timestamptz,
  discussion_start_at   timestamptz,
  discussion_end_at     timestamptz,
  published_at          timestamptz,
  free_public_at        timestamptz,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- 議論期間の整合
  constraint discussion_period_check
    check (discussion_end_at is null or discussion_start_at is null
           or discussion_end_at > discussion_start_at)
);

comment on table papers is '研究発表論文本体';
comment on column papers.status is 'draft|submitted|revision_requested|resubmitted|scheduled|published_members_only|free_public|archived';
comment on column papers.current_submission_id is '現在の最新提出版（FK は 0008 で追加）';
