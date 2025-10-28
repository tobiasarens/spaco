import { getRandomWord, getRandomWordConstraint } from "./wordgetter";

const infinitiveEl = document.getElementById("verb_spanish");
const englishEL = document.getElementById("verb_english");
const tenseEl = document.getElementById("tense");
const pronounEl = document.getElementById("pronoun");
const inputEl = document.getElementById("main-text-input");

const correctnessBoxEl = document.getElementById("incorrect_box");
const incorrectAnswerEl = document.getElementById("incorrect_answer");
const incorrectSolutionEl = document.getElementById("incorrect_solution");
const sol_correctEl = document.getElementById("solution_correct");
const correctAnswerEl = document.getElementById("correct_answer");
const sol_incorrectEl = document.getElementById("solution_incorrect");
const confirmEl = document.getElementById("continue_text");

const currentStreakEl = document.getElementById("val_current_streak");
const maxStreakEl = document.getElementById("val_max_streak");

var currentWord;
var currentStreak = 0; 
var maxStreak = 0;

var options = {
  presente: true,
  indefinido: true,
  imperfecto: true,
  sg1: true,
  sg2: true,
  sg3: true,
  pl1: true,
  pl2: true,
  pl3: true,
};

function showCorrectBox(isCorrect, answer, solution) {
  var toShowEl = isCorrect ? sol_correctEl : sol_incorrectEl;
  var solutionEl = isCorrect ? correctAnswerEl : incorrectSolutionEl;

  toShowEl.removeAttribute("hidden");

  incorrectAnswerEl.textContent = answer;
  solutionEl.textContent = solution;

  correctnessBoxEl.removeAttribute("hidden");
}

function hideIncorrectBox() {
  correctnessBoxEl.setAttribute("hidden", "true");
  sol_correctEl.setAttribute("hidden", "true");
  sol_incorrectEl.setAttribute("hidden", "true");
  confirmEl.setAttribute("hidden", "true");
}

function nextQuestion() {

  maxStreakEl.textContent = maxStreak;
  currentStreakEl.textContent = currentStreak;

  var nextWord = getRandomWordConstraint(getAllowedTenses(options), getAllowedPersons(options));
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
  await waitingKeypress();


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
        resolve();
      }
    }
  });
}

function checkAnswer(answer) {

  var sol = currentWord.solution;
  sol = sol.replaceAll("ó", "oo");
  sol = sol.replaceAll("á", "aa");
  sol = sol.replaceAll("í", "ii");
  sol = sol.replaceAll("é", "ee");
  sol = sol.replaceAll("ú", "uu");

  return answer === currentWord.solution || answer === sol;
}

inputEl.addEventListener("keydown", async e => {
  
  const answer = inputEl.value.trim().toLowerCase();

  if (answer !== "" && e.key === "Enter") {
    e.preventDefault();
    hideIncorrectBox();
    
    console.log("Antwort:", answer);
    if(checkAnswer(answer)) {
      console.log("correct");

      currentStreak++;
      if(currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }

      showCorrectBox(true, answer, currentWord.solution);

      await waitForConfirm();
    } else {
      console.log("incorrect");

      currentStreak = 0;
      showCorrectBox(false, answer, currentWord.solution);
      await waitForConfirm();
    }
  }
});

const mainViewEl = document.getElementById("main_content_view");
const optionsViewEl = document.getElementById("options_content_view");

const btnOptions = document.getElementById("btnOption");
const btnCancel = document.getElementById("btnCancel");
const btnSave = document.getElementById("btnSave");

function showOptions() {
  mainViewEl.setAttribute("hidden", "true");
  optionsViewEl.removeAttribute("hidden");
}

function saveOptions() {
  options.presente = document.getElementById("ckPresente").checked;
  options.indefinido = document.getElementById("ckIndefinido").checked;
  options.imperfecto = document.getElementById("ckImperfecto").checked;
  options.sg1 = document.getElementById("ckSg1").checked;
  options.sg2 = document.getElementById("ckSg2").checked;
  options.sg3 = document.getElementById("ckSg3").checked;
  options.pl1 = document.getElementById("ckPl1").checked;
  options.pl2 = document.getElementById("ckPl2").checked;
  options.pl3 = document.getElementById("ckPl3").checked;

  console.log("new options: ", options);
}

function hideOptions() {
  optionsViewEl.setAttribute("hidden", "true");
  mainViewEl.removeAttribute("hidden");
}

function saveAndHideOptions() {
  saveOptions();
  hideOptions();
  nextQuestion();
}

btnOptions.addEventListener("click", () => showOptions());
btnCancel.addEventListener("click", () => hideOptions());
btnSave.addEventListener("click", () => saveAndHideOptions());


function getAllowedPersons(options) {
  var allowed = [];
  if (options.sg1) allowed.push("sg1");
  if (options.sg2) allowed.push("sg2");
  if (options.sg3) allowed.push("sg3");
  if (options.pl1) allowed.push("pl1");
  if (options.pl2) allowed.push("pl2");
  if (options.pl3) allowed.push("pl3");

  return allowed.length > 0 ? allowed : ["sg1"];
}

function getAllowedTenses(options) {
  var allowed = [];
  if (options.presente)   allowed.push("presente");
  if (options.indefinido) allowed.push("indefinido");
  if (options.imperfecto) allowed.push("imperfecto");

  return allowed.length > 0 ? allowed : ["presente"];
}

hideOptions();
hideIncorrectBox();
nextQuestion();

// debug tmp
showOptions();
