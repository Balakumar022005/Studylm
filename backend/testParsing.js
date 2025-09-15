// Import modules
import fs from 'fs';
import path from 'path';

// Example: read and parse a JSON file
const filePath = path.resolve('./data.json'); // replace with your file

try {
  // Read file asynchronously
  const data = await fs.promises.readFile(filePath, 'utf-8');
  
  // Parse JSON
  const parsed = JSON.parse(data);

  console.log('Parsed data:', parsed);
} catch (err) {
  console.error('Error reading or parsing file:', err);
}
