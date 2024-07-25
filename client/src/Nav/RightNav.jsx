import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import twitterIcon from '../assets/social-media-icons/twitter-icon.svg';
import discordIcon from '../assets/social-media-icons/discord-icon.png';
import patreonIcon from '../assets/social-media-icons/patreon-icon.webp';
import emailIcon from '../assets/social-media-icons/email-icon.png';
import '../css/nav.css';

const BurgerOpen = styled.ul`
    display: flex;
    flex-direction: column;
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    width: 330px;
    padding-top: 3.5rem;
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

const RightNav = ({ open }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='right-nav'>
      <ul open={open} className="right-links">
        <li><a href='/tournaments/completed'>Tournaments</a></li>
        <li><a href=''>Decks</a></li>
        <li><a href='/cards'>Cards</a></li>
        <li><a href=''>Players</a></li>
        <li><a href=''><span className="material-symbols-outlined">search</span></a></li>
      </ul>
      <BurgerOpen open={open} theme={theme} className='burgered-links'>
        <ToggleButton className="toggle-darkmode" onClick={toggleTheme}>
          <span className="material-symbols-outlined"></span>
        </ToggleButton>
        <li><a href='/tournaments/completed'><span className='burg-tourney'>Tournaments</span>Completed</a></li>
        <li><a href='/tournaments/upcoming'><span className='burg-tourney'>Tournaments</span>Upcoming</a></li>
        <li><a href=''>Decks</a></li>
        <li><a href=''>Players</a></li>
        <li><a href=''>Articles</a></li>
        <div className='burger-resources'>
          <p>Resources:</p>
          <ul className='burgered-links-more'>
            <li><a href=''><span className='new-resource'>New</span> Deck Builder</a></li>
            <li><a href=''>Archive Updates</a></li>
            <li><a href=''>Card Database</a></li>
            <li><a href=''>Rules by Era</a></li>
            <li><a href=''>TCG Expansions</a></li>
            <li><a href=''>Worlds Booklets</a></li>
          </ul>
        </div>
        <div className='burdered-socials'>
          <a href='https://twitter.com/PTCG_Legends' target='_blank' rel="noopener noreferrer"><img src={twitterIcon} alt="social-icon" /></a>
          <a href='https://discord.com/invite/P8vKM8REr4' target='_blank' rel="noopener noreferrer"><img src={discordIcon} alt="social-icon" /></a>
          <a href='https://www.patreon.com/PTCGLegends' target='_blank' rel="noopener noreferrer"><img src={patreonIcon} alt="social-icon" /></a>
          <a href='mailto:ptcglegends@gmail.com'><img src={emailIcon} alt="social-icon" /></a>
        </div>
      </BurgerOpen>
    </div>
  );
}

export default RightNav;
