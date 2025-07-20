import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import Navbar from './Nav/Navbar';
import HomePage from './Homepage/HomePage';
import EventList from './Tournaments/EventList';
import EventPage from './Tournaments/EventPage';
import LiveStandings from './Live/LiveStandings';
import PlayerDeck from './Tournaments/PlayerDeck';
import DecksPage from './Decks/DecksPage';
import DeckProfile from './Decks/DeckProfile';
import FeaturedDecks from './Decks/FeaturedDecks';
import CardsPage from './Cards/CardsPage';
import CardView from './Cards/CardView';
import Players from './Players/Players';
import PlayerProfile from './Players/PlayerProfile';
import ArchiveUpdates from './ArchiveUpdates/ArchiveUpdates';
import AllArticlesPage from './ArticleComponents/AllArticlesPage';
import ArticleComponent from './ArticleComponents/ArticleComponent';
import About from './About/About';
import DeckCalculator from './Tools/DeckCalculator';
import Footer from './Footer/Footer';
import BackToTopButton from './Tools/BackToTopButton';
import NotFound from './Catch/NotFound';
import DeckBuilder from './DeckBuilder/DeckBuilder';

function App() {
  const { pathname } = useLocation()
  const noFooterOn = ['/ljhksdgbnksgkjsiodsfi', '/ljhksdgbnksgkjsiodsfi']

  return (
    <div className="all-app-container">
      <Navbar />
      <main className='mainwrapedcontainer'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournaments/completed" element={<EventList showCompleted={true} />} />
          <Route path="/tournaments/upcoming" element={<EventList showCompleted={false} />} />
          <Route path="/tournaments/retro" element={<EventList showCompleted={false} />} />
          <Route path="/tournaments/:eventId/:division?" element={<EventPage />} />
          <Route path="/live" element={<LiveStandings />} />
          <Route path="/tournaments/:eventId/:division/:playerId" element={<PlayerDeck />} />
          <Route path="/decks" element={<DecksPage />} />
          {/* <Route path="/decks-by-era" element={<FeaturedDecks />} /> */}
          <Route path="/sgdf35h4dfg" element={<FeaturedDecks />} />
          <Route path="/deck/:id" element={<DeckProfile />} />
          <Route path="/cards/:setName" element={<CardsPage />} />
          <Route path="/card/:set/:number" element={<CardView />} />
          <Route path="/players" element={<Players />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/archive-updates" element={<ArchiveUpdates />} />
          <Route path="/articles/all" element={<AllArticlesPage />} />
          <Route path="/articles/:articleId" element={<ArticleComponent />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/deckbuilder" element={<DeckBuilder />} /> */}
          <Route path="/ljhksdgbnksgkjsiodsfi" element={<DeckBuilder />} />
          <Route path="/deckcalculator" element={<DeckCalculator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <BackToTopButton />
      </main>
      { !noFooterOn.includes(pathname) && <Footer/> }
    </div>
  );
}

export default App;
