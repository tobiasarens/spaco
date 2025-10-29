import Papa from "papaparse";

import words_present from "./worddata_present.csv";
import words_indefinido from "./worddata_indefinido.csv";
import words_imperfecto from "./worddata_imperfecto.csv";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const pronomina = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"];
const pronomina_dict = {
    sg1: "yo",
    sg2: "tu", 
    sg3: "el", 
    pl1: "nosotros",
    pl2: "vosotros",
    pl3: "ellos"
}
const pron_sg_third = ["el, la"];
const pron_pl_third = ["ellos", "ellas"];

const tenseById = ["presente", "indefinido", "imperfecto"];
const tenses = {
    "presente":words_present, 
    "indefinido": words_indefinido, 
    "imperfecto": words_imperfecto
};
const personById = ["sg1", "sg2", "sg3", "pl1", "pl2", "pl3"];

console.log(words_present);

export function getRandomWord() {
    var person = getRandomInt(6);
    var tense = tenseById[getRandomInt(tenseById.length)];
    var book = tenses[tense];
    var row = book[getRandomInt(book.length)];
    var solution = row[personById[person]];
    var pronoun = pronomina[person];

    return {
        "infinite": row["infinitive"],
        //"english": row["english"],
        "tense": tense,
        "person": pronoun,
        "solution": solution
    };
}

/**
 * 
 * @param  allowedTenses: List of strings of tenses 
 * @param  allowedPersons List of integers! of person (1-6)
 * @returns 
 */
export function getRandomWordConstraint(allowedTenses, allowedPersons) {
    var personNumber = allowedPersons[getRandomInt(allowedPersons.length)];
    var person = personById[personNumber];
    if (personNumber === 3) {
        person = pron_sg_third[getRandomInt(pron_sg_third.length)];
    } else if (personNumber === 6) {
        person = pron_pl_third[getRandomInt(pron_pl_third.length)];
    }
    var tense = allowedTenses[getRandomInt(allowedTenses.length)];
    var book = tenses[tense];
    var row = book[getRandomInt(book.length)];
    var solution = row[person];
    var pronoun = pronomina_dict[person];

    return {
      infinite: row["infinitive"],
      //"english": row["english"],
      tense: tense,
      person: pronoun,
      solution: solution,
    };
}