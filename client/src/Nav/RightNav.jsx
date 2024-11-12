import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import twitterIcon from '../assets/social-media-icons/twitter-icon.svg';
import discordIcon from '../assets/social-media-icons/discord-icon.png';
import patreonIcon from '../assets/social-media-icons/patreon-icon.webp';
import emailIcon from '../assets/social-media-icons/email-icon.png';
import Modal from '../Tools/Interstitial'; // Assuming the modal component exists
import '../css/nav.css';

const BurgerOpen = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    max-height: 100vh;
    width: 330px;
    padding-top: 0.3rem;
    padding-left: 1.5rem;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    font-size: 24px;
    font-weight: 600;

    background-color: ${({ theme }) => theme.burgerMenu};

    a {
      color: ${({ theme }) => theme.burgerTxt};
    }
`;

const ToggleButton = styled.div`
  border-radius: 50%;
  border: ${({ theme }) => theme.themeBorder};
  background-color: ${({ theme }) => theme.themeBg};
  span::before {
    content: ${({ theme }) => theme.themeName === 'dark' ? "'light_mode'" : "'dark_mode'"}; 
    color: ${({ theme }) => theme.themeColor};
  }
`;

const RightNav = forwardRef(({ open, setOpen, dark }, ref) => {
  const { theme, toggleTheme } = useTheme();
  
  // State for managing the interstitial modal
  const [showModal, setShowModal] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  // Handle link click for external links
  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setExternalUrl(url); // Store the URL to navigate to after confirmation
    setShowModal(true);   // Show the interstitial modal
  };

  const handleConfirm = () => {
    setShowModal(false);
    window.location.href = externalUrl; // Redirect to the external site
  };

  const handleClose = () => {
    setShowModal(false); // Close the modal without redirecting
  };

  return (
    <div className='right-nav' ref={ref}>
      <ul open={open} className="right-links">
        <li><a href='/tournaments/completed'>Tournaments</a></li>
        <li><a href='/decks'>Decks</a></li>
        <li><a href='/cards/SSP'>Cards</a></li>
        <li><a href='/players'>Players</a></li>
      </ul>
      <BurgerOpen open={open} theme={theme} className='burgered-links'>
        <ToggleButton className="toggle-darkmode" onClick={toggleTheme}>
          <span className="material-symbols-outlined"></span>
        </ToggleButton>
        <li><a href='/tournaments/completed'>Completed Events</a></li>
        <li><a href='/tournaments/upcoming'>Upcoming Events</a></li>
        <li><a href='/decks'>Decks</a></li>
        <li><a href='/cards/SSP'>Cards</a></li>
        <li><a href='/players'>Players</a></li>
        <div className='burger-resources'>
          <p>Resources:</p>
          <ul className='burgered-links-more'>
            <li><a href='/archive-updates'>Archive Updates</a></li>
            <li><a href='/articles/all' className='not-ready'>Articles</a></li>
            <li className='not-ready'><a href=''>Deck Builder</a></li>
            {/* Trigger interstitial for the "Decks by Era" link */}
            <li>
              <a href='https://alexwilsonnc.github.io/tes/decks-by-era/main' onClick={(e) => handleLinkClick(e, 'https://alexwilsonnc.github.io/tes/decks-by-era/main')}>
                Decks by Era
              </a>
            </li>
            <li className='not-ready'><a href=''>Rules by Era</a></li>
            <li className='not-ready'><a href=''>Worlds Booklets</a></li>
          </ul>
        </div>
        <div className='burdered-socials'>
          <a href='https://twitter.com/PTCG_Legends' target='_blank' rel="noopener noreferrer"><img src={twitterIcon} alt="social-icon" /></a>
          <a href='https://discord.com/invite/P8vKM8REr4' target='_blank' rel="noopener noreferrer"><img src={discordIcon} alt="social-icon" /></a>
          <a href='https://www.patreon.com/PTCGLegends' target='_blank' rel="noopener noreferrer"><img src={patreonIcon} alt="social-icon" /></a>
          <a href='mailto:ptcglegends@gmail.com'><img src={emailIcon} alt="social-icon" /></a>
        </div>
      </BurgerOpen>

      {/* Modal for external link confirmation */}
      <Modal
        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        externalLink={externalUrl}
      />
    </div>
  );
});

export default RightNav;
