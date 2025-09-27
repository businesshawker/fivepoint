# メソッド・関数コールチェーン

## 📁 フォルダ選択ボタンをクリック
```mermaid
sequenceDiagram
  participant U as User
  participant B as pickDirBtn
  participant A as App
  participant P as Progress
  U->>B: click
  B->>A: pickDirectory()
  A->>A: verifyPerms(dirHandle, 'readwrite')
  A-->>A: bool
  A->>A: saveDirHandle(dirHandle)
  A->>A: openDB()
  A-->>A: IDBDatabase
  A-->>A: (保存完了)
  A->>A: loadFiles()
  A->>P: run()
  P-->>A: void
  A->>A: renameFile()*
  A->>P: update()
  P-->>A: void
  A-->>A: (一覧作成)
  A->>A: renderThumbs()
  A->>A: selectIndex(0)
  A-->>A: (表示更新)
  A->>A: clearViewer()
  A-->>A: void
  A->>A: convertNonJpgs(true)
  A->>P: run()
  P-->>A: void
  A->>P: update()
  P-->>A: void
  A-->>B: done
```

## 🔄 再読み込みボタンをクリック
```mermaid
sequenceDiagram
  participant U as User
  participant R as refreshBtn
  participant A as App
  U->>R: click
  R->>A: loadFiles()
  A->>A: convertNonJpgs(true)
  A-->>R: done
```

## 🔢 評価セレクト変更
```mermaid
sequenceDiagram
  participant U as User
  participant S as ratingSelect
  participant A as App
  U->>S: change value
  S->>A: changeRating(rating)
  A->>A: renameFile(handle, newName)
  A-->>A: newHandle
  A->>A: renderThumbs()
  A->>A: selectIndex(idx)
  A-->>S: done
```

## 🧹 全て初期化ボタンをクリック
```mermaid
sequenceDiagram
  participant U as User
  participant I as initBtn
  participant A as App
  U->>I: click
  I->>A: initSequential()
  A->>A: loadFiles()
  A->>P: run()
  P-->>A: void
  A->>A: renameFile(tmp)
  A->>A: renameFile(final)
  A->>P: update()
  P-->>A: void
  A->>A: renderThumbs()
  A->>A: selectIndex(0)
  A-->>I: done
```

## 🧹 通番のみ初期化ボタンをクリック
```mermaid
sequenceDiagram
  participant U as User
  participant I as seqInitBtn
  participant A as App
  U->>I: click
  I->>A: initSequenceOnly()
  A->>A: loadFiles()
  A->>A: parseRatingName()
  A-->>A: info
  A->>P: run()
  P-->>A: void
  A->>A: renameFile(tmp)
  A->>A: renameFile(final)
  A->>P: update()
  P-->>A: void
  A->>A: renderThumbs()
  A->>A: selectIndex(0)
  A-->>I: done
```

## 📂 ファイルをドロップ
```mermaid
sequenceDiagram
  participant U as User
  participant D as dropzone
  participant A as App
  U->>D: drop files
  D->>A: copyInWithSequence(fileList)
  A->>A: verifyPerms(dirHandle, 'readwrite')
  A-->>A: bool
  A->>A: getLastSeqNumber()
  A-->>A: last
  A->>A: parseRatingName(name)
  A-->>A: info/null
  A->>A: loadFiles()
  A->>A: selectIndex(idx)
  A-->>D: done
```

## セッション復元
```mermaid
sequenceDiagram
  participant A as App
  A->>A: loadDirHandle()
  A->>A: openDB()
  A-->>A: storedHandle
  A->>A: verifyPerms(handle, 'readwrite')
  A-->>A: bool
  A->>A: loadFiles()
  A->>A: convertNonJpgs(true)
  A->>A: clearDirHandle()
  A->>A: openDB()
  A-->>A: (削除完了)
  A-->>A: ready
```

## 🖼 ビューア画像をクリックして実寸表示を切り替え
```mermaid
sequenceDiagram
  participant U as User
  participant V as viewer
  participant Z as ImageZoomController
  U->>V: click
  V->>Z: toggleActualSize()
  alt 実寸モードへ
    Z->>Z: applyActualSizeMode()
  else フィットモードへ
    Z->>Z: applyFitMode()
  end
```

## ファイル配置
- すべてのメソッド・関数: `fivepoint.html`
# コールチェーン（シーケンス図）

すべて `src/fivepoint.html` の関数・メソッドです。同期/非同期を矢印注記で明示し、戻り矢印も描画します。

起動時（セッション復元）

```mermaid
sequenceDiagram
  participant User
  participant Window as Window (src/fivepoint.html)
  participant FN as 関数群 (src/fivepoint.html)
  participant DB as IndexedDB

  User->>Window: ページロード
  activate Window
  Note over Window: IIFE により自動実行
  Window->>FN: loadDirHandle() [async]
  activate FN
  FN->>DB: openDB()/get('dir') [async]
  DB-->>FN: dirHandle or undefined
  FN-->>Window: ハンドル
  deactivate FN
  alt 権限あり
    Window->>FN: verifyPerms(handle,'readwrite') [async]
    FN-->>Window: granted/denied
    opt granted
      Window->>FN: loadFiles() [async]
      activate FN
      FN->>FN: verifyPerms(dirHandle,'readwrite') [async]
      FN-->>FN: granted
      FN->>FN: progress.run(...) [async]
      FN->>FN: renameFile(...) 0..n回 [async]
      FN->>Window: renderThumbs() [sync]
      FN->>Window: selectIndex(0) or clearViewer() [async]
      FN-->>Window: 完了
      deactivate FN
      Window->>FN: convertNonJpgs(true) [async]
      FN-->>Window: 完了
    end
  end
  deactivate Window
```

フォルダ選択フロー

```mermaid
sequenceDiagram
  participant User
  participant UI as pickDirBtn (src/fivepoint.html)
  participant FN as 関数群 (src/fivepoint.html)
  participant DB as IndexedDB
  participant FSA as File System Access API

  User->>UI: クリック
  UI->>FN: pickDirectory() [async]
  FN->>FSA: showDirectoryPicker() [async]
  FSA-->>FN: dirHandle
  FN->>FN: verifyPerms(dirHandle,'readwrite') [async]
  FN-->>UI: 権限確認
  opt granted
    FN->>DB: saveDirHandle(handle) [async]
    DB-->>FN: 保存OK
    FN->>FN: loadFiles() [async]
    FN-->>UI: 完了
    FN->>FN: convertNonJpgs(true) [async]
    FN-->>UI: 完了
  end
```

評価変更フロー（ドロップダウン/数字キー）

```mermaid
sequenceDiagram
  participant User
  participant UI as ratingSelect/key (src/fivepoint.html)
  participant FN as 関数群 (src/fivepoint.html)
  participant FSA as File System Access API

  User->>UI: 変更/キー押下
  UI->>FN: changeRating(rating) [async]
  FN->>FN: FileNameUtils.parseRatingName(name) [sync]
  alt フォーマット済
    FN->>FSA: renameFile(..) copy->delete(必要時) [async]
  else 未フォーマット
    FN->>FSA: renameFile(..) copy->delete(必要時) [async]
  end
  FN->>FN: files.sort + renderThumbs() [sync]
  FN->>FN: selectIndex(newIdx) [async]
  FN-->>UI: 完了
```

初期化フロー（全初期化・通番のみ）

```mermaid
sequenceDiagram
  participant User
  participant UI1 as initBtn (全て初期化)
  participant UI2 as seqInitBtn (通番のみ)
  participant FN as 関数群
  participant FSA as File System Access API

  User->>UI1: クリック
  UI1->>FN: initSequential() [async]
  FN->>FN: loadFiles() [async]
  FN->>FN: progress.run(..) リネーム計画 [async]
  loop rename tmp -> final
    FN->>FSA: renameFile(..) [async]
  end
  FN->>FN: files.sort + renderThumbs() [sync]
  FN->>FN: selectIndex(0) [async]
  FN-->>UI1: 完了

  User->>UI2: クリック
  UI2->>FN: initSequenceOnly() [async]
  FN->>FN: loadFiles() [async]
  loop rename tmp -> final
    FN->>FSA: renameFile(..) [async]
  end
  FN->>FN: files.sort + renderThumbs() [sync]
  FN->>FN: selectIndex(0) [async]
  FN-->>UI2: 完了
```

ドロップ追加フロー（Drag & Drop）

```mermaid
sequenceDiagram
  participant User
  participant UI as dropzone (src/fivepoint.html)
  participant FN as 関数群 (src/fivepoint.html)
  participant FSA as File System Access API

  User->>UI: 画像D&D
  UI->>FN: copyInWithSequence(fileList) [async]
  FN->>FN: getLastSeqNumber() [async]
  FN->>FN: loadFiles() [async]
  FN-->>FN: 最大通番
  loop files
    FN->>FSA: getFileHandle/write/removeEntry [async]
  end
  FN->>FN: loadFiles() [async]
  FN->>FN: selectIndex(last_new) [async]
  FN-->>UI: 完了
```

ビューア動作（実サイズ切替とドラッグ）

```mermaid
sequenceDiagram
  participant User
  participant Viewer as #viewer (src.fivepoint.html)
  participant Zoom as ImageZoomController

  User->>Viewer: click
  Viewer->>Zoom: toggleActualSize() [sync]
  alt 実サイズON
    Zoom->>Zoom: applyActualSizeMode() [sync]
  else フィット
    Zoom->>Zoom: applyFitMode() [sync]
  end
  User->>Viewer: mousedown/mousemove/mouseup
  Viewer->>Zoom: onMouseDown/Move/Up [sync]
  Zoom-->>Viewer: translate(x,y) 更新
```
