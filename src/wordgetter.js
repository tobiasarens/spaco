import Papa from "papaparse";

import words_present from "./worddata_present.csv";
import words_indefinido from "./worddata_indefinido.csv";
import words_imperfecto from "./worddata_imperfecto.csv";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const pronomina = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"];
const pron_sg_third = ["el, la"];
const pron_pl_third = ["ellos", "ellas"];

const tenseById = ["present", "indefinido", "imperfecto"];
const tenses = {
    "present":words_present, 
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