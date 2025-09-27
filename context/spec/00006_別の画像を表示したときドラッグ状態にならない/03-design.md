# 設計・実装仕様

## 目的
- 実サイズ表示で画像Aをドラッグ移動中に画像Bへ切り替えた直後、追加のクリックを要求せず、画像Bで直ちにドラッグ操作を継続できるようにする。

## 方針（概要）
- 実サイズ表示状態の引き継ぎ: 画像切替時に直前の表示状態を保持し、`is_actual_size === true` のときは新しい画像でも実サイズ表示を維持する。`false` の場合は従来どおりフィット表示。
- ドラッグ状態の適切なリセット: 画像切替時にドラッグ関連の一時状態（`start_x`, `start_y`, `drag_started`）とCSSクラス`viewer--dragging`を確実に解除し、次の`mousedown`で正しくドラッグ開始できるようにする。
- クリック切替との干渉防止: 実サイズを保持することで、切替直後の最初の操作がクリックによる「実⇄フィット」のトグルにならないようにする（ユーザーはそのまま押下→移動でドラッグ開始できる）。

## 具体仕様（数値・イベント）
- ドラッグ開始判定の移動しきい値: 4px（現状維持）。`|dx| >= 4 || |dy| >= 4` で `drag_started = true`。
- 切替時の座標リセット: 実サイズ表示に入る際の初期オフセットは `(0, 0)`（現状維持）。
- マウスイベント:
  - `mousedown`（左ボタン・実サイズ時のみ有効）でドラッグ準備（`start_x/start_y` 記録、`viewer--dragging` 付与）。
  - `mousemove` で移動量を算出し、しきい値超過でドラッグを確定。画像の`transform: translate(x, y)`で追従。
  - `mouseup` でドラッグ終了（`viewer--dragging` 除去、座標準備を解除）。

## 修正ポイント（プログラム方針）
1) 実サイズ状態の維持
- `selectIndex(i)` 内の `zoom_controller.applyFitMode();` を、直前の状態に応じて分岐する。
  - 疑似コード: `const was = zoom_controller.is_actual_size; (was ? zoom_controller.applyActualSizeMode() : zoom_controller.applyFitMode());`

2) ドラッグ状態のリセットAPIを追加
- `ImageZoomController` に `resetDragState()` を追加し、以下を実施:
  - `this.start_x = undefined; this.start_y = undefined; this.drag_started = false;`
  - `this.viewer_elem.classList.remove('viewer--dragging');`
- 画像切替処理 `selectIndex(i)` の冒頭で `zoom_controller.resetDragState()` を呼び、切替に伴う取り残し状態を確実に解消する。

3) 既存挙動の非退行
- フィット表示での切替は従来どおりフィットのまま。
- ドラッグ速度・しきい値・クランプ（表示領域内に収める制限）は現状ロジックを維持。
- クリックで実⇄フィットをトグルする既存UIも維持（実サイズ保持により切替直後の誤トグルを防止）。

## 影響範囲
- 修正ファイル: `src/fivepoint.html`
- 対象クラス/関数:
  - `class ImageZoomController`（`resetDragState` 追加）
  - `selectIndex(i)`（実/フィット分岐、`resetDragState` 呼び出し）

## テスト観点（受け入れ + 退行）
- 受け入れ:
  - 実サイズ表示中に画像Aをドラッグ移動 → サムネイルで画像Bに切替 → 直後の最初のドラッグ操作で画像Bが移動する（追加クリック不要）。
  - 切替直後にクリックだけした場合、意図せずフィットに戻らない（実サイズ保持）。
- 退行確認:
  - フィット表示での切替後、表示はフィットのままである。
  - ドラッグのしきい値4px・移動クランプ・ドラッグ中のクリック無視挙動が従来どおり。
  - ズーム、評価変更、フォルダ切替、D&D追加にエラーなし（コンソールエラーなし）。

## 命名・規約
- 既存規約に従う（クラス: UpperPascalCase、メソッド: lowerCamelCase、定数: UPPER_SNAKE_CASE、変数: lowerSnakeCase）。
