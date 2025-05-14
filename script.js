
let level = 1;
let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = "";
let poolNouns = [];
let poolVerbs = [];
let nounsList = [];
let verbsList = [];

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

// Load JSON data
async function loadData() {
    const nounsRes = await fetch('nouns.json');
    const verbsRes = await fetch('verbs.json');
    nounsList = await nounsRes.json();
    verbsList = await verbsRes.json();
    loadNewLevel();
}

function loadNewLevel() {
    shuffle(nounsList);
    shuffle(verbsList);
    poolNouns = nounsList.slice(0, 20);
    poolVerbs = verbsList.slice(0, 20);
    levelNum.textContent = level;
    totalQuestions = 0;
    correctAnswers = 0;
    totalNum.textContent = totalQuestions;
    correctNum.textContent = correctAnswers;
    resultDiv.innerHTML = "";
    questionDiv.innerHTML = "";
}

testBtn.addEventListener('click', () => {
    resultDiv.innerHTML = "";
    questionDiv.innerHTML = "";
    submitBtn.style.display = 'none';

    const quizType = Math.random() < 0.5 ? 0 : 1;

    if (quizType === 0 && poolNouns.length > 0) {
        const idx = Math.floor(Math.random() * poolNouns.length);
        const item = poolNouns.splice(idx, 1)[0];
        questionDiv.innerHTML = \`<p>Translate this noun into German (include article): <strong>\${item.meaning}</strong></p>
                                   <input type="text" id="answerInput" />\`;
        currentAnswer = item.article + " " + item.noun;
    } else if (quizType === 1 && poolVerbs.length > 0) {
        const idx = Math.floor(Math.random() * poolVerbs.length);
        const verb = poolVerbs.splice(idx, 1)[0];
        const pronouns = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
        const forms = verb.conjugation;
        const missing = pronouns[Math.floor(Math.random() * pronouns.length)];
        let tableHTML = \`<p>Conjugate "<strong>\${verb.infinitive}</strong>" (\${verb.meaning}) in present tense. Fill in the missing form:</p>\`;
        tableHTML += '<table>';
        pronouns.forEach(pr => {
            if (pr === missing) {
                tableHTML += \`<tr><td>\${pr}</td><td><input type="text" id="answerInput" /></td></tr>\`;
                currentAnswer = forms[pr];
            } else {
                tableHTML += \`<tr><td>\${pr}</td><td>\${forms[pr]}</td></tr>\`;
            }
        });
        tableHTML += '</table>';
        questionDiv.innerHTML = tableHTML;
    }

    submitBtn.style.display = 'inline-block';
    testBtn.disabled = true;
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
        resultDiv.innerHTML = \`<p class="incorrect">Incorrect. The correct answer is: <strong>\${currentAnswer}</strong></p>\`;
    }

    const accuracy = correctAnswers / totalQuestions;
    if (totalQuestions > 0 && accuracy >= 0.9) {
        level++;
        resultDiv.innerHTML += \`<p class="correct">Congratulations! You reached 90% accuracy and leveled up to Level \${level}!</p>\`;
        loadNewLevel();
    }

    testBtn.disabled = false;
    submitBtn.style.display = 'none';
}

submitBtn.addEventListener('click', () => {
    checkAnswer();
});

loadData();
