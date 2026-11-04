# DataCheck — CSV pre-import checker

DataCheck is a small browser-based tool for checking a CSV file before it is imported into another system. It looks for common problems, shows which rows need attention, and lets the user download the rows that passed the checks and a separate issue list.

## Run the project

1. Open `02_CODEBASE/` in a terminal.
2. Start a local server with `python -m http.server 8000`.
3. Visit `http://localhost:8000` in a browser.
4. Select a CSV file, or choose **Try sample data**.

To run the automated tests, open a terminal in `02_CODEBASE/` and run `npm test`.

## What's included

- `00_HOUR_BASED_ASSESSMENT_PLAN.md` — the original three-day assessment reorganised into ten hours.
- `01_FINAL_REPORT.pdf` — project background, decisions, implementation, test results, limitations and next steps.
- `02_CODEBASE/` — the application, sample CSV and automated tests.
- `03_EVIDENCE/` — research notes, architecture and test output.
- `04_DEMO/` — local demo instructions and technical review notes.
- `05_DECLARATION/` — AI and external-tool disclosure.

## Website colour palette

The DataCheck website now uses the requested Jet Black (`#090B10`), Charcoal (`#111720`), Cerulean Blue (`#007BA7`), Bright Blue (`#38B8E2`), Neon Rose (`#FF2E74`), Soft Rose (`#FF80A9`), Off-white (`#F4F7F9`) and Blue-grey (`#A6B2BB`) palette. The report remains a separate document and is not affected by the website styling.

## Current status

The parser and validation tests pass: 12 passed and 0 failed. JavaScript syntax checks also pass. A full browser-based test, accessibility review, performance benchmark and public deployment have not been completed. These are listed as remaining work in the report.
