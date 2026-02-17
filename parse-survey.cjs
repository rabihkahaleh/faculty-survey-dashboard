const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "Survey_Faculty_Report-Dr.Kashab.csv");
const OUT_PATH = path.join(__dirname, "survey-data.json");

const SKIP_COLUMNS = new Set(["ID", "DateCreated"]);
const SKIP_VALUES = new Set(["", "NA", "Non Applicable", "Not applicable"]);

// ---------- simple RFC-4180 CSV parser (handles quoted multi-line fields) ---
function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    const row = [];
    while (i < len) {
      let value;
      if (text[i] === '"') {
        // quoted field
        i++; // skip opening quote
        let parts = [];
        while (i < len) {
          const nextQuote = text.indexOf('"', i);
          if (nextQuote === -1) {
            parts.push(text.slice(i));
            i = len;
            break;
          }
          parts.push(text.slice(i, nextQuote));
          i = nextQuote + 1;
          if (i < len && text[i] === '"') {
            parts.push('"');
            i++;
          } else {
            break;
          }
        }
        value = parts.join("");
      } else {
        const nextComma = text.indexOf(",", i);
        const nextCR = text.indexOf("\r", i);
        const nextLF = text.indexOf("\n", i);
        let end = len;
        if (nextComma !== -1 && nextComma < end) end = nextComma;
        if (nextCR !== -1 && nextCR < end) end = nextCR;
        if (nextLF !== -1 && nextLF < end) end = nextLF;
        value = text.slice(i, end);
        i = end;
      }
      row.push(value);

      if (i < len && text[i] === ",") {
        i++;
      } else {
        if (i < len && text[i] === "\r") i++;
        if (i < len && text[i] === "\n") i++;
        break;
      }
    }
    rows.push(row);
  }
  return rows;
}

// ---------- main -----------------------------------------------------------
const raw = fs.readFileSync(CSV_PATH, "utf-8");
const rows = parseCSV(raw);

const headers = rows[0];
const dataRows = rows.slice(1).filter((r) => r.length > 1 || r[0] !== "");

// Trim trailing empty columns from header
let lastNonEmpty = headers.length - 1;
while (lastNonEmpty >= 0 && headers[lastNonEmpty].trim() === "") lastNonEmpty--;
const effectiveLen = lastNonEmpty + 1;

console.log("Total columns (effective): " + effectiveLen);
console.log("Total respondent rows: " + dataRows.length);

const result = {};

for (let col = 0; col < effectiveLen; col++) {
  const header = headers[col].trim();
  if (!header || SKIP_COLUMNS.has(header)) continue;

  const counts = {};
  for (const row of dataRows) {
    const val = (row[col] || "").trim();
    if (SKIP_VALUES.has(val) || val === "") continue;
    counts[val] = (counts[val] || 0) + 1;
  }

  const arr = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  if (arr.length > 0) {
    result[header] = arr;
  }
}

fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), "utf-8");

console.log("\nOutput written to: " + OUT_PATH);
console.log("Number of questions processed: " + Object.keys(result).length);
console.log("\nTotal respondents: " + dataRows.length);
