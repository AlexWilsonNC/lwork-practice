import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import DisplayPokemonSprites from '../Tournaments/pokemon-sprites';
import { getCustomLabel } from '../Tournaments/pokemon-labels';
import { flags, countryNames } from '../Tools/flags';

import regional25 from '../assets/event-logo/regionals-2025.png';
import regionals from '../assets/event-logo/regionals-hd.png';
import internats25 from '../assets/event-logo/internats-2025.png';
import speSeries from '../assets/profile-pics/play-pokemon-logo.png';
import worlds from '../assets/event-logo/worlds-hd.png';
import premierBallLeague from '../assets/event-logo/premier-ball-league.png';
import malaysiaChampionships from '../assets/event-logo/ch-malaysia.png';
import hongkongChampionships from '../assets/event-logo/ch-hongkong.png';
import indonesiaChampionships from '../assets/event-logo/ch-indonesia.png';
import philippenesChampionships from '../assets/event-logo/ch-philippenes.png';
import singaporeChampionships from '../assets/event-logo/ch-singapore.png';
import taiwanChampionships from '../assets/event-logo/ch-taiwan.png';
import thailandChampionships from '../assets/event-logo/ch-thailand.png';
import japanChampionships from '../assets/event-logo/jp-nationals.png';
import ogInternats from '../assets/event-logo/internats-logo.png';
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
import oldNationals from '../assets/event-logo/old-nats-logo.png';
import oFourNationals from '../assets/event-logo/nats-logo-04.png';
import retro from '../assets/event-logo/retro.png';
import stadiumChallenge from '../assets/event-logo/stadium-challenge-wotc.png';
import fourStadiumChallenge from '../assets/event-logo/old-stadium-challenge.png';
import superTrainerShowdown from '../assets/event-logo/super-trainer-showdown-logo.png';
import megaTropicalBattle from '../assets/event-logo/mega-tropical-battle.png';
import championsLeague from '../assets/event-logo/champions-league.png';

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
    oldNationals: oldNationals,
    oFourNationals: oFourNationals,
    stadiumChallenge: stadiumChallenge,
    superTrainerShowdown: superTrainerShowdown,
    fourStadiumChallenge: fourStadiumChallenge,
    megaTropicalBattle: megaTropicalBattle,
    championsLeague: championsLeague,
}

const PlayerProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
    &.center-error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    background-image: url(${({ theme }) => theme.unknownplayer});
    background-size: 50vh;
    background-position: center;
    background-repeat: no-repeat;
  }
    @media screen and (max-width: 1000px) {
        .center-error {
            height: 60vh !important;
        }
    }
    .search-input .searcheventsfield {
        background: ${({ theme }) => theme.searchBg};
        color: ${({ theme }) => theme.searchTxt};
    }
  table {
    margin-top: 15px;
    font-size: 14px;
  }
  .results-table th:nth-child(2) {
    padding-left: 5px;
  }
  .small-suffix {
    font-size: 10px;
  }
    .white-link {
        color: ${({ theme }) => theme.text};
    }
  .player-deck-icons .material-symbols-outlined {
    opacity: 1;
    transition: opacity 0.3s;
    color: ${({ theme }) => theme.text};
  }
    .player-deck-icons .material-symbols-outlined:hover {
    color: #1290eb;
    }
    .player-deck-icons .material-symbols-outlined.no-decklist {
     opacity: 0;
     pointer-events: none;
    }
    .player-deck-icons a.no-decklist {
    pointer-events: none;
    }
    .deck-tooltip-container {
    position: relative;
    display: inline-flex;
    align-items: center;
}
.deck-tooltip {
    visibility: hidden;
    background-color: #1290eb;
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 12px;
    position: absolute;
    z-index: 9999 !important;
    bottom: 45%;
    left: 52.5%;
    transform: translateX(-50%);
    white-space: nowrap;
    display: block;
}
.deck-tooltip-container:hover .deck-tooltip {
    visibility: visible;
    opacity: 1;
}
     .day1btn, .day2btn, .conversbtn {
    background-color: ${({ theme }) => theme.day1btn};
  }
    .results-table td a:hover {
    color: #1290eb;
  }
    .chart-button.active {
    background-color: #1290eb;
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
        left: 140%;
        transform: translateX(-50%);
        white-space: nowrap;
        display: block;
    }
    .flag-container:hover .flag-tooltip {
        visibility: visible;
        opacity: 1;
    }
    .dq-player {
        text-decoration: line-through;
        opacity: 0.6;
    }
    .accomplishments-card {
        background: ${({ theme }) => theme.themeName === 'dark' ? '#181a1f' : '#f5f8fc'};
        border: 1px solid ${({ theme }) => theme.themeName === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
    }
    .accomplishments-table td {
        text-align: center;
        padding: 13px 10px;
        background: ${({ theme }) => theme.themeName === 'dark' ? '#22252b' : '#fff'};
    }
    .division-filter-buttons button {
        background: ${({ theme }) => theme.themeName === 'dark' ? '#22252b' : '#fff'};
        color: ${({ theme }) => theme.text};
    }
`;
const getCountryName = (code) => {
    return countryNames[code] || 'Unknown';
};

const parseDate = (dateString) => {
    const year = dateString.split(', ')[1];
    const monthDay = dateString.split(', ')[0].split(' - ')[0];
    return new Date(`${monthDay}, ${year}`);
};

const formatName = (name) => {
    const lowercaseWords = ['de', 'of', 'the', 'van', 'der'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.', 'mk', 'jc'];

    const specialCases = {
        'de haes damien': 'De Haes Damien',
        'jamie depamphilis': 'Jamie DePamphilis',
        'der cherng lee': 'Der Cherng Lee',
    };

    const lowerCaseName = name.toLowerCase();
    if (specialCases[lowerCaseName]) {
        return specialCases[lowerCaseName];
    }

    return name
        .toLowerCase()
        .split(' ')
        .map(word =>
            word
                .split('-')
                .map(part =>
                    part
                        .split("'")
                        .map(subPart => {
                            if (lowercaseWords.includes(subPart.toLowerCase())) {
                                return subPart.toLowerCase();
                            } else if (uppercaseWords.includes(subPart.toLowerCase())) {
                                return subPart.toUpperCase();
                            } else if (subPart.startsWith('mc')) {
                                return subPart.charAt(0).toUpperCase() + 'c' + subPart.charAt(2).toUpperCase() + subPart.slice(3);
                            } else {
                                return subPart.charAt(0).toUpperCase() + subPart.slice(1);
                            }
                        })
                        .join("'")
                )
                .join("-")
        )
        .join(' ');
};

const formatDate = (dateString) => {
    const year = dateString.split(', ')[1];
    const monthDay = dateString.split(', ')[0].split(' - ')[0];
    return `${monthDay}, ${year}`;
};

const getPlacementSuffix = (placement) => {
    const j = placement % 10;
    const k = placement % 100;
    let suffix;
    if (j === 1 && k !== 11) {
        suffix = 'st';
    } else if (j === 2 && k !== 12) {
        suffix = 'nd';
    } else if (j === 3 && k !== 13) {
        suffix = 'rd';
    } else {
        suffix = 'th';
    }
    return (
        <span>
            {placement}
            <span className="small-suffix">{suffix}</span>
        </span>
    );
};

const PlayerProfile = () => {
    const { id } = useParams();
    const { theme } = useTheme();
    const [player, setPlayer] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('date'); // Default sorting by date
    const decodedId = decodeURIComponent(id);
    const splitAt = decodedId.lastIndexOf('-');
    const rawName = decodedId.substring(0, splitAt);
    const playerFlag = decodedId.substring(splitAt + 1);
    const [showAllResults, setShowAllResults] = useState(false);
    const [accomplishmentDivision, setAccomplishmentDivision] = useState('all');
    const formattedName = rawName
        .split(/[-\s]+/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/players/${id}`);
                if (!response.ok) {
                    throw new Error('Player not found');
                }
                const data = await response.json();
                setPlayer(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPlayerData();
    }, [id]);

    if (error) {
        return (
            <PlayerProfileContainer theme={theme} className="center-error">
                <h2>No Player Profile Found</h2>
                <br></br>
                <br></br>
                <p className='unknown-player-txt-wdth'>
                    Either <strong>{formattedName} ({playerFlag})</strong> has no Day 2 results in our database, or there's an error with the "player-flag" data in the URL, if you believe this to be an error, please contact us at <a href='mailto:ptcglegends@gmail.com' style={{ color: '#1290eb' }}>ptcglegends@gmail.com</a>.
                    <br></br><br></br>
                    <br></br><br></br>
                    <span className='small-text-info'>(NOTE: Even though we've begun to have Day 1 results & decklists available for 2025 events, those players are not integrated into our database if they've not yet had a seperate Day 2 performance, as that would be waaay too much data...)</span>
                </p>
            </PlayerProfileContainer>
        );
    }

    if (!player) {
        return;
    }

    const sortedResults = player.results.sort((a, b) => {
        if (sortCriteria === 'date') {
            return parseDate(b.eventDate) - parseDate(a.eventDate);
        } else if (sortCriteria === 'placement') {
            return a.placement - b.placement;
        }
        return 0;
    });

    const filteredResults = sortedResults.filter(result =>
        result.eventId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleResults = showAllResults
        ? filteredResults
        : filteredResults.slice(0, 10);

    const getEventCategory = (result) => {
        const name = result.eventName?.toLowerCase() || '';
        const logo = result.eventLogo || '';

        if (name.includes('retro') || logo.includes('retro')) {
            return 'other';
        }

        if (name.includes('world championship') || logo.includes('worlds')) {
            return 'worlds';
        }

        if (name.includes('international') || name.includes('naic') || name.includes('laic') || name.includes('euic') || name.includes('ocic') || logo.includes('internats')) {
            return 'internationals';
        }

        if (
            name.includes('regional') ||
            name.includes('special event') ||
            name.includes('spe') ||
            name.includes('special championship') ||
            name.includes('special championships') ||
            logo.includes('regionals') ||
            logo.includes('speSeries')
        ) {
            return 'regionals';
        }

        return 'other';
    };

    const accomplishmentRows = [
        { label: '1st Place', filter: r => r.placement === 1 },
        { label: '2nd Place', filter: r => r.placement === 2 },
        { label: 'Top 4', filter: r => r.placement >= 3 && r.placement <= 4 },
        { label: 'Top 8', filter: r => r.placement >= 5 && r.placement <= 8 },
        { label: 'Top 16', filter: r => r.placement >= 9 && r.placement <= 16 },
        { label: 'Top 32', filter: r => r.placement >= 17 && r.placement <= 32 },
        { label: 'Top 64+', filter: r => r.placement > 32 },
    ];

    const accomplishmentColumns = [
        { key: 'worlds', label: 'Worlds' },
        { key: 'internationals', label: 'Internationals' },
        { key: 'regionals', label: 'Regionals / SPEs' },
        { key: 'other', label: 'Other Events' },
    ];

    const divisionFilteredResults = player.results.filter(result => {
        if (accomplishmentDivision === 'all') return true;
        return result.division?.toLowerCase() === accomplishmentDivision;
    });

    const accomplishmentSummary = accomplishmentRows.map(row => ({
        ...row,
        counts: accomplishmentColumns.reduce((acc, col) => {
            acc[col.key] = divisionFilteredResults.filter(result =>
                row.filter(result) && getEventCategory(result) === col.key
            ).length;
            return acc;
        }, {})
    }));

    const getEventLink = (eventId) => {
        return `/tournaments/${eventId}`;
    };

    const getDivisionAbbreviation = (division) => {
        switch (division.toLowerCase()) {
            case 'masters':
                return '(Ma)';
            case 'seniors':
                return '(Sr)';
            case 'juniors':
                return '(Jr)';
            case 'professors':
                return '(Ma)';
            case 'olderseniors':
                return '(Sr)';
            case 'youngseniors':
                return '(Sr)';
            case 'all':
                return '';
            default:
                return division;
        }
    };

    const isSpecialEvent = (name, flag, eventId) => {
        const specialCases = [
            { name: 'igor costa', flag: 'US', events: ['2012_WORLDS', '2014_WORLDS', '2015_WORLDS'], newFlag: 'PT' },
            { name: 'james cox', flag: 'NL', events: ['2019_WORLDS', '2020_LAIC', '2022_WORLDS'], newFlag: 'AU' },
        ];

        for (const specialCase of specialCases) {
            if (name.toLowerCase() === specialCase.name && flag === specialCase.flag && specialCase.events.includes(eventId)) {
                return specialCase.newFlag;
            }
        }

        return flag; // Return the original flag if no special case matches
    };

    return (
        <PlayerProfileContainer theme={theme} className='center-me'>
            <Helmet>
                <title>{formatName(player.name)}</title>
                <meta
                    name='description'
                    content={`All of ${formatName(player.name)}'s documented major results on PTCG Legends.`}
                />
                <meta property='og:title' content="Player Profile" />
                <meta
                    property='og:description'
                    content={`All of ${formatName(player.name)}'s documented major results on PTCG Legends.`}
                />
                {/* <meta property='og:image' content={eventData.thumbnail} /> */}
                {/* <meta
                    property='og:url'
                    content={`https://www.ptcglegends.com/player/${normalizeName(result.playerName)}-${result.playerFlag}`}
                /> */}
                <meta property='og:type' content='website' />
                <meta name='author' content='PTCG Legends' />
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content="Player Profile" />
                <meta
                    name='twitter:description'
                    content={`All of ${formatName(player.name)}'s documented major results on PTCG Legends.`}
                />
                {/* <meta name='twitter:image' content={eventData.thumbnail} /> */}
            </Helmet>
            <div className='player-results-container meep'>
                <div className='completed-n-upcoming'>
                    <div className='bts-in'>
                        <div className="flag-container">
                            <img
                                className='flag-size'
                                src={flags[player.flag]}
                                alt="flag"
                            />
                            <div className="flag-tooltip">
                                {getCountryName(player.flag)}
                            </div>
                        </div>
                        <h1>{formatName(player.name)}</h1>
                    </div>
                    {/* <div className='search-input'>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className='searcheventsfield'
                            placeholder="Search results..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div> */}
                </div>
                <div className='sort-buttons'>
                    <button
                        className={`chart-button day2btn ${sortCriteria === 'date' ? 'active' : ''}`}
                        onClick={() => setSortCriteria('date')}
                    >
                        Sort by Date
                    </button>
                    <button
                        className={`chart-button day1btn ${sortCriteria === 'placement' ? 'active' : ''}`}
                        onClick={() => setSortCriteria('placement')}
                    >
                        Sort by Placement
                    </button>
                </div>
                <table className='results-table'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event</th>
                            <th>Placement</th>
                            <th>Deck</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleResults.map((result, index) => (
                            <tr key={index}>
                                <td>{formatDate(result.eventDate)}</td>
                                <td className='center-content'>
                                    <img src={logos[result.eventLogo]} className='event-type-logo3' alt="Event type" />
                                    <Link className='white-link' to={`${getEventLink(result.eventId, result.eventName)}/${result.division}`}>
                                        {result.eventName}
                                    </Link>
                                </td>
                                <td>{getPlacementSuffix(result.placement)} <span className='divisionplacementopaque'>{getDivisionAbbreviation(result.division)}</span></td>
                                <td className='player-deck-icons center-content player-profile-sprites'>
                                    {(() => {
                                        const sprite1 = result.sprite1 === 'blank' ? '' : result.sprite1;
                                        const sprite2 = result.sprite2 || '';
                                        const deckLabel = getCustomLabel(result.eventId, result.sprite1, result.sprite2);
                                        const deckUrl =
                                            deckLabel && result.eventFormat
                                                ? `/deck/${encodeURIComponent(deckLabel)}?format=${encodeURIComponent(result.eventFormat)}`
                                                : null;

                                        const SpriteContent = (
                                            <div className="deck-tooltip-container">
                                                {sprite1 && (
                                                    <img
                                                        className="sprite"
                                                        src={`/assets/sprites/${sprite1}.png`}
                                                        alt="sprite"
                                                    />
                                                )}
                                                {sprite2 && sprite2 !== sprite1 && (
                                                    <img
                                                        className={sprite1 ? 'sprite second-sprite' : 'sprite'}
                                                        src={`/assets/sprites/${sprite2}.png`}
                                                        alt="sprite"
                                                    />
                                                )}
                                                {deckLabel && (
                                                    <div className="deck-tooltip">
                                                        {deckLabel}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                        return deckUrl ? (
                                            <Link to={deckUrl} className="deck-tooltip-container">
                                                {SpriteContent}
                                            </Link>
                                        ) : (
                                            <div className="deck-tooltip-container">
                                                {SpriteContent}
                                            </div>
                                        );
                                    })()}
                                    <Link
                                        to={`/tournaments/${result.eventId}/${result.division}/${encodeURIComponent(player.name)}-${isSpecialEvent(player.name, player.flag, result.eventId)}`}
                                        className={result.hasDecklist ? '' : 'no-decklist'}
                                    >
                                        <span className={`material-symbols-outlined ${result.hasDecklist ? '' : 'no-decklist'}`}>format_list_bulleted</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredResults.length > 10 && (
                    <button
                        className="show-results-btn"
                        onClick={() => setShowAllResults(prev => !prev)}
                    >
                        {showAllResults ? 'Show Less Results' : 'Show All Results'}
                    </button>
                )}
                <div className="accomplishments-card">
                    <div className="accomplishments-header">
                        <div>
                            <h2>{formatName(player.name)}</h2>
                            <p>Accomplishment count by event type</p>
                        </div>
                        <hr className='show-700-only-acc'></hr>
                        <div className="division-filter">
                            <span>Division</span>
                            <div className="division-filter-buttons">
                                {[
                                    { key: 'all', label: 'All' },
                                    { key: 'masters', label: 'Masters' },
                                    { key: 'seniors', label: 'Seniors' },
                                    { key: 'juniors', label: 'Juniors' },
                                ].map(option => (
                                    <button
                                        key={option.key}
                                        className={accomplishmentDivision === option.key ? 'active' : ''}
                                        onClick={() => setAccomplishmentDivision(option.key)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <table className="accomplishments-table">
                        <thead>
                            <tr>
                                <th>Finish</th>
                                {accomplishmentColumns.map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {accomplishmentSummary.map(row => (
                                <tr key={row.label}>
                                    <td>{row.label}</td>
                                    {accomplishmentColumns.map(col => (
                                        <td key={col.key}>
                                            <span className={row.counts[col.key] > 0 ? 'accomplishment-count has-count' : 'accomplishment-count'}>
                                                {row.counts[col.key]}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className='center-me italic playermayhavemore'>~ Player may have additional results not yet documented on PTCG Legends yet.</p>
        </PlayerProfileContainer>
    );
};

export default PlayerProfile;
