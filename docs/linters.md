# Scoped linter reference

Use the active project's configured lint/format commands, tool versions, style and quality gates. This document
provides optional setup examples, not project policy or permission to install tools. Project-specific findings,
accepted exceptions and toolchain state belong in that project's current canonical documents.

## Scope and changes

- Check relevant changed code with proportionate verification. Distinguish newly introduced findings from existing
  debt; do not turn a bounded change into unrelated legacy cleanup.
- Preserve required gate severity. Warn-only evaluation can help assess a new rule set, but does not downgrade an
  established failing project gate.
- Avoid unrelated formatting churn. Isolate formatting-only changes when useful; do not require another commit or
  prohibit a necessary correction merely because it touches existing code.
- Use existing configuration first. New dependencies, config files, rule changes or downloads need their applicable
  project/user authorization, rather than a universal setup ritual.

## Optional Java / Maven example

The repository supplies `templates/linters/checkstyle-essentials.xml` for evaluating a scoped rule set. It is not
a mandatory replacement for a project's existing checks. Adapt this example to the approved plugin version,
configuration and package scope; diagnostic warn-only settings are appropriate only when authorized:

```text
mvn org.apache.maven.plugins:maven-checkstyle-plugin:<approved-version>:check -Dcheckstyle.config.location=<config-path> -Dcheckstyle.includes=<changed-package-scope>
```

The first run may download Maven artifacts and the plugin may write build output. Do not claim a read-only scan
or unchanged environment merely because `pom.xml` was not edited.

## Optional frontend formatting check

Prefer the project's existing formatter/linter command. If an explicitly approved standalone Prettier check is
needed, choose the project's compatible version and pass relevant files rather than all source by habit:

```text
npx prettier@<approved-version> --check <changed-files>
```

`npx` may fetch and execute a package; this is not guaranteed installation-free. Match configured line-ending and
formatting conventions rather than imposing defaults. Report the exact command/scope/result and any unrun checks.
