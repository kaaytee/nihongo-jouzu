import { MemoryRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import { Scanner } from './pages/Scanner';
import { Analysis } from './pages/Analysis';
import { Dictionary } from './pages/Dictionary';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { Home } from './pages/Home';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <>
        <div className='app'>
          <div className='app-header'>
            <h1>{location.pathname}</h1>
            {/* placeholder buttons travel for now */}
            <nav>
              <Button sx={{height: '50px', width: '100px', fontWeight: 'bold', color: 'white', backgroundColor: '#27272A', borderRadius: '10px'}} onClick={() => navigate('/scan')}>Scan</Button>
              <Button sx={{height: '50px', width: '100px', fontWeight: 'bold', color: 'white', backgroundColor: '#27272A', borderRadius: '10px'}} onClick={() => navigate('/')}>Home</Button>
              
              <Button sx={{height: '50px', width: '100px', fontWeight: 'bold', color: 'white', backgroundColor: '#27272A', borderRadius: '10px'}} onClick={() => navigate('/dictionary/example')}>Dictionary</Button>
            </nav>
          </div>
          <div className='app-content'>
              <Routes>
                <Route path="/" element={<Home/>} />
                {/* <Route path="/login" element={<LoginPage />} /> */}
                {/* <Route path="/register" element={<RegisterPage />} /> */}
                <Route path="/scan" element={<Scanner />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/dictionary/:phrase" element={<Dictionary />} />

              </Routes>
          </div>
        </div>

    </>
  );
}
