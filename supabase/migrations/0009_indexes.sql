-- 一覧表示・絞り込み・管理画面運用に必要な index を追加

-- profiles
create index idx_profiles_role on profiles(role);

-- papers
create index idx_papers_presenter_id   on papers(presenter_id);
create index idx_papers_status         on papers(status);
create index idx_papers_visibility     on papers(visibility);
create index idx_papers_category       on papers(category);
create index idx_papers_scheduled_at   on papers(scheduled_publish_at);
create index idx_papers_published_at   on papers(published_at);

-- submissions
create index idx_submissions_paper_id     on submissions(paper_id);
create index idx_submissions_submitted_by on submissions(submitted_by);
create index idx_submissions_created_at   on submissions(created_at desc);

-- reviews
create index idx_reviews_paper_id      on reviews(paper_id);
create index idx_reviews_submission_id on reviews(submission_id);
create index idx_reviews_reviewer_id   on reviews(reviewer_id);
create index idx_reviews_created_at    on reviews(created_at desc);

-- threads（paper_id は unique 制約済みで index 相当）
create index idx_threads_status on threads(status);

-- comments
create index idx_comments_thread_id  on comments(thread_id);
create index idx_comments_paper_id   on comments(paper_id);
create index idx_comments_user_id    on comments(user_id);
create index idx_comments_created_at on comments(created_at);
