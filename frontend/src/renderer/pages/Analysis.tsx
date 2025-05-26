import { Box, Button, Typography } from "@mui/material";
import { brotliDecompress } from "zlib";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

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
      <Box sx={{
        ...centeredFlexColumn,
        height: '20%',
      }}>
        <Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}> INSTRUCTIONS</Typography>
        <Typography sx={{fontSize: "1.25rem", color: "white"}}> 
          This is a test of the interactive text feature.
        </Typography>
        <Typography sx={{fontSize: "1.25rem", color: "white"}}> 
          This is a test of the interactive text feature.
        </Typography>
      </Box>

      {/* interactive text box*/}
      <Box sx={{
        ...centeredFlexColumn,
        height: '40%',
        padding: "20px",
        gap: "10px",
      }}>
        <Box sx={{height: "20%", width: "100%", backgroundColor: "", borderRadius: "10px",}}>

          {/* title */}
          <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
            <AutoStoriesIcon sx={{fontSize: "2rem", color: "white"}} />
            <Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>
              Interactive Text
            </Typography> 
          </Box>
        </Box>
        {/* actual box where you do the interactive text */}
        <Box sx={{height: "70%", width: "100%", backgroundColor: "#27272A", borderRadius: "10px"}}></Box>
        
        {/* bottom bar with play audio, copy and  reset selection */}
        <Box sx={{height: "10%", width: "100%", backgroundColor: "none", borderRadius: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <VolumeUpIcon sx={{fontSize: "1.875rem", color: "white"}} />
              <Button sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "transparent", borderRadius: "10px"}}>
                Play Audio
              </Button> 
            </Box>  
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px"}}>
              <RefreshIcon></RefreshIcon>
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
      </Box>
      


      {/* results from the interative text */}
      <Box sx={{
        ...centeredFlexColumn,
        height: '40%',
        padding: "20px",
        gap: "10px",
      }}>

        <Box sx={{height: "15%", width: "100%", borderRadius: "10px"}}>
        <Typography sx={{fontWeight: "bold", fontSize: "2rem", color: "white"}}>
              Detailed information about .... (placeholder for the text)
            </Typography> 
        </Box>
        <Box sx={{ padding: "10px", height: "90%", width: "100%", borderRadius: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
          <Box sx={{height: "100%", width: "50%", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
            <Box sx={{height: "50%", width: "100%", borderRadius: "10px"}}>
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white"}}>
                Reading
              </Typography>
            </Box>
            <Box sx={{height: "50%", width: "100%", borderRadius: "10px"}}>
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white"}}>
                Meaning
              </Typography>
            </Box>


          </Box>
          <Box sx={{height: "100%", width: "50%", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
            <Box sx={{height: "50%", width: "100%", borderRadius: "10px"}}>
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white"}}>
                Examples

              </Typography>
            </Box>
            <Box sx={{height: "50%", width: "100%", borderRadius: "10px"}}>
              <Typography sx={{fontWeight: "bold", fontSize: "1.25rem", color: "white"}}>
              READ MORE -- links to dictionary

              </Typography>
            </Box>


          </Box>

        </Box>
      </Box>
    </Box>
  );
};