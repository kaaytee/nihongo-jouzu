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
        }}
      >
        <ThemedBox sx={{height:"20%", padding: "17px", alignItems: "flex-start", justifyContent: "space-between"}}>
          <Box sx={{display: "flex", flexDirection: "row", alignItems: "center",  width: "100%"}}>
            <AutoStoriesIcon sx={{fontSize: "2rem", color: "white", marginRight: "10px"}} />
            <Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>
              Search Dictionary 
            </Typography>
          </Box>
          <Typography sx={{fontSize: "1rem", mb: "5px", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold"}}>
            Search for words, kanji, phrases and meanings.
          </Typography>
          <DictionarySearchBar doSearch={doSearch} search={search} setSearch={setSearch}/> 

          {searchHistory.length > 0 && (
            <Box sx={{ marginTop: "5px", display: "flex", flexDirection: "row", alignItems: "center",  width: "100%", gap: "10px", flexWrap: 'wrap'}}>
              {searchHistory.map((history) => (
                <Button 
                  sx={{
                    fontSize: "0.8rem", 
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
          <ThemedBox sx={{height:"40%", width:"100%", padding: "20px", justifyContent: "flex-start", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
            {search === "" ? (
              <Typography sx={{fontSize: "1rem", color: "grey", width: "100%", alignSelf: "center", fontWeight: "bold"}}>
                No search results. Enter a search to see your results.
              </Typography>
            ) : (
              <>
                <Box sx={{
                  boxSizing: "border-box", 
                  height: "60%", 
                  padding: "10px", 
                  display: "flex", 
                  flexDirection: "row", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  width: "100%",
                  gap: "10px"
                }}>

                  <Box sx={{display:"flex", flexDirection: "row", alignItems: "center", width: "100%", gap: "20px"}}>
                    <Typography sx={{fontSize: "3rem", color: "white", alignSelf: "center", fontWeight: "bold"}}>
                      {search}
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", height: "100%"}}>
                        <Typography sx={{fontSize: "2rem", color: "white", width: "100%", alignSelf: "center", fontWeight: "bold"}}>
                          {kanjiDatabase[search]?.meanings[0]}
                        </Typography>
                        <GroupedLabels labels={kanjiDatabase[search]?.meanings} />
                      </Box>                    
                    </Box>
                  </Box>
                  <SpeakerFavGroup />
                </Box>

                <Box sx={{
                  display: "flex", 
                  alignItems: "flex-start", 
                  justifyContent: "flex-start", 
                  height: "50%", 
                  width: "100%"
                  }}
                >
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                      <Typography sx={{fontSize: "1.5rem", color: "white", width: "100%", alignSelf: "center", fontWeight: "bold"}}>
                        Kun'yomi
                      </Typography>
                      <Typography sx={{fontSize: "1.5rem", color: "white", width: "100%", alignSelf: "center", fontWeight: "semibold"}}>
                        {kanjiDatabase[search]?.kunYomi.join(", ")}
                      </Typography>
                    
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                      <Typography sx={{fontSize: "1.5rem", color: "white", width: "100%", alignSelf: "center", fontWeight: "bold"}}>
                        On'yomi
                      </Typography>
                      <Typography sx={{fontSize: "1.5rem", color: "white", width: "100%", alignSelf: "center", fontWeight: "semibold"}}>
                        {kanjiDatabase[search]?.onYomi.join(", ")}
                      </Typography>
                    </Box>
                </Box>
              </>
            )}
          </ThemedBox>

          {/* search results of sentences, examples, related kanji, etc */}
          <Box sx={{ backgroundColor: "", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "space-between", height: "100%",  width: "100%"}}>
            <Box sx={{backgroundColor: "", height: "10%", width: "100%", borderRadius: "20px"}}>
              <ButtonGroup fullWidth sx={{
                boxSizing: "border-box",
                padding: "9px",
                backgroundColor: '#27272A',
                borderRadius: "10px",
                '& .MuiButton-root': {
                  border: " none",
                  borderRadius: '0',
                  color: "white",
                },
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

            <Box sx={{ opacity: "1", height: "100%", width: "100%", borderRadius: "10px", padding: "10px", boxSizing: "border-box", overflowY: "auto"}}>
              {option === "Words" && kanjiDatabase[search]?.examples && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                  {kanjiDatabase[search].examples.map((example, index) => (
                    <ThemedBox key={index} sx={{ padding: "15px", alignItems: "flex-start", gap: "5px" }}>
                      <Typography sx={{ fontSize: "1.5rem", color: "white", fontWeight: "bold" }}>
                        {example.word}
                      </Typography>
                      <Typography sx={{ fontSize: "1rem", color: "lightgrey" }}>
                        {example.reading}
                      </Typography>
                      <Typography sx={{ fontSize: "1rem", color: "grey" }}>
                        {example.meaning}
                      </Typography>
                    </ThemedBox>
                  ))}
                </Box>
              )}
              {option === "Sentences" && kanjiDatabase[search]?.sentences && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {kanjiDatabase[search].sentences.map((sentence, index) => (
                    <ThemedBox key={index} sx={{ padding: "15px", alignItems: "flex-start", gap: "5px" }}>
                      <Typography sx={{ fontSize: "1.2rem", color: "white", fontWeight: "bold" }}>
                        {sentence.japanese}
                      </Typography>
                      <Typography sx={{ fontSize: "1rem", color: "lightgrey" }}>
                        {sentence.reading}
                      </Typography>
                      <Typography sx={{ fontSize: "1rem", color: "grey" }}>
                        {sentence.english}
                      </Typography>
                    </ThemedBox>
                  ))}
                </Box>
              )}
              {option === "Related Kanji" && kanjiDatabase[search]?.similar && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px" }}>
                  {kanjiDatabase[search].similar.map((similarKanji, index) => (
                    <ThemedBox key={index} sx={{ padding: "15px", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={() => setSearch(similarKanji.kanji)}>
                      <Typography sx={{ fontSize: "2rem", color: "white", fontWeight: "bold" }}>
                        {similarKanji.kanji}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "lightgrey" }}>
                        {similarKanji.similarity}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "grey", textAlign: "center" }}>
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