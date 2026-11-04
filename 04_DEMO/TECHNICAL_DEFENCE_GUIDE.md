# DataCheck — technical defence guide

Use these as study notes, not as memorised claims. The candidate must inspect the code and be able to demonstrate each point.

## 1. What problem does it solve?

It provides a first-pass check for common problems in a CSV before that file is imported into another workflow. It is not a full data-cleaning or governance platform.

## 2. Why choose this project?

The workflow is concrete: select one CSV, inspect common problems, filter findings, and export a clean subset plus an issue log. It can be completed and unit-tested as a small vertical slice. The project hypothesis still needs validation with real users.

## 3. What alternatives were explored?

- OpenRefine: strong at interactive exploration, faceting, clustering, and transformation.
- CSVLint: directly validates CSV structure and can use an optional schema.
- Great Expectations: supports programmable assertions and repeatable validation suites.

DataCheck is narrower: quick browser-local checks for one file without schema setup.

## 4. Explain the architecture.

`csv.js` parses CSV text into rows. `validator.js` applies rules and builds a structured issue model. `app.js` reads files, manages browser state, renders the result, and creates CSV downloads. `index.html` and `styles.css` provide the interface. There is no server-side processing.

## 5. Why write a CSV parser rather than use a library?

The scope is limited and the parser needs only common CSV behaviours: quoted commas, escaped quotes, CRLF, embedded newlines, and BOM. Keeping it small avoids a runtime dependency. The trade-off is that a mature CSV library would generally be preferable for a production-grade dialect matrix and broad compatibility.

## 6. How do duplicate checks work?

The validator creates a normalized fingerprint of each row after trimming outer whitespace. It marks every row that shares a fingerprint. If a unique-key column is selected, it separately groups non-empty values from that column and marks all occurrences of repeated keys.

## 7. What does the email check prove?

Only that the string matches a syntactic format. It does not prove the address exists, can receive messages, or belongs to the user.

## 8. Why are date formats limited?

Ambiguous date strings can be interpreted differently by different locales. The validator accepts a documented set and intentionally rejects ambiguous US-style month-first strings rather than guessing.

## 9. What is the clean export rule?

A row is included only if it has no row-level finding. This is conservative: it prevents a row with a missing or invalid value from being silently treated as clean. Header-level findings are included in the issue export and displayed separately.

## 10. What was tested?

Twelve Node built-in unit tests passed. They cover parser edge cases and key validator behaviours. Static syntax checks also passed. Browser end-to-end interaction and downloads were not verified in the creation environment; this must be checked locally before external submission.

## 11. What would be improved next?

Validate the problem with real users, add configurable required columns and schema rules, add browser end-to-end tests, benchmark near-limit files, and complete accessibility and cross-browser checks.

## 12. What AI assistance was used?

AI assistance was substantial: project scoping, research synthesis, implementation, tests, review, report, and packaging. This must be disclosed. The candidate should not claim the code was fully self-authored and should not submit it without understanding and verifying it.
