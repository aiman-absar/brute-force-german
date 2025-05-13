
let level = 1;
let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = "";
let poolNouns = [];
let poolVerbs = [];
let allNouns = [];
let allVerbs = [];

// Load nouns and verbs from JSON
window.onload = function () {
    Promise.all([
        fetch('nouns.json').then(res => res.json()),
        fetch('verbs.json').then(res => res.json())
    ]).then(([nouns, verbs]) => {
        allNouns = nouns;
        allVerbs = verbs;
        loadNewLevel();
    });

    document.getElementById('testBtn').addEventListener('click', askQuestion);
    document.getElementById('submitBtn').addEventListener('click', checkAnswer);
};

// Shuffle utility
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadNewLevel() {
    shuffle(allNouns);
    shuffle(allVerbs);
    poolNouns = allNouns.slice(0, 20);
    poolVerbs = allVerbs.slice(0, 20);
    document.getElementById('levelNum').textContent = level;
    totalQuestions = 0;
    correctAnswers = 0;
    document.getElementById('totalNum').textContent = totalQuestions;
    document.getElementById('correctNum').textContent = correctAnswers;
    document.getElementById('resultDiv').innerHTML = "";
    document.getElementById('questionDiv').innerHTML = "";
}

function askQuestion() {
    const resultDiv = document.getElementById('resultDiv');
    const questionDiv = document.getElementById('questionDiv');
    const submitBtn = document.getElementById('submitBtn');
    const testBtn = document.getElementById('testBtn');

    resultDiv.innerHTML = "";
    questionDiv.innerHTML = "";
    submitBtn.style.display = 'none';

    const quizType = Math.random() < 0.5 ? 0 : 1;
    if (quizType === 0 && poolNouns.length > 0) {
        const idx = Math.floor(Math.random() * poolNouns.length);
        const noun = poolNouns.splice(idx, 1)[0];
        questionDiv.innerHTML = `<p>Translate this noun into German (include article): <strong>${noun.meaning.join(', ')}</strong></p>
                                 <input type="text" id="answerInput" />`;
        currentAnswer = noun.article + " " + noun.noun;
    } else if (quizType === 1 && poolVerbs.length > 0) {
        const idx = Math.floor(Math.random() * poolVerbs.length);
        const verb = poolVerbs.splice(idx, 1)[0];
        const pronouns = [
            { text: "ich", key: "ich" },
            { text: "du", key: "du" },
            { text: "er/sie/es", key: "er" },
            { text: "wir", key: "wir" },
            { text: "ihr", key: "ihr" },
            { text: "sie/Sie", key: "sie" }
        ];
        const missing = pronouns[Math.floor(Math.random() * pronouns.length)];
        let tableHTML = `<p>Conjugate "<strong>${verb.verb}</strong>" (${verb.meaning.join(', ')}) in present tense. Fill in the missing form:</p>`;
        tableHTML += '<table>';
        for (const pr of pronouns) {
            if (pr.key === missing.key) {
                tableHTML += `<tr><td>${pr.text}</td><td><input type="text" id="answerInput" /></td></tr>`;
                currentAnswer = verb.conj[pr.key];
            } else {
                tableHTML += `<tr><td>${pr.text}</td><td>${verb.conj[pr.key]}</td></tr>`;
            }
        }
        tableHTML += '</table>';
        questionDiv.innerHTML = tableHTML;
    } else {
        // fallback: no more questions
        resultDiv.innerHTML = "<p>No more questions in the current level.</p>";
        return;
    }

    submitBtn.style.display = 'inline-block';
    testBtn.disabled = true;

    const input = document.getElementById('answerInput');
    if (input) {
        input.focus();
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
}

function checkAnswer() {
    const input = document.getElementById('answerInput');
    if (!input) return;
    const userAnswer = input.value.trim().toLowerCase();
    const correct = currentAnswer.trim().toLowerCase();
    totalQuestions++;
    document.getElementById('totalNum').textContent = totalQuestions;
    const resultDiv = document.getElementById('resultDiv');
    if (userAnswer === correct) {
        correctAnswers++;
        document.getElementById('correctNum').textContent = correctAnswers;
        resultDiv.innerHTML = '<p class="correct">Correct!</p>';
    } else {
        resultDiv.innerHTML = `<p class="incorrect">Incorrect. The correct answer is: <strong>${currentAnswer}</strong></p>`;
    }

    const accuracy = correctAnswers / totalQuestions;
    if (totalQuestions >= 20 && accuracy >= 0.9) {
        level++;
        resultDiv.innerHTML += `<p class="correct">Congratulations! You reached 90% accuracy and leveled up to Level ${level}!</p>`;
        loadNewLevel();
    }

    document.getElementById('testBtn').disabled = false;
    document.getElementById('submitBtn').style.display = 'none';
}
