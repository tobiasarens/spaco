import pandas as pd
from pathlib import Path
from typing import List
import csv

# base directory in project dir
BASE_DIR = Path("src/data")


WORD_FILE = Path("wordlist.csv")
DATABASE_FILE = Path("database_complete.csv")

# list of tenses that should be looked up
# also used as file suffix for the final csv
# TENSE_LIST = ["present", "indefinido", "imperfecto"]
TENSE_LIST = ["imp_aff"]

COLUMNS = ["infinitive", "sg1", "sg2", "sg3", "pl1", "pl2", "pl3"]

DATABASE = pd.read_csv(Path.joinpath(BASE_DIR, DATABASE_FILE), header=0, index_col=["infinitive", "mood", "tense"])
DB_TENSE_MAP = {
    "present": "Presente", 
    "indefinido": "Pretérito", 
    "imperfecto": "Imperfecto",
    "imp_aff": "Imperativo Afirmativo"    
}


# dict for each tense a list of moods that should be copied in the corresponding folder
# the tense corrpesponds to the folder name
# the mood will be the suffix of the wordlist_xxx.csv file.
DB_COPY_MAP = {
    "Presente": {
        "Indicativo": "indicativo",
        "Imperativo Afirmativo": "imp_aff"
    },
    "Pretérito": {
        "Indicativo": "indicativo"
    },
    "Imperfecto": {
        "Indicativo": "indicativo"
    }
}

def read_word_requests(path: Path) -> List[str]:
    print(f"Trying to load requested words from '{path}'")
    try: 
        with open(path, newline="") as file:
            reader = csv.reader(file)
            rows = list(reader)
            return [verb for _ in rows[1:] for verb in _]
    except FileNotFoundError:
        print(f"file not found")
        pass
    return []

def get_filename(tense: str, mood: str) -> Path:
    return Path(f"{BASE_DIR}/{tense}/worddata_{DB_COPY_MAP[tense][mood]}.csv")

def read_existing_words(tense: str, mood: str) -> pd.DataFrame:
    file = get_filename(tense, mood)
    df = pd.DataFrame(columns=COLUMNS[1:])
    df.index.name = "infinitive"
    if file.exists():
        df = pd.read_csv(file, header=0, index_col="infinitive")
        print("file loaded")
    else:
        print("No file existing")
    return df

def fetch_verb_forms(verb, tense, mood):
    try:
        entry = DATABASE.loc[(verb, mood, tense)]
    except KeyError:
        print(f"combination {mood} / {tense} not found in DB for verb {verb}")
        return None
    return [verb, entry["form_1s"], entry["form_2s"], entry["form_3s"], entry["form_1p"], entry["form_2p"], entry["form_3p"]]

def fill_dataframe(df: pd.DataFrame, tense, mood, verbs):
    
    for verb in verbs:
        forms = fetch_verb_forms(verb, tense, mood)
        if forms != None:
            df.loc[forms[0]] = forms[1:]

    return df

def dump_verb_data(df: pd.DataFrame, tense: str, mood: str):
    filename = get_filename(tense, mood)
    print(f"saving to file {filename}")
    Path.mkdir(filename.parent, parents=True, exist_ok=True)
    df.to_csv(filename, index=True)

def update_and_safe_words(tense: str, mood: str, request: List[str]):
    print(f" --- Updating: {tense} - {mood} --- ")
    df = read_existing_words(tense, mood)
    df = fill_dataframe(df, tense, mood, request)
    dump_verb_data(df, tense, mood)
    print(f"--- done --- \n")

if __name__ == "__main__":
    request = read_word_requests(BASE_DIR.joinpath(WORD_FILE))
    print(request)
    for tense, moods in DB_COPY_MAP.items():
        for mood, fn in moods.items():
            update_and_safe_words(tense, mood, request)
