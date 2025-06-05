import { Box, Button, CircularProgress, Typography, Card, CardContent, CardHeader, Badge, Tooltip } from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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


const cardStyleBase = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  backgroundColor: '#09090B',
  borderRadius: '10px',
  boxSizing: 'border-box',
  border: "2px solid #27272A",
};


export function Analysis() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const text = typeof location.state?.text === 'string' ? location.state.text : "";
  
  const [phraseSearchResults, setPhraseSearchResults] = useState<GeneralSearchResult[] | null>(null);
  const [isLoadingPhraseResults, setIsLoadingPhraseResults] = useState<boolean>(false);
  const [errorPhraseResults, setErrorPhraseResults] = useState<string | null>(null);
  
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [tooltipKanjiInfo, setTooltipKanjiInfo] = useState<KanjiDetailData | null>(null);
  const [isLoadingTooltip, setIsLoadingTooltip] = useState<boolean>(false);

  const fetchSingleKanjiDetails = useCallback(async (kanjiChar: string): Promise<KanjiDetailData | null> => {
    if (!kanjiChar || kanjiChar.length !== 1) {
      return null;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/search/kanji/${encodeURIComponent(kanjiChar)}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch Kanji details: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching single Kanji details:", err);
      return null;
    }
  }, []);

  const fetchPhraseDetails = useCallback(async (phrase: string): Promise<GeneralSearchResult[] | null> => {
    if (!phrase.trim()) {
      return null;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/search/general`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: phrase }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `Failed to fetch phrase details: ${response.status}`);
      }
      const data: GeneralSearchApiResponse = await response.json();
      return data.results;
    } catch (err) {
      console.error("Error fetching phrase details:", err);
      if (err instanceof Error) throw err;
      throw new Error("An unknown error occurred while fetching phrase details.");
    }
  }, []);


  useEffect(() => {
    const currentPhrase = selectedPhrases.join('');

    if (currentPhrase) {
      setIsLoadingPhraseResults(true);
      setErrorPhraseResults(null);
      setPhraseSearchResults(null);

      fetchPhraseDetails(currentPhrase)
        .then(data => {
          if (data && data.length > 0) {
            setPhraseSearchResults(data);
          } else {
            setPhraseSearchResults([]);
            setErrorPhraseResults(`No dictionary entries found for "${currentPhrase}".`);
          }
        })
        .catch(err => {
          setErrorPhraseResults(err.message || "Error fetching details for the phrase.");
          setPhraseSearchResults(null);
        })
        .finally(() => {
          setIsLoadingPhraseResults(false);
        });
    } else {
      setPhraseSearchResults(null);
      setIsLoadingPhraseResults(false);
      setErrorPhraseResults(null);
    }
  }, [selectedPhrases, fetchPhraseDetails]); 

  const isKanji = (char: string): boolean => {
    const code = char.charCodeAt(0)
    return (code >= 0x4e00 && code <= 0x9faf) || (code >= 0x3400 && code <= 0x4dbf)
  }

  const handleKanjiHover = async (char: string) => {
    if (!isKanji(char)) return;
    setHoveredChar(char);
    setIsLoadingTooltip(true);
    try {
      const data = await fetchSingleKanjiDetails(char);
      setTooltipKanjiInfo(data);
    } catch (err) {
      setTooltipKanjiInfo(null);  
    } finally {
      setIsLoadingTooltip(false);
    }
  }

  const handleKanjiLeave = () => {
    setHoveredChar(null);
    setTooltipKanjiInfo(null);
    setIsLoadingTooltip(false);
  }

  const handleKanjiClick = (char: string) => {
    if (!isKanji(char)) return;
    
    setSelectedPhrases(prevSelected => {
      if (prevSelected.includes(char)) {
        return prevSelected.filter((c) => c !== char);
      } else {
         return [...prevSelected, char];
      }
    });
  }
  
  
  // const newHandleKanjiClick = (char: string) => {
  //   if (!isKanji(char)) return;
    
  //   setSelectedPhrases(prevSelected => {
  //     const newSelection = [...prevSelected];
  //     const charIndexInSelection = newSelection.indexOf(char);

  //     if (charIndexInSelection > -1) {
  //       // If char is already selected, remove it
  //       newSelection.splice(charIndexInSelection, 1);
  //     } else {
  //       if (prevSelected.includes(char)) {
  //         return prevSelected.filter((c) => c !== char);
  //       } else {
  //         return [...prevSelected, char];
  //       }
  //     }
  //     return newSelection;
  //   });
  // };


  const getDifficultyColor = (level: string | undefined): string => {
    if (!level) return "grey.500";
    switch (level) {
      case "N5":
        return "success.main"; 
      case "N4":
        return "info.main";
      case "N3":
        return "warning.main";
      case "N2":
        return "error.main";
      case "N1":
        return "secondary.main"; 
      default:
        return "grey.500";
    }
  };

  if (text === "" && location.state?.text === undefined) {
    return (
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%"}}>
        <Typography sx={{color: "white", fontSize: "1.5rem"}}>No text provided for analysis.</Typography>
      </Box>
    );
  }
  if (text === "" && location.state?.text === "") {
     return (
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%"}}>
        <Typography sx={{color: "white", fontSize: "1.5rem"}}>Empty text provided. Please go back and enter some text.</Typography>
      </Box>
    );
  }

  const renderTooltipContent = (kanjiInfo: KanjiDetailData | null, isLoading: boolean) => {
    if (isLoading) return <CircularProgress size={20} />;
    if (!kanjiInfo) return <Typography sx={{fontSize: "0.8rem"}}>No info</Typography>;
    return (
      <Box>
        <Typography sx={{fontWeight: "bold", fontSize: "1rem"}}>{kanjiInfo.kanji} - {kanjiInfo.meanings[0]}</Typography>
        <Typography sx={{fontSize: "0.8rem"}}>On: {kanjiInfo.onYomi.join(", ")}</Typography>
        <Typography sx={{fontSize: "0.8rem"}}>Kun: {kanjiInfo.kunYomi.join(", ")}</Typography>
        <Typography sx={{fontSize: "0.8rem"}}>JLPT: {kanjiInfo.jlptLevel}</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      width: '100%',
      gap: '20px',
      overflowY: 'auto',
      padding: { xs: "10px", md: "20px" },
      '&::-webkit-scrollbar': { width: '8px' },
      '&::-webkit-scrollbar-track': { backgroundColor: '#1c1c1e', borderRadius: '4px' },
      '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '4px', border: '2px solid #1c1c1e' },
      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#777' }
    }}> 
      <Card sx={{ ...cardStyleBase, height: 'auto', padding: "20px", width: '100%' }}>
        <CardHeader title={<Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>INSTRUCTIONS</Typography>} />
        <CardContent>
          <Typography sx={{fontSize: "1.25rem", color: "white"}}> 
            • Hover over Kanji characters to see quick information.
          </Typography>
          <Typography sx={{fontSize: "1.25rem", color: "white"}}> 
            • Click on a Kanji to select/deselect it. The selected Kanji will form a phrase for detailed search below.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ ...cardStyleBase, height: 'auto', padding: "20px", gap: "10px", width: '100%' }}>
        <CardHeader 
          avatar={<AutoStoriesIcon sx={{fontSize: {xs: "1.5rem", md: "2rem"}, color: "white"}} />}
          title={<Typography sx={{fontWeight: "bold", fontSize: {xs: "1.5rem", md: "2rem"}, color: "white"}}>Interactive Text</Typography>}
        />
        <CardContent sx={{width: "100%"}}>
          <Box sx={{boxSizing: "border-box", wordWrap: "break-word", padding: "20px", display: "flex", flexDirection: "row",  minHeight: "150px", width: "100%", backgroundColor: "#27272A", borderRadius: "10px", flexWrap: "wrap", alignItems: "flex-start"}}>
          {text.split("").map((char: string, index: number) => {
            const charIsKanji = isKanji(char);
            const isSelected = selectedPhrases.includes(char); 

            if (charIsKanji) {
              return (
                <Tooltip 
                  key={`${char}-${index}-tooltip`}
                  title={renderTooltipContent(tooltipKanjiInfo && hoveredChar === char ? tooltipKanjiInfo : null, isLoadingTooltip && hoveredChar === char)} 
                  arrow 
                  placement="top"
                  PopperProps={{ modifiers: [{ name: 'offset', options: { offset: [0, -10] } }] }}
                  componentsProps={{
                    tooltip: { sx: { backgroundColor: 'common.black', color: 'common.white', border: '1px solid #555', fontSize: '0.875rem', padding: '8px' }},
                    arrow: { sx: { color: 'common.black', '&:before': { border: '1px solid #555' }}}
                  }}
                >
                  <Typography
                    key={`${char}-${index}`}
                    component="span"
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "4rem" }, // Responsive font size
                      color: "white",
                      padding: "0 2px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      backgroundColor: isSelected
                        ? "rgba(255, 255, 0, 0.3)"
                        : hoveredChar === char 
                          ? "rgba(255,255,255,0.2)"
                          : "transparent",
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onMouseEnter={() => handleKanjiHover(char)}
                    onMouseLeave={handleKanjiLeave}
                    onClick={() => handleKanjiClick(char)}
                  >
                    {char}
                  </Typography>
                </Tooltip>
              );
            }
            return (
              <Typography key={`${char}-${index}`} component="span" sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "4rem" },
                color: "grey",
                padding: "0 2px",
                borderRadius: "4px",
              }}>{char}</Typography>
            );
          })}
          </Box>
        </CardContent>
        <Box sx={{width: "100%", padding: "0 20px 10px 20px", backgroundColor: "transparent", borderRadius: "10px", display: "flex", flexDirection: {xs: "column", sm: "row"}, alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <Button sx={{fontWeight: "bold", color: "white", backgroundColor: "transparent", borderRadius: "10px", gap: "5px", padding: {xs: "4px 8px", sm: "6px 12px"} }} disabled>
                <VolumeUpIcon sx={{fontSize: {xs: "1.25rem", sm: "1.5rem", md: "1.875rem"}, color: "white"}} />
                <Typography sx={{fontSize: {xs: "0.75rem", sm: "0.875rem", md: "0.9375rem"}, color: "white"}}> Play Audio</Typography>
              </Button> 
            </Box>  
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <Button sx={{fontWeight: "bold", color: "white", backgroundColor: "transparent", borderRadius: "10px", padding: {xs: "4px 8px", sm: "6px 12px"} }} onClick={() => {
                setSelectedPhrases([]); 
              }}>
                <RefreshIcon sx={{fontSize: {xs: "1.25rem", sm: "1.5rem", md: "1.875rem"}, color: "white"}}></RefreshIcon>
                <Typography sx={{fontSize: {xs: "0.75rem", sm: "0.875rem", md: "0.9375rem"}, color: "white"}}>Reset Selection</Typography>
              </Button>
            </Box>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <Button sx={{fontWeight: "bold", color: "white", backgroundColor: "transparent", borderRadius: "10px", padding: {xs: "4px 8px", sm: "6px 12px"} }} onClick={() => navigator.clipboard.writeText(text)} disabled={!text}>
                <ContentCopyIcon sx={{fontSize: {xs: "1.25rem", sm: "1.5rem", md: "1.875rem"}, color: "white"}} />
                <Typography sx={{fontSize: {xs: "0.75rem", sm: "0.875rem", md: "0.9375rem"}, color: "white"}}>Copy Text</Typography>
              </Button>
            </Box>
        </Box>
      </Card>
      
      <Card sx={{ ...cardStyleBase, height: 'auto', padding: "20px", gap: "10px", width: '100%', mb: "20px" }}>
        <CardHeader 
            title={
              <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", width: "100%"}}>
                <Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>
                  {selectedPhrases.length > 0 ? `Results for "${selectedPhrases.join('')}"` : "Detailed Information"}
                </Typography>
                {selectedPhrases.length > 0 && 
                  <Button 
                    sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "#27272A", borderRadius: "10px", padding: "5px 10px"}}
                    onClick={() => {
                      if (selectedPhrases.length > 0) {
                        navigate(`/dictionary/${selectedPhrases.join('')}`);
                      }
                    }}
                  >
                    <Typography sx={{mr: "5px"}}>Dictionary</Typography>
                    <ArrowForwardIcon sx={{fontSize: "1.5rem", color: "white"}}/>
                  </Button>
                }
              </Box>
            }
        />
        <CardContent sx={{
          width: "100%", 
          minHeight: "200px",
          maxHeight: { xs: "300px", md: "450px" },
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch", 
          gap: "15px",
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#1c1c1e', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '4px', border: '2px solid #1c1c1e' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#777' }
        }}>
        {isLoadingPhraseResults ? (
          <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
            <CircularProgress sx={{color: "white"}} />
          </Box>
        ) : errorPhraseResults && (!phraseSearchResults || phraseSearchResults.length === 0) ? ( // Show error if it exists AND no results
          <Typography sx={{fontSize: "1rem", color: "error.main", textAlign: "center", width: "100%"}}>
            {errorPhraseResults}
          </Typography>
        ) : phraseSearchResults && phraseSearchResults.length > 0 ? (
          phraseSearchResults.map((result, index) => (
            <Box key={index} sx={{ ...cardStyleBase, padding: "15px", alignItems: "flex-start", justifyContent: "flex-start", backgroundColor: "#1C1C1E" }}>
              {result.type === "kanji_detail" && (
                <Box sx={{width: "100%"}}>
                  <Typography sx={{ fontSize: "2rem", color: "white", fontWeight: "bold" }}>{result.data.kanji}</Typography>
                  <Typography sx={{ fontSize: "1.2rem", color: "white" }}>{result.data.meanings.join(', ')}</Typography>
                  <Typography sx={{ fontSize: "1rem", color: "lightgrey" }}>On: {result.data.onYomi.join(', ')}</Typography>
                  <Typography sx={{ fontSize: "1rem", color: "lightgrey" }}>Kun: {result.data.kunYomi.join(', ')}</Typography>
                </Box>
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
            </Box>
          ))
        ) : selectedPhrases.length > 0 ? ( 
           <Typography sx={{fontSize: "1rem", color: "grey", textAlign: "center", width: "100%", alignSelf: "center"}}>
            No specific dictionary entries found for "${selectedPhrases.join('')}".
          </Typography>
        ) : ( 
          <Typography sx={{fontSize: "1rem", color: "grey", textAlign: "center", width: "100%", alignSelf: "center"}}>
            Select Kanji from the text above to see detailed search results for the formed phrase.
          </Typography>
        )}
        </CardContent>
      </Card>
    </Box>
  );
};