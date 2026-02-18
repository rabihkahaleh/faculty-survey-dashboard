/**
 * extract-comments.js
 * 
 * Parses the faculty survey CSV and extracts free-text comments
 * along with associated Faculty and Gender data.
 * 
 * Output: comments-data.json - array of {id, text, faculty, gender} objects
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, 'Survey_Faculty_Report-Dr.Kashab.csv');
const OUTPUT_PATH = path.join(__dirname, 'comments-data.json');

// Robust CSV parser that handles quoted fields, embedded newlines, and escaped quotes
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(cell);
        cell = '';
      } else if (c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
        row.push(cell);
        cell = '';
        if (c === '\r') i++;
        rows.push(row);
        row = [];
      } else if (c === '\r') {
        row.push(cell);
        cell = '';
        rows.push(row);
        row = [];
      } else {
        cell += c;
      }
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function main() {
  console.log('Reading CSV file:', CSV_PATH);
  const raw = fs.readFileSync(CSV_PATH, 'utf8');

  const rows = parseCSV(raw);
  console.log(`Parsed ${rows.length} rows (including header)`);

  const headers = rows[0];
  console.log(`Found ${headers.length} columns`);

  const genderIdx = headers.indexOf('Gender');
  const facultyIdx = headers.indexOf('Faculty');
  const commentIdx = headers.findIndex(h =>
    h.includes('Please use this space to share any thoughts about your experience as a faculty member at UOB')
  );

  if (genderIdx === -1) {
    console.error('ERROR: Could not find "Gender" column');
    process.exit(1);
  }
  if (facultyIdx === -1) {
    console.error('ERROR: Could not find "Faculty" column');
    process.exit(1);
  }
  if (commentIdx === -1) {
    console.error('ERROR: Could not find the free-text comments column');
    process.exit(1);
  }

  console.log(`Column indices - Gender: ${genderIdx}, Faculty: ${facultyIdx}, Comments: ${commentIdx}`);
  console.log(`Comments column header: "${headers[commentIdx]}"`);
  console.log('');

  const comments = [];
  let idCounter = 1;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const commentText = (row[commentIdx] || '').trim();

    if (!commentText || commentText === 'NA' || commentText === 'N/A') {
      continue;
    }

    comments.push({
      id: idCounter++,
      text: commentText,
      faculty: (row[facultyIdx] || '').trim(),
      gender: (row[genderIdx] || '').trim()
    });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(comments, null, 2), 'utf8');

  console.log(`Total comments found: ${comments.length}`);
  console.log(`Output written to: ${OUTPUT_PATH}`);

  const byFaculty = {};
  comments.forEach(c => {
    byFaculty[c.faculty] = (byFaculty[c.faculty] || 0) + 1;
  });
  console.log('\nComments by Faculty:');
  Object.entries(byFaculty)
    .sort((a, b) => b[1] - a[1])
    .forEach(([faculty, count]) => {
      console.log(`  ${faculty}: ${count}`);
    });

  const byGender = {};
  comments.forEach(c => {
    byGender[c.gender] = (byGender[c.gender] || 0) + 1;
  });
  console.log('\nComments by Gender:');
  Object.entries(byGender).forEach(([gender, count]) => {
    console.log(`  ${gender}: ${count}`);
  });
}

main();
