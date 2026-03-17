文書情報
文書名: デプロイ・運用設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/11_supabase_design.md
- docs/12_storage_design.md
- docs/13_api_design.md
- docs/14_validation_error_design.md
- docs/15_admin_console_design.md
- docs/16_test_design.md

1. 本書の目的

本書は、Research Session Hub のMVPを本番相当環境で安定運用するために必要な、デプロイ構成、環境変数、初期セットアップ、権限運用、公開運用、障害時対応、運用ルールを定義することを目的とする。

本MVPでは、Next.js App Router、Supabase、Vercel を前提とし、3日で動作するプロトタイプを安定して公開、確認、運用できることを最優先とする。

2. 運用設計方針

Research Session Hub のMVP運用は、以下の方針で行う。

・構成はシンプルに保つ
・本番運用で事故が起きやすい部分を先に明文化する
・会員限定公開を最優先で守る
・Storage は private 運用を維持する
・公開処理は自動化よりまず手動運用を優先する
・初期は少人数の事務局運用を前提とする
・障害時の切り分けをしやすい構成にする
・MVPでは運用で補える部分を許容する

3. システム構成

3-1. 採用構成

フロントエンド
・Next.js App Router

アプリ実行基盤
・Vercel

認証
・Supabase Auth

データベース
・Supabase Postgres

ファイル保存
・Supabase Storage

3-2. 役割分担

Vercel
・フロント表示
・Server Actions
・Route Handlers
・認証付きサーバー処理

Supabase
・ユーザー認証
・DB保存
・RLS制御
・PDF保存
・signed URL 発行対象

4. 環境構成

4-1. 推奨環境

最低限の環境
・ローカル開発環境
・Vercel Preview 環境
・Vercel Production 環境
・Supabase プロジェクト 1つ MVP最小
または
・Preview 用と Production 用の Supabase を分ける 将来推奨

4-2. MVPでの現実解

最速構成
・Vercel Preview
・Vercel Production
・Supabase 1プロジェクト

理由
・3日MVPにおいて構成管理コストを抑えられるため

注意
・Supabase 1プロジェクト運用では Preview と Production のデータ衝突リスクがある
・本気運用に入る前には環境分離が望ましい

4-3. 本番寄り推奨構成 将来

・Vercel Preview
・Vercel Production
・Supabase Staging
・Supabase Production

5. デプロイ対象

5-1. Vercel にデプロイするもの

・Next.js アプリケーション本体
・Server Actions
・Route Handlers
・UI
・認証付きサーバー処理

5-2. Supabase にデプロイするもの

・DBスキーマ
・RLSポリシー
・Storage バケット
・Auth 設定
・必要な SQL migration

6. 環境変数設計

6-1. クライアント公開可能な環境変数

NEXT_PUBLIC_SUPABASE_URL
用途
・Supabase プロジェクトURL

NEXT_PUBLIC_SUPABASE_ANON_KEY
用途
・クライアント接続用
・anon key
注意
・公開されてもよいが、RLS が前提

6-2. サーバー専用環境変数

SUPABASE_SERVICE_ROLE_KEY
用途
・限定的なサーバー管理処理
・通常画面処理では多用しない

SITE_URL
用途
・絶対URL生成
・認証リダイレクトやリンク生成

NODE_ENV
用途
・環境切替

6-3. 運用ルール

・service role key はクライアントへ絶対に渡さない
・Vercel の Project Settings で管理する
・ローカルは .env.local を利用する
・Preview と Production で値を分けるのが理想

7. Supabase 初期セットアップ手順

7-1. Auth 設定

必要項目
・メールアドレス認証有効化
・必要に応じてメール確認設定
・Site URL 設定
・Redirect URL 設定

MVP方針
・メールパスワード認証のみ
・OAuth は使わない

7-2. Database 設定

必要項目
・テーブル作成
・制約追加
・インデックス追加
・RLS有効化
・ポリシー作成
・updated_at trigger 追加

7-3. Storage 設定

必要項目
・paper-files バケット作成
・private 設定確認
・アップロード権限と参照権限をアプリ経由で扱う前提を確認

8. 初期データ作成方針

8-1. 初期ユーザー

最低限必要なユーザー
・office ユーザー 1名
・presenter ユーザー 1名
・viewer ユーザー 1名

8-2. 初期ロール設定

方針
・登録時は viewer
・事務局ユーザーのみ手動で office に変更
・必要な研究発表者は presenter に変更

8-3. 初期確認用データ

推奨
・各状態の sample paper
・submission 履歴
・review 履歴
・thread
・comments

目的
・画面確認とテストをすぐ行えるようにする

9. デプロイ手順

9-1. 初回デプロイ手順

1 Next.js プロジェクトを Vercel に接続
2 環境変数を設定
3 Supabase の migration を適用
4 Storage バケットを作成
5 初期 office ユーザーを作成
6 初期データを必要に応じて投入
7 Production デプロイ実行
8 動作確認を行う

9-2. 通常更新手順

1 変更内容をローカルで確認
2 Preview で表示確認
3 DB変更がある場合は migration を適用
4 本番反映前に優先度Aテスト実施
5 Production へデプロイ
6 デプロイ後の疎通確認
7 主要導線確認

10. 本番反映前チェックリスト

10-1. 認証

・会員登録できる
・ログインできる
・ログアウトできる
・未ログインで保護画面に入れない

10-2. 権限

・viewer が投稿作成できない
・presenter が事務局画面に入れない
・office が管理画面に入れる
・他人投稿の更新が拒否される

10-3. 投稿、提出

・presenter が新規投稿できる
・PDF初回提出できる
・差し戻し後に再提出できる

10-4. 公開

・office が公開設定できる
・scheduled から会員限定公開できる
・viewer が会員限定論文を閲覧できる

10-5. コメント

・議論期間内のみ投稿できる
・期間外は投稿できない
・office がコメント削除できる

10-6. ファイル

・PDFアップロードできる
・signed URL が取得できる
・権限のないユーザーはファイル取得できない

11. デプロイ後確認項目

11-1. 主要画面

・トップページ表示
・ログインページ表示
・マイページ表示
・論文一覧表示
・事務局ダッシュボード表示

11-2. 主要API

・/api/me
・/api/papers
・/api/my/papers
・/api/office/papers
・コメント関連
・file-url 発行

11-3. DB、Storage

・提出後に submissions レコードが作成される
・file_path が正しく保存される
・Storage にファイルが保存されている
・current_submission_id が更新される

12. 運用フロー設計

12-1. 研究発表者運用

・presenter ロール付与済みユーザーが投稿する
・投稿後は submitted で事務局確認待ち
・差し戻しがあれば再提出
・公開後はコメント参加可能

12-2. 事務局運用

・submitted と resubmitted を優先確認する
・必要なら差し戻す
・問題なければ公開設定する
・scheduled になった投稿を公開する
・公開後はコメント管理する
・必要に応じて free_public に切り替える

12-3. 公開運用

MVP方針
・公開はまず手動運用
・scheduled_publish_at は保持するが、自動公開を必須にしない

運用手順
1 office が scheduled 一覧を確認
2 対象投稿の公開日時を確認
3 規定日に publish 実行
4 公開ページ表示確認

理由
・3日MVPでは自動バッチより確実な手動運用を優先するため

13. ロール運用方針

13-1. 初期方針

・すべての新規登録ユーザーは viewer
・発表者にするユーザーだけ presenter に変更
・運営担当のみ office に変更

13-2. 変更責任者

・office のみ変更可能
・MVP初期は DB 直更新でも可
・将来は管理画面から変更

13-3. 注意事項

・office 権限の乱発禁止
・本番では office を最小人数に限定する

14. 障害時対応方針

14-1. ログインできない

確認対象
・Supabase Auth 設定
・Redirect URL
・Site URL
・環境変数
・ブラウザ cookie

初動
・Vercel 環境変数確認
・Supabase Auth 設定確認
・エラーログ確認

14-2. 投稿できない

確認対象
・RLS
・presenter ロール
・API権限判定
・DB制約
・フォーム入力

初動
・対象ユーザーの profiles.role 確認
・papers insert 権限確認
・サーバーログ確認

14-3. PDFアップロードできない

確認対象
・Storage バケット存在
・private 設定
・MIME 制御
・サイズ制限
・file_path 生成処理
・Storage API 権限

初動
・Storage バケット確認
・サーバーログ確認
・アップロード処理の例外確認

14-4. 論文が閲覧できない

確認対象
・paper.status
・visibility
・RLS
・signed URL 発行処理
・current_submission_id
・file_path

初動
・paper レコード確認
・submission レコード確認
・Storage パス確認
・閲覧権限確認

14-5. コメントできない

確認対象
・discussion_start_at
・discussion_end_at
・thread.status
・ログイン状態
・RLS

初動
・対象 paper の日時確認
・thread 状態確認
・APIレスポンス確認

15. バックアップと復旧方針

15-1. DB

MVP方針
・Supabase の標準運用を前提にする
・重要変更前に SQL を保存する
・ migration を履歴管理する

15-2. Storage

MVP方針
・原稿PDFは削除しない前提で運用
・バケット削除や手動整理を慎重に行う

15-3. 復旧優先順位

1 認証復旧
2 DB整合確認
3 論文閲覧復旧
4 PDF閲覧復旧
5 コメント機能復旧

16. 運用上の禁止事項

・paper-files バケットを public に変更しない
・本番で直接DBを書き換えて状態遷移ルールを壊さない
・提出版を Storage 上で上書きしない
・reviews 履歴を削除しない
・office 権限を安易に付与しない
・current_submission_id を整合なしに変更しない

17. 監視、確認の最小運用

MVPでは本格監視ツールを前提にしないが、最低限以下を確認する。

・Vercel デプロイログ
・Vercel Runtime Error
・Supabase Auth エラー
・Supabase DB クエリエラー
・Storage エラー
・サーバーログの主要失敗メッセージ

18. 本番運用での定期確認項目

日次または運用時
・submitted 件数
・resubmitted 件数
・scheduled 件数
・公開予定投稿
・コメント異常投稿有無
・PDF閲覧可否

変更時
・RLS影響
・Storage パス生成影響
・状態遷移影響
・role 判定影響

19. セキュリティ運用方針

・service role key は限定利用
・環境変数を漏らさない
・private bucket を維持する
・会員限定論文は signed URL 経由のみで扱う
・権限制御は UI だけでなく API、RLS で確認する
・事務局画面は office ロールのみアクセス可とする

20. リリース判定基準

以下を満たした場合、MVPを本番反映可能と判断する。

・会員登録、ログインが成立する
・presenter が投稿、提出できる
・office が差し戻し、公開設定、公開実行できる
・viewer が会員限定論文を閲覧できる
・議論期間内のみコメントできる
・一般公開切替ができる
・RLS と signed URL により会員限定公開が破られない
・重大な画面崩れや処理停止がない

21. 今後の運用拡張候補

・scheduled_publish_at による自動公開
・自動クローズ
・通知メール送信
・監査ログ強化
・本番、検証環境分離
・Storage 整合チェックバッチ
・運用ダッシュボード強化

22. 次文書との関係

本書の内容は、以下の文書に引き継ぐ。

・docs/18_development_plan_3days.md
  実装順と確認タイミングに反映する

23. 最終判断

Research Session Hub のMVPでは、Vercel と Supabase を用いたシンプルな構成で、投稿、公開、閲覧、議論の中核運用を安全に回せることが最重要である。

本書の最終方針は以下とする。

・Vercel をアプリ実行基盤とする
・Supabase を認証、DB、Storage の基盤とする
・Storage は private bucket を維持する
・公開処理はまず手動運用で確実に回す
・ロール運用は最小人数、最小権限で管理する
・本番反映前チェックを必ず通してから公開する
