文書情報
文書名: データベース設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/01_requirements.md
- docs/06_function_list.md
- docs/07_role_permission.md
- docs/08_status_transition.md

1. 本書の目的

本書は、Research Session Hub のMVPに必要なデータ構造を定義し、投稿、再提出、公開、議論、権限制御を支えるテーブル設計を明確化することを目的とする。

本MVPでは、以下を成立させることが重要である。

・会員登録済みユーザーのロール管理
・研究発表エントリーの作成
・PDF原稿の版管理
・事務局による差し戻しと公開管理
・論文ごとの議論スレッド
・コメント投稿
・会員限定公開と後日の一般公開切替

そのため、本設計では Supabase Auth を前提にしつつ、業務データは Postgres テーブルで管理する。

2. 設計方針

Research Session Hub のDB設計は以下の方針で行う。

・Supabase Auth の auth.users を認証の基盤とする
・業務用ユーザー情報は profiles テーブルで保持する
・論文本体の管理と提出版管理を分離する
・投稿ワークフロー状態は papers テーブルで一元管理する
・原稿の版管理は submissions テーブルで行う
・事務局確認履歴は reviews テーブルで管理する
・議論機能は threads と comments で分離管理する
・MVPで必要十分な構造に抑えつつ、将来拡張余地を残す
・RLS適用を前提に owner や role の判定がしやすい構造にする
・削除は原則として物理削除より論理運用を優先する

3. テーブル一覧

本MVPで採用する主要テーブルは以下とする。

・profiles
・papers
・submissions
・reviews
・threads
・comments

補助的に利用するもの
・auth.users Supabase標準
・storage.objects Supabase標準

4. 全体構造概要

4-1. 概要

1人のユーザーは1つの profiles を持つ
1人の presenter は複数の papers を持てる
1つの paper は複数の submissions を持てる
1つの paper は複数の reviews を持てる
1つの paper は原則1つの thread を持つ
1つの thread は複数の comments を持つ

4-2. 主従関係

ユーザー
↓
papers
↓
submissions
↓
reviews

papers
↓
threads
↓
comments

5. 列挙値定義

5-1. user_role

値
・viewer
・presenter
・office

用途
profiles.role で使用する

5-2. paper_status

値
・draft
・submitted
・revision_requested
・resubmitted
・scheduled
・published_members_only
・free_public
・archived

用途
papers.status で使用する

5-3. paper_visibility

値
・members_only
・free_public

用途
papers.visibility で使用する

補足
status と visibility は似ているが、役割が異なる
status は運用状態
visibility は公開範囲
MVPでは両者を整合させる前提で管理する

5-4. submission_status

値
・submitted
・revision_requested
・accepted_for_publish
・resubmitted

用途
submissions.status で使用する

補足
MVPでは papers.status を主状態として扱う
submissions.status は版ごとの文脈管理に用いる

5-5. review_type

値
・office_check
・editorial_note

用途
reviews.review_type で使用する

5-6. review_decision

値
・pass
・revision_required
・hold

用途
reviews.decision で使用する

5-7. thread_status

値
・open
・closed

用途
threads.status で使用する

5-8. thread_visibility

値
・members_only
・free_public

用途
threads.visibility で使用する

6. テーブル詳細

6-1. profiles

目的
認証済みユーザーの業務プロフィール情報とロールを管理する

対応ロール
・viewer
・presenter
・office

主な用途
・画面出し分け
・権限制御
・表示名や所属の参照

カラム一覧

id
・型 uuid
・PK
・auth.users.id と一致
・NOT NULL

role
・型 text または enum
・NOT NULL
・初期値 viewer

display_name
・型 text
・NOT NULL

affiliation
・型 text
・NULL 可

created_at
・型 timestamptz
・NOT NULL
・default now()

updated_at
・型 timestamptz
・NOT NULL
・default now()

制約
・role は viewer presenter office のみ許可
・id は auth.users.id を参照

インデックス
・PK on id
・index on role

備考
メールアドレスは auth.users で保持するため、profiles では必須管理しない
将来、avatar_url や bio を追加可能

6-2. papers

目的
研究発表エントリーの主レコードを管理する
投稿状態、公開状態、公開日、議論期間などの全体制御を担う

主な用途
・投稿一覧
・公開一覧
・管理画面
・状態遷移の中心

カラム一覧

id
・型 uuid
・PK
・NOT NULL
・default gen_random_uuid()

title
・型 text
・NOT NULL

abstract
・型 text
・NOT NULL

category
・型 text
・NOT NULL

author_name
・型 text
・NOT NULL

affiliation
・型 text
・NOT NULL

presenter_id
・型 uuid
・FK to profiles.id
・NOT NULL

current_submission_id
・型 uuid
・FK to submissions.id
・NULL 可
・最新提出版を指す

visibility
・型 text または enum
・NOT NULL
・default members_only

status
・型 text または enum
・NOT NULL
・default draft

scheduled_publish_at
・型 timestamptz
・NULL 可

discussion_start_at
・型 timestamptz
・NULL 可

discussion_end_at
・型 timestamptz
・NULL 可

free_public_at
・型 timestamptz
・NULL 可

published_at
・型 timestamptz
・NULL 可

archived_at
・型 timestamptz
・NULL 可

created_at
・型 timestamptz
・NOT NULL
・default now()

updated_at
・型 timestamptz
・NOT NULL
・default now()

制約
・status は定義済み値のみ許可
・visibility は members_only または free_public のみ許可
・discussion_end_at は discussion_start_at より後
・presenter_id 必須
・title は空文字不可が望ましい
・abstract は空文字不可が望ましい

インデックス
・PK on id
・index on presenter_id
・index on status
・index on visibility
・index on scheduled_publish_at
・index on published_at
・index on category

備考
co-author はMVPでは持たない
将来 authors テーブルに分離可能

6-3. submissions

目的
論文の提出版を管理する
初回提出と再提出の履歴を保持する

主な用途
・版管理
・提出履歴表示
・原稿ファイル参照
・current_submission_id の参照先

カラム一覧

id
・型 uuid
・PK
・NOT NULL
・default gen_random_uuid()

paper_id
・型 uuid
・FK to papers.id
・NOT NULL

version_no
・型 integer
・NOT NULL

file_path
・型 text
・NOT NULL

file_name
・型 text
・NOT NULL

submitted_by
・型 uuid
・FK to profiles.id
・NOT NULL

submission_note
・型 text
・NULL 可

office_feedback
・型 text
・NULL 可

status
・型 text または enum
・NOT NULL
・default submitted

created_at
・型 timestamptz
・NOT NULL
・default now()

制約
・paper_id と version_no の組み合わせは一意
・file_path 必須
・submitted_by 必須
・status は定義済み値のみ許可

インデックス
・PK on id
・unique index on paper_id, version_no
・index on paper_id
・index on submitted_by
・index on created_at desc

備考
事務局の差し戻しコメントは reviews に持たせるのが本筋だが、MVPでは submission 単位で直近コメント参照しやすくするため office_feedback を持たせてもよい
ただし履歴性の中心は reviews とする

6-4. reviews

目的
事務局による確認履歴、差し戻し履歴、判断メモを管理する

主な用途
・差し戻し理由の履歴管理
・投稿詳細での事務局コメント表示
・監査ログ補助

カラム一覧

id
・型 uuid
・PK
・NOT NULL
・default gen_random_uuid()

paper_id
・型 uuid
・FK to papers.id
・NOT NULL

submission_id
・型 uuid
・FK to submissions.id
・NOT NULL

reviewer_id
・型 uuid
・FK to profiles.id
・NOT NULL

review_type
・型 text または enum
・NOT NULL
・default office_check

decision
・型 text または enum
・NOT NULL

comment
・型 text
・NULL 可

created_at
・型 timestamptz
・NOT NULL
・default now()

制約
・review_type は office_check editorial_note のみ許可
・decision は pass revision_required hold のみ許可

インデックス
・PK on id
・index on paper_id
・index on submission_id
・index on reviewer_id
・index on created_at desc

備考
MVPでは reviewer は office ロールのみ
将来 reviewer ロール追加時にも流用可能

6-5. threads

目的
論文ごとの議論スレッドの親情報を管理する

主な用途
・スレッド開閉
・議論可否判定補助
・コメント一覧の親キー

カラム一覧

id
・型 uuid
・PK
・NOT NULL
・default gen_random_uuid()

paper_id
・型 uuid
・FK to papers.id
・NOT NULL
・UNIQUE

status
・型 text または enum
・NOT NULL
・default open

opened_at
・型 timestamptz
・NULL 可

closed_at
・型 timestamptz
・NULL 可

visibility
・型 text または enum
・NOT NULL
・default members_only

created_at
・型 timestamptz
・NOT NULL
・default now()

制約
・paper_id は一意
・status は open closed のみ許可
・visibility は members_only free_public のみ許可

インデックス
・PK on id
・unique index on paper_id
・index on status

備考
MVPでは paper ごとに1 thread を基本とする
discussion_start_at と discussion_end_at の実体は papers に持ち、threads は開閉状態の補助管理に留める

6-6. comments

目的
論文スレッドに対するコメント本文を管理する

主な用途
・議論表示
・コメント投稿
・管理削除

カラム一覧

id
・型 uuid
・PK
・NOT NULL
・default gen_random_uuid()

thread_id
・型 uuid
・FK to threads.id
・NOT NULL

paper_id
・型 uuid
・FK to papers.id
・NOT NULL

user_id
・型 uuid
・FK to profiles.id
・NOT NULL

parent_comment_id
・型 uuid
・FK to comments.id
・NULL 可

body
・型 text
・NOT NULL

is_deleted
・型 boolean
・NOT NULL
・default false

created_at
・型 timestamptz
・NOT NULL
・default now()

updated_at
・型 timestamptz
・NOT NULL
・default now()

制約
・body は空文字不可が望ましい
・parent_comment_id は同一 thread 内コメントであることが望ましい
  MVPではアプリ側制御でも可

インデックス
・PK on id
・index on thread_id
・index on paper_id
・index on user_id
・index on parent_comment_id
・index on created_at

備考
MVPでは返信機能を必須にしないため、parent_comment_id は NULL 前提運用でもよい
将来 reply を有効にする拡張余地として保持する

7. リレーション設計

7-1. profiles と papers

関係
・1対多

内容
・1人の presenter が複数の papers を作成できる

参照
papers.presenter_id → profiles.id

7-2. papers と submissions

関係
・1対多

内容
・1つの paper に対して複数の提出版が存在する

参照
submissions.paper_id → papers.id

7-3. papers と current_submission_id

関係
・1対1参照 近い運用

内容
・papers.current_submission_id が最新提出版を指す

参照
papers.current_submission_id → submissions.id

注意
循環参照になるため、migration 順序には注意する
先に papers.current_submission_id を NULL 可で作成し、後から FK 追加でもよい

7-4. submissions と reviews

関係
・1対多

内容
・1つの提出版に対して、複数の事務局確認メモが紐づく可能性がある

参照
reviews.submission_id → submissions.id

7-5. papers と threads

関係
・1対1

内容
・1論文に対して1スレッドを基本とする

参照
threads.paper_id → papers.id

7-6. threads と comments

関係
・1対多

内容
・1スレッドに複数コメントが存在する

参照
comments.thread_id → threads.id

8. ER構造の文章表現

profiles
  1
  ↓
  many
papers
  1
  ↓
  many
submissions
  1
  ↓
  many
reviews

papers
  1
  ↓
  1
threads
  1
  ↓
  many
comments

profiles
  1
  ↓
  many
comments

9. 主キー、外部キー一覧

9-1. 主キー

profiles.id
papers.id
submissions.id
reviews.id
threads.id
comments.id

9-2. 外部キー

papers.presenter_id → profiles.id
papers.current_submission_id → submissions.id
submissions.paper_id → papers.id
submissions.submitted_by → profiles.id
reviews.paper_id → papers.id
reviews.submission_id → submissions.id
reviews.reviewer_id → profiles.id
threads.paper_id → papers.id
comments.thread_id → threads.id
comments.paper_id → papers.id
comments.user_id → profiles.id
comments.parent_comment_id → comments.id

10. 一意制約

profiles
・id unique PK

papers
・id unique PK

submissions
・id unique PK
・paper_id + version_no unique

threads
・paper_id unique

必要に応じて将来追加可能
・papers.presenter_id + title の一意性は採用しない
  同名発表の可能性があるため

11. 監査、履歴方針

11-1. 提出履歴

submissions に全版を残す
過去版を上書きしない

11-2. 差し戻し履歴

reviews に全履歴を残す
修正指示の履歴を消さない

11-3. コメント削除

comments.is_deleted を使う論理削除を基本とする
MVPでは本文を空にするか、非表示文言に置き換える運用も可

11-4. 更新日時

profiles
papers
comments
は updated_at を持つ

必要に応じて trigger で自動更新する

12. 正規化方針

MVPとしては第3正規形を意識しつつ、運用上必要な冗長性は限定的に許容する

許容する冗長性
・papers に author_name と affiliation を保持
・comments に paper_id を保持
  thread 経由でも取れるが検索性のため許容
・submissions に office_feedback を保持する場合がある
  直近参照のしやすさを優先

将来的に分離可能なもの
・authors テーブル
・paper_publications テーブル
・notifications テーブル
・audit_logs テーブル

13. バリデーション前提

13-1. papers

・title 必須
・abstract 必須
・category 必須
・author_name 必須
・affiliation 必須
・status は定義済み値のみ
・discussion_end_at > discussion_start_at
・free_public_at は published 後のみ設定が望ましい

13.2 submissions

・file_path 必須
・file_name 必須
・version_no は 1 以上
・paper_id ごとに version_no 一意

13-3. comments

・body 必須
・議論期間外は insert 不可 アプリ側およびRLS側で制御余地
・paper_id と thread_id の整合を保つ

14. 削除方針

MVPでは原則として物理削除を避ける

profiles
・削除しない前提
・必要なら無効化運用を将来追加

papers
・基本は物理削除しない
・archived 運用で代替

submissions
・削除しない
・履歴保持

reviews
・削除しない
・監査的意味を持つ

threads
・削除しない
・close 状態で運用

comments
・is_deleted により論理削除

15. インデックス方針

MVPで最低限必要なインデックス

profiles
・role

papers
・presenter_id
・status
・visibility
・scheduled_publish_at
・published_at
・category

submissions
・paper_id
・paper_id, version_no unique
・created_at

reviews
・paper_id
・submission_id
・created_at

threads
・paper_id unique
・status

comments
・thread_id
・paper_id
・user_id
・created_at

理由
・自分の投稿一覧表示
・事務局一覧表示
・公開一覧表示
・コメント一覧表示
の性能を確保するため

16. 初期データ方針

初期状態
・auth.users にユーザー作成
・profiles に対応レコード作成
・初期ロールは viewer
・事務局ユーザーは手動で office に変更

テストデータ例
・presenter 1名
・office 1名
・viewer 1名
・paper 数件
・submission 数件
・review 数件
・thread 数件
・comment 数件

17. Supabase前提事項

17-1. Auth連携

profiles.id は auth.users.id に一致させる
サインアップ後に profiles を作成する仕組みが必要

17-2. Storage連携

submissions.file_path は storage の保存パスを持つ
例
papers/{paperId}/v{versionNo}/filename.pdf

17-3. RLS連携

profiles
・本人参照、本人一部更新
・office 全件参照

papers
・presenter は自分の paper を管理
・office 全件参照更新
・viewer は公開済みのみ参照

submissions
・presenter は自分の paper 分のみ参照作成
・office 全件参照

comments
・ログイン済み投稿可
・office 削除可

詳細は docs/11_supabase_design.md で定義する

18. 将来拡張余地

将来追加し得るテーブル
・authors
・paper_authors
・paper_publications
・notifications
・audit_logs
・review_assignments
・events
・paper_tags
・favorites

将来追加し得るカラム
papers
・slug
・keywords
・language
・event_id

profiles
・avatar_url
・bio

comments
・edited_at
・moderation_reason

19. SQL実装時の注意点

・enum を使うか text + check 制約で行くかは移行容易性で判断する
  MVPでは text + check 制約でも十分
・papers.current_submission_id の FK は migration 順序に注意する
・updated_at 自動更新 trigger を付与すると運用しやすい
・comments.parent_comment_id は同一 thread 保証がアプリ側ロジックになりやすい
・status と visibility の整合をアプリ層でも保証する

20. 主要DDLイメージ 文章レベル

profiles
・auth.users に1対1で紐づくプロフィール

papers
・論文本体のヘッダー情報と状態管理

submissions
・各提出版の実体
・ファイルパス保持

reviews
・事務局の判断履歴

threads
・論文単位の議論スレッド

comments
・スレッド配下の投稿本文

21. 次文書との関係

本書のDB設計は、以下の文書に引き継ぐ。

・docs/10_er_diagram.md
  ER図表現に使用する

・docs/11_supabase_design.md
  RLS、Auth、Storage、運用方針へ反映する

・docs/13_api_design.md
  入出力仕様と取得対象テーブル定義に反映する

・docs/16_test_design.md
  データ整合性、制約、遷移テストに反映する

22. 最終判断

Research Session Hub のDB設計は、投稿ワークフローと公開ワークフローを壊さず、3日MVPで実装可能な最小構成として以下を採用する。

・認証は auth.users
・業務ユーザーは profiles
・論文本体は papers
・提出版は submissions
・事務局確認履歴は reviews
・議論スレッドは threads
・コメント本文は comments

本書の最終方針は以下とする。

・論文本体と提出版を分離する
・状態管理は papers を中心に行う
・履歴は submissions と reviews に残す
・議論機能は threads と comments でシンプルに分ける
・RLSしやすい owner 構造を持たせる
・将来の査読機能拡張に耐える余白を残す
