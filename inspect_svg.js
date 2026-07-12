
const fs = require('fs');
const content = fs.readFileSync('public/brazil.svg', 'utf8');
const regex = /<path[^>]*id="([^"]*)"/g;
let match;
const ids = [];
while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
}
console.log("Found IDs:", ids);
