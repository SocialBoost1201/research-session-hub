文書情報
文書名: テスト設計書
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
- docs/14_validation_error_design.md
- docs/15_admin_console_design.md

1. 本書の目的

本書は、Research Session Hub のMVPにおけるテスト観点、確認項目、優先順位、受け入れ基準を定義し、3日で構築するプロトタイプが最低限の品質で動作することを保証するための指針を示すことを目的とする。

本MVPでは、全機能を網羅的に重く検証するのではなく、投稿、差し戻し、再提出、会員限定公開、コメント議論、一般公開切替という中核ワークフローが壊れていないことを最優先で確認する。

2. テスト設計方針

Research Session Hub のMVPでは、以下の方針でテストを設計する。

・コア業務フローを最優先で検証する
・正常系だけでなく、権限違反、状態不整合、入力不備も確認する
・UI表示、API、DB、Storage の整合を意識する
・MVPのため、E2E観点を重視する
・見た目の細部より、操作成立と制御成立を重視する
・会員限定公開やRLSまわりは重点検証対象にする
・すべて自動化しなくてもよいが、手動確認観点は明文化する

3. テスト対象範囲

本MVPでテスト対象とする範囲は以下とする。

・認証
・ロール制御
・投稿作成
・初回提出
・差し戻し
・再提出
・公開設定
・会員限定公開
・論文一覧、詳細表示
・コメント投稿
・議論期間制御
・一般公開切替
・ファイルアップロード
・ファイル閲覧 signed URL
・管理画面操作

本MVPで深追いしない範囲
・パフォーマンス試験の本格実施
・脆弱性診断の本格実施
・ブラウザ網羅試験
・大規模負荷試験
・全文検索品質検証
・多言語試験

4. テストレベル

4-1. 単体テスト観点

対象
・バリデーション関数
・状態遷移判定関数
・権限判定関数
・日付整合判定
・コメント投稿可否判定

目的
・ロジックの最小単位を壊さない

4-2. 結合テスト観点

対象
・API と DB
・API と Storage
・画面と API
・状態更新と一覧表示
・公開設定とコメント制御

目的
・機能間のつながりを確認する

4-3. 画面テスト観点

対象
・主要画面の表示
・主要導線
・状態に応じたボタン表示切替
・エラー表示

目的
・ユーザーが迷わず操作できることを確認する

4-4. 業務フローテスト観点

対象
・研究発表者の一連の投稿フロー
・事務局の確認から公開までのフロー
・閲覧者の閲覧とコメントフロー

目的
・MVPとして成立しているかを確認する

5. テスト優先度

優先度A
MVP成立に必須
・認証
・権限制御
・投稿
・提出
・差し戻し
・再提出
・公開
・コメント
・議論期間制御
・ファイル閲覧

優先度B
重要だがAの後
・検索、絞り込み
・ユーザー管理
・空状態表示
・アーカイブ

優先度C
余裕があれば
・UI微調整
・細かなメッセージ表現
・ブラウザ差異の細部確認

6. テストユーザー定義

6-1. viewer ユーザー

用途
・会員限定論文の閲覧
・コメント投稿可否確認
・権限不足確認

6-2. presenter ユーザー

用途
・新規投稿
・初回提出
・修正指示確認
・再提出
・自分の投稿閲覧
・他人投稿制限確認

6-3. office ユーザー

用途
・管理画面確認
・差し戻し
・公開設定
・会員限定公開
・一般公開切替
・コメント削除
・ユーザー管理確認

6-4. 未ログインユーザー

用途
・公開画面閲覧
・保護画面へのアクセス拒否
・会員限定論文閲覧拒否確認

7. 正常系テスト観点

7-1. 会員登録

確認内容
・メールアドレス、パスワードで登録できる
・auth.users が作成される
・profiles が作成される
・初期 role が viewer になる

期待結果
・登録後にログイン可能な状態になる

7-2. ログイン

確認内容
・正しい認証情報でログインできる
・ログイン後にマイページへ遷移できる
・role 情報が取得できる

期待結果
・認証済みセッションが有効になる

7-3. presenter による新規投稿作成

確認内容
・必須項目を入力して draft 作成できる
・自分の投稿一覧に表示される
・status が draft になる

期待結果
・papers レコードが作成される

7-4. presenter による初回提出

確認内容
・draft 状態の投稿に PDF を添付して提出できる
・submissions version 1 が作成される
・papers.current_submission_id が更新される
・papers.status が submitted になる

期待結果
・提出成功メッセージが表示される
・一覧で submitted 表示になる

7-5. office による差し戻し

確認内容
・submitted 状態の投稿を開ける
・コメントを入力して差し戻しできる
・reviews が作成される
・papers.status が revision_requested になる

期待結果
・presenter 側で要修正表示になる

7-6. presenter による再提出

確認内容
・revision_requested 状態の投稿を開ける
・修正指示が表示される
・新しい PDF を再提出できる
・submissions version 2 が作成される
・papers.current_submission_id が更新される
・papers.status が resubmitted になる

期待結果
・再提出成功メッセージが表示される

7-7. office による公開設定

確認内容
・resubmitted または submitted 状態で公開日時を設定できる
・議論開始日時、終了日時を設定できる
・papers.status が scheduled になる

期待結果
・公開待ち状態として一覧に表示される

7-8. office による会員限定公開

確認内容
・scheduled 状態の投稿を公開できる
・papers.status が published_members_only になる
・papers.visibility が members_only に整合する
・threads が作成または open になる
・published_at が設定される

期待結果
・viewer と presenter が論文一覧、詳細で閲覧できる

7-9. viewer による会員限定論文閲覧

確認内容
・published_members_only の論文一覧を見られる
・論文詳細を開ける
・PDF閲覧用 signed URL を取得できる

期待結果
・論文本文が閲覧できる

7-10. コメント投稿

確認内容
・議論期間内の論文にコメント投稿できる
・comments が作成される
・一覧に反映される

期待結果
・投稿者名、本文、日時が表示される

7-11. office による一般公開切替

確認内容
・published_members_only 状態から free_public に切り替えできる
・papers.status が free_public になる
・papers.visibility が free_public になる
・threads.visibility が free_public になる

期待結果
・一般公開状態として表示される

7-12. office によるコメント削除

確認内容
・対象コメントを削除できる
・comments.is_deleted が true になる
・UI上で削除済み扱いになる

期待結果
・不適切コメントが非表示または削除済み表示になる

8. 異常系テスト観点

8-1. 未ログイン状態でマイページアクセス

期待結果
・ログイン画面へ遷移する
・APIは UNAUTHORIZED

8-2. viewer による新規投稿作成

期待結果
・画面導線が表示されない
・API直叩きしても FORBIDDEN

8-3. presenter による他人の投稿編集

期待結果
・画面でアクセス不可
・APIは FORBIDDEN または OWNERSHIP_ERROR

8-4. presenter による他人の再提出

期待結果
・APIは FORBIDDEN
・DB更新なし

8-5. submitted 以外への差し戻し

例
・draft 投稿
・scheduled 投稿
・published 投稿

期待結果
・INVALID_STATE
・reviews 作成なし
・status 変更なし

8-6. revision_requested 以外で再提出

例
・draft
・submitted
・scheduled

期待結果
・INVALID_STATE
・新しい submission 作成なし

8-7. scheduled 以外で公開実行

期待結果
・INVALID_STATE
・status 変更なし

8-8. published_members_only 以外で一般公開切替

期待結果
・INVALID_STATE
・status 変更なし

8-9. 議論期間外コメント投稿

期待結果
・DISCUSSION_CLOSED
・comments 作成なし

8-10. closed スレッドへのコメント投稿

期待結果
・DISCUSSION_CLOSED
・comments 作成なし

8-11. PDF以外アップロード

期待結果
・FILE_TYPE_NOT_ALLOWED
・Storage 保存なし
・submission 作成なし

8-12. サイズ超過ファイルアップロード

期待結果
・FILE_TOO_LARGE
・Storage 保存なし
・submission 作成なし

8-13. 存在しない論文詳細アクセス

期待結果
・NOT_FOUND
・画面では404または安全な案内表示

8-14. 存在しない submission の file-url 発行

期待結果
・NOT_FOUND
・URL発行なし

9. 権限制御テスト観点

9-1. role ごとの画面表示

viewer
・管理画面導線なし
・投稿作成導線なし

presenter
・投稿作成導線あり
・管理画面導線なし

office
・管理画面導線あり
・投稿一覧導線あり

9-2. role ごとのAPIアクセス

viewer
・/api/office/* 不可
・/api/my/papers POST 不可

presenter
・/api/office/* 不可
・自分の /api/my/papers/* 可
・他人所有の paper 関連は不可

office
・/api/office/* 可
・全 paper 閲覧可

9-3. RLS確認

確認対象
・viewer が未公開 papers を読めない
・presenter が他人の submissions を読めない
・office が必要範囲を読める
・comments insert が議論期間外で拒否されること

10. 状態遷移テスト観点

10-1. 正常遷移

確認対象
・draft -> submitted
・submitted -> revision_requested
・submitted -> scheduled
・revision_requested -> resubmitted
・resubmitted -> revision_requested
・resubmitted -> scheduled
・scheduled -> published_members_only
・published_members_only -> free_public
・published_members_only -> archived
・free_public -> archived

期待結果
・状態が正しく更新される
・関連時刻や関連テーブルが整合する

10-2. 不正遷移

確認対象
・draft -> scheduled
・submitted -> free_public
・revision_requested -> published_members_only
・published_members_only -> submitted
・archived -> submitted

期待結果
・すべて拒否される
・DB更新なし

11. ファイル、Storageテスト観点

11-1. 初回提出時の Storage 保存

確認内容
・paperId と versionNo を含む正しいパスに保存される
・submissions.file_path と一致する

11-2. 再提出時の版分離

確認内容
・v1 を上書きしない
・v2 が別保存される
・current_submission_id が v2 を指す

11-3. signed URL 発行

確認内容
・権限のあるユーザーのみ取得できる
・期限つき URL が返る
・権限のないユーザーは取得できない

11-4. file_path 不整合時の失敗

確認内容
・安全にエラーになる
・画面が全面崩壊しない

12. コメント機能テスト観点

12-1. コメント一覧表示

確認内容
・作成順に表示される
・削除済みは適切にマスクされる
・投稿者名が表示される

12-2. コメント投稿

確認内容
・空白のみは拒否
・上限超過は拒否
・議論期間内のみ成功

12-3. コメント削除

確認内容
・office のみ可能
・一般ユーザーは不可
・論理削除として反映される

13. 管理画面テスト観点

13-1. ダッシュボード表示

確認内容
・状態別件数が表示される
・最近更新一覧が表示される
・リンク遷移できる

13-2. 投稿一覧

確認内容
・状態、カテゴリで絞り込みできる
・対象詳細へ遷移できる
・要対応状態が識別しやすい

13-3. 投稿詳細

確認内容
・概要、提出履歴、レビュー履歴が表示される
・差し戻し、公開設定、公開切替、コメント管理が状態に応じて表示される

14. バリデーションテスト観点

14-1. 必須項目

確認対象
・title
・abstract
・category
・author_name
・affiliation
・comment body
・file

期待結果
・未入力時は送信不可またはサーバー拒否

14-2. 文字数境界値

確認対象
・title 最大値
・abstract 最大値
・comment body 最大値

期待結果
・上限以下は成功
・上限超過は拒否

14-3. 日付整合

確認対象
・discussion_end_at < discussion_start_at
・discussion_start_at < scheduled_publish_at

期待結果
・不正な設定は拒否
・分かりやすいエラー表示

15. UI表示テスト観点

15-1. 状態バッジ表示

確認内容
・一覧と詳細に正しい状態が表示される

15-2. ボタン表示切替

確認内容
・状態に応じて不要ボタンが表示されない
・権限に応じて不要ボタンが表示されない

15-3. エラー表示

確認内容
・フォーム直下に表示される
・ページ上部に表示される
・操作失敗時にユーザーが原因を理解できる

16. 受け入れ基準

以下を満たした場合、本MVPは受け入れ可能とする。

・viewer presenter office の3ロールで基本導線が成立する
・presenter が新規投稿し、PDF提出できる
・office が差し戻しできる
・presenter が再提出できる
・office が公開設定し、会員限定公開できる
・viewer が会員限定論文を閲覧できる
・議論期間内のみコメント投稿できる
・office が一般公開切替できる
・不正権限操作と不正状態遷移が拒否される
・Storage と DB の整合が保たれる
・重大な画面崩れなく主要導線を完走できる

17. 推奨テスト実行順

1 認証確認
2 ロール確認
3 presenter 投稿作成
4 初回提出
5 office 差し戻し
6 presenter 再提出
7 office 公開設定
8 office 会員限定公開
9 viewer 閲覧
10 コメント投稿
11 office 一般公開切替
12 権限違反、状態違反の異常系確認

18. テストデータ準備方針

最低限必要なデータ
・viewer 1名
・presenter 1名
・office 1名
・draft paper 1件
・submitted paper 1件
・revision_requested paper 1件
・resubmitted paper 1件
・scheduled paper 1件
・published_members_only paper 1件
・free_public paper 1件
・comments 数件

目的
・各状態と各画面をすぐ確認できるようにする

19. MVPにおけるテスト簡略化方針

・自動テストが薄くてもよいが、優先度Aの手動確認は必須
・全ブラウザ網羅はしない
・モバイルは主要画面の崩れ確認に留める
・検索品質の深い検証は後回し
・アーカイブの細かい運用は簡易確認でよい

20. 次文書との関係

本書のテスト設計は、以下の文書に引き継ぐ。

・docs/17_deploy_operation.md
  本番反映前確認項目へ反映する

・docs/18_development_plan_3days.md
  実装順序と確認タイミングへ反映する

21. 最終判断

Research Session Hub のMVPでは、投稿、差し戻し、再提出、公開、議論という一連の流れが成立していることが品質の中核である。

本書の最終方針は以下とする。

・優先度AのE2E観点を最優先で確認する
・権限違反と状態違反は必ず拒否されることを確認する
・Storage と DB の不整合を起こしにくい設計になっていることを確認する
・MVPとして必要十分な範囲にテストを絞り、短期間でも事故りにくい品質を確保する
