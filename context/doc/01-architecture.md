# アーキテクチャ

```mermaid
classDiagram
class FileNameUtils {
  +IMG_EXTS
  +pad5(n)
  +isImageName(name)
  +parseRatingName(name)
}
class Progress {
  +show(total)
  +update(done, total)
  +hide()
  +isActive()
  +run(total, work)
}
class ImageZoomController {
  +constructor(viewer_elem)
  +toggleActualSize()
  +applyFitMode()
  +applyActualSizeMode()
  +onMouseDown(evt)
  +onMouseMove(evt)
  +onMouseUp()
}
class App {
  +openDB()
  +saveDirHandle(handle)
  +loadDirHandle()
  +clearDirHandle()
  +verifyPerms(handle, mode)
  +pickDirectory()
  +loadFiles()
  +clearViewer()
  +renderThumbs()
  +selectIndex(i)
  +renameFile(oldHandle, newName)
  +changeRating(rating)
  +initSequential()
  +initSequenceOnly()
  +convertNonJpgs(auto)
  +getLastSeqNumber()
  +copyInWithSequence(fileList)
}
class BtnStart
class BtnRefresh
class BtnSeqInit
class BtnInitAll
```

## ファイル配置
- FileNameUtils の各メソッド: `fivepoint.html`
- Progress の各メソッド: `fivepoint.html`
- App クラス相当の各関数: `fivepoint.html`
- BtnStart / BtnRefresh / BtnSeqInit / BtnInitAll クラス: `fivepoint.html`
- ImageZoomController の各メソッド: `fivepoint.html`
# アーキテクチャ概要（src/fivepoint.html）

以下は本プロジェクトの主要クラスと関数の俯瞰図です。クラス内のメソッドおよびモジュール関数を網羅し、定義ファイルを括弧書きで併記しています。

```mermaid
classDiagram
  class FileNameUtils {
    <<utility (src/fivepoint.html)>>
    +static IMG_EXTS
    +static pad5(n)
    +static isImageName(name)
    +static parseRatingName(name)
  }

  class Progress {
    <<class (src/fivepoint.html)>>
    +constructor(overlay, text)
    +show(total)
    +update(done, total)
    +hide()
    +isActive()
    +run(total, work)
  }

  class ImageZoomController {
    <<class (src/fivepoint.html)>>
    +constructor(viewer_elem)
    +resetDragState()
    +toggleActualSize()
    +applyFitMode()
    +applyActualSizeMode()
    +onMouseDown(evt)
    +onMouseMove(evt)
    +onMouseUp()
  }

  class Functions {
    <<module functions (src/fivepoint.html)>>
    +openDB()
    +saveDirHandle(handle)
    +loadDirHandle()
    +clearDirHandle()
    +verifyPerms(handle, mode='read')
    +pickDirectory()
    +loadFiles()
    +clearViewer()
    +renderThumbs()
    +selectIndex(i)
    +renameFile(oldHandle, newName)
    +changeRating(rating)
    +initSequential()
    +initSequenceOnly()
    +convertNonJpgs(auto=false)
    +getLastSeqNumber()
    +copyInWithSequence(fileList)
  }

  FileNameUtils <.. Functions : uses
  Progress <.. Functions : uses
  ImageZoomController <.. Functions : uses
```

主要データフロー（高レベル）

```mermaid
flowchart LR
  User["User"] -->|click| UI["UI要素群 (src/fivepoint.html)"]
  UI -->|events| Ctrls["イベントハンドラ"]
  Ctrls --> FN["関数群"]
  FN --> DB["IndexedDB"]
  FN --> FSA["File System Access API"]
  FN --> Prog["Progress オーバーレイ"]
  FN --> Zoom["ImageZoomController"]
  FN --> UI
```

補足

- すべてのメソッド・関数は `src/fivepoint.html` に定義されています。
- UI は同ファイル内の HTML/DOM 要素（ID/クラス）に対応します。
- ファイル入出力はブラウザの File System Access API を利用しています。
