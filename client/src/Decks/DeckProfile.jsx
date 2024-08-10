import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/deckspage.css';

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

const getEventLink = (eventId) => {
  return `/tournaments/${eventId}`;
};

const DeckProfile = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/decks/${id}`);
        if (!response.ok) {
          throw new Error('Deck not found');
        }
        const data = await response.json();
        setDecks(data);
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [id]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!decks.length) {
    return <div>No data found for this deck.</div>;
  }

  const parseDate = (dateString) => {
    return new Date(dateString.split(' - ')[0] + ', ' + dateString.split(', ')[1]);
  };

  const uniqueFormats = [...new Set(decks.flatMap(d => d.decks.map(deck => deck.eventFormat)))];
  const uniqueDivisions = ['All', ...new Set(decks.flatMap(d => d.decks.map(deck => deck.division)))];

  const filteredDecks = decks.flatMap(d => d.decks)
    .filter(result =>
      (selectedFormat === '' || result.eventFormat === selectedFormat) &&
      (selectedDivision === 'All' || selectedDivision === '' || result.division === selectedDivision) &&
      (result.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.playerName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => parseDate(b.eventDate) - parseDate(a.eventDate));

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFormat('');
    setSelectedDivision('');
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
          {/* <meta property='og:image' content={eventData.thumbnail} /> */}
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
          {/* <meta name='twitter:image' content={eventData.thumbnail} /> */}
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
              <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}>
                <option value="">All Formats</option>
                {uniqueFormats.map((format, index) => (
                  <option key={index} value={format}>{format}</option>
                ))}
              </select>
            </div>
            <div className='indiv-filter'>
            <p className='sort-events'>Division:</p>
            <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
                <option value="All">All</option>
                <option value="masters">Masters</option>
                <option value="seniors">Seniors</option>
                <option value="juniors">Juniors</option>
            </select>
            </div>
            <button onClick={resetFilters} className="reset-btn">Reset</button>
          </div>
        </div>
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
