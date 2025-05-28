import { Button } from "@mui/material";

export function DictionaryOptionButton({option, setOption, label}: {option: string, setOption: (option: string) => void, label: string}) {
  return (
    <Button 
    sx={{
      fontSize: "1rem",
      color: "white",
      fontWeight: "bold",
      backgroundColor: option === label ? "#09090B" : "#27272A",
      outline: "none",
      border: "none",
      textTransform: 'none',
      '&:hover': {
        backgroundColor: option === label ? "#09090B" : "#27272A",
      }
    }}
    onClick={() => setOption(label)}
  >
    {label}
  </Button>

 
  );
}