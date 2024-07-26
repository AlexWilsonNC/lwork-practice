import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import ScrollToTop from './contexts/ScrollToTopAuto'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
