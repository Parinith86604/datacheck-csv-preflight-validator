# AI and external tools declaration

## AI assistance

Substantial AI assistance was used to:

- interpret the supplied assessment brief and adapt its three-day structure into a ten-hour plan;
- propose and scope the DataCheck project direction;
- summarise official documentation for OpenRefine, CSVLint, and Great Expectations;
- draft and implement the application structure, CSV parser, validation logic, interface, unit tests, README, architecture notes, and report content;
- review test failures and adjust the test fixtures and implementation.

The generated code and documentation should not be represented as wholly unaided or fully self-authored. The candidate must inspect the source, run the project locally, understand each rule and limitation, and be able to explain the design decisions before submitting it as their work.

## External libraries, frameworks, and services

- No third-party runtime JavaScript package is required.
- Node.js built-in test runner is used for unit tests.
- Python's built-in `http.server` is used only to serve static files during local demonstration.
- Browser File API, Blob, URL, and DOM APIs are used by the client application.
- Official online documentation was consulted for the competitor scan; source links are recorded in `03_EVIDENCE/research/competitive-landscape.md`.
- No copied starter repository or external codebase was used as the application base.

## Verification performed in this environment

- `npm test`: 12 tests passed, 0 failed.
- `node --check` on `src/app.js`, `src/csv.js`, and `src/validator.js`: passed.
- Static server response for `index.html`: HTTP 200.
- Browser-based UI automation and screenshot capture were blocked by the execution environment's browser policy. No browser screenshot or end-to-end interaction test is claimed in this package.

## Candidate responsibility

Before submission, the candidate should personally:

1. Run the application in a normal browser using the README instructions.
2. Upload a real, non-sensitive sample CSV and try the key-column, filters, and both exports.
3. Inspect and understand the parser, validation rules, and tests.
4. Capture genuine screenshots from their own environment if screenshots are required.
5. Amend this declaration if any further tools, code, or assistance are used.
