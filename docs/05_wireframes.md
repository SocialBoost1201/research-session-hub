文書情報
文書名: ワイヤーフレーム設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/01_requirements.md
- docs/02_screen_list.md
- docs/03_user_flow.md
- docs/04_screen_transition.md

1. 本書の目的

本書は、Research Session Hub のMVPで必要となる主要画面のUI骨組みを定義し、各画面に何をどこへ配置するかを明確化することを目的とする。

本書で定義する内容は、あくまでワイヤーフレームであり、最終デザインやビジュアル表現の確定資料ではない。
3日MVPでの構築を前提とし、見た目の作り込みよりも、操作導線の明確さ、状態の分かりやすさ、管理運用のしやすさを優先する。

2. ワイヤーフレーム設計方針

Research Session Hub のワイヤーフレームは以下の方針で設計する。

・1画面1目的を明確にする
・主要CTAを迷わない位置に置く
・ステータス、権限、公開状態を視認しやすくする
・研究発表者は次アクションがすぐ分かるUIにする
・事務局は一覧性と処理性を最優先にする
・閲覧者は論文閲覧と議論参加に集中できる構造にする
・3日MVPのため、複雑なUIコンポーネントは避ける
・PC優先で設計しつつ、モバイルでも崩れにくい1カラムまたは簡易2カラム構成を採用する

3. 共通レイアウト方針

3-1. 公開画面共通レイアウト

上部
・ロゴ
・論文一覧
・研究発表について
・ログイン
・会員登録

本文
・ページ固有の主要コンテンツ

下部
・著作権表記
・利用案内
・簡易リンク

3-2. 会員画面共通レイアウト

上部
・ロゴ
・マイページ
・論文一覧
・自分の投稿
・事務局導線 ロール保有時のみ
・ログアウト

本文
・左に簡易メニューまたはページ補助ナビ
・右または中央にメインコンテンツ

3-3. 事務局画面共通レイアウト

上部
・ロゴ
・ダッシュボード
・投稿一覧
・公開管理 必要時
・ユーザー管理 必要時
・ログアウト

本文
・上部にサマリーカード
・中段に絞り込みエリア
・下段に一覧または詳細エリア

3-4. ページ共通要素

全画面で必要に応じて表示する要素
・ページタイトル
・パンくずまたは戻る導線
・現在状態バッジ
・エラーメッセージ表示領域
・成功メッセージ表示領域
・ローディング表示領域

4. 主要画面ワイヤーフレーム

4-1. トップページ

画面目的
・Research Session Hub の概要を伝える
・ログイン、会員登録、論文閲覧、研究投稿への導線を提供する

構成
上部ヘッダー
・左 ロゴ
・右 論文一覧
・右 ログイン
・右 会員登録

メインヒーロー
・大見出し
  研究発表を、投稿から議論までWebで完結
・説明文
  会員限定公開、修正依頼、再提出、コメント議論までを一元管理
・CTA1 会員登録
・CTA2 論文一覧を見る

特徴紹介セクション
・投稿
・確認
・再提出
・会員限定公開
・コメント議論
・後日一般公開

利用フロー紹介
・研究発表者
・事務局
・閲覧者
を簡易3ステップまたは4ステップで表示

公開中論文導線セクション
・注目論文カード数件
・一覧へ進むボタン

フッター
・利用案内
・問い合わせ想定リンク
・著作権表記

簡易レイアウト図
[Header]
  Logo | Papers | Login | Sign Up

[Hero]
  Title
  Description
  CTA Sign Up
  CTA Browse Papers

[Features]
  Card Card Card Card Card

[How It Works]
  Presenter | Office | Viewer

[Featured Papers]
  Paper Card List

[Footer]

UIポイント
・最上部で会員制サイトであることを明示
・ヒーローでサービス価値を即伝える
・CTAは会員登録と論文一覧の2本に絞る

4-2. 会員登録ページ

画面目的
・新規ユーザー登録

構成
上部
・ロゴ
・ログイン導線

中央フォームカード
・ページタイトル
・メールアドレス
・パスワード
・登録ボタン
・ログイン導線
・注意事項

簡易レイアウト図
[Header]
  Logo | Login

[Centered Card]
  Title
  Email Input
  Password Input
  Submit Button
  Link to Login
  Notes

UIポイント
・中央1カラム
・余計な情報を置かない
・登録後の行き先がイメージできる短い補足文を置く

4-3. ログインページ

画面目的
・既存会員ログイン

構成
上部
・ロゴ
・会員登録導線

中央フォームカード
・ページタイトル
・メールアドレス
・パスワード
・ログインボタン
・会員登録導線
・エラー表示領域

簡易レイアウト図
[Header]
  Logo | Sign Up

[Centered Card]
  Title
  Email Input
  Password Input
  Login Button
  Link to Sign Up
  Error Message

UIポイント
・ログイン失敗時の文言をフォーム直上または直下へ表示
・保護ページから来た場合はログイン後に戻る案内を出してもよい

4-4. 論文一覧ページ

画面目的
・公開中の論文を探して閲覧する

構成
上部
・ページタイトル
・検索バー
・カテゴリフィルタ
・公開状態フィルタ
・議論中フィルタ

本文
・論文カード一覧 または テーブル
各カードに表示
・タイトル
・著者
・所属
・概要抜粋
・公開状態バッジ
・議論中バッジ
・公開日
・詳細を見るボタン

空状態
・該当論文なしメッセージ

簡易レイアウト図
[Header]

[Page Title]
  論文一覧

[Filter Row]
  Search | Category | Visibility | Discussion Status

[Paper List]
  [Card]
    Title
    Authors
    Affiliation
    Abstract excerpt
    Status Badges
    Published Date
    View Detail Button

UIポイント
・一覧性重視
・バッジで
  会員限定
  一般公開
  議論中
  議論終了
を即判別可能にする
・MVPではページネーションより件数少なめ前提でよい

4-5. 論文詳細ページ

画面目的
・論文詳細の確認
・原稿閲覧
・コメント議論参加

構成
上部
・戻る 論文一覧へ
・タイトル
・公開状態バッジ
・議論状態バッジ

メイン2カラム 推奨
左メイン
・タイトル
・著者名
・所属
・概要
・カテゴリ
・公開日
・議論期間
・PDF閲覧ボタン
・PDFダウンロードボタン 任意
・関連情報

右サイド
・コメントスレッド
・コメント投稿欄
・議論可能期間表示
・投稿不可時メッセージ

モバイル時
・1カラムに縦積み

簡易レイアウト図
[Back to Papers]

[Title]
  Status Badge | Discussion Badge

[Main Content]
  [Left]
    Authors
    Affiliation
    Abstract
    Category
    Publish Date
    Discussion Period
    View PDF Button

  [Right]
    Thread Title
    Discussion Period Notice
    Comment List
    Comment Input
    Submit Button

UIポイント
・右サイドのコメント領域を独立させ、議論しやすくする
・議論不可時は入力欄を非活性にし、閲覧のみ可能と明示
・公開状態はファーストビューに置く

4-6. マイページ

画面目的
・ログイン後の起点
・各ロールに応じた導線表示

構成
上部
・ページタイトル
・ユーザー名
・所属
・ロール

主要アクションカード
・自分の投稿を見る
・新規投稿する
・論文一覧を見る
・事務局画面へ ロール保有時

最近の状態セクション
・最近の投稿ステータス
・要対応件数
・公開済み件数
・差し戻し件数

簡易レイアウト図
[Page Title]
  マイページ

[Profile Summary]
  Name
  Affiliation
  Role

[Action Cards]
  My Papers
  New Submission
  Browse Papers
  Office Dashboard optional

[Recent Status]
  Recent submissions
  Needs revision
  Published count

UIポイント
・ログイン後に迷わせない
・主要CTAをカード化して明確にする
・ロールによって表示内容を出し分ける

4-7. 自分の投稿一覧ページ

画面目的
・研究発表者が自分の投稿状況を一覧把握する

構成
上部
・ページタイトル
・新規投稿ボタン

フィルタエリア
・ステータス絞り込み
・検索

一覧テーブル
列案
・タイトル
・ステータス
・最終更新日
・公開予定日
・議論期間
・操作

操作列
状態に応じて表示
・編集
・再提出
・詳細確認
・公開ページを見る

簡易レイアウト図
[Page Title]
  自分の投稿一覧 | New Submission Button

[Filter Row]
  Search | Status

[Table]
  Title | Status | Updated At | Publish Date | Discussion | Actions

UIポイント
・状態ごとにボタンを切り替える
・要修正の行は目立たせる
・MVPではテーブル中心で十分

4-8. 新規投稿ページ 兼 投稿編集ページ

画面目的
・研究発表エントリー作成
・下書き編集
・初回提出

構成
上部
・戻る 自分の投稿一覧へ
・ページタイトル
・現在ステータス draft時のみ簡易表示

フォーム本体 1カラム
・タイトル
・概要
・カテゴリ
・著者名
・所属
・公開希望日
・議論開始日
・議論終了日
・PDFアップロード
・投稿メモ 任意

下部アクション
・下書き保存
・提出
・キャンセル

右サイドまたは下部補助
・入力ガイド
・提出ルール
・PDF形式注意

簡易レイアウト図
[Back]
[Title]

[Form]
  Title Input
  Abstract Textarea
  Category Input
  Author Input
  Affiliation Input
  Publish Date
  Discussion Start
  Discussion End
  PDF Upload
  Note Textarea

[Actions]
  Save Draft | Submit | Cancel

[Guide]
  Rules
  Notes

UIポイント
・MVPでは新規投稿と編集を同一画面化
・初回提出を同時に行える構造にする
・フィールド数は多すぎないよう整理

4-9. 再提出ページ

画面目的
・差し戻し済み投稿の修正版提出

構成
上部
・戻る 自分の投稿一覧へ
・ページタイトル
・現在ステータス revision_requested

重要表示領域
・事務局からの修正指示
・前回提出日時
・前回提出ファイル名

再提出フォーム
・修正版PDFアップロード
・再提出メモ
・再提出ボタン
・キャンセル

簡易レイアウト図
[Back]
[Title]
  Status Badge revision requested

[Revision Request Box]
  Office Comment
  Previous Submission Info

[Resubmission Form]
  PDF Upload
  Note Textarea

[Actions]
  Resubmit | Cancel

UIポイント
・修正指示を最上部で目立たせる
・前回提出情報を見せることで文脈を維持
・余計な入力項目は入れない

4-10. 投稿詳細確認ページ 任意統合候補

画面目的
・投稿状態、履歴、提出内容の確認

構成
上部
・タイトル
・ステータス
・戻るボタン

内容エリア
・投稿基本情報
・提出履歴一覧
・事務局コメント履歴
・公開予定
・議論期間
・行動ボタン

行動ボタン
・編集
・再提出
・公開ページを見る

簡易レイアウト図
[Back]
[Title]
  Status Badge

[Basic Info]

[Submission History]

[Office Feedback]

[Schedule]

[Actions]
  Edit | Resubmit | View Public Page

UIポイント
・MVPでは一覧から直接遷移で代替可能
・履歴を明確に見せたいなら有効

4-11. 事務局ダッシュボード

画面目的
・事務局の全体把握
・主要業務導線の集約

構成
上部
・ページタイトル
・今日の要対応件数

サマリーカード
・新規提出件数
・要修正件数
・再提出確認件数
・公開待ち件数
・公開中件数

最近の投稿一覧
・タイトル
・投稿者
・ステータス
・最終更新
・詳細へ

管理導線
・投稿一覧へ
・ユーザー管理へ
・公開管理へ 任意
・スレッド管理へ 任意

簡易レイアウト図
[Page Title]
  事務局ダッシュボード

[Summary Cards]
  Submitted | Revision | Resubmitted | Scheduled | Published

[Recent Items]
  Table List

[Management Links]
  Papers | Users | Publish | Threads

UIポイント
・数値と優先度が一目で分かること
・詳細画面へすぐ飛べること
・MVPではグラフ不要

4-12. 事務局投稿一覧ページ

画面目的
・全投稿の確認と絞り込み

構成
上部
・ページタイトル

フィルタ行
・検索
・ステータス
・カテゴリ
・公開状態

一覧テーブル
列案
・タイトル
・投稿者
・所属
・ステータス
・最終提出日時
・公開予定日
・議論期間
・操作

操作
・詳細を見る

簡易レイアウト図
[Page Title]
  投稿一覧

[Filter Row]
  Search | Status | Category | Visibility

[Table]
  Title | Presenter | Affiliation | Status | Submitted At | Publish At | Discussion | Detail

UIポイント
・一覧性最優先
・テーブル型で十分
・要対応の状態は色分け

4-13. 事務局投稿詳細ページ

画面目的
・個別投稿の確認
・差し戻し
・公開設定
・スレッド管理

構成
上部
・戻る 投稿一覧へ
・タイトル
・ステータスバッジ
・投稿者情報

本文2カラム
左
・投稿基本情報
・概要
・カテゴリ
・著者
・所属
・提出履歴
・最新PDF閲覧ボタン

右
・修正依頼ボックス
  ・コメント入力
  ・差し戻しボタン
・公開設定ボックス
  ・公開日時
  ・議論開始
  ・議論終了
  ・公開予約保存
  ・即時公開ボタン
・公開切替ボックス
  ・会員限定公開中表示
  ・フリー公開切替ボタン
・コメント管理ボックス
  ・コメント件数
  ・管理導線または直下一覧

簡易レイアウト図
[Back]
[Title]
  Status Badge
  Presenter Info

[Main]
  [Left]
    Basic Info
    Abstract
    Submission History
    Latest PDF Button

  [Right]
    Revision Request Box
    Publish Schedule Box
    Free Public Toggle Box
    Comment Management Box

UIポイント
・事務局業務をこの1画面で完結させる
・右側に操作ボックスを集約
・左側は確認情報、右側は操作情報で役割を分離

4-14. 事務局ユーザー管理ページ 任意

画面目的
・ユーザー一覧確認
・最小限ロール管理

構成
上部
・ページタイトル

一覧テーブル
・名前
・メールアドレス
・所属
・ロール
・登録日
・操作 ロール変更

簡易レイアウト図
[Page Title]
  ユーザー管理

[Table]
  Name | Email | Affiliation | Role | Created At | Action

UIポイント
・MVPでは極小機能で十分
・ロール変更を乱用しない設計が前提

4-15. コメントスレッド管理領域 事務局投稿詳細統合前提

画面目的
・コメント監視
・不適切コメント削除

構成
・コメント件数
・議論期間
・コメント一覧
・削除ボタン

簡易レイアウト図
[Thread Summary]
  Count | Period

[Comment List]
  User | Date | Body | Delete

UIポイント
・専用ページにせず、事務局投稿詳細へ統合する方がMVP向き

5. 状態表示ルール

全画面で可能な限り表示する状態
・draft
・submitted
・revision_requested
・resubmitted
・scheduled
・published_members_only
・free_public
・archived

表示位置
・一覧テーブルの状態列
・詳細ページのタイトル直下
・再提出ページの上部
・事務局投稿詳細の上部

表示ルール
・状態はテキストだけでなくバッジ化する
・要修正は最も目立つ表現にする
・会員限定公開中と一般公開中は明確に分ける

6. メッセージ表示ルール

成功メッセージ例
・投稿を保存しました
・原稿を提出しました
・再提出が完了しました
・公開設定を保存しました
・論文を公開しました

エラーメッセージ例
・必須項目を入力してください
・PDFファイルを選択してください
・権限がありません
・議論期間外のためコメントできません
・この論文は会員限定公開です

配置方針
・フォーム直上またはボタン付近
・全画面共通で視認しやすい位置

7. レスポンシブ方針

PC
・一覧はテーブル中心
・詳細は2カラム可
・管理画面は横幅を活かす

タブレット
・2カラムを1.5カラム程度に縮小
・一部フィルタを折りたたみ

スマホ
・原則1カラム
・テーブルはカード化または横スクロール
・事務局画面は最低限利用可能レベルでよい

8. MVPでの簡略化方針

Research Session Hub のMVPでは、以下の簡略化を採用する。

・トップページはシンプルな構成に留める
・マイページはダッシュボードというよりリンク集に近くてもよい
・投稿詳細確認ページは省略可能
・事務局公開管理ページは独立させず、事務局投稿詳細に統合する
・コメントスレッド管理も事務局投稿詳細に統合する
・デザイン装飾より、余白と整列を重視する
・グラフ、チャート、複雑なアニメーションは入れない

9. 主要コンポーネント候補

共通UI
・Header
・Footer
・PageTitle
・StatusBadge
・EmptyState
・AlertMessage
・ConfirmDialog

フォーム系
・TextInput
・Textarea
・DateInput
・FileUpload
・SubmitButton

一覧系
・PaperCard
・PaperTable
・SubmissionTable
・CommentList
・UserTable

管理系
・SummaryCard
・FilterBar
・ActionPanel

10. 次文書との関係

本書で定義したワイヤーフレームは、以下の文書に引き継ぐ。

・docs/06_function_list.md
  各画面にどの機能が必要かを整理する

・docs/07_role_permission.md
  画面ごとの操作可否を整理する

・docs/13_api_design.md
  画面で必要な入出力を整理する

11. 最終判断

Research Session Hub のワイヤーフレーム設計は、投稿、確認、再提出、公開、議論という中核ワークフローを最短で成立させるための骨組みとして定義する。

本書の最終方針は以下とする。

・研究発表者には次アクションが明確な画面を提供する
・事務局には一覧性と処理性の高い画面を提供する
・閲覧者には論文閲覧とコメント参加に集中できる画面を提供する
・状態表示を全画面で徹底する
・MVPとしてはシンプルで壊れにくいレイアウトを優先する
