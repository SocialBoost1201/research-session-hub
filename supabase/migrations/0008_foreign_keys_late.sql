-- papers.current_submission_id に FK を後付けで追加
-- papers と submissions が両方揃った後にのみ安全に張れる
alter table papers
  add constraint papers_current_submission_id_fkey
  foreign key (current_submission_id)
  references submissions(id)
  on delete set null;

comment on constraint papers_current_submission_id_fkey on papers
  is '最新提出版への参照（循環参照対策で後付け）';
