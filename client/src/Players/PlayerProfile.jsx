import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import DisplayPokemonSprites from '../Tournaments/pokemon-sprites';

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
import costaRica from '../assets/flags/costa-rica.png';
import denmark from '../assets/flags/denmark.png';
import dominicanRepublic from '../assets/flags/dominican-republic.png';
import ecuador from '../assets/flags/ecuador.png';
import elSalvador from '../assets/flags/el-salvador.png';
import finland from '../assets/flags/finland.png';
import france from '../assets/flags/france.png';
import germany from '../assets/flags/germany.png';
import greece from '../assets/flags/greece.png';
import hongKong from '../assets/flags/hong-kong.png';
import hungary from '../assets/flags/hungary.png';
import iceland from '../assets/flags/iceland.png';
import indonesia from '../assets/flags/indonesia.png';
import ireland from '../assets/flags/ireland.png';
import israel from '../assets/flags/isreal.png';
import isleOfMan from '../assets/flags/im.png';
import italy from '../assets/flags/italy.png';
import japan from '../assets/flags/japan.png';
import southKorea from '../assets/flags/korea.png';
import lithuania from '../assets/flags/lithuania.png';
import malaysia from '../assets/flags/malaysia.png';
import malta from '../assets/flags/malta.png';
import mexico from '../assets/flags/mexico.png';
import morocco from '../assets/flags/morocco.png';
import netherlands from '../assets/flags/netherlands.png';
import newZealand from '../assets/flags/new-zealand.png';
import nicaragua from '../assets/flags/nicaragua.png';
import norway from '../assets/flags/norway.png';
import peru from '../assets/flags/peru.png';
import philippines from '../assets/flags/philippines.png';
import poland from '../assets/flags/poland.png';
import portugal from '../assets/flags/portugal.png';
import puertoRico from '../assets/flags/puerto-rico.png';
import russia from '../assets/flags/russia.png';
import singapore from '../assets/flags/singapore.png';
import slovakia from '../assets/flags/slovakia.png';
import slovenia from '../assets/flags/slovenia.png';
import somalia from '../assets/flags/somalia.png';
import southAfrica from '../assets/flags/south-africa.png';
import spain from '../assets/flags/spain.png';
import sweden from '../assets/flags/sweden.png';
import switzerland from '../assets/flags/switzerland.png';
import taiwan from '../assets/flags/taiwan.png';
import thailand from '../assets/flags/thailand.png';
import usa from '../assets/flags/usa.png';
import uk from '../assets/flags/uk.png';
import unknown from '../assets/flags/unknown.png';

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
}

const flags = {
    AR: argentina,
    AU: australia,
    AT: austria,
    BY: belarus,
    BE: belgium,
    BR: brazil,
    CA: canada,
    CL: chile,
    CN: china,
    CO: colombia,
    CR: costaRica,
    HR: croatia,
    CZ: czechia,
    DK: denmark,
    EC: ecuador,
    SV: elSalvador,
    FI: finland,
    FR: france,
    DR: dominicanRepublic,
    DE: germany,
    GR: greece,
    HK: hongKong,
    HU: hungary,
    IS: iceland,
    ID: indonesia,
    IE: ireland,
    IL: israel,
    IM: isleOfMan,
    IT: italy,
    JP: japan,
    KR: southKorea,
    LT: lithuania,
    MY: malaysia,
    MT: malta,
    MX: mexico,
    MA: morocco,
    NL: netherlands,
    NZ: newZealand,
    NI: nicaragua,
    NO: norway,
    PE: peru,
    PH: philippines,
    PL: poland,
    PT: portugal,
    PR: puertoRico,
    RU: russia,
    SG: singapore,
    SK: slovakia,
    SI: slovenia,
    SO: somalia,
    ZA: southAfrica,
    ES: spain,
    SE: sweden,
    CH: switzerland,
    TW: taiwan,
    TH: thailand,
    US: usa,
    UK: uk,
    unknown: unknown
}

const countryNames = {
    AR: 'Argentina (Latin America)',
    AU: 'Australia (Oceania)',
    AT: 'Austria (Europe)',
    BY: 'Belarus (Europe)',
    BE: 'Belgium (Europe)',
    BR: 'Brazil (Latin America)',
    CA: 'Canada (North America)',
    CL: 'Chile (Latin America)',
    CN: 'China (Asia-Pacific)',
    CO: 'Colombia (Latin America)',
    CR: 'Costa Rica (Latin America)',
    HR: 'Croatia (Europe)',
    CZ: 'Czechia (Europe)',
    DK: 'Denmark (Europe)',
    SV: 'El Salvador (Latin America)',
    FI: 'Finland (Europe)',
    FR: 'France (Europe)',
    DE: 'Germany (Europe)',
    GR: 'Greece (Europe)',
    HK: 'Hong Kong (Asia-Pacific)',
    HU: 'Hungary (Europe)',
    IS: 'Iceland (Europe)',
    ID: 'Indonesia (Asia-Pacific)',
    IE: 'Ireland (Europe)',
    IM: 'Isle of Man (Europe)',
    IL: 'Israel (Middle East-South Africa)',
    IT: 'Italy (Europe)',
    JP: 'Japan (Asia-Pacific)',
    SO: 'Somalia (Middle East-South Africa)',
    KR: 'South Korea (Asia-Pacific)',
    LT: 'Lithuania (Europe)',
    MY: 'Malaysia (Asia-Pacific)',
    MT: 'Malta (Europe)',
    MX: 'Mexico (Latin America)',
    MA: 'Moroco (Europe)',
    NL: 'Netherlands (Europe)',
    NZ: 'New Zealand (Oceania)',
    NI: 'Nicaragua (Latin America)',
    NO: 'Norway (Europe)',
    PE: 'Peru (Latin America)',
    PH: 'Philippines (Asia-Pacific)',
    PL: 'Poland (Europe)',
    PT: 'Portugal (Europe)',
    PR: 'Puerto Rico (North America)',
    RU: 'Russia (Russia)',
    SG: 'Singapore (Asia-Pacific)',
    SK: 'Slovakia (Europe)',
    ZA: 'South Africa (Middle East-South Africa)',
    ES: 'Spain (Europe)',
    SE: 'Sweden (Europe)',
    CH: 'Switzerland (Europe)',
    TW: 'Taiwan (Asia-Pacific)',
    TH: 'Thailand (Asia-Pacific)',
    UK: 'United Kingdom (Europe)',
    US: 'USA (North America)',
    unknown: 'Unknown',
    SI: 'Slovenia (Europe)',
    EC: 'Ecuador (Latin America)'
};

const PlayerProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  .completed-n-upcoming {
    // margin-top: 1px;
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
    
    // Define the special case with capital "De"
    const specialCases = {
        'de haes damien': 'De Haes Damien',
        'jamie depamphilis': 'Jamie DePamphilis',
    };

    // Check for special case match
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
        return <div>{error}</div>;
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
                        {filteredResults.map((result, index) => (
                            <tr key={index}>
                                <td>{formatDate(result.eventDate)}</td>
                                <td className='center-content'>
                                    <img src={logos[result.eventLogo]} className='event-type-logo3' alt="Event type" />
                                    <Link className='white-link' to={`${getEventLink(result.eventId, result.eventName)}/${result.division}`}>
                                        {result.eventName}
                                    </Link>
                                </td>
                                <td>{getPlacementSuffix(result.placement)} <span className='divisionplacementopaque'>{getDivisionAbbreviation(result.division)}</span></td>
                                <td className='player-deck-icons center-content'>
                                    <DisplayPokemonSprites decklist={result.decklist} sprite1={result.sprite1} sprite2={result.sprite2} />
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
            </div>
            <p className='center-me italic playermayhavemore'>~ Player may have additional results not yet documented on the site, like Regionals.</p>
        </PlayerProfileContainer>
    );
};

export default PlayerProfile;
