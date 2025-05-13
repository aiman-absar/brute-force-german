// German Vocabulary Quiz Logic
let level = 1, score = 0, total = 0;
let allNouns = [], allVerbs = [];
let currentNouns = [], currentVerbs = [];
let nounIndex = 0, verbIndex = 0;
let nounPos = 0, verbPos = 0;
let errorCounts = {};

// Pronouns for conjugation
const pronouns = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie'];

window.onload = function() {
  // Load nouns and verbs JSON
  fetch('nouns.json')
    .then(response => response.json())
    .then(data => {
      allNouns = data;
      // Shuffle nouns
      allNouns.sort(() => Math.random() - 0.5);
      fetch('verbs.json')
        .then(response => response.json())
        .then(data => {
          allVerbs = data;
          allVerbs.sort(() => Math.random() - 0.5);
          startLevel();
        });
    });
  // Event listeners
  document.getElementById('checkNoun').onclick = checkNoun;
  document.getElementById('nounAnswer').addEventListener('keydown', function(e){
    if(e.key === 'Enter') checkNoun();
  });
  document.getElementById('checkVerb').onclick = checkVerb;
  document.getElementById('resetBtn').onclick = resetGame;
  document.getElementById('lookupBtn').onclick = lookupWord;
  document.getElementById('lookupInput').addEventListener('keydown', function(e){
    if(e.key === 'Enter') lookupWord();
  });
};

function startLevel() {
  // Set up new level: take next 20 nouns and verbs
  currentNouns = allNouns.slice(nounIndex, nounIndex + 20);
  nounIndex += 20;
  currentVerbs = allVerbs.slice(verbIndex, verbIndex + 20);
  verbIndex += 20;
  nounPos = 0;
  verbPos = 0;
  score = 0;
  total = 0;
  updateStatus();
  // Show noun quiz first
  document.getElementById('nounQuiz').style.display = 'block';
  document.getElementById('verbQuiz').style.display = 'none';
  document.getElementById('nounFeedback').innerText = '';
  document.getElementById('verbFeedback').innerText = '';
  document.getElementById('nounAnswer').value = '';
  showNextNoun();
}

function updateStatus() {
  document.getElementById('level').innerText = level;
  document.getElementById('score').innerText = score;
  document.getElementById('total').innerText = total;
}

function showNextNoun() {
  if (nounPos < currentNouns.length) {
    let nounData = currentNouns[nounPos];
    document.getElementById('nounQuestion').innerText = nounData.meaning.join(', ');
    document.getElementById('nounFeedback').innerText = '';
    document.getElementById('nounAnswer').value = '';
    document.getElementById('nounAnswer').focus();
  } else {
    // All nouns done, move to verb quiz
    document.getElementById('nounQuiz').style.display = 'none';
    document.getElementById('verbQuiz').style.display = 'block';
    showNextVerb();
  }
}

function checkNoun() {
  let answerInput = document.getElementById('nounAnswer');
  let userAnswer = answerInput.value.trim();
  if (!userAnswer) return;
  let nounData = currentNouns[nounPos];
  let correctAnswer = nounData.article + ' ' + nounData.noun;
  total++;
  updateStatus();
  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score++;
    document.getElementById('nounFeedback').innerText = 'Correct!';
  } else {
    document.getElementById('nounFeedback').innerText = 'Incorrect. The correct answer is "' + correctAnswer + '".';
    // Track error
    let key = correctAnswer;
    errorCounts[key] = (errorCounts[key] || 0) + 1;
    updateErrorLog();
  }
  updateStatus();
  nounPos++;
  // Show next noun after short delay
  setTimeout(showNextNoun, 1500);
}

function showNextVerb() {
  if (verbPos < currentVerbs.length) {
    let verbData = currentVerbs[verbPos];
    // Build conjugation table
    let table = document.getElementById('verbTable');
    table.innerHTML = '';
    let blanks = Math.min(level, pronouns.length);
    for (let i = 0; i < pronouns.length; i++) {
      let row = table.insertRow();
      let cellPronoun = row.insertCell();
      let cellAnswer = row.insertCell();
      cellPronoun.innerText = pronouns[i];
      if (i < blanks) {
        // input for user
        let input = document.createElement('input');
        input.type = 'text';
        input.id = 'verbAns' + i;
        cellAnswer.appendChild(input);
      } else {
        // show correct answer
        let span = document.createElement('span');
        let key = (i === 2 ? 'er' : (i === 5 ? 'sie' : pronouns[i])); 
        span.innerText = verbData.conj[key];
        cellAnswer.appendChild(span);
      }
    }
    document.getElementById('verbFeedback').innerText = '';
  } else {
    // All verbs done, check level result
    let result = (score / total) >= 0.9;
    if (result) {
      document.getElementById('verbFeedback').innerText = 'Great job! You passed with ' + score + '/' + total + '. Level up!';
      level++;
      updateStatus();
      // Start next level after short pause
      setTimeout(startLevel, 2000);
    } else {
      document.getElementById('verbFeedback').innerText = 'You scored ' + score + '/' + total + '. Try again by pressing Reset.';
      // Disable further checking
      document.getElementById('checkVerb').disabled = true;
    }
  }
}

function checkVerb() {
  let verbData = currentVerbs[verbPos];
  let blanks = Math.min(level, pronouns.length);
  let allCorrect = true;
  for (let i = 0; i < blanks; i++) {
    let input = document.getElementById('verbAns' + i);
    let userVal = input.value.trim().toLowerCase();
    let key = (i === 2 ? 'er' : (i === 5 ? 'sie' : pronouns[i]));
    let correctVal = verbData.conj[key];
    if (userVal === correctVal) {
      input.classList.add('correct');
      input.classList.remove('incorrect');
    } else {
      input.classList.add('incorrect');
      input.classList.remove('correct');
      allCorrect = false;
    }
  }
  total++;
  if (allCorrect) {
    score++;
    document.getElementById('verbFeedback').innerText = 'All correct!';
  } else {
    document.getElementById('verbFeedback').innerText = 'Some forms were incorrect.';
    // Track error for this verb
    let key = verbData.verb;
    errorCounts[key] = (errorCounts[key] || 0) + 1;
    updateErrorLog();
  }
  updateStatus();
  verbPos++;
  // Move to next verb after short delay
  setTimeout(showNextVerb, 1500);
}

function updateErrorLog() {
  let list = document.getElementById('errorList');
  list.innerHTML = '';
  for (let word in errorCounts) {
    let li = document.createElement('li');
    let count = errorCounts[word];
    li.innerText = word + (count > 1 ? ' ×' + count : '');
    list.appendChild(li);
  }
}

function lookupWord() {
  let query = document.getElementById('lookupInput').value.trim().toLowerCase();
  if (!query) return;
  let resultDiv = document.getElementById('lookupResult');
  resultDiv.innerHTML = '';
  // Search nouns (match noun ignoring case)
  let found = allNouns.find(n => n.noun.toLowerCase() === query);
  if (found) {
    let html = '<strong>Noun:</strong> ' + found.article + ' ' + found.noun + ' – ' + found.meaning.join(', ') + '.';
    resultDiv.innerHTML = html;
    return;
  }
  // Search verbs
  let foundV = allVerbs.find(v => v.verb.toLowerCase() === query);
  if (foundV) {
    let html = '<strong>Verb:</strong> ' + foundV.verb + ' – ' + foundV.meaning.join(', ') + '.<br>';
    html += '<strong>Conjugation (Present):</strong><br><ul>';
    for (let i = 0; i < pronouns.length; i++) {
      let key = (i === 2 ? 'er' : (i === 5 ? 'sie' : pronouns[i]));
      html += '<li>' + pronouns[i] + ' ' + foundV.conj[key] + '</li>';
    }
    html += '</ul>';
    resultDiv.innerHTML = html;
    return;
  }
  resultDiv.innerText = 'Word not found.';
}

function resetGame() {
  // Reset everything to initial state
  level = 1;
  score = 0;
  total = 0;
  nounIndex = 0;
  verbIndex = 0;
  nounPos = 0;
  verbPos = 0;
  errorCounts = {};
  updateErrorLog();
  updateStatus();
  // Reshuffle words
  allNouns.sort(() => Math.random() - 0.5);
  allVerbs.sort(() => Math.random() - 0.5);
  document.getElementById('checkVerb').disabled = false;
  startLevel();
}
