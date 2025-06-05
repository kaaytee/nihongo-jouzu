import { Box, SxProps } from "@mui/material";
import { Theme } from '@mui/material/styles';

export function ThemedBox({ sx, children, onClick }: { sx?: SxProps<Theme>, children?: React.ReactNode, onClick?: () => void }) {
  const defaultStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#09090B',
    borderRadius: '10px',
    boxSizing: 'border-box',
    border: "2px solid #27272A",
  };
  
  return (
    <Box sx={{ ...defaultStyles, ...sx } as SxProps<Theme>} onClick={onClick}>
      {children}
    </Box>
  );
}
