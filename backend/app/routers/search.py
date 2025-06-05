from fastapi import APIRouter, HTTPException
from typing import List, Dict, Union, Optional, Literal

from pydantic import BaseModel


from app.services.search import search_kanji as service_search_kanji
from app.services.search import search_general as service_search_general

router = APIRouter()

class ExampleSentencesModel(BaseModel):
    word: str
    reading: str
    meaning: str

class SentenceModel(BaseModel):
    japanese: str
    reading: str
    english: str

class SimilarKanjiModel(BaseModel):
    kanji: str
    shared_reading: str
    all_on_yomi: List[str]
    all_kun_yomi: List[str]
    meanings: List[str]

class KanjiInfoResponse(BaseModel):
    kanji: str
    meanings: List[str]
    onYomi: List[str]
    kunYomi: List[str]
    strokeCount: int
    jlptLevel: str
    frequency: int
    examples: List[ExampleSentencesModel]
    sentences: List[SentenceModel] 
    similar: List[SimilarKanjiModel] 

class GeneralSearchQuery(BaseModel):
    query: str

class FrontendExampleSentenceModel(BaseModel): 
    japanese: str
    english: str
    reading: Optional[str] = ""

class SenseModel(BaseModel):
    glosses: List[str]
    pos: List[str] 
    misc: List[str] 
    field: List[str] 
    dialect: List[str] 
    examples: List[FrontendExampleSentenceModel]

class WordResultData(BaseModel):
    idseq: Optional[str] = None
    kanji_forms: List[str]
    kana_forms: List[str]
    senses: List[SenseModel]

class WordResultItem(BaseModel):
    type: Literal["word"]
    data: WordResultData

class KanjiResultItem(BaseModel):
    type: Literal["kanji_detail"]
    data: KanjiInfoResponse 

GeneralSearchResultItem = Union[WordResultItem, KanjiResultItem]

class GeneralSearchResponse(BaseModel):
    results: List[GeneralSearchResultItem]


@router.get("/search/kanji/{term}", response_model=Optional[KanjiInfoResponse])
async def get_kanji_info(term: str):
    """
    Search for Kanji information by a single Kanji character.
    """
    if not term or len(term) != 1:
        raise HTTPException(status_code=400, detail="Please provide a single Kanji character.")
    
    kanji_data = service_search_kanji(term)
    
    if kanji_data is None:
        raise HTTPException(status_code=404, detail=f"Kanji '{term}' not found.")
    
    return KanjiInfoResponse(**kanji_data)

@router.post("/search/general", response_model=GeneralSearchResponse)
async def post_general_search(query_body: GeneralSearchQuery):
    """
    Performs a general search for words, kanji, kana, or English terms.
    Returns a list of results, which can be word entries or detailed Kanji info.
    """
    if not query_body.query or not query_body.query.strip():
        return GeneralSearchResponse(results=[])
        
    search_results_data = service_search_general(query_body.query.strip())
    
    return search_results_data

