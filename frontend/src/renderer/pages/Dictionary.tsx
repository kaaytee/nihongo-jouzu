import { useParams } from "react-router-dom";
import { ThemedBox } from "../components/ThemedBox";
import { Box, Typography } from "@mui/material";

export function Dictionary() {
  const { phrase } = useParams();
  
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
        <ThemedBox sx={{height:"20%"}}>
          <Typography sx={{fontSize: "1rem", color: "grey", textAlign: "center", width: "100%", alignSelf: "center"}}>
            Search for {phrase}
          </Typography>
        </ThemedBox>
        <Box 
          sx={{ 
            display: "flex", 
            gap:"20px", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "center", 
            height:"80%", width:"100%"}}
        >
          <ThemedBox sx={{height:"100%", width:"30%"}}>
          </ThemedBox>
          <ThemedBox sx={{height:"100%", width:"80%"}}>
          </ThemedBox>
        </Box>
      </Box>
    </>
  );
}