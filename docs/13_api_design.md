文書情報
文書名: API設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/06_function_list.md
- docs/07_role_permission.md
- docs/08_status_transition.md
- docs/09_database_design.md
- docs/11_supabase_design.md
- docs/12_storage_design.md

1. 本書の目的

本書は、Research Session Hub のMVPにおいて必要となるAPIおよびサーバー処理の仕様を定義し、画面、権限、状態遷移、DB、Storage との整合を取ることを目的とする。

本MVPでは、Next.js App Router を前提とし、Server Actions と Route Handlers を併用する。
ただし、概念上のAPIとして本書では統一的に整理する。

本書で扱う対象は以下である。

・認証前提のサーバー処理
・研究発表エントリー作成と更新
・初回提出と再提出
・事務局による差し戻し
・公開日時設定
・会員限定公開
・一般公開切替
・論文一覧と詳細取得
・コメント一覧と投稿
・PDF閲覧用 signed URL 発行

2. API設計方針

Research Session Hub のAPI設計は、以下の方針で行う。

・MVPに必要な操作だけに絞る
・投稿ワークフローと公開ワークフローを壊さない
・状態遷移に厳密に従う
・認証、認可をサーバー側で必ず再判定する
・UI都合でなく業務単位でAPIを分ける
・一覧取得と更新処理を明確に分離する
・Storage 操作と DB 更新の整合を意識する
・将来的に Route Handler へ切り出しやすい命名を採用する

3. 実装前提

3-1. 採用前提

・Next.js App Router
・Server Actions
・Route Handlers
・Supabase Auth
・Supabase Postgres
・Supabase Storage

3-2. API利用者

・公開画面
・会員画面
・研究発表者画面
・事務局画面

3-3. 認証前提

・未ログイン可のAPIは限定する
・会員限定情報は必ずログイン必須
・office 権限を必要とする処理は role 判定必須
・ presenter の自分投稿操作は ownership 判定必須

4. 共通レスポンス方針

4-1. 成功レスポンス基本形

成功時は以下の概念を返す。

・success true
・data 本体
・message 任意

例
{
  "success": true,
  "data": {},
  "message": "Saved successfully"
}

4-2. 失敗レスポンス基本形

失敗時は以下の概念を返す。

・success false
・error_code
・message
・details 任意

例
{
  "success": false,
  "error_code": "FORBIDDEN",
  "message": "You do not have permission"
}

4-3. 主なエラーコード

・UNAUTHORIZED
・FORBIDDEN
・NOT_FOUND
・VALIDATION_ERROR
・INVALID_STATE
・UPLOAD_FAILED
・STORAGE_ERROR
・DATABASE_ERROR
・DISCUSSION_CLOSED

5. APIカテゴリ一覧

本MVPでは以下のカテゴリで整理する。

・認証、セッション補助
・プロフィール、ロール取得
・論文公開閲覧
・研究発表者投稿管理
・原稿提出管理
・事務局管理
・コメント、議論
・ファイル閲覧

6. 認証、セッション補助API

6-1. 現在ユーザー取得

用途
・ログイン状態確認
・ヘッダー表示制御
・マイページ表示制御

推奨エンドポイント
GET /api/me

認証
・任意
・未ログイン時は null 返却でもよい

返却例
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "role": "presenter",
      "display_name": "Takuma",
      "affiliation": "Example Lab"
    }
  }
}

主な利用画面
・共通ヘッダー
・マイページ
・ガード判定

6-2. 現在ユーザーロール取得

用途
・権限判定
・管理画面表示制御

推奨
GET /api/me/role

認証
・必須

返却例
{
  "success": true,
  "data": {
    "role": "office"
  }
}

備考
実装上は GET /api/me に含めてもよい

7. プロフィールAPI

7-1. 自分のプロフィール取得

推奨
GET /api/profile

認証
・必須

権限
・本人のみ

返却項目
・id
・role
・display_name
・affiliation
・created_at

7-2. 自分のプロフィール更新

推奨
PATCH /api/profile

認証
・必須

更新可能項目
・display_name
・affiliation

更新不可項目
・role

バリデーション
・display_name 必須
・文字数上限
・不正文字列制御

8. 論文公開閲覧API

8-1. 論文一覧取得

用途
・論文一覧ページ表示

推奨
GET /api/papers

認証
・基本はログイン前提
・将来 free_public を未ログイン対応

クエリ例
・q
・category
・visibility
・discussion_status
・page
・limit

返却項目
・id
・title
・author_name
・affiliation
・abstract_excerpt
・status
・visibility
・published_at
・discussion_start_at
・discussion_end_at

権限制御
・viewer presenter office は published_members_only と free_public を取得可能
・未ログインは MVPでは制限してもよい

8-2. 論文詳細取得

用途
・論文詳細ページ表示

推奨
GET /api/papers/:paperId

認証
・会員限定閲覧時は必須

返却項目
・id
・title
・abstract
・category
・author_name
・affiliation
・status
・visibility
・published_at
・discussion_start_at
・discussion_end_at
・current_submission_id
・thread_id
・can_comment
・can_view_file

権限制御
・office は全件可
・presenter は自分の未公開論文可
・viewer は公開済みのみ可
・未ログインは free_public のみ将来可

エラー
・NOT_FOUND
・FORBIDDEN

8-3. 論文詳細画面用コメント要約取得 任意

推奨
GET /api/papers/:paperId/summary

用途
・件数、議論状態、最終コメント日時など軽量表示

MVP方針
・必須ではない
・詳細APIに含めてもよい

9. 研究発表者投稿管理API

9-1. 自分の投稿一覧取得

用途
・自分の投稿一覧ページ

推奨
GET /api/my/papers

認証
・必須

権限
・presenter
・office は必要に応じて代理参照

返却項目
・id
・title
・status
・updated_at
・scheduled_publish_at
・discussion_start_at
・discussion_end_at
・needs_revision boolean
・current_submission_version

9-2. 新規投稿作成

用途
・研究発表エントリー作成

推奨
POST /api/my/papers

認証
・必須

権限
・presenter のみ

入力項目
・title
・abstract
・category
・author_name
・affiliation
・scheduled_publish_at 任意
・discussion_start_at 任意
・discussion_end_at 任意

初期状態
・draft

返却項目
・paper_id
・status

バリデーション
・title 必須
・abstract 必須
・category 必須
・author_name 必須
・affiliation 必須

9-3. 自分の投稿詳細取得

用途
・投稿編集画面
・投稿詳細確認画面

推奨
GET /api/my/papers/:paperId

認証
・必須

権限
・本人のみ
・office は別管理APIで取得推奨

返却項目
・paper 基本情報
・status
・current_submission
・submission_history
・latest_review_comment
・discussion dates
・scheduled_publish_at

9-4. 自分の投稿更新

用途
・draft 編集
・revision_requested 時の一部更新

推奨
PATCH /api/my/papers/:paperId

認証
・必須

権限
・本人のみ

更新可能条件
・status が draft
・または revision_requested で限定項目のみ

更新可能項目
・title
・abstract
・category
・author_name
・affiliation
・discussion_start_at
・discussion_end_at
・scheduled_publish_at 任意

更新禁止条件
・submitted
・resubmitted
・scheduled
・published_members_only
・free_public
・archived

エラー
・INVALID_STATE
・FORBIDDEN

10. 原稿提出API

10-1. 初回提出

用途
・初回原稿提出

推奨
POST /api/my/papers/:paperId/submit

認証
・必須

権限
・presenter 本人のみ

前提状態
・draft

入力
・file
・submission_note 任意

処理
1 ownership 確認
2 state 確認 draft
3 version_no = 1
4 Storage アップロード
5 submissions insert
6 papers.current_submission_id 更新
7 papers.status を submitted に変更

返却
・paper_id
・submission_id
・version_no
・status submitted

エラー
・VALIDATION_ERROR
・UPLOAD_FAILED
・INVALID_STATE

10-2. 再提出

用途
・差し戻し後の再提出

推奨
POST /api/my/papers/:paperId/resubmit

認証
・必須

権限
・presenter 本人のみ

前提状態
・revision_requested

入力
・file
・submission_note 任意

処理
1 ownership 確認
2 state 確認 revision_requested
3 max version_no 取得
4 新版 version_no 採番
5 Storage へ新パスで保存
6 submissions insert
7 papers.current_submission_id 更新
8 papers.status を resubmitted に変更

返却
・submission_id
・version_no
・status resubmitted

10-3. 自分の提出履歴取得

用途
・投稿詳細確認
・再提出画面補助

推奨
GET /api/my/papers/:paperId/submissions

認証
・必須

権限
・本人のみ

返却項目
・submission_id
・version_no
・file_name
・created_at
・status
・office_feedback 任意

11. 事務局管理API

11-1. 事務局ダッシュボード集計取得

用途
・事務局ダッシュボード

推奨
GET /api/office/dashboard

認証
・必須

権限
・office のみ

返却項目
・submitted_count
・revision_requested_count
・resubmitted_count
・scheduled_count
・published_count
・recent_items

11-2. 全投稿一覧取得

用途
・事務局投稿一覧

推奨
GET /api/office/papers

認証
・必須

権限
・office のみ

クエリ
・q
・status
・category
・visibility
・page
・limit

返却項目
・id
・title
・presenter_name
・affiliation
・status
・updated_at
・scheduled_publish_at
・discussion_start_at
・discussion_end_at

11-3. 事務局投稿詳細取得

用途
・事務局投稿詳細ページ

推奨
GET /api/office/papers/:paperId

認証
・必須

権限
・office のみ

返却項目
・paper 基本情報
・presenter 情報
・current_submission
・submission_history
・review_history
・thread_info
・comment_count

11-4. 差し戻し

用途
・修正依頼
・差し戻しコメント記録

推奨
POST /api/office/papers/:paperId/request-revision

認証
・必須

権限
・office のみ

前提状態
・submitted
・resubmitted

入力
・comment

処理
1 paper 状態確認
2 current submission 取得
3 reviews insert decision revision_required
4 必要に応じて submissions.office_feedback 更新
5 papers.status を revision_requested に更新

返却
・paper_id
・status revision_requested

バリデーション
・comment 必須を推奨

11-5. 公開日時、議論期間設定

用途
・公開予約
・議論期間設定

推奨
POST /api/office/papers/:paperId/schedule

認証
・必須

権限
・office のみ

前提状態
・submitted
・resubmitted

入力
・scheduled_publish_at
・discussion_start_at
・discussion_end_at

処理
1 paper 状態確認
2 日時整合性確認
3 papers 更新
4 papers.status を scheduled に変更

バリデーション
・discussion_start_at <= discussion_end_at
・scheduled_publish_at 必須
・discussion 開始終了が妥当

返却
・paper_id
・status scheduled

11-6. 即時会員限定公開

用途
・公開実行

推奨
POST /api/office/papers/:paperId/publish

認証
・必須

権限
・office のみ

前提状態
・scheduled

入力
・なし
または
・force boolean 任意

処理
1 state 確認
2 papers.status を published_members_only に変更
3 visibility を members_only に整合
4 published_at 設定
5 threads がなければ作成
6 threads.status = open
7 threads.visibility = members_only

返却
・paper_id
・status published_members_only

11-7. 一般公開切替

用途
・free_public への遷移

推奨
POST /api/office/papers/:paperId/free-publish

認証
・必須

権限
・office のみ

前提状態
・published_members_only

処理
1 state 確認
2 papers.status を free_public に変更
3 papers.visibility を free_public に変更
4 papers.free_public_at 設定
5 threads.visibility を free_public に変更

返却
・paper_id
・status free_public

11-8. アーカイブ

用途
・運用終了

推奨
POST /api/office/papers/:paperId/archive

認証
・必須

権限
・office のみ

前提状態
・scheduled
・published_members_only
・free_public

処理
1 state 確認
2 papers.status を archived に変更
3 papers.archived_at 設定
4 threads.status を closed に変更 任意

返却
・paper_id
・status archived

11-9. 事務局ユーザー一覧取得

用途
・簡易ユーザー管理

推奨
GET /api/office/users

認証
・必須

権限
・office のみ

返却項目
・id
・display_name
・affiliation
・role
・created_at

11-10. ユーザーロール変更

用途
・viewer から presenter への昇格など

推奨
PATCH /api/office/users/:userId/role

認証
・必須

権限
・office のみ

入力
・role

バリデーション
・viewer presenter office のみ

注意
・MVPでは変更対象や変更権限を慎重に絞る
・office 同士の昇降格は別途運用注意

12. コメント、議論API

12-1. コメント一覧取得

用途
・論文詳細ページのスレッド表示

推奨
GET /api/papers/:paperId/comments

認証
・論文閲覧権限に準ずる

権限
・対象論文を閲覧できるユーザー

返却項目
・comment_id
・user display_name
・body
・created_at
・is_deleted
・parent_comment_id 任意

並び
・created_at 昇順推奨

12-2. コメント投稿

用途
・議論参加

推奨
POST /api/papers/:paperId/comments

認証
・必須

権限
・viewer presenter office

前提条件
・論文が published_members_only または free_public
・discussion_start_at から discussion_end_at の間
・thread.status = open

入力
・body
・parent_comment_id 任意

処理
1 論文閲覧権限確認
2 discussion open 判定
3 thread 取得
4 comments insert

返却
・comment_id
・created_at

エラー
・DISCUSSION_CLOSED
・FORBIDDEN
・VALIDATION_ERROR

12-3. コメント削除

用途
・不適切コメント管理

推奨
DELETE /api/office/comments/:commentId

認証
・必須

権限
・office のみ

処理
・is_deleted = true
・必要に応じて body をマスク

返却
・comment_id
・deleted true

13. ファイル閲覧API

13-1. 最新PDF閲覧URL発行

用途
・論文詳細ページの PDF 閲覧

推奨
POST /api/papers/:paperId/file-url

認証
・会員限定時は必須
・free_public は将来未ログイン対応余地あり

権限
・対象論文の閲覧権限を持つユーザー

処理
1 paper 取得
2 閲覧権限確認
3 current_submission_id 取得
4 submissions.file_path 取得
5 signed URL 発行

返却
・url
・expires_in
・file_name

13-2. 任意版PDF閲覧URL発行 事務局、投稿者向け

用途
・履歴参照

推奨
POST /api/submissions/:submissionId/file-url

認証
・必須

権限
・office
・submission 所有 paper の presenter

処理
1 submission 取得
2 ownership または office 確認
3 signed URL 発行

14. 状態遷移に対応するAPIマッピング

draft -> submitted
・POST /api/my/papers/:paperId/submit

submitted -> revision_requested
・POST /api/office/papers/:paperId/request-revision

submitted -> scheduled
・POST /api/office/papers/:paperId/schedule

revision_requested -> resubmitted
・POST /api/my/papers/:paperId/resubmit

resubmitted -> revision_requested
・POST /api/office/papers/:paperId/request-revision

resubmitted -> scheduled
・POST /api/office/papers/:paperId/schedule

scheduled -> published_members_only
・POST /api/office/papers/:paperId/publish

published_members_only -> free_public
・POST /api/office/papers/:paperId/free-publish

published_members_only -> archived
・POST /api/office/papers/:paperId/archive

free_public -> archived
・POST /api/office/papers/:paperId/archive

15. バリデーション方針

15-1. 論文作成、更新

・title 必須
・abstract 必須
・category 必須
・author_name 必須
・affiliation 必須

15-2. 提出

・PDF 必須
・MIME type pdf
・サイズ制限
・paper ownership 確認
・状態確認

15-3. schedule

・scheduled_publish_at 必須
・discussion_start_at 必須
・discussion_end_at 必須
・discussion_start_at <= discussion_end_at
・必要なら scheduled_publish_at <= discussion_end_at

15-4. コメント

・body 必須
・文字数上限
・discussion open 確認
・thread open 確認

16. トランザクション整合方針

16-1. 提出系

重要処理
・Storage upload
・submissions insert
・papers.current_submission_id update
・papers.status update

方針
・可能な限り一連で処理
・Storage 成功後 DB失敗時の孤立ファイルに備える
・MVPでは運用清掃でも許容
・DB成功前に UI 成功表示をしない

16-2. 差し戻し系

重要処理
・reviews insert
・papers.status update

方針
・両方成功して初めて完了扱い

16-3. 公開系

重要処理
・papers status update
・visibility update
・published_at free_public_at 更新
・threads create update

方針
・状態更新と thread 整備を一体で扱う

17. セキュリティ方針

・クライアントから role を信頼しない
・毎回サーバー側で auth.uid と profiles.role を確認する
・ paperId submissionId commentId は UUID 前提で検証する
・他人の paper へのアクセスは owner 判定で拒否する
・ signed URL は短寿命で発行する
・会員限定論文の file_path をそのまま返さない

18. MVPで省略、簡略化するもの

・REST 完全準拠へのこだわり
・GraphQL
・コメント編集
・一括公開API
・自動公開バッチAPI
・通知API
・査読者割当API
・採点API
・全文検索API

19. 実装優先順位

優先度A
・GET /api/me
・GET /api/my/papers
・POST /api/my/papers
・PATCH /api/my/papers/:paperId
・POST /api/my/papers/:paperId/submit
・POST /api/my/papers/:paperId/resubmit
・GET /api/papers
・GET /api/papers/:paperId
・GET /api/office/papers
・GET /api/office/papers/:paperId
・POST /api/office/papers/:paperId/request-revision
・POST /api/office/papers/:paperId/schedule
・POST /api/office/papers/:paperId/publish
・POST /api/papers/:paperId/comments
・GET /api/papers/:paperId/comments
・POST /api/papers/:paperId/file-url

優先度B
・POST /api/office/papers/:paperId/free-publish
・POST /api/office/papers/:paperId/archive
・GET /api/office/dashboard
・GET /api/my/papers/:paperId/submissions
・POST /api/submissions/:submissionId/file-url
・DELETE /api/office/comments/:commentId

優先度C
・GET /api/office/users
・PATCH /api/office/users/:userId/role

20. 次文書との関係

本書のAPI設計は、以下の文書に引き継ぐ。

・docs/14_validation_error_design.md
  入力バリデーションとエラー文言の詳細へ反映する

・docs/15_admin_console_design.md
  事務局画面の操作フローへ反映する

・docs/16_test_design.md
  API正常系、異常系、権限制御テストへ反映する

・docs/18_development_plan_3days.md
  実装順序へ反映する

21. 最終判断

Research Session Hub のMVPでは、投稿、再提出、差し戻し、公開、議論という中核ワークフローをAPIで確実に成立させることを最優先とする。

本書の最終方針は以下とする。

・投稿系APIと公開系APIを明確に分離する
・状態遷移に対応したAPIを用意する
・権限判定はサーバー側で必ず行う
・Storage 参照は signed URL 発行で扱う
・MVPでは必要十分なAPIだけに絞る
・将来の自動公開や査読拡張に耐えられる命名と責務分離を採用する
