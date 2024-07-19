import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/eventpage.css';
import { displayResults } from './event-results';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

import regional25 from '../assets/event-logo/regionals-2025.png';
import regionals from '../assets/event-logo/regionals-hd.png';
import internats25 from '../assets/event-logo/internats-2025.png';
import speSeries from '../assets/event-logo/spe.png';
import worlds from '../assets/event-logo/worlds-hd.png';
import malaysiaChampionships from '../assets/event-logo/ch-malaysia.png';
import hongkongChampionships from '../assets/event-logo/ch-hongkong.png';
import indonesiaChampionships from '../assets/event-logo/ch-indonesia.png';
import philippenesChampionships from '../assets/event-logo/ch-philippenes.png';
import singaporeChampionships from '../assets/event-logo/ch-singapore.png';
import taiwanChampionships from '../assets/event-logo/ch-taiwan.png';
import thailandChampionships from '../assets/event-logo/ch-thailand.png';
import japanChampionships from '../assets/event-logo/jp-nationals.png';
import ogInternats from '../assets/event-logo/internats-logo-hd.png';
import koreaLeague from '../assets/event-logo/korean-league.png';
import wotcWorlds from '../assets/event-logo/worlds-2002.png';
import worldsOten from '../assets/event-logo/2010worlds.png';
import worldsOnine from '../assets/event-logo/2009worlds.jpg';
import worldsOeight from '../assets/event-logo/2008worlds.png';
import worldsOSeven from '../assets/event-logo/2007worlds.png';
import worldsOsix from '../assets/event-logo/2006worlds.png';
import worldsOfive from '../assets/event-logo/2005worlds.png';
import worldsOfour from '../assets/event-logo/2004worlds.png';
import nationals from '../assets/event-logo/nats-logo.png';
import retro from '../assets/event-logo/retro.png';

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
const flags = {
    usa: usa,
    italy: italy,
    southAfrica: southAfrica,
    indonesia: indonesia,
    japan: japan,
    mexico: mexico,
    peru: peru,
    philippines: philippines,
    chile: chile,
    singapore: singapore,
    colombia: colombia,
    sweden: sweden,
    thailand: thailand,
    puertoRico: puertoRico,
    southKorea: southKorea,
    argentina: argentina,
    australia: australia,
    austria: austria,
    belarus: belarus,
    belgium: belgium,
    brazil: brazil,
    canada: canada,
    china: china,
    croatia: croatia,
    czechia: czechia,
    denmark: denmark,
    ecuador: ecuador,
    elSalvador: elSalvador,
    finland: finland,
    france: france,
    germany: germany,
    hongKong: hongKong,
    malaysia: malaysia,
    netherlands: netherlands,
    newZealand: newZealand,
    norway: norway,
    poland: poland,
    portugal: portugal,
    russia: russia,
    slovakia: slovakia,
    spain: spain,
    switzerland: switzerland,
    taiwan: taiwan,
    uk: uk,
    unknown: unknown,
}
const logos = {
    retro: retro,
    regionals: regionals,
    speSeries: speSeries,
    ogInternats: ogInternats,
    worlds: worlds,
    indonesiaChampionships: indonesiaChampionships,
    japanChampionships: japanChampionships,
    philippenesChampionships: philippenesChampionships,
    thailandChampionships: thailandChampionships,
    singaporeChampionships: singaporeChampionships,
    koreaLeague: koreaLeague,
    regional25: regional25,
    internats25: internats25,
    malaysiaChampionships: malaysiaChampionships,
    hongkongChampionships: hongkongChampionships,
    taiwanChampionships: taiwanChampionships,
    wotcWorlds: wotcWorlds,
    nationals: nationals,
    worldsOten: worldsOten,
    worldsOnine: worldsOnine,
    worldsOeight: worldsOeight,
    worldsOSeven: worldsOSeven,
    worldsOsix: worldsOsix,
    worldsOfive: worldsOfive,
    worldsOfour: worldsOfour,
}

const EventPageContent = styled.div`
    background: ${({ theme }) => theme.body};
    .event-option:hover {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        cursor: pointer;
    }
    .active-option {
        background: ${({ theme }) => theme.body};
    }
    .results-list-item {
        color: ${({ theme }) => theme.text};
    }
    .player-list-hover:nth-of-type(odd) {
        background-color: ${({ theme }) => theme.playerlisthover};
    }
    .notavailable {
        color: ${({ theme }) => theme.text};
    }
    .active-option {
            color: ${({ theme }) => theme.text};
    }
`;

const EventPage = () => {
    const { theme } = useTheme();
    const { eventId, division: divisionParam } = useParams();
    const [eventData, setEventData] = useState(null);
    const [division, setDivision] = useState('masters');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/events/${eventId}`);
            if (response.ok) {
                const data = await response.json();
                setEventData(data);
            } else {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, [eventId]);

    useEffect(() => {
        if (divisionParam) {
            setDivision(divisionParam);
        }
    }, [divisionParam]);

    if (!eventData) {
        return <div></div>;
    }

    const results = division === 'masters' ? eventData.masters :
                    division === 'seniors' ? eventData.seniors :
                    division === 'juniors' ? eventData.juniors :
                    division === 'professors' ? eventData.professors : [];

    const getPlayerCount = (division) => {
        switch (division) {
            case 'masters':
                return (
                    <>
                        {eventData.dayOneMasters && (
                            <p><strong>Day 1:</strong> {eventData.dayOneMasters}</p>
                        )}
                        {eventData.dayTwoMasters && (
                            <p><strong>Day 2:</strong> {eventData.dayTwoMasters}</p>
                        )}
                    </>
                );
            case 'professors':
                return (
                    <>
                        {eventData.dayOneMasters && (
                            <p><strong>Day 1:</strong> {eventData.dayOneMasters}</p>
                        )}
                        {eventData.dayTwoMasters && (
                            <p><strong>Day 2:</strong> {eventData.dayTwoMasters}</p>
                        )}
                    </>
                );
            case 'seniors':
                return (
                    <>
                        {eventData.dayOneSeniors && (
                            <p><strong>Day 1:</strong> {eventData.dayOneSeniors}</p>
                        )}
                    </>
                );
            case 'juniors':
                return (
                    <>
                        {eventData.dayOneJuniors && (
                            <p><strong>Day 1:</strong> {eventData.dayOneJuniors}</p>
                        )}
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <EventPageContent className='center' theme={theme}>
            <Helmet>
                <title>{eventData.name}</title>
                <meta name="description" content={`Results, decks and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`} />
                <meta property="og:title" content={eventData.name} />
                <meta property="og:description" content={`Results, decks and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`} />
                <meta property="og:image" content={eventData.thumbnail} />
                <meta property="og:url" content={`https://www.ptcglegends.com/tournaments/${eventData.eventId}`} />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={eventData.name} />
                <meta name="twitter:description" content={`Results, decks and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`} />
                <meta name="twitter:image" content={eventData.thumbnail} />
            </Helmet>
            <div className='regional-container'>
            <div className='top-divisions'>
                    {eventData.masters ? (
                        <Link
                            className={`mastersBtn ${division === 'masters' ? 'active-division' : 'other-division'}`}
                            to={`/tournaments/${eventId}/masters`}
                            style={{ opacity: 1, pointerEvents: 'all' }}
                        >Masters</Link>
                    ) : eventData.professors ? (
                        <Link
                            className={`professorsBtn ${division === 'professors' ? 'active-division' : 'other-division'}`}
                            to={`/tournaments/${eventId}/professors`}
                            style={{ opacity: 1, pointerEvents: 'all' }}
                        >Professors</Link>
                    ) : null}
                    <Link
                        className={`seniorsBtn ${division === 'seniors' ? 'active-division' : 'other-division'}`}
                        to={`/tournaments/${eventId}/seniors`}
                        style={{ opacity: eventData.seniors ? 1 : 0.1, pointerEvents: eventData.seniors ? 'all' : 'none' }}
                    >Seniors</Link>
                    <Link
                        className={`juniorsBtn ${division === 'juniors' ? 'active-division' : 'other-division'}`}
                        to={`/tournaments/${eventId}/juniors`}
                        style={{ opacity: eventData.juniors ? 1 : 0.1, pointerEvents: eventData.juniors ? 'all' : 'none' }}
                    >Juniors</Link>
                </div>
                <div className='regional-info'>
                    <div className='left-regional-info'>
                        <h2>{eventData.name}</h2>
                        <p>{eventData.date}</p>
                        <div className='place-n-flag'>
                            <img src={flags[eventData.flag]} alt={`Flag of ${eventData.flag.toUpperCase()}`} />
                            <p>{eventData.location}</p>
                        </div>
                        {eventData.address && (
                            <p>Venue Address: <a href={eventData.address} target="_blank">Map</a></p>
                        )}
                        {(eventData.streamsDay1 || eventData.streamsDay2 || eventData.streamsDay3) && (
                            <p>Streams:&nbsp;
                                {eventData.streamsDay1 && <a href={eventData.streamsDay1} target="_blank">Day 1</a>}
                                {eventData.streamsDay1 && eventData.streamsDay2 && " | "}
                                {eventData.streamsDay2 && <a href={eventData.streamsDay2} target="_blank">Day 2</a>}
                                {(eventData.streamsDay2 && eventData.streamsDay3) && " | "}
                                {eventData.streamsDay3 && <a href={eventData.streamsDay3} target="_blank">Finals</a>}
                            </p>
                        )}
                    </div>
                    <img className='regional-info-bg-logo' src={logos[eventData.eventLogo]} alt='event logo' />
                    <hr className='reg-hr'></hr>
                    <div className='outer-links'>
                        {eventData.organizer && (
                            <p><strong>Organizer:</strong> <a href={eventData.organizerLink} target="_blank">{eventData.organizer}</a></p>
                        )}
                        {eventData.format && (
                            <p><strong>Format:</strong> {eventData.format}</p>
                        )}
                        {getPlayerCount(division)}
                    </div>
                </div>
                <div className='bottom-options'>
                     <a className='event-option active-option'>Results</a>
                     <a className='event-option' style={{opacity: 0.1, pointerEvents: 'none'}}>Statistics</a>
                     <a className='event-option' style={{opacity: 0.1, pointerEvents: 'none'}}>Photos</a>
                     {/* <a className='event-option'>Info</a> */}
                 </div>
                 <div className='contain-event'>
                     <div className='event-content'>
                        <div className='event-results'>
                            {results?.length > 0 ? displayResults(results, eventId, division) : <p className='notavailable'>Results from this event are not yet available.</p>}
                        </div>
                    </div>
                 </div>
            </div>
        </EventPageContent>
    );
};

export default EventPage;
