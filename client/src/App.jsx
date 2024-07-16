import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './Nav/Navbar';
import HomePage from './Homepage/HomePage';
import EventList from './Tournaments/EventList';
import EventPage from './Tournaments/EventPage';

import Footer from './Footer/Footer';

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tournaments/completed" element={<EventList showCompleted={true} />} />
      <Route path="/tournaments/upcoming" element={<EventList showCompleted={false} />} />
      <Route path="/tournaments/:eventId/:division?" element={<EventPage />} />

    </Routes>
    <Footer />
    </>
  )
}

export default App