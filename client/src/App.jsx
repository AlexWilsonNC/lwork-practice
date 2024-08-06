import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './Nav/Navbar';
import HomePage from './Homepage/HomePage';
import EventList from './Tournaments/EventList';
import EventPage from './Tournaments/EventPage';
import PlayerDeck from './Tournaments/PlayerDeck';
import DecksPage from './Decks/DecksPage';
import DeckProfile from './Decks/DeckProfile';
import CardsPage from './Cards/CardsPage';
import CardView from './Cards/CardView';
import Players from './Players/Players';
import PlayerProfile from './Players/PlayerProfile';
import ArchiveUpdates from './ArchiveUpdates/ArchiveUpdates';
import AllArticlesPage from './ArticleComponents/AllArticlesPage';
import ArticleComponent from './ArticleComponents/ArticleComponent';
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
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/deck/:id" component={DeckProfile} />
        <Route path="/cards/:setName" element={<CardsPage />} />
        <Route path="/card/:set/:number" element={<CardView />} />
        <Route path="/players" element={<Players />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/archive-updates" element={<ArchiveUpdates />} />
        <Route path="/articles/all" element={<AllArticlesPage />} />
        <Route path="/articles/:articleId" element={<ArticleComponent />} />
      </Routes>
      <BackToTopButton />
      <Footer />
    </>
  );
}

export default App;
