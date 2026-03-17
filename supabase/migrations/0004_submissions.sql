-- submissions テーブル
-- 提出版の履歴管理
create table submissions (
  id               uuid primary key default gen_random_uuid(),
  paper_id         uuid not null references papers(id) on delete cascade,
  version_no       integer not null check (version_no >= 1),
  file_path        text not null,
  file_name        text not null,
  submitted_by     uuid not null references profiles(id) on delete restrict,
  submission_note  text,
  office_feedback  text,
  status           text not null default 'pending'
                     check (status in ('pending', 'approved', 'rejected')),
  created_at       timestamptz not null default now(),

  -- 1論文につき version_no が一意
  constraint submissions_paper_version_unique unique (paper_id, version_no)
);

comment on table submissions is '原稿提出履歴（バージョン管理）';
