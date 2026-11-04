# Domain 01 — Software Development
## 10-Hour Competitive Assessment & Technical Readiness Challenge

**Compressed version of the supplied 3-day brief**  
**Assessment type:** competitive, evidence-based pre-interview evaluation  
**Working expectation:** 10 focused hours of independent work, candidate-managed schedule  
**Method:** Explore → Decide → Build → Validate → Document → Defend

## 1. What the assessment asks you to do

Use ten hours of focused work to choose a real software problem, build a small solution, test it, and prepare it for review. The original brief puts more weight on the quality of the problem, your decisions, the working result and the evidence than on the amount of code you write.

The project should solve a problem that is worth looking at and show that you made sensible engineering decisions. One complete workflow is better than several half-finished features.

## 2. Ten-hour structure

| Time | Focus | Required work | Evidence / output |
|---|---|---|---|
| Hour 1 | Problem discovery | Map user workflow, friction, and candidate opportunities | Problem notes and initial shortlist |
| Hour 2 | Exploration and decision | Review comparable products, technologies, and trade-offs; compare at least 3 directions; choose one | Opportunity brief, comparison table, project thesis |
| Hour 3 | Scope and architecture | Define one core workflow, stack, components, risks, assumptions, and acceptance criteria | Initial engineering plan and architecture sketch |
| Hour 4 | Core implementation | Build the smallest meaningful happy path | Working first vertical slice |
| Hour 5 | Validation logic | Implement core rules, data handling, and input validation | Core behaviour and unit tests |
| Hour 6 | User workflow | Complete the interface, state transitions, and primary user actions | Usable end-to-end workflow |
| Hour 7 | Reliability and exports | Add failure handling, boundary checks, and useful outputs | Hardened build and reproducible outputs |
| Hour 8 | Validation | Test normal, invalid, boundary, and failure cases; record results | Test log and known-issue list |
| Hour 9 | Iteration | Fix or improve at least one meaningful weakness; compare before/after reasoning | Change note and updated evidence |
| Hour 10 | Submission and defence | Finalise report, README, evidence, demo instructions, and tool declaration; rehearse review questions | Complete submission package |

These are suggested working blocks, not a claim that the project was completed in exactly ten elapsed hours. Take breaks as needed and record the work you actually complete.

## 3. Required exploration

During Hours 1–2, review:

- Application landscape: comparable applications, products, open-source projects, or workflows.
- User/workflow problem: the friction, limitation, or unmet need being addressed.
- Technology landscape: relevant frameworks, libraries, APIs, protocols, or architecture choices.
- Competitive comparison: where existing approaches are strong, weak, broad, complex, or constrained.
- Possibility mapping: at least three directions, with reasons for rejection or selection.
- Feasibility: what can actually be built and validated in the remaining hours.

The selected project thesis must say what is being built, who or what workflow it serves, why it is worth building, and what is explicitly out of scope.

## 4. Engineering execution

During Hours 3–7:

- Implement one meaningful end-to-end workflow.
- Keep architecture proportionate to scope and document major data/control flow.
- Explain material trade-offs.
- Include input validation, error handling, and failure awareness.
- Test important behaviour as implementation progresses.
- Preserve genuine evidence such as test output, commits, screenshots, and research notes.

Do not add authentication, microservices, multiple databases, complex dashboards, or advanced infrastructure unless they directly strengthen the core thesis.

## 5. Validation and iteration

During Hours 8–9:

- Run the core workflow from the user's or system actor's perspective.
- Test ordinary, invalid, boundary, and failure cases.
- Identify at least one meaningful bug, weakness, bottleneck, or design limitation.
- Make an improvement and record the before/after reasoning.
- State what was not tested. Do not turn unverified assumptions into success claims.

## 6. Required submission package

```text
YOUR_NAME_SOFTWARE_DEVELOPMENT/
├── 00_HOUR_BASED_ASSESSMENT_PLAN.md
├── 01_FINAL_REPORT.pdf
├── 02_CODEBASE/
│   ├── README.md
│   ├── source files and tests
│   └── configuration / sample data
├── 03_EVIDENCE/
│   ├── research/
│   ├── architecture/
│   ├── testing/
│   └── screenshots/ (only genuine captures)
├── 04_DEMO/
│   └── LINK_OR_INSTRUCTIONS.txt
└── 05_DECLARATION/
    └── AI_EXTERNAL_TOOLS.md
```

The final report must cover the executive summary, opportunity/problem, competitive landscape, alternatives, project thesis/scope, engineering strategy, implementation, validation, iteration, limitations/risks, next development stage, and tool/assistance declaration.

## 7. Technical defence

Be prepared to explain:

- Why this problem was worth solving.
- Which comparable products or approaches were evaluated.
- Why this architecture and stack were selected.
- What was deliberately left out.
- Which parts were generated, adapted, or personally verified.
- How the core workflow was tested.
- What failed, what changed, and what remains limited.

## 8. Evaluation rubric (unchanged weights)

| Dimension | Weight |
|---|---:|
| Seriousness & consistency | 15% |
| Opportunity intelligence & exploration | 15% |
| Problem framing & scope control | 10% |
| Engineering judgment | 15% |
| Implementation & functional execution | 20% |
| Validation & iteration | 10% |
| Documentation & reviewability | 10% |
| Ownership & technical honesty | 5% |
| **Total** | **100%** |

## 9. Automatic red flags

Copied tutorial projects with superficial changes; unsupported feature or test claims; broad projects with no working core; code the candidate cannot explain; undeclared substantial AI or third-party assistance; fabricated process evidence; or a polished report that does not match the actual repository.

## 10. Final review checklist

- Can another person understand the problem in under two minutes?
- Is there evidence of exploration and at least three considered directions?
- Is the core workflow genuinely working?
- Can the candidate explain architecture and trade-offs?
- Were the most important behaviours tested?
- Is at least one iteration documented?
- Does the report distinguish facts, assumptions, and limitations?
- Can the code be run from the README?
- Is AI and external assistance declared accurately?

**Final principle:** optimise for a defensible body of work, not the appearance of sophistication.
