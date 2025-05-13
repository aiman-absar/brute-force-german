let nounsData = [], verbsData = [];

async function loadData() {
  const nounRes = await fetch('nouns.json');
  const verbRes = await fetch('verbs.json');
  nounsData = await nounRes.json();
  verbsData = await verbRes.json();
}

function lookupNoun() {
  let query = document.getElementById('noun-input').value.trim().toLowerCase();
  let resultDiv = document.getElementById('noun-result');
  if (!query) return resultDiv.innerHTML = '';
  let entry = nounsData.find(n => n.noun.toLowerCase() === query);
  resultDiv.innerHTML = entry ? 
    `<p>${entry.article} ${entry.noun} – ${entry.meaning}</p><p><em>${entry.example_de}</em><br><small>${entry.example_en}</small></p>` 
    : 'Noun not found.';
}

function lookupVerb() {
  let query = document.getElementById('verb-input').value.trim().toLowerCase();
  let resultDiv = document.getElementById('verb-result');
  if (!query) return resultDiv.innerHTML = '';
  let entry = verbsData.find(v => v.infinitive.toLowerCase() === query);
  if (!entry) return resultDiv.textContent = 'Verb not found.';
  let html = `<h3>${entry.infinitive} (${entry.meaning})</h3><table><tr><th>Pronoun</th><th>Conjugation</th></tr>`;
  for (let p in entry.conjugation) {
    html += `<tr><td>${p}</td><td>${entry.conjugation[p]}</td></tr>`;
  }
  html += '</table>';
  for (let p in entry.examples) {
    html += `<p><strong>${p}:</strong> ${entry.examples[p].de} <br><em>${entry.examples[p].en}</em></p>`;
  }
  resultDiv.innerHTML = html;
}

window.onload = () => {
  loadData();
  document.getElementById('noun-input').addEventListener('input', lookupNoun);
  document.getElementById('verb-input').addEventListener('input', lookupVerb);
};