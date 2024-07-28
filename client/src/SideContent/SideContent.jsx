import React from 'react';
import { Link } from 'react-router-dom';
import TwitterWidget from './TweetFeed';
import styled from 'styled-components';

const SideContainer = styled.div`
  h4 {color: ${({ theme }) => theme.text};}
  p {color: ${({ theme }) => theme.text};}
  li {color: ${({ theme }) => theme.text};}
`;

const SidebarComponent = () => {
  return (
    <SideContainer className='homepage-side'>
      <div className='side-section'>
        <h4>Helpful Resources:</h4>
        <ul>
          <li><Link to='/tournaments/completed'>Completed Events</Link></li>
          <li><Link to='/tournaments/upcoming'>Upcoming Events</Link></li>
          <li><Link to='../decks-by-era/main' className='not-ready'>Decks by Era</Link></li>
          <li><Link to='../other/rules-by-era' className='not-ready'>Rules by Era</Link></li>
          <li><Link to='/cards/TWM'>Pokémon Card Database</Link></li>
          <li><Link to='../other/expansions' className='not-ready'>TCG Expansions</Link></li>
          <li><Link to='../other/timeline' className='not-ready'>Historic Timeline</Link></li>
          <li><Link to='../other/worlds-booklets' className='not-ready'>World's Booklets</Link></li>
          <li><a href='https://www.seagrovetcg.com/event-finder' target='_blank' rel='noopener noreferrer'>Local Event Finder</a></li>
        </ul>
      </div>

      <div className='side-section'>
        <h4>Popular Pages:</h4>
        <ol>
          <li><Link to='../decks-by-era/2010/dp-ul' className='not-ready'>2010 Decks by Era (DP - UL)</Link></li>
          <li><Link to='/tournaments/2023_WORLDS'>2023 World Championships</Link></li>
          <li><Link to='../articles/other/greatest-players-in-history' className='not-ready'>Greatest Players in History</Link></li>
          <li><Link to='/tournaments/2002_WORLDS'>2002 World Championships</Link></li>
          <li><Link to='/tournaments/2010_WORLDS'>2010 World Championships</Link></li>
        </ol>
      </div>

      <div className='side-section'>
        <div className='flex-row'>
          <img className='side-icon' src='https://cdn-icons-png.freepik.com/512/8716/8716450.png' alt='Help us Archive' />
          <h4>Help us Archive:</h4>
        </div>
        <p>Don't see a certain deck documented? Have a missing decklist or information from a past
          tournament? Would you like to write articles? Spot a mistake? Please submit all inquiries to our
          email address here: <a className='one-more-link' href='mailto:ptcglegends@gmail.com'>ptcglegends@gmail.com</a> ~ Thank you!</p>
      </div>

      <TwitterWidget />
    </SideContainer>
  );
};

export default SidebarComponent;
