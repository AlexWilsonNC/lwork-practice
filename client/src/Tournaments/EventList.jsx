import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Helmet } from 'react-helmet';
import '../css/tournament-calendar.css';
import { sortedEvents } from './tournaments-data';
import CountdownTooltip from '../Tools/RegCountdown';
import SubscriptionForm from './SubForm';

import argentina from '../assets/flags/argentina.png';
import australia from '../assets/flags/australia.png';
import austria from '../assets/flags/austria.png';
import belarus from '../assets/flags/belarus.png';
import belgium from '../assets/flags/belgium.png';
import brazil from '../assets/flags/brazil.png';
import canada from '../assets/flags/canada.png';
import chile from '../assets/flags/chile.png';
import china from '../assets/flags/china.png';
import colombia from '../assets/flags/colombia.png';
import croatia from '../assets/flags/croatia.png';
import czechia from '../assets/flags/czech-republic.png';
import denmark from '../assets/flags/denmark.png';
import ecuador from '../assets/flags/ecuador.png';
import elSalvador from '../assets/flags/el-salvador.png';
import finland from '../assets/flags/finland.png';
import france from '../assets/flags/france.png';
import germany from '../assets/flags/germany.png';
import hongKong from '../assets/flags/hong-kong.png';
import indonesia from '../assets/flags/indonesia.png';
import italy from '../assets/flags/italy.png';
import japan from '../assets/flags/japan.png';
import southKorea from '../assets/flags/korea.png';
import malaysia from '../assets/flags/malaysia.png';
import mexico from '../assets/flags/mexico.png';
import netherlands from '../assets/flags/netherlands.png';
import newZealand from '../assets/flags/new-zealand.png';
import norway from '../assets/flags/norway.png';
import peru from '../assets/flags/peru.png';
import philippines from '../assets/flags/philippines.png';
import poland from '../assets/flags/poland.png';
import portugal from '../assets/flags/portugal.png';
import puertoRico from '../assets/flags/puerto-rico.png';
import russia from '../assets/flags/russia.png';
import singapore from '../assets/flags/singapore.png';
import slovakia from '../assets/flags/slovakia.png';
import southAfrica from '../assets/flags/south-africa.png';
import spain from '../assets/flags/spain.png';
import sweden from '../assets/flags/sweden.png';
import switzerland from '../assets/flags/switzerland.png';
import taiwan from '../assets/flags/taiwan.png';
import thailand from '../assets/flags/thailand.png';
import usa from '../assets/flags/usa.png';
import uk from '../assets/flags/uk.png';
import unknown from '../assets/flags/unknown.png';

const countryNames = {
  'argentina': 'Argentina (Latin America)',
  'australia': 'Australia (Oceania)',
  'austria': 'Austria (Europe)',
  'belarus': 'Belarus (Europe)',
  'belgium': 'Belgium (Europe)',
  'brazil': 'Brazil (Latin America)',
  'canada': 'Canada (North America)',
  'chile': 'Chile (Latin America)',
  'china': 'China (Asia-Pacific)',
  'colombia': 'Colombia (Latin America)',
  'croatia': 'Croatia (Europe)',
  'czechia': 'Czechia (Europe)',
  'denmark': 'Denmark (Europe)',
  'ecuador': 'Ecuador (Latin America)',
  'elSalvador': 'El Salvador (Latin America)',
  'finland': 'Finland (Europe)',
  'france': 'France (Europe)',
  'germany': 'Germany (Europe)',
  'greece': 'Greece (Europe)',
  'hongKong': 'Hong Kong (Asia-Pacific)',
  // '/src/assets/flags/hungary.png': 'Hungary (Europe)',
  // '/src/assets/flags/iceland.png': 'Iceland (Europe)',
  'indonesia': 'Indonesia (Asia-Pacific)',
  // '/src/assets/flags/ireland.png': 'Ireland (Europe)',
  // '/src/assets/flags/im.png': 'Isle of Man (Europe)',
  // '/src/assets/flags/isreal.png': 'Israel (Middle East-South Africa)',
  'italy': 'Italy (Europe)',
  'japan': 'Japan (Asia-Pacific)',
  // '/src/assets/flags/somalia.png': 'Somalia (Middle East-South Africa)',
  'southKorea': 'South Korea (Asia-Pacific)',
  // '/src/assets/flags/lithuania.png': 'Lithuania (Europe)',
  'malaysia': 'Malaysia (Asia-Pacific)',
  // '/src/assets/flags/malta.png': 'Malta (Europe)',
  'mexico': 'Mexico (Latin America)',
  // '/src/assets/flags/morocco.png': 'Moroco (Europe)',
  'netherlands': 'Netherlands (Europe)',
  'newZealand': 'New Zealand (Oceania)',
  // '/src/assets/flags/nicaragua.png': 'Nicaragua (Latin America)',
  'norway': 'Norway (Europe)',
  'peru': 'Peru (Latin America)',
  'philippines': 'Philippines (Asia-Pacific)',
  'poland': 'Poland (Europe)',
  'portugal': 'Portugal (Europe)',
  'puertoRico': 'Puerto Rico (North America)',
  'russia': 'Russia (Russia)',
  'singapore': 'Singapore (Asia-Pacific)',
  'slovakia': 'Slovakia (Europe)',
  // '/src/assets/flags/slovenia.png': 'Slovenia (Europe)',
  'southAfrica': 'South Africa (Middle East-South Africa)',
  'spain': 'Spain (Europe)',
  'sweden': 'Sweden (Europe)',
  'switzerland': 'Switzerland (Europe)',
  'taiwan': 'Taiwan (Asia-Pacific)',
  'thailand': 'Thailand (Asia-Pacific)',
  'uk': 'United Kingdom (Europe)',
  'unknown': 'Unknown',
  'usa': 'USA (North America)',
};

const UpcomingEvents = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
    p {color: ${({ theme }) => theme.text};}
    a {color: ${({ theme }) => theme.text};}
    th {color: ${({ theme }) => theme.text};}

    .search-input .searcheventsfield {
        background: ${({ theme }) => theme.searchBg};
        color: ${({ theme }) => theme.searchTxt};
    }
    @media screen and (max-width: 375px) {
      .searcheventsfield {
          width: 75px;
      }
    }
    .flag-container {
        position: relative;
        display: inline-block;
        text-align: center;
        margin-top: 5px;
    }
    .flag-tooltip {
        visibility: hidden;
        background-color: #1290eb;
        color: white;
        text-align: center;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 10px;
        position: absolute;
        z-index: 9999 !important;
        bottom: 95%;
        left: 35%;
        transform: translateX(-50%);
        white-space: nowrap;
        display: block;
    }
    .flag-container:hover .flag-tooltip {
        visibility: visible;
        opacity: 1;
    }
    .event-list-key {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      margin-top: -5px;
    }
    .event-list-key span {
      margin-right: 5px;
      font-size: 20px;
    }
    #toggleswitchcopy {
      font-size: 14px;
    }
    @media screen and (max-width: 950px) {
      .flag-container {
          margin-top: 0px;
      }
      .event-list-key {
        font-size: 10px;
        margin-top: -10px;
      }
      .event-list-key span {
        font-size: 16px;
      }
    }
    @media screen and (max-width: 700px) {
      .event-list-key {
        margin-left: 10px;
      }
      #toggleswitchcopy {
        font-size: 12px;
      }
    }
    @media screen and (max-width: 530px) {
      .event-list-key {
        font-size: 8px;
        margin-top: -15px;
      }
      .event-list-key span {
        font-size: 12px;
      }
    }
    @media screen and (max-width: 445px) {
      #toggleswitchcopy {
        font-size: 10px;
      }
    }
`;
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    border-radius: 34px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 0.4s;
  }
  span:before {
    content: "";
    position: absolute;
    height: 13px;
    width: 13px;
    left: 3px;
    bottom: 2.5px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
  input:checked + span {
    background-color: #1290eb;
  }
  input:checked + span:before {
    transform: translateX(13px);
  }
  @media screen and (max-width: 700px) {
    margin-right: 25px;
    width: 26px;
    height: 16px;
    span:before {
      height: 12px;
      width: 12px;
      left: 3px;
      bottom: 1.7px;
    }
    input:checked + span:before {
      transform: translateX(9px);
    }
  }
  @media screen and (max-width: 530px) {
    margin-right: 15px;
  }
  @media screen and (max-width: 445px) {
    margin-right: 7px;
    width: 22px;
    height: 14px;
    span:before {
      height: 10px;
      width: 10px;
      left: 3px;
      bottom: 2px;
    }
    input:checked + span:before {
      transform: translateX(7px);
    }
  }
`;
const FilterTop = styled.div`
    select {background: ${({ theme }) => theme.body};}
    select {color: ${({ theme }) => theme.text};}
    button {background: ${({ theme }) => theme.body};}
    button {color: ${({ theme }) => theme.text};}
`;

const regionFlags = {
    'NA': [usa, canada, puertoRico],
    'LA': [brazil, argentina, peru, colombia, mexico, chile, elSalvador, ecuador],
    'EU': [germany, france, uk, spain, poland, austria, belarus, belgium, croatia, czechia, denmark, finland, italy, netherlands, norway, portugal, russia, slovakia, spain, sweden, switzerland],
    'OC': [australia, newZealand],
    'AP': [china, hongKong, indonesia, japan, southKorea, malaysia, philippines, singapore, taiwan, thailand],
    'MS': [southAfrica]
};

function flagNameToKey(url) {
  const base = url.split('/').pop().split('.')[0];
  return base
    .split('-')
    .map((part, i) =>
      i === 0
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join('');
}

const parseRegistrationTime = (timeStr) => {
    return new Date(timeStr);
  };

  const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const saveFiltersWithExpiration = (key, filters) => {
  const now = new Date().getTime();
  const data = { filters, timestamp: now };
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFiltersWithExpiration = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      const now = new Date().getTime();
      if (now - data.timestamp < EXPIRATION_TIME) {
        return data.filters;
      } else {
        console.log(`Filters for ${key} expired and removed.`);
        localStorage.removeItem(key); // Remove expired filters
      }
    }
  } catch (error) {
    console.error(`Error parsing localStorage data for ${key}:`, error);
    localStorage.removeItem(key); // Remove invalid or corrupted data
  }
  return null;
};

const flagKey = Object.entries(countryNames).find(
  ([key, val]) => event.flag === eval(key) // match the imported image variable
)?.[0] || 'unknown';

const EventList = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isUpcomingInitially = !location.pathname.includes("/completed") && !location.pathname.includes("/retro");
    const [showUpcoming, setShowUpcoming] = useState(isUpcomingInitially);
    const [showRetro, setShowRetro] = useState(location.pathname.includes("/retro"));
    const [eventTypeFilter, setEventTypeFilter] = useState(() => loadFiltersWithExpiration('eventTypeFilter') || '');
    const [countryFilter, setCountryFilter] = useState('');
    const [yearFilter, setYearFilter] = useState(() => loadFiltersWithExpiration('yearFilter') || '');
    const [sortOrder, setSortOrder] = useState(() => loadFiltersWithExpiration('sortOrder') || 'newest');
    const [viewType, setViewType] = useState('upcoming');
    const [regionFilter, setRegionFilter] = useState(() => loadFiltersWithExpiration('regionFilter') || '');
    const [searchTerm, setSearchTerm] = useState(() => loadFiltersWithExpiration('searchTerm') || '');
    const [showModal, setShowModal] = useState(false);
    const [showOnlyWithResults, setShowOnlyWithResults] = useState(false);
  
    const uniqueYears = Array.from(new Set(sortedEvents.map(event => new Date(event.date).getFullYear().toString()))).sort();
  
    useEffect(() => {
      const isCompleted = location.pathname.includes("/completed");
      const isRetro = location.pathname.includes("/retro");
      setShowUpcoming(!isCompleted && !isRetro);
      setShowRetro(isRetro);
      setViewType(isRetro ? 'retro' : (isCompleted ? 'completed' : 'upcoming'));
  }, [location.pathname]);

  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

    useEffect(() => {
      saveFiltersWithExpiration('eventTypeFilter', eventTypeFilter);
      saveFiltersWithExpiration('yearFilter', yearFilter);
      saveFiltersWithExpiration('sortOrder', sortOrder);
      saveFiltersWithExpiration('regionFilter', regionFilter);
      saveFiltersWithExpiration('searchTerm', searchTerm);
    }, [eventTypeFilter, yearFilter, sortOrder, regionFilter, searchTerm]);
    
    const filteredEvents = sortedEvents.filter(event => {
      const eventDate = new Date(event.date);
      const eventYear = eventDate.getFullYear().toString();
      const isInRegion = regionFilter ? regionFlags[regionFilter].includes(event.flag) : true;
      const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.eventType.toLowerCase().includes(searchTerm.toLowerCase());

    if (showRetro) {
      return event.eventType === 'retro' &&
        isInRegion &&
        matchesSearchTerm &&
        (eventTypeFilter ? event.eventType === eventTypeFilter : true) &&
        (countryFilter ? event.flag === countryFilter : true) &&
        (yearFilter ? eventYear === yearFilter : true);
    } else {
      return isInRegion &&
        matchesSearchTerm &&
        (eventTypeFilter ? event.eventType === eventTypeFilter : true) &&
        (countryFilter ? event.flag === countryFilter : true) &&
        (yearFilter ? eventYear === yearFilter : true) &&
        (showUpcoming ? eventDate >= new Date() : eventDate < new Date()) &&
        event.eventType !== 'retro' &&
        (!showUpcoming && showOnlyWithResults ? event.id && event.results !== false : true);
    }
  });

  const sortedFilteredEvents = filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
  
      if (showUpcoming) {
          return sortOrder === 'oldest' ? dateB - dateA : dateA - dateB;
      } else {
          return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
      }
  });
      
    const handleButtonClick = (path) => {
      navigate(path);
      setEventTypeFilter('');
      setRegionFilter('');
      setYearFilter('');
    };
  
    const resetFilters = () => {
      setEventTypeFilter('');
      setRegionFilter('');
      setYearFilter('');
      setSortOrder('newest');
      setSearchTerm('');
    };
  
    return (
      <UpcomingEvents className='center-me' theme={theme}>
        <Helmet>
          <title>Pokémon TCG Tournaments</title>
          <meta name="description" content="Upcoming and Completed Pokémon TCG Tournament info, results, and decks." />
          <meta property="og:title" content="PTCG Legends" />
          <meta property="og:description" content="Upcoming and Completed Pokémon TCG Tournament info, results, and decks." />
          <meta property='og:image' content="https://i.ibb.co/mrSpd4V3/legends-thumbnail.png" />
          <meta property="og:url" content="https://www.ptcglegends.com/tournaments" />
          <meta property="og:type" content="website" />
          <meta name="author" content="PTCG Legends" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="PTCG Legends" />
          <meta name="twitter:description" content="Upcoming and Completed Pokémon TCG Tournament info, results, and decks." />
          <meta name="twitter:image" content="https://i.ibb.co/mrSpd4V3/legends-thumbnail.png" />
        </Helmet>
        <div className='upcoming-events'>
          <div className='completed-n-upcoming'>
            <div className='bts-in'>
                <a onClick={() => handleButtonClick("/tournaments/completed")} className={`completed-btn ${!showUpcoming && !showRetro ? 'active-evt-btn' : ''}`}>
                    Completed
                </a>
                <a onClick={() => handleButtonClick("/tournaments/upcoming")} className={`upcoming-btn ${showUpcoming ? 'active-evt-btn' : ''}`}>
                    Upcoming
                </a>
                {/* <span className='grey-line'>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span> */}
                <a onClick={() => handleButtonClick("/tournaments/retro")} className={`retro-btn  ${showRetro ? 'active-evt-btn' : ''}`}>
                    Retro
                </a>
            </div>
            <div className='search-input'>
              <span className="material-symbols-outlined hide-small-event-page">search</span>
              <input type="text" className='searcheventsfield' placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className='right'>
            {!showUpcoming && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                <span id='toggleswitchcopy'>Events with results only</span>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={showOnlyWithResults}
                    onChange={() => setShowOnlyWithResults(prev => !prev)}
                  />
                  <span />
                </ToggleSwitch>
              </div>
            )}
          </div>
          <FilterTop className='filters-top'>
          {!showRetro && (
            <div className='indiv-filter'>
              <p className='sort-events'>Event Type:</p>
              <select value={eventTypeFilter} onChange={e => setEventTypeFilter(e.target.value)}>
                <option value="">All Events</option>
                <optgroup label="Worlds">
                  <option value="worlds">World Championships</option>
                </optgroup>
                <optgroup label="TPCi Events">
                  <option value="internationals">Internationals</option>
                  <option value="regionals">Regionals</option>
                  <option value="speSeries">Special Events</option>
                  {viewType === 'completed' && (<option value="nationals">Nationals</option>)}
                </optgroup>
                <optgroup label="Asia-Pacific">
                  <option value="asiachampionship">Countries Championship</option>
                  <option value="championsLeague">Champions League</option>
                  <option value="premierBallLeague">Premier Ball League</option>
                  {/* {viewType === 'completed' && (<option value="eee">Regional League</option>)} */}
                </optgroup>
                {!showUpcoming && (
                  <optgroup label="WotC Era">
                    <option value="stadiumChallenge">Stadium Challenge</option>
                    <option value="superTrainerShowdown">Super Trainer Showdown</option>
                    <option value="megaTropicalBattle">Tropical Mega Battle</option>
                  </optgroup>
                )}
              </select>
            </div>
          )}
            <div className='indiv-filter'>
              <p className='sort-events'>Region:</p>
              <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                <option value="">All Regions</option>
                <option value="AP">Asia-Pacific</option>
                <option value="EU">Europe</option>
                <option value="LA">Latin America</option>
                <option value="MS">Middle East / South Africa</option>
                <option value="NA">North America</option>
                <option value="OC">Oceania</option>
              </select>
            </div>
            {!showUpcoming && (
              <div className='indiv-filter'>
                <p className='sort-events'>Year:</p>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                  <option value="">All Years</option>
                  {uniqueYears.slice().reverse().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
                {!showUpcoming && (
                    <div className='indiv-filter'>
                    <p className='sort-events'>Order:</p>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="newest">Newest - Oldest</option>
                            <option value="oldest">Oldest - Newest</option>
                        </select>
                  </div>
                )}
                {showUpcoming && (
                    <div className='indiv-filter'>
                    <p className='sort-events'>Order:</p>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="newest">Soonest - Latest</option>
                            <option value="oldest">Latest - Soonest</option>
                        </select>
                  </div>
                )}

              
            <button onClick={resetFilters} className="reset-btn">Reset</button>
          </FilterTop>
          <div className='center'>
            <table className='upcoming-events-table'>
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th></th>
                  <th>Event</th>
                  {!showUpcoming && (
                    <th>Results</th>
                  )}
                  {/* {showUpcoming && (
                    <th>Registration</th>
                  )} */}
                  {showUpcoming && (
                    <th>Information</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedFilteredEvents.map((event, index) => (
                  <tr key={index} className='event-row'>
                    <td>{event.date}</td>
                    <td>
                      <img src={event.eventLogo} className='event-type-logo2' alt="Event type" />
                    </td>
                    <td>
                      <div className='tournament-flags-container'>
                        <div className="flag-container">
                          <img
                            className='tournament-flags'
                            src={event.flag}
                            alt={countryNames[flagKey]}
                          />
                          <div className="flag-tooltip">
                            {countryNames[flagKey]}
                          </div>
                        </div>
                        <div className='country-name-tournaments'></div>
                      </div>
                      <div>
                        <a
                          href={event.id ? event.id : '#'}
                          className='event-wth-link'
                          style={{ pointerEvents: event.id ? 'auto' : 'none' }}
                        >
                          {event.name}
                        </a>
                      </div>
                    </td>

                    {/* For completed events, show the results icon */}
                    {!showUpcoming && (
                      <td>
                        {event.id && event.results !== false ? (
                          <a href={event.id} className='event-icon-links'>
                            <span className="material-symbols-outlined">format_list_bulleted</span>
                          </a>
                        ) : null}
                      </td>
                    )}

                    {/* For upcoming events, show the information icon */}
                    {/* {showUpcoming && (
                      <td>
                        {event.registrationTime ? (
                          <a href={event.registrationLink} className='event-icon-links' target='_blank' style={{ position: 'relative', display: 'inline-block' }}>
                            <CountdownTooltip registrationTime={event.registrationTime} />
                          </a>
                        ) : null}
                      </td>
                    )} */}

                    {/* For upcoming events, show the "note stack" icon */}
                    {showUpcoming && (
                      <td>
                        {event.id && event.results !== false ? (
                          <a href={event.id} className='event-icon-links'>
                            <span className="material-symbols-outlined">description</span>
                          </a>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {showModal && (
              <SubscriptionForm
                sortedEvents={sortedEvents} // Pass sortedEvents as a prop
                closeModal={closeModal} // Pass closeModal function to close the modal
              />
            )}
          </div>
          {/* {showUpcoming && (
            <p className='marginbottom event-list-key'>
              <span className="material-symbols-outlined reg-icon">edit_note</span>
              represents that an event's registration is / was live (not taking into account if capped or closed).
            </p>
          )}
          {showUpcoming && (
            <p className='marginbottom event-list-key'>
            <span className="material-symbols-outlined reg-icon">schedule</span>
            signifies that the event's registration has been scheduled + countdown timer for your convenience. 
            </p>          
          )} */}
        </div>
      </UpcomingEvents>
    );
  };
  
  export default EventList;
  