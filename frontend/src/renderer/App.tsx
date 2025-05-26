import { MemoryRouter as Router, Routes, Route, BrowserRouter, HashRouter, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import icon from '../../assets/icon.svg';
import './App.css';
import { Scanner } from './pages/Scanner';
import { Button } from '@mui/material';
import { Analysis } from './pages/Analysis';

function Hello() {
  return (
    <>
      <h1>Hello</h1>
    </>
  );
}

export default function App() {
  return (
    <>
      <div className='app'>

        <div className='app-header'>
          <h1>Hello</h1>
        </div>
        <div className='app-content'>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Scanner/>} />
              {/* <Route path="/login" element={<LoginPage />} /> */}
              {/* <Route path="/register" element={<RegisterPage />} /> */}
              <Route path="/scan" element={<Scanner />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/dictionary" element={<></>} />

            </Routes>
          </HashRouter>
        </div>
      </div>

    </>
  );
}
