
let level = 1, score = 0, total = 0;
let allNouns = [], allVerbs = [];
let currentNouns = [], currentVerbs = [];
let nounIndex = 0, verbIndex = 0;
let nounPos = 0, verbPos = 0;
let errorCounts = {};
const pronouns = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];

window.onload = function () {
    fetch('nouns.json')
        .then(response => response.json())
        .then(data => {
            allNouns = data;
            allNouns.sort(() => Math.random() - 0.5);
            fetch('verbs.json')
                .then(response => response.json())
                .then(data => {
                    allVerbs = data;
                    allVerbs.sort(() => Math.random() - 0.5);
                    startLevel();
                });
        });

    document.getElementById('checkNoun').onclick = checkNoun;
    document.getElementById('checkVerb').onclick = checkVerb;
    document.getElementById('resetBtn').onclick = resetGame;
    document.getElementById('lookupBtn').onclick = lookupWord;
    document.getElementById('lookupInput').addEventListener('keydown', function(e){
        if (e.key === 'Enter') lookupWord();
    });
    document.getElementById('nounAnswer').addEventListener('keydown', function(e){
        if (e.key === 'Enter') checkNoun();
    });
};

function startLevel() {
    currentNouns = allNouns.slice(nounIndex, nounIndex + 20);
    nounIndex += 20;
    currentVerbs = allVerbs.slice(verbIndex, verbIndex + 20);
    verbIndex += 20;
    nounPos = 0;
    verbPos = 0;
    score = 0;
    total = 0;
    updateStatus();
    showNextNoun();
}

function updateStatus() {
    document.getElementById('level').innerText = level;
    document.getElementById('score').innerText = score;
    document.getElementById('total').innerText = total;
}

function showNextNoun() {
    if (nounPos < currentNouns.length) {
        let noun = currentNouns[nounPos];
        document.getElementById('nounQuestion').innerText = noun.meaning.join(', ');
        document.getElementById('nounFeedback').innerText = '';
        document.getElementById('nounAnswer').value = '';
        document.getElementById('nounQuiz').style.display = 'block';
        document.getElementById('verbQuiz').style.display = 'none';
    } else {
        showNextVerb();
    }
}

function checkNoun() {
    let input = document.getElementById('nounAnswer').value.trim().toLowerCase();
    let noun = currentNouns[nounPos];
    let correct = (noun.article + ' ' + noun.noun).toLowerCase();
    total++;
    if (input === correct) {
        score++;
        document.getElementById('nounFeedback').innerText = 'Correct!';
    } else {
        document.getElementById('nounFeedback').innerText = 'Incorrect. Correct answer: ' + noun.article + ' ' + noun.noun;
        trackError(noun.article + ' ' + noun.noun);
    }
    updateStatus();
    nounPos++;
    setTimeout(showNextNoun, 1500);
}

function showNextVerb() {
    if (verbPos < currentVerbs.length) {
        let verb = currentVerbs[verbPos];
        document.getElementById('verbTable').innerHTML = '';
        document.getElementById('verbQuiz').style.display = 'block';
        document.getElementById('nounQuiz').style.display = 'none';
        let blanks = Math.min(level, pronouns.length);
        let shuffled = [...Array(pronouns.length).keys()].sort(() => Math.random() - 0.5).slice(0, blanks);
        for (let i = 0; i < pronouns.length; i++) {
            let row = document.getElementById('verbTable').insertRow();
            row.insertCell(0).innerText = pronouns[i];
            let cell = row.insertCell(1);
            if (shuffled.includes(i)) {
                let input = document.createElement('input');
                input.type = 'text';
                input.dataset.pronoun = pronouns[i];
                cell.appendChild(input);
            } else {
                cell.innerText = verb.conj[pronouns[i]];
            }
        }
        document.getElementById('verbFeedback').innerText = '';
    } else {
        finalizeLevel();
    }
}

function checkVerb() {
    let inputs = document.querySelectorAll('#verbTable input');
    let correct = true;
    let verb = currentVerbs[verbPos];
    total++;
    inputs.forEach(input => {
        let val = input.value.trim().toLowerCase();
        let expected = verb.conj[input.dataset.pronoun];
        if (val === expected) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
            correct = false;
        }
    });
    if (correct) {
        score++;
        document.getElementById('verbFeedback').innerText = 'Correct!';
    } else {
        document.getElementById('verbFeedback').innerText = 'Some answers were incorrect.';
        trackError(verb.verb);
    }
    updateStatus();
    verbPos++;
    setTimeout(showNextVerb, 1500);
}

function finalizeLevel() {
    let accuracy = (score / total);
    if (accuracy >= 0.9) {
        alert('Level complete! Leveling up.');
        level++;
        startLevel();
    } else {
        alert('Try again. Accuracy below 90%.');
    }
}

function resetGame() {
    level = 1;
    score = 0;
    total = 0;
    nounIndex = 0;
    verbIndex = 0;
    errorCounts = {};
    updateErrorLog();
    startLevel();
}

function trackError(word) {
    errorCounts[word] = (errorCounts[word] || 0) + 1;
    updateErrorLog();
}

function updateErrorLog() {
    let list = document.getElementById('errorList');
    list.innerHTML = '';
    for (let key in errorCounts) {
        let li = document.createElement('li');
        li.textContent = key + (errorCounts[key] > 1 ? ' ×' + errorCounts[key] : '');
        list.appendChild(li);
    }
}

function lookupWord() {
    const val = document.getElementById('lookupInput').value.trim().toLowerCase();
    const result = document.getElementById('lookupResult');
    result.innerHTML = '';
    let noun = allNouns.find(n => n.noun.toLowerCase() === val);
    if (noun) {
        result.innerHTML = `<p><strong>${noun.article} ${noun.noun}</strong> – ${noun.meaning.join(', ')}</p>`;
        return;
    }
    let verb = allVerbs.find(v => v.verb.toLowerCase() === val);
    if (verb) {
        let html = `<p><strong>${verb.verb}</strong> – ${verb.meaning.join(', ')}</p><ul>`;
        for (let p of pronouns) {
            html += `<li>${p}: ${verb.conj[p]}</li>`;
        }
        html += '</ul>';
        result.innerHTML = html;
        return;
    }
    result.innerHTML = '<p>Not found.</p>';
}
