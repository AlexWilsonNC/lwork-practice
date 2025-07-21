import React, { useState, forwardRef, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import twitterIcon from '../assets/social-media-icons/twitter-icon.svg';
import discordIcon from '../assets/social-media-icons/discord-icon.png';
import patreonIcon from '../assets/social-media-icons/patreon-icon.webp';
import emailIcon from '../assets/social-media-icons/email-icon.png';
import Modal from '../Tools/Interstitial';
import '../css/nav.css';
import pokeball from '../assets/logos/blue-ultra-ball.png';

const Overlay = styled.div`
  display: ${({ open }) => open ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  z-index: 999;
  transition: transform 0.5s ease-in-out;
`;

const BurgerOpen = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    max-height: 100vh;
    width: 330px;
    padding-top: 0.3rem;
    padding-left: 1.5rem;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    font-size: 24px;
    font-weight: 600;
    overflow: hidden;
    background-color: ${({ theme }) => theme.burgerMenu};

    .burger-nav-hr {
      border-bottom: ${({ theme }) => theme.burgernavhr};
    }

    a {
      color: ${({ theme }) => theme.burgerTxt};
    }

    &::before {
    content: '';
    position: absolute;
    top: -15%;
    left: -30%;
    width: 700px;
    height: 700px;
    padding-bottom: 80%;
    transform: rotate(-45deg);
    background-image: url(${pokeball});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.1;
    pointer-events: none;
  }
`;

const ToggleButton = styled.div`
  border-radius: 50%;
  border: ${({ theme }) => theme.themeBorder};
  background-color: ${({ theme }) => theme.themeBg};
  margin-left: 215px;
  span::before {
    content: ${({ theme }) => theme.themeName === 'dark' ? "'brightness_4'" : "'dark_mode'"}; 
    color: ${({ theme }) => theme.themeColor};
  }
`;

const RightNav = forwardRef(({ open, setOpen, dark }, ref) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useContext(AuthContext);  // null when not logged in
  
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
        <li><a href='/cards/BLK'>Cards</a></li>
        <li><a href='/players'>Players</a></li>
      </ul>
      <Overlay open={open} onClick={() => setOpen(false)} />
      <BurgerOpen open={open} theme={theme} className='burgered-links'>
        <div className='top-login-diff'>
          <div className='login-slash-account-btn'>
            {user
              ? <li className='not-ready'><Link to="/account">Account</Link></li>
              : <li className='not-ready'><Link to="/login">Login</Link></li>
            }
          </div>
          <ToggleButton className="toggle-darkmode" onClick={toggleTheme}>
            <span className="material-symbols-outlined"></span>
          </ToggleButton>
        </div>
        <hr className='burger-nav-hr'></hr>
        <li><a href='/tournaments/completed'>Tournaments</a></li>
        <li><a href='/decks'>Decks</a></li>
        <li><a href='/cards/BLK'>Cards</a></li>
        <li><a href='/players'>Players</a></li>
        <div className='burger-resources'>
          <ul className='burgered-links-more'>
            <li><a href='/archive-updates'>Archive Updates</a></li>
            <li><a href='/articles/all' className='not-ready'>Articles</a></li>
            <li className='not-ready'><a href=''>Deck Builder</a></li>
            {/* Trigger interstitial for the "Decks by Era" link */}
            <li>
              <a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main' onClick={(e) => handleLinkClick(e, 'https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main')}>
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
