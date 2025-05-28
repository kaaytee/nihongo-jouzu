import { Box, Chip } from "@mui/material";

export function GroupedLabels({labels}: {labels?: string[]}) {
  return (
    <>
      <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", gap: "10px", width: "100%"}}>
        <Chip label="N5" color="default" sx={{backgroundColor: "white", color: "black", fontWeight: "bold", fontSize: "1rem"}}/>
        <Chip label="Strokes: 8" color="default" sx={{padding: "0px", backgroundColor: "#27272A", color: "white", fontWeight: "bold", fontSize: "1rem"}}/>
        <Chip label="Freq: 100" sx={{padding: "0px", backgroundColor: "#27272A", color: "white", fontWeight: "bold", fontSize: "1rem"}}/>
      </Box>
    </>
  )
}