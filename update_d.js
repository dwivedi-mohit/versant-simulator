const fs = require('fs');

const dText = fs.readFileSync('raw_data_d.txt', 'utf8');
const lines = dText.split('\n');
const items = [];

for (const line of lines) {
    // Match line looking like "1. I left my hat..."
    const match = line.match(/^\d+\.\s*(.+)/);
    if (match) {
        items.push(match[1].trim());
    }
}

const poolContent = fs.readFileSync('data/question_pool.ts', 'utf8');
let QUESTION_POOL;
eval(poolContent.replace('export const QUESTION_POOL = ', 'QUESTION_POOL = '));

QUESTION_POOL.D = items;

fs.writeFileSync('data/question_pool.ts', `export const QUESTION_POOL = ${JSON.stringify(QUESTION_POOL, null, 2)};`);
console.log(`Successfully updated Section D with ${items.length} purely parsed items.`);
