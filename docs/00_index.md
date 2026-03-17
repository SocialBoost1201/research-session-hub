文書情報
文書名: Research Session Hub 設計書統合インデックス
バージョン: v1.0
対象プロジェクト: Research Session Hub
目的: docs フォルダ内の設計書群の役割、参照順、利用順を整理し、実装開始前および実装中の参照性を高めるための統合インデックスとして利用する

1. 本書の目的

本書は、Research Session Hub のMVP設計書一式を横断的に整理し、どの文書が何を定義しており、どの順序で参照すべきかを明確にすることを目的とする。

本プロジェクトでは、3日で動作するMVPを構築する前提のため、設計書が増えるほど、参照漏れや定義の重複、実装順序の混乱が発生しやすい。
そのため、本インデックスを docs フォルダの起点文書とし、設計、実装、確認の各フェーズで参照基準として用いる。

2. docs フォルダ構成一覧

docs/
  00_index.md
  01_requirements.md
  02_screen_list.md
  03_user_flow.md
  04_screen_transition.md
  05_wireframes.md
  06_function_list.md
  07_role_permission.md
  08_status_transition.md
  09_database_design.md
  10_er_diagram.md
  11_supabase_design.md
  12_storage_design.md
  13_api_design.md
  14_validation_error_design.md
  15_admin_console_design.md
  16_test_design.md
  17_deploy_operation.md
  18_development_plan_3days.md

3. 文書一覧と役割

00_index.md
役割
・docs 全体の起点
・文書参照順の案内
・実装前チェックの入口

01_requirements.md
役割
・プロジェクト全体の要件定義
・MVPの対象範囲と非対象範囲
・成功条件の定義

02_screen_list.md
役割
・必要画面の一覧整理
・各画面の役割と対象ユーザー定義

03_user_flow.md
役割
・研究発表者、事務局、閲覧者の操作導線整理
・各ユーザーの行動単位の定義

04_screen_transition.md
役割
・画面間遷移の整理
・認証、権限制御を伴う遷移の明確化

05_wireframes.md
役割
・主要画面のUI骨組み定義
・配置要素と導線の整理

06_function_list.md
役割
・MVP機能一覧の整理
・優先度と実装対象の明確化

07_role_permission.md
役割
・viewer presenter office の権限定義
・画面、機能、データへのアクセス整理

08_status_transition.md
役割
・投稿状態の定義
・状態遷移ルールと遷移主体の明確化

09_database_design.md
役割
・DBのテーブル、カラム、制約定義
・投稿、提出、レビュー、議論構造の整理

10_er_diagram.md
役割
・ER構造の論理整理
・エンティティ関係の可視化

11_supabase_design.md
役割
・Auth、RLS、Storage、DB の Supabase 利用方針定義
・実権限制御の土台整理

12_storage_design.md
役割
・PDF保存構造
・バケット、保存パス、版管理、閲覧方法の整理

13_api_design.md
役割
・主要APIとサーバー処理の仕様定義
・画面、状態、権限、Storage との接続整理

14_validation_error_design.md
役割
・入力検証
・権限エラー
・状態エラー
・画面表示メッセージの整理

15_admin_console_design.md
役割
・事務局向け管理画面の構造と運用導線定義
・一覧、詳細、差し戻し、公開管理の整理

16_test_design.md
役割
・正常系、異常系、権限制御、状態遷移テスト観点整理
・MVP受け入れ基準定義

17_deploy_operation.md
役割
・Vercel と Supabase を使ったデプロイ、運用方針整理
・初期セットアップと障害時対応整理

18_development_plan_3days.md
役割
・3日間の実装順序整理
・Day1 Day2 Day3 の作業分解と完了条件定義

4. 推奨参照順

4-1. 企画、要件確認時

最初に参照する文書
・01_requirements.md
・06_function_list.md
・07_role_permission.md
・08_status_transition.md

目的
・何を作るか
・何を作らないか
・誰が何をできるか
・どう状態が進むか
を最初に固めるため

4-2. UI、画面設計確認時

主に参照する文書
・02_screen_list.md
・03_user_flow.md
・04_screen_transition.md
・05_wireframes.md
・15_admin_console_design.md

目的
・どの画面が必要か
・誰がどう移動するか
・画面に何を置くか
・管理画面をどう使うか
を確認するため

4-3. バックエンド、DB、Supabase 設計確認時

主に参照する文書
・07_role_permission.md
・08_status_transition.md
・09_database_design.md
・10_er_diagram.md
・11_supabase_design.md
・12_storage_design.md
・13_api_design.md

目的
・DB構造
・ER関係
・RLS
・Storage
・API
を整合的に確認するため

4-4. 実装直前確認時

主に参照する文書
・01_requirements.md
・06_function_list.md
・08_status_transition.md
・13_api_design.md
・16_test_design.md
・18_development_plan_3days.md

目的
・実装対象
・状態遷移
・API
・テスト基準
・実装順
を最終確認するため

4-5. デプロイ前、運用前確認時

主に参照する文書
・16_test_design.md
・17_deploy_operation.md

目的
・最低限の品質確認
・本番相当運用準備
を行うため

5. 実装時の文書参照マッピング

5-1. 認証を実装するとき

参照文書
・01_requirements.md
・07_role_permission.md
・11_supabase_design.md
・13_api_design.md
・16_test_design.md

5-2. 投稿作成と初回提出を実装するとき

参照文書
・06_function_list.md
・08_status_transition.md
・09_database_design.md
・12_storage_design.md
・13_api_design.md
・14_validation_error_design.md

5-3. 差し戻しと再提出を実装するとき

参照文書
・03_user_flow.md
・06_function_list.md
・08_status_transition.md
・09_database_design.md
・13_api_design.md
・15_admin_console_design.md
・16_test_design.md

5-4. 公開設定と会員限定公開を実装するとき

参照文書
・07_role_permission.md
・08_status_transition.md
・11_supabase_design.md
・13_api_design.md
・15_admin_console_design.md
・17_deploy_operation.md

5-5. コメント機能を実装するとき

参照文書
・01_requirements.md
・07_role_permission.md
・08_status_transition.md
・09_database_design.md
・11_supabase_design.md
・13_api_design.md
・14_validation_error_design.md
・16_test_design.md

5-6. 論文一覧と詳細画面を実装するとき

参照文書
・02_screen_list.md
・04_screen_transition.md
・05_wireframes.md
・07_role_permission.md
・13_api_design.md

5-7. 管理画面を実装するとき

参照文書
・02_screen_list.md
・05_wireframes.md
・07_role_permission.md
・13_api_design.md
・15_admin_console_design.md
・16_test_design.md

6. 文書間の依存関係

最上位の起点文書
・01_requirements.md

01_requirements.md を受けて定義されるもの
・02_screen_list.md
・03_user_flow.md
・06_function_list.md

画面設計系の流れ
・02_screen_list.md
→ 03_user_flow.md
→ 04_screen_transition.md
→ 05_wireframes.md

機能、権限、状態の流れ
・06_function_list.md
→ 07_role_permission.md
→ 08_status_transition.md

データ設計系の流れ
・08_status_transition.md
→ 09_database_design.md
→ 10_er_diagram.md
→ 11_supabase_design.md
→ 12_storage_design.md
→ 13_api_design.md

品質、運用設計系の流れ
・13_api_design.md
→ 14_validation_error_design.md
→ 15_admin_console_design.md
→ 16_test_design.md
→ 17_deploy_operation.md
→ 18_development_plan_3days.md

7. 実装開始前チェックリスト

以下を満たしたら、実装フェーズへ進める。

・MVP対象機能が 01_requirements.md と 06_function_list.md で一致している
・権限定義が 07_role_permission.md で明確になっている
・状態遷移が 08_status_transition.md で固定されている
・DB構造が 09_database_design.md と 10_er_diagram.md で整合している
・Supabase の Auth、RLS、Storage 方針が 11_supabase_design.md と 12_storage_design.md で固まっている
・API責務が 13_api_design.md で明確になっている
・入力とエラーの扱いが 14_validation_error_design.md で定義されている
・事務局運用導線が 15_admin_console_design.md で破綻していない
・受け入れ条件が 16_test_design.md に明記されている
・3日実装順が 18_development_plan_3days.md で決まっている

8. 本 docs 群の到達状況

現時点で整備済みの範囲
・要件定義
・画面一覧
・ユーザーフロー
・画面遷移
・ワイヤーフレーム
・機能一覧
・権限設計
・状態遷移
・DB設計
・ER設計
・Supabase設計
・Storage設計
・API設計
・バリデーション、エラー設計
・管理画面設計
・テスト設計
・デプロイ、運用設計
・3日開発計画

到達評価
・MVP設計一式としては実装可能レベルまで整理済み
・この時点で、実装前フェーズとしては十分強い状態にある

9. 次フェーズ候補

次に進める候補は以下である。

候補1
実装開始前レビュー
目的
・設計の矛盾、重複、漏れを最終点検する

候補2
SQLマイグレーション設計書作成
目的
・Supabase へ適用するDDLレベルまで落とし込む

候補3
Next.js ディレクトリ設計の確定版作成
目的
・App Router 上の実装構造を固定する

候補4
実装タスクを issue レベルまで分解
目的
・Day1 Day2 Day3 をさらに具体的な作業単位に分解する

注意
現時点では、あなたの指示があるまで実装には進まない

10. 最終判断

Research Session Hub の docs フォルダは、MVP設計に必要な中核文書群が一通り揃った状態である。

本書の最終方針は以下とする。

・docs/00_index.md を docs フォルダの起点文書とする
・実装前は 01 から 18 までの文書整合を本インデックス経由で確認する
・実装時は目的別に必要文書のみを横断参照する
・設計フェーズは一旦完了とし、次フェーズはレビューまたは実装準備の具体化に進む
