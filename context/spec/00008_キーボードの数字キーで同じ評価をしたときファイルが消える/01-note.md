### 調査結果
評価済みのファイルに同じ評価値を再度付けると、`renameFile` 関数が旧名と新名の区別をせずに削除処理を行うため、ファイルが消えてしまう。評価値が変わらない場合でも `removeEntry(newName)` と `removeEntry(oldHandle.name)` が順に実行され、既存ファイルが削除される。
この `renameFile` は評価変更処理 `changeRating` から呼び出されるため、同じ評価キーを押すとこの問題が発生する。

# codex cloud側で提案があったので適用