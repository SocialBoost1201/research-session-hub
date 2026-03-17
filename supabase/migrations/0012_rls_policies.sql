-- ============================================================
-- RLS ポリシー設定
-- MVP では開発を止めないよう、まず最低限のポリシーから始める
-- ============================================================

-- --------------------------------------------------------
-- profiles
-- --------------------------------------------------------

-- 本人は自分のプロフィールを読める
create policy "profiles: 本人 select"
  on profiles for select
  using (auth.uid() = id);

-- office は全員のプロフィールを読める
create policy "profiles: office select all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'office'
    )
  );

-- 本人は自分のプロフィールを更新できる（role 変更は除く）
create policy "profiles: 本人 update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 新規登録時（サインアップ後）に本人が insert できる
create policy "profiles: 本人 insert"
  on profiles for insert
  with check (auth.uid() = id);

-- --------------------------------------------------------
-- papers
-- --------------------------------------------------------

-- office は全 paper を操作できる
create policy "papers: office all"
  on papers for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'office'
    )
  );

-- presenter は自分の paper を read/insert できる
create policy "papers: presenter select own"
  on papers for select
  using (presenter_id = auth.uid());

create policy "papers: presenter insert"
  on papers for insert
  with check (
    presenter_id = auth.uid()
    and exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'presenter'
    )
  );

create policy "papers: presenter update own draft"
  on papers for update
  using (presenter_id = auth.uid())
  with check (presenter_id = auth.uid());

-- ログイン済みユーザーは公開論文を読める
create policy "papers: logged-in select published"
  on papers for select
  using (
    auth.uid() is not null
    and status in ('published_members_only', 'free_public')
  );

-- --------------------------------------------------------
-- submissions
-- --------------------------------------------------------

-- office は全 submission を読める
create policy "submissions: office select all"
  on submissions for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'office'
    )
  );

-- presenter は自分の paper の submission を読める
create policy "submissions: presenter select own paper"
  on submissions for select
  using (
    exists (
      select 1 from papers pa
      where pa.id = paper_id and pa.presenter_id = auth.uid()
    )
  );

-- presenter は自分の paper への submission を insert できる
create policy "submissions: presenter insert"
  on submissions for insert
  with check (
    submitted_by = auth.uid()
    and exists (
      select 1 from papers pa
      where pa.id = paper_id and pa.presenter_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- reviews
-- --------------------------------------------------------

-- office は全 review を操作できる
create policy "reviews: office all"
  on reviews for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'office'
    )
  );

-- presenter は自分の paper の review を読める
create policy "reviews: presenter select own paper"
  on reviews for select
  using (
    exists (
      select 1 from papers pa
      where pa.id = paper_id and pa.presenter_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- threads
-- --------------------------------------------------------

-- office は全 thread を操作できる
create policy "threads: office all"
  on threads for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'office'
    )
  );

-- ログイン済みユーザーは公開中スレッドを読める
create policy "threads: logged-in select published"
  on threads for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from papers pa
      where pa.id = paper_id
        and pa.status in ('published_members_only', 'free_public')
    )
  );

-- --------------------------------------------------------
-- comments
-- --------------------------------------------------------

-- office は全 comment を操作できる（削除含む）
create policy "comments: office all"
  on comments for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'office'
    )
  );

-- ログイン済みユーザーは公開中スレッドのコメントを読める
create policy "comments: logged-in select published"
  on comments for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from papers pa
      where pa.id = paper_id
        and pa.status in ('published_members_only', 'free_public')
    )
  );

-- ログイン済みユーザーはコメントを insert できる（議論期間チェックはアプリ側）
create policy "comments: logged-in insert"
  on comments for insert
  with check (
    user_id = auth.uid()
    and auth.uid() is not null
  );
