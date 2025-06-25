import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/players.css';
import { flags, countryNames, regions, playerCountryDropdown } from '../Tools/flags';

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
`;
const getCountryName = (code) => {
    return countryNames[code] || 'Unknown';
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
                const response = await fetch('https://ptcg-legends-6abc11783376.herokuapp.com/api/players');
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
        const isRegionMatch = regionFilter
            ? regions[regionFilter].includes(player.flag)
            : true;
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

    const sortedCountryCodes = Object.keys(playerCountryDropdown).sort((a, b) => {
        if (playerCountryDropdown[a] < playerCountryDropdown[b]) {
            return -1;
        }
        if (playerCountryDropdown[a] > playerCountryDropdown[b]) {
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
                                    <option key={countryCode} value={countryCode}>{playerCountryDropdown[countryCode]}</option>
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
                                            {/* <img className='flag-size-players' src={flags[player.flag]} alt="flag" /> */}
                                            <div className="flag-container">
                                                <img 
                                                    className='flag-size-player' 
                                                    src={flags[player.flag]} 
                                                    alt="flag" 
                                                />
                                                <div className="flag-tooltip">
                                                    {getCountryName(player.flag)}
                                                </div>
                                            </div>
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
