import words_present from "./data/Presente/worddata_indicativo.csv";
import words_pres_imp_aff from "./data/Presente/worddata_imp_aff.csv";
import words_pres_imp_neg from "./data/Presente/worddata_imp_neg.csv";
import words_indefinido from "./data/Pretérito/worddata_indefinido.csv";
import words_imperfecto from "./data/Imperfecto/worddata_indicativo.csv";
import words_futuro from "./data/Futuro/worddata_indicativo.csv";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomFromList(list) {
  return list[getRandomInt(list.length)];
}

let enabledForms = []
let enabledPersons = [];

// first item is a placeholder such that sg1 = person 1 and pl3 = person 6
// not starting at 0
const personById = ["", "sg1", "sg2", "sg3", "pl1", "pl2", "pl3"];

const pronomina_dict = {
    sg1: "yo",
    sg2: "tú", 
    sg3: "él", 
    pl1: "nosotros",
    pl2: "vosotros",
    pl3: "ellos"
}
const pron_sg_third = ["él", "ella"];
const pron_pl_third = ["ellos", "ellas"];
function getPronoun(id) {
  if(id == 3) {
    return getRandomFromList(pron_sg_third);
  } 
  if(id == 6) {
    return getRandomFromList(pron_pl_third);
  }
  return pronomina_dict[personById[id]];
}

const forms = {
  pres_ind: makeForm(words_present, "Indicativo", "Presente", "Presente"),
  pres_imp_aff: makeForm(
    words_pres_imp_aff,
    "Imperative Affirmative",
    "Presente",
    "Imperativo Affirmativo",
    [2, 3, 5, 6]
  ),
  pres_imp_neg: makeForm(
    words_pres_imp_neg,
    "Imperative neg",
    "Presente",
    "Imperativo negativo",
    [2, 3, 5, 6]
  ),
  indef_ind: makeForm(
    words_indefinido,
    "Indicativo",
    "Preterito",
    "Indefinido"
  ),
  imp_ind: makeForm(words_imperfecto, "Indicativo", "Imperfecto"),
  futuro: makeForm(words_futuro, "Indicativo", "Futuro", "Futuro")
};

function makeForm(words, mood, tense, display_name=null, pronoun_overwrite=null) {
  let persons = (pronoun_overwrite != null) ? pronoun_overwrite : [1, 2, 3, 4, 5, 6];
  let display = (display_name != null) ? display_name : mood + " " + tense;
  return {
    "words": words,
    "mood": mood,
    "tense": tense,
    "display_name": display,
    "persons": persons
  }
}

export function updateConstraints(options) {
  enabledPersons = [];
  enabledForms = [];
  if (options.sg1) enabledPersons.push(1);
  if (options.sg2) enabledPersons.push(2);
  if (options.sg3) enabledPersons.push(3);
  if (options.pl1) enabledPersons.push(4);
  if (options.pl2) enabledPersons.push(5);
  if (options.pl3) enabledPersons.push(6);

  if (options.presente) enabledForms.push("pres_ind");
  if (options.indefinido) enabledForms.push("indef_ind");
  if (options.imperfecto) enabledForms.push("imp_ind");
  if (options.pres_imp_aff) enabledForms.push("pres_imp_aff");
  if (options.pres_imp_neg) enabledForms.push("pres_imp_neg");
  if (options.futuro) enabledForms.push("futuro");

  console.log("updated random constraints");
  //console.log("allowed forms: " + enabledForms);
  //console.log("allowed persons: " + enabledPersons);
}

export function getRandomWord() {
  let chosenForm = getRandomFromList(enabledForms);
  let formData = forms[chosenForm];
  let persons = enabledPersons.filter(val => formData.persons.includes(val));
  let chosenPerson = getRandomFromList(persons);

  let chosenWordRow = getRandomFromList(formData.words);
  let chosenWordInfinitive = chosenWordRow["infinitive"];
  let chosenWordSolution = chosenWordRow[personById[chosenPerson]];

  return {
    infinitive: chosenWordInfinitive,
    solution: chosenWordSolution,
    mood: formData.mood,
    tense: formData.tense,
    display_name: formData.display_name,
    pronoun: getPronoun(chosenPerson)
  }
}