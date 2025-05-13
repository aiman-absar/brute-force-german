// script.js

// Data: list of nouns (English -> German with article)
const nounsList = [
    {eng: "the island", ger: "die Insel"},
    {eng: "the house", ger: "das Haus"},
    {eng: "the dog", ger: "der Hund"},
    {eng: "the cat", ger: "die Katze"},
    {eng: "the car", ger: "das Auto"},
    {eng: "the bicycle", ger: "das Fahrrad"},
    {eng: "the student", ger: "der Student"},
    {eng: "the teacher", ger: "der Lehrer"},
    {eng: "the table", ger: "der Tisch"},
    {eng: "the book", ger: "das Buch"},
    {eng: "the apple", ger: "der Apfel"},
    {eng: "the bread", ger: "das Brot"},
    {eng: "the water", ger: "das Wasser"},
    {eng: "the sun", ger: "die Sonne"},
    {eng: "the moon", ger: "der Mond"},
    {eng: "the friend", ger: "der Freund"},
    {eng: "the lady", ger: "die Dame"},
    {eng: "the day", ger: "der Tag"},
    {eng: "the week", ger: "die Woche"},
    {eng: "the year", ger: "das Jahr"},
    {eng: "the city", ger: "die Stadt"},
    {eng: "the country", ger: "das Land"},
    {eng: "the language", ger: "die Sprache"},
    {eng: "the word", ger: "das Wort"},
    {eng: "the question", ger: "die Frage"},
    {eng: "the answer", ger: "die Antwort"},
    {eng: "the window", ger: "das Fenster"},
    {eng: "the door", ger: "die Tür"},
    {eng: "the street", ger: "die Straße"},
    {eng: "the school", ger: "die Schule"},
    {eng: "the university", ger: "die Universität"}
];

// List of verbs with present tense conjugations
const verbsList = [
    {infinitive: "sein", meaning: "to be", forms: {ich: "bin", du: "bist", er: "ist", wir: "sind", ihr: "seid", sie: "sind"}},
    {infinitive: "haben", meaning: "to have", forms: {ich: "habe", du: "hast", er: "hat", wir: "haben", ihr: "habt", sie: "haben"}},
    {infinitive: "werden", meaning: "to become", forms: {ich: "werde", du: "wirst", er: "wird", wir: "werden", ihr: "werdet", sie: "werden"}},
    {infinitive: "gehen", meaning: "to go", forms: {ich: "gehe", du: "gehst", er: "geht", wir: "gehen", ihr: "geht", sie: "gehen"}},
    {infinitive: "kommen", meaning: "to come", forms: {ich: "komme", du: "kommst", er: "kommt", wir: "kommen", ihr: "kommt", sie: "kommen"}},
    {infinitive: "sprechen", meaning: "to speak", forms: {ich: "spreche", du: "sprichst", er: "spricht", wir: "sprechen", ihr: "sprecht", sie: "sprechen"}},
    {infinitive: "essen", meaning: "to eat", forms: {ich: "esse", du: "isst", er: "isst", wir: "essen", ihr: "esst", sie: "essen"}},
    {infinitive: "trinken", meaning: "to drink", forms: {ich: "trinke", du: "trinkst", er: "trinkt", wir: "trinken", ihr: "trinkt", sie: "trinken"}},
    {infinitive: "sehen", meaning: "to see", forms: {ich: "sehe", du: "siehst", er: "sieht", wir: "sehen", ihr: "seht", sie: "sehen"}},
    {infinitive: "nehmen", meaning: "to take", forms: {ich: "nehme", du: "nimmst", er: "nimmt", wir: "nehmen", ihr: "nehmt", sie: "nehmen"}},
    {infinitive: "schreiben", meaning: "to write", forms: {ich: "schreibe", du: "schreibst", er: "schreibt", wir: "schreiben", ihr: "schreibt", sie: "schreiben"}},
    {infinitive: "lesen", meaning: "to read", forms: {ich: "lese", du: "liest", er: "liest", wir: "lesen", ihr: "lest", sie: "lesen"}},
    {infinitive: "schlafen", meaning: "to sleep", forms: {ich: "schlafe", du: "schläfst", er: "schläft", wir: "schlafen", ihr: "schlaft", sie: "schlafen"}},
    {infinitive: "fahren", meaning: "to drive", forms: {ich: "fahre", du: "fährst", er: "fährt", wir: "fahren", ihr: "fahrt", sie: "fahren"}},
    {infinitive: "laufen", meaning: "to run", forms: {ich: "laufe", du: "läufst", er: "läuft", wir: "laufen", ihr: "lauft", sie: "laufen"}},
    {infinitive: "rufen", meaning: "to call", forms: {ich: "rufe", du: "rufst", er: "ruft", wir: "rufen", ihr: "ruft", sie: "rufen"}},
    {infinitive: "sitzen", meaning: "to sit", forms: {ich: "sitze", du: "sitzt", er: "sitzt", wir: "sitzen", ihr: "sitzt", sie: "sitzen"}},
    {infinitive: "stehen", meaning: "to stand", forms: {ich: "stehe", du: "stehst", er: "steht", wir: "stehen", ihr: "steht", sie: "stehen"}},
    {infinitive: "machen", meaning: "to do/make", forms: {ich: "mache", du: "machst", er: "macht", wir: "machen", ihr: "macht", sie: "machen"}},
    {infinitive: "spielen", meaning: "to play", forms: {ich: "spiele", du: "spielst", er: "spielt", wir: "spielen", ihr: "spielt", sie: "spielen"}}
];

// Game state
let level = 1;
let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = "";
let poolNouns = [];
let poolVerbs = [];

// DOM elements
const levelNum = document.getElementById('levelNum');
const totalNum = document.getElementById('totalNum');
const correctNum = document.getElementById('correctNum');
const testBtn = document.getElementById('testBtn');
const submitBtn = document.getElementById('submitBtn');
const questionDiv = document.getElementById('questionDiv');
const resultDiv = document.getElementById('resultDiv');

// Utility: shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Load new pool for level
function loadNewLevel() {
    // Shuffle and select 20 nouns and verbs
    poolNouns = nounsList.slice();
    poolVerbs = verbsList.slice();
    shuffle(poolNouns);
    shuffle(poolVerbs);
    poolNouns = poolNouns.slice(0, 20);
    poolVerbs = poolVerbs.slice(0, 20);
    // Update display and reset counters
    levelNum.textContent = level;
    totalQuestions = 0;
    correctAnswers = 0;
    totalNum.textContent = totalQuestions;
    correctNum.textContent = correctAnswers;
    resultDiv.innerHTML = "";
    questionDiv.innerHTML = "";
}

// Start first level
loadNewLevel();

// Handle "Test me" button
testBtn.addEventListener('click', () => {
    // Clear previous content
    resultDiv.innerHTML = "";
    questionDiv.innerHTML = "";
    submitBtn.style.display = 'none';
    // Randomly choose quiz type
    const quizType = Math.random() < 0.5 ? 0 : 1;
    if (quizType === 0) {
        // Noun translation quiz
        if (poolNouns.length === 0) { 
            poolNouns = nounsList.slice(); shuffle(poolNouns);
            poolNouns = poolNouns.slice(0, 20);
        }
        const idx = Math.floor(Math.random() * poolNouns.length);
        const item = poolNouns.splice(idx, 1)[0];
        questionDiv.innerHTML = `<p>Translate this noun into German (include article): <strong>${item.eng}</strong></p>
                                 <input type="text" id="answerInput" />`;
        currentAnswer = item.ger;
    } else {
        // Verb conjugation quiz
        if (poolVerbs.length === 0) {
            poolVerbs = verbsList.slice(); shuffle(poolVerbs);
            poolVerbs = poolVerbs.slice(0, 20);
        }
        const idx = Math.floor(Math.random() * poolVerbs.length);
        const verb = poolVerbs.splice(idx, 1)[0];
        // Choose a random missing form
        const pronouns = [
            {text: "ich", key: "ich"},
            {text: "du", key: "du"},
            {text: "er/sie/es", key: "er"},
            {text: "wir", key: "wir"},
            {text: "ihr", key: "ihr"},
            {text: "sie/Sie", key: "sie"}
        ];
        const missing = pronouns[Math.floor(Math.random() * pronouns.length)];
        // Build table
        let tableHTML = `<p>Conjugate "<strong>${verb.infinitive}</strong>" (${verb.meaning}) in present tense. Fill in the missing form:</p>`;
        tableHTML += '<table>';
        pronouns.forEach(pr => {
            if (pr.key === missing.key) {
                tableHTML += `<tr><td>${pr.text}</td><td><input type="text" id="answerInput" /></td></tr>`;
                currentAnswer = verb.forms[pr.key];
            } else {
                tableHTML += `<tr><td>${pr.text}</td><td>${verb.forms[pr.key]}</td></tr>`;
            }
        });
        tableHTML += '</table>';
        questionDiv.innerHTML = tableHTML;
    }
    // Show submit button and disable Test button
    submitBtn.style.display = 'inline-block';
    testBtn.disabled = true;
    // Focus on input and allow Enter to submit
    const input = document.getElementById('answerInput');
    if (input) {
        input.focus();
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
});

// Check the answer and update feedback
function checkAnswer() {
    const input = document.getElementById('answerInput');
    if (!input) return;
    const userAnswer = input.value.trim().toLowerCase();
    const correct = currentAnswer.trim().toLowerCase();
    totalQuestions++;
    totalNum.textContent = totalQuestions;
    if (userAnswer === correct) {
        correctAnswers++;
        correctNum.textContent = correctAnswers;
        resultDiv.innerHTML = '<p class="correct">Correct!</p>';
    } else {
        resultDiv.innerHTML = `<p class="incorrect">Incorrect. The correct answer is: <strong>${currentAnswer}</strong></p>`;
    }
    // Check for level up (90% accuracy)
    const accuracy = correctAnswers / totalQuestions;
    if (totalQuestions > 0 && accuracy >= 0.9) {
        level++;
        resultDiv.innerHTML += `<p class="correct">Congratulations! You reached 90% accuracy and leveled up to Level ${level}!</p>`;
        loadNewLevel();
    }
    // Allow next question
    testBtn.disabled = false;
    submitBtn.style.display = 'none';
}

// Submit button handler
submitBtn.addEventListener('click', () => {
    checkAnswer();
});
