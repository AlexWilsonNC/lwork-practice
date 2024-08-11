import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Helmet } from 'react-helmet';
import '../css/tournament-calendar.css';
import { sortedEvents } from './tournaments-data';

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

const parseRegistrationTime = (timeStr) => {
    return new Date(timeStr);
  };

const EventList = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isUpcomingInitially = !location.pathname.includes("/completed");
    const [showUpcoming, setShowUpcoming] = useState(isUpcomingInitially);
    const [eventTypeFilter, setEventTypeFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [viewType, setViewType] = useState('upcoming');
    const [regionFilter, setRegionFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const uniqueYears = Array.from(new Set(sortedEvents.map(event => new Date(event.date).getFullYear().toString()))).sort();

    useEffect(() => {
        const isCompleted = location.pathname.includes("/completed");
        setShowUpcoming(!isCompleted);
        setViewType(isCompleted ? 'completed' : 'upcoming');
    }, [location.pathname]);

    const filteredEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        const eventYear = eventDate.getFullYear().toString();
        const isInRegion = regionFilter ? regionFlags[regionFilter].includes(event.flag) : true;
        const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.eventType.toLowerCase().includes(searchTerm.toLowerCase());

        return isInRegion  // Checks if the event's flag is in the selected region
        && matchesSearchTerm // Checks if the event name or type matches the search term
            && (eventTypeFilter ? event.eventType === eventTypeFilter : true) // Event type filter
            && (countryFilter ? event.flag === countryFilter : true) // Country filter
            && (yearFilter ? eventYear === yearFilter : true) // Year filter
            && (showUpcoming ? eventDate >= new Date() : eventDate < new Date()); // Date filter for upcoming or completed
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
    const sortedFilteredEvents = !showUpcoming ? filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    }) : filteredEvents;

    return (
        <UpcomingEvents className='center-me' theme={theme}>
            <Helmet>
                <title>Pokémon TCG Tournaments</title>
                <meta name="description" content="Upcoming and Completed Pokémon TCG Tournament info, results, and decks." />
                <meta property="og:title" content="PTCG Legends" />
                <meta property="og:description" content="Upcoming and Completed Pokémon TCG Tournament info, results, and decks." />
                <meta property='og:image' content="https://i.ibb.co/gw8gG0B/imageedit-10-7777594416.png" />
                <meta property="og:url" content="https://www.ptcglegends.com/tournaments" />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PTCG Legends" />
                <meta name="twitter:description" content="Upcoming and Completed Pokémon TCG Tournament info, results, and decks." />
                <meta name="twitter:image" content="https://i.ibb.co/gw8gG0B/imageedit-10-7777594416.png" />
            </Helmet>
            <div className='upcoming-events'>
                <div className='completed-n-upcoming'>
                    <div className='bts-in'>
                        <a onClick={() => handleButtonClick("/tournaments/completed", false)} className={`completed-btn ${!showUpcoming ? 'active-evt-btn' : ''}`}>
                            Completed
                        </a>
                        <a onClick={() => handleButtonClick("/tournaments/upcoming", true)} className={`upcoming-btn ${showUpcoming ? 'active-evt-btn' : ''}`}>
                            Upcoming
                        </a>
                    </div>
                    <div className='search-input'>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" className='searcheventsfield' placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <FilterTop className='filters-top'>
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
                                <option value="eee">Regional League</option>
                            </optgroup>
                            {!showUpcoming && (
                            <optgroup label="WotC Era">
                                <option value="stadiumChallenge">Stadium Challenge</option>
                                <option value="superTrainerShowdown">Super Trainer Showdown</option>
                                <option value="megaTropicalBattle">Tropical Mega Battle</option>
                            </optgroup>
                                )}
                            <optgroup label="Other">
                                <option value="retro">Modern-Retro Events</option>
                            </optgroup>
                        </select>
                    </div>
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
                                {showUpcoming && (
                                    <th>Registration</th>
                                )}
                                {showUpcoming && (
                                    <th>Information</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event, index) => (
                                <tr key={index} className='event-row'>
                                    <td>{event.date}</td>
                                    <td><img src={event.eventLogo} className='event-type-logo2' alt="Event type" /></td>
                                    <td>
                                        <div className='tournament-flags-container'>
                                            <img className='tournament-flags' src={event.flag} alt="Country flag" />
                                            <div className='country-name-tournaments'></div>
                                        </div>
                                        <div>
                                            <a
                                                href={event.results === false ? '#' : event.id}
                                                className={`event-wth-link ${event.results === false ? 'disabled-link' : ''}`}
                                                style={{ pointerEvents: event.results === false ? 'none' : 'auto' }}
                                            >
                                                {event.name}
                                            </a>
                                        </div>
                                    </td>
                                    {showUpcoming && (
                                        <td>
                                            {event.registrationTime ? (
                                                <a href={event.registrationLink} className='event-icon-links'>
                                                    <span className="material-symbols-outlined reg-icon">
                                                        {parseRegistrationTime(event.registrationTime) > new Date() ? 'schedule' : 'edit_note'}
                                                    </span>
                                                </a>
                                            ) : null}
                                        </td>
                                    )}
                                    {!showUpcoming && (
                                        <td>
                                            {event.results !== false && event.id ? (
                                                <a href={event.id} className='event-icon-links'><span className="material-symbols-outlined">format_list_bulleted</span></a>
                                            ) : null}
                                        </td>
                                    )}
                                    {showUpcoming && (
                                        <td>{event.id ? <a href={event.id} className='event-icon-links'><span className="material-symbols-outlined">note_stack</span></a> : null}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </UpcomingEvents>
    );
};

export default EventList;