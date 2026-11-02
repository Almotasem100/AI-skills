# CLI dispatch reference

Load only for route discovery, first use of an installed relay, or a concrete dispatch failure. The optional
[profile](ai-skills-delegation.md) owns activation, role allocation and recovery authorization. This reference
explains execution mechanics; it does not grant additional permissions or activate the profile.

## Discover and invoke

Locate the installed `delegate-setup` and read the effective fleet without changing it:

```text
node "<installed-delegate-setup>/scripts/config.mjs" load --cwd "<project-root>"
node "<installed-delegate-setup>/scripts/lane.mjs" resolve --cwd "<project-root>" --lane "<selected-lane>" --implementer "<configured-implementer>"
```

The loader reports effective global/project configuration and trust. The resolver identifies the skill and dials.
A relay using `--lane` may perform resolution internally; retain its invocation/result instead of demanding a
redundant standalone resolve call. Read that installed skill and run its documented `scripts/relay.mjs` command.
The loader/resolver is read-only; this is not an instruction to run a setup interview or rewrite configuration.

## Diagnose actual evidence

- A relay script runs through the terminal; it need not appear in the host's tool catalog.
- Use the terminal tool's actual schema. A rejected argument shape is not a permission denial.
- The semantic catalog, filename searches and host model inventory are not the effective fleet.
- Blank command lookup with errors suppressed does not prove a binary or route absent. Inspect the selected
  CLI/relay environment and retain the concrete lookup, discovery or invocation error.
- Route resolution is not dispatch. A configured route is not proof of live provider availability.
- Copy continuation IDs from that assignment's result/events, not memory. Preserve old attempts by using a new
  output directory. A failed transport can leave usable outputs; process status and task acceptance are separate.

For quota, unknown worker status, fallback or equivalent native recovery, apply the profile's recovery policy.
Do not change authentication, permission settings, fleet mappings or the retired execution.json as a diagnostic fix.
