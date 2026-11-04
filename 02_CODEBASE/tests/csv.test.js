import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV, toCSV } from '../src/csv.js';

test('parses a basic CSV and ignores a trailing newline', () => {
  assert.deepEqual(parseCSV('id,name\n1,Ada\n2,Linus\n'), [['id', 'name'], ['1', 'Ada'], ['2', 'Linus']]);
});

test('supports quoted commas, escaped quotes and embedded newlines', () => {
  assert.deepEqual(parseCSV('id,notes\n1,"hello, world"\n2,"said ""hello"""\n3,"line one\nline two"'), [
    ['id', 'notes'], ['1', 'hello, world'], ['2', 'said "hello"'], ['3', 'line one\nline two'],
  ]);
});

test('strips a UTF-8 BOM and accepts CRLF', () => {
  assert.deepEqual(parseCSV('\uFEFFid,name\r\n1,Ada\r\n'), [['id', 'name'], ['1', 'Ada']]);
});

test('rejects an unterminated quoted field', () => {
  assert.throws(() => parseCSV('id,name\n1,"Ada'), /never closed/);
});

test('rejects unexpected characters after a closing quote', () => {
  assert.throws(() => parseCSV('id,name\n1,"Ada"x'), /after a closing quote/);
});

test('CSV output escapes commas, quotes and line breaks', () => {
  const rows = [['id', 'notes'], ['1', 'said "hello", then left']];
  assert.deepEqual(parseCSV(toCSV(rows)), rows);
});
