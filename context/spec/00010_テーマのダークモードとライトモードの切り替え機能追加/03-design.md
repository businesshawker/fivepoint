## プログラムの実装方針
- `src/fivepoint.html` に対してのみ修正を行い、既存のダークテーマ用 CSS カスタムプロパティをライトテーマにも流用できるよう再編する。
- `body` 要素に `data-theme` 属性を付与し、`data-theme="dark"` と `data-theme="light"` でテーマを判定させる。デフォルトは `dark` とする。
- CSS カスタムプロパティはダークテーマを `:root` で定義し、ライトテーマは `body[data-theme="light"]` のセレクタで同名プロパティを上書きする。ボタン色 (`--btn-*`) は両テーマで同値にし、既存の色味を維持する。
- 直接カラーコードを指定している箇所は `--surface`, `--surface-alt`, `--border`, `--overlay` などの新規カスタムプロパティへ置き換え、ライトテーマでも値を切り替えられるようにする。
- ヘッダー右側にテーマ切り替えボタンを追加し、クリックごとに `dark`/`light` を交互に切り替える。トグル状態は `localStorage` に `themePreference` キーで保存し、再訪時に復元する。
- JavaScript でテーマ変更時に `body` の `data-theme` を更新しつつ、ボタンの表示テキストを現在の状態に同期させてユーザーへフィードバックを与える。

## 対象ファイル名と対象メソッド名一覧
- `src/fivepoint.html`
  - 【既存修正】スタイル定義（`:root`、各 UI コンポーネントのカラー指定）
  - 【既存修正】`<header>` 内のボタン配置（右側エリアに切り替えボタン追加）
  - 【新規作成】`applyTheme(theme_mode)` 関数
  - 【新規作成】`toggleTheme()` 関数
  - 【新規作成】`initializeTheme()` 関数
  - 【新規作成】`bindThemeToggle()` 関数

## 対象メソッドの詳細設計
### applyTheme(theme_mode)
- **目的**: 渡されたテーマモードを `body` へ反映し、ローカルストレージとボタン表示を同期させる。
- **パラメータ**: `theme_mode` — `'dark'` または `'light'` の文字列。
- **処理手順**:
  1. 受け取った `theme_mode` を検証し、想定外の値の場合は `'dark'` にフォールバックする。
  2. `document.body.dataset.theme` に確定したテーマ名を代入する。
  3. `localStorage.setItem('themePreference', theme_mode)` で選択状態を永続化する。
  4. `document.getElementById('themeToggleBtn')` からボタン要素を取得し、存在する場合は `theme_mode` に応じた表示テキスト（例: ダーク中なら「🌙 ダーク」/ライト中なら「☀️ ライト」）へ更新する。

### toggleTheme()
- **目的**: 現在のテーマから別のテーマへ切り替えるトグルロジックを担当する。
- **処理手順**:
  1. 現在のテーマを `document.body.dataset.theme` から読み取る。既定値は `'dark'` とみなす。
  2. `next_theme` を `current === 'light' ? 'dark' : 'light'` で決定する。
  3. `applyTheme(next_theme)` を呼び出し、反映させる。

### initializeTheme()
- **目的**: ページロード時にテーマを初期化し、ローカルストレージ保存値を優先して設定する。
- **処理手順**:
  1. `localStorage.getItem('themePreference')` を読み出す。
  2. 取得値が `'dark'` または `'light'` の場合はそのまま、取得できない場合は `'dark'` を使用する。
  3. `applyTheme(決定したテーマ)` を実行する。

### bindThemeToggle()
- **目的**: テーマ切り替えボタンへイベントを結線する。
- **処理手順**:
  1. `document.getElementById('themeToggleBtn')` でボタンを取得する。
  2. 取得に成功したら `click` リスナーを登録し、ハンドラー内で `toggleTheme()` を呼び出す。
  3. 初期化処理の一環として `initializeTheme()` 実行後に呼び出す。

### 初期化フローへの組み込み
- 既存スクリプトの末尾で行っているイベント結線ブロックに `bindThemeToggle()` を追加する。
- 即時実行関数（セッション復元処理など）より前で `initializeTheme()` を呼び出し、HTML の読み込み直後にテーマが反映された状態にする。

### CSS カスタムプロパティの更新詳細
- `--bg`, `--panel`, `--text`, `--muted`, `--accent`, `--overlay`, `--border` を中心に UI 全体で利用するプロパティへ統一する。
- ビューアやサイドバーなど直接色指定されている要素は、対応する `var(--surface)` `var(--surface-alt)` `var(--border)` 等へ置き換える。
- ライトテーマでは `--bg` を #f3f6ff 付近、`--text` を #1a1f2b、`--panel` を #ffffff とし、明度と彩度を高めた配色を設定する。
- ボタン系カスタムプロパティ (`--btn-start` など) はダークテーマと同一値を維持し、ライトテーマの上書き対象に含めない。

