import fs from 'fs';

const raw = fs.readFileSync('data.txt', 'utf8');

const regex = /^(\d+)\.\s*(.*?)\s*–\s*(.*)$/gm;
const results = [];
let currentItem = null;

const lines = raw.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Try to match a new item
  const match = line.match(/^(\d+)\.\s+(.*?)\s*[–-]\s*(.*)$/);
  
  if (match) {
    if (currentItem) {
      results.push(currentItem);
    }
    
    currentItem = {
      id: parseInt(match[1], 10),
      name: match[2].trim(),
      description: match[3].trim()
    };
  } else if (currentItem) {
    // If we're accumulating an item and this line doesn't match the new item pattern
    // and it's not empty, it's a continuation of the description
    const text = line.trim();
    if (text && !text.startsWith('Get a resume')) {
      currentItem.description += ' ' + text;
    }
  }
}

// Push the last item
if (currentItem) {
  results.push(currentItem);
}

fs.writeFileSync('src/data.json', JSON.stringify(results, null, 2));
console.log(`Parsed ${results.length} items`);
