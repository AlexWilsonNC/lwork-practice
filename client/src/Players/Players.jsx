import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/players.css';

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
    HR: croatia,
    CZ: czechia,
    DK: denmark,
    EC: ecuador,
    SV: elSalvador,
    FI: finland,
    FR: france,
    DE: germany,
    GR: greece,
    HK: hongKong,
    HU: hungary,
    IS: iceland,
    ID: indonesia,
    IE: ireland,
    IL: israel,
    IM: isleOfMan,
    DR: dominicanRepublic,
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
    AR: 'Argentina',
    AU: 'Australia',
    AT: 'Austria',
    BY: 'Belarus',
    BE: 'Belgium',
    BR: 'Brazil',
    CA: 'Canada',
    CL: 'Chile',
    CN: 'China',
    CO: 'Colombia',
    HR: 'Croatia',
    CZ: 'Czechia',
    DK: 'Denmark',
    EC: 'Ecuador',
    SV: 'El Salvador',
    FI: 'Finland',
    FR: 'France',
    DE: 'Germany',
    GR: 'Greece',
    HK: 'Hong Kong',
    HU: 'Hungary',
    IS: 'Iceland',
    ID: 'Indonesia',
    IE: 'Ireland',
    IL: 'Israel',
    IM: 'Isle of Man',
    IT: 'Italy',
    JP: 'Japan',
    KR: 'South Korea',
    LT: 'Lithuania',
    MY: 'Malaysia',
    MT: 'Malta',
    MX: 'Mexico',
    MA: 'Morocco',
    NL: 'Netherlands',
    NZ: 'New Zealand',
    NI: 'Nicaragua',
    NO: 'Norway',
    PE: 'Peru',
    PH: 'Philippines',
    PL: 'Poland',
    PT: 'Portugal',
    PR: 'Puerto Rico',
    RU: 'Russia',
    SG: 'Singapore',
    SK: 'Slovakia',
    SI: 'Slovenia',
    SO: 'Somalia',
    ZA: 'South Africa',
    ES: 'Spain',
    SE: 'Sweden',
    CH: 'Switzerland',
    TW: 'Taiwan',
    TH: 'Thailand',
    US: 'USA',
    UK: 'UK',
    unknown: 'Unknown'
};

const regionFlags = {
    'NA': [usa, canada, puertoRico],
    'LA': [brazil, argentina, peru, colombia, mexico, chile, elSalvador, ecuador],
    'EU': [germany, france, uk, spain, poland, austria, belarus, belgium, croatia, czechia, denmark, finland, italy, netherlands, norway, portugal, russia, slovakia, spain, sweden, switzerland],
    'OC': [australia, newZealand],
    'AP': [china, hongKong, indonesia, japan, southKorea, malaysia, philippines, singapore, taiwan, thailand],
    'MS': [southAfrica]
};

const PlayerListContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};

    .filter-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        select {background: ${({ theme }) => theme.body};}
        select {color: ${({ theme }) => theme.text};}
        button {background: ${({ theme }) => theme.body};}
        button {color: ${({ theme }) => theme.text};}
    }
    .search-input .searcheventsfield {
        background: ${({ theme }) => theme.searchBg};
        color: ${({ theme }) => theme.searchTxt};
    }
        .results-table td a:hover {
    color: #1290eb;
  }
    .filter-container .sort-events {
        color: ${({ theme }) => theme.text};
    }
    .results-table td a {
      color: ${({ theme }) => theme.text};
    }
    .results-table td:nth-child(3) {
        text-align: center;
    }
    .spinner {
        border-left-color: ${({ theme }) => theme.spinner};
    }
`;

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

const Players = () => {
    const { theme } = useTheme();
    const [players, setPlayers] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [sortType, setSortType] = useState('results');
    const [regionFilter, setRegionFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // New state for loading

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('https://ptcglegends.com/api/players');
                const data = await response.json();
                const filteredData = data.filter(player => player.name !== '--');
                setPlayers(filteredData);
            } catch (error) {
                console.error('Error fetching players:', error);
            } finally {
                setLoading(false); // Set loading to false when data is fetched
            }
        };

        fetchPlayers();
    }, []);

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const setSortByName = () => {
        setSortType('name');
        setSortOrder('asc');
    };

    const setSortByResults = () => {
        setSortType('results');
        setSortOrder('desc');
    };

    const filteredPlayers = players.filter(player => {
        const isRegionMatch = regionFilter ? regionFlags[regionFilter].some(flag => flag === flags[player.flag]) : true;
        const isCountryMatch = countryFilter ? player.flag === countryFilter : true;
        const isSearchMatch = searchTerm ? player.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return isRegionMatch && isCountryMatch && isSearchMatch;
    });

    const sortedPlayers = filteredPlayers.sort((a, b) => {
        if (sortType === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
            return sortOrder === 'asc' ? a.results.length - b.results.length : b.results.length - a.results.length;
        }
    });

    const sortedCountryCodes = Object.keys(countryNames).sort((a, b) => {
        if (countryNames[a] < countryNames[b]) {
            return -1;
        }
        if (countryNames[a] > countryNames[b]) {
            return 1;
        }
        return 0;
    });

    const resetFilters = () => {
        setRegionFilter('');
        setCountryFilter('');
        setSortType('results');
        setSortOrder('desc');
        setSearchTerm('');
    };

    return (
        <PlayerListContainer theme={theme} className='center-me'>
            <Helmet>
                <title>Players</title>
                <meta
                    name='description'
                    content={`List of all players from all events documented on PTCG Legends across all eras.`}
                />
                <meta property='og:title' Players />
                <meta
                    property='og:description'
                    content={`List of all players from all events documented on PTCG Legends across all eras.`}
                />
                {/* <meta property='og:image' content={eventData.thumbnail} /> */}
                <meta
                    property='og:url'
                    content={`https://www.ptcglegends.com/players`}
                />
                <meta property='og:type' content='website' />
                <meta name='author' content='PTCG Legends' />
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' Players />
                <meta
                    name='twitter:description'
                    content={`List of all players from all events documented on PTCG Legends across all eras.`}
                />
                {/* <meta name='twitter:image' content={eventData.thumbnail} /> */}
            </Helmet>
            <div className='player-results-container'>
                <div className='completed-n-upcoming'>
                    <div className='bts-in'>
                        <a onClick={setSortByResults} className={`completed-btn ${sortType === 'results' ? 'active-evt-btn' : ''}`}>Sort by Results</a>
                        <a onClick={setSortByName} className={`upcoming-btn ${sortType === 'name' ? 'active-evt-btn' : ''}`}>Sort by Name</a>
                    </div>
                    <div className='search-input'>
                        <span className="material-symbols-outlined">search</span>
                        <input 
                            type="text" 
                            className='searcheventsfield' 
                            placeholder="Search players..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>
                <div className='filter-container'>
                    <div className='filters-top'>
                        <div className='indiv-filter'>
                            <p className='sort-events'>Region:</p>
                            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                                <option value="">All Regions</option>
                                <option value="NA">North America</option>
                                <option value="LA">Latin America</option>
                                <option value="EU">Europe</option>
                                <option value="OC">Oceania</option>
                                <option value="AP">Asia-Pacific</option>
                                <option value="MS">Middle East / South Africa</option>
                            </select>
                        </div>
                        <div className='indiv-filter'>
                            <p className='sort-events'>Country:</p>
                            <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
                                <option value="">All Countries</option>
                                {sortedCountryCodes.map(countryCode => (
                                    <option key={countryCode} value={countryCode}>{countryNames[countryCode]}</option>
                                ))}
                            </select>
                        </div>
                        <div className='indiv-filter'>
                            <p className='sort-events'>Order:</p>
                            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                <option value="asc">Sort Ascending</option>
                                <option value="desc">Sort Descending</option>
                            </select>
                        </div>
                        <button onClick={resetFilters} className="reset-btn">Reset</button>
                    </div>
                </div>
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <table className='results-table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Player</th>
                                <th>Results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, index) => (
                                <tr key={player._id}>
                                    <td>{index + 1}</td>
                                    <td className="center-content">
                                        <Link to={`/player/${player.id}`}>
                                            <img className='flag-size-players' src={flags[player.flag]} alt="flag" />
                                            {formatName(player.name)}
                                        </Link>
                                    </td>
                                    <td>
                                        {player.results.length}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </PlayerListContainer>
    );
};

export default Players;
