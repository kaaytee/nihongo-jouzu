import { MemoryRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import { Scanner } from './pages/Scanner';
import { Analysis } from './pages/Analysis';
import { Dictionary } from './pages/Dictionary';
import { useEffect } from 'react';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/scan');
    }
  }, [location.pathname, navigate]);

  return (
    <>
        <div className='app'>
          <div className='app-header'>
            <h1>{location.pathname}</h1>
          </div>
          <div className='app-content'>
              <Routes>
                <Route path="/" element={<Scanner/>} />
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
