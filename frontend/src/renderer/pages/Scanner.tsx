import { useState } from 'react';
import { Box, Button, ButtonGroup, TextField, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
export function Scanner() {
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState<"scan" | "input">("scan");

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        gap: '30px',
      }}>

        {/* option selector - scan / input */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '10%',
          width: '100%',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30%',
            width: '90%',
            padding: '10px',
          }}>
            <ButtonGroup fullWidth sx={{
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: '#27272A',
              '& .MuiButton-root': {
                borderRadius: '10px',
              },
            }}>
              <Button onClick= {() => setCurrentOption("scan")} variant="contained" color={currentOption === "scan" ? "primary" : "secondary"} sx={{
                backgroundColor: currentOption === "scan" ? "#09090B" : "#27272A",
                fontWeight: "bold",
                borderRadius: "10px",
              }}>Scan</Button>
              <Button onClick= {() => setCurrentOption("input")}  variant="contained" color={currentOption === "input" ? "primary" : "secondary"} sx={{
                backgroundColor: currentOption === "input" ? "#09090B" : "#27272A",
                fontWeight: "bold",
                borderRadius: "10px",
              }}>Input</Button>

            </ButtonGroup>  

          </Box>
        </Box>


        {/* actual scanner / text box */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90%',
          width: '100%',
          backgroundColor: '#09090B',
          borderRadius: '20px',
          outline: '2px solid #27272A',
        }}>

          {currentOption === "scan" ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
            }}> 
              <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Click to Scan</Typography>
              <IconButton onClick={() => navigate('/analysis')} sx={{
                backgroundColor: "#27272A", 
                borderRadius: "10px",
                padding: "10px",
                marginTop: "10px",
              }}>
                <AddIcon sx={{ fontSize: 40, color: "white" }} />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              }}> 
              
            </Box>
          )}


        </Box>
      </Box>
  )
}