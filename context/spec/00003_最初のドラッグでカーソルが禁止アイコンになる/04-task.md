# タスクリスト: 00003 初回ドラッグで禁止カーソルの解消

1. CSS 追加: `.viewer--actual { cursor: grab; }` と `.viewer--dragging { cursor: grabbing; }` を定義する。
2. CSS 追加: `.viewer img { user-select: none; -webkit-user-drag: none; }` を追加する。
3. 初期化変更: `ImageZoomController` の `constructor` で `img.draggable=false` を設定し、`dragstart` で `preventDefault()` するリスナーを追加する。
4. フラグ導入: `this.drag_started` をメンバとして追加し初期化する。
5. mousedown 修正: 左ボタンかつ実サイズ時に `preventDefault()`、`drag_started=false`、`.viewer--dragging` を付与し、開始座標を記録する。
6. mousemove 修正: 閾値 4px を超えたら `drag_started=true` とし、`transform: translate(x,y)` をクランプ付きで更新する。
7. mouseup 修正: `.viewer--dragging` を除去し、開始座標をリセットする。
8. click ハンドラ修正: `drag_started` が true の場合は処理を中断してモード切替を抑止する。
9. 手動確認: 受け入れ条件に沿って初回ドラッグでの禁止アイコン非表示と追従、二回目以降の一貫性、他機能の退行がないことを確認する。
