import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRows, filterRecords, isValidDateValue } from '../src/validator.js';

const sample = [
  ['id', 'name', 'email', 'created_date'],
  ['1', 'Ada', 'ada@example.com', '2026-01-31'],
  ['2', '', 'bad-email', '31/02/2026'],
  ['1', 'Ada', 'ada@example.com', '2026-01-31'],
  ['3', 'Grace', 'grace@example.com', '2026-02-01'],
];

test('detects missing values, invalid emails, invalid dates, full duplicates and duplicate keys', () => {
  const result = validateRows(sample, { keyColumn: 'id' });
  const types = result.issues.map((issue) => issue.type);
  assert.ok(types.includes('missing'));
  assert.ok(types.includes('invalid_email'));
  assert.ok(types.includes('invalid_date'));
  assert.ok(types.includes('duplicate_row'));
  assert.ok(types.includes('duplicate_key'));
  assert.equal(result.summary.totalRows, 4);
  assert.equal(result.summary.flaggedRows, 3);
  assert.equal(result.summary.cleanRows, 1);
});

test('reports inconsistent row width without crashing', () => {
  const result = validateRows([['id', 'name'], ['1', 'Ada'], ['2']]);
  assert.ok(result.issues.some((issue) => issue.type === 'column_count' && issue.row === 3));
});

test('reports duplicate headers as file-level issues', () => {
  const result = validateRows([['id', 'ID'], ['1', '2']]);
  assert.ok(result.fileIssues.some((issue) => issue.type === 'duplicate_header'));
});

test('duplicate full rows are detected even when no key is selected', () => {
  const result = validateRows([['name'], ['Ada'], ['Ada']]);
  assert.equal(result.issues.filter((issue) => issue.type === 'duplicate_row').length, 2);
  assert.equal(result.issues.filter((issue) => issue.type === 'duplicate_key').length, 0);
});

test('filters records by issue type and flagged state', () => {
  const result = validateRows(sample, { keyColumn: 'id' });
  assert.equal(filterRecords(result.records, 'flagged').length, 3);
  assert.equal(filterRecords(result.records, 'invalid_email').length, 1);
  assert.equal(filterRecords(result.records, 'all').length, 4);
});

test('date validation rejects impossible dates and accepts supported formats', () => {
  assert.equal(isValidDateValue('2026-02-28'), true);
  assert.equal(isValidDateValue('2026-02-28T14:30:00+05:30'), true);
  assert.equal(isValidDateValue('2026-02-28T25:30:00Z'), false);
  assert.equal(isValidDateValue('31/02/2026'), false);
  assert.equal(isValidDateValue('2026/2/28'), true);
  assert.equal(isValidDateValue('28-02-2026'), true);
  assert.equal(isValidDateValue('02/28/2026'), false);
});
