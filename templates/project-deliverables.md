# Example project delivery conventions

Optional project-owned starter, not automatically loaded policy. Adopt only applicable conventions in the active
project's canonical instructions, or provide them as task inputs. Semantic roles and timing remain in the shared
workflow; these conventions describe names/audiences, not another execution mechanism.

| Deliverable | Example filename convention | Recipient |
| --- | --- | --- |
| Forward LLD, delivered as Technical Design | `<feature-id>_Technical_Design.md` | Architect |
| Functional Design slide content | `<feature-id>_Functional_Design.md` | Customer/business |
| QA scenarios | `<slice-id>_QA_Scenarios.md` | Testing team |

Supply actual identifiers and prefixes from the project's trackers (for example, a CodeBeamer slice can use
`CB-<id>`). Do not invent IDs or include the descriptive title in the filename. Put the descriptive title inside
and use that actual Technical Design title for the PR's design link. A filename keyed by a slice does not imply
splitting a feature-level scenario set into duplicate documents. Define shared/multiple-slice naming in the project
when needed. “Technical Design” here is the forward LLD, not an automatically required as-built artifact.

Functional Design supplements the existing business requirements deck, normally in one or two slides for an ordinary
feature. QA is a concise action/expected-result handoff; internal evidence remains in the existing working record.
Project-specific naming belongs here or in the project, not hardcoded into portable skills.
