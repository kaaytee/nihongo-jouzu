import { Box, Button, Typography, Input, CircularProgress} from '@mui/material';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import { ThemedBox } from '../components/ThemedBox';
import { useNavigate } from 'react-router-dom';

export function Home () {
  let navigate = useNavigate();

  return (
    <>
      <ThemedBox sx={{ flexDirection:"column", padding:"20px", display:"flex", gap:"10px", height:"100%", width:"100%"}}>
        {/* Logo and quick start (just scan) */}
        <Box sx={{gap:"1.4rem", height:"40%", width:"100%", justifyContent:'center', alignItems:"center", display:"flex", flexDirection:"column"}}>
          <SettingsOverscanIcon sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", md: "5rem" },
            color: "white"

          }} />
          <Typography sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "3rem" },
            color: "white"
          }}>
            Nihongo Jouzu
          </Typography>
          <Button sx={{
            fontSize: "1rem",
            color: "white",
            fontWeight: "bold",
            backgroundColor:"#27272A",
            borderRadius: "10px",
            padding:"10px",
            outline: "none",
            border: "none",
            textTransform: 'none',
          }}
          onClick={() => {navigate("/scan")}}
         >
          Start Scanning
          </Button>

        </Box>


        {/* signup / login */}
        {/* <Box sx={{height:"80%", width:"100%", justifyContent:"center", alignItems:"center", backgroundColor:"green", display:"flex", flexDirection:"column"  }}>
        </Box> */}

      </ThemedBox>        
    </>
  )
}