import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';  
import SearchIcon from '@mui/icons-material/Search';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useState } from 'react';


// Currently
export function DictionarySearchBar({ doSearch, search, setSearch }: { doSearch: (str: string) => void, search: string, setSearch: (str: string) => void }) {
  return (
      <Paper
        component="form"
        sx={{
          boxSizing: "border-box", 
          p: '5px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          width: "100%", 
          backgroundColor: "transparent", 
          borderRadius: "10px", 
          outline: "1px solid grey", 
          height: "3em",
          "&:hover": {outline: "2px solid white"}, 
          "&:focus-within": {outline: "2px solid white"},
          "&:focus-visible": {outline: "2px solid white"} 
        }}
      >
        <SearchIcon sx={{fontSize: "2rem", color: "white"}} />
        <InputBase
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              doSearch(search);
            }
          }}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ml: 1, flex: 1, color: "white", fontSize: "1.25rem" }}
          placeholder="Search for words, kanji, phrases and meanings."
          inputProps={{ 'aria-label': 'search for words, kanji, phrases and meanings' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => doSearch(search)}>
          <SubdirectoryArrowRightIcon sx={{fontSize: "2rem", color: "white", cursor: "pointer"}} />
        </IconButton>
      </Paper>
  );
}