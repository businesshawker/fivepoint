## プログラムの実装方針
- 実寸表示時の水平方向ドラッグにおいて、ビューア要素の水平中央揃えによる初期オフセット（baseX）を考慮したクランプ計算に変更する。
- baseX = (viewerWidth - imageWidth) / 2 とし、画像の「実際の左端 = baseX + translateX」がビューアの左右端を越えない範囲に `translateX` を制限する。
- 画像幅がビューア幅以下の場合は水平ドラッグを無効化し、常に中央揃えを維持する（translateX は 0 に固定）。
- 既存の縦方向ドラッグは `align-items: flex-start` により中央揃えの影響を受けないため従来ロジックを維持するが、高さがビューア以下のときはドラッグ不可（translateY=0）とする。
- 実寸⇔通常表示の切替処理、画像切替処理は既存の方針（transform リセットと状態リセット）を踏襲する。

## 対象ファイル名と対象メソッド名一覧
- 修正: `src/fivepoint.html`: ImageZoomController.onMouseMove
- 追加: `src/fivepoint.html`: ImageZoomController.computeClampRangeX（ヘルパー）
- 既存維持: `src/fivepoint.html`: ImageZoomController.applyActualSizeMode / applyFitMode / resetDragState / onMouseDown / onMouseUp

## 対象メソッドの詳細設計

1) ImageZoomController.computeClampRangeX（新規）
- 役割: 実寸表示時の水平方向ドラッグにおける `translateX` の最小値/最大値を算出する。
- 引数/使用値: `this.viewer_elem.clientWidth`、`this.img_elem.width`、および viewer の水平中央揃えから得られる baseX。
- 返り値: `{ min_x, max_x, draggable }`
- 挙動:
  - `vw = viewer.clientWidth`, `iw = img.width`
  - もし `iw <= vw` なら `draggable=false`, `min_x=0`, `max_x=0`
  - それ以外は `baseX = (vw - iw) / 2`
    - 画像実左端 L = baseX + translateX とする。
    - ビューアの左右端制約: `vw - iw <= L <= 0`
    - よって `translateX` の範囲は `[vw - iw - baseX, -baseX]`
    - `draggable=true` として返す。

擬似コード:
```
computeClampRangeX() {
  const vw = this.viewer_elem.clientWidth;
  const iw = this.img_elem.width;
  if (iw <= vw) return { min_x: 0, max_x: 0, draggable: false };
  const baseX = (vw - iw) / 2;
  const min_x = (vw - iw) - baseX;
  const max_x = -baseX;
  return { min_x, max_x, draggable: true };
}
```

2) ImageZoomController.onMouseMove（修正）
- 変更点: 水平クランプに `computeClampRangeX()` を用いる。
- 画像幅がビューア幅以下の場合は水平移動量 dx を無視し（new_x=0）、縦方向のみ従来通りクランプ適用。両方不可の場合は translate を変更しない。
- 更新後処理（`this.start_x/y`、`this.offset_x/y` の更新）は従来通り。

擬似コード差分:
```
onMouseMove(evt) {
  if (this.start_x === undefined || !this.img_elem) return;
  const dx = evt.clientX - this.start_x;
  const dy = evt.clientY - this.start_y;
  if (!this.drag_started && (Math.abs(dx) >= 4 || Math.abs(dy) >= 4)) this.drag_started = true;

  let new_x = this.offset_x + dx;
  let new_y = this.offset_y + dy;

  // 水平クランプ（中央揃え対応）
  const { min_x, max_x, draggable } = this.computeClampRangeX();
  if (!draggable) new_x = 0; else new_x = Math.max(min_x, Math.min(max_x, new_x));

  // 垂直クランプ（従来どおり）
  const max_y = 0;
  const min_y = Math.min(0, this.viewer_elem.clientHeight - this.img_elem.height);
  if (this.img_elem.height <= this.viewer_elem.clientHeight) new_y = 0;
  else new_y = Math.max(min_y, Math.min(max_y, new_y));

  this.img_elem.style.transform = `translate(${new_x}px, ${new_y}px)`;
  this.start_x = evt.clientX; this.start_y = evt.clientY;
  this.offset_x = new_x; this.offset_y = new_y;
}
```

3) ImageZoomController.applyActualSizeMode（既存維持）
- 実寸モード切替時は従来通り `transform: translate(0,0)` とオフセットを 0 に初期化。
- ドラッグ初回で computeClampRangeX に基づくクランプが働き、左右端を越えない。

4) 画像切替時の selectIndex（既存呼出）
- 既存の `applyActualSizeMode / applyFitMode` 呼び出し順序と drag state リセットを維持。
- 実寸モード維持のままでもオフセットは初期化されるため、新画像幅に応じたクランプ範囲が自動適用される。

## パラメータ
- 閾値: ドラッグ開始判定しきい値 4px（既存を踏襲）

## 想定影響範囲と回帰観点
- クリックでの実寸⇔通常表示切替: 仕様維持（ドラッグ直後クリック無効も維持）。
- 縦方向ドラッグ: 仕様維持（高さ<=ビューア高で固定）。
- サムネイルによる画像切替、評価変更、コピー追加、連番初期化: 影響なし。

## テスト観点（受け入れ条件対応）
- 実寸で左/右ドラッグしても左右端の余白が出ないこと。
- 画像幅<=ビューア幅で水平ドラッグできないこと（中央固定）。
- 画像切替後も新寸法で正しくクランプすること。
- 通常表示へ戻すと transform が解除されること。
