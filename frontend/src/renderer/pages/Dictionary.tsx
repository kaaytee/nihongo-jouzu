import { useParams } from "react-router-dom";
import { ThemedBox } from "../components/ThemedBox";
import { Box, Button, Typography, ButtonGroup, CircularProgress } from "@mui/material";

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { DictionarySearchBar } from "../components/DictionarySearchBar";
import { useEffect, useState } from "react";

import { GroupedLabels } from "../components/GroupedLabels";
import { SpeakerFavGroup } from "../components/SpeakerFavGroup";
import { DictionaryOptionButton } from "../components/DictionaryOptionButton";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ExampleWord {
  word: string;
  reading: string;
  meaning: string;
}

interface ExampleSentence {
  japanese: string;
  english: string;
  reading?: string;
}

interface SimilarKanji {
  kanji: string;
  shared_reading: string;
  all_on_yomi: string[];
  all_kun_yomi: string[];
  meanings: string[];
}

interface KanjiDetailData {
  kanji: string;
  meanings: string[];
  onYomi: string[];
  kunYomi: string[];
  strokeCount: number;
  jlptLevel: string;
  frequency?: number;
  examples: ExampleWord[];
  sentences: ExampleSentence[];
  similar: SimilarKanji[];
}

interface FrontendExampleSentence {
  japanese: string;
  english: string;
  reading?: string;
}

interface Sense {
  glosses: string[];
  pos: string[];
  misc: string[];
  field: string[];
  dialect: string[];
  examples: FrontendExampleSentence[];
}

interface WordData {
  idseq?: string;
  kanji_forms: string[];
  kana_forms: string[];
  senses: Sense[];
}

interface WordResult {
  type: "word";
  data: WordData;
}

interface KanjiResult {
  type: "kanji_detail";
  data: KanjiDetailData;
}

type GeneralSearchResult = WordResult | KanjiResult;

interface GeneralSearchApiResponse {
  results: GeneralSearchResult[];
}

type ViewMode = 'list' | 'detail';

const KanjiSummaryComponent = ({ kanjiDetail, showViewDetailsButton = false, onViewDetails }: { kanjiDetail: KanjiDetailData, showViewDetailsButton?: boolean, onViewDetails?: () => void }) => {
  if (!kanjiDetail) return null;
  return (
    <Box sx={{width: "100%"}}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", width: "100%", gap: { xs: "10px", md: "10px" }, mb: 2 }}>
        <Box sx={{ display:"flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", width: "100%", gap: { xs: "5px", md: "20px" }, textAlign: {xs: "center", sm: "left"} }}>
          <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" }, color: "white", fontWeight: "bold" }}>
            {kanjiDetail.kanji}
          </Typography>
          <Box>
            <Typography sx={{ fontSize: { xs: "1.2rem", md: "2rem" }, color: "white", fontWeight: "bold", textAlign: {xs: "center", sm: "left"} }}>
              {kanjiDetail.meanings[0]}
            </Typography>
            <GroupedLabels labels={kanjiDetail.meanings} />
          </Box>
        </Box>
        <SpeakerFavGroup sx={{ alignSelf: {xs: "center", sm: "flex-start"} }} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: "10px", sm: "20px" }, width: "100%" }}>
        <Box sx={{flex: 1, textAlign: {xs: "center", sm: "left"}}}>
          <Typography variant="h6" sx={{color: "white", fontWeight: "bold"}}>Kun'yomi</Typography>
          <Typography sx={{color: "white"}}>{kanjiDetail.kunYomi.join(', ')}</Typography>
        </Box>
        <Box sx={{flex: 1, textAlign: {xs: "center", sm: "left"}}}>
          <Typography variant="h6" sx={{color: "white", fontWeight: "bold"}}>On'yomi</Typography>
          <Typography sx={{color: "white"}}>{kanjiDetail.onYomi.join(', ')}</Typography>
        </Box>
      </Box>
      {showViewDetailsButton && onViewDetails && (
        <Button 
          fullWidth 
          variant="outlined"
          sx={{mt: 2, color: "white", borderColor: "rgba(255,255,255,0.3)", '&:hover': {borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)"}}}
          onClick={onViewDetails}
        >
          View Full Details
        </Button>
      )}
    </Box>
  );
};

export function Dictionary() {
  const { phrase } = useParams();
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [option, setOption] = useState<string>("Words");

  const [searchResults, setSearchResults] = useState<GeneralSearchResult[] | null>(null);
  const [activeKanjiDetail, setActiveKanjiDetail] = useState<KanjiDetailData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (phrase) {
      setSearch(phrase);
    }
  }, [phrase]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setActiveKanjiDetail(null);
      setError(null);
      setViewMode('list');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setActiveKanjiDetail(null);

    if (!searchHistory.includes(searchTerm)) {
      setSearchHistory(prevHistory => [...prevHistory, searchTerm].slice(-5));
    }

    try {
      const response = await fetch(`http://localhost:8000/api/search/general`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detail = errorData?.detail || `HTTP error! status: ${response.status}`;
        throw new Error(detail);
      }
      const data: GeneralSearchApiResponse = await response.json();
      setSearchResults(data.results);

      const firstKanjiDetailResult = data.results?.find(r => r.type === 'kanji_detail') as KanjiResult | undefined;
      
      if (data.results && data.results.length === 1 && firstKanjiDetailResult) {
        setActiveKanjiDetail(firstKanjiDetailResult.data);
        setViewMode('detail');
      } else if (firstKanjiDetailResult) {
        setActiveKanjiDetail(firstKanjiDetailResult.data); 
        setViewMode('list');
      } else {
        setActiveKanjiDetail(null);
        setViewMode('list');
      }
      
      if (data.results === null || data.results.length === 0) {
        setViewMode('list');
        setActiveKanjiDetail(null);
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setSearchResults(null);
      setActiveKanjiDetail(null);
      setViewMode('list');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (search) {
      performSearch(search);
    } else {
      setSearchResults(null);
      setActiveKanjiDetail(null);
      setError(null);
      setIsLoading(false);
      setViewMode('list');
    }
  }, [search]);

  const doSearch = (str: string) => {
    setSearch(str);
  }

  const handleViewDetails = (kanjiData: KanjiDetailData) => {
    setActiveKanjiDetail(kanjiData);
    setViewMode('detail');
  };

  return (
    <>
      <Box sx={{ display: "flex", gap:"30px", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: "100%", height: "100%", padding: { xs: "10px", md: "0px" }, boxSizing: "border-box" }}>
        <ThemedBox sx={{ height: { xs: "auto", md: "auto" }, minHeight: { xs: "150px", md: "180px"}, padding: { xs: "10px", md: "17px" }, alignItems: "flex-start", justifyContent: "space-between", width: "100%", flexShrink: 0 }}>
          <Box sx={{display: "flex", flexDirection: "row", alignItems: "center",  width: "100%"}}>
            <AutoStoriesIcon sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, color: "white", marginRight: "10px" }} />
            <Typography sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", md: "2rem" }, color: "white" }}>Search Dictionary</Typography>
          </Box>
          <Typography sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, mb: "5px", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold" }}>Search for words, kanji, phrases and meanings.</Typography>
          <DictionarySearchBar doSearch={doSearch} search={search} />
          {searchHistory.length > 0 && (
            <Box sx={{ marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: { xs: "5px", md: "10px" }, flexWrap: 'wrap' }}>
              {searchHistory.map((historyItem) => (
                <Button key={historyItem} sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" }, color: "white", alignSelf: "center", fontWeight: "bold", backgroundColor: "#27272A", borderRadius: "50px", whiteSpace: 'normal', wordBreak: 'break-word', padding: "5px 10px", '&:hover': { backgroundColor: "#3F3F46" } }} onClick={() => setSearch(historyItem)}>
                  {historyItem}
                </Button>
              ))}
            </Box>
          )}         
        </ThemedBox>
        
        <Box sx={{
          display: "flex", 
          gap:"20px", 
          flexDirection: "column", 
          alignItems: "center", 
          flex: 1, 
          width:"100%", 
          minHeight: 0, 
          overflowY: "auto", 
          paddingBottom: "20px",
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1c1c1e',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#555',
            borderRadius: '4px',
            border: '2px solid #1c1c1e',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#777',
          }
        }}>
          {isLoading && <CircularProgress sx={{color: "white", mt: 3}} />}
          {error && !isLoading && (
            <ThemedBox sx={{p: 2, width: "100%", mt:2, display:"flex", justifyContent:"center"}}>
              <Typography sx={{fontSize: "1rem", color: "error.main", width: "100%", textAlign: "center", fontWeight: "bold"}}>{error}</Typography>
            </ThemedBox>
          )}

          {!isLoading && !error && (
            <>
              {viewMode === 'list' && (
                <>
                  {!searchResults && search && (
                    <ThemedBox sx={{p: 2, width: "100%", mt:2, display:"flex", justifyContent:"center"}}>
                      <Typography sx={{fontSize: "1rem", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold", textAlign: "center"}}>No results found for "{search}".</Typography>
                    </ThemedBox>
                  )}
                  {!searchResults && !search && (
                    <ThemedBox sx={{p: 2, width: "100%", mt:2, display:"flex", justifyContent:"center"}}>
                      <Typography sx={{fontSize: "1rem", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold", textAlign: "center"}}>Enter a search term (Kanji, Kana, Romaji, or English) to see results.</Typography>
                    </ThemedBox>
                  )}
                   {searchResults && searchResults.length === 0 && search && (
                     <ThemedBox sx={{p: 2, width: "100%", mt:2, display:"flex", justifyContent:"center"}}>
                         <Typography sx={{fontSize: "1rem", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold", textAlign: "center"}}>No results found for "{search}". Try a different search term.</Typography>
                       </ThemedBox>
                  )}
                  {searchResults && searchResults.length > 0 && (
                    <Box sx={{width: "100%", display: "flex", flexDirection: "column", gap: "20px"}}>
                      {searchResults.map((result, index) => (
                        <ThemedBox key={index} sx={{ padding: { xs: "10px", md: "17px" }, alignItems: "flex-start", justifyContent: "flex-start", gap: "10px", flexDirection: "column", minHeight: { xs: "70px", md: "90px" }, flexShrink: 0 }}>
                          {result.type === "kanji_detail" && (
                             <KanjiSummaryComponent kanjiDetail={result.data} showViewDetailsButton={true} onViewDetails={() => handleViewDetails(result.data)} />
                          )}
                          {result.type === "word" && (
                            <Box sx={{width: "100%"}}>
                              <Box sx={{display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", mb: 1}}>
                                <Typography variant="h5" sx={{color: "white", fontWeight: "bold"}}>{result.data.kanji_forms.join('、')}</Typography>
                                {result.data.kanji_forms.length > 0 && result.data.kana_forms.length > 0 && (<Typography sx={{color: "lightgrey", fontSize: "1.3rem"}}> | </Typography>)}
                                <Typography sx={{color: "lightgrey", fontSize: "1.3rem"}}>{result.data.kana_forms.join('、')}</Typography>
                              </Box>
                              {result.data.senses.map((sense, sIndex) => (
                                <Box key={sIndex} sx={{mb: 1.5, pl: 0 }}>
                                  <Typography sx={{color: "grey", fontWeight: "medium"}}>{sIndex + 1}. {sense.glosses.join('; ')}
                                    {sense.pos.length > 0 && <Typography component="span" sx={{fontStyle: "italic", color: "darkgrey", ml: 0.5}}> ({sense.pos.join(', ')})</Typography>}
                                  </Typography>
                                  {sense.misc.length > 0 && <Typography sx={{fontSize: "0.8rem", color: "grey", fontStyle: "italic", ml: 2}}>{sense.misc.join(', ')}</Typography>}
                                  {sense.examples && sense.examples.length > 0 && (
                                    <Box sx={{ml:2, mt:0.5}}>
                                      {sense.examples.map((ex, exIdx) => (
                                        <Box key={exIdx} sx={{mb: 0.5}}>
                                          <Typography sx={{fontSize: "0.9rem", color: "lightcyan"}}>{ex.japanese} {ex.reading && `(${ex.reading})`}</Typography>
                                          <Typography sx={{fontSize: "0.85rem", color: "silver", ml: 1}}>{ex.english}</Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </ThemedBox>
                      ))}
                    </Box>
                  )}
                </>
              )}

              {viewMode === 'detail' && activeKanjiDetail && (
                <ThemedBox sx={{ width: "100%", p: {xs: "10px", md: "20px"}, display: "flex", flexDirection: "column", gap: "20px" }}>
                  <Button startIcon={<ArrowBackIcon />} onClick={() => setViewMode('list')} sx={{ alignSelf: "flex-start", color: "white", borderColor: "rgba(255,255,255,0.7)", '&:hover': {borderColor: "white"} }} variant="outlined">
                    Back to Search Results
                  </Button>
                  <ThemedBox sx={{ padding: { xs: "10px", md: "17px" }, alignItems: "flex-start", justifyContent: "flex-start", gap: "10px", flexDirection: "column", minHeight: { xs: "70px", md: "90px" }, flexShrink: 0 }}>
                    <KanjiSummaryComponent kanjiDetail={activeKanjiDetail} />
                  </ThemedBox>
                  
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ backgroundColor: "", height: {xs: "auto", md: "auto"}, width: "100%", borderRadius: "20px", flexShrink: 0 }}>
                      <ButtonGroup fullWidth sx={{ boxSizing: "border-box", padding: "9px", backgroundColor: '#27272A', borderRadius: "10px", flexDirection: { xs: "column", sm: "row" }, '& .MuiButton-root': { border: " none", borderRadius: '0', color: "white", flexBasis: {xs: "100%", sm: "auto"} }, '& .MuiButton-root:not(:last-child)': { borderBottom: { xs: "1px solid #3F3F46", sm: "none" }, borderRight: { xs: "none", sm: "1px solid #3F3F46"} }, '& .MuiButton-root:last-child': { borderBottom: 'none', borderRight: 'none' } }}>
                        <DictionaryOptionButton option={option} setOption={setOption} label="Words" />
                        <DictionaryOptionButton option={option} setOption={setOption} label="Sentences" />
                        <DictionaryOptionButton option={option} setOption={setOption} label="Related Kanji" />
                      </ButtonGroup>
                    </Box>

                    <Box sx={{ opacity: "1", flex: 1, width: "100%", borderRadius: "10px", padding: { xs: "5px", md: "10px" }, boxSizing: "border-box", overflowY: "auto", minHeight: "200px", maxHeight: {xs: "300px", md: "400px"}, mt: 1 }}>
                      {option === "Words" && activeKanjiDetail?.examples && activeKanjiDetail.examples.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: "10px", md: "20px" }, justifyContent: "flex-start" }}>
                          {activeKanjiDetail.examples.map((example, index) => (
                            <ThemedBox key={index} sx={{ padding: { xs: "10px", md: "17px" }, alignItems: "flex-start", justifyContent: "flex-start", gap: "5px",  flexBasis: { xs: "calc(100% - 20px)", sm: "calc(50% - 20px)", md: "calc(33.33% - 20px)" }, flexShrink: 0 }}>
                              <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, color: "white", fontWeight: "bold" }}>{example.word}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "lightgrey" }}>{example.reading}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "grey" }}>{example.meaning}</Typography>
                            </ThemedBox>
                          ))}
                        </Box>
                      )}
                      {option === "Sentences" && activeKanjiDetail?.sentences && activeKanjiDetail.sentences.length > 0 && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "10px", md: "15px" } }}>
                          {activeKanjiDetail.sentences.map((sentence, index) => (
                            <ThemedBox key={index} sx={{ padding: { xs: "10px", md: "17px" }, alignItems: "flex-start", justifyContent: "flex-start", gap: "5px", flexShrink: 0 }}>
                              <Typography sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, color: "white", fontWeight: "bold" }}>{sentence.japanese}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "lightgrey" }}>{sentence.reading}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "grey" }}>{sentence.english}</Typography>
                            </ThemedBox>
                          ))}
                        </Box>
                      )}
                      {option === "Related Kanji" && activeKanjiDetail?.similar && activeKanjiDetail.similar.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: "10px", md: "20px" }, justifyContent: "flex-start" }}>
                          {activeKanjiDetail.similar.map((similarKanji, index) => (
                            <ThemedBox key={index} sx={{ padding: { xs: "10px", md: "17px" }, alignItems: "center", justifyContent: "flex-start", gap: "5px", flexBasis: { xs: "calc(50% - 20px)", sm: "calc(33.33% - 20px)", md: "calc(25% - 20px)" }, minWidth: { xs: "150px", sm: "180px" }, display: 'flex', flexDirection: 'column', flexShrink: 0 }} >
                              <Typography sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, color: "white", fontWeight: "bold" }}>{similarKanji.kanji}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, color: "lightgrey", textAlign: 'center' }}>Shared: {similarKanji.shared_reading}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.9rem" }, color: "grey", textAlign: 'center', width: '100%', wordBreak: 'break-all' }}>On: {similarKanji.all_on_yomi.join(', ') || 'N/A'}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.9rem" }, color: "grey", textAlign: 'center', width: '100%', wordBreak: 'break-all' }}>Kun: {similarKanji.all_kun_yomi.join(', ') || 'N/A'}</Typography>
                              <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.9rem" }, color: "darkgrey", textAlign: 'center', width: '100%', wordBreak: 'break-word', mt: 0.5 }}>Meanings: {similarKanji.meanings.slice(0, 2).join('; ') || 'N/A'}</Typography>
                              <Button sx={{ fontSize: "1rem", color: "white", fontWeight: "bold", backgroundColor:"#27272A", borderRadius: "10px", padding:"10px", minWidth: "auto", outline: "none", border: "none", textTransform: 'none', mt: 1 }} onClick={() => setSearch(similarKanji.kanji)}>
                                <ArrowForwardIcon />
                              </Button>
                            </ThemedBox>
                          ))}
                        </Box>
                      )}
                      {((option === "Words" && (!activeKanjiDetail.examples || activeKanjiDetail.examples.length === 0)) ||
                        (option === "Sentences" && (!activeKanjiDetail.sentences || activeKanjiDetail.sentences.length === 0)) ||
                        (option === "Related Kanji" && (!activeKanjiDetail.similar || activeKanjiDetail.similar.length === 0))) && (
                        <ThemedBox sx={{ mt: "10px", p: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "100px", width: "100%" }}>
                          <Typography sx={{ fontSize: "1rem", color: "grey", fontWeight: "bold" }}>No {option.toLowerCase()} found for "{activeKanjiDetail.kanji}".</Typography>
                          <Typography sx={{ fontSize: "0.8rem", color: "darkgrey", mt: 1 }}>Explore other information tabs or search for a different term.</Typography>
                        </ThemedBox>
                      )}
                    </Box>
                  </Box>
                </ThemedBox>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}