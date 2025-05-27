import { Box, Button, CircularProgress, Typography, Card, CardContent, CardHeader, Badge } from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { use, useEffect, useState } from "react";
import { kanjiDatabase, KanjiInfo } from '../misc/dummyData'
import { useNavigate } from "react-router-dom";

const centeredFlexColumn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  backgroundColor: '#09090B',
  borderRadius: '10px',
  boxSizing: 'border-box',
  outline: "2px solid #27272A",
};


export function Analysis() {
  const navigate = useNavigate(); 
  const [text, setText] = useState("");
  const [kanjiForDetailView, setKanjiForDetailView] = useState<KanjiInfo | null>(null);
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [tooltipKanjiInfo, setTooltipKanjiInfo] = useState<KanjiInfo | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electron.api.getDummyData();
      // setText(data.translated_text);
      
      // backend api is not setup properly yet so just use this 
      setText("私は日本語を勉強しています。 漢字は難しいですが、面白いです。");
    }
    fetchData();
  }, []);

  // update kanjiForDetailView based on selectedPhrases
  useEffect(() => {
    if (selectedPhrases.length > 0) {

      // for now just show the last selected kanji 
      // but later show meanings of the whole phrase 
      const lastSelected = selectedPhrases[selectedPhrases.length - 1];
      setKanjiForDetailView(kanjiDatabase[lastSelected] || null);
    } else {
      setKanjiForDetailView(null);
    }
  }, [selectedPhrases]); 

  // check if char is kanji 
  const isKanji = (char: string): boolean => {
    const code = char.charCodeAt(0)
    return (code >= 0x4e00 && code <= 0x9faf) || (code >= 0x3400 && code <= 0x4dbf)
  }

  // hover effect for kanji
  const handleKanjiHover = (char: string) => {
    setHoveredChar(char);
    setTooltipKanjiInfo(kanjiDatabase[char] || null);
  }

  // leave hover effect for kanji
  const handleKanjiLeave = () => {
    setHoveredChar(null);
    setTooltipKanjiInfo(null);
  }

  // add kanji to selected phrases and remove if already selected
  const handleKanjiClick = (char: string) => {
    if (selectedPhrases.includes(char)) {
      setSelectedPhrases(selectedPhrases.filter((e) => e !== char));
    } else {
      setSelectedPhrases([...selectedPhrases, char]);
    }
    // currently the useeffect changes how the kanji shows but when backend works will be diff

  }

  // get the color form jplt level
  const getDifficultyColor = (level: string): string => {
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

  // return loading screen if text is not loaded yet 
  if (text === "") {
    return (
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%"}}>
        <CircularProgress />
      </Box>
    )
  } 


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      gap: '20px',
    }}> 
    {/* instructions box */}
      <Card sx={{ ...centeredFlexColumn, height: 'auto', padding: "20px", width: '100%' }}>
        <CardHeader title={<Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>INSTRUCTIONS</Typography>} />
        <CardContent>
          <Typography sx={{fontSize: "1.25rem", color: "white"}}> 
            • Hover over Kanji characters to see detailed information.
          </Typography>
          <Typography sx={{fontSize: "1.25rem", color: "white"}}> 
            • Click on a Kanji to see its details in the section below.
          </Typography>
        </CardContent>
      </Card>

      {/* interactive text box*/}
      <Card sx={{ ...centeredFlexColumn, height: 'auto', padding: "20px", gap: "10px", width: '100%' }}>
        <CardHeader 
          avatar={<AutoStoriesIcon sx={{fontSize: "2rem", color: "white"}} />}
          title={<Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>Interactive Text</Typography>}
        />
        <CardContent sx={{width: "100%"}}>
          <Box sx={{boxSizing: "border-box", wordWrap: "break-word", padding: "20px", display: "flex", flexDirection: "row",  minHeight: "150px", width: "100%", backgroundColor: "#27272A", borderRadius: "10px", flexWrap: "wrap"}}>
          {text.split("").map((char, index) => {
            const kanjiInfo = kanjiDatabase[char];
            if (isKanji(char) && kanjiInfo) {
              return (
                <Typography
                  key={index}
                  component="span"
                  sx={{
                    fontSize: "4rem",
                    color: "white",
                    padding: "0 2px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    backgroundColor: selectedPhrases.includes(char) 
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
              );
            } else if (isKanji(char)) {
              return (
                <Typography 
                  key={index}
                  component="span"
                  onClick={() => handleKanjiClick(char)}
                  sx={{
                    fontSize: "4rem", 
                    color: "lightgrey", 
                    cursor: "pointer", 
                    padding: "0 2px",
                    borderRadius: "4px",
                    backgroundColor: selectedPhrases.includes(char) 
                      ? "rgba(255, 255, 0, 0.3)"
                      : hoveredChar === char 
                        ? "rgba(255,255,255,0.2)" 
                        : "transparent",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                >
                  {char}
                </Typography>
              );
            }
            return (
              <Typography key={index} component="span" sx={{
                fontSize: "4rem", 
                color: "grey",
                backgroundColor: selectedPhrases.includes(char) ? "rgba(255, 255, 0, 0.1)" : "transparent",
                padding: "0 2px",
                borderRadius: "4px",
              }}>{char}</Typography>
            );
          })}
          </Box>
        </CardContent>
        {/* bottom bar with play audio, copy and  reset selection */}
        <Box sx={{width: "100%", padding: "0 20px 10px 20px", backgroundColor: "transparent", borderRadius: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <VolumeUpIcon sx={{fontSize: "1.875rem", color: "white"}} />
              <Button sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "transparent", borderRadius: "10px"}}>
                Play Audio
              </Button> 
            </Box>  
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <RefreshIcon sx={{fontSize: "1.875rem", color: "white"}}></RefreshIcon>
              <Button sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "transparent", borderRadius: "10px"}}>
                Reset Selection
              </Button>
            </Box>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <ContentCopyIcon sx={{fontSize: "1.875rem", color: "white"}} />
              <Button sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "transparent", borderRadius: "10px"}}>
              Copy
              </Button>
            </Box>
        </Box>
      </Card>
      


      {/* results from the interative text */}
      <Card sx={{ ...centeredFlexColumn, height: 'auto', padding: "20px", gap: "10px", width: '100%' }}>
        <CardHeader 
            title={
              <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "20px"}}>
                <Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>{kanjiForDetailView ? `Detailed Information: ${kanjiForDetailView.kanji}` : "Detailed Information"}</Typography>
                {kanjiForDetailView && 
                // will redirect to the direcitonary page to show more info or something
                  <Button 
                    sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "#27272A", borderRadius: "10px"}}
                    onClick={() => {
                      navigate(`/dictionary/${kanjiForDetailView.kanji}`);
                    }}
                  >
                    <ArrowForwardIcon sx={{fontSize: "1.875rem", color: "white", backgroundColor: "transparent"}}></ArrowForwardIcon>
                  </Button>
                }
              </Box>
            }
        />
        <CardContent sx={{
          width: "100%", 
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
        {kanjiForDetailView ? (
          // reorganise layout later, placeholder for now
          <Box sx={{ padding: "10px", width: "100%", borderRadius: "10px", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: "20px"}}>
            <Box sx={{height: "100%", width: "50%", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px"}}>
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white"}}>Readings</Typography>
              <Typography sx={{fontSize: "1rem", color: "white"}}>On'yomi: {kanjiForDetailView.onYomi.join(", ")}</Typography>
              <Typography sx={{fontSize: "1rem", color: "white"}}>Kun'yomi: {kanjiForDetailView.kunYomi.join(", ")}</Typography>
              
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white", mt: 2}}>Properties</Typography>
              <Box sx={{display: "flex", gap: "5px", flexWrap: "wrap"}}>
                <Badge sx={{ bgcolor: getDifficultyColor(kanjiForDetailView.jlptLevel), color: 'white' }}>{kanjiForDetailView.jlptLevel}</Badge>
                <Badge sx={{ bgcolor: 'grey.700', color: 'white' }}>{kanjiForDetailView.strokeCount} strokes</Badge>
                <Badge sx={{ bgcolor: 'grey.700', color: 'white' }}>Frequency: #{kanjiForDetailView.frequency}</Badge>
              </Box>
            </Box>

            <Box sx={{height: "100%", width: "50%", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px"}}>
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white"}}>Meanings</Typography>
              <Typography sx={{fontSize: "1rem", color: "white"}}>{kanjiForDetailView.meanings.join(", ")}</Typography>

              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white", mt: 2}}>Examples</Typography>
              <Typography sx={{fontSize: "1rem", color: "lightgrey"}}>Example sentences here</Typography>
            </Box>
          </Box>
        ) : (
          <Typography sx={{fontSize: "1rem", color: "grey", textAlign: "center", width: "100%", alignSelf: "center"}}>
            Select a Kanji from the text above to see its details.
          </Typography>
        )}
        </CardContent>
      </Card>
    </Box>
  );
};