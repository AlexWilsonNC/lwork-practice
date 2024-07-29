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
    }

    .filter-container button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    margin-left: 10px;
    }

    .filter-container button:hover {
    background-color: #0056b3;
    }

    .results-table td a {
      color: ${({ theme }) => theme.text};
    }
`;

const formatName = (name) => {
    const lowercaseWords = ['de', 'da', 'of', 'the', 'van'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.'];

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
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortType, setSortType] = useState('results');
    const [regionFilter, setRegionFilter] = useState('');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('https://ptcg-legends-6abc11783376.herokuapp.com/api/players');
                const data = await response.json();
                const filteredData = data.filter(player => player.name !== '--');
                setPlayers(filteredData);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, []);

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const setSortByName = () => {
        setSortType('name');
        setSortOrder('desc'); // Reset to ascending by default when switching to name sort
    };

    const setSortByResults = () => {
        setSortType('results');
        setSortOrder('asc'); // Reset to descending by default when switching to results sort
    };

    const filteredPlayers = players.filter(player => {
        if (regionFilter) {
            return regionFlags[regionFilter].some(flag => flag === flags[player.flag]);
        }
        return true;
    });

    const sortedPlayers = filteredPlayers.sort((a, b) => {
        if (sortType === 'name') {
            return sortOrder === 'desc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
            return sortOrder === 'DESC' ? a.results.length - b.results.length : b.results.length - a.results.length;
        }
    });

    const resetFilters = () => {
        setRegionFilter('');
    };

    return (
        <PlayerListContainer theme={theme} className='center-me'>
            <Helmet>
                <title>Players</title>
            </Helmet>
            <div className='player-results-container'>
                <div className='completed-n-upcoming'>
                    <div className='bts-in'>
                        <a onClick={setSortByResults} className={`completed-btn ${sortType === 'results' ? 'active-evt-btn' : ''}`}>Sort by Result</a>
                        <a onClick={setSortByName} className={`upcoming-btn ${sortType === 'name' ? 'active-evt-btn' : ''}`}>Sort by Name</a>
                    </div>
                    <div className='search-input'>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" className='searcheventsfield' placeholder="Search events..." />
                    </div>
                </div>
                <div className='filter-container'>
                    <div className='filters-top'>
                    <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                            <option value="">All Regions</option>
                            <option value="NA">North America</option>
                            <option value="LA">Latin America</option>
                            <option value="EU">Europe</option>
                            <option value="OC">Oceania</option>
                            <option value="AP">Asia-Pacific</option>
                            <option value="MS">Middle East / South Africa</option>
                        </select>
                        <button onClick={resetFilters}>Reset</button>
                    </div>
                </div>
                <table className='results-table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Player</th>
                            <th>Result Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player, index) => (
                            <tr key={player._id}>
                                <td className="center-content">{index + 1}</td>
                                <td className="center-content">
                                    <Link to={`/players/${player.id}`}>
                                        <img className='flag-size' src={flags[player.flag]} alt="flag" />
                                        {formatName(player.name)}
                                    </Link>
                                </td>
                                <td className="center-content">
                                    {player.results.length} results
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PlayerListContainer>
    );
};

export default Players;
