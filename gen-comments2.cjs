const fs = require('fs');
const comments = JSON.parse(fs.readFileSync('comments-with-sentiment.json', 'utf8'));

const lines = comments.map(c => {
  let text = c.text
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\?/g, "'")
    .trim();

  return `    { id: ${c.id}, text: \`${text}\`, sentiment: '${c.sentiment}' as const }`;
});

const result = 'const surveyComments = [\n' + lines.join(',\n') + '\n];';
fs.writeFileSync('comments-array.ts', result, 'utf8');
console.log('Generated ' + comments.length + ' comments with sentiment');
