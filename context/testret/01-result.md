<table>
<tr><th>Test</th><th>Status</th></tr>
<tr><td>ビューアHTMLのタイトルが正しい</td><td>pass</td></tr>
<tr><td>ビューアHTMLのタイトルが重複していない</td><td>pass</td></tr>
<tr><td>フォルダ選択ボタンが存在する</td><td>pass</td></tr>
<tr><td>フォルダ選択ボタンが重複していない</td><td>pass</td></tr>
<tr><td>評価セレクトに0～5の選択肢がある</td><td>pass</td></tr>
<tr><td>評価セレクトに範囲外の選択肢がない</td><td>pass</td></tr>
<tr><td>pad5 は5桁のゼロパディング文字列を返す</td><td>pass</td></tr>
<tr><td>pad5 は負数や非数値入力でも文字列を返す</td><td>pass</td></tr>
<tr><td>isImageName は対応画像拡張子を判定する</td><td>pass</td></tr>
<tr><td>isImageName は不正な名前で false を返す</td><td>pass</td></tr>
<tr><td>parseRatingName は評価プレフィックス付きファイル名を解析する</td><td>pass</td></tr>
<tr><td>parseRatingName は不正なファイル名で null を返す</td><td>pass</td></tr>
<tr><td>parseRatingName は境界値0と5のファイル名を解析する</td><td>pass</td></tr>
<tr><td>parseRatingName は負の評価で null を返す</td><td>pass</td></tr>
<tr><td>pad5 は境界値を処理する</td><td>pass</td></tr>
<tr><td>操作説明書に進捗オーバーレイが記載されている</td><td>pass</td></tr>
<tr><td>操作説明書にエラーに関する記述が含まれていない</td><td>pass</td></tr>
<tr><td>Progress.isActive 初期状態は false</td><td>pass</td></tr>
<tr><td>Progress.show 正常系: 合計を設定し進捗を表示する</td><td>pass</td></tr>
<tr><td>Progress.show 異常系: 数値以外を渡しても表示される</td><td>pass</td></tr>
<tr><td>Progress.show 境界値: 0件を渡す</td><td>pass</td></tr>
<tr><td>Progress.update 正常系: 進捗を更新する</td><td>pass</td></tr>
<tr><td>Progress.update 異常系: 数値以外を渡す</td><td>pass</td></tr>
<tr><td>Progress.update 境界値: 全件完了</td><td>pass</td></tr>
<tr><td>Progress.hide 正常系: 表示中の進捗を隠す</td><td>pass</td></tr>
<tr><td>Progress.hide 異常系: 非表示状態で呼び出しても問題ない</td><td>pass</td></tr>
<tr><td>Progress.hide 境界値: 連続で呼び出しても状態は変わらない</td><td>pass</td></tr>
<tr><td>copyInWithSequence 正常系: 命名規則のファイルは評価を維持して通番採番</td><td>pass</td></tr>
<tr><td>copyInWithSequence 異常系: 命名規則に合わないファイルは評価0で通番採番</td><td>pass</td></tr>
<tr><td>copyInWithSequence 境界値: 通番なしのフォルダで0から採番</td><td>pass</td></tr>
<tr><td>initSequential は複数ファイルで進捗を表示する</td><td>pass</td></tr>
<tr><td>initSequenceOnly は複数ファイルで進捗を表示する</td><td>pass</td></tr>
<tr><td>loadFiles 異常系: 命名規則違反のファイル処理で progress.run を呼び出す</td><td>pass</td></tr>
<tr><td>Progress.run 正常系: showとhideでラップし結果を返す</td><td>pass</td></tr>
<tr><td>Progress.run 異常系: 例外でもhideされる</td><td>pass</td></tr>
<tr><td>Progress.run 境界値: total=0で呼び出し</td><td>pass</td></tr>
<tr><td>getLastSeqNumber 正常系: 最大通番を取得</td><td>pass</td></tr>
<tr><td>getLastSeqNumber 異常系: 命名規則に合わないファイルのみで -1 を返す</td><td>pass</td></tr>
<tr><td>getLastSeqNumber 境界値: ファイルが一つもない</td><td>pass</td></tr>
<tr><td>各種ボタン色のCSS変数が定義されている</td><td>pass</td></tr>
<tr><td>CSSクラスBtnStart, BtnRefresh, BtnSeqInit, BtnInitAllが存在する</td><td>pass</td></tr>
<tr><td>各ボタンに対応するCSSクラスが割り当てられている</td><td>pass</td></tr>
<tr><td>ImageZoomController.toggleActualSize 正常系: 実寸とフィットを切り替える</td><td>pass</td></tr>
<tr><td>ImageZoomController.toggleActualSize 異常系: 画像要素が存在しない場合は何もしない</td><td>pass</td></tr>
<tr><td>ImageZoomController.toggleActualSize 境界値: 連続で呼び出すと元に戻る</td><td>pass</td></tr>
<tr><td>changeRating 正常系: 評価付きファイルを別評価にリネームして並び替える</td><td>pass</td></tr>
<tr><td>changeRating 異常系: currentIndex が負なら何もしない</td><td>pass</td></tr>
<tr><td>changeRating 境界値: 未フォーマット名を評価付きにリネームする</td><td>pass</td></tr>
<tr><td>changeRating リグレッション: 同じ評価キーでファイルが消えない</td><td>pass</td></tr>
</table>
