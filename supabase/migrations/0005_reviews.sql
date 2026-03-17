-- reviews テーブル
-- 事務局による差し戻し・承認履歴
create table reviews (
  id            uuid primary key default gen_random_uuid(),
  paper_id      uuid not null references papers(id) on delete cascade,
  submission_id uuid not null references submissions(id) on delete cascade,
  reviewer_id   uuid not null references profiles(id) on delete restrict,
  review_type   text not null default 'revision_request'
                  check (review_type in ('revision_request', 'approval', 'schedule_set')),
  decision      text not null
                  check (decision in ('request_revision', 'approve', 'schedule')),
  comment       text,
  created_at    timestamptz not null default now()
);

comment on table reviews is '事務局によるレビュー・差し戻し履歴';
