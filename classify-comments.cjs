const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'comments-data.json');
const outputPath = path.join(__dirname, 'comments-with-sentiment.json');

const comments = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const negativeIndicators = [
  "lack", "lacking", "not satisfied", "dissatisfied", "unfair", "unclear",
  "insufficient", "frustrat", "disappoint", "unacceptable", "bad experience",
  "unprofessional", "dishonest", "very low salary", "not enough", "inadequate",
  "no transparency", "chaotic", "left in the dark", "not satisfactory",
  "very dissatisfied", "deteriorat", "unfortunately", "worst", "horrible",
  "terrible", "problematic", "nightmare", "decline", "erosion", "no clear",
  "not being", "cancel", "worry", "fear", "heavy", "burden", "unfair",
  "inequit", "ambiguit", "diluted", "low expectations", "spiraling down"
];

const positiveIndicators = [
  "excellent", "proud", "grateful", "thankful", "happy", "love",
  "great experience", "satisfied", "wonderful", "blessed", "best",
  "amazing", "outstanding", "second home", "family", "passion",
  "meaningful", "hopeful", "appreciate"
];

function classifySentiment(text) {
  const lower = text.toLowerCase();

  let hasPositive = false;
  let hasNegative = false;

  for (const indicator of negativeIndicators) {
    if (lower.includes(indicator)) {
      hasNegative = true;
      break;
    }
  }

  for (const indicator of positiveIndicators) {
    if (lower.includes(indicator)) {
      hasPositive = true;
      break;
    }
  }

  if (hasPositive && hasNegative) return 'neutral';
  if (hasPositive) return 'positive';
  if (hasNegative) return 'negative';
  return 'neutral';
}

// Filter junk comments (text length <= 5) and classify
const results = comments
  .filter(c => c.text.trim().length > 5)
  .map(c => ({
    id: c.id,
    text: c.text,
    faculty: c.faculty,
    sentiment: classifySentiment(c.text)
  }));

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

// Count sentiments
const counts = { positive: 0, negative: 0, neutral: 0 };
results.forEach(r => counts[r.sentiment]++);

console.log(`Total comments processed: ${results.length} (filtered from ${comments.length})`);
console.log(`Positive: ${counts.positive}`);
console.log(`Negative: ${counts.negative}`);
console.log(`Neutral:  ${counts.neutral}`);
console.log(`\nOutput written to: ${outputPath}`);

// Print each comment's classification
console.log('\n--- Classification Details ---');
results.forEach(r => {
  const preview = r.text.substring(0, 80).replace(/\n/g, ' ');
  console.log(`[${r.sentiment.toUpperCase().padEnd(8)}] ID ${String(r.id).padStart(2)}: ${preview}...`);
});
