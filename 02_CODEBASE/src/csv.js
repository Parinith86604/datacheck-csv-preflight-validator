/** Parse a CSV string into rows using a small RFC-4180-compatible state machine.
 * Supports commas, quoted cells, escaped double-quotes, CRLF, and embedded newlines.
 */
export function parseCSV(input) {
  if (typeof input !== 'string') throw new TypeError('CSV input must be a string.');
  const text = input.replace(/^\uFEFF/, '');
  if (text.length === 0) throw new Error('The file is empty.');

  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  let justClosedQuote = false;
  let endedWithRecordBreak = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
          justClosedQuote = true;
        }
      } else {
        cell += char;
      }
      endedWithRecordBreak = false;
      continue;
    }

    if (justClosedQuote && char !== ',' && char !== '\r' && char !== '\n' && char !== ' ' && char !== '\t') {
      throw new Error(`Unexpected character after a closing quote at character ${i + 1}.`);
    }
    if (char === '"') {
      if (cell.length > 0 || justClosedQuote) {
        throw new Error(`Unexpected quote in an unquoted field at character ${i + 1}.`);
      }
      inQuotes = true;
      justClosedQuote = false;
      endedWithRecordBreak = false;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
      justClosedQuote = false;
      endedWithRecordBreak = false;
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
      justClosedQuote = false;
      endedWithRecordBreak = true;
    } else if (justClosedQuote && (char === ' ' || char === '\t')) {
      // Ignore whitespace between a closing quote and the next delimiter.
    } else {
      cell += char;
      justClosedQuote = false;
      endedWithRecordBreak = false;
    }
  }

  if (inQuotes) throw new Error('The CSV contains a quoted field that was never closed.');
  if (!endedWithRecordBreak || row.length > 0 || cell.length > 0 || justClosedQuote) {
    row.push(cell);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
  }
  if (rows.length === 0) throw new Error('The file does not contain a header row.');
  return rows;
}

export function toCSV(rows) {
  return rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',')).join('\r\n');
}
