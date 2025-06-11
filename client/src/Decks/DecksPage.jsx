import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import Modal from '../Tools/Interstitial';
import '../css/players.css';
import '../css/deckspage.css';

const formatOrder = [
  "BRS-SCR",
  "BRS-SFA",
  "BRS-TWM",
  "BRS-TEF",
  "BST-PAR",
  "BST-PAL",
  "BST-SVI",
  "SSH-CRZ",
  "SSH-SIT",
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
  .results-table td a:hover {
    color: #1290eb;
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
  .paddingfive {
    height: 27px !important;
  }
  .upcoming-btn {
    opacity: 0.3;
    pointer-events: none;
  }
  .marginleftless {
    margin-left: 0px;
  }
`;

const FormatSeparator = styled.tr`
  background-color: #1291eba4 !important;
  color: white !important;
  font-weight: bold;
  text-align: left;
  @media screen and (max-width: 950px) {
    .paddingfive {
        height: 28px !important;
    }
  }
  @media screen and (max-width: 450px) {
    .paddingfive {
        height: 20px !important;
    }
  }
`;

const archetypeSpriteOverrides = {
  "Haymaker": { sprite1: "hitmonchan", sprite2: "electabuzz" },
  "Haymaker Articuno": { sprite1: "hitmonchan", sprite2: "articuno" },
  "Lickitung Stall": { sprite1: "blank", sprite2: "lickitung" },
  "Mewtwo": { sprite1: "blank", sprite2: "mewtwo" },
  "Clefable": { sprite1: "blank", sprite2: "clefable" },
  "Nidoqueen": { sprite1: "blank", sprite2: "nidoqueen" },
  "Mr. Mime": { sprite1: "blank", sprite2: "mr-mime" },
  "Wigglytuff": { sprite1: "blank", sprite2: "wigglytuff" },
  "Arcanine": { sprite1: "blank", sprite2: "arcanine" },
  "Typhlosion": { sprite1: "blank", sprite2: "typhlosion" },
  "Sandslash": { sprite1: "blank", sprite2: "sandslash" },
  "Raichu": { sprite1: "blank", sprite2: "raichu" },
  "Slowking": { sprite1: "blank", sprite2: "slowking" },
  "Steelix": { sprite1: "blank", sprite2: "steelix" },
  "Espeon": { sprite1: "blank", sprite2: "espeon" },
  "Tyranitar": { sprite1: "blank", sprite2: "tyranitar" },
  "Meganium": { sprite1: "blank", sprite2: "meganium" },
  "Kingdra": { sprite1: "blank", sprite2: "kingdra" },
  "Lanturn": { sprite1: "blank", sprite2: "lanturn" },
  "Sneasel": { sprite1: "blank", sprite2: "sneasel" },
  "Donphan": { sprite1: "blank", sprite2: "donphan" },
  "Dark Blastoise": { sprite1: "blank", sprite2: "blastoise" },
  "Golduck": { sprite1: "blank", sprite2: "golduck" },
  "Team Aqua": { sprite1: "blank", sprite2: "kyogre" },
  "Sceptile": { sprite1: "blank", sprite2: "sceptile" },
  "Gorebyss": { sprite1: "blank", sprite2: "gorebyss" },
  "Machamp": { sprite1: "blank", sprite2: "machamp" },
  "Shiftry": { sprite1: "blank", sprite2: "shiftry" },
  "Blaziken": { sprite1: "blank", sprite2: "blaziken" },
  "Metagross": { sprite1: "blank", sprite2: "metagross" },
  "Empoleon": { sprite1: "blank", sprite2: "empoleon" },
  "Banette Eeveelutions": { sprite1: "banette", sprite2: "eevee" },
  "Gallade Lock": { sprite1: "gallade", sprite2: "absol" },
  "Scizor": { sprite1: "blank", sprite2: "scizor" },
  "Gengar": { sprite1: "blank", sprite2: "gengar" },
  "QueenGar": { sprite1: "gengar", sprite2: "nidoqueen" },
  "Froslass": { sprite1: "blank", sprite2: "froslass" },
  "Dragapult": { sprite1: "blank", sprite2: "dragapult" },
  "Gholdengo": { sprite1: "blank", sprite2: "gholdengo" },
};

const Decks = () => {
  const { theme } = useTheme();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortType, setSortType] = useState('format');
  const [selectedFormat, setSelectedFormat] = useState('BRS-SFA');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

    // State for managing the interstitial modal
    const [showModal, setShowModal] = useState(false);
    const [externalUrl, setExternalUrl] = useState('');
  
    // Handle link click for external links
    const handleLinkClick = (e, url) => {
      e.preventDefault();
      setExternalUrl(url); // Store the URL to navigate to after confirmation
      setShowModal(true);   // Show the interstitial modal
    };
  
    const handleConfirm = () => {
      setShowModal(false);
      window.location.href = externalUrl; // Redirect to the external site
    };
  
    const handleClose = () => {
      setShowModal(false); // Close the modal without redirecting
    };  

  useEffect(() => {
    const formatParam = searchParams.get('format') || 'BRS-SFA';
    setSelectedFormat(formatParam);

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

  const handleFormatChange = (event) => {
    const newFormat = event.target.value;
    setSelectedFormat(newFormat);
    setSearchParams({ format: newFormat });
  };

  const setSortByFormat = () => {
    setSortType('format');
    setSortOrder('desc');
  };

  const navigateToFeaturedDecks = () => {
    navigate('/decks-by-era');
  };

  const normalizeLabel = (label) => {
    return label
      .toLowerCase()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-|-$/g, ''); // Replace spaces/special chars with hyphens
  };

  const filteredDecks = decks.filter(deck =>
    deck.label.toLowerCase().includes(searchTerm.toLowerCase()) && deck.label !== '-'
  );
  
  const extractFormats = (results) => {
    if (!results || results.length === 0) return [];
    return results.map(result => result.eventFormat || 'Unknown');
  };

  const extractYear = (deck) => {
    // Get the first deck object in the array to extract the year
    const firstDeck = deck.decks[0];

    if (firstDeck && firstDeck.eventDate) {
        const year = firstDeck.eventDate.split(', ')[1]; // Extract the year part
        return year || 'Unknown';
    }

    return 'Unknown';
};

  const sortedFormatOrder = sortOrder === 'asc' ? [...formatOrder].reverse() : formatOrder;

  // Calculate the total decks for each format before filtering
  const totalDecksPerFormat = sortedFormatOrder.reduce((acc, format) => {
    acc[format] = decks.reduce((total, deck) => {
      const deckFormats = extractFormats(deck.decks);
      return deckFormats.includes(format) ? total + deck.decks.filter(d => d.eventFormat === format).length : total;
    }, 0);
    return acc;
  }, {});

  const decksByFormat = sortedFormatOrder.reduce((acc, format) => {
    acc[format] = filteredDecks.filter(deck => {
      const deckFormats = extractFormats(deck.decks);
      return deckFormats.includes(format);
    });
    return acc;
  }, {});
  
  const resetFilters = () => {
    setSortType('format');
    setSortOrder('desc');
    setSelectedFormat('');
    setSearchTerm('');
  };

  return (
    <DeckListContainer theme={theme} className='center-me'>
       <Helmet>
          <title>Decks</title>
          <meta
              name='description'
              content={`Deck archetypes from all events documented on PTCG Legends across all eras.`}
          />
          <meta property='og:title' Decks />
          <meta
              property='og:description'
              content={`Deck archetypes from all events documented on PTCG Legends across all eras.`}
          />
          {/* <meta property='og:image' content={eventData.thumbnail} /> */}
          <meta
              property='og:url'
              content={`https://www.ptcglegends.com/decks`}
          />
          <meta property='og:type' content='website' />
          <meta name='author' content='PTCG Legends' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' Decks />
          <meta
              name='twitter:description'
              content={`Deck archetypes from all events documented on PTCG Legends across all eras.`}
          />
          {/* <meta name='twitter:image' content={eventData.thumbnail} /> */}
      </Helmet>
      <div className='player-results-container'>
        <div className='completed-n-upcoming'>
          <div className='bts-in'>
            <a onClick={setSortByFormat} className={`completed-btn ${sortType === 'format' ? 'active-evt-btn' : ''}`}>Event Results</a>
            {/* <a onClick={navigateToFeaturedDecks} href='www.google.com' className={`upcoming-btn ${sortType === 'format' ? 'inactive-evt-btn' : ''}`}>Decks by Era</a> */}
            <a href='https://alexwilsonnc.github.io/tes/decks-by-era/main' onClick={(e) => handleLinkClick(e, 'https://alexwilsonnc.github.io/tes/decks-by-era/main')} className='completed-btn marginleftless'>Decks by Era</a>
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

                <optgroup label="2024">
                  <option value="BRS-SFA">BRS-SFA</option>
                  <option value="BRS-TWM">BRS-TWM</option>
                  <option value="BRS-TEF">BRS-TEF</option>
                </optgroup>

                <optgroup label="2023">
                  <option value="BST-PAR">BST-PAR</option>
                  <option value="BST-PAL">BST-PAL</option>
                  <option value="BST-SVI">BST-SVI</option>
                  <option value="SSH-CRZ">SSH-CRZ</option>
                </optgroup>
                
                <optgroup label="2022">
                  <option value="SSH-SIT">SSH-SIT</option>
                  <option value="SSH-PGO">SSH-PGO</option>
                  <option value="SSH-ASR">SSH-ASR</option>
                  <option value="SSH-BRS">SSH-BRS</option>
                </optgroup>
                
                <optgroup label="2020">
                  <option value="UPR-SSH">UPR-SSH</option>
                </optgroup>
                
                <optgroup label="2019">
                  <option value="UPR-CEC">UPR-CEC</option>
                  <option value="UPR-UNM">UPR-UNM</option>
                  <option value="SUM-UNB">SUM-UNB</option>
                  <option value="SUM-TEU">SUM-TEU</option>
                </optgroup>

                <optgroup label="2018">
                  <option value="SUM-LOT">SUM-LOT</option>
                  <option value="BKT-CES">BKT-CES</option>
                  <option value="BKT-FLI">BKT-FLI</option>
                  <option value="BKT-UPR">BKT-UPR</option>
                </optgroup>

                <optgroup label="2017">
                  <option value="BKT-CIN">BKT-CIN</option>
                  <option value="PRC-BUS">PRC-BUS</option>
                  <option value="PRC-GRI">PRC-GRI</option>
                  <option value="PRC-SUM">PRC-SUM</option>
                </optgroup>

                <optgroup label="2016">
                  <option value="PRC-EVO">PRC-EVO</option>
                  <option value="XY-STS">XY-STS</option>
                  <option value="XY-FCO">XY-FCO</option>
                </optgroup>

                <optgroup label="2015">
                  <option value="BCR-ROS">BCR-ROS</option>
                </optgroup>

                <optgroup label="2014">
                  <option value="NXD-FLF">NXD-FLF</option>
                </optgroup>

                <optgroup label="2013">
                  <option value="BLW-PLF">BLW-PLF</option>
                </optgroup>

                <optgroup label="2012">
                  <option value="HS-DEX">HS-DEX</option>
                </optgroup>

                <optgroup label="2011">
                  <option value="HS-BLW">HS-BLW</option>
                </optgroup>

                <optgroup label="2010">
                  <option value="DP-UL">DP-UL</option>
                </optgroup>

                <optgroup label="2009">
                  <option value="DP-RR">DP-RR</option>
                </optgroup>

                <optgroup label="2008">
                  <option value="HP-MD">HP-MD</option>
                </optgroup>

                <optgroup label="2007">
                  <option value="DX-DP">DX-DP</option>
                </optgroup>

                <optgroup label="2006">
                  <option value="HL-HP">HL-HP</option>
                </optgroup>

                <optgroup label="2005">
                  <option value="RS-EM">RS-EM</option>
                </optgroup>

                <optgroup label="2004">
                  <option value="EX-HL">EX-HL</option>
                </optgroup>

                <optgroup label="2002">
                  <option value="N1-LC">N1-LC</option>
                  <option value="TR-LC">TR-LC</option>
                  <option value="TR-N4">TR-N4</option>
                </optgroup>

                <optgroup label="2001">
                  <option value="TR-N3">TR-N3</option>
                  <option value="TR-N1">TR-N1</option>
                  <option value="BS-N2">BS-N2</option>
                </optgroup>

                <optgroup label="2000">
                  <option value="BS-G2">Prop 15/3</option>
                  <option value="BS-TR">BS-TR</option>
                </optgroup>

                <optgroup label="1999">
                  <option value="BS-FO">BS-FO</option>
                </optgroup>

                </select>
              </div>
              <div className='indiv-filter'>
                <p className='sort-events'>Order:</p>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                  <option value="asc">Oldest - Newest</option>
                  <option value="desc">Newest - Oldest</option>
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
                <th>Rank</th>
                <th>Deck</th>
                <th></th>
                <th></th>
                <th>Share</th>
                <th className='hideforfifty'>Results</th>
              </tr>
            </thead>
            <tbody>
            {sortedFormatOrder.map((format) => (
              (selectedFormat === '' || selectedFormat === format) && decksByFormat[format]?.length > 0 && (
                <React.Fragment key={format}>
                <FormatSeparator>
                  <td colSpan="6" className='paddingfive'>
                    {(format === "NXD-FLF" && "2014") ||
                    (format === "DP-UL" && "2010") ||
                    (format === "HL-HP" && "2006") ||
                    (format === "HL-HP" && "2006") ||
                    (format === "BS-FO" && "1999") ||
                    (decksByFormat[format][0] ? extractYear(decksByFormat[format][0]) : 'Unknown')
                    }&nbsp; -&nbsp; {format}
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
                      const overriddenSprites = archetypeSpriteOverrides[deck.label];
                      const sprite1 = overriddenSprites ? overriddenSprites.sprite1 : firstResult.sprite1;
                      const sprite2 = overriddenSprites ? overriddenSprites.sprite2 : firstResult.sprite2;
                      const totalDecksInFormat = totalDecksPerFormat[format];
                      const percentage = ((deckCount / totalDecksInFormat) * 100).toFixed(2);

                      return (
                        <tr key={deck._id} className='deck-table'>
                          <td>{index + 1}</td>
                          <td>
                            {sprite1 && sprite1 !== 'blank' ? (
                              <img 
                                src={`/assets/sprites/${sprite1}.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{width: '55px' }}
                              />
                            ) : sprite2 ? (
                              <img 
                                src={`/assets/sprites/${sprite2}.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{width: '55px' }}
                              />
                            ) : (
                              <img 
                                src={`/assets/sprites/blank.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{width: '55px' }}
                              />
                            )}
                          </td>
                          <td>
                            {sprite2 && sprite1 !== 'blank' && (
                              <img className='movesecondspritedecks' 
                                src={`/assets/sprites/${sprite2}.png`} 
                                alt={`${deck.label} sprite`} 
                                style={{width: '55px' }}
                              />
                            )}
                          </td>
                          <td>
                            <Link to={`/deck/${normalizeLabel(deck.label)}?format=${format}`}>
                                {deck.label}
                            </Link>
                          </td>
                          <td>{percentage}%</td>
                          <td className='hideforfifty'>{deckCount}</td>
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
      {/* Modal for external link confirmation */}
      <Modal
        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        externalLink={externalUrl}
      />
    </DeckListContainer>
  );
};

export default Decks;
