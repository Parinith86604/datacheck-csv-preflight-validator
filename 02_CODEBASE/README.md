# DataCheck — CSV Preflight Validator

DataCheck is a browser-local CSV quality gate. It identifies common import problems before a spreadsheet or dataset is handed to another system.

## Core workflow

1. Open the application and select a `.csv` file (or load the sample data).
2. Review the row and issue summary.
3. Select a unique-key column to detect repeated identifiers.
4. Filter to a specific issue type and inspect the affected records.
5. Export rows with no detected issues and/or download a separate issue report.

## Checks included

- Blank cells in any column.
- Repeated complete records (all occurrences are marked).
- Repeated non-empty values in the selected unique-key column (all occurrences are marked).
- Email format checks for headers containing `email`.
- Date checks for headers containing `date`, `dob`, `birth`, `created`, `updated`, `timestamp`, `start`, `end`, or `due`.
- Inconsistent row width, empty headers, and repeated headers.

Supported date formats are `YYYY-MM-DD` (including a validated ISO time and timezone suffix), `YYYY/MM/DD`, `DD/MM/YYYY`, and `DD-MM-YYYY`. The day-first slash/dash format is intentional; ambiguous US-style `MM/DD/YYYY` is not accepted. This avoids silently interpreting dates differently across locales.

## Run locally

Requirements: Python 3.8+ for the static file server; Node.js 18+ for tests. No application dependencies need to be installed.

From this folder:

```bash
python -m http.server 8000
```

Open <http://localhost:8000> in a browser. The application is static; Python only serves the files. CSV parsing and validation happen in the browser tab. No file upload endpoint or analytics service is present.

## Run tests

```bash
npm test
```

The test suite uses Node's built-in test runner and has no third-party test dependencies.

## Input limits and behaviour

- `.csv` only.
- Maximum file size: 10 MB.
- Maximum data rows: 25,000.
- UTF-8 text is expected; a UTF-8 BOM is supported.
- Quoted commas, escaped quotes, CRLF line endings, and embedded newlines are supported.
- The parser rejects unterminated quoted fields and unexpected characters immediately after a closing quote.
- Rows wider than the header are flagged; short rows are padded for display and export.
- Clean export excludes any row with at least one detected row-level issue. File-level header issues are separately visible in the issue export; rows are not automatically excluded solely because of a header-level issue.

## Interface colour palette

The interface uses the requested palette throughout the website:

| Colour | Hex | Use |
|---|---|---|
| Jet Black | `#090B10` | Main page background |
| Charcoal | `#111720` | Cards and panels |
| Cerulean Blue | `#007BA7` | Primary buttons and navigation accents |
| Bright Blue | `#38B8E2` | Active states, links and highlights |
| Neon Rose | `#FF2E74` | Priority and error accents |
| Soft Rose | `#FF80A9` | Secondary warning text and highlights |
| Off-white | `#F4F7F9` | Main text |
| Blue-grey | `#A6B2BB` | Secondary text and borders |

The layout remains responsive. The colour palette is implemented in `styles.css` using CSS variables so it can be adjusted in one place.

## Architecture

- `index.html` — semantic page structure and interface controls.
- `styles.css` — responsive presentation.
- `src/csv.js` — CSV parser and CSV-safe serializer.
- `src/validator.js` — deterministic validation rules and filtering helpers.
- `src/app.js` — browser interaction, rendering, and exports.
- `tests/` — parser and validation unit tests.

## Known limitations

- No automatic repair or mutation of source values; DataCheck flags issues but leaves the original values intact.
- Email checks are syntactic only; they do not verify that a mailbox exists.
- Date rules are inferred from column names and use a deliberately narrow set of formats.
- The file is processed in memory. Large datasets beyond the stated limit must be split.
- There is no persistent history, account system, remote API, or shared team workspace.
- Duplicate comparisons trim outer whitespace but remain case-sensitive.

## Security and privacy note

The browser reads the selected file using the File API. The project contains no backend, upload request, external API call, or remote persistence. The application makes no network requests at runtime. It uses system font fallbacks and has no third-party runtime dependency.

## Project status

This is a focused proof of concept, not a production data-governance platform. Test results and scope boundaries are recorded in the assessment report.

## Example input

A deliberately mixed-quality sample file is included at `examples/sample-data.csv`. It contains missing values, an invalid email, an impossible date, and a duplicate key/row for demonstration.
