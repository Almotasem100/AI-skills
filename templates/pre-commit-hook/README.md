# Pre-commit hook: warn about new files

Prints a warning listing every file a commit **adds**, so a human checks each one was approved. It never
blocks: the commit always goes ahead. Edits, renames and deletions stay quiet.

```
WARNING: this commit adds 2 new file(s):
  + dir with space/new file.java
  + ünï.txt
Check each one was approved. The commit goes ahead; to undo it: git reset --soft HEAD~1
```

Two files, both needed:
- `pre-commit`: the hook git runs (a 3-line shell wrapper; Git for Windows runs it with its own `sh`).
- `warn-new-files.cjs`: the check itself (Node, no dependencies).

If Node isn't installed, the wrapper does nothing, so a commit is never stopped by the hook itself.

## Install in one repository
Copy both files into that repository's `.git/hooks/` folder. From PowerShell, in the repository:

```powershell
$hook = "C:\Users\Mohamed\Downloads\WorkSpace\AI-skills\templates\pre-commit-hook"
Copy-Item "$hook\pre-commit", "$hook\warn-new-files.cjs" (git rev-parse --git-path hooks)
```

`.git/hooks/` is not tracked by git, so this adds **no file to the repository** and nothing is pushed. It still
changes how that repository behaves on your machine, so for a project with a "no new files" rule (HDC), get
approval first like any other change. Each clone needs its own install.

**Remove:** delete `pre-commit` and `warn-new-files.cjs` from `.git/hooks/`.

## Tested (2026-09-26, laptop, Git for Windows, Node 24)
On a throwaway repository: new file → warning; two new files with a space and non-ASCII names → both listed;
edit only, rename only, delete only → silent; `package.json` with `"type": "module"` → still works; Node
removed from `PATH` → silent and the commit succeeds; commit from PowerShell → same warning. Not tested: Node
18/20, macOS/Linux, GUI git clients.
