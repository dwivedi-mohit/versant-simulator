import fetch from 'node-fetch';

async function testScore() {
    try {
        console.log("Sending clean perfect answer test to Section A...");
        const res = await fetch('http://localhost:3000/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                section: 'A',
                userAnswer: 'I left my hat in the restaurant.',
                correctAnswer: 'I left my hat in the restaurant.',
                questionText: 'I left my hat in the restaurant.'
            })
        });

        const data = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", data);

        console.log("\nSending clean perfect answer test to Section E...");
        const resE = await fetch('http://localhost:3000/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                section: 'E',
                userAnswer: 'rewrite',
                correctAnswer: 'rewrite',
                questionText: "I don't know what I wrote, I'm going to rewrite it completely."
            })
        });

        const dataE = await resE.text();
        console.log("Status:", resE.status);
        console.log("Response:", dataE);

    } catch (e) {
        console.error("Test failed:", e.message);
    }
}

testScore();
