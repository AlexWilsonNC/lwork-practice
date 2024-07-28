import React from 'react';
import { Link } from 'react-router-dom';
import TwitterWidget from './TweetFeed';

const SidebarComponent = () => {
  return (
    <div className='homepage-side'>
      <div className='side-section'>
        <h4>Helpful Resources:</h4>
        <ul>
          {/* <li><Link to='../tournaments/upcoming'>Upcoming Tournaments</Link></li>
          <li><Link to='../tournaments/completed'>Completed Tournaments</Link></li>
          <li><Link to='../decks-by-era/main'>Decks by Era</Link></li>
          <li><Link to='../other/rules-by-era'>Rules by Era</Link></li>
          <li><Link to='../worlds/main'>World Championships</Link></li>
          <li><Link to='../major-events/main'>Internationals, Nats & more</Link></li>
          <li><Link to='../card-database'>Pokémon Card Database</Link></li>
          <li><Link to='../other/expansions'>TCG Expansions</Link></li>
          <li><Link to='../other/timeline'>Historic Timeline</Link></li>
          <li><Link to='../other/worlds-booklets'>World's Booklets</Link></li>
          <li><a href='https://www.seagrovetcg.com/event-finder' target='_blank' rel='noopener noreferrer'>Local Event Finder</a></li> */}
        </ul>
      </div>

      <div className='side-section'>
        <h4>Popular Pages:</h4>
        <ol>
          {/* <li><Link to='../decks-by-era/2010/dp-ul'>2010 Decks by Era (DP - UL)</Link></li>
          <li><Link to='../worlds/2023/summary'>2023 World Championships</Link></li>
          <li><Link to='../decks-by-era/2018/sum-lot'>2018 Decks by Era (SUM - LOT)</Link></li>
          <li><Link to='../articles/other/greatest-players-in-history'>Greatest Players in History</Link></li>
          <li><Link to='../decks-by-era/2006/hl-hp'>2006 Decks by Era (HL - HP)</Link></li>
          <li><Link to='../articles/retro/blastoise-mega-battle'>1st Ever Pokémon Tournament Footage (1998)</Link></li>
          <li><Link to='../worlds/2002/summary'>2002 World Championships</Link></li>
          <li><Link to='../decks-by-era/1999/bs-fossil'>1999 Decks by Era (Base - Fossil)</Link></li>
          <li><Link to='../worlds/2010/summary'>2010 World Championships</Link></li>
          <li><Link to='../decks-by-era/2017/prc-gri'>2017 Decks by Era (PRC - GRI)</Link></li> */}
        </ol>
      </div>

      <div className='side-section'>
        <div className='flex-row'>
          <img className='side-icon' src='https://cdn-icons-png.freepik.com/512/8716/8716450.png' alt='Help us Archive' />
          <h4>Help us Archive:</h4>
        </div>
        <p>Don't see a certain deck listed under a format? Have a missing decklist or information from a past
          tournament? Would you like to write articles? Spot a mistake? Please submit all inquiries to our
          email address here: <a className='one-more-link' href='mailto:ptcglegends@gmail.com'>ptcglegends@gmail.com</a>. Thank you!</p>
      </div>

      <TwitterWidget />
    </div>
  );
};

export default SidebarComponent;
