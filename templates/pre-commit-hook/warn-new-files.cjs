// Called by the pre-commit hook in this folder: warns (never blocks) when the commit adds new files.
// Why: new files are where unapproved changes hide; the warning makes sure a human looks at the list.
// Needs only git and Node 18+. Install: see README.md in this folder.

// .cjs so it runs as CommonJS on every Node version, whatever package.json the repository has.
const { execFileSync } = require("node:child_process");

let added = [];
try {
  const out = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=A", "-z"], {
    encoding: "utf8",
  });
  added = out.split("\0").filter(Boolean);
} catch {
  // If git can't answer, stay out of the way: this hook must never stop a commit.
  process.exit(0);
}

if (added.length > 0) {
  const lines = [
    "",
    `WARNING: this commit adds ${added.length} new file(s):`,
    ...added.map((f) => `  + ${f}`),
    "Check each one was approved. The commit goes ahead; to undo it: git reset --soft HEAD~1",
    "",
  ];
  process.stderr.write(lines.join("\n") + "\n");
}
process.exit(0);
