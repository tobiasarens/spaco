import pandas as pd
from pathlib import Path

# list of words that should be imported
WORD_LIST = ["tener", "comer", "ver"]

# list of tenses that should be looked up
# also used as file suffix for the final csv
TENSE_LIST = ["present", "indefinido", "imperfecto"]

COLUMNS = ["infinitive", "sg1", "sg2", "sg3", "pl1", "pl2", "pl3"]

DATABASE = pd.read_csv("src/util/database_complete.csv", header=0, index_col=["infinitive", "mood", "tense"])
DB_TENSE_MAP = {"present": "Presente", "indefinido": "Pretérito", "imperfecto": "Imperfecto"}

print(DATABASE.head())

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
    entry = DATABASE.loc[(verb, "Indicativo", DB_TENSE_MAP[tense])]
    return [verb, entry["form_1s"], entry["form_2s"], entry["form_3s"], entry["form_1p"], entry["form_2p"], entry["form_3p"]]

def fill_dataframe(df: pd.DataFrame, tense, verbs):
    
    for verb in verbs:
        forms = fetch_verb_forms(verb, tense)
        df.loc[forms[0]] = forms[1:]

    return df

def dump_verb_data(df: pd.DataFrame, tense: str):
    filename = get_filename(tense)

    print(f"saving to file {filename}")
    print(df.head())
    df.to_csv(filename, index=True)

if __name__ == "__main__":
    for tense in TENSE_LIST:
        df = read_existing_words(tense)
        df = fill_dataframe(df, tense, WORD_LIST)
        dump_verb_data(df, tense)