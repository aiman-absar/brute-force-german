// script.js – fixed version

let nouns = [], verbs = [];
let currentAnswer = "", currentType = "";
let totalQuestions = 0, correctAnswers = 0;

// Load data and start quiz
async function loadData() {
    try {
        const nounRes = await fetch('nouns.json');
        nouns = await nounRes.json();
        const verbRes = await fetch('verbs.json');
        verbs = await verbRes.json();
        askNextQuestion();
    } catch(err) {
        console.error(err);
    }
}

// Ask the next question (noun or verb)
function askNextQuestion() {
    // Randomly choose noun or verb (if both types remain)
    let quizType = null;
    if (nouns.length > 0 && verbs.length > 0) {
        quizType = Math.random() < 0.5 ? 'noun' : 'verb';
    } else if (nouns.length > 0) {
        quizType = 'noun';
    } else if (verbs.length > 0) {
        quizType = 'verb';
    }
    if (!quizType) return;  // no questions left

    // Set up noun question
    if (quizType === 'noun') {
        currentType = 'noun';
        document.getElementById('nounQuiz').style.display = '';
        document.getElementById('verbQuiz').style.display = 'none';
        document.getElementById('nounFeedback').textContent = '';
        // Pick a random noun
        const idx = Math.floor(Math.random() * nouns.length);
        const noun = nouns.splice(idx, 1)[0];
        // Show the meaning and set expected answer
        document.getElementById('nounQuestion').innerHTML =
            `<p>Translate this noun into German (include the article): <strong>${noun.meaning}</strong></p>`;
        document.getElementById('nounAnswer').value = '';
        document.getElementById('nounAnswer').focus();
        currentAnswer = noun.article + ' ' + noun.noun;
    }

    // Set up verb question
    if (quizType === 'verb') {
        currentType = 'verb';
        document.getElementById('nounQuiz').style.display = 'none';
        document.getElementById('verbQuiz').style.display = '';
        document.getElementById('verbFeedback').textContent = '';
        // Pick a random verb
        const idx = Math.floor(Math.random() * verbs.length);
        const verb = verbs.splice(idx, 1)[0];
        const keys = Object.keys(verb.conjugation);
        const missingKey = keys[Math.floor(Math.random() * keys.length)];
        currentAnswer = verb.conjugation[missingKey];
        // Build a table with all forms, leaving one blank
        let html = `<p>Conjugate "<strong>${verb.infinitive}</strong>" (${verb.meaning}) in present tense. Fill in the missing form:</p>`;
        html += '<table><tr><th>Pronoun</th><th>Conjugation</th></tr>';
        for (let pron of keys) {
            if (pron === missingKey) {
                html += `<tr><td>${pron}</td><td><input type="text" id="answerInput"></td></tr>`;
            } else {
                html += `<tr><td>${pron}</td><td>${verb.conjugation[pron]}</td></tr>`;
            }
        }
        html += '</table>';
        document.getElementById('verbTable').innerHTML = html;
        document.getElementById('answerInput').focus();
    }
}

// Check the noun answer
function checkNounAnswer() {
    const ans = document.getElementById('nounAnswer').value.trim().toLowerCase();
    totalQuestions++;
    document.getElementById('total').textContent = totalQuestions;
    const feedback = document.getElementById('nounFeedback');
    if (ans === currentAnswer.toLowerCase()) {
        correctAnswers++;
        document.getElementById('score').textContent = correctAnswers;
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
    } else {
        feedback.innerHTML = `Incorrect. The correct answer is: <strong>${currentAnswer}</strong>`;
        feedback.style.color = 'red';
    }
    askNextQuestion();
}

// Check the verb answer
function checkVerbAnswer() {
    const ans = document.getElementById('answerInput').value.trim().toLowerCase();
    totalQuestions++;
    document.getElementById('total').textContent = totalQuestions;
    const feedback = document.getElementById('verbFeedback');
    if (ans === currentAnswer.toLowerCase()) {
        correctAnswers++;
        document.getElementById('score').textContent = correctAnswers;
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
    } else {
        feedback.innerHTML = `Incorrect. The correct answer is: <strong>${currentAnswer}</strong>`;
        feedback.style.color = 'red';
    }
    askNextQuestion();
}

// Reset button: clear stats and reload questions
function doReset() {
    totalQuestions = 0;
    correctAnswers = 0;
    document.getElementById('total').textContent = 0;
    document.getElementById('score').textContent = 0;
    loadData();
}

// Set up event handlers after the page loads
window.addEventListener('load', () => {
    document.getElementById('checkNoun').addEventListener('click', checkNounAnswer);
    document.getElementById('checkVerb').addEventListener('click', checkVerbAnswer);
    document.getElementById('resetBtn').addEventListener('click', doReset);
    loadData();
});
