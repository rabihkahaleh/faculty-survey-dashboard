const fs = require('fs');
const comments = JSON.parse(fs.readFileSync('comments-data.json', 'utf8'));

// Filter out junk comments (single chars, very short)
const valid = comments.filter(c => c.text.trim().length > 5);

// Build the JS array string
const lines = valid.map(c => {
  // Clean up text for embedding in JS
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

  let faculty = c.faculty.replace(/�/g, 'e');

  return `    { id: ${c.id}, text: \`${text}\`, faculty: '${faculty}' }`;
});

const result = 'const surveyComments = [\n' + lines.join(',\n') + '\n];';
fs.writeFileSync('comments-array.ts', result, 'utf8');
console.log('Generated ' + valid.length + ' valid comments');
