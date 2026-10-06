# Writing guide — concise design artifacts

## Audience and timing
- The **Functional Design** is for the customer: observable behavior, rules, flows and acceptance outcomes.
- The **LLD** is for the Architect before implementation: the proposed boundaries and essential technical shape.
- The **Technical Design** is for the Architect after implementation: the delivered shape and verified outcomes.
- The plan is a separate execution artifact between approved LLD and implementation.

## Rules
1. **Use only the Jira ticket ID** in deliverables. Internal/CB tracking IDs are not customer-facing identifiers.
2. **Inputs are evidence, not citations.** Read supplied PDFs, slides, screenshots, CSS and source code as needed, but never name or cite those artifacts in the deliverables.
3. **Keep source locators internal.** Verify claims against real source and retain evidence in working notes, but omit source-code file paths and line numbers from all three deliverables.
4. **Be concise.** State the agreed or proposed behavior and only the component/API boundary needed for the design. Avoid long rationales, alternatives essays, source inventories, repeated scope, and speculative file-level detail.
5. **Do not invent.** Missing requirements, approvals, API contracts, deviations, measurements, or test outcomes remain questions or are marked as not verified.
6. **Functional Design has no Purpose/Scope duplicate, Status, or link to the LLD.** It is customer-facing and should not expose technical implementation.
7. **LLD is forward design; Technical Design is as-built.** Do not present a proposal as implemented or a proposed test as a passed check.
8. Use user-approved terms and decisions. Ask about consequential ambiguity instead of filling it with assumptions.

## Forward vs. as-built
- **Forward LLD:** draft after requirements are understood and before plan approval/implementation. It can name logical components and public API routes, but not source file locations.
- **As-built Technical Design:** draft only after plan implementation. Compare actual behavior with the approved LLD/plan and state only verified outcomes; submit it for Architect review.

## Verification
- Run the LLD checker. Manually review Functional Design behavior against the approved Jira requirements and Technical Design claims against the implemented change.
- A checker pass is not an Architect approval or an implementation/test result.
