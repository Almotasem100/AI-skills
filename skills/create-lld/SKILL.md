---
name: create-lld
description: Create recipient-focused feature design with a concrete forward LLD for architect review, also called Technical Design when the project uses that name, and a concise customer-facing Functional Design when requested. Use original evidence internally; keep workflow history and source inventories out of deliverables.
---

# Feature design

Design at feature/parent scope when the project uses delivery slices. Create only requested/applicable artifacts;
child-ticket mechanics do not require splitting the design. Project instructions own identifiers, filenames,
locations, delivery medium and approval gates. Follow supplied conventions without inventing metadata. The
filename identifies the ticket/deliverable; the descriptive title belongs inside. If none is supplied, use a
clear neutral filename and title rather than inventing a tracker ID.

## Artifact purpose

- **Forward LLD / Technical Design:** the intended technical implementation, for the architect before planning.
  “Technical Design” can be this artifact's delivery name; that label does not make it an as-built document.
- **Functional Design:** the proposed customer-visible solution, supplementing the supplied business requirements.
- **Implementation plan:** separate execution sequencing, work breakdown and concrete verification commands.
- **As-built record:** create separately only when explicitly required by project/team practice, regardless of label.

## Ground and reconcile

Read relevant original requirements, approved decisions and project architecture; inspect current source as needed
to develop a credible design. An absent technical summary is not a missing-input blocker when originals are
available. Intake is navigation, not a required technical survey or approved solution. Verify
consequential observations against originals. Resolve material owner-level ambiguities before treating dependent
design as settled; routine design choices do not create new owner approval gates.
Start with the smallest design that satisfies approved behavior and current project conventions; justify extra
state, abstractions or duplicated business rules with a concrete requirement. For permission-sensitive flows,
distinguish client visibility/interaction from authoritative server enforcement; do not copy server role policies
into the client when the established capability contract already provides what the UI needs.

Deliver one coherent current design. Replace superseded statements and reconcile affected companion artifacts;
do not append an amendment telling the recipient how to combine contradictory versions. Preserve useful history
in existing working evidence/Git, not in the current deliverable. Distinguish revised documents from companions
checked and left unchanged; do not claim paired reconciliation from one file edit.

## Architect-facing forward design

Use `templates/lld-section.md` adaptively. A brief purpose/objective can establish scope; Context and separate
Objectives headings are optional, not paperwork requirements. Describe the actual proposed changes:

- Frontend components/services and important methods, state ownership and interactions.
- Backend resources/services and responsibilities, inputs/outputs, relevant API contracts and failures.
- Data/entity/schema changes and persistence effects when applicable.
- A short call flow, signatures or payload examples where they make the design assessable.

Use concrete existing identifiers verified from source and clearly proposed names for new components. Relevant
file/module paths are valid design coordinates, not a forbidden file inventory. Explain how pieces interact and
why a consequential choice is needed; avoid full source listings or implementation-plan task lists. Include only
applicable layers. Keep security, compatibility, deployment/migration and recovery details when the change actually
affects them; local workstation instructions and routine temporary rollout operations belong in execution records.
Do not hide material failure/data-integrity behavior merely to shorten the design.

## Customer-facing Functional Design

Use `templates/functional-design.md` as a starting point. Explain the proposed experience: what appears/changes,
what important actions do, and meaningful limits or unavailable actions. Supplement rather than rewrite the
requirements or explain the customer's unchanged business process back to them. Include only states/rules that
help the customer understand and agree to the solution. No internal class/file names or workflow narration.

When this is content for an existing requirements deck, provide slide-ready content, normally one or two slides
for an ordinary feature: concise bullets and an annotated visual/compact flow when useful. Do not force complex
scope into an unreadable slide or produce/edit a presentation unless requested. A standalone document can expand
when its recipient needs it; do not force five sections that repeat the same behavior.

## Delivery check

Never invent requirements, identifiers, dates, release metadata, measurements or execution results. Keep source
inventories, investigation citations, internal decision numbers and session history in working evidence unless the
recipient expressly requires them. State an applicable constraint in understandable terms instead of citing a
private conventions document. Preserve meaningful recipient-required references and public interface names.

Run `node <skill-dir>/scripts/check-lld.mjs <design.md> --size <small|normal>` for the forward design, then review
technical specificity, source grounding and recipient fit manually. A structural pass is not design approval.
Check the requested designs together for consistent behavior, then present them at the applicable review boundary.
An explicitly required as-built record uses `templates/technical-design.md` and verified implementation evidence;
do not create it automatically or report intended checks as executed.

Style examples: `references/example-lld.md` and `references/example-functional-design.md` use synthetic inputs;
they demonstrate recipient fit, not verified implementation or approval.
