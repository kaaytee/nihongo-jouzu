import { useState } from 'react';
import { Box, Button, ButtonGroup, TextField, Typography, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

interface CapturedSnip {
  dataUrl: string;
  cropRect: { x: number; y: number; width: number; height: number };
}

export function Scanner() {
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState<"scan" | "input">("scan");
  const [capturedImage, setCapturedImage] = useState<string | null>(null); 
  const [isCapturing, setIsCapturing] = useState<boolean>(false); 
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const handleScanClick = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCapturedImage(null);

    // TODO: refactor this so it stops looking ugly
    try {
      if (window.electron && window.electron.ipcRenderer) {
        const snipData: CapturedSnip | null = await window.electron.ipcRenderer.invoke('capture-screen-snip');
        if (snipData && snipData.dataUrl && snipData.cropRect) {
          const img = new Image();
          img.onload = async () => { 
            const canvas = document.createElement('canvas');
            canvas.width = snipData.cropRect.width;
            canvas.height = snipData.cropRect.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(
                img,
                snipData.cropRect.x, snipData.cropRect.y,
                snipData.cropRect.width, snipData.cropRect.height,
                0, 0,
                snipData.cropRect.width, snipData.cropRect.height
              );
              const croppedDataUrl = canvas.toDataURL('image/png');
              setCapturedImage(croppedDataUrl);

              // interact with backend
              try {
                console.log('Attempting to send image to backend for translation...');
                const backendResponse = await window.electron.api.sendImageForTranslation(croppedDataUrl);
                console.log('Successfully sent image to backend for translation.');
                if (backendResponse) {
                  console.log('backendResponse:', backendResponse);
                  setTranslatedText(backendResponse.translated_text);
                } else {
                  console.log('Backend response did not contain translated_text:', backendResponse);
                }
              } catch (uploadError) {
                console.error('Failed to send image for translation or process backend response:', uploadError);
              }

            } else {
              console.error('Could not get canvas context');
              setCapturedImage(snipData.dataUrl); 
            }
          };
          img.onerror = () => {
            console.error('Failed to load image for cropping.');
            setCapturedImage(null);
          };
          img.src = snipData.dataUrl;
        } else {
          console.log('Screen snip was cancelled or failed.');
          setCapturedImage(null);
        }
      } else {
        console.error('Electron IPC not available. Are you running in Electron?');
      }
    } catch (error) {
      console.error('Error during screen capture:', error);
      setCapturedImage(null);
    } finally {
      setIsCapturing(false);
    }
  };

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
          overflow: 'hidden',
        }}>

          {currentOption === "scan" ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px', 
              width: '100%',
              height: '100%',
              gap: '20px', 
            }}> 
              {isCapturing ? (
                <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Capturing...</Typography>
              ) : capturedImage ? (
                <>
                  <img 
                    src={capturedImage} 
                    alt="Screen Snip" 
                    style={{ maxWidth: 'calc(100% - 40px)', maxHeight: 'calc(100% - 80px)', objectFit: 'contain' }} 
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleScanClick} 
                    sx={{ 
                      marginTop: '15px', 
                      backgroundColor: '#27272A', 
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#3f3f46', 
                      }
                    }}
                  >
                    Take Another Screenshot
                  </Button>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Click to Scan</Typography>
                  <IconButton onClick={handleScanClick} sx={{
                    backgroundColor: "#27272A", 
                    borderRadius: "10px",
                    padding: "10px",
                    marginTop: "10px",
                    '&:hover': {
                      backgroundColor: '#3f3f46',
                    }
                  }}>
                    <AddIcon sx={{ fontSize: 40, color: "white" }} />
                  </IconButton>
                </>
              )}
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
        {capturedImage && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            boxSizing:'border-box',
            backgroundColor: '#09090B',
            borderRadius: '20px',
            outline: '2px solid #27272A',
            overflow: 'hidden',
            gap: '20px',
          }}>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>Translated Text</Typography>
            { translatedText !== null 
            ? <Typography sx={{ fontSize: "2.5rem", color: "white" }}>{translatedText}</Typography>  
            : <CircularProgress sx={{ '--CircularProgress-size': '100px' }}></CircularProgress>}
            
            {translatedText && <Button 
                    sx={{fontWeight: "bold", fontSize: "0.9375rem", color: "white", backgroundColor: "#27272A", borderRadius: "10px"}}
                    onClick={() => {
                      navigate(`/analysis`, {state: {text: translatedText}});
                    }}
            >
              Analyze
            </Button>}
          </Box>
        )}
      </Box>
  )
}