import { Box, SxProps } from "@mui/material";
import { Theme } from '@mui/material/styles';

export function ThemedBox({ sx, children}: { sx?: SxProps<Theme>, children?: React.ReactNode }) {
  const centeredFlexColumn: SxProps<Theme> = {
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
  
  return (
    <Box sx={{ ...centeredFlexColumn, ...sx } as SxProps<Theme>}>
      {children}
    </Box>
  );
}
