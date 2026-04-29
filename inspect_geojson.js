
import fs from 'fs';
const data = JSON.parse(fs.readFileSync('public/brazil-states.json', 'utf8'));
console.log(JSON.stringify(data.features[0].properties, null, 2));
console.log("Total features:", data.features.length);
