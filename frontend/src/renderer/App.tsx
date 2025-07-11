import { MemoryRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import { Scanner } from './pages/Scanner';
import { Analysis } from './pages/Analysis';
import { Dictionary } from './pages/Dictionary';
import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Home } from './pages/Home';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <>
        <div className='app'>
          {location.pathname !== '/' && <Box sx={{ gap: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
              <Button sx={{height: '50px', width: '100px', fontWeight: 'bold', color: 'white', backgroundColor: '#27272A', borderRadius: '10px'}} onClick={() => navigate('/scan')}>Scan</Button>
              <Button sx={{height: '50px', width: '100px', fontWeight: 'bold', color: 'white', backgroundColor: '#27272A', borderRadius: '10px'}} onClick={() => navigate('/')}>Home</Button>

              <Button sx={{height: '50px', width: '100px', fontWeight: 'bold', color: 'white', backgroundColor: '#27272A', borderRadius: '10px'}} onClick={() => navigate('/dictionary/')}>Dictionary</Button>
          </Box>}
          <div className='app-content'>
              <Routes>
                <Route path="/" element={<Home/>} />
                {/* <Route path="/login" element={<LoginPage />} /> */}
                {/* <Route path="/register" element={<RegisterPage />} /> */}
                <Route path="/scan" element={<Scanner />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/dictionary/:phrase" element={<Dictionary />} />
                <Route path="/dictionary" element={<Dictionary />} />


              </Routes>
          </div>
        </div>

    </>
  );
}
