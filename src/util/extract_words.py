import pandas as pd
from pathlib import Path
from typing import List
import csv

# list of words that should be imported
WORD_LIST = ["tener", "comer", "ver"]

# list of tenses that should be looked up
# also used as file suffix for the final csv
TENSE_LIST = ["present", "indefinido", "imperfecto"]

COLUMNS = ["infinitive", "sg1", "sg2", "sg3", "pl1", "pl2", "pl3"]

DATABASE = pd.read_csv("src/util/database_complete.csv", header=0, index_col=["infinitive", "mood", "tense"])
DB_TENSE_MAP = {"present": "Presente", "indefinido": "Pretérito", "imperfecto": "Imperfecto"}


def read_word_requests(path: str) -> List[str]:
    try: 
        with open(path, newline="") as file:
            reader = csv.reader(file)
            rows = list(reader)
            return [verb for _ in rows[1:] for verb in _]
    except FileNotFoundError:
        pass
    return []

def get_filename(tense: str) -> Path:
    return Path(f"src/worddata_{tense}.csv")

def read_existing_words(tense) -> pd.DataFrame:
    file = get_filename(tense)
    df = pd.DataFrame(columns=COLUMNS[1:])
    df.index.name = "infinitive"
    if file.exists():
        df = pd.read_csv(file, header=0, index_col="infinitive")
        print("file loaded")
    else:
        print("No file existing")
    return df

def fetch_verb_forms(verb, tense):
    if tense not in DB_TENSE_MAP.keys():
        return None
    try:
        entry = DATABASE.loc[(verb, "Indicativo", DB_TENSE_MAP[tense])]
    except KeyError:
        return None
    return [verb, entry["form_1s"], entry["form_2s"], entry["form_3s"], entry["form_1p"], entry["form_2p"], entry["form_3p"]]

def fill_dataframe(df: pd.DataFrame, tense, verbs):
    
    for verb in verbs:
        forms = fetch_verb_forms(verb, tense)
        if forms != None:
            df.loc[forms[0]] = forms[1:]

    return df

def dump_verb_data(df: pd.DataFrame, tense: str):
    filename = get_filename(tense)

    print(f"saving to file {filename}")
    df.to_csv(filename, index=True)

if __name__ == "__main__":
    request = read_word_requests("src/wordlist.csv")
    for tense in TENSE_LIST:
        df = read_existing_words(tense)
        df = fill_dataframe(df, tense, request)
        dump_verb_data(df, tense)