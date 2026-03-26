const fs = require('fs');

const bText = fs.readFileSync('raw_data_b.txt', 'utf8');
const regex = /\d+\)\s*(.*?)\s*A[\)0]\s*(.*?)(?=\s+\d+\)|$)/gs;

const items = [];
let m;
while ((m = regex.exec(bText)) !== null) {
    items.push({
        prompt: m[1].replace(/\n/g, ' ').trim(),
        answer: m[2].replace(/\n/g, ' ').trim()
    });
}

const poolContent = fs.readFileSync('data/question_pool.ts', 'utf8');
// Use eval to extract the object from the export statement
let QUESTION_POOL;
eval(poolContent.replace('export const QUESTION_POOL = ', 'QUESTION_POOL = '));

QUESTION_POOL.B = items;

fs.writeFileSync('data/question_pool.ts', `export const QUESTION_POOL = ${JSON.stringify(QUESTION_POOL, null, 2)};`);
console.log(`Successfully updated Section B with ${items.length} purely parsed items.`);
