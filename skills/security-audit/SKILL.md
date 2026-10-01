---
name: security-audit
description: Read-only, evidence-citing security review of a proposed or existing system change. Use when asked to audit a ticket, plan, LLD, handoff, or relevant implementation for security risks, requirement gaps, and validation needs; not for certification or penetration testing.
---

# Security audit

Review the security implications of the requested change, not the security of an entire system by default. Return
an evidence-linked assessment in the conversation. This is not certification, a compliance determination, or proof
of security.

## Use and inputs

- For automatic selection, ask for a security audit of a proposed or existing change. For explicit selection, ask
  to use `security-audit` on the ticket, plan, LLD, handoff, or implementation in question.
- Accept a ticket, plan, LLD, existing handoff, approved project security requirements, and relevant code,
  configuration, or test excerpts directly. Do not require a new brief or artifact. Read applicable project
  instructions and only the sources needed to assess this change; ask for the smallest missing source or decision
  when it would materially change the assessment. If access is unavailable, proceed with a bounded review and
  identify the gap.
- Establish which security requirements are approved and in scope when supplied. Treat draft requirements,
  summaries, and handoff claims as context, not as proof of implementation or approval. If requirements are absent
  or their authority is unclear, flag that explicitly; do not invent policy, claim compliance, or assume that a
  missing requirement means the system is safe or unsafe.

## Read-only boundary

Inspect supplied material and relevant local sources only. Do not edit code, configuration, tests, project docs,
or the supplied handoff; do not execute payloads, run active security tests, probe live systems, or transmit data.
Do not request credentials or ask the user to share them. Never print, quote, copy, or include secret values,
private keys, tokens, credentials, or customer data in the response or an artifact. If a relevant exposure is
visible, identify only its category and location, without reproducing the value. If inspection cannot be done
without exposing such data, stop that inspection and report the limitation.

## Review method

1. Define the change boundary: assets/data, actors and privileges, entry points, external integrations, and the
   trust boundaries that the supplied evidence actually identifies. Separate proposed behavior from existing
   behavior; identify the environment and version only when established by a source.
2. Trace relevant paths across the boundary, including callers, enforcement points, data flow, and failure paths
   where accessible. Consider authentication and authorization, input handling, sensitive data and secrets,
   dependencies and configuration, abuse controls, and security tests. Select categories by the change's actual
   exposure; do not require a finding or a test for every category. Note what was not applicable and why when
   that matters to coverage.
3. Compare observed behavior against supplied approved requirements. Check that a control is enforced at the
   relevant boundary rather than relying on its name or a design claim. Treat an absent test, file, or requirement
   as a coverage gap, not proof of a vulnerability or of compliance. Do not infer exploitability solely from a
   suspicious pattern; spell out the conditions needed and mark them unverified when not established.
4. Support every consequential finding with exact file and line locator(s) for inspected sources, or the supplied
   source's actual section, paragraph, page, or other locator. Distinguish inspected primary evidence from a
   user-provided summary or excerpt whose original was not inspected. Never invent a locator. When no precise
   locator is available, say so and request it for verification instead of presenting the claim as confirmed.
   Avoid quoting sensitive lines even when citing their location.
5. Classify each finding by both severity (critical, high, medium, low, or informational, based on conditional
   impact and likelihood supported by evidence) and evidence status:
   - **Confirmed vulnerability:** the inspected material establishes the flawed path and necessary conditions;
     no claim of a live exploit unless independently established.
   - **Likely risk:** a plausible harmful path is supported, but a key condition or control remains unverified.
   - **Defense-in-depth concern:** a weaker safeguard or hardening opportunity without evidence of a currently
     exploitable path.
   - **Missing requirement/evidence:** a decision, approved security requirement, source, or verification is
     missing; do not label the unknown as a vulnerability.
   - **Not applicable:** a category is outside the evidenced change boundary; give the reason in coverage rather
     than forcing a security finding.
   Do not manufacture findings to fill categories. For each actual finding, state impact, triggering conditions,
   uncertainty, and the smallest safe validation or fix recommendation. Suggest validation for a responsible
   human in an authorized environment; do not perform active validation as part of this skill.

## Response

- **Scope and evidence:** change reviewed, approved requirements available or missing, inspected sources with
  locators, and supplied summaries/excerpts not independently verified. Keep source descriptions free of values
  that could expose secrets or customer data.
- **Findings (highest severity first):** severity + evidence status, concise issue, precise evidence locator(s)
  or explicit locator gap, impact, necessary conditions and uncertainty, and smallest validation/fix. For a
  conflict with an approved requirement, cite the requirement and observed source separately. Make no compliance
  verdict.
- **Coverage and limits:** applicable areas examined, not-applicable areas with reasons when relevant, unreviewed
  paths/sources and why, and prioritized questions or next evidence needed. If no issue is found, say only that
  none was identified in the inspected material, not that the system is secure.
- End by stating: **This read-only audit is not certification or proof of security.**
