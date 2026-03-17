文書情報
文書名: 3日開発タスク分解書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/01_requirements.md
- docs/06_function_list.md
- docs/07_role_permission.md
- docs/08_status_transition.md
- docs/09_database_design.md
- docs/11_supabase_design.md
- docs/12_storage_design.md
- docs/13_api_design.md
- docs/16_test_design.md
- docs/17_deploy_operation.md

1. 本書の目的

本書は、Research Session Hub のMVPを3日以内で動作する状態まで到達させるために、実装対象を優先順位順に分解し、Day1、Day2、Day3 の作業単位、完了条件、確認項目を明確化することを目的とする。

本MVPでは、すべてを完璧に作ることではなく、研究発表者による投稿、事務局による差し戻しと公開、会員限定閲覧、コメント議論までの中核フローを壊さず通すことが最重要である。

2. 開発計画の前提

2-1. 技術前提

・Next.js App Router
・TypeScript
・Supabase Auth
・Supabase Postgres
・Supabase Storage
・Vercel

2-2. 開発方針

・設計に沿って最小構成で作る
・UIの豪華さより動作成立を優先する
・1機能ずつ完了条件を持たせる
・状態遷移と権限制御を先に固める
・StorageとDB整合を崩さない
・手動運用で吸収できる部分は後回しにする

2-3. 3日MVPの成功条件

・presenter が新規投稿できる
・PDF初回提出できる
・office が差し戻しできる
・presenter が再提出できる
・office が公開設定できる
・office が会員限定公開できる
・viewer が会員限定論文を閲覧できる
・議論期間内のみコメント投稿できる
・office が一般公開切替できる

3. 実装優先順位

優先度A
・認証
・profiles ロール判定
・papers
・submissions
・投稿作成
・初回提出
・管理画面最低限
・差し戻し
・再提出
・公開設定
・会員限定公開
・論文一覧、詳細
・PDF閲覧
・コメント投稿
・議論期間制御

優先度B
・一般公開切替
・コメント削除
・ユーザー管理最小
・検索、絞り込み

優先度C
・細かなUI調整
・成功通知改善
・空状態改善
・軽微なUX改善

4. Day1 目標

Day1 の目的
土台を完成させる

Day1 完了時点で目指す状態
・ログインできる
・ロール判定できる
・DBとStorageがつながる
・presenter が draft 作成できる
・PDF初回提出まで成立する

5. Day1 タスク詳細

5-1. プロジェクト基盤セットアップ

作業内容
・Next.js App Router プロジェクト準備
・TypeScript 設定確認
・Supabase クライアント構成作成
・ server 用 client と browser 用 client の分離
・共通 env 読み込み確認
・基本レイアウト作成

成果物
・アプリ起動
・Supabase 接続確認

完了条件
・トップページが表示される
・Supabase に接続できる

5-2. 認証基盤実装

作業内容
・会員登録画面
・ログイン画面
・ログアウト導線
・認証ガード
・未ログイン時のリダイレクト

成果物
・/login
・/signup
・認証状態取得処理
・保護ページガード

完了条件
・会員登録できる
・ログインできる
・未ログインで保護ページへ入れない

5-3. profiles とロール判定実装

作業内容
・profiles 作成処理
・初期 role viewer
・マイページ表示
・role に応じた導線出し分け

成果物
・/mypage
・GET current user role 処理

完了条件
・ログインユーザーの role が取得できる
・role に応じて導線が切り替わる

5-4. DBスキーマ初期反映

作業内容
・profiles
・papers
・submissions
・reviews
・threads
・comments
作成
・制約
・インデックス
・updated_at trigger
・基本RLS有効化

成果物
・DB migration 初版

完了条件
・全主要テーブルが作成されている
・最低限の select insert が通る

5-5. 新規投稿 draft 作成実装

作業内容
・新規投稿画面
・タイトル、概要、カテゴリ、著者名、所属入力
・draft 保存
・自分の投稿一覧表示

成果物
・/my/papers
・/my/papers/new もしくは submit 画面
・POST /api/my/papers
・GET /api/my/papers

完了条件
・presenter が draft を作成できる
・一覧に表示される

5-6. 初回PDF提出実装

作業内容
・PDFアップロードUI
・Storage paper-files バケット接続
・version_no = 1 採番
・submissions 作成
・papers.current_submission_id 更新
・papers.status を submitted に更新

成果物
・POST /api/my/papers/:paperId/submit
・Storage 保存処理
・提出成功表示

完了条件
・draft から submitted へ遷移できる
・Storage にPDF保存される
・submissions version 1 が作成される

5-7. Day1 確認項目

・会員登録できる
・ログインできる
・presenter ロールで新規投稿導線が見える
・draft 保存できる
・初回提出できる
・submitted が一覧に表示される
・Storage にPDFが保存される

6. Day2 目標

Day2 の目的
運用ワークフローを完成させる

Day2 完了時点で目指す状態
・office が管理画面に入れる
・投稿一覧と投稿詳細が見られる
・差し戻しできる
・presenter が再提出できる
・公開設定できる
・scheduled 状態まで遷移できる

7. Day2 タスク詳細

7-1. office 管理画面基盤実装

作業内容
・事務局ダッシュボード
・事務局投稿一覧
・事務局投稿詳細
・office ガード
・viewer presenter の管理画面拒否

成果物
・/office
・/office/papers
・/office/papers/:paperId

完了条件
・office のみ管理画面に入れる
・一覧から詳細へ遷移できる

7-2. 差し戻し機能実装

作業内容
・差し戻しコメント入力
・reviews 作成
・papers.status を revision_requested に更新
・presenter 側一覧で要修正表示

成果物
・POST /api/office/papers/:paperId/request-revision
・差し戻しボックスUI

完了条件
・submitted または resubmitted に差し戻しできる
・reviews に履歴が残る
・presenter が修正指示を見られる

7-3. 再提出機能実装

作業内容
・再提出画面
・修正指示表示
・version_no 採番
・Storage へ新パス保存
・submissions 新規作成
・papers.current_submission_id 更新
・papers.status を resubmitted に更新

成果物
・/my/papers/:paperId/resubmit
・POST /api/my/papers/:paperId/resubmit

完了条件
・revision_requested から resubmitted へ遷移できる
・version 2 以降が保存される
・旧版が残る

7-4. 公開設定実装

作業内容
・公開日時入力
・議論開始日時入力
・議論終了日時入力
・papers.status を scheduled に更新
・バリデーション実装

成果物
・POST /api/office/papers/:paperId/schedule
・事務局投稿詳細内公開設定UI

完了条件
・submitted または resubmitted から scheduled に遷移できる
・日時整合チェックが働く

7-5. 事務局ダッシュボード簡易実装

作業内容
・状態別件数集計
・最近更新投稿一覧
・一覧導線

成果物
・GET /api/office/dashboard
・事務局ダッシュボード画面

完了条件
・submitted
・revision_requested
・resubmitted
・scheduled
・published
件数が見える

7-6. Day2 確認項目

・office が全投稿一覧を見られる
・office が投稿詳細を見られる
・差し戻しできる
・presenter が再提出できる
・version が増える
・office が公開設定できる
・scheduled 状態になる

8. Day3 目標

Day3 の目的
公開と議論を成立させて本番相当に仕上げる

Day3 完了時点で目指す状態
・会員限定公開できる
・viewer が閲覧できる
・コメント投稿できる
・議論期間外はコメントできない
・一般公開切替できる
・最低限の本番確認が終わる

9. Day3 タスク詳細

9-1. 論文一覧、詳細ページ実装

作業内容
・論文一覧ページ
・論文詳細ページ
・公開済み論文のみ表示
・状態バッジ表示
・議論期間表示

成果物
・/papers
・/papers/:paperId
・GET /api/papers
・GET /api/papers/:paperId

完了条件
・viewer presenter office が公開論文を閲覧できる
・未公開論文は一般ユーザーに見えない

9-2. 会員限定公開実装

作業内容
・scheduled -> published_members_only
・published_at 設定
・visibility members_only 整合
・threads 作成または open 化

成果物
・POST /api/office/papers/:paperId/publish

完了条件
・scheduled 論文を会員限定公開できる
・論文一覧に表示される
・viewer が閲覧できる

9-3. PDF閲覧 signed URL 実装

作業内容
・論文閲覧権限確認
・current_submission_id から file_path 取得
・signed URL 発行
・論文詳細に PDF閲覧導線設置

成果物
・POST /api/papers/:paperId/file-url
・必要なら POST /api/submissions/:submissionId/file-url

完了条件
・権限あるユーザーだけ PDF を閲覧できる
・権限ないユーザーは取得できない

9-4. コメント機能実装

作業内容
・threads 取得
・comments 一覧取得
・コメント投稿
・議論期間判定
・thread.status 判定

成果物
・GET /api/papers/:paperId/comments
・POST /api/papers/:paperId/comments
・論文詳細ページ内コメントUI

完了条件
・議論期間内だけコメント投稿できる
・投稿後一覧に表示される

9-5. コメント削除最小実装

作業内容
・office による論理削除
・is_deleted 更新
・UI 上の削除済み表示

成果物
・DELETE /api/office/comments/:commentId

完了条件
・office が不適切コメントを削除できる

9-6. 一般公開切替実装

作業内容
・published_members_only -> free_public
・visibility free_public 更新
・free_public_at 設定
・threads.visibility 更新

成果物
・POST /api/office/papers/:paperId/free-publish

完了条件
・一般公開切替できる
・状態表示が反映される

9-7. 最低限の運用仕上げ

作業内容
・エラーメッセージ整備
・成功通知整備
・空状態表示
・主要導線の見直し
・本番環境変数確認
・Vercel デプロイ
・事務局初期ユーザー確認

完了条件
・主要画面が崩れず使える
・本番相当で通し確認できる

9-8. Day3 確認項目

・office が会員限定公開できる
・viewer が論文を閲覧できる
・PDFが見られる
・コメント投稿できる
・議論期間外は投稿できない
・office が一般公開切替できる
・コメント削除できる

10. 日別完了条件まとめ

10-1. Day1 完了条件

・認証が動く
・profiles が動く
・draft 作成できる
・初回提出できる

10-2. Day2 完了条件

・管理画面が動く
・差し戻しできる
・再提出できる
・公開設定できる

10-3. Day3 完了条件

・会員限定公開できる
・閲覧できる
・コメントできる
・一般公開切替できる
・本番反映可能な最低限品質になる

11. 実装順序の理由

11-1. 認証を最初にやる理由

・すべての権限判定の起点だから
・会員限定公開の前提だから
・後から入れると画面作り直しが増えるから

11-2. 投稿と提出を先にやる理由

・このプロダクトの中核だから
・ここが壊れると全体が無意味だから

11-3. 管理画面をDay2に置く理由

・投稿データがないと管理画面が作りにくいから
・提出実体がある状態で確認した方が速いから

11-4. 公開とコメントをDay3に置く理由

・前段の状態遷移ができてからでないと成立しないから
・最後にE2Eで通しやすいから

12. 並行して意識すべきこと

・RLS は後回しにしすぎない
・Storage private を崩さない
・current_submission_id の整合を壊さない
・status 遷移をショートカットしない
・UIの見た目より、ボタン表示条件を先に合わせる
・ローカルと本番で環境変数差異を確認する

13. Day別リスクと回避策

13-1. Day1 リスク

リスク
・Auth と profiles 連携で詰まる
・Storage アップロードで詰まる
・RLS で insert が通らない

回避策
・最初は最小ポリシーで通す
・Auth 後の profiles 作成を早めに確認
・Storage バケット接続を先に単独確認する

13-2. Day2 リスク

リスク
・状態遷移が複雑化する
・差し戻しと再提出の整合が崩れる
・管理画面を作り込みすぎる

回避策
・status は設計書通り固定
・差し戻しコメント履歴は reviews に寄せる
・管理画面は一覧と詳細の2画面中心に留める

13-3. Day3 リスク

リスク
・閲覧権限で詰まる
・signed URL で詰まる
・議論期間判定でコメントが落ちる
・一般公開切替で visibility 整合が崩れる

回避策
・paper.status と visibility を同時に確認する
・file-url API を単体確認する
・discussion_start_at discussion_end_at を固定テストする
・free_public 切替時に thread.visibility も更新する

14. 3日で削るべきもの

削るもの
・通知メール
・高度な検索
・返信スレッド本格実装
・グラフ付きダッシュボード
・細かなUI装飾
・自動公開バッチ
・公開専用管理画面
・コメント専用管理画面
・本格ユーザー管理画面
・全文検索
・査読者機能

理由
・コアワークフローに不要
・3日で品質を落とす原因になる

15. デイリー最終確認チェック

15-1. Day1 夜

・ログイン通るか
・draft 作成できるか
・初回提出できるか
・DBとStorage整合しているか

15-2. Day2 夜

・差し戻しできるか
・再提出できるか
・schedule できるか
・状態が正しく見えるか

15-3. Day3 夜

・publish できるか
・viewer で読めるか
・PDF開けるか
・コメントできるか
・free_public に切り替えられるか

16. 最終リリース前の通し確認

シナリオ
1 presenter でログイン
2 新規投稿作成
3 PDF提出
4 office で差し戻し
5 presenter で再提出
6 office で公開設定
7 office で会員限定公開
8 viewer で閲覧
9 viewer でコメント投稿
10 office で一般公開切替

この通しが成功すれば、MVPとして成立していると判断する

17. 最終判断

Research Session Hub の3日MVPでは、Day1で土台、Day2で運用ワークフロー、Day3で公開と議論を完成させる進め方が最も合理的である。

本書の最終方針は以下とする。

・Day1 は認証、投稿、初回提出まで
・Day2 は管理画面、差し戻し、再提出、公開設定まで
・Day3 は会員限定公開、閲覧、コメント、一般公開切替まで
・UI作り込みよりコアフロー成立を優先する
・最終日は必ずE2E通し確認で締める
