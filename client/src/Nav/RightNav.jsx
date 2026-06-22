import React, { useState, forwardRef, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import twitterIcon from '../assets/social-media-icons/twitter-icon.svg';
import discordIcon from '../assets/social-media-icons/discord-icon.png';
import patreonIcon from '../assets/social-media-icons/patreon-icon.png';
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
  position: fixed;
  top: 0;
  right: 0;

  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};

  width: 330px;
  max-width: 92vw;
  margin: 0;
  padding: 0 18px 18px;

  z-index: 1000;

  list-style: none;
  transition: transform 0.3s ease-in-out;

  background: ${({ theme }) => theme.navBg};
  border-bottom-left-radius: 28px;
  box-shadow: ${({ open }) =>
    open ? '-12px 0 35px rgba(0,0,0,.35)' : 'none'};

  .burgered-links-more a, .mobile-nav-actions-row, .burdered-socials {background: ${({ theme }) => theme.burgerLinkCircle}}
  .burgered-links-more a, .mobile-nav-actions-row, .burdered-socials {box-shadow: ${({ theme }) => theme.burgerLinkInsetBoxShadow}}
  .burgered-links-more a .material-symbols-outlined {color: ${({ theme }) => theme.burgerLinkSymbol}}

  a strong {
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    text-shadow: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 80px;
    right: -145px;
    width: 450px;
    height: 700px;
    background-image: url(${pokeball});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.04;
    pointer-events: none;
    z-index: 3;
    transform: rotate(-20deg);
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
        <li><a href='/cards/CRI'>Cards</a></li>
        <li><a href='/decks'>Decks</a></li>
        <li><a href='/players'>Players</a></li>
      </ul>
      <Overlay open={open} onClick={() => setOpen(false)} />
      <BurgerOpen open={open} theme={theme} className='burgered-links'>
        <div className="mobile-nav-top-bg">
          <div className='mobile-nav-header'>
            <a href='/' className="mobile-nav-brand">
              <img src={pokeball} alt="PTCG Legends" />
              <span>PTCG LEGENDS</span>
            </a>
          </div>
          <svg viewBox="0 0 430 110" preserveAspectRatio="none">
            <path
              d="M0,70 C50,38 115,32 175,46 C235,60 270,88 335,58 C380,38 410,26 430,32 L430,110 L0,110 Z"
              fill={theme.navBg}
            />
          </svg>
        </div>
        <div className="mobile-nav-main-links">
          <a href="/tournaments/completed">
            <span className="material-symbols-outlined">emoji_events</span>
            <strong>Tournaments</strong>
            <span className="material-symbols-outlined mobile-nav-arrow">chevron_right</span>
          </a>
          <a href="/cards/CRI">
            <span className="material-symbols-outlined">style</span>
            <strong>Cards</strong>
            <span className="material-symbols-outlined mobile-nav-arrow">chevron_right</span>
          </a>
          <a href="/decks">
            <span className="material-symbols-outlined">stacks</span>
            <strong>Decks</strong>
            <span className="material-symbols-outlined mobile-nav-arrow">chevron_right</span>
          </a>
          <a href="/players">
            <span className="material-symbols-outlined">groups</span>
            <strong>Players</strong>
            <span className="material-symbols-outlined mobile-nav-arrow">chevron_right</span>
          </a>
        </div>
        <div className="mobile-resources-title">RESOURCES</div>
        <div className='burger-resources'>
          <ul className='burgered-links-more'>
            <li>
              <a href="/archive-updates">
                <span className="material-symbols-outlined">note_alt</span>
                <strong>Archive Updates</strong>
              </a>
            </li>

            <li>
              <a href="/articles/all">
                <span className="material-symbols-outlined">menu_book</span>
                <strong>Articles</strong>
              </a>
            </li>

            <li>
              <a href="/deckbuilder">
                <span className="material-symbols-outlined">construction</span>
                <strong>Deck Builder</strong>
                <span className="new-badge">NEW</span>
              </a>
            </li>

            <li>
              <a
                href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main"
                onClick={(e) => handleLinkClick(e, 'https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main')}
              >
                <span className="material-symbols-outlined">bookmark_stacks</span>
                <strong>Decks by Era</strong>
              </a>
            </li>

            <li>
              <a href="/rules-by-era">
                <span className="material-symbols-outlined">balance</span>
                <strong>Rules by Era</strong>
              </a>
            </li>

            <li>
              <a href="/worlds-booklets">
                <span className="material-symbols-outlined">passport</span>
                <strong>Worlds Booklets</strong>
                <span className="new-badge">NEW</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="mobile-nav-actions-row">
          {user ? (
            <Link to="/account" onClick={() => setOpen(false)} className="mobile-account-link">
              <span className="material-symbols-outlined">person</span>
              <strong>Account</strong>
              <span className="material-symbols-outlined mobile-nav-arrow">chevron_right</span>
            </Link>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="mobile-account-link">
              <span className="material-symbols-outlined">person</span>
              <strong>Login</strong>
              <span className="material-symbols-outlined mobile-nav-arrow">chevron_right</span>
            </Link>
          )}
          <button
            className={`mobile-theme-toggle ${theme.themeName === 'dark' ? 'is-dark' : 'is-light'}`}
            onClick={toggleTheme}
          >
            <span className="material-symbols-outlined mobile-sun-icon"></span>
            <span className="theme-pill">
              <span className="theme-slider">
                <span className="material-symbols-outlined">
                  {theme.themeName === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </span>
            </span>
          </button>
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
