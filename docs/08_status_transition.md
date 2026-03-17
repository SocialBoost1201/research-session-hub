文書情報
文書名: 状態遷移設計書
バージョン: v1.0
対象プロジェクト: Research Session Hub
関連文書:
- docs/01_requirements.md
- docs/03_user_flow.md
- docs/04_screen_transition.md
- docs/06_function_list.md
- docs/07_role_permission.md

1. 本書の目的

本書は、Research Session Hub における研究発表投稿の状態遷移を定義し、各状態で何ができるか、誰が遷移させられるか、どの条件で次状態へ進むかを明確化することを目的とする。

本MVPでは、研究発表者による投稿、事務局による確認、差し戻し、再提出、会員限定公開、期間限定議論、後日のフリー公開という運用フローを支えるため、状態遷移をシンプルかつ厳密に設計する。

2. 状態遷移設計方針

Research Session Hub の状態遷移は以下の方針で設計する。

・状態数は必要最小限に絞る
・各状態の意味を一意にする
・誰が状態変更できるかを明確にする
・UI表示、API制御、DB更新を同じ状態定義に揃える
・投稿ワークフローと公開ワークフローを一連で扱う
・MVPでは複雑な並列状態を持たない
・将来的な査読機能追加に耐えられる構造を残す

3. 状態一覧

本MVPで採用する状態は以下とする。

・draft
・submitted
・revision_requested
・resubmitted
・scheduled
・published_members_only
・free_public
・archived

4. 各状態の定義

4-1. draft

定義
研究発表者が投稿情報を入力中であり、まだ正式提出していない状態

状態の意味
・下書き
・事務局確認前
・公開対象外

主な特徴
・研究発表者が編集可能
・論文一覧には出さない
・事務局管理対象外でもよい

許可される主な操作
・基本情報編集
・PDF再選択
・下書き保存
・正式提出

4-2. submitted

定義
研究発表者が初回原稿提出を完了し、事務局確認待ちとなっている状態

状態の意味
・初回提出済み
・事務局レビュー待ち
・未公開

主な特徴
・研究発表者は原則自由編集不可
・事務局が確認対象として扱う
・差し戻しか公開準備判断へ進む

許可される主な操作
・研究発表者による閲覧
・事務局による確認
・差し戻し
・公開準備判断

4-3. revision_requested

定義
事務局が修正指示を出し、研究発表者の再提出待ちとなっている状態

状態の意味
・要修正
・研究発表者対応待ち
・未公開

主な特徴
・研究発表者は修正指示を確認可能
・再提出が可能
・事務局は追加確認のための閲覧可能

許可される主な操作
・研究発表者による修正指示閲覧
・修正版アップロード
・再提出

4-4. resubmitted

定義
研究発表者が修正版を再提出し、事務局の再確認待ちとなっている状態

状態の意味
・再提出済み
・再確認待ち
・未公開

主な特徴
・提出履歴上は新しい版が追加されている
・事務局が再度差し戻しまたは公開準備判断を行う

許可される主な操作
・事務局による再確認
・差し戻し再実行
・公開準備判断

4-5. scheduled

定義
事務局が公開日時および議論期間を設定し、公開待ちとなっている状態

状態の意味
・公開予約済み
・未公開
・公開条件確定済み

主な特徴
・研究発表者は公開予定を確認可能
・論文一覧には原則表示しない
・事務局が日時調整可能

許可される主な操作
・事務局による公開日時変更
・事務局による即時公開
・研究発表者による閲覧のみ

4-6. published_members_only

定義
論文が会員限定で公開されている状態

状態の意味
・公開中
・会員限定閲覧
・議論可能期間の管理対象

主な特徴
・ログイン済み会員のみ閲覧可能
・議論期間内はコメント投稿可能
・議論期間外は閲覧のみ
・事務局はコメント管理と公開管理が可能

許可される主な操作
・会員による閲覧
・議論期間内コメント投稿
・事務局によるフリー公開切替
・事務局によるアーカイブ判断

4-7. free_public

定義
論文が一般公開状態へ切り替わっている状態

状態の意味
・公開中
・会員限定解除済み
・外部公開可能な状態

主な特徴
・将来的に未ログインでも閲覧可能
・議論期間内ならコメント可能
・議論期間後は閲覧のみ

許可される主な操作
・一般公開閲覧 将来
・ログイン済みユーザーの閲覧
・議論期間内コメント
・事務局によるアーカイブ

4-8. archived

定義
公開運用または議論運用が終了し、履歴保存対象となった状態

状態の意味
・アーカイブ済み
・運用終了
・基本的に更新停止

主な特徴
・閲覧は条件付きで可
・コメント投稿不可
・編集不可
・履歴参照中心

許可される主な操作
・履歴閲覧
・事務局による管理
・必要時の参照

5. 状態遷移一覧

5-1. 基本遷移

draft
→ submitted

submitted
→ revision_requested
→ scheduled

revision_requested
→ resubmitted

resubmitted
→ revision_requested
→ scheduled

scheduled
→ published_members_only
→ archived 任意運用

published_members_only
→ free_public
→ archived

free_public
→ archived

5-2. 補足

・draft から revision_requested へは直接遷移しない
・submitted から published_members_only へ直接遷移させない
  必ず scheduled を通す
・revision_requested から scheduled へ直接遷移させない
  必ず再提出後に事務局再確認を行う
・published_members_only から submitted などの提出系状態へ戻さない
・archived は終端状態とする
  MVPでは通常復帰させない

6. 状態遷移図 文章表現

6-1. 正常系

draft
↓ 研究発表者が正式提出
submitted
↓ 事務局が公開準備OK
scheduled
↓ 公開日時到来または事務局公開実行
published_members_only
↓ 事務局が一般公開切替
free_public
↓ 運用終了
archived

6-2. 差し戻し系

draft
↓ 研究発表者が正式提出
submitted
↓ 事務局が差し戻し
revision_requested
↓ 研究発表者が再提出
resubmitted
↓ 事務局が公開準備OK
scheduled
↓ 公開
published_members_only

6-3. 再差し戻し系

submitted
↓ 差し戻し
revision_requested
↓ 再提出
resubmitted
↓ 再差し戻し
revision_requested
↓ 再提出
resubmitted
↓ 公開準備OK
scheduled

7. 状態変更主体

7-1. 研究発表者が変更可能な遷移

draft
→ submitted

revision_requested
→ resubmitted

補足
・研究発表者は自分の投稿に対してのみ実行可能
・状態遷移時は提出版作成と整合している必要がある

7-2. 事務局が変更可能な遷移

submitted
→ revision_requested

submitted
→ scheduled

resubmitted
→ revision_requested

resubmitted
→ scheduled

scheduled
→ published_members_only

published_members_only
→ free_public

published_members_only
→ archived

free_public
→ archived

scheduled
→ archived 任意運用

補足
・事務局のみが公開系状態へ遷移可能
・会員限定公開と一般公開の切替は事務局専用

7-3. システムが補助的に反映する遷移

scheduled
→ published_members_only

想定方法
・事務局の手動公開
または
・日時判定による公開反映 将来

MVP方針
・まずは手動公開でもよい
・scheduled_publish_at を持ち、将来自動化できる構造にする

8. 状態別操作可否

8-1. draft

研究発表者
・閲覧 可
・編集 可
・正式提出 可
・再提出 不可
・コメント 不可

事務局
・閲覧 原則不要
・管理 不要

閲覧者
・一切不可

8-2. submitted

研究発表者
・閲覧 可
・編集 原則不可
・再提出 不可
・公開ページ閲覧 不可

事務局
・閲覧 可
・差し戻し 可
・公開準備設定 可

閲覧者
・不可

8-3. revision_requested

研究発表者
・閲覧 可
・修正指示確認 可
・再提出 可
・通常編集 限定的

事務局
・閲覧 可
・追加確認 可

閲覧者
・不可

8-4. resubmitted

研究発表者
・閲覧 可
・再再提出 原則不可 事務局判断待ち
・コメント 不可

事務局
・閲覧 可
・差し戻し 可
・公開準備設定 可

閲覧者
・不可

8-5. scheduled

研究発表者
・閲覧 可
・公開予定確認 可
・編集 不可

事務局
・閲覧 可
・日時変更 可
・即時公開 可
・アーカイブ 任意

閲覧者
・不可

8-6. published_members_only

研究発表者
・閲覧 可
・議論期間内コメント 可

viewer
・閲覧 可
・議論期間内コメント 可

事務局
・閲覧 可
・コメント管理 可
・一般公開切替 可
・アーカイブ 可

未ログイン
・閲覧 不可

8-7. free_public

研究発表者
・閲覧 可
・議論期間内コメント 可

viewer
・閲覧 可
・議論期間内コメント 可

事務局
・閲覧 可
・管理 可
・アーカイブ 可

未ログイン
・閲覧 将来可

8-8. archived

研究発表者
・履歴閲覧 可
・編集 不可
・コメント 不可

viewer
・閲覧 条件付き
・コメント 不可

事務局
・閲覧 可
・管理 可

9. 状態遷移条件

9-1. draft → submitted

実行主体
研究発表者

条件
・必須項目が埋まっている
・PDFがアップロード済み
・ユーザーが対象投稿の所有者である
・状態が draft である

実行結果
・paper.status を submitted に更新
・submission レコード新規作成
・current_submission_id 更新
・submitted_at 相当日時保持

9-2. submitted → revision_requested

実行主体
事務局

条件
・状態が submitted
・修正指示コメントが入力されていることが望ましい
・対象投稿が存在する

実行結果
・paper.status を revision_requested に更新
・reviews または office feedback を記録
・研究発表者画面で要修正表示

9-3. submitted → scheduled

実行主体
事務局

条件
・状態が submitted
・公開日時が設定済み
・議論開始日、終了日が定義済み
・公開対象として問題ないと判断済み

実行結果
・paper.status を scheduled に更新
・scheduled_publish_at 設定
・discussion_start_at 設定
・discussion_end_at 設定

9-4. revision_requested → resubmitted

実行主体
研究発表者

条件
・状態が revision_requested
・修正版PDFアップロード済み
・対象投稿の所有者である

実行結果
・submission 新版作成
・paper.current_submission_id 更新
・paper.status を resubmitted に更新

9-5. resubmitted → revision_requested

実行主体
事務局

条件
・状態が resubmitted
・さらに修正が必要

実行結果
・paper.status を revision_requested に更新
・追加修正指示記録

9-6. resubmitted → scheduled

実行主体
事務局

条件
・状態が resubmitted
・公開日時と議論期間設定済み

実行結果
・paper.status を scheduled に更新

9-7. scheduled → published_members_only

実行主体
事務局 または システム

条件
・状態が scheduled
・公開日時に到達
または
・事務局が即時公開実行

実行結果
・paper.status を published_members_only に更新
・論文一覧掲載開始
・会員限定閲覧可
・thread を open 状態で利用開始できる状態にする

9-8. published_members_only → free_public

実行主体
事務局

条件
・状態が published_members_only
・一般公開へ切替する運用判断がされている

実行結果
・paper.status を free_public に更新
・公開範囲制御更新

9-9. published_members_only → archived

実行主体
事務局

条件
・運用終了
・アーカイブ判断

実行結果
・paper.status を archived に更新
・コメント投稿停止
・編集停止

9-10. free_public → archived

実行主体
事務局

条件
・一般公開運用終了

実行結果
・paper.status を archived に更新

10. 状態遷移時の副作用

10-1. 提出版管理への影響

draft → submitted
・submission version 1 作成

revision_requested → resubmitted
・submission version を加算して新規作成

10-2. コメント機能への影響

scheduled
・コメント投稿不可

published_members_only
・議論期間内のみコメント投稿可

free_public
・議論期間内のみコメント投稿可

archived
・コメント投稿不可

10-3. 一覧表示への影響

draft
・公開一覧に表示しない

submitted
・公開一覧に表示しない

revision_requested
・公開一覧に表示しない

resubmitted
・公開一覧に表示しない

scheduled
・公開一覧に表示しない

published_members_only
・公開一覧に表示する 会員向け

free_public
・公開一覧に表示する

archived
・公開一覧掲載可否は運用次第
MVPでは非表示でもよい

10-4. ファイルアクセスへの影響

draft submitted revision_requested resubmitted scheduled
・研究発表者本人と事務局のみ閲覧

published_members_only
・ログイン済み会員閲覧可

free_public
・将来的に未ログイン閲覧可

archived
・運用方針に応じる
MVPではログイン済み閲覧中心でもよい

11. 状態遷移バリデーション

11-1. 不正遷移防止

禁止例
・draft → scheduled
・submitted → free_public
・revision_requested → published_members_only
・published_members_only → submitted
・archived → submitted

対策
・サーバー側で現在状態を必ず確認
・許可された遷移パターン以外は拒否
・UIでは不正ボタンを出さない
・DB更新前に再判定する

11-2. 所有権確認

研究発表者操作時
・paper.presenter_id と current user id が一致すること

事務局操作時
・current user role が office であること

11-3. 日付整合性確認

scheduled 設定時
・discussion_start_at が discussion_end_at より前
・scheduled_publish_at が適切な日時
・必要なら議論開始日は公開日時以降

11-4. コメント可否整合性

コメント投稿時
・状態が published_members_only または free_public
・現在日時が discussion period 内
・ログイン済みである

12. 事務局運用ルール

12-1. 差し戻し運用

・差し戻し時は理由を必ず残す
・空コメント差し戻しは極力禁止する
・研究発表者が次の行動を理解できる文面にする

12-2. 公開予約運用

・公開日時未設定で scheduled にしない
・議論期間未設定の公開は原則行わない
・まずは手動公開でもよいが、日時情報は必ず保持する

12-3. 一般公開切替運用

・published_members_only を経由せず直接 free_public にしない
・会員限定公開期間を設ける前提で運用する

12-4. アーカイブ運用

・archived は終端扱い
・再運用する場合は別仕様で扱う
・MVPでは archived 復帰機能を作らない

13. 将来拡張余地

将来的に追加し得る状態
・under_review
・accepted
・rejected
・withdrawn
・embargoed
・private_discussion

MVPでは採用しない理由
・査読システム化して複雑化するため
・今回必要なのは投稿運用と公開管理であるため

14. 次文書との関係

本書の状態遷移定義は、以下の文書に引き継ぐ。

・docs/09_database_design.md
  status カラム、日時カラム、制約へ反映する

・docs/11_supabase_design.md
  RLS、Storage access、状態別アクセス制御へ反映する

・docs/13_api_design.md
  各操作APIの前提条件と実行結果に反映する

・docs/16_test_design.md
  正常遷移、不正遷移、境界値テストに反映する

15. 最終判断

Research Session Hub の状態遷移は、研究発表者による提出と再提出、事務局による差し戻しと公開管理、会員限定公開から一般公開への切替というMVPの中核ワークフローを確実に成立させるために定義する。

本書の最終方針は以下とする。

・状態は8個に限定する
・提出系状態と公開系状態を一貫して管理する
・研究発表者は提出と再提出のみ状態変更可能とする
・事務局のみが公開系遷移を実行できるようにする
・不正遷移はUI、API、DBの全層で防ぐ
・MVPではシンプルで壊れにくい状態モデルを採用する
