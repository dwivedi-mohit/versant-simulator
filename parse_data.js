const fs = require('fs');

const textRaw = fs.readFileSync('raw_data.txt', 'utf8');
const text = textRaw.replace(/\n\s*\d+\s*\n/g, '\n');

const aStart = text.indexOf('Repeats:');
const bStart = text.search(/SENTENCE BUILDS:|SENTENCES BUILDS:/i);
const eStart = text.search(/SENTENCECOMPLETION::|SENTENCE COMPLETION::/i);
const dStart = text.indexOf('DICTATIONS');
const fStart = text.search(/PASSAGE RECONSTRUCTION|PASSAGERECONSTRUCTION/i) !== -1 ? text.search(/PASSAGE RECONSTRUCTION|PASSAGERECONSTRUCTION/i) : text.search(/RECONSTRUCTION/i);
const cStart = text.search(/conversation\s*-\s*1/i);

console.log({ aStart, bStart, eStart, dStart, fStart, cStart });

const sections = { A: [], B: [], C: [], D: [], E: [], F: [] };

if (aStart !== -1 && bStart !== -1) {
    const repText = text.substring(aStart, bStart);
    const regex = /\d+\.\s*(.*?)(?=\s+\d+\.|$)/gs;
    let m;
    while ((m = regex.exec(repText)) !== null) {
        sections.A.push(m[1].replace(/\n/g, ' ').trim());
    }
}

if (bStart !== -1 && eStart !== -1) {
    const bText = text.substring(bStart, eStart);
    const regex = /\d+\)\s*(.*?)\s*A\)\s*(.*?)(?=\s+\d+\)|SENTENCES BUILDS:|$)/gs;
    let m;
    while ((m = regex.exec(bText)) !== null) {
        sections.B.push({ prompt: m[1].replace(/\n/g, ' ').trim(), answer: m[2].replace(/\n/g, ' ').trim() });
    }
    const b2Text = bText.substring(bText.search(/SENTENCES BUILDS:/i) || 0);
    const b2Regex = /⦁\s*(.*?)(?=\s*⦁|$)/gs;
    let temp = [];
    while ((m = b2Regex.exec(b2Text)) !== null) {
        temp.push(m[1].replace(/\n/g, '').trim());
    }
    for (let i = 0; i < temp.length - 1; i += 2) {
        sections.B.push({ prompt: temp[i], answer: temp[i + 1] });
    }
}

if (eStart !== -1 && dStart !== -1) {
    const eText = text.substring(eStart, dStart);
    const regex = /(?:⦁|•|\u2022|\u2981)\s*\d*\.?\s*(.*?)(?=\s*(?:⦁|•|\u2022|\u2981)|$)/gs;
    let m;
    while ((m = regex.exec(eText)) !== null) {
        if (!m[1].includes('SENTENCECOMPLETION')) {
            const stripped = m[1].trim();
            if (stripped.length > 5) sections.E.push(stripped.replace(/\s+/g, ' '));
        }
    }
}

if (dStart !== -1 && fStart !== -1) {
    const dText = text.substring(dStart, fStart);
    const regex = /(?:⦁|•|\u2022|\u2981)\s*(.*?)(?=\s*(?:⦁|•|\u2022|\u2981)|$)/gs;
    let m;
    while ((m = regex.exec(dText)) !== null) {
        if (!m[1].includes('DICTATIONS')) {
            const stripped = m[1].trim();
            if (stripped.length > 5) sections.D.push(stripped.replace(/\s+/g, ' '));
        }
    }
}

if (fStart !== -1 && cStart !== -1) {
    const fText = text.substring(fStart, cStart);
    const cutoff = fText.search(/RECONSTRUCTED/i);
    const fPrompts = cutoff > -1 ? fText.substring(0, cutoff) : fText;
    const regex = /(?:⦁|•|\u2022|\u2981)\s*\d+\)\s*(.*?)(?=\s*(?:⦁|•|\u2022|\u2981)|$)/gs;
    let m;
    while ((m = regex.exec(fPrompts)) !== null) {
        sections.F.push(m[1].replace(/\n/g, ' ').trim());
    }
}

if (cStart !== -1) {
    let convStr = text.substring(cStart);
    const regex = /\d+\.\s*Speaker 1:\s*(.*?)(?=\s+\d+\.\s*Speaker 1:|$)/gs;
    let m;
    while ((m = regex.exec(convStr)) !== null) {
        sections.C.push('Speaker 1: ' + m[1].trim().replace(/\s+/g, ' '));
    }
}

console.log('Parsed A:', sections.A.length);
console.log('Parsed B:', sections.B.length);
console.log('Parsed C:', sections.C.length);
console.log('Parsed D:', sections.D.length);
console.log('Parsed E:', sections.E.length);
console.log('Parsed F:', sections.F.length);

fs.writeFileSync('data/question_pool.ts', `export const QUESTION_POOL = ${JSON.stringify(sections, null, 2)};`);
