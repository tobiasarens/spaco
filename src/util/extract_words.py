import pandas as pd

# list of words that should be imported
WORD_LIST = ["tener", "comer", "ver"]

# list of tenses that should be looked up
# also used as file suffix for the final csv
TENSE_LIST = ["present", "indefinido", "imperfecto"]

def get_filename(tense: str) -> str:
    return f"../worddata_{tense}.csv"

def read_existing_words(tense) -> pd.DataFrame:
    pass

def get_verb_forms(verb, tense):
    pass

def dump_verb_data(df: pd.DataFrame):
    pass