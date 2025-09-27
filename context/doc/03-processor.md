# 処理一覧

## FileNameUtils （fivepoint.html）
- 役割: ファイル名に関するユーティリティを提供するクラス。
- メソッド:
  - `pad5(n)`
    - 引数: `n` 数値。例: `42`
    - 戻り値: 5桁にゼロ詰めした文字列。例: `'00042'`
    - 処理: `toString()`して`padStart(5, '0')`で桁揃え。
  - `isImageName(name)`
    - 引数: `name` 文字列。例: `'photo.jpg'`
    - 戻り値: 対応拡張子であれば`true`、それ以外は`false`。
    - 処理: `IMG_EXTS`に含まれる拡張子との後方一致を確認。
  - `parseRatingName(name)`
    - 引数: `name` 文字列。例: `'3-sample.png'`
    - 戻り値: `{ rating: 数値, rest: 文字列, ext: 文字列 }` 例: `{ rating:3, rest:'sample', ext:'png' }`。不正なら`null`。
    - 処理: `/^([0-5])-(.+)\.(\w+)$/`で解析し構造体を返す。

## Progress （fivepoint.html）
- 役割: 進捗オーバーレイを制御するクラス。
- メソッド:
  - `show(total)`
    - 引数: `total` 数値。例: `5`
    - 戻り値: `void`
    - 処理: オーバーレイを表示し `0 / total` を描画、フォーカス解除。
  - `update(done, total)`
    - 引数: `done` 数値、`total` 数値。例: `done=3, total=10`
    - 戻り値: `void`
    - 処理: `done / total` を表示テキストに設定。
  - `hide()`
    - 引数: なし
    - 戻り値: `void`
    - 処理: オーバーレイを非表示にし状態をリセット。
  - `isActive()`
    - 引数: なし
    - 戻り値: ブール値。例: `true`
    - 処理: 表示状態を返す。
  - `run(total, work)`
    - 引数: `total` 数値、`work` 非同期関数。例: `work=async()=>{}`
    - 戻り値: `Promise<*>`
    - 処理: `show(total)`で表示し、`work` 実行後に `hide()` する。

## ImageZoomController （fivepoint.html）
- 役割: ビューア内画像の実寸表示とドラッグ移動を制御するクラス。
- メソッド:
  - `constructor(viewer_elem)`
    - 引数: `viewer_elem` `HTMLElement`。例: `<div class="viewer">`。
    - 戻り値: なし
    - 処理: ビューア要素と画像要素を保持しイベントを設定する。
  - `toggleActualSize()`
    - 引数: なし
    - 戻り値: なし
    - 処理: 実寸モードとフィットモードを切り替える。
  - `applyFitMode()`
    - 引数: なし
    - 戻り値: なし
    - 処理: `.viewer--actual` を解除し画像をフィット表示に戻す。
  - `applyActualSizeMode()`
    - 引数: なし
    - 戻り値: なし
    - 処理: `.viewer--actual` を付与し画像を実寸表示にする。
  - `onMouseDown(evt)`
    - 引数: `evt` `MouseEvent`。例: `{clientX:0,clientY:0}`
    - 戻り値: なし
    - 処理: ドラッグ開始位置を記録する。
  - `onMouseMove(evt)`
    - 引数: `evt` `MouseEvent`
    - 戻り値: なし
    - 処理: 画像を移動しオフセットを更新する。
  - `onMouseUp()`
    - 引数: なし
    - 戻り値: なし
    - 処理: ドラッグ状態を解除する。

## グローバル関数 （fivepoint.html）
- `openDB()`
  - 引数: なし
  - 戻り値: `IDBDatabase` を解決する `Promise`
  - 処理: IndexedDB を開き、ストアを準備。
- `saveDirHandle(handle)`
  - 引数: `handle` `FileSystemDirectoryHandle`
  - 戻り値: `Promise<void>`
  - 処理: `openDB()`で DB を開き、ハンドルを保存。
- `loadDirHandle()`
  - 引数: なし
  - 戻り値: 保存された `FileSystemDirectoryHandle`。例: `{name:'images'}`
  - 処理: DB からキー`dir`の値を取得。
- `clearDirHandle()`
  - 引数: なし
  - 戻り値: `Promise<void>`
  - 処理: DB からキー`dir`の値を削除。
- `verifyPerms(handle, mode='read')`
  - 引数: `handle` `FileSystemHandle`, `mode` 文字列。例: `'readwrite'`
  - 戻り値: `Promise<boolean>`
  - 処理: `queryPermission`と`requestPermission`で権限確認。
- `pickDirectory()`
  - 引数: なし
  - 戻り値: `Promise<void>`
  - 処理: `showDirectoryPicker`でフォルダ選択→`verifyPerms`→`saveDirHandle`→`loadFiles`→`convertNonJpgs(true)`を実行。
- `loadFiles()`
  - 引数: なし
  - 戻り値: `Promise<void>`
  - 処理: 選択フォルダの画像を列挙し、不正な名前は`progress.run`で進捗表示しつつ`renameFile`で`0-00000.jpg`形式に変換、`renderThumbs`と`selectIndex`で表示。ファイルが無ければ`clearViewer`。
- `clearViewer()`
  - 引数: なし
  - 戻り値: `void`
  - 処理: メイン画像とラベルをリセット。
- `renderThumbs()`
  - 引数: なし
  - 戻り値: `void`
  - 処理: 画像リストからサムネイル DOM を生成。
- `selectIndex(i)`
  - 引数: `i` 数値。例: `0`
  - 戻り値: `Promise<void>`
  - 処理: 指定インデックスの画像を表示し、評価セレクトを同期。
- `renameFile(oldHandle, newName)`
  - 引数: `oldHandle` `FileSystemFileHandle`, `newName` 文字列
  - 戻り値: 新しい `FileSystemFileHandle`
  - 処理: `oldHandle.name` と `newName` が同一なら何もせず旧ハンドルを返し、異なる場合はファイルをコピーして旧ファイルを削除しリネーム。
- `changeRating(rating)`
  - 引数: `rating` 数値。例: `3`
  - 戻り値: `Promise<void>`
  - 処理: 現在表示中のファイル名を評価プレフィックスで`renameFile`し並び替え。
- `initSequential()`
  - 引数: なし
  - 戻り値: `Promise<void>`
  - 処理: 全画像を `0-00000.jpg` から順にリネームする。衝突回避のため一時名を経由。
- `initSequenceOnly()`
  - 引数: なし
  - 戻り値: `Promise<void>`
  - 処理: 評価を保持したまま通番のみ振り直す。`parseRatingName`を利用。
- `convertNonJpgs(auto=false)`
  - 引数: `auto` ブール値。例: `true`
  - 戻り値: `Promise<void>`
  - 処理: jpg 以外の画像を jpg に変換し、進捗を`Progress`で表示。
- `getLastSeqNumber()`
  - 引数: なし
  - 戻り値: 最大通番数値。例: `123`
  - 処理: 現在のフォルダから `*-NNNNN.ext` の最大 N を探索。
- `copyInWithSequence(fileList)`
  - 引数: `fileList` `File[]`
  - 戻り値: `Promise<void>`
  - 処理: `getLastSeqNumber`で通番を取得し各ファイル名を解析。命名規則`評価-XXXXX.ext`に一致する場合は評価を維持し最新通番+1で保存、一致しない場合は評価0で保存する。処理後に`loadFiles`と`selectIndex`を実行。

## CSSクラス （fivepoint.html）
- `BtnStart`
  - 役割: フォルダ選択ボタンの背景色と境界線色を定義する。
  - 引数: なし
  - 戻り値: なし
  - 内部処理: `--btn-start` を背景と境界線に適用する。
- `BtnRefresh`
  - 役割: 再読み込みボタンの背景色と境界線色を定義する。
  - 引数: なし
  - 戻り値: なし
  - 内部処理: `--btn-refresh` を背景と境界線に適用する。
- `BtnSeqInit`
  - 役割: 通番のみ初期化ボタンの背景色と境界線色を定義する。
  - 引数: なし
  - 戻り値: なし
  - 内部処理: `--btn-seqinit` を背景と境界線に適用する。
- `BtnInitAll`
  - 役割: 全て初期化ボタンの背景色と境界線色を定義する。
  - 引数: なし
  - 戻り値: なし
  - 内部処理: `--btn-init` を背景と境界線に適用する。
# プロセッサ一覧（役割・引数・戻り値）

定義ファイル: すべて `src/fivepoint.html`

クラス: FileNameUtils

- 役割: 画像ファイル名の判定・整形・解析のユーティリティ。
- メソッド: IMG_EXTS
  - 説明: 許容拡張子リスト。例: ["jpg","jpeg","png","webp","gif","bmp"]
- メソッド: pad5(n)
  - 引数: `n:number` 例: `42`
  - 戻り値: `string` 例: `"00042"`
- メソッド: isImageName(name)
  - 引数: `name:string` 例: `"0-00005.jpg"`
  - 戻り値: `boolean`
- メソッド: parseRatingName(name)
  - 引数: `name:string` 例: `"3-12345.png"`
  - 戻り値: `{rating:number, rest:string, ext:string} | null`

クラス: Progress

- 役割: 進捗ダイアログの表示・非表示、進捗更新、処理ラッパ。
- コンストラクタ: `(overlay:HTMLElement, text:HTMLElement)`
- メソッド: show(total)
  - 引数: `total:number` 例: `10`
  - 戻り値: `void`
- メソッド: update(done,total)
  - 引数: `done:number`, `total:number`
  - 戻り値: `void`
- メソッド: hide()
  - 戻り値: `void`
- メソッド: isActive()
  - 戻り値: `boolean`
- メソッド: run(total, work)
  - 引数: `total:number`, `work:() => Promise<any>`
  - 戻り値: `Promise<any>`（finally で自動的に hide）

クラス: ImageZoomController

- 役割: ビューアの実サイズ切替とドラッグ移動を管理。
- コンストラクタ: `(viewer_elem:HTMLElement)`
- メソッド: resetDragState()
  - 戻り値: `void`
- メソッド: toggleActualSize()
  - 戻り値: `void`
- メソッド: applyFitMode()
  - 戻り値: `void`
- メソッド: applyActualSizeMode()
  - 戻り値: `void`
- メソッド: onMouseDown(evt)
  - 引数: `MouseEvent`
  - 戻り値: `void`
- メソッド: onMouseMove(evt)
  - 引数: `MouseEvent`
  - 戻り値: `void`
- メソッド: onMouseUp()
  - 戻り値: `void`

関数群（モジュール関数）

- openDB()
  - 役割: IndexedDB を開く（DB='fpHandleDB', store='dir'）。
  - 引数: なし
  - 戻り値: `Promise<IDBDatabase>`

- saveDirHandle(handle)
  - 役割: ディレクトリハンドルを IndexedDB に保存。
  - 引数: `handle:FileSystemDirectoryHandle`
  - 戻り値: `Promise<void>`

- loadDirHandle()
  - 役割: 保存済みディレクトリハンドルを取得。
  - 引数: なし
  - 戻り値: `Promise<FileSystemDirectoryHandle | undefined>`

- clearDirHandle()
  - 役割: 保存済みディレクトリハンドルを削除。
  - 引数: なし
  - 戻り値: `Promise<void>`

- verifyPerms(handle, mode='read')
  - 役割: File System Access API の権限確認/要求。
  - 引数: `handle:FileSystemHandle`, `mode:'read'|'readwrite'`
  - 戻り値: `Promise<boolean>`

- pickDirectory()
  - 役割: フォルダ選択ダイアログ、権限確認、保存、読み込み/変換を実行。
  - 引数: なし
  - 戻り値: `Promise<void>`

- loadFiles()
  - 役割: 画像一覧を収集、形式外のファイルへ通番付与、並べ替え、描画。
  - 引数: なし
  - 戻り値: `Promise<void>`

- clearViewer()
  - 役割: メイン画像/ラベルの初期化。
  - 引数: なし
  - 戻り値: `void`

- renderThumbs()
  - 役割: サムネイル一覧の再描画、総数表示。
  - 引数: なし
  - 戻り値: `void`

- selectIndex(i)
  - 役割: 指定インデックスの画像を表示、評価 UI 同期、サムネ再描画。
  - 引数: `i:number`
  - 戻り値: `Promise<void>`

- renameFile(oldHandle, newName)
  - 役割: File System Access API で copy->delete によりリネーム。
  - 引数: `oldHandle:FileSystemFileHandle`, `newName:string`
  - 戻り値: `Promise<FileSystemFileHandle>`

- changeRating(rating)
  - 役割: ファイル名の評価番号を変更し並べ替え/再描画。
  - 引数: `rating:0|1|2|3|4|5`
  - 戻り値: `Promise<void>`

- initSequential()
  - 役割: すべての画像を `0-00000.ext` から通番で初期化。
  - 引数: なし
  - 戻り値: `Promise<void>`

- initSequenceOnly()
  - 役割: 評価を保持したまま通番のみ振り直し。
  - 引数: なし
  - 戻り値: `Promise<void>`

- convertNonJpgs(auto=false)
  - 役割: jpg 以外を jpg に変換（jpeg は拡張子変更、それ以外は Canvas 変換）。
  - 引数: `auto:boolean` 例: `true`
  - 戻り値: `Promise<void>`

- getLastSeqNumber()
  - 役割: `*-NNNNN.ext` の最大通番を返す（必要に応じて一覧再読込）。
  - 引数: なし
  - 戻り値: `Promise<number>` 例: `42`（存在しなければ `-1`）

- copyInWithSequence(fileList)
  - 役割: D&D された画像を末尾通番でコピー追加。既存評価フォーマットを尊重。
  - 引数: `fileList:File[]`
  - 戻り値: `Promise<void>`

例外・エラー方針

- File System Access API の権限が無い場合は `alert` による通知や早期 return を行う。
- 変換・リネームのバッチ処理は `Progress.run()` で進捗を可視化し、finally で確実に非表示。
- rename の衝突回避は一時名に退避してから最終名に再リネームする方式を採用。
