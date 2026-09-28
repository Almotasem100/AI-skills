# Linters: setup notes (2026-09-26)

Linters are the mechanical half of "standards" (the guard skills and `two-axis-review` are the judgement
half). The rule for agents: **run the project's linters on what you changed, report what they say, and never
fix a legacy file's findings in the same change as moving it.**

Principles:
- **Start warn-only and scoped to new code.** On a legacy codebase a stock rule set produces hundreds of
  findings, and an agent told to "fix lint" will rewrite code it was meant to port verbatim.
- **Prefer running from outside the repo** (config passed on the command line) until the owner approves adding
  config files to the project.
- **Formatting is one separate commit, or never.** Mixing a reformat into a feature diff hides the real change.

---

## Java (Maven): Checkstyle, run without touching `pom.xml`

```
mvn -q -B org.apache.maven.plugins:maven-checkstyle-plugin:3.6.0:check ^
  -Dcheckstyle.config.location=<AI-skills>\templates\linters\checkstyle-essentials.xml ^
  "-Dcheckstyle.includes=<package path>/**/*.java" ^
  -Dcheckstyle.failOnViolation=false -Dcheckstyle.violationSeverity=warning -Dcheckstyle.consoleOutput=true
```

- `checkstyle-essentials.xml` (in `templates/linters/`) holds only checks that point at bugs or dead code:
  unused imports/variables, empty catch blocks, `equals` without `hashCode`, `==` on strings, missing switch
  default, fall-through, missing braces… No whitespace, tab, import-order or Javadoc rules.
- Writes only to `target/` (the build output folder). Downloads the plugin from Maven Central on first run.
- Why not Google's or Sun's stock rules: on HDC's 14 ported `api/` files, `google_checks.xml` gave **926**
  warnings, 89% tabs and indentation, which is the team's style, not a defect.

## Angular: ESLint + Prettier

- **ESLint:** the standard route is `ng add angular-eslint`, which adds `eslint.config.js`, the dev
  dependencies and an `ng lint` target. **It changes the project** (new file, `package.json`,
  `angular.json`), so it needs the owner's approval and its own commit. Check the command against the current
  angular-eslint docs at install time. Not run yet.
- **Prettier:** check without installing anything, from the project folder:
  `npx prettier@3 --end-of-line auto --check "src/**/*.{ts,html,css}"`. `--end-of-line auto` matters on
  Windows with `core.autocrlf=true`, or every file shows as different.
- To only check what you changed: pass the changed files instead of the glob
  (`git diff --name-only --diff-filter=ACM develop...HEAD`).

---

## Applied to HDC (facts found 2026-09-26, read-only)

### Backend `cb379_hdc_pdc` (Java 21, Maven 3.9)
- **Today:** no Checkstyle, PMD, SpotBugs or Spotless in `pom.xml`. The team's quality gate is **SonarQube**
  (`HDC/staticAnalysis.bat` → `mvn sonar:sonar`, then `sonarCiBlocker.py` checks the blocker level).
- **Tested** (on a scratchpad copy of `HDC/src` + `pom.xml`, not the repo), with `checkstyle-essentials.xml`:
  - ported code `com/gae/hdc/api/**` (14 files): **2 warnings**, both real:
    `api/error/DaoServiceExceptionTranslator.java:3-4` import `DAOException` and `ServiceException`, which
    appear only in comments. Harmless; fix in a separate commit if wanted.
  - whole backend (255 files): 754 warnings (556 missing braces, **72 empty catch blocks**, 60 unused
    imports, 24 unused variables, 18 `==` on strings, …). Legacy findings: record, don't fix during the port.
- **Recommendation:** run the command above on `com/gae/hdc/api/**` after each ported slice, alongside the
  build. Keep SonarQube as the team gate. Adding the plugin to `pom.xml` later is optional and needs approval.
- **Security, separate from linting:** `HDC/staticAnalysis.bat` and `HDC/releaseStaticAnalysis.bat` are
  tracked in git and contain SonarQube credentials (a token and `-Dsonar.login` values). **The owner accepted
  this (2026-09-26): the repo is private to the team.** The values are deliberately not copied here.

### Frontend `cb379_dc_frontend` (Angular 20)
- **Today:** no ESLint. Prettier is configured in `package.json` (`printWidth: 100`, `singleQuote`, Angular
  parser for HTML) but **not installed and never applied**. `.editorconfig` present. TypeScript `strict` and
  `strictTemplates` are on, so `ng build` already catches type and template errors.
- **Tested** (on a scratchpad copy of `src` + `package.json`): Prettier 3.9.9 with the project's own settings
  flags **35 of 51** files. Main cause: trailing commas (Prettier 3 adds them by default; the code has none).
- **Decision for the owner:** either add `"trailingComma": "none"` to the Prettier settings to match the code
  as written, or reformat everything once in its own commit. Recommended: `"trailingComma": "none"` now
  (smallest change, no noisy diff), and re-check what's left.
- **ESLint:** `ng add angular-eslint` on the workstation, after approval, as its own commit; then fix nothing
  automatically, just look at the first report.

## How an agent should use this
After implementing, before `two-axis-review`: run the linter commands above on the changed files, paste the
summary into the review, and list legacy findings as "recorded, not fixed". A project's `AGENTS.md` should
name its exact lint commands (roadmap item 6).
