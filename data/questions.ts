import { QUESTION_POOL } from './question_pool';

// Linear Congruential Generator for seeded random tests
class LCG {
    private seed: number;
    constructor(seed: number) { this.seed = seed; }
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}

function shuffle<T>(array: T[], rng: LCG): T[] {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export type Question = {
    id: string;
    section: string;
    promptText: string;
    promptAudioText?: string;
    correctAnswer?: string;
    instructions: string;
    timeLimit: number;
    conversations?: { speaker: string, text: string }[];
    displaySentence?: string;
};

const CLEAN_E_POOL = [
    { full: "I don't know what I wrote, I'm going to rewrite it completely.", blank: "rewrite" },
    { full: "He burned the oil and the fire left a black mark above the stove.", blank: "mark" },
    { full: "To celebrate our first major success, we are going to throw a party.", blank: "success" },
    { full: "In cities with good public transport it's hard to understand why people drive.", blank: "transport" },
    { full: "When my bicycle got a flat tyre, I had to take the train to work.", blank: "tyre" },
    { full: "Because the company did not accept applications by mail, he had to submit his application using the website.", blank: "submit" },
    { full: "The city can be divided into two parts: the outer sections are rarely new, while the historical center is rather old.", blank: "divided" },
    { full: "I am a member of an animal protection group and do volunteer work once a month.", blank: "volunteer" },
    { full: "If you don't meet the height requirement you are not allowed to get on the ride.", blank: "height" },
    { full: "In my company, it is the manager's job to divide tasks among the team members.", blank: "manager's" },
    { full: "Negotiations came to a halt as leaders struggled to reach terms that were common to both parties.", blank: "halt" },
    { full: "He is running late, he should have been here an hour ago.", blank: "late" },
    { full: "A good policy is to always respond to customer requests within 24 hours.", blank: "respond" },
    { full: "We had planned to go hiking today, but the weather was so bad that we had to come up with an alternate plan.", blank: "weather" },
    { full: "There was a clear blue sky and the sun was shining.", blank: "shining" },
    { full: "Before you drive over the bridge you have to pay the toll at the booth.", blank: "toll" },
    { full: "The training program offers a wide selection of courses to any interested employee at a minimum charge.", blank: "selection" },
    { full: "I dropped my clothes off at the dry cleaner on my way to work this morning.", blank: "cleaner" }
];

const CLEAN_F_POOL = [
    "John is the sales manager of a small store. An angry customer called him to complain about a home security system that she had recently bought from his store. She told him that it did not work properly because the alarm went off when she was in the house. Initially she demanded a refund, but when John apologized, and offered to replace her system with a new one, she agreed.",
    "Sam was on a busy flight that had been delayed. The plane finally landed and arrived at the gate. Then all the passengers got up to get their luggage. The woman in front of Sam accidentally bumped him in the arm. Just as she was apologizing, her bag fell from the overhead compartment and hit him on the head. The woman felt awful. Sam decided he didn’t want to fly again anytime soon.",
    "Mary won this year's best teacher award at her university. She had been known for her creative and unique teaching style for many years. Her award included a trip to Paris for one week. Mary and her husband have never been to Paris and they are very excited about it.",
    "Employees who wish to take time off during the summer should check with their managers in advance. Many people plan to be away from the office during the summer. As a company, we'd like to make sure all projects have enough people working on them before we approve requests for time off.",
    "Robert went to a nice restaurant for dinner. When the waiter brought the bill, Robert reached for his wallet, but it wasn't in his pocket. He remembered having his wallet when he came into the restaurant. The waiter looked around the floor near his table. He found the wallet under the table."
];


const CLEAN_C_POOL = [
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Has the marketing report been finalized yet?" },
            { speaker: "Speaker 2", text: "Not quite, I still need to review the budget section." }
        ],
        question: "What does the person still need to review?",
        answer: "The budget section."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "I think my computer has a virus, it crashed twice this morning." },
            { speaker: "Speaker 2", text: "Let me call the IT department and have them send someone over." }
        ],
        question: "Who will they call?",
        answer: "The IT department."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Do you prefer the window seat or the aisle seat for our flight?" },
            { speaker: "Speaker 2", text: "I definitely prefer the aisle seat so I can stretch my legs." }
        ],
        question: "What seat does the person prefer?",
        answer: "The aisle seat."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Are we going to order lunch from the Italian place or the cafe?" },
            { speaker: "Speaker 2", text: "I had pasta last night, so let's try the new cafe." }
        ],
        question: "Where do they decide to eat?",
        answer: "The new cafe."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Can you please print these documents before the client arrives?" },
            { speaker: "Speaker 2", text: "Of course, I'll go to the copy room right now and make three sets." }
        ],
        question: "Where is the person going?",
        answer: "The copy room."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "The traffic was terrible this morning, I almost missed my train." },
            { speaker: "Speaker 2", text: "I heard there was an accident on the main highway." }
        ],
        question: "Why was the traffic terrible?",
        answer: "There was an accident."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "When are we expecting the new shipment of office supplies to arrive?" },
            { speaker: "Speaker 2", text: "The delivery driver said he would be here by tomorrow afternoon." }
        ],
        question: "When will the supplies arrive?",
        answer: "Tomorrow afternoon."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Did you remember to invite the regional director to the presentation?" },
            { speaker: "Speaker 2", text: "I sent her an email yesterday, but she hasn't replied yet." }
        ],
        question: "Who did the person invite?",
        answer: "The regional director."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Our team needs a bigger office because we are hiring three more people." },
            { speaker: "Speaker 2", text: "I agree, the current space is too small for seven desks." }
        ],
        question: "Why do they need a bigger office?",
        answer: "Because they are hiring more people."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "How long is the warranty on this camera?" },
            { speaker: "Speaker 2", text: "It comes with a one-year manufacturer's guarantee, but you can extend it to three." }
        ],
        question: "How long is the basic warranty?",
        answer: "One year."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Would you mind lowering the air conditioning? It's freezing in here." },
            { speaker: "Speaker 2", text: "Sure, I will adjust the thermostat to a warmer temperature." }
        ],
        question: "What is the person complaining about?",
        answer: "It is freezing."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Did you read the latest email from human resources?" },
            { speaker: "Speaker 2", text: "Yes, they announced the dates for the upcoming holiday break." }
        ],
        question: "What did the email announce?",
        answer: "The dates for the holiday break."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Are we taking a taxi or the subway to the airport?" },
            { speaker: "Speaker 2", text: "The subway is much faster during rush hour, so let's take that." }
        ],
        question: "How will they travel to the airport?",
        answer: "By subway."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Is the manager coming to the weekly meeting today?" },
            { speaker: "Speaker 2", text: "No, she is currently visiting our branch in London." }
        ],
        question: "Where is the manager?",
        answer: "Visiting the branch in London."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Please make sure to lock the front door when you leave." },
            { speaker: "Speaker 2", text: "I already locked it and turned off all the lights in the lobby." }
        ],
        question: "What did the person turn off?",
        answer: "The lights in the lobby."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "Your presentation was excellent, the slides were very easy to understand." },
            { speaker: "Speaker 2", text: "Thank you, I spent all weekend designing the graphics." }
        ],
        question: "What was excellent?",
        answer: "The presentation."
    },
    {
        dialogue: [
            { speaker: "Speaker 1", text: "I can't find my pen anywhere. I think I left it in the boardroom." },
            { speaker: "Speaker 2", text: "You can borrow my spare blue pen for the rest of the day." }
        ],
        question: "What did the person lose?",
        answer: "His pen."
    }
];


export function getPracticeSet(setId: number): Question[] {
    // Use a predictable seed based on the Set ID so Set 1 is always the exact same test
    const rng = new LCG(setId * 12345);

    const selectedA = shuffle(QUESTION_POOL.A, rng).slice(0, 16).map((promptText, idx) => ({
        id: `A${idx + 1}`, section: 'A', promptText, promptAudioText: promptText,
        instructions: "Please listen and repeat the sentence exactly as you hear it.", timeLimit: 15
    }));
    const selectedB = shuffle(QUESTION_POOL.B, rng).slice(0, 8).map((q, idx) => {
        const cleaned = q.prompt.replace(/^[0-9\)]+\s*/, '').replace(/-/g, '. ');
        return {
            id: `B${idx + 1}`, section: 'B', promptText: cleaned, promptAudioText: cleaned, correctAnswer: q.answer,
            instructions: "Please listen, and then say the rearranged groups of words into a correct sentence.", timeLimit: 20
        };
    });
    const selectedC = shuffle(CLEAN_C_POOL, rng).slice(0, 12).map((q, idx) => {
        const conversations = [];
        for (const line of q.dialogue) {
            conversations.push(line);
        }
        conversations.push({ speaker: "Narrator", text: q.question });

        return {
            id: `C${idx + 1}`, section: 'C',
            promptText: q.dialogue.map(d => `${d.speaker}: ${d.text}`).join('\n') + `\nNarrator: ${q.question}`,
            conversations,
            correctAnswer: q.answer,
            instructions: "Listen to the conversation. Then, answer the question with a short phrase or sentence.", timeLimit: 20
        };
    });
    const selectedD = shuffle(QUESTION_POOL.D, rng).slice(0, 14).map((q, idx) => ({
        id: `D${idx + 1}`, section: 'D', promptText: q, promptAudioText: q, correctAnswer: q,
        instructions: "Please type each sentence exactly as you hear it.", timeLimit: 30
    }));
    const selectedE = shuffle(CLEAN_E_POOL, rng).slice(0, 18).map((q, idx) => ({
        id: `E${idx + 1}`, section: 'E', promptText: q.full, correctAnswer: q.blank,
        displaySentence: q.full.replace(q.blank, "_______"),
        instructions: "Please type one word that best fits the meaning of the sentence.", timeLimit: 25
    }));
    const selectedF = shuffle(CLEAN_F_POOL, rng).slice(0, 2).map((q, idx) => ({
        id: `F${idx + 1}`, section: 'F', promptText: q,
        instructions: "Read the paragraph. You will have 90 seconds to rewrite the passage as completely as you can.", timeLimit: 90
    }));

    return [...selectedA, ...selectedB, ...selectedC, ...selectedD, ...selectedE, ...selectedF];
}

export function generatePracticeSet() {
    // Generate a totally random seed for 'Start Official Test'
    return getPracticeSet(Math.floor(Math.random() * 1000000));
}

export const MOCK_QUESTIONS = getPracticeSet(1);
