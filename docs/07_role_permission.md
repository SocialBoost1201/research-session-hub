文書情報
文書名: 権限設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/01_requirements.md
- docs/02_screen_list.md
- docs/03_user_flow.md
- docs/04_screen_transition.md
- docs/05_wireframes.md
- docs/06_function_list.md

1. 本書の目的

本書は、Research Session Hub のMVPにおいて、各ユーザーロールがどの画面、機能、データに対して、閲覧、作成、更新、削除、公開操作を行えるかを定義することを目的とする。

本MVPでは、以下の3ロールを前提とする。

・viewer
・presenter
・office

権限設計は、画面表示制御だけでなく、API実行制御、Supabase RLS制御、ファイルアクセス制御の基礎となる。
そのため、本書では UI 上の権限制御と、サーバー側の実権限制御の両方を意識して整理する。

2. 権限設計方針

Research Session Hub の権限設計は、以下の方針で行う。

・最小権限の原則を採用する
・未ログインユーザーには原則として公開情報のみ許可する
・ログイン済みユーザーでも、自分に関係ない投稿編集は不可とする
・事務局のみが全投稿を管理できるようにする
・会員限定公開は authenticated user を前提に制御する
・権限チェックは UI だけでなく API と DB でも行う
・MVPのため、ロールは3種に限定する
・将来拡張のため、ロール追加可能な構造を前提とする

3. ユーザーロール定義

3-1. 未ログインユーザー

定義
認証されていない利用者

主な想定利用
・トップページ閲覧
・会員登録
・ログイン
・将来の free_public 論文閲覧

制限
・会員限定論文の閲覧不可
・コメント投稿不可
・投稿作成不可
・管理画面アクセス不可

3-2. viewer

定義
ログイン済み会員の基本ロール
主に論文閲覧と議論参加を行う

主な権限
・マイページ閲覧
・論文一覧閲覧
・会員限定論文閲覧
・議論期間内コメント投稿

制限
・投稿作成不可
・投稿管理不可
・事務局画面不可

3-3. presenter

定義
研究発表を行う会員
閲覧者機能に加え、自分の研究発表投稿と再提出が可能

主な権限
・viewer 権限すべて
・自分の投稿一覧閲覧
・新規投稿作成
・原稿提出
・再提出
・自分の投稿情報閲覧

制限
・他人の投稿編集不可
・全投稿管理不可
・事務局機能不可

3-4. office

定義
運営事務局ロール
全投稿管理、差し戻し、公開制御、議論管理を行う

主な権限
・viewer 権限すべて
・全投稿一覧閲覧
・全投稿詳細閲覧
・差し戻し
・公開日時設定
・会員限定公開
・フリー公開切替
・コメント削除
・簡易ユーザー管理

制限
・MVPではシステム設定全般までは持たない
・DB破壊的操作などは対象外

4. 権限レベル定義

本書では、操作権限を以下で表現する。

・閲覧
・作成
・更新
・削除
・公開
・管理
・不可

補足
閲覧は画面やデータを見られること
作成は新規作成できること
更新は編集や状態変更を含む
削除は論理削除または非表示を含む
公開は公開状態変更権限
管理は一覧横断確認や他者データ操作を含む

5. 画面アクセス権限

5-1. 画面別アクセス権限一覧

トップページ
・未ログインユーザー 閲覧可
・viewer 閲覧可
・presenter 閲覧可
・office 閲覧可

会員登録ページ
・未ログインユーザー 閲覧可
・viewer 原則不要
・presenter 原則不要
・office 原則不要

ログインページ
・未ログインユーザー 閲覧可
・viewer 原則不要
・presenter 原則不要
・office 原則不要

論文一覧ページ
・未ログインユーザー 一部可 free_public のみ将来対応
・viewer 閲覧可
・presenter 閲覧可
・office 閲覧可

論文詳細ページ
・未ログインユーザー free_public のみ将来対応
・viewer 会員限定公開論文の閲覧可
・presenter 会員限定公開論文の閲覧可
・office 全公開論文閲覧可

マイページ
・未ログインユーザー 不可
・viewer 閲覧可
・presenter 閲覧可
・office 閲覧可

自分の投稿一覧ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 閲覧可
・office 閲覧可 代理確認目的

新規投稿ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 閲覧可
・office 原則不要 ただし将来代理作成余地あり

投稿編集ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 自分の投稿のみ可
・office 閲覧可だが更新は原則行わない方針

再提出ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 自分の投稿のみ可
・office 不可

投稿詳細確認ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 自分の投稿のみ可
・office 閲覧可

事務局ダッシュボード
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

事務局投稿一覧ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

事務局投稿詳細ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

事務局公開管理ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

事務局ユーザー管理ページ
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

コメントスレッド表示領域
・未ログインユーザー 閲覧は free_public 時のみ将来対応
・viewer 閲覧可
・presenter 閲覧可
・office 閲覧可

コメントスレッド管理領域
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

6. 機能別権限一覧

6-1. 認証系

会員登録
・未ログインユーザー 可
・viewer 不要
・presenter 不要
・office 不要

ログイン
・未ログインユーザー 可
・viewer 不要
・presenter 不要
・office 不要

ログアウト
・viewer 可
・presenter 可
・office 可

6-2. 閲覧系

論文一覧閲覧
・未ログインユーザー free_public のみ将来対応
・viewer 可
・presenter 可
・office 可

論文詳細閲覧
・未ログインユーザー free_public のみ将来対応
・viewer 可
・presenter 可
・office 可

会員限定論文閲覧
・未ログインユーザー 不可
・viewer 可
・presenter 可
・office 可

PDF閲覧
・未ログインユーザー free_public 時のみ将来対応
・viewer 可 条件付き
・presenter 可 条件付き
・office 可

6-3. 投稿系

新規投稿作成
・未ログインユーザー 不可
・viewer 不可
・presenter 可
・office 原則不可

下書き保存
・未ログインユーザー 不可
・viewer 不可
・presenter 可 自分の投稿のみ
・office 原則不可

初回原稿提出
・未ログインユーザー 不可
・viewer 不可
・presenter 可 自分の投稿のみ
・office 原則不可

投稿編集
・未ログインユーザー 不可
・viewer 不可
・presenter 可 自分の投稿かつ許可状態のみ
・office 原則不可

投稿詳細確認
・未ログインユーザー 不可
・viewer 不可
・presenter 可 自分の投稿のみ
・office 可

修正指示確認
・未ログインユーザー 不可
・viewer 不可
・presenter 可 自分の投稿のみ
・office 可

再提出
・未ログインユーザー 不可
・viewer 不可
・presenter 可 自分の投稿かつ revision_requested 状態のみ
・office 不可

6-4. 事務局管理系

全投稿一覧閲覧
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

全投稿詳細閲覧
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

差し戻し
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

再提出版確認
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

公開日時設定
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

会員限定公開実行
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

フリー公開切替
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

コメント管理
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

ユーザー一覧閲覧
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可

ロール変更
・未ログインユーザー 不可
・viewer 不可
・presenter 不可
・office 可 制限付き

6-5. コメント系

コメント一覧閲覧
・未ログインユーザー free_public 時のみ将来対応
・viewer 可
・presenter 可
・office 可

コメント投稿
・未ログインユーザー 不可
・viewer 可 議論期間内のみ
・presenter 可 議論期間内のみ
・office 可 必要に応じて

コメント削除
・未ログインユーザー 不可
・viewer 不可
・presenter 原則不可
・office 可

コメント返信
・未ログインユーザー 不可
・viewer Could 将来
・presenter Could 将来
・office Could 将来

7. データアクセス権限

7-1. profiles

未ログインユーザー
・閲覧不可

viewer
・自分のプロフィール閲覧可
・自分のプロフィール一部更新可

presenter
・自分のプロフィール閲覧可
・自分のプロフィール一部更新可

office
・全プロフィール閲覧可
・ロール変更等の管理可 制限付き

7-2. papers

未ログインユーザー
・free_public のみ将来閲覧可

viewer
・published_members_only と free_public の閲覧可
・自分の投稿作成不可

presenter
・自分の paper は draft から閲覧可
・自分の paper 作成可
・自分の paper 更新可 許可状態のみ
・他人の未公開 paper 閲覧不可

office
・全 paper 閲覧可
・公開状態更新可
・差し戻し関連更新可

7-3. submissions

未ログインユーザー
・不可

viewer
・不可

presenter
・自分の paper に紐づく submission のみ閲覧可
・自分の paper に対する submission 作成可
・他人の submission 不可

office
・全 submission 閲覧可
・コメント付与可
・状態確認可

7-4. reviews 事務局確認ログ

未ログインユーザー
・不可

viewer
・不可

presenter
・自分の投稿に対する office feedback のみ一部閲覧可
・内部運用情報全件閲覧は不可

office
・全件閲覧可
・作成可
・更新は最小限

7-5. threads

未ログインユーザー
・free_public 論文に紐づく open thread の閲覧は将来可

viewer
・公開中論文に紐づく thread 閲覧可
・作成不可

presenter
・公開中論文に紐づく thread 閲覧可
・自分の公開論文の thread 閲覧可
・作成不可 MVPでは事務局管理

office
・全 thread 閲覧可
・作成可
・更新可
・開閉管理可

7-6. comments

未ログインユーザー
・free_public 時の閲覧は将来可
・作成不可

viewer
・公開中かつ議論期間内のみ作成可
・閲覧可
・他者コメント更新不可
・削除不可

presenter
・公開中かつ議論期間内のみ作成可
・閲覧可
・他者コメント更新不可
・削除不可

office
・全公開スレッドのコメント閲覧可
・必要時作成可
・削除可
・非表示化可

8. ストレージアクセス権限

8-1. 原稿PDF

未ログインユーザー
・会員限定論文PDFは不可
・free_public 時のみ将来可

viewer
・公開済み論文PDF閲覧可
・アップロード不可

presenter
・自分の投稿原稿アップロード可
・自分の提出済み原稿閲覧可
・公開済み論文PDF閲覧可

office
・全原稿PDF閲覧可
・必要な管理上の参照可
・原則アップロード主体ではない

8-2. ストレージ操作原則

・アップロードは presenter の自分投稿のみ許可
・閲覧は公開状態とロールに応じて制御
・会員限定時は signed URL または private bucket 前提
・ office は全件参照可能
・他人投稿への presenter 直接アクセスは禁止

9. ステータス別操作権限

9-1. draft

viewer
・不可

presenter
・自分の投稿閲覧可
・編集可
・提出可

office
・原則関関与不要

9-2. submitted

viewer
・不可

presenter
・自分の投稿閲覧可
・編集原則不可
・提出済み確認のみ可

office
・閲覧可
・差し戻し可
・公開準備判断可

9-3. revision_requested

viewer
・不可

presenter
・修正指示閲覧可
・再提出可
・通常編集は再提出導線内で限定的に扱う

office
・閲覧可
・追加コメント可

9-4. resubmitted

viewer
・不可

presenter
・閲覧可
・再確認待ち
・再編集不可

office
・閲覧可
・差し戻し可
・公開準備判断可

9-5. scheduled

viewer
・不可

presenter
・公開予定確認可
・編集不可

office
・閲覧可
・日時変更可
・公開実行可

9-6. published_members_only

viewer
・閲覧可
・議論期間内コメント可

presenter
・閲覧可
・議論期間内コメント可

office
・閲覧可
・コメント管理可
・フリー公開切替可

9-7. free_public

未ログインユーザー
・将来的に閲覧可

viewer
・閲覧可
・議論期間内コメント可

presenter
・閲覧可
・議論期間内コメント可

office
・管理可

9-8. archived

viewer
・閲覧条件付き
・コメント不可

presenter
・自分の履歴閲覧可
・編集不可

office
・閲覧可
・管理可

10. UI権限と実権限の分離方針

10-1. UI権限

目的
・見せてよいボタンのみ表示する
・誤操作を減らす

例
・viewer に新規投稿ボタンを出さない
・presenter に事務局公開ボタンを出さない
・議論期間外はコメント入力欄を非活性にする

10-2. 実権限

目的
・UIを偽装しても不正操作できないようにする

実装対象
・Route protection
・Server Action 内ロールチェック
・API内権限チェック
・Supabase RLS
・Storage access 制御

原則
UIで隠していても、サーバー側で必ず再判定する

11. 権限マトリクス要約

11-1. 画面アクセス

トップ
・全員可

会員登録
・未ログイン可

ログイン
・未ログイン可

マイページ
・ログイン済みのみ可

自分の投稿一覧
・presenter と office 可

新規投稿
・presenter 可

再提出
・presenter 自分投稿かつ要修正時のみ可

事務局画面
・office のみ可

11-2. 主要操作

論文閲覧
・viewer presenter office 可
・未ログインは free_public のみ将来

コメント投稿
・viewer presenter office 可
・議論期間内のみ

新規投稿
・presenter のみ

再提出
・presenter のみ
・自分投稿のみ

差し戻し
・office のみ

公開設定
・office のみ

会員限定公開
・office のみ

フリー公開切替
・office のみ

コメント削除
・office のみ

12. 将来拡張前提

将来追加される可能性があるロール
・reviewer
・admin
・guest invited
・moderator

将来追加される可能性がある権限
・査読のみ閲覧
・採択判定
・イベント単位管理
・論文種別別権限
・限定公開グループ制御

MVPでは対応しないが、profiles.role を拡張しやすい構造を前提とする

13. 次文書との関係

本書の権限定義は、以下の文書に引き継ぐ。

・docs/08_status_transition.md
  ステータスごとの操作可否に反映する

・docs/09_database_design.md
  owner_id や role カラム、関連制約に反映する

・docs/11_supabase_design.md
  Auth、RLS、Storage 制御に反映する

・docs/13_api_design.md
  エンドポイントごとの認可条件に反映する

14. 最終判断

Research Session Hub の権限設計は、会員制閲覧、研究発表者による自分投稿管理、事務局による全体運用管理の3層を明確に分離することを最優先とする。

本書の最終方針は以下とする。

・未ログインユーザーには最小限の公開情報のみ許可する
・viewer は閲覧と議論参加に限定する
・presenter は自分の投稿にのみ責任を持てる構造にする
・office のみが全体管理と公開制御を行えるようにする
・UI、API、DB、Storage のすべてで権限制御を整合させる
・MVPではシンプルかつ破綻しない権限モデルを採用する
