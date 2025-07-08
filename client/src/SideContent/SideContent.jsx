import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TwitterWidget from './TweetFeed';
import styled from 'styled-components';
import Modal from '../Tools/Interstitial';

const SideContainer = styled.div`
  h4 {color: ${({ theme }) => theme.text};}
  p {color: ${({ theme }) => theme.text};}
  li {color: ${({ theme }) => theme.text};}
`;

const SidebarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  const handleLinkClick = (e, url) => {
    e.preventDefault(); // Prevent default link behavior
    setExternalUrl(url); // Store the URL to navigate to after confirmation
    setShowModal(true); // Show the interstitial modal
  };

  const handleConfirm = () => {
    setShowModal(false);
    window.location.href = externalUrl; // Redirect to the external site
  };

  const handleClose = () => {
    setShowModal(false); // Close the modal without redirecting
  };

  return (
    <SideContainer className='homepage-side'>
      <div className='side-section'>
        <h4>Helpful Resources:</h4>
        <ul>
          <li><Link to='/tournaments/completed'>Completed Events</Link></li>
          <li><Link to='/tournaments/upcoming'>Upcoming Events</Link></li>
          {/* Trigger interstitial for the "Decks by Era" link */}
          <li><a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main' onClick={(e) => handleLinkClick(e, 'https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main')}>Decks by Era</a></li>
          <li><Link to='' className='not-ready'>Rules by Era</Link></li>
          <li><Link to='/cards/DRI'>Card Database</Link></li>
          <li><Link to='' className='not-ready'>World's Booklets</Link></li>
          <li><a href='https://www.seagrovetcg.com/event-finder' target='_blank' rel='noopener noreferrer'>Local Event Finder</a></li>
        </ul>
      </div>

      <div className='side-section'>
        <h4>Popular Pages:</h4>
        <ol>
          <li><Link to='/player/jason-klaczynski-US'>Jason Klaczynski's Player Page</Link></li>
          <li><Link to='/player/tord-reklev-NO'>Tord Reklev's Player Page</Link></li>
          <li><Link to='/tournaments/2010_WORLDS'>2010 World Championships</Link></li>
          <li><Link to='/tournaments/2002_WORLDS'>2002 World Championships</Link></li>
          <li><Link to='/tournaments/2024_WORLDS'>2024 World Championships</Link></li>

        </ol>
      </div>

      <div className='side-section'>
        <div className='flex-row'>
          <img className='side-icon' src='https://cdn-icons-png.freepik.com/512/8716/8716450.png' alt='Help us Archive' />
          <h4>Help us Archive:</h4>
        </div>
        <p>Don't see a certain deck documented? Have a missing decklist or result from a past
          tournament? Spot a mistake? Would you like to write articles? Please reach out to us at <a className='one-more-link' href='mailto:ptcglegends@gmail.com'>ptcglegends@gmail.com</a>.</p>
      </div>

       <blockquote
        className="twitter-timeline"
        data-theme="light"
        data-height="500"
      >
        <a href="https://twitter.com/PTCG_Legends?ref_src=twsrc%5Etfw">
          Tweets by @PTCG_Legends
        </a>
      </blockquote>

      {/* Modal for external link confirmation */}
      <Modal 
        show={showModal} 
        handleClose={handleClose} 
        handleConfirm={handleConfirm} 
        externalLink={externalUrl}
      />
    </SideContainer>
  );
};

export default SidebarComponent;
