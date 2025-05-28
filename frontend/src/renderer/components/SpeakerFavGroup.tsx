import { IconButton, Box } from "@mui/material";

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export function SpeakerFavGroup() {

  return (
      <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
        <IconButton>
          <VolumeUpIcon sx={{color: "white"}} />
        </IconButton>
        <IconButton>
          <FavoriteBorderIcon sx={{color: "white"}} />
        </IconButton>
      </Box>
  ) 
}