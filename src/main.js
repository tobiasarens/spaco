const verbs = ["hablar", "comer", "vivir"];
const tenses = ["presente", "pretérito", "futuro"];
const persons = ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos"];

const infinitiveEl = document.getElementById("infinitive");
const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("answer");

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nextQuestion() {
  const verb = randomItem(verbs);
  const tense = randomItem(tenses);
  const person = randomItem(persons);

  infinitiveEl.textContent = verb;
  promptEl.textContent = `${person} (${tense})`;
  inputEl.value = "";
  inputEl.focus();

  // Speichern für spätere Überprüfung
  inputEl.dataset.verb = verb;
  inputEl.dataset.tense = tense;
  inputEl.dataset.person = person;
}

inputEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const answer = inputEl.value.trim().toLowerCase();
    // TODO: Konjugation prüfen
    console.log("Antwort:", answer);
    nextQuestion();
  }
});

nextQuestion();
