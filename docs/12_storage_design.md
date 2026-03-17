文書情報
文書名: ストレージ設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/09_database_design.md
- docs/10_er_diagram.md
- docs/11_supabase_design.md

1. 本書の目的

本書は、Research Session Hub のMVPにおけるファイル保存方式を定義し、研究発表原稿PDFの保存先、命名規則、アクセス制御、再提出時の版管理、公開時の参照方式を明確化することを目的とする。

本MVPでは、原稿提出と再提出が中核機能であり、かつ会員限定公開が前提であるため、Storage 設計は単なるファイル置き場ではなく、権限制御の重要な一部として扱う。

2. ストレージ設計方針

Research Session Hub のストレージ設計は、以下の方針で行う。

・保存対象は原則として研究発表原稿PDFに限定する
・Supabase Storage を採用する
・バケットは private 運用を基本とする
・ファイルは論文単位、版単位で整理する
・再提出時は上書きせず、新版として保持する
・閲覧時は権限確認後に signed URL を利用する
・会員限定公開と一般公開切替の両方に耐えられる構造にする
・MVPではシンプルかつ誤公開しにくい構造を優先する

3. 保存対象

MVPで Storage に保存する対象は以下とする。

・研究発表原稿PDF

MVPでは保存しないもの
・画像添付
・補足資料ZIP
・動画
・音声
・プロフィール画像
・外部公開用派生ファイル

4. バケット設計

4-1. 採用バケット

バケット名
paper-files

用途
・研究発表原稿PDFの保存

公開設定
・private

理由
・会員限定公開を前提とするため
・誤って URL が露出しても無条件参照できないようにするため
・free_public への切替もアプリ側で柔軟に制御しやすいため

4-2. 将来追加し得るバケット

MVP対象外
・avatars
・public-assets
・supplementary-files

5. パス設計

5-1. 基本保存パス

推奨保存パス
papers/{paperId}/v{versionNo}/{filename}

フルイメージ
paper-files/papers/{paperId}/v{versionNo}/{filename}

例
paper-files/papers/3f2c9b7e-xxxx/v1/main-paper.pdf
paper-files/papers/3f2c9b7e-xxxx/v2/main-paper-revised.pdf

5-2. パス設計の理由

・論文単位で整理できる
・版単位でディレクトリが分かれる
・再提出時に上書き事故が起きにくい
・submissions.version_no と対応づけやすい
・Storage と DB の整合が取りやすい

5-3. filename の扱い

推奨
・元ファイル名をそのまま使ってもよい
・ただし安全のためサニタイズする
・空白や危険文字を除去する
・長すぎるファイル名は短縮する

推奨例
original-paper.pdf
revised-manuscript.pdf

MVP方針
・元ファイル名を保持しつつ、保存時は安全な形式に変換する
・表示用ファイル名は submissions.file_name に保持する
・実保存パスは submissions.file_path に保持する

6. DBとの対応関係

6-1. submissions テーブルとの関係

submissions が保持する項目
・file_path
・file_name
・version_no

意味
・file_path は Storage 上の実保存先
・file_name は画面表示用
・version_no は版管理用

6-2. papers.current_submission_id との関係

・papers.current_submission_id が最新版提出版を指す
・論文詳細や管理画面では、基本的に current_submission_id 経由で最新版PDFを参照する
・過去版履歴表示時は submissions 一覧から参照する

7. アップロード設計

7-1. 初回提出時

流れ
1 presenter が新規投稿または投稿編集画面でPDFを選択
2 サーバー側で入力内容を検証
3 paper レコードが存在することを確認
4 version_no = 1 を採番
5 Storage にアップロード
6 submissions レコード作成
7 papers.current_submission_id 更新
8 papers.status を submitted に変更

7-2. 再提出時

流れ
1 presenter が revision_requested 状態の投稿に対して修正版PDFを選択
2 既存 submissions から最大 version_no を取得
3 新しい version_no を採番
4 新しい保存パスへアップロード
5 submissions レコードを新規作成
6 papers.current_submission_id 更新
7 papers.status を resubmitted に変更

7-3. 上書き禁止方針

・同一版パスへの上書きは原則禁止
・再提出は必ず新しい version_no を作る
・過去版は保持する
・運用上のミスでも履歴を失わないようにする

8. ダウンロード、閲覧設計

8-1. 基本方針

・Storage を public にしない
・閲覧前にアプリ側で権限確認する
・許可されたユーザーに対してのみ短寿命の signed URL を発行する

8-2. 閲覧時の流れ

1 ユーザーが論文詳細ページを開く
2 サーバー側で対象論文の status、visibility、所有者、role を確認
3 閲覧権限がある場合のみ current_submission_id から file_path を取得
4 signed URL を生成
5 PDF閲覧ボタンまたはダウンロードボタンで利用する

8-3. signed URL の方針

推奨
・短寿命
・数分から十数分程度
・毎回生成でもよい

理由
・会員限定ファイルの露出リスクを下げるため
・共有URLの悪用を抑止するため

MVP方針
・論文詳細表示時またはボタン押下時に発行する
・寿命は短めに設定する

9. アクセス制御設計

9-1. 未ログインユーザー

会員限定論文
・不可

free_public
・将来対応余地あり
・MVPでは原則アプリ経由の制御に留める

9-2. viewer

許可
・published_members_only の論文PDF閲覧
・free_public の論文PDF閲覧

禁止
・未公開論文PDF
・他人の提出履歴全体閲覧
・アップロード

9-3. presenter

許可
・自分の投稿PDFの閲覧
・自分の投稿PDFのアップロード
・公開済み論文の閲覧

禁止
・他人の未公開論文PDF閲覧
・他人の投稿へのアップロード

9-4. office

許可
・全論文PDF閲覧
・全提出版PDF参照

禁止
・原則として利用者になりすましてアップロードすることはしない
・ただし内部運用で必要な場合は別扱い

10. 状態別アクセス制御

10-1. draft

アクセス可能
・投稿者本人
・必要に応じて事務局

閲覧対象
・自分のアップロード済み下書きPDF

10-2. submitted

アクセス可能
・投稿者本人
・事務局

閲覧対象
・最新版提出PDF
・必要に応じて過去版

10-3. revision_requested

アクセス可能
・投稿者本人
・事務局

閲覧対象
・差し戻し対象版
・過去版

10-4. resubmitted

アクセス可能
・投稿者本人
・事務局

閲覧対象
・最新版再提出PDF
・過去版

10-5. scheduled

アクセス可能
・投稿者本人
・事務局

閲覧対象
・公開予定版PDF

10-6. published_members_only

アクセス可能
・ログイン済み会員
・投稿者本人
・事務局

閲覧対象
・current_submission_id が指す最新版PDF

10-7. free_public

アクセス可能
・MVPではログイン済みユーザー中心
・将来は未ログイン閲覧も可

閲覧対象
・最新版PDF

10-8. archived

アクセス可能
・運用方針に応じる
・MVPではログイン済み閲覧を基本にしてもよい

11. Storageセキュリティ方針

11-1. private bucket 前提

・URL直打ちで参照できない
・signed URL のみで時限アクセス可能
・RLSだけに頼らず、アプリ側認可でも二重に守る

11-2. MIME制御

許可形式
・application/pdf

拒否対象
・画像
・実行ファイル
・HTML
・不正拡張子

11-3. ファイルサイズ制限

MVP推奨
・上限を設定する
・例 20MB から 50MB 程度

理由
・不必要な大容量アップロード防止
・Vercel、Supabase運用負荷抑制
・悪用リスク抑制

11-4. ファイル名サニタイズ

・危険な文字列を除去
・パストラバーサル対策
・制御文字除去
・拡張子偽装は MIME で再確認

12. Storage運用ルール

12-1. 提出時の原則

・毎回新規版として保存する
・同じファイル名でも versionNo で分離する
・DB登録成功前後の整合に注意する

12-2. 障害時の扱い

アップロード成功、DB失敗
・孤立ファイルが発生する可能性がある
・MVPでは運用で清掃可能
・将来はトランザクション的整理バッチを検討

DB成功、アップロード失敗
・submission を作らない
・エラーを返す
・不整合を防ぐ

12-3. 削除方針

MVPでは原稿ファイルの物理削除は原則行わない
理由
・履歴保持が必要
・再提出履歴が重要
・監査的にも残すべき

12-4. アーカイブ時

・ファイルは残す
・論文状態でアクセス制御する
・Storage 上で移動は不要

13. Storageと公開切替の関係

13-1. 会員限定公開

・published_members_only 時は、会員のみ signed URL を取得可能
・Storage 自体は private のまま

13-2. 一般公開切替

free_public 時の選択肢
1 private のままアプリ経由で未ログインにも signed URL 発行
2 public bucket へ複製
3 CDN向け配布設計へ変更

MVP方針
・1 を採用する
・bucket は private のまま維持する
・public bucket へ移さない

理由
・実装が単純
・誤公開リスクが低い
・会員限定との切替整合が取りやすい

14. 画面別利用方針

14-1. 新規投稿ページ

必要処理
・PDFアップロード
・version 1 保存
・ファイル名表示

14-2. 再提出ページ

必要処理
・新しい versionNo の採番
・新パス保存
・旧版保持

14-3. 投稿詳細確認ページ

必要処理
・提出履歴ごとの file_name 表示
・必要なら最新版参照
・事務局コメントとの対応確認

14-4. 論文詳細ページ

必要処理
・最新版PDFの閲覧ボタン表示
・権限がある場合のみ signed URL 発行
・権限がない場合は非表示またはエラー表示

14-5. 事務局投稿詳細ページ

必要処理
・最新版PDF参照
・過去版参照
・版履歴確認

15. 想定保存例

例 1
論文ID
paper-001

初回提出
paper-files/papers/paper-001/v1/main-paper.pdf

再提出
paper-files/papers/paper-001/v2/main-paper-revised.pdf

再再提出
paper-files/papers/paper-001/v3/final-revision.pdf

submissions 対応
v1
file_path = papers/paper-001/v1/main-paper.pdf

v2
file_path = papers/paper-001/v2/main-paper-revised.pdf

v3
file_path = papers/paper-001/v3/final-revision.pdf

16. エラーケース設計

16-1. 不正ファイル形式

対応
・アップロード拒否
・PDFのみ対応メッセージ表示

16-2. サイズ超過

対応
・アップロード拒否
・上限サイズメッセージ表示

16-3. 権限なし閲覧

対応
・signed URL 発行しない
・論文閲覧権限がありませんと表示

16-4. file_path 不整合

対応
・参照エラー表示
・事務局側で確認できるログを残すのが望ましい

16-5. 版番号競合

対応
・サーバー側で versionNo を採番
・クライアント任せにしない
・ユニーク制約で二重防止する

17. 将来拡張余地

将来追加し得るもの
・補足資料バケット
・画像添付
・公開用サムネイル生成
・PDFテキスト抽出
・ウイルススキャン
・OCR
・公開用静的コピー
・イベント別フォルダ階層
・著者補助ファイル

18. 次文書との関係

本書のストレージ設計は、以下の文書に引き継ぐ。

・docs/13_api_design.md
  アップロード、閲覧、signed URL 発行APIへ反映する

・docs/16_test_design.md
  アップロード制御、権限、版管理、誤公開防止テストへ反映する

・docs/17_deploy_operation.md
  Supabase Storage 運用と環境設定へ反映する

19. 最終判断

Research Session Hub のMVPでは、原稿PDFを Supabase Storage の private bucket に保存し、論文単位、版単位で整理する構造を採用する。

本書の最終方針は以下とする。

・バケットは paper-files の1つで十分
・保存パスは papers/{paperId}/v{versionNo}/{filename} を採用する
・再提出時は上書きせず、新版を追加する
・閲覧は signed URL で行う
・会員限定公開と一般公開切替の両方で private bucket を維持する
・履歴保持を優先し、物理削除は原則行わない
