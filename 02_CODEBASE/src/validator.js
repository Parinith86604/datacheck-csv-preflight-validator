const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const DATE_HEADER_PATTERN = /(?:date|dob|birth|created|updated|timestamp|start|end|due)/i;

function isValidDateValue(value) {
  const input = String(value ?? '').trim();
  if (!input) return false;
  let match = input.match(/^(\d{4})-(\d{2})-(\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:[Zz]|([+-])(\d{2}):?(\d{2}))?)?$/);
  if (match) {
    const validDate = validYMD(Number(match[1]), Number(match[2]), Number(match[3]));
    const hasTime = match[4] !== undefined;
    const validTime = !hasTime || (Number(match[4]) <= 23 && Number(match[5]) <= 59 && Number(match[6] ?? 0) <= 59);
    const offsetHours = Number(match[8] ?? 0);
    const offsetMinutes = Number(match[9] ?? 0);
    const validOffset = !match[7] || (offsetHours <= 14 && offsetMinutes <= 59 && (offsetHours < 14 || offsetMinutes === 0));
    return validDate && validTime && validOffset;
  }
  match = input.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (match) return validYMD(Number(match[1]), Number(match[2]), Number(match[3]));
  match = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) return validYMD(Number(match[3]), Number(match[2]), Number(match[1])); // DD/MM/YYYY or DD-MM-YYYY
  return false;
}

function validYMD(year, month, day) {
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function normalizeRow(row) {
  return JSON.stringify(row.map((value) => String(value ?? '').trim()));
}

export function validateRows(parsedRows, options = {}) {
  if (!Array.isArray(parsedRows) || parsedRows.length < 1) {
    throw new TypeError('At least one header row is required.');
  }
  const headers = parsedRows[0].map((header) => String(header ?? '').trim());
  if (headers.length === 0 || headers.every((header) => !header)) {
    throw new Error('The CSV header row is empty.');
  }

  const issues = [];
  const addIssue = (rowNumber, column, type, message, value = '') => {
    issues.push({ row: rowNumber, column, type, message, value: String(value ?? '') });
  };

  const seenHeaders = new Map();
  headers.forEach((header, index) => {
    const normalized = header.toLowerCase();
    if (!header) addIssue(null, `Column ${index + 1}`, 'empty_header', 'Header name is missing.');
    else if (seenHeaders.has(normalized)) addIssue(null, header, 'duplicate_header', 'Column header is repeated.');
    else seenHeaders.set(normalized, index);
  });

  const emailColumns = headers.map((header, index) => /email/i.test(header) ? index : -1).filter((index) => index >= 0);
  const dateColumns = headers.map((header, index) => DATE_HEADER_PATTERN.test(header) ? index : -1).filter((index) => index >= 0);
  const keyColumn = options.keyColumn ? headers.findIndex((header) => header === options.keyColumn) : -1;
  const dataRows = parsedRows.slice(1);
  const duplicateRowGroups = new Map();
  const duplicateKeyGroups = new Map();

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2;
    if (row.length !== headers.length) {
      addIssue(rowNumber, 'Row', 'column_count', `Expected ${headers.length} columns but found ${row.length}.`);
    }
    headers.forEach((header, columnIndex) => {
      const value = row[columnIndex] ?? '';
      if (String(value).trim() === '') {
        addIssue(rowNumber, header || `Column ${columnIndex + 1}`, 'missing', 'Value is blank.');
        return;
      }
      if (emailColumns.includes(columnIndex) && !EMAIL_PATTERN.test(String(value).trim())) {
        addIssue(rowNumber, header, 'invalid_email', 'Email address does not match the accepted format.', value);
      }
      if (dateColumns.includes(columnIndex) && !isValidDateValue(value)) {
        addIssue(rowNumber, header, 'invalid_date', 'Date is not a supported valid date. Use YYYY-MM-DD or DD/MM/YYYY.', value);
      }
    });

    const fingerprint = normalizeRow(row);
    if (!duplicateRowGroups.has(fingerprint)) duplicateRowGroups.set(fingerprint, []);
    duplicateRowGroups.get(fingerprint).push(rowNumber);

    if (keyColumn >= 0 && String(row[keyColumn] ?? '').trim() !== '') {
      const key = String(row[keyColumn]).trim();
      if (!duplicateKeyGroups.has(key)) duplicateKeyGroups.set(key, []);
      duplicateKeyGroups.get(key).push(rowNumber);
    }
  });

  for (const rowNumbers of duplicateRowGroups.values()) {
    if (rowNumbers.length > 1) {
      rowNumbers.forEach((rowNumber) => addIssue(rowNumber, 'Row', 'duplicate_row', `Record duplicates rows ${rowNumbers.filter((n) => n !== rowNumber).join(', ')}.`));
    }
  }
  if (keyColumn >= 0) {
    for (const [key, rowNumbers] of duplicateKeyGroups.entries()) {
      if (rowNumbers.length > 1) {
        rowNumbers.forEach((rowNumber) => addIssue(rowNumber, headers[keyColumn], 'duplicate_key', `Key “${key}” also appears in rows ${rowNumbers.filter((n) => n !== rowNumber).join(', ')}.`, key));
      }
    }
  }

  const rowIssueMap = new Map();
  issues.forEach((issue) => {
    if (issue.row === null) return;
    if (!rowIssueMap.has(issue.row)) rowIssueMap.set(issue.row, []);
    rowIssueMap.get(issue.row).push(issue);
  });
  const records = dataRows.map((values, index) => {
    const rowNumber = index + 2;
    const padded = headers.map((_, columnIndex) => String(values[columnIndex] ?? ''));
    const rowIssues = rowIssueMap.get(rowNumber) ?? [];
    return { rowNumber, values: padded, issues: rowIssues, flagged: rowIssues.length > 0 };
  });
  const flaggedRowCount = records.filter((record) => record.flagged).length;
  const fileIssues = issues.filter((issue) => issue.row === null);
  return {
    headers,
    records,
    issues,
    fileIssues,
    summary: {
      totalRows: records.length,
      totalColumns: headers.length,
      cleanRows: records.length - flaggedRowCount,
      flaggedRows: flaggedRowCount,
      issueCount: issues.length,
      emailColumns: emailColumns.map((index) => headers[index]),
      dateColumns: dateColumns.map((index) => headers[index]),
      keyColumn: keyColumn >= 0 ? headers[keyColumn] : null,
    },
  };
}

export function filterRecords(records, filter = 'all') {
  if (filter === 'all') return records;
  if (filter === 'flagged') return records.filter((record) => record.flagged);
  return records.filter((record) => record.issues.some((issue) => issue.type === filter || (filter === 'missing' && issue.type === 'missing')));
}

export { isValidDateValue };
