import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';  
import SearchIcon from '@mui/icons-material/Search';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useState, useEffect } from 'react';


export function DictionarySearchBar({ doSearch, search }: { doSearch: (str: string) => void, search: string }) {
  const [currentInputValue, setCurrentInputValue] = useState(search);

  useEffect(() => {
    setCurrentInputValue(search);
  }, [search]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    doSearch(currentInputValue);
  };

  return (
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          boxSizing: "border-box",
          p: { xs: '3px 10px', md: '5px 20px' },
          display: 'flex',
          alignItems: 'center',
          width: "100%",
          backgroundColor: "transparent",
          borderRadius: "10px",
          outline: "1px solid grey",
          height: { xs: "2.5em", md: "3em" },
          "&:hover": {outline: "2px solid white"},
          "&:focus-within": {outline: "2px solid white"},
          "&:focus-visible": {outline: "2px solid white"}
        }}
      >
        <SearchIcon sx={{fontSize: { xs: "1.5rem", md: "2rem" }, color: "white"}} />
        <InputBase
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          onChange={(e) => setCurrentInputValue(e.target.value)}
          value={currentInputValue}
          sx={{ 
            ml: 1, 
            flex: 1, 
            color: "white", 
            fontSize: { xs: "1rem", md: "1.25rem" },
            minWidth: 0
          }}
          placeholder="Search..."
          inputProps={{ 'aria-label': 'search for words, kanji, phrases and meanings' }}
        />
        <IconButton type="submit" sx={{ p: { xs: '5px', md: '10px' } }} aria-label="search"> 
          <SubdirectoryArrowRightIcon sx={{fontSize: { xs: "1.5rem", md: "2rem" }, color: "white", cursor: "pointer"}} />
        </IconButton>
      </Paper>
  );
}