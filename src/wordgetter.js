import words_present from "./worddata_present.csv";
import words_indefinido from "./worddata_indefinido.csv";
import words_imperfecto from "./worddata_imperfecto.csv";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const pronomina = ["yo", "tú", "él", "nosotros", "vosotros", "ellos"];
const pronomina_dict = {
    sg1: "yo",
    sg2: "tú", 
    sg3: "él", 
    pl1: "nosotros",
    pl2: "vosotros",
    pl3: "ellos"
}
const pron_sg_third = ["él, ella"];
const pron_pl_third = ["ellos", "ellas"];

const tenseById = ["presente", "indefinido", "imperfecto"];
const tenses = {
    "presente":words_present, 
    "indefinido": words_indefinido, 
    "imperfecto": words_imperfecto
};
const personById = ["sg1", "sg2", "sg3", "pl1", "pl2", "pl3"];

/**
 * 
 * @param  allowedTenses: List of strings of tenses 
 * @param  allowedPersons List of integers! of person (1-6)
 * @returns 
 */
export function getRandomWordConstraint(allowedTenses, allowedPersons) {
    var personNumber = allowedPersons[getRandomInt(allowedPersons.length)];
    var person = personById[personNumber - 1];
    var tense = allowedTenses[getRandomInt(allowedTenses.length)];
    var book = tenses[tense];
    var row = book[getRandomInt(book.length)];
    var solution = row[person];
    
    var pronoun = pronomina_dict[person];
    if (personNumber === 3) {
      pronoun = pron_sg_third[getRandomInt(pron_sg_third.length)];
    } else if (personNumber === 6) {
      pronoun = pron_pl_third[getRandomInt(pron_pl_third.length)];
    }

    return {
      infinite: row["infinitive"],
      //"english": row["english"],
      tense: tense,
      person: pronoun,
      solution: solution,
    };
}