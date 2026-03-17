文書情報
文書名: SQLマイグレーション設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/09_database_design.md
- docs/10_er_diagram.md
- docs/11_supabase_design.md
- docs/12_storage_design.md
- docs/18_development_plan_3days.md

1. 本書の目的

本書は、Research Session Hub のMVPを Supabase 上に実装するために必要な SQL マイグレーションの構成、適用順序、DDL方針、制約方針、RLS適用順序、初期データ方針を定義することを目的とする。

本書は実際のSQLそのものではなく、SQLを安全に書くための設計書である。
目的は、次フェーズで migration ファイルを作成する際に、順序ミス、循環参照ミス、RLS適用順序ミス、current_submission_id 周りの事故を防ぐことにある。

2. マイグレーション設計方針

Research Session Hub の SQL マイグレーションは以下の方針で設計する。

・非破壊的に進める
・初回MVPでは create 中心に構成する
・循環参照は分割して後付けする
・ enum は MVPでは text と check 制約で実装してもよい
・ RLS はテーブル作成完了後に有効化する
・ trigger と function は後段で追加する
・ seed は migration と分離する
・本番適用前に Preview または開発環境で順番通りに検証する

3. マイグレーション全体構成

推奨する docs 以外の実装側構成イメージは以下とする。

supabase/
  migrations/
    0001_extensions.sql
    0002_profiles.sql
    0003_papers.sql
    0004_submissions.sql
    0005_reviews.sql
    0006_threads.sql
    0007_comments.sql
    0008_foreign_keys_late.sql
    0009_indexes.sql
    0010_triggers.sql
    0011_rls_enable.sql
    0012_rls_policies.sql
    0013_storage_setup.sql
  seed.sql

4. マイグレーションの適用順序

4-1. 第1段階

0001_extensions.sql

目的
・必要拡張を先に有効化する

対象
・pgcrypto など UUID 生成に必要な拡張

理由
・ gen_random_uuid() を以後のテーブルで利用するため

4-2. 第2段階

0002_profiles.sql

目的
・ auth.users に紐づく業務プロフィールを先に作る

理由
・以後のほぼ全テーブルが profiles を参照するため

4-3. 第3段階

0003_papers.sql

目的
・論文本体テーブルを作成する

注意
・ current_submission_id はこの時点では FK をまだ張らない
・ NULL 可の列として先に作る

理由
・ submissions がまだ存在しないため

4-4. 第4段階

0004_submissions.sql

目的
・提出版履歴を作成する

理由
・ papers への参照が必要
・ current_submission_id の参照先になるため

4-5. 第5段階

0005_reviews.sql

目的
・事務局確認履歴を作成する

理由
・ papers と submissions の両方が必要なため

4-6. 第6段階

0006_threads.sql

目的
・論文ごとの議論親スレッドを作成する

4-7. 第7段階

0007_comments.sql

目的
・スレッド配下のコメントを作成する

理由
・ threads と profiles と papers が必要なため

4-8. 第8段階

0008_foreign_keys_late.sql

目的
・循環参照や後付け制約を追加する

主対象
・ papers.current_submission_id -> submissions.id の FK

理由
・ papers と submissions が両方そろってからでないと安全に張れないため

4-9. 第9段階

0009_indexes.sql

目的
・一覧表示と管理画面運用に必要な index を追加する

4-10. 第10段階

0010_triggers.sql

目的
・ updated_at 自動更新などの trigger を追加する

4-11. 第11段階

0011_rls_enable.sql

目的
・対象テーブルで RLS を有効化する

4-12. 第12段階

0012_rls_policies.sql

目的
・各ロールのアクセスルールをポリシー化する

4-13. 第13段階

0013_storage_setup.sql

目的
・ Storage バケット関連の初期設定を行う

備考
・ Storage は SQL だけでなく Supabase UI 併用でも可
・ただし再現性の観点では SQL 化が望ましい

5. migration ファイル別設計

5-1. 0001_extensions.sql

目的
・必要拡張の有効化

想定内容
・create extension if not exists pgcrypto

注意点
・すでに有効でも失敗しない書き方にする

5-2. 0002_profiles.sql

目的
・ profiles テーブル作成

定義対象
・ id uuid primary key
・ role text not null default 'viewer'
・ display_name text not null
・ affiliation text null
・ created_at timestamptz not null default now()
・ updated_at timestamptz not null default now()

主制約
・ id は auth.users.id を参照
・ role は viewer presenter office の check 制約

後続前提
・ role index

注意点
・ auth.users を参照するため、 Supabase Auth 前提で動くこと
・ display_name を not null にするため、サインアップ後 profile 作成処理が必要

5-3. 0003_papers.sql

目的
・ papers テーブル作成

定義対象
・ id
・ title
・ abstract
・ category
・ author_name
・ affiliation
・ presenter_id
・ current_submission_id nullable
・ visibility
・ status
・ scheduled_publish_at
・ discussion_start_at
・ discussion_end_at
・ free_public_at
・ published_at
・ archived_at
・ created_at
・ updated_at

主制約
・ presenter_id -> profiles.id
・ status check
・ visibility check
・ discussion_end_at >= discussion_start_at を許容するか、より厳格に > とするか決定
MVPでは discussion_end_at >= discussion_start_at でもよいが、運用上は > が望ましい

注意点
・ current_submission_id の FK はここでは張らない
・ title abstract author_name affiliation は空文字禁止を check で入れてもよい

5-4. 0004_submissions.sql

目的
・ submissions テーブル作成

定義対象
・ id
・ paper_id
・ version_no
・ file_path
・ file_name
・ submitted_by
・ submission_note
・ office_feedback
・ status
・ created_at

主制約
・ paper_id -> papers.id
・ submitted_by -> profiles.id
・ paper_id と version_no の複合 unique
・ status check

注意点
・ file_path は not null
・ version_no は 1 以上の check を入れてよい

5-5. 0005_reviews.sql

目的
・ reviews テーブル作成

定義対象
・ id
・ paper_id
・ submission_id
・ reviewer_id
・ review_type
・ decision
・ comment
・ created_at

主制約
・ paper_id -> papers.id
・ submission_id -> submissions.id
・ reviewer_id -> profiles.id
・ review_type check
・ decision check

注意点
・ reviewer_id は office ロールに限定したいが、DB check では難しいため RLS またはアプリで担保する

5-6. 0006_threads.sql

目的
・ threads テーブル作成

定義対象
・ id
・ paper_id
・ status
・ opened_at
・ closed_at
・ visibility
・ created_at

主制約
・ paper_id -> papers.id
・ paper_id unique
・ status check
・ visibility check

注意点
・ 1論文1スレッドを unique で担保する

5-7. 0007_comments.sql

目的
・ comments テーブル作成

定義対象
・ id
・ thread_id
・ paper_id
・ user_id
・ parent_comment_id nullable
・ body
・ is_deleted
・ created_at
・ updated_at

主制約
・ thread_id -> threads.id
・ paper_id -> papers.id
・ user_id -> profiles.id
・ parent_comment_id -> comments.id
・ body 空文字禁止 check を入れてよい

注意点
・ parent_comment_id が同一 thread 内であることは SQL 単体では複雑になるため MVPではアプリ担保でよい

5-8. 0008_foreign_keys_late.sql

目的
・後付け FK を追加する

対象
・ papers.current_submission_id -> submissions.id

追加推奨チェック
・ current_submission_id が、その paper に属する submission であることは厳密には cross-table check が必要で難しい
・ MVPではアプリ側で担保する

注意点
・ここで初めて current_submission_id を外部キー化する
・既存データ整合が崩れていると失敗するため、初期段階では空のDBに適用する

5-9. 0009_indexes.sql

目的
・性能と一覧性を確保する

追加対象
profiles
・ role

papers
・ presenter_id
・ status
・ visibility
・ scheduled_publish_at
・ published_at
・ category

submissions
・ paper_id
・ created_at desc
・ submitted_by

reviews
・ paper_id
・ submission_id
・ reviewer_id
・ created_at desc

threads
・ paper_id unique
・ status

comments
・ thread_id
・ paper_id
・ user_id
・ created_at

5-10. 0010_triggers.sql

目的
・ updated_at 自動更新

推奨 function
・ set_updated_at()

対象テーブル
・ profiles
・ papers
・ comments

任意対象
・ submissions は created_at のみでもよい
・ reviews は履歴テーブルなので updated_at 不要
・ threads は MVPでは created_at のみでも可

5-11. 0011_rls_enable.sql

目的
・ RLS を有効化する

対象テーブル
・ profiles
・ papers
・ submissions
・ reviews
・ threads
・ comments

方針
・ enable row level security を各テーブルに適用
・ policy はまだ作成しない

5-12. 0012_rls_policies.sql

目的
・具体的なポリシーを定義する

ポリシー対象の考え方
profiles
・本人 read
・本人 limited update
・office read all
・office role update

papers
・office all
・presenter own create
・presenter own read
・presenter own limited update
・logged-in users read published_members_only and free_public

submissions
・office read all
・presenter own paper read
・presenter own paper insert

reviews
・office insert
・office read all
・presenter own paper read limited をどう扱うか決める

threads
・office manage
・閲覧権限を持つユーザー read

comments
・閲覧権限を持つユーザー read
・discussion open のとき logged-in user insert
・office delete logical update

注意点
・ policy を一気に厳しくしすぎると開発が止まりやすい
・ MVPではまず最低限通すポリシーから始め、後で締める

5-13. 0013_storage_setup.sql

目的
・ Storage 用初期設定

対象
・ paper-files バケット作成
・ private 設定
・必要ならアップロード、参照の基本方針設定

注意点
・ Storage ポリシーは Supabase の仕様に沿って慎重に設定する
・ MVPでは signed URL 発行をアプリ側で行う前提なので、直接公開ポリシーは緩めない

6. 制約設計ポリシー

6-1. check 制約で持つもの

profiles.role
papers.status
papers.visibility
submissions.status
reviews.review_type
reviews.decision
threads.status
threads.visibility

6-2. unique 制約で持つもの

submissions.paper_id + version_no
threads.paper_id

6-3. FK 制約で持つもの

基本方針
・ owner、親子関係、履歴関係は積極的に FK で守る
・循環参照だけ後付け

6-4. DBで持たずアプリで担保するもの

・ papers.current_submission_id が本当に同一 paper の submission であること
・ comments.parent_comment_id が同一 thread 内コメントであること
・ reviewer_id が office ロールであること
・ discussion_start_at と published 状態の高度整合

7. enum 採用可否方針

7-1. MVP推奨

text + check 制約

理由
・変更しやすい
・ migration が軽い
・ enum 変更時の手間を減らせる

7-2. enum を採用する場合の注意点

・後から値追加は管理が必要
・削除や変更がやや重い
・MVPでは過剰になりやすい

最終判断
・MVP初期は text + check を推奨する

8. trigger 設計方針

8-1. updated_at trigger

目的
・更新時刻の自動反映

対象
・ profiles
・ papers
・ comments

8-2. profile 自動生成 trigger

候補
・ auth.users insert 後に profiles 作成

MVP判断
・アプリ側で profiles 作成でも十分
・ trigger は便利だがデバッグが難しくなる
・最速重視ならアプリ側作成を推奨

9. seed 設計方針

9-1. seed と migration を分離する理由

・ migration は構造
・ seed はデータ
責務を分けるため

9-2. seed で入れる候補

・ office ユーザーに対応する profiles 更新
・ presenter テストデータ
・ sample papers
・ sample submissions
・ sample reviews
・ sample threads
・ sample comments

9-3. 注意点

・ auth.users は通常 seed SQL だけでは完結しづらい
・実ユーザー作成後に profiles を更新する運用でもよい
・ seed は本番では原則使わず、開発、検証限定で使う

10. migration 実装時の注意点

10-1. current_submission_id の循環参照

危険ポイント
・ papers と submissions の相互依存

対策
・ papers 作成時は current_submission_id nullable のみ
・ submissions 作成後に FK を追加する

10-2. RLS の早すぎる適用

危険ポイント
・ insert すら通らなくなる

対策
・まずテーブルと制約を作る
・ seed や初期確認後に RLS を有効化する
・または service role 経由の初期登録手順を用意する

10-3. Storage と SQL の責務混同

危険ポイント
・ DB file_path と Storage 実体の不整合

対策
・アップロードAPIの中でのみ file_path を決める
・手作業で file_path を更新しない

10-4. check 制約の厳しすぎ問題

危険ポイント
・開発中に些細な変更で migration が詰まる

対策
・MVPでは本当に必要な check に絞る
・厳格すぎる業務制約はアプリ側へ逃がす

11. ロールバック方針

11-1. MVP方針

・基本は開発環境で検証してから適用する
・本番で down migration 前提にはしない
・壊れたら restore より追加 migration で修正する方針を優先する

11-2. 理由

・ Supabase 上で破壊的 rollback はリスクが高い
・MVP初期は create 系中心なので、直しは追加 migration で十分対応可能

12. migration 命名方針

推奨
・時系列番号 + 役割名

例
0001_extensions.sql
0002_profiles.sql
0003_papers.sql

理由
・順序が明確
・レビューしやすい
・差分管理しやすい

13. SQLレビュー観点

実装前レビューで必ず見る項目

・ create 順序が正しいか
・ FK 後付け順が正しいか
・ current_submission_id の扱いが安全か
・ unique 制約が過不足ないか
・ check 制約が厳しすぎないか
・ RLS が開発不能レベルに厳しくないか
・ Storage バケット方針と矛盾していないか
・ seed と migration が混在していないか

14. 推奨する実装順の最終整理

1 拡張
2 profiles
3 papers
4 submissions
5 reviews
6 threads
7 comments
8 後付け FK
9 index
10 trigger
11 RLS enable
12 RLS policies
13 Storage setup
14 seed 開発用のみ

15. 実装後の確認項目

・ migration が先頭から最後まで通る
・テーブルが全作成される
・ FK が正しく張られる
・ current_submission_id の FK が通る
・ index が作成される
・ updated_at trigger が動く
・ RLS 有効化後も想定ユーザーで処理が通る
・ Storage バケットが private で存在する
・ presenter が自分の投稿を insert できる
・ office が管理系 read update できる

16. 本書の次アクション

本書の次に作るべきものは以下のどちらかである。

候補1
supabase/migrations 用の実SQL

候補2
Next.js ディレクトリ設計確定版

実務優先なら、次は実SQLへ落とし込むのが最短である

17. 最終判断

Research Session Hub のMVPにおける SQL マイグレーションは、循環参照と RLS 事故を避けるため、段階分割で適用する設計を採用する。

本書の最終方針は以下とする。

・ migration は小さく分ける
・ current_submission_id は後付け FK にする
・ enum ではなく text + check を基本とする
・ RLS は最後に有効化する
・ seed は migration と分離する
・本番前に順番通りの適用確認を必ず行う
