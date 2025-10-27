import { getRandomWord } from "./wordgetter";

const infinitiveEl = document.getElementById("verb_spanish");
const englishEL = document.getElementById("verb_english");
const tenseEl = document.getElementById("tense");
const pronounEl = document.getElementById("pronoun");
const inputEl = document.getElementById("main-text-input");

const incorrectEl = document.getElementById("incorrect_box");
const incorrectAnswerEl = document.getElementById("incorrect_answer");
const incorrectSolutionEl = document.getElementById("incorrect_solution");
const confirmEl = document.getElementById("continue_text");

const currentStreakEl = document.getElementById("val_current_streak");
const maxStreakEl = document.getElementById("val_max_streak");

var currentWord;
var currentStreak = 0; 
var maxStreak = 0;

function showIncorrectBox(answer, solution) {
  incorrectAnswerEl.textContent = answer;
  incorrectSolutionEl.textContent = solution;

  incorrectEl.removeAttribute("hidden");
}

function hideIncorrectBox() {
  incorrectEl.setAttribute("hidden", "true");
  confirmEl.setAttribute("hidden", "true");
}


function nextQuestion() {

  maxStreakEl.textContent = maxStreak;
  currentStreakEl.textContent = currentStreak;

  var nextWord = getRandomWord();
  currentWord = nextWord;
  console.log(nextWord);

  infinitiveEl.textContent = nextWord.infinite;
  englishEL.textContent = "";//nextWord.english;
  tenseEl.textContent = nextWord.tense;
  pronounEl.textContent = nextWord.person;

  inputEl.value = "";
  inputEl.focus();

  // Speichern für spätere Überprüfung
}

var confirming = false;

async function waitForConfirm() {
  confirmEl.removeAttribute("hidden");
  inputEl.disabled = true;

  console.log("waiting ...");
  await waitingKeypress();

  console.log("done");

  hideIncorrectBox()
  inputEl.disabled = false;
  nextQuestion();
}

function waitingKeypress() {
  return new Promise((resolve) => {
    document.addEventListener("keydown", onKeyHandler, false);
    function onKeyHandler(e) {
      if (e.keyCode === 32) {
        document.removeEventListener("keydown", onKeyHandler);
        console.log("continuing");
        resolve();
      }
    }
  });
}

inputEl.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
    e.preventDefault();
    hideIncorrectBox();
    const answer = inputEl.value.trim().toLowerCase();
    
    console.log("Antwort:", answer);
    if(answer === currentWord.solution) {
      console.log("correct");

      currentStreak++;
      if(currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      await waitForConfirm();
    } else {
      console.log("incorrect");

      currentStreak = 0;
      showIncorrectBox(answer, currentWord.solution);
      await waitForConfirm();
    }
  }
});


hideIncorrectBox();
nextQuestion();
