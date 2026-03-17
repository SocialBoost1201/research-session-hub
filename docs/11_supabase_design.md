文書情報
文書名: Supabase設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/07_role_permission.md
- docs/08_status_transition.md
- docs/09_database_design.md
- docs/10_er_diagram.md

1. 本書の目的

本書は、Research Session Hub のMVPにおける Supabase の利用設計を定義し、Auth、Database、RLS、Storage をどう使うかを明確にすることを目的とする。

本MVPでは、以下を Supabase で支える必要がある。

・会員登録とログイン
・ロールに基づく画面とデータのアクセス制御
・研究発表エントリー管理
・原稿ファイルの保存
・差し戻しと再提出の履歴管理
・会員限定公開と一般公開切替
・論文ごとのコメントスレッド運用

2. Supabase採用方針

Research Session Hub のMVPでは、Supabase を以下のように利用する。

・認証は Supabase Auth を採用する
・業務データは Supabase Postgres を採用する
・アクセス制御は RLS を前提にする
・原稿PDFの保存は Supabase Storage を採用する
・リアルタイム機能はMVPでは必須としない
・Edge Functions はMVPでは原則使わない
・Vercel 側の Server Actions と Route Handler を中心に連携する

3. Supabase利用範囲

3-1. Auth

利用内容
・メールアドレス、パスワードによる会員登録
・ログイン
・ログアウト
・認証状態取得
・認証ユーザーIDの取得

役割
・会員制サイトの基盤
・会員限定公開の前提
・投稿者本人判定の基礎
・事務局判定の入口

3-2. Database

利用内容
・profiles
・papers
・submissions
・reviews
・threads
・comments

役割
・投稿ワークフローの状態管理
・提出版履歴管理
・差し戻し履歴管理
・議論管理
・公開制御

3-3. Storage

利用内容
・研究発表原稿PDFの保存

役割
・初回提出ファイル保存
・再提出ファイル保存
・会員限定閲覧制御
・一般公開切替時のアクセス制御

3-4. RLS

利用内容
・ロール別アクセス制御
・本人データ制御
・会員限定論文の閲覧制御
・コメント投稿制御

役割
・UI制御だけに依存しない実権限の担保

4. Auth設計

4-1. 認証方式

採用方式
・メールアドレス
・パスワード

MVP理由
・実装が最も単純
・会員制サイトとして十分
・権限制御と相性が良い

MVPで採用しないもの
・OAuthログイン
・Magic Link
・SSO
・学会組織連携認証

4-2. サインアップ時の流れ

1 ユーザーが会員登録フォームを送信
2 Supabase Auth で auth.users を生成
3 生成された user.id を使って profiles を作成
4 profiles.role は初期値 viewer
5 必要に応じて presenter または office に手動変更する

4-3. ログイン後の扱い

・auth.uid() を基点に profiles を参照する
・profiles.role により表示と権限を出し分ける
・未認証時は protected route へ入れない
・未認証で会員限定論文へ来た場合はログイン導線へ戻す

4-4. ロール管理方針

初期ロール
・viewer

ロール昇格
・presenter
・office

運用方針
・MVPでは事務局が手動で昇格させる
・Auth の custom claims はMVPでは必須にしない
・ロール判定は profiles.role を正とする

5. Database設計方針

5-1. 採用テーブル

・profiles
・papers
・submissions
・reviews
・threads
・comments

5-2. 状態管理の中心

中心テーブル
・papers

理由
・投稿ワークフローと公開ワークフローの中心になるため
・一覧、公開、管理、RLSで最も参照されるため

5-3. 履歴管理の中心

提出履歴
・submissions

差し戻し、確認履歴
・reviews

議論履歴
・comments

5-4. 時刻管理

主要時刻
・created_at
・updated_at
・scheduled_publish_at
・discussion_start_at
・discussion_end_at
・published_at
・free_public_at
・archived_at

方針
・公開条件や議論可否判定は日時ベースで処理する
・MVPでは自動公開が未実装でも時刻情報は必ず保持する

6. RLS設計方針

6-1. 基本方針

・全業務テーブルで RLS を有効化する
・UIで隠すだけではなく DBで拒否する
・本人所有データは本人のみアクセス可能にする
・事務局は必要範囲で全件アクセス可能にする
・会員限定公開の閲覧制御をDBレベルでも意識する

6-2. RLS適用対象

・profiles
・papers
・submissions
・reviews
・threads
・comments

6-3. 権限判定の前提

利用する情報
・auth.uid()
・profiles.role
・papers.presenter_id
・papers.status
・papers.visibility
・threads.status
・papers.discussion_start_at
・papers.discussion_end_at

7. profiles のRLS方針

7-1. 読み取り

許可
・本人は自分の profiles を読める
・office は全 profiles を読める

制限
・viewer や presenter が他人の profiles を無制限に読むことは不可

7-2. 更新

許可
・本人は自分の display_name、affiliation など一部更新可
・office は必要に応じて role 更新可

制限
・一般ユーザーが自分で role を変更するのは禁止

7-3. 作成

許可
・サインアップ時に本人レコード作成

方針
・アプリ側または trigger で profiles を自動生成してもよい
・MVPではアプリ側作成でも十分

8. papers のRLS方針

8-1. 読み取り

未ログイン
・free_public のみ将来的に許可余地
・MVPでは基本不可でもよい

ログイン済み viewer
・published_members_only
・free_public
の論文を読める

presenter
・公開済み論文を読める
・自分の未公開論文も読める

office
・全論文を読める

8-2. 作成

許可
・presenter
・office 必要に応じて将来
MVPでは presenter を基本とする

制限
・viewer は papers 作成不可

8-3. 更新

presenter
・自分の paper のみ更新可
・ただし status ごとの制限あり
・draft の編集可
・revision_requested 時は再提出フロー内の限定更新
・submitted 以降の自由編集は禁止寄り

office
・全 paper 更新可
・status 変更可
・公開日時更新可
・visibility 更新可

viewer
・不可

8-4. 削除

MVP方針
・原則不可
・アーカイブ運用で代替

9. submissions のRLS方針

9-1. 読み取り

presenter
・自分の paper に紐づく submissions のみ読める

office
・全 submissions を読める

viewer
・不可

9-2. 作成

presenter
・自分の paper に対してのみ可
・初回提出
・再提出

office
・原則不要

9-3. 更新

方針
・提出版は履歴として固定する
・既存 submission の内容更新は極力行わない
・新しい版は新規 insert で扱う

office_feedback を submissions に持つ場合
・office が補助更新してもよい
・ただし主履歴は reviews を正とする

9-4. 削除

・不可
・履歴保持優先

10. reviews のRLS方針

10-1. 読み取り

office
・全件可

presenter
・自分の投稿に紐づくレビューのうち、発表者に見せる想定のコメントは読める設計が望ましい

viewer
・不可

MVP方針
・発表者に見せる差し戻し文面は、アプリ側で必要箇所のみ表示してもよい

10-2. 作成

・office のみ可

10-3. 更新

・原則不要
・レビュー履歴は追記中心

10-4. 削除

・不可
・監査履歴として保持

11. threads のRLS方針

11-1. 読み取り

viewer
・公開済み論文に紐づく thread を読める

presenter
・公開済み論文の thread を読める
・自分の公開論文 thread も読める

office
・全 thread を読める

未ログイン
・free_public 時の将来対応余地あり

11-2. 作成

MVP方針
・office または公開処理時のアプリロジックで作成
・一般ユーザーは不可

11-3. 更新

・office のみ可
・status 開閉制御
・visibility 切替

11-4. 削除

・不可
・close 運用で代替

12. comments のRLS方針

12-1. 読み取り

viewer
・公開済み論文のスレッドコメント読取可

presenter
・公開済み論文のスレッドコメント読取可

office
・全関連コメント読取可

未ログイン
・free_public 時に将来対応余地あり

12-2. 作成

許可条件
・ログイン済み
・対象 paper が published_members_only または free_public
・現在時刻が discussion_start_at 以上
・現在時刻が discussion_end_at 以下
・thread.status が open

許可対象
・viewer
・presenter
・office

12-3. 更新

MVP方針
・原則コメント編集はなし
・必要なら本人のみ短時間編集を将来追加

12-4. 削除

・office のみ可
・論理削除 is_deleted で対応

13. RLSで使う補助関数方針

MVPでは SQL関数を使うと管理がしやすい

候補
・is_office_user()
・is_presenter_user()
・can_read_paper(paper_id)
・is_paper_owner(paper_id)
・is_discussion_open(paper_id)

ただしMVPでは、複雑化しすぎるならシンプルな exists 句中心でもよい

14. RLSポリシー設計イメージ

14-1. profiles

select
・本人 or office

update
・本人の一部更新
・office のロール更新

insert
・本人作成のみ

14-2. papers

select
・office
・自分の論文 owner
・公開済み論文 logged-in user

insert
・presenter のみ

update
・owner の限定更新
・office の全体更新

14-3. submissions

select
・office
・paper owner

insert
・paper owner のみ

update
・原則なし

14-4. reviews

select
・office
・必要に応じて paper owner の一部表示

insert
・office のみ

14-5. threads

select
・公開済み論文の閲覧権限を持つユーザー
・office

insert update
・office のみ

14-6. comments

select
・thread を見られるユーザー

insert
・discussion open かつ logged-in user

delete update
・office のみ

15. Storage設計

15-1. バケット構成

MVPで必要な主バケット
・paper-files

必要なら将来追加
・avatars
・public-assets

15-2. 保存対象

・研究発表原稿PDF

15-3. 保存パス規則

推奨
paper-files/papers/{paperId}/v{versionNo}/{filename}

例
paper-files/papers/8d8c-xxxx/v1/main-paper.pdf
paper-files/papers/8d8c-xxxx/v2/main-paper-revised.pdf

理由
・論文単位で整理できる
・版管理しやすい
・Storage と submissions を対応付けやすい

15-4. Storage公開方針

MVPの基本方針
・paper-files は private bucket とする
・公開時も直接 public にせず、権限付きで signed URL を発行する方向が安全

理由
・会員限定公開を守りやすい
・free_public への切替もアプリロジックで吸収しやすい
・public bucket にしてしまうと誤公開リスクが高い

15-5. Storageアクセス制御

presenter
・自分の投稿ファイルのみアップロード可
・自分の投稿ファイル参照可

office
・全ファイル参照可

viewer
・公開済み論文に対応するファイルのみ参照可
・直接 Storage 全体参照は不可

未ログイン
・MVPでは不可
・将来 free_public で限定対応余地あり

16. Storage運用方針

16-1. アップロード時

・ファイル形式は PDF のみ
・ファイルサイズ上限を設定する
・パスは paper_id と version_no で決定する
・DBの submissions.file_path に保存する

16-2. 閲覧時

・論文詳細ページ表示時に権限確認
・必要なら短時間 signed URL を発行
・URL を長期間露出させない

16-3. 再提出時

・同じファイルを上書きしない
・新バージョンとして別パス保存
・過去版は残す

17. SupabaseとNext.js連携方針

17-1. クライアント利用

用途
・ログイン状態取得
・一部フォーム処理

方針
・必要最小限に留める

17-2. サーバー利用

用途
・認証付きデータ取得
・投稿作成
・提出処理
・差し戻し処理
・公開処理
・コメント投稿処理

方針
・Next.js Server Actions と Route Handler を中心に行う
・サービスロールキーの常用は避ける
・ユーザーコンテキストつきクライアントを優先する

17-3. service_role の扱い

方針
・通常の画面処理では多用しない
・管理的な内部処理や移行時に限定する
・Vercel 環境変数で厳重管理する

18. 公開切替設計

18-1. scheduled から published_members_only

MVP方針
・まずは事務局手動公開でもよい

実行内容
・papers.status 更新
・papers.published_at 設定
・visibility を members_only に整合
・threads を open で生成または更新

18-2. published_members_only から free_public

実行内容
・papers.status 更新
・papers.visibility を free_public に更新
・papers.free_public_at 設定
・threads.visibility を free_public に整合
・未ログイン閲覧対応は将来段階的に開放

19. コメント議論期間制御

判定要素
・paper.status
・discussion_start_at
・discussion_end_at
・thread.status

投稿可条件
・status が published_members_only または free_public
・現在日時が discussion_start_at 以上
・現在日時が discussion_end_at 以下
・thread.status = open
・ログイン済み

表示条件
・論文詳細は公開済みなら表示
・コメント入力欄は期間内のみ有効
・期間外は一覧閲覧のみ

20. Supabaseマイグレーション方針

MVPで整備すべきもの
・テーブル作成
・制約作成
・インデックス作成
・RLS有効化
・基本ポリシー作成
・updated_at trigger
・初期 seed 任意

順序方針
1 テーブル作成
2 FK のうち循環しないものを付与
3 current_submission_id FK 追加
4 RLS enable
5 policy 作成
6 trigger 作成

21. 環境変数方針

Next.js 側で必要
・NEXT_PUBLIC_SUPABASE_URL
・NEXT_PUBLIC_SUPABASE_ANON_KEY
・SUPABASE_SERVICE_ROLE_KEY 必要時のみ
・SUPABASE_JWT_SECRET 通常は直接不要
・SITE_URL 必要に応じて

運用方針
・ローカル、Preview、本番で分離
・service role はサーバー限定
・クライアント側へ露出させない

22. MVPで採用しないSupabase機能

・Realtime 本格利用
・Edge Functions 必須化
・Auth Hooks 高度利用
・Storage の public bucket 運用
・複雑な DB function 群
・pgmq やジョブキュー
・全文検索基盤

理由
・3日MVPには過剰
・まずはワークフロー成立を優先する

23. 運用上の注意点

・profiles が未作成だとロール判定できないため、サインアップ後の生成を確実にする
・RLS で詰まりやすいので、まず最小ポリシーで通す
・Storage の private 運用を崩さない
・free_public を実装しても、いきなり public bucket にしない
・事務局ロールの付与フローを明確にしておく
・削除より履歴保持を優先する

24. 次文書との関係

本書の Supabase 設計は、以下の文書に引き継ぐ。

・docs/12_storage_design.md
  ファイル保存ルールとアクセス制御の詳細へ反映する

・docs/13_api_design.md
  認証、認可、入出力仕様へ反映する

・docs/16_test_design.md
  RLS、Storage、認証、議論期間制御のテストに反映する

・docs/17_deploy_operation.md
  Vercel 環境変数、本番運用方針へ反映する

25. 最終判断

Research Session Hub のMVPにおける Supabase は、Auth、Database、RLS、Storage を最小構成で組み合わせ、会員制研究発表プラットフォームとして必要十分な基盤を担う。

本書の最終方針は以下とする。

・認証は Supabase Auth を使う
・ロール管理は profiles.role を正とする
・データ制御は RLS を前提とする
・原稿PDFは private bucket に保存する
・公開制御は papers.status と visibility で行う
・コメント投稿可否は議論期間と thread.status で判定する
・MVPではシンプルで壊れにくい Supabase 設計を優先する
