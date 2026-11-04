import { parseCSV, toCSV } from './csv.js';
import { validateRows, filterRecords } from './validator.js';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_DATA_ROWS = 25000;
const $ = (id) => document.getElementById(id);
const state = { fileName: '', parsedRows: [], result: null, keyColumn: '', filter: 'all' };

const elements = {
  fileInput: $('fileInput'), uploadCard: $('uploadCard'), uploadError: $('uploadError'), sampleButton: $('sampleButton'),
  results: $('results'), resultTitle: $('resultTitle'), fileMeta: $('fileMeta'), totalRows: $('totalRows'), cleanRows: $('cleanRows'),
  flaggedRows: $('flaggedRows'), issueCount: $('issueCount'), keyColumn: $('keyColumn'), issueFilter: $('issueFilter'),
  tableHead: $('tableHead'), tableBody: $('tableBody'), tableCaption: $('tableCaption'), visibleCount: $('visibleCount'),
  emptyState: $('emptyState'), fileIssues: $('fileIssues'), resetButton: $('resetButton'), cleanExport: $('cleanExport'), issuesExport: $('issuesExport'),
};

const sampleCSV = [
  'record_id,full_name,email,created_date,department',
  '1001,Aarav Rao,aarav@example.com,2026-10-14,Operations',
  '1002,Meera Nair,meera.example.com,2026-10-18,Finance',
  '1003,Kabir Shah,kabir@example.com,31/02/2026,Support',
  '1004,,nisha@example.com,2026-10-19,Operations',
  '1002,Meera Nair,meera.example.com,2026-10-18,Finance',
  '1006,Diya Sen,diya@example.com,2026-10-21,',
  '1007,Rohan Das,rohan@example.com,2026/10/22,Sales',
].join('\n');

function showError(message) {
  elements.uploadError.textContent = message;
  elements.uploadError.hidden = false;
}
function clearError() {
  elements.uploadError.textContent = '';
  elements.uploadError.hidden = true;
}
function readFile(file) {
  if (!file) return;
  clearError();
  if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
    showError('Choose a .csv file. Other file types are not supported.');
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    showError('This file is larger than 10 MB. Choose a smaller CSV file.');
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => showError('The file could not be read. Try saving it as UTF-8 CSV and upload again.');
  reader.onload = () => processText(String(reader.result ?? ''), file.name);
  reader.readAsText(file);
}
function processText(text, fileName) {
  try {
    const rows = parseCSV(text);
    if (rows.length - 1 > MAX_DATA_ROWS) throw new Error(`This file has more than ${MAX_DATA_ROWS.toLocaleString()} data rows. Split it into smaller files.`);
    state.parsedRows = rows;
    state.fileName = fileName;
    const headers = rows[0].map((header) => String(header ?? '').trim());
    const candidate = headers.find((header) => /^id$|_id$|id_?$/i.test(header)) || headers[0] || '';
    state.keyColumn = candidate;
    renderKeyOptions(headers);
    runValidation();
    elements.results.hidden = false;
    elements.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showError(error instanceof Error ? error.message : 'The CSV could not be processed.');
  }
}
function renderKeyOptions(headers) {
  elements.keyColumn.replaceChildren();
  const noKey = new Option('No key selected', '');
  elements.keyColumn.add(noKey);
  headers.forEach((header) => {
    if (header) elements.keyColumn.add(new Option(header, header));
  });
  elements.keyColumn.value = headers.includes(state.keyColumn) ? state.keyColumn : '';
}
function runValidation() {
  state.keyColumn = elements.keyColumn.value;
  state.result = validateRows(state.parsedRows, { keyColumn: state.keyColumn });
  renderResults();
}
function renderResults() {
  const { summary, headers, records, fileIssues } = state.result;
  elements.totalRows.textContent = summary.totalRows.toLocaleString();
  elements.cleanRows.textContent = summary.cleanRows.toLocaleString();
  elements.flaggedRows.textContent = summary.flaggedRows.toLocaleString();
  elements.issueCount.textContent = summary.issueCount.toLocaleString();
  elements.resultTitle.textContent = summary.flaggedRows === 0 && fileIssues.length === 0 ? 'No issues detected in this file' : `${summary.flaggedRows.toLocaleString()} rows need attention`;
  const bytesLabel = state.fileName === 'sample-data.csv' ? 'Built-in sample' : state.fileName;
  elements.fileMeta.textContent = `${bytesLabel}  ·  ${summary.totalColumns} columns  ·  ${summary.emailColumns.length} email check(s)  ·  ${summary.dateColumns.length} date check(s)`;
  elements.tableCaption.textContent = `${summary.totalColumns} columns · ${summary.issueCount} findings · select a filter to narrow the rows`;
  elements.fileIssues.replaceChildren();
  if (fileIssues.length) {
    const strong = document.createElement('strong'); strong.textContent = `${fileIssues.length} file-level issue(s):`;
    const list = document.createElement('ul');
    fileIssues.forEach((issue) => { const item = document.createElement('li'); item.textContent = `${issue.column}: ${issue.message}`; list.append(item); });
    elements.fileIssues.append(strong, list); elements.fileIssues.hidden = false;
  } else { elements.fileIssues.hidden = true; }
  elements.tableHead.replaceChildren();
  const headerRow = document.createElement('tr');
  ['ROW', ...headers.slice(0, 5), 'STATUS', 'FINDINGS'].forEach((label) => {
    const th = document.createElement('th'); th.textContent = label; headerRow.append(th);
  });
  elements.tableHead.append(headerRow);
  renderTable();
}
function labelForIssue(type) {
  return ({ missing: 'Missing', duplicate_row: 'Duplicate row', duplicate_key: 'Duplicate key', invalid_email: 'Invalid email', invalid_date: 'Invalid date', column_count: 'Column mismatch' })[type] || type.replaceAll('_', ' ');
}
function renderTable() {
  const { records, headers } = state.result;
  const filtered = filterRecords(records, state.filter);
  const visible = filtered.slice(0, 100);
  elements.tableBody.replaceChildren();
  visible.forEach((record) => {
    const tr = document.createElement('tr');
    const rowNumber = document.createElement('td'); rowNumber.className = 'row-number'; rowNumber.textContent = record.rowNumber; tr.append(rowNumber);
    record.values.slice(0, 5).forEach((value) => {
      const td = document.createElement('td'); td.textContent = value || '—'; td.title = value; tr.append(td);
    });
    const status = document.createElement('td');
    const statusTag = document.createElement('span'); statusTag.className = record.flagged ? 'status-flagged' : 'status-clean'; statusTag.textContent = record.flagged ? '● REVIEW' : '✓ CLEAN'; status.append(statusTag); tr.append(status);
    const findings = document.createElement('td'); findings.className = 'issue-tags';
    if (record.issues.length === 0) findings.textContent = '—';
    else record.issues.slice(0, 4).forEach((issue) => {
      const tag = document.createElement('span');
      tag.className = `issue-tag ${issue.type.includes('duplicate') ? 'duplicate' : issue.type === 'invalid_email' ? 'email' : issue.type === 'invalid_date' ? 'date' : 'missing'}`;
      tag.textContent = labelForIssue(issue.type); tag.title = `${issue.column}: ${issue.message}`; findings.append(tag);
    });
    tr.append(findings); elements.tableBody.append(tr);
  });
  elements.visibleCount.textContent = `${visible.length} of ${filtered.length} matching rows`;
  elements.emptyState.hidden = filtered.length !== 0;
  if (filtered.length === 0) elements.tableBody.replaceChildren();
  if (filtered.length > 100) elements.tableCaption.textContent = `${filtered.length} matching rows · showing first 100`;
  else elements.tableCaption.textContent = `${headers.length} columns · ${state.result.issues.length} findings · select a filter to narrow the rows`;
}
function download(filename, content, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove();
  URL.revokeObjectURL(url);
}
function exportClean() {
  if (!state.result) return;
  const cleanRows = state.result.records.filter((record) => !record.flagged).map((record) => record.values);
  download(`${baseName()}-clean.csv`, `\uFEFF${toCSV([state.result.headers, ...cleanRows])}`);
}
function exportIssues() {
  if (!state.result) return;
  const rows = [['row', 'column', 'issue_type', 'message', 'value'], ...state.result.issues.map((issue) => [issue.row ?? 'FILE', issue.column, issue.type, issue.message, issue.value])];
  download(`${baseName()}-issues.csv`, `\uFEFF${toCSV(rows)}`);
}
function baseName() { return state.fileName.replace(/\.csv$/i, '').replace(/[^a-z0-9_-]/gi, '_') || 'datacheck'; }
function reset() {
  state.fileName = ''; state.parsedRows = []; state.result = null; state.keyColumn = ''; state.filter = 'all';
  elements.fileInput.value = ''; elements.results.hidden = true; elements.issueFilter.value = 'all'; elements.fileIssues.hidden = true; clearError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

elements.fileInput.addEventListener('change', (event) => readFile(event.target.files?.[0]));
elements.sampleButton.addEventListener('click', () => processText(sampleCSV, 'sample-data.csv'));
elements.keyColumn.addEventListener('change', runValidation);
elements.issueFilter.addEventListener('change', (event) => { state.filter = event.target.value; renderTable(); });
elements.resetButton.addEventListener('click', reset);
elements.cleanExport.addEventListener('click', exportClean);
elements.issuesExport.addEventListener('click', exportIssues);
['dragenter', 'dragover'].forEach((eventName) => elements.uploadCard.addEventListener(eventName, (event) => { event.preventDefault(); elements.uploadCard.classList.add('dragover'); }));
['dragleave', 'drop'].forEach((eventName) => elements.uploadCard.addEventListener(eventName, (event) => { event.preventDefault(); elements.uploadCard.classList.remove('dragover'); }));
elements.uploadCard.addEventListener('drop', (event) => readFile(event.dataTransfer?.files?.[0]));
