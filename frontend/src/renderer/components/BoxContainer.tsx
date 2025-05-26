import { Box } from "@mui/material";


export function BoxContainer({ children, height="100%", width="100%", backgroundColor="none" }
  : { children: React.ReactNode, height?: string, width?: string, backgroundColor?: string }) {
  return (
    <Box sx={{  
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: height,
      width: width,
      backgroundColor: backgroundColor,
    }}>
      {children}
    </Box>
  );
}