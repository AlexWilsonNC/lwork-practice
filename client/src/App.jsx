import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './Nav/Navbar';
import HomePage from './Homepage/HomePage';
import EventList from './Tournaments/EventList';
import EventPage from './Tournaments/EventPage';
import PlayerDeck from './Tournaments/PlayerDeck';
import CardView from './Cards/CardView';
import Footer from './Footer/Footer';
import BackToTopButton from './Tools/BackToTopButton';

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tournaments/completed" element={<EventList showCompleted={true} />} />
        <Route path="/tournaments/upcoming" element={<EventList showCompleted={false} />} />
        <Route path="/tournaments/:eventId/:division?" element={<EventPage />} />
        <Route path="/tournaments/:eventId/:division/:playerId" element={<PlayerDeck />} />
        <Route path="/card/:set/:number" element={<CardView />} />
      </Routes>
    <BackToTopButton />
    <Footer />
    </>
  )
}

export default App
