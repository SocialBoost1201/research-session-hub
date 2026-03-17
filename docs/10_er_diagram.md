文書情報
文書名: ER図設計書
バージョン: v1.1
対象プロジェクト: Research Session Hub
関連文書:
- docs/09_database_design.md
- docs/07_role_permission.md
- docs/08_status_transition.md

1. 本書の目的

本書は、Research Session Hub のMVPで採用するデータベース構造を、エンティティ間の関係性という観点から整理し、投稿、再提出、公開、議論、権限制御の全体像を把握できるようにすることを目的とする。

本MVPでは、以下の業務フローを支えるER構造が必要である。

・会員登録とロール管理
・研究発表エントリー作成
・原稿の初回提出と再提出
・事務局による差し戻しと確認履歴管理
・会員限定公開と後日の一般公開切替
・論文ごとの議論スレッド管理
・コメント投稿と管理

本書では、Supabase Auth を前提としつつ、業務データとして profiles、papers、submissions、reviews、threads、comments を中心にER構造を定義する。

2. ER設計方針

Research Session Hub のER設計は、以下の方針で行う。

・MVPに必要なエンティティだけに絞る
・認証情報と業務用プロフィールを分離する
・論文本体と提出版を分離する
・差し戻しや確認履歴を独立エンティティで保持する
・議論親スレッドとコメント本文を分離する
・RLSしやすい所有者構造を持たせる
・将来の査読機能や複数著者対応に拡張しやすい形にする
・履歴を上書きせず蓄積できるERを採用する

3. エンティティ一覧

本MVPで採用する主要エンティティは以下の通り。

・auth.users
・profiles
・papers
・submissions
・reviews
・threads
・comments

4. エンティティ概要

4-1. auth.users

役割
Supabase Auth が管理する認証ユーザー本体

用途
・ログイン認証
・セッション管理
・メールアドレス管理

補足
業務上のロールや表示名は持たず、profiles に委譲する

4-2. profiles

役割
業務上のユーザープロフィールと権限ロールを管理する

用途
・表示名
・所属
・ロール
・投稿者判定
・事務局判定

主な参照先
・papers.presenter_id
・submissions.submitted_by
・reviews.reviewer_id
・comments.user_id

4-3. papers

役割
研究発表エントリーの主テーブル

用途
・タイトル
・概要
・カテゴリ
・著者名
・所属
・投稿状態
・公開状態
・公開日時
・議論期間
・最新提出版参照

主な関係
・profiles と 1対多
・submissions と 1対多
・reviews と 1対多
・threads と 1対1
・comments と 1対多 補助参照

4-4. submissions

役割
論文の提出版履歴を管理する

用途
・初回提出
・再提出
・版番号
・原稿ファイルパス
・提出メモ

主な関係
・papers と 多対1
・profiles と 多対1
・reviews と 1対多

4-5. reviews

役割
事務局による確認履歴、差し戻し理由、判断メモを管理する

用途
・修正依頼コメント
・確認ログ
・判断履歴

主な関係
・papers と 多対1
・submissions と 多対1
・profiles reviewer と 多対1

4-6. threads

役割
論文ごとの議論スレッド親情報を管理する

用途
・スレッド開閉状態
・公開範囲
・コメントの親単位

主な関係
・papers と 1対1
・comments と 1対多

4-7. comments

役割
スレッドに紐づくコメント本文を管理する

用途
・議論投稿
・時系列表示
・削除管理
・将来の返信構造

主な関係
・threads と 多対1
・papers と 多対1
・profiles と 多対1
・comments 自己参照 任意

5. エンティティ間関係の全体像

Research Session Hub のER構造は、大きく分けて以下の2系統で成り立つ。

1 ユーザーと投稿管理の系統
auth.users
↓
profiles
↓
papers
↓
submissions
↓
reviews

2 論文公開後の議論系統
papers
↓
threads
↓
comments

加えて、comments は profiles に紐づき、誰が投稿したかを保持する。
また、papers は current_submission_id により最新提出版を直接参照する。

6. ER図の文章表現

6-1. シンプル構造

auth.users
1対1
profiles

profiles
1対多
papers

profiles
1対多
submissions

profiles
1対多
reviews

profiles
1対多
comments

papers
1対多
submissions

papers
1対多
reviews

papers
1対1
threads

threads
1対多
comments

papers
1対多
comments 補助参照

comments
1対多
comments 自己参照 任意

6-2. 詳細構造

auth.users
  └─ id

profiles
  ├─ id PK FK -> auth.users.id
  ├─ role
  ├─ display_name
  ├─ affiliation
  ├─ created_at
  └─ updated_at

papers
  ├─ id PK
  ├─ title
  ├─ abstract
  ├─ category
  ├─ author_name
  ├─ affiliation
  ├─ presenter_id FK -> profiles.id
  ├─ current_submission_id FK -> submissions.id
  ├─ visibility
  ├─ status
  ├─ scheduled_publish_at
  ├─ discussion_start_at
  ├─ discussion_end_at
  ├─ free_public_at
  ├─ published_at
  ├─ archived_at
  ├─ created_at
  └─ updated_at

submissions
  ├─ id PK
  ├─ paper_id FK -> papers.id
  ├─ version_no
  ├─ file_path
  ├─ file_name
  ├─ submitted_by FK -> profiles.id
  ├─ submission_note
  ├─ office_feedback
  ├─ status
  └─ created_at

reviews
  ├─ id PK
  ├─ paper_id FK -> papers.id
  ├─ submission_id FK -> submissions.id
  ├─ reviewer_id FK -> profiles.id
  ├─ review_type
  ├─ decision
  ├─ comment
  └─ created_at

threads
  ├─ id PK
  ├─ paper_id FK -> papers.id UNIQUE
  ├─ status
  ├─ opened_at
  ├─ closed_at
  ├─ visibility
  └─ created_at

comments
  ├─ id PK
  ├─ thread_id FK -> threads.id
  ├─ paper_id FK -> papers.id
  ├─ user_id FK -> profiles.id
  ├─ parent_comment_id FK -> comments.id NULL
  ├─ body
  ├─ is_deleted
  ├─ created_at
  └─ updated_at

7. カーディナリティ一覧

auth.users 1 : 1 profiles
profiles 1 : N papers
profiles 1 : N submissions
profiles 1 : N reviews
profiles 1 : N comments
papers 1 : N submissions
papers 1 : N reviews
papers 1 : 1 threads
threads 1 : N comments
papers 1 : N comments
submissions 1 : N reviews
comments 1 : N comments 自己参照 任意
papers 1 : 1 current_submission 疑似参照

8. リレーション詳細

8-1. auth.users と profiles

関係
1対1

キー
profiles.id -> auth.users.id

意味
認証ユーザー1件に対して、業務用プロフィール1件を持つ

理由
認証情報と業務情報を分離するため

8-2. profiles と papers

関係
1対多

キー
papers.presenter_id -> profiles.id

意味
1人の研究発表者が複数の論文投稿を持てる

理由
所有者を明確にしてRLSしやすくするため

8-3. profiles と submissions

関係
1対多

キー
submissions.submitted_by -> profiles.id

意味
1人のユーザーが複数の提出版を作成できる

理由
提出者を履歴として残すため

8-4. profiles と reviews

関係
1対多

キー
reviews.reviewer_id -> profiles.id

意味
1人の事務局ユーザーが複数の確認ログを持てる

理由
誰が差し戻しや確認を行ったかを残すため

8-5. profiles と comments

関係
1対多

キー
comments.user_id -> profiles.id

意味
1人のユーザーが複数コメントを投稿できる

理由
投稿者表示と監査のため

8-6. papers と submissions

関係
1対多

キー
submissions.paper_id -> papers.id

意味
1つの論文に対して複数提出版を持てる

理由
初回提出と再提出を履歴として保持するため

8-7. papers と current_submission_id

関係
疑似1対1参照

キー
papers.current_submission_id -> submissions.id

意味
論文が最新提出版を直接参照する

理由
一覧表示や詳細表示で最新版を高速参照するため

注意
循環参照になるため、マイグレーション順序に注意する

8-8. papers と reviews

関係
1対多

キー
reviews.paper_id -> papers.id

意味
1論文に複数の事務局判断履歴が紐づく

理由
差し戻しや確認履歴を論文単位でも追えるようにするため

8-9. submissions と reviews

関係
1対多

キー
reviews.submission_id -> submissions.id

意味
1つの提出版に対して複数の事務局確認記録が付き得る

理由
提出版単位で確認履歴を持てるようにするため

8-10. papers と threads

関係
1対1

キー
threads.paper_id -> papers.id
UNIQUE 制約あり

意味
1論文に対して1スレッドを持つ

理由
論文ごとに議論の単位を固定化するため

8-11. threads と comments

関係
1対多

キー
comments.thread_id -> threads.id

意味
1スレッドに複数のコメントが投稿される

理由
議論本文を時系列管理するため

8-12. papers と comments

関係
1対多 補助参照

キー
comments.paper_id -> papers.id

意味
コメントがどの論文に属するかを直接持つ

理由
thread 経由でも取れるが、クエリ簡略化と管理性向上のため冗長保持する

8-13. comments の自己参照

関係
1対多 自己参照 任意

キー
comments.parent_comment_id -> comments.id

意味
あるコメントに返信を紐づけられる

理由
将来の返信機能に備えるため

MVP方針
原則 NULL 運用でもよい

9. 主キーと外部キー整理

9-1. 主キー

profiles.id
papers.id
submissions.id
reviews.id
threads.id
comments.id

9-2. 外部キー

profiles.id -> auth.users.id
papers.presenter_id -> profiles.id
papers.current_submission_id -> submissions.id
submissions.paper_id -> papers.id
submissions.submitted_by -> profiles.id
reviews.paper_id -> papers.id
reviews.submission_id -> submissions.id
reviews.reviewer_id -> profiles.id
threads.paper_id -> papers.id
comments.thread_id -> threads.id
comments.paper_id -> papers.id
comments.user_id -> profiles.id
comments.parent_comment_id -> comments.id

10. 業務フローとERの対応

10-1. 会員登録

対応エンティティ
auth.users
profiles

内容
認証ユーザー作成後、業務利用のために profiles を1件作成する

10-2. 新規投稿作成

対応エンティティ
papers

内容
presenter が papers レコードを作成し、draft 状態で保持する

10-3. 初回提出

対応エンティティ
submissions
papers

内容
初回提出時に submissions を作成し、papers.current_submission_id を更新、papers.status を submitted に変更する

10-4. 差し戻し

対応エンティティ
reviews
papers

内容
事務局が reviews を作成し、papers.status を revision_requested に変更する

10-5. 再提出

対応エンティティ
submissions
papers

内容
新しい version_no の submissions を追加し、papers.current_submission_id を更新、papers.status を resubmitted に変更する

10-6. 公開設定

対応エンティティ
papers
threads

内容
事務局が公開日時と議論期間を設定し、必要に応じて threads を作成または更新する

10-7. 会員限定公開

対応エンティティ
papers
threads

内容
papers.status を published_members_only に変更し、threads.status を open として議論可能状態にする

10-8. コメント投稿

対応エンティティ
comments
threads
papers
profiles

内容
対象論文の thread に対して comments を追加する

11. ER上の主要設計判断

11-1. papers と submissions を分離した理由

・提出履歴を上書きせず残すため
・初回提出と再提出を同じ構造で扱うため
・最新提出版と過去提出版を明確に分離するため

11-2. reviews を独立させた理由

・差し戻し履歴を蓄積するため
・提出版単位の確認ログを持つため
・将来の査読拡張に耐えるため

11-3. threads を独立させた理由

・論文ごとの議論親単位を明確にするため
・開閉状態を持てるようにするため
・comments を直接 papers にぶら下げるだけより拡張しやすいため

11-4. comments に paper_id を持たせた理由

・thread 経由でも参照可能だが、管理画面や集計で扱いやすくするため
・クエリを単純化するため

11-5. authors テーブルを持たない理由

・3日MVPでは過剰なため
・現時点では author_name の文字列保持で十分なため

将来拡張
authors
paper_authors
を追加すれば複数著者管理へ拡張可能

12. Mermaid記法によるER図

以下は可視化補助用のMermaid記法である。
正本は docs/09_database_design.md と本書の定義とする。

erDiagram
    AUTH_USERS ||--|| PROFILES : has
    PROFILES ||--o{ PAPERS : creates
    PROFILES ||--o{ SUBMISSIONS : submits
    PROFILES ||--o{ REVIEWS : writes
    PROFILES ||--o{ COMMENTS : posts
    PAPERS ||--o{ SUBMISSIONS : has
    PAPERS ||--o{ REVIEWS : has
    PAPERS ||--|| THREADS : has
    PAPERS ||--o{ COMMENTS : relates
    SUBMISSIONS ||--o{ REVIEWS : receives
    THREADS ||--o{ COMMENTS : contains
    COMMENTS ||--o{ COMMENTS : replies_to

13. ER上の注意点

・papers.current_submission_id と submissions.paper_id の整合を壊さないこと
・threads.paper_id には UNIQUE 制約を付けること
・comments.parent_comment_id は同一 thread 内保証を将来強化できるようにすること
・profiles.role は権限制御の起点になるため必須とすること
・papers.status と visibility の整合をアプリ層でも担保すること
・履歴保持を重視し、物理削除は極力避けること

14. 将来拡張ER候補

将来的に追加し得るエンティティ
・authors
・paper_authors
・paper_publications
・notifications
・audit_logs
・review_assignments
・events
・favorites
・paper_tags
・tag_relations

拡張イメージ
papers 1対多 paper_authors
paper_authors 多対1 authors
papers 1対多 notifications
papers 多対多 tags
events 1対多 papers

15. 次文書との関係

本書のER構造は、以下の文書に引き継ぐ。

・docs/11_supabase_design.md
  Auth、RLS、Storage、アクセス制御へ反映する

・docs/13_api_design.md
  取得対象、更新対象、関連取得設計へ反映する

・docs/16_test_design.md
  FK整合性、履歴保持、状態整合性テストへ反映する

16. 最終判断

Research Session Hub のER設計は、投稿、差し戻し、再提出、公開、議論というMVPの中核ワークフローを支える最小構成として以下を採用する。

・認証本体は auth.users
・業務ユーザーは profiles
・論文本体は papers
・提出履歴は submissions
・事務局判断履歴は reviews
・議論親は threads
・議論本文は comments

本書の最終方針は以下とする。

・論文本体と提出版を明確に分離する
・履歴を残す構造を優先する
・議論を論文単位で一元管理する
・権限制御しやすい所有者構造を持たせる
・MVPではシンプルで拡張余地のあるERを採用する
