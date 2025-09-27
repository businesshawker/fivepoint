# 設計・実装仕様

## 色の方針
- 各ボタンの背景色は彩度60%、輝度45%で統一する。
- 原色を避け、HSL値で調整した色を使用する。
- 色はCSS変数として定義し、意味のあるCSSクラスに割り当てる。

## 色割り当て
| ボタン | 意味 | CSS変数 | HSL | HEX | クラス名 | 適用ID |
|--------|------|---------|-----|-----|----------|--------|
| フォルダ選択 | 処理開始 | --btn-start | hsl(150,60%,45%) | #2dbb6d | BtnStart | pickDirBtn |
| 再読み込み | 更新・繰り返し | --btn-refresh | hsl(210,60%,45%) | #2d8bbb | BtnRefresh | refreshBtn |
| 通番のみ初期化 | 全ファイルへ影響大（中） | --btn-seqinit | hsl(30,60%,45%) | #bb8b2d | BtnSeqInit | seqInitBtn |
| 全て初期化 | 全ファイルへ影響大（高） | --btn-init | hsl(0,60%,45%) | #bb2d2d | BtnInitAll | initBtn |

## 実装手順
1. `:root`に各色のCSS変数を追加する。
2. CSSで`BtnStart`等のクラスを定義し、背景色と境界線色を該当CSS変数で指定する。
3. 既存のHTMLボタン要素に該当クラスを追加する。
4. クラス名やIDはUpperPascalCaseおよびLowerSnakeCase規約を遵守する。
