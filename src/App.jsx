import React from 'react';
import './App.css'
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './Nav/Navbar';

function App() {
  return (
    <ThemeProvider>
    <Navbar />
      <p>PTCG Legends 3.0</p>
    </ThemeProvider>
  )
}

export default App
