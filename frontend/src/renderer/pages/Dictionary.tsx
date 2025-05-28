import { useParams } from "react-router-dom";
import { ThemedBox } from "../components/ThemedBox";
import { Box, Button, Typography, ButtonGroup } from "@mui/material";

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { DictionarySearchBar } from "../components/DictionarySearchBar";
import { useEffect, useState } from "react";

import { kanjiDatabase } from "../misc/dummyData";
import { GroupedLabels } from "../components/GroupedLabels";
import { SpeakerFavGroup } from "../components/SpeakerFavGroup";
import { DictionaryOptionButton } from "../components/DictionaryOptionButton";


export function Dictionary() {
  const { phrase } = useParams();
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [option, setOption] = useState<string>("Words");

  useEffect(() => {
    if (phrase) {
      setSearch(phrase);
    }
  }, [phrase]);

  const doSearch = (str: string) => {
    setSearchHistory([...searchHistory, str]);
    console.log("Searching for " + str);
  }

  
  return (
    <>
      <Box sx={{
        display: "flex",
        gap:"30px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: { xs: "10px", md: "0px" }
        }}
      >
        <ThemedBox sx={{
          height: { xs: "auto", md: "20%" },
          padding: { xs: "10px", md: "17px" },
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%"
        }}>
          <Box sx={{display: "flex", flexDirection: "row", alignItems: "center",  width: "100%"}}>
            <AutoStoriesIcon sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "white",
              marginRight: "10px"
            }} />
            <Typography sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "white"
            }}>
              Search Dictionary
            </Typography>
          </Box>
          <Typography sx={{
            fontSize: { xs: "0.8rem", md: "1rem" },
            mb: "5px",
            color: "grey",
            width: "100%",
            alignSelf: "center",
            fontWeight: "bold"
          }}>
            Search for words, kanji, phrases and meanings.
          </Typography>
          <DictionarySearchBar doSearch={doSearch} search={search} setSearch={setSearch}/>

          {searchHistory.length > 0 && (
            <Box sx={{
              marginTop: "5px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: { xs: "5px", md: "10px" },
              flexWrap: 'wrap'
            }}>
              {searchHistory.map((history) => (
                <Button
                  key={history}
                  sx={{
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    color: "white",
                    alignSelf: "center",
                    fontWeight: "bold",
                    backgroundColor: "#27272A",
                    borderRadius: "50px",
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    padding: "5px 10px",
                    '&:hover': {
                      backgroundColor: "#3F3F46",
                    }
                  }}
                  onClick={() => setSearch(history)}
                >
                  {history}
                </Button>
              ))}
            </Box>
          )}         

        </ThemedBox>
        
        <Box 
          sx={{ 
            display: "flex", 
            gap:"20px", 

            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            height:"80%", width:"100%"}}
            >
          {/* search results of kanji*/}
          <ThemedBox sx={{
            height: { xs: "auto", md: "40%" },
            width:"100%",
            padding: { xs: "10px", md: "20px" },
            justifyContent: "flex-start",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: "5px", md: "10px" }
          }}>
            {search === "" ? (
              <Typography sx={{fontSize: "1rem", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold"}}>
                No search results. Enter a search to see your results.
              </Typography>
            ) : (
              <>
                <Box sx={{
                  boxSizing: "border-box",
                  height: { xs: "auto", md: "60%" },
                  padding: { xs: "5px", md: "10px" },
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: { xs: "10px", md: "10px" }
                }}>

                  <Box sx={{
                    display:"flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    width: "100%",
                    gap: { xs: "5px", md: "20px" },
                    textAlign: {xs: "center", sm: "left"}
                  }}>
                    <Typography sx={{
                      fontSize: { xs: "2rem", md: "3rem" },
                      color: "white",
                      alignSelf: "center",
                      fontWeight: "bold"
                    }}>
                      {search}
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", height: "100%"}}>
                        <Typography sx={{
                          fontSize: { xs: "1.2rem", md: "2rem" },
                          color: "white",
                          width: "100%",
                          alignSelf: "center",
                          fontWeight: "bold",
                          textAlign: {xs: "center", sm: "left"}
                        }}>
                          {kanjiDatabase[search]?.meanings[0]}
                        </Typography>
                        <GroupedLabels labels={kanjiDatabase[search]?.meanings} />
                      </Box>                    
                    </Box>
                  </Box>
                  <SpeakerFavGroup sx={{ alignSelf: {xs: "center", sm: "flex-start"} }}/>
                </Box>

                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  height: { xs: "auto", md: "50%" },
                  width: "100%",
                  gap: { xs: "10px", sm: "0px" }
                  }}
                >
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: {xs: "center", sm: "flex-start"}, justifyContent: "space-between", width: "100%", textAlign: {xs: "center", sm: "left"}}}>
                      <Typography sx={{
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        color: "white",
                        width: "100%",
                        alignSelf: "center",
                        fontWeight: "bold"
                      }}>
                        Kun'yomi
                      </Typography>
                      <Typography sx={{
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        color: "white",
                        width: "100%",
                        alignSelf: "center",
                        fontWeight: "semibold"
                      }}>
                        {kanjiDatabase[search]?.kunYomi.join(", ")}
                      </Typography>
                    
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: {xs: "center", sm: "flex-start"}, justifyContent: "space-between", width: "100%", textAlign: {xs: "center", sm: "left"}}}>
                      <Typography sx={{
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        color: "white",
                        width: "100%",
                        alignSelf: "center",
                        fontWeight: "bold"
                      }}>
                        On'yomi
                      </Typography>
                      <Typography sx={{
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        color: "white",
                        width: "100%",
                        alignSelf: "center",
                        fontWeight: "semibold"
                      }}>
                        {kanjiDatabase[search]?.onYomi.join(", ")}
                      </Typography>
                    </Box>
                </Box>
              </>
            )}
          </ThemedBox>

          {/* search results of sentences, examples, related kanji, etc */}
          <Box sx={{ backgroundColor: "", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "space-between", height: "100%",  width: "100%"}}>
            <Box sx={{backgroundColor: "", height: {xs: "auto", md: "10%"}, width: "100%", borderRadius: "20px"}}>
              <ButtonGroup fullWidth sx={{
                boxSizing: "border-box",
                padding: "9px",
                backgroundColor: '#27272A',
                borderRadius: "10px",
                flexDirection: { xs: "column", sm: "row" },
                '& .MuiButton-root': {
                  border: " none",
                  borderRadius: '0',
                  color: "white",
                  flexBasis: {xs: "100%", sm: "auto"}
                },
                '& .MuiButton-root:not(:last-child)': {
                    borderBottom: { xs: "1px solid #3F3F46", sm: "none" },
                    borderRight: { xs: "none", sm: "1px solid #3F3F46"}
                },
                 '& .MuiButton-root:last-child': {
                    borderBottom: 'none',
                    borderRight: 'none'
                }
              }}>
                <DictionaryOptionButton 
                  option={option}
                  setOption={setOption}
                  label="Words"
                />
                <DictionaryOptionButton 
                  option={option}
                  setOption={setOption}
                  label="Sentences"
                />
                <DictionaryOptionButton 
                  option={option}
                  setOption={setOption}
                  label="Related Kanji"
                />

              </ButtonGroup>

            </Box>

            <Box sx={{ opacity: "1", height: "100%", width: "100%", borderRadius: "10px", padding: { xs: "5px", md: "10px" }, boxSizing: "border-box", overflowY: "auto"}}>
              {option === "Words" && kanjiDatabase[search]?.examples && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: "10px", md: "20px" }, justifyContent: "center" }}>
                  {kanjiDatabase[search].examples.map((example, index) => (
                    <ThemedBox key={index} sx={{ 
                      padding: { xs: "10px", md: "15px" }, 
                      alignItems: "flex-start", 
                      gap: "5px",  
                      flexGrow: 1,
                      flexBasis: { xs: "calc(100% - 20px)", sm: "calc(50% - 20px)", md: "calc(33.33% - 20px)" }
                    }}>
                      <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, color: "white", fontWeight: "bold" }}>
                        {example.word}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "lightgrey" }}>
                        {example.reading}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "grey" }}>
                        {example.meaning}
                      </Typography>
                    </ThemedBox>
                  ))}
                </Box>
              )}
              {option === "Sentences" && kanjiDatabase[search]?.sentences && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "10px", md: "15px" } }}>
                  {kanjiDatabase[search].sentences.map((sentence, index) => (
                    <ThemedBox key={index} sx={{ padding: { xs: "10px", md: "15px" }, alignItems: "flex-start", gap: "5px" }}>
                      <Typography sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, color: "white", fontWeight: "bold" }}>
                        {sentence.japanese}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "lightgrey" }}>
                        {sentence.reading}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, color: "grey" }}>
                        {sentence.english}
                      </Typography>
                    </ThemedBox>
                  ))}
                </Box>
              )}
              {option === "Related Kanji" && kanjiDatabase[search]?.similar && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: "10px", md: "20px" }, justifyContent: "center" }}>
                  {kanjiDatabase[search].similar.map((similarKanji, index) => (
                    <ThemedBox 
                      key={index} 
                      sx={{ 
                        padding: { xs: "10px", md: "15px" }, 
                        alignItems: "center", 
                        gap: "5px", 
                        cursor: "pointer", 
                        flexGrow: 1,
                        flexBasis: { xs: "calc(50% - 20px)", sm: "calc(33.33% - 20px)", md: "calc(25% - 20px)" }
                      }}  
                      onClick={() => setSearch(similarKanji.kanji)}
                     >
                      <Typography sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, color: "white", fontWeight: "bold" }}>
                        {similarKanji.kanji}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" }, color: "lightgrey" }}>
                        {similarKanji.similarity}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" }, color: "grey", textAlign: "center" }}>
                        {similarKanji.reason}
                      </Typography>
                    </ThemedBox>
                  ))}
                </Box>
              )}
              {(option === "Words" && !kanjiDatabase[search]?.examples) ||
               (option === "Sentences" && !kanjiDatabase[search]?.sentences) ||
               (option === "Related Kanji" && !kanjiDatabase[search]?.similar) ? (
                <Typography sx={{fontSize: "1rem", color: "grey", width: "100%", textAlign: "center", fontWeight: "bold", marginTop: "20px"}}>
                  No {option.toLowerCase()} found for "{search}".
                </Typography>
              ) : null}
            </Box>

          </Box>

        </Box>
      </Box>
    </>
  );
}