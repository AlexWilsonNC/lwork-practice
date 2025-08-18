import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/deckspage.css';
import { formatOrder } from './DecksPage';

// Define styled components
const DeckProfileContainer = styled.div`
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
  .bts-in h1 {
    padding-left: 25px;
  }
  .player-deck-icons .material-symbols-outlined.no-decklist {
     opacity: 0;
     pointer-events: none;
  }
  .player-deck-icons .material-symbols-outlined {
     opacity: 1;
  }
  .player-deck-icons a.no-decklist {
    pointer-events: none;
  }
`;

const EventSeparator = styled.tr`
  background-color: #1291eba4 !important;
  color: white !important;
  font-weight: bold;
  text-align: left;
  & a {
    color: white !important;
  }
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

const orderedSets = [
  "BLK", "WHT", "DRI", "JTG", "PRE", "SSP", "SCR", "SFA", "TWM", "TEF", "PAF", "PAR", "MEW", "OBF", "PAL", "SVE", "SVI", "PR-SV",
  "CRZ", "SIT", "LOR", "PGO", "ASR", "BRS", "FST", "CEL", "EVS", "CRE", "BST",
  "SHF", "VIV", "CPA", "DAA", "RCL", "SSH", "PR-SW",
  "CEC", "HIF", "UNM", "UNB", "DPI", "TEU", "LOT", "DRM", "CES", "FLI", "UPR",
  "CIN", "SLG", "BUS", "GRI", "SUM", "PR-SM",
  "EVO", "STS", "FCO", "GEN", "BKP", "BKT", "AOR", "ROS", "DCE", "PRC", "PHF", "FFI",
  "FLF", "KSS", "XY", "PR-XY",
  "LTR", "PLB", "PLF", "PLS", "BCR", "DRV", "DRX", "DEX", "NXD", "NVI", "EPO", "BLW", "PR-BLW",
  "CL", "TM", "UD", "UL", "HS", "RM", "PR-HS",
  "AR", "SV", "RR", "P9", "PL", "SF", "P8", "LA", "MD", "P7", "GE", "SW", "P6",
  "MT", "DP", "PR-DP",
  "P5", "PK", "DF", "CG", "P4", "HP", "P3", "TK2", "LM", "DS", "P2", "UF", "EM", "DX",
  "TRR", "P1", "FL", "HL", "TK1", "MA", "DR", "SS", "RS", "PR-EX",
  "SK", "AQ", "EX", "LC", "N4", "N3", "SI", "N2", "N1", "G2", "G1", "TR", "B2",
  "FO", "JU", "BS", "PR-BS",
];

const promoSets = {
  "BLK": "PR-SV",
  "WHT": "PR-SV",
  "DRI": "PR-SV",
  "JTG": "PR-SV",
  "PRE": "PR-SV",
  "SSP": "PR-SV",
  "SCR": "PR-SV",
  "SFA": "PR-SV",
  "TWM": "PR-SV",
  "TEF": "PR-SV",
  "PAF": "PR-SV",
  "PAR": "PR-SV",
  "MEW": "PR-SV",
  "OBF": "PR-SV",
  "PAL": "PR-SV",
  "SVI": "PR-SV",
  "SVE": "PR-SV",
  "CRZ": "PR-SW",
  "SIT": "PR-SW",
  "LOR": "PR-SW",
  "PGO": "PR-SW",
  "ASR": "PR-SW",
  "BRS": "PR-SW",
  "CEC": "PR-SM",
  "HIF": "PR-SM",
  "UNM": "PR-SM",
  "UNB": "PR-SM",
  "DPI": "PR-SM",
  "TEU": "PR-SM",
  "LOT": "PR-SM",
  "DRM": "PR-SM",
  "CES": "PR-SM",
  "FLI": "PR-SM",
  "UPR": ["PR-SM", "CIN", "SUM", "GRI"],
  "CIN": "PR-SM",
  "SLG": "PR-SM",
  "BUS": "PR-SM",
  "GRI": "PR-SM",
  "SUM": "PR-SM",
  "EVO": "PR-XY",
  "STS": "PR-XY",
  "FCO": "PR-XY",
  "GEN": "PR-XY",
  "BKP": "PR-XY",
  "BKT": "PR-XY",
  "AOR": "PR-XY",
  "ROS": "PR-XY",
  "DCE": "PR-XY",
  "PRC": ["PR-XY", "PHF"],
  "PHF": "PR-XY",
  "FFI": "PR-XY",
  "FLF": "PR-XY",
  "XY": "PR-XY",
  "KSS": "PR-XY",
  "LTR": "PR-BLW",
  "PLB": "PR-BLW",
  "PLF": "PR-BLW",
  "PLS": "PR-BLW",
  "BCR": ["PR-BLW", "EPO", "DEX"],
  "DRV": "PR-BLW",
  "DRX": "PR-BLW",
  "DEX": "PR-BLW",
  "NXD": ["PR-BLW", "EPO"],
  "NVI": "PR-BLW",
  "EPO": "PR-BLW",
  "BLW": "PR-BLW",
  "CL": "PR-HS",
  "TM": "PR-HS",
  "UD": "PR-HS",
  "UL": "PR-HS",
  "HS": "PR-HS",
  "AR": "PR-DP",
  "SV": "PR-DP",
  "RR": "PR-DP",
  "P9": "PR-DP",
  "PL": "PR-DP",
  "SF": "PR-DP",
  "P8": "PR-DP",
  "LA": "PR-DP",
  "MD": "PR-DP",
  "P7": "PR-DP",
  "GE": "PR-DP",
  "SW": "PR-DP",
  "P6": "PR-DP",
  "MT": "PR-DP",
  "DP": "PR-DP",
  "P5": "PR-EX",
  "PK": "PR-EX",
  "DF": "PR-EX",
  "CG": "PR-EX",
  "P4": "PR-EX",
  "HP": "PR-EX",
  "P3": "PR-EX",
  "TK2": "PR-EX",
  "LM": "PR-EX",
  "DS": "PR-EX",
  "P2": "PR-EX",
  "UF": "PR-EX",
  "EM": "PR-EX",
  "DX": "PR-EX",
  "TRR": "PR-EX",
  "P1": "PR-EX",
  "FL": "PR-EX",
  "HL": ["PR-EX", "RS"],
  "TK1": "PR-EX",
  "MA": "PR-EX",
  "DR": "PR-EX",
  "SS": "PR-EX",
  "RS": "PR-EX",
  "SK": "PR-BS",
  "AQ": "PR-BS",
  "EX": "PR-BS",
  "N4": "PR-BS",
  "N3": "PR-BS",
  "SI": "PR-BS",
  "N2": "PR-BS",
  "N1": ["PR-BS", "BS", "TR", "LC"],
  "G2": "PR-BS",
  "G1": "PR-BS",
  "LC": "PR-BS",
  "TR": "PR-BS",
  "B2": "PR-BS",
  "FO": "PR-BS",
  "JU": "PR-BS",
  "BS": "PR-BS"
};

const formatToCollections = (format) => {
  if (format === "BS-BS") return ["BS"];

  const [startSet, endSet] = format.split('-');
  const startIndex = orderedSets.indexOf(startSet);
  const endIndex = orderedSets.indexOf(endSet);

  if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid format range');
  }

  const [actualStart, actualEnd] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  const collections = orderedSets.slice(actualStart, actualEnd + 1).reverse();

  Object.keys(promoSets).forEach((set) => {
      if (collections.includes(set) && !collections.includes(promoSets[set])) {
          collections.push(promoSets[set]);
      }
  });
  
  return collections;
};

const normalizeAttacks = (attacks) => {
  return attacks.map(attack => ({
      ...attack,
      cost: attack.cost.slice().sort()
  })).sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeAbilities = (abilities) => {
  if (!abilities) return [];
  return abilities.map(ability => ({
      ...ability
  })).sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeWeaknesses = (weaknesses) => {
  if (!weaknesses) return [];
  return weaknesses.map(weakness => ({
      ...weakness
  })).sort((a, b) => a.type.localeCompare(b.type));
};

const normalizeResistances = (resistances) => {
  if (!resistances) return [];
  return resistances.map(resistance => ({
      ...resistance
  })).sort((a, b) => a.type.localeCompare(b.type));
};

const comparePokemonCards = (card1, card2) => {
  const typesMatch = JSON.stringify(card1.types) === JSON.stringify(card2.types);
  const hpMatch = card1.hp === card2.hp;
  const attacksMatch = JSON.stringify(normalizeAttacks(card1.attacks || [])) === JSON.stringify(normalizeAttacks(card2.attacks || []));
  const abilitiesMatch = JSON.stringify(normalizeAbilities(card1.abilities || [])) === JSON.stringify(normalizeAbilities(card2.abilities || []));
  const retreatCostMatch = JSON.stringify(card1.convertedRetreatCost || []) === JSON.stringify(card2.convertedRetreatCost || []);
  const weaknessesMatch = JSON.stringify(normalizeWeaknesses(card1.weaknesses || [])) === JSON.stringify(normalizeWeaknesses(card2.weaknesses || []));
  const resistancesMatch = JSON.stringify(normalizeResistances(card1.resistances || [])) === JSON.stringify(normalizeResistances(card2.resistances || []));

  return typesMatch && hpMatch && attacksMatch && abilitiesMatch && retreatCostMatch && weaknessesMatch && resistancesMatch;
};

const normalizeEnergyCardName = (name) => {
  // Normalize common variations in energy card names
  return name
      .toLowerCase()
      .replace("basic ", "")
      .replace(" - basic", "")
      .replace(" energy", "");
};
const compareEnergyCards = (card1, card2) => {
  // Normalize both energy card names
  const normalizedCard1Name = normalizeEnergyCardName(card1.name);
  const normalizedCard2Name = normalizeEnergyCardName(card2.name);

  // Compare based on normalized names, set, and number
  return normalizedCard1Name === normalizedCard2Name && card1.set === card2.set && card1.number === card2.number;
};

// Utility functions
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const formatName = (name) => {
  const lowercaseWords = ['de', 'of', 'the', 'van', 'der'];
  const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.', 'mk', 'jc'];

  const specialCases = {
    'de haes damien': 'De Haes Damien',
    'jamie depamphilis': 'Jamie DePamphilis',
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

const getPlacementSuffix = (number) => {
  const j = number % 10;
  const k = number % 100;
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
      <>
          {number}
          <sup className='sup'>{suffix}</sup>
      </>
  );
};

// DeckProfile Component
const DeckProfile = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [averageCardCounts, setAverageCardCounts] = useState([]);
  const [showTop30, setShowTop30] = useState(true);
  const [cardData, setCardData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedFormat, setSelectedFormat] = useState('');

  useEffect(() => {
    const urlFormat = searchParams.get('format'); // Retrieve format from URL query
    setSelectedFormat(urlFormat); // Set the format directly from the URL

    const fetchDecks = async () => {
        try {
            const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/decks/${id}`);
            if (!response.ok) {
                throw new Error('Deck not found');
            }
            const data = await response.json();
            setDecks(data);
            
            // Use the format from the URL, and only fallback if none is provided
            const formats = data.flatMap(d => d.decks.map(deck => deck.eventFormat));
            const uniqueFormats = [...new Set(formats)];
            const mostRecentFormat = uniqueFormats[uniqueFormats.length - 1]; // Fallback to most recent format if none selected
            const formatToUse = urlFormat || mostRecentFormat;
            setSelectedFormat(formatToUse); // Set the selected format to the format in the URL
            
            // Fetch card data for the format
            await fetchCardData(formatToUse);
        } catch (error) {
            console.error('Error fetching decks:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchDecks();
  }, [id, searchParams]); // Now also depends on searchParams to handle format changes

const fetchCardData = async (format) => {
  try {
      const collectionsParam = formatToCollections(format).join(',');
      const url = `https://ptcg-legends-6abc11783376.herokuapp.com/api/cards?format=${collectionsParam}`;

      const response = await fetch(url);

      if (response.ok) {
          const cards = await response.json();
          const cardMap = {};

          cards.forEach(card => {
              const key = `${card.setAbbrev}-${card.number}`;
              cardMap[key] = card;
          });

          setCardData(cardMap);
      } else {
          console.error('Failed to fetch card data, status:', response.status);
      }
  } catch (error) {
      console.error('Error fetching card data:', error);
  }
};

useEffect(() => {
  if (decks.length && cardData) {
      const cardSets = {
          pokemon: new Map(),
          trainer: new Map(),
          energy: new Map(),
      };

      const normalizeString = (str) => {
          return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
      };

      // Filter decks by the selected format and division
      const filteredDecks = decks.flatMap(d => d.decks)
          .filter(deck =>
              deck.eventFormat === selectedFormat &&
              (selectedDivision === 'All Divisions' || selectedDivision === '' || deck.division === selectedDivision)
          );

      filteredDecks.forEach(({ decklist }) => {
          if (decklist) {
              ['pokemon', 'trainer', 'energy'].forEach((category) => {
                  if (decklist[category]) {
                      decklist[category].forEach(card => {
                          const existingCardKey = Array.from(cardSets[category].keys()).find(key => {
                              const existingCard = cardSets[category].get(key).cardInfo;
                              if (category === 'pokemon') {
                                  return normalizeString(existingCard.name) === normalizeString(card.name) &&
                                      comparePokemonCards(existingCard, card);
                              } else if (category === 'energy') {
                                  return compareEnergyCards(existingCard, card);
                              } else {
                                  return normalizeString(existingCard.name) === normalizeString(card.name);
                              }
                          });

                          if (existingCardKey) {
                              const cardData = cardSets[category].get(existingCardKey);
                              cardData.count += parseInt(card.count, 10);
                              cardData.occurrences += 1;
                              cardSets[category].set(existingCardKey, cardData);
                          } else {
                              const cardKey = `${card.set}-${card.number}`;
                              cardSets[category].set(cardKey, {
                                  cardInfo: card,
                                  count: parseInt(card.count, 10),
                                  occurrences: 1,
                              });
                          }
                      });
                  }
              });
          }
      });

      const commonCards = {
          pokemon: [],
          trainer: [],
          energy: [],
      };

      // Populate the commonCards and sort them by averageCount
      ['pokemon', 'trainer', 'energy'].forEach((category) => {
          cardSets[category].forEach((cardData) => {
              const totalDecks = filteredDecks.length;
              const averageCount = cardData.count / totalDecks;
              commonCards[category].push({
                  ...cardData.cardInfo,
                  averageCount: averageCount.toFixed(2), // Ensure two decimal places
              });
          });

          // Sort each category by averageCount in descending order
          commonCards[category].sort((a, b) => b.averageCount - a.averageCount);
      });

      const allCommonCards = [
          ...commonCards.pokemon,
          ...commonCards.trainer,
          ...commonCards.energy,
      ];

      setAverageCardCounts(allCommonCards);
  }
}, [decks, cardData, selectedFormat, selectedDivision, showTop30]);

  const cardImageUrl = (card) => {
    if (!cardData) {
      return 'https://via.placeholder.com/150';
    }

    const key = `${card.set}-${card.number}`;
    const cardInfo = cardData[key];

    if (cardInfo && cardInfo.images) {
      return cardInfo.images.small;
    } else {
      return 'https://via.placeholder.com/150';
    }
  };

  const handleShowTop30 = () => {
    setShowTop30(true);
  };

  const handleShowAllCommonCards = () => {
    setShowTop30(false);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!decks.length) {
    return <div>No data found for this deck.</div>;
  }

const formatParam = searchParams.get('format');

// 2. pull every format this archetype appears in
const rawFormats = decks.flatMap(d => d.decks.map(deck => deck.eventFormat));

// 3. dedupe
const uniqueFormatsRaw = Array.from(new Set(rawFormats));

// 4. re-order them to match your master list
const sortedFormats = formatOrder.filter(f => uniqueFormatsRaw.includes(f));
  const uniqueDivisions = ['All Divisions', ...new Set(decks.flatMap(d => d.decks.map(deck => deck.division)))];

  const divisionOrder = {
    "masters": 1,
    "seniors": 2,
    "juniors": 3
};

const filteredDecks = decks.flatMap(d => d.decks)
    .filter(result =>
      (selectedFormat === '' || result.eventFormat === selectedFormat) &&
      (selectedDivision === 'All Divisions' || selectedDivision === '' || result.division === selectedDivision) &&
      (result.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.playerName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)); // Sort by date descending

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFormat('');
    setSelectedDivision('');
  };

  const handleCardClick = (card) => {
    navigate(`/card/${card.set}/${card.number}`);
  };

  return (
    <DeckProfileContainer theme={theme} className='center-me'>
      <Helmet>
          <title>Decks - {decks[0].label}</title>
          <meta
              name='description'
              content={`All ${decks[0].label} decks documented on PTCG Legends.`}
          />
          <meta property='og:title' content="Deck Profile" />
          <meta
              property='og:description'
              content={`All ${decks[0].label} decks documented on PTCG Legends.`}
          />
          <meta
              property='og:url'
              content={`https://www.ptcglegends.com/decks/${id}`}
          />
          <meta property='og:type' content='website' />
          <meta name='author' content='PTCG Legends' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content="Deck Profile" />
          <meta
              name='twitter:description'
              content={`All ${decks[0].label} decks documented on PTCG Legends.`}
          />
      </Helmet>
      <div className='player-results-container'>
        <div className='completed-n-upcoming'>
          <div className='bts-in'>
            <h1>{decks[0].label}</h1>
          </div>
          <div className='search-input'>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              className='searcheventsfield'
              placeholder="Search player / event..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className='filter-container'>
          <div className='filters-top'>
            <div className='indiv-filter'>
              <p className='sort-events'>Format:</p>
              <select
    value={selectedFormat}
    onChange={e => {
      setSelectedFormat(e.target.value);
      setSearchParams({ format: e.target.value });
    }}
  >
    {sortedFormats.map(fmt => (
      <option key={fmt} value={fmt}>{fmt}</option>
    ))}
  </select>
            </div>
            <div className='indiv-filter'>
            <p className='sort-events'>Division:</p>
            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
              {uniqueDivisions.map((division, index) => (
                <option key={index} value={division}>{division.charAt(0).toUpperCase() + division.slice(1)}</option>
              ))}
            </select>
            </div>
            <button onClick={resetFilters} className="reset-btn">Reset</button>
          </div>
        </div>
        {/* <div className='average-card-counts'>
          <p>Avg. Card Count in {decks[0].label}</p> */}
          {/* <div className='button-container'>
            <button
              onClick={handleShowTop30}
              className={showTop30 ? 'active-button' : ''}
            >
              Show All Cards
            </button>
            <button
              onClick={handleShowAllCommonCards}
              className={!showTop30 ? 'active-button' : ''}
            >
              Only Cards in All Lists
            </button>
          </div> */}
          {/* <div className="deck-cards">
            {averageCardCounts.length > 0 ? (
              averageCardCounts.map((card, index) => (
                <div key={index} className="card-container-avg" onClick={() => handleCardClick(card)}>
                  <img src={cardImageUrl(card)} alt={card.name} />
                  <div className="card-count-avg">{card.averageCount}</div>
                </div>
              ))
            ) : (
              <p>No common cards found in this archetype.</p>
            )}
          </div>
        </div> */}
        <table className='results-table deck-profile-table'>
          <thead>
            <tr>
              <th></th>
              <th>Player</th>
              <th>Division</th>
              <th></th>
              <th>Deck</th>
            </tr>
          </thead>
          <tbody>
            {filteredDecks.map((result, index) => {
              const isDifferentEvent =
                index === 0 ||
                result.eventId !== filteredDecks[index - 1].eventId;

              return (
                <React.Fragment key={index}>
                  {isDifferentEvent && (
                    <EventSeparator>
                      <td colSpan="6" className='paddingfive'>
                        <Link className="event-separator-content" to={`/tournaments/${result.eventId}`}>
                          <strong>{result.eventName}</strong> &nbsp;&nbsp;-&nbsp; {result.eventDate} &nbsp;({result.eventFormat})
                        </Link>
                      </td>
                    </EventSeparator>
                  )}
                  <tr>
                  <td>{getPlacementSuffix(result.placement)}</td>
                  <td><Link className='link-to-playerprofile' to={`/player/${normalizeName(result.playerName)}-${result.playerFlag}`}>{formatName(result.playerName)}</Link></td>
                    <td><span className='grey'>{formatName(result.division)}</span></td>
                    <td></td>
                    <td className='player-deck-icons center-content'>
                      <img
                        src={`/assets/sprites/${result.sprite1}.png`}
                        alt={`${result.playerName}'s deck`}
                        style={{ width: '55px' }}
                      />
                      {result.sprite2 && (
                        <img
                          className='movesecondspritedecks'
                          src={`/assets/sprites/${result.sprite2}.png`}
                          alt={`${result.playerName}'s deck`}
                          style={{ width: '55px' }}
                        />
                      )}
                      <Link
                        to={`/tournaments/${result.eventId}/${result.division}/${result.playerName}-${result.playerFlag}`}
                        className={result.decklist ? '' : 'no-decklist'}
                      >
                        <span className={`material-symbols-outlined ${result.decklist ? '' : 'no-decklist'}`}>
                          format_list_bulleted
                        </span>
                      </Link>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </DeckProfileContainer>
  );
};

export default DeckProfile;
