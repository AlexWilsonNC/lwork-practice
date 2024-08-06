import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/players.css';
import '../css/deckspage.css';

const formatOrder = [
  "BRS-TWM",
  "BRS-TEF",
  "BST-PAL",
  "SSH-PGO",
  "SSH-ASR",
  "SSH-BRS",
  "UPR-SSH",
  "UPR-CEC",
  "UPR-UNM",
  "SUM-UNB",
  "SUM-TEU",
  "SUM-LOT",
  "BKT-CES",
  "BKT-FLI",
  "BKT-UPR",
  "BKT-CIN",
  "PRC-BUS",
  "PRC-GRI",
  "PRC-SUM",
  "PRC-EVO",
  "XY-STS",
  "XY-FCO",
  "BCR-ROS",
  "NXD-FLF",
  "BLW-PLF",
  "HS-DEX",
  "HS-BLW",
  "DP-UL",
  "DP-RR",
  "HP-MD",
  "DX-DP",
  "HL-HP",
  "RS-EM",
  "EX-HL",
  "TR-LC",
  "N1-LC",
  "TR-N4",
  "TR-N3",
  "TR-N1",
  "BS-N2",
  "BS-G2",
  "BS-TR",
  "BS-FO"
];

const DeckListContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  .results-table td a {
    color: ${({ theme }) => theme.text};
  }
  .results-table td:nth-child(3) {
    text-align: center;
  }
  .filter-container {
    margin-bottom: 15px;
  }
  .filter-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      select {background: ${({ theme }) => theme.body};}
      select {color: ${({ theme }) => theme.text};}
      button {background: ${({ theme }) => theme.body};}
      button {color: ${({ theme }) => theme.text};}
  }
  .sort-events {
    color: ${({ theme }) => theme.text};
  }
  .spinner {
    border-left-color: ${({ theme }) => theme.spinner};
  }
  .search-input .searcheventsfield {
      background: ${({ theme }) => theme.searchBg};
      color: ${({ theme }) => theme.searchTxt};
  }
  .filter-container .sort-events {
      color: ${({ theme }) => theme.text};
  }
`;
const FormatSeparator = styled.tr`
  background-color: #1290eb !important;
  color: white !important;
  font-weight: bold;
  text-align: left;
`;

const Decks = () => {
  const { theme } = useTheme();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortType, setSortType] = useState('format');
  const [selectedFormat, setSelectedFormat] = useState(''); // State for selected format

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch('https://ptcg-legends-6abc11783376.herokuapp.com/api/decks');
        const data = await response.json();
        setDecks(data);
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const setSortByFormat = () => {
    setSortType('format');
    setSortOrder('desc');
  };

  const filteredDecks = decks.filter(deck => 
    deck.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const extractFormats = (results) => {
    if (!results || results.length === 0) return [];
    return results.map(result => result.eventFormat || 'Unknown');
  };

  const extractYear = (deck) => {
    return deck.year || '';
  };

  const sortedFormatOrder = sortOrder === 'asc' ? [...formatOrder].reverse() : formatOrder;

  const decksByFormat = sortedFormatOrder.reduce((acc, format) => {
    acc[format] = [];
    filteredDecks.forEach(deck => {
      const deckFormats = extractFormats(deck.decks);
      if (deckFormats.includes(format)) {
        acc[format].push(deck);
      }
    });
    return acc;
  }, {});

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const resetFilters = () => {
    setSortType('format');
    setSelectedFormat('');
    setSearchTerm('');
  };


  return (
    <DeckListContainer theme={theme} className='center-me'>
      <Helmet>
        <title>Decks</title>
      </Helmet>
      <div className='player-results-container'>
        <div className='completed-n-upcoming'>
          <div className='bts-in'>
            <a onClick={setSortByFormat} className={`completed-btn ${sortType === 'format' ? 'active-evt-btn' : ''}`}>Sort by Format</a>
          </div>
          <div className='search-input'>
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              className='searcheventsfield' 
              placeholder="Search decks..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
        <div className='filter-container'>
          <div className='filters-top'>
          <div className='indiv-filter'>
              <p className='sort-events'>Format:</p>
              <select value={selectedFormat} onChange={handleFormatChange}>
                <option value="">All Formats</option>
                {formatOrder.map(format => (
                  <option key={format} value={format}>{format}</option>
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
          <table className='results-table deck-table'>
            <thead>
              <tr>
                <th></th>
                <th>Deck</th>
                <th></th>
                <th>Share</th>
                <th>Lists</th>
              </tr>
            </thead>
            <tbody>
            {sortedFormatOrder.map((format) => (
              (selectedFormat === '' || selectedFormat === format) && decksByFormat[format]?.length > 0 && (
                <React.Fragment key={format}>
                  <FormatSeparator>
                  <td colSpan="5" className='paddingfive'>
                        {decksByFormat[format][0] ? extractYear(decksByFormat[format][0]) : 'Unknown'} - {format}
                      </td>
                  </FormatSeparator>
                  {decksByFormat[format]
                    .map((deck) => {
                      const decksInCurrentFormat = deck.decks.filter(d => d.eventFormat === format);
                      return {
                        ...deck,
                        deckCount: decksInCurrentFormat.length,
                      };
                    })
                    .sort((a, b) => b.deckCount - a.deckCount)
                    .map((deck, index) => {
                      const { deckCount } = deck;
                      const firstResult = deck.decks[0];
                      const sprite1 = firstResult.sprite1;
                      const sprite2 = firstResult.sprite2;
                      const totalDecksInFormat = decksByFormat[format].reduce((acc, curr) => acc + curr.decks.filter(d => d.eventFormat === format).length, 0);
                      const percentage = ((deckCount / totalDecksInFormat) * 100).toFixed(2);

                      return (
                        <tr key={deck._id} className='deck-table'>
                          <td>{index + 1}</td> {/* Number each deck */}
                          <td>
                            {sprite1 && sprite1 !== 'blank' ? (
                              <img 
                                src={`/assets/sprites/${sprite1}.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{height: '50px' }}
                              />
                            ) : sprite2 ? (
                              <img 
                                src={`/assets/sprites/${sprite2}.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{height: '50px' }}
                              />
                            ) : (
                              <img 
                                src={`/assets/sprites/blank.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{height: '50px' }}
                              />
                            )}
                          </td>
                          <td>
                            {sprite2 && sprite1 !== 'blank' && (
                              <img 
                                src={`/assets/sprites/${sprite2}.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{height: '50px' }}
                              />
                            )}
                          </td>
                          <td>
                            <Link to={`/deck/${deck._id}`}>
                              {deck.label}
                            </Link>
                          </td>
                          <td>{percentage}%</td>
                          <td>{deckCount}</td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              )
            ))}
            </tbody>
          </table>
        )}
      </div>
    </DeckListContainer>
  );
};

export default Decks;
