import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/deckspage.css';

const express = require('express');
const router = express.Router(); // Define router

const DeckProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  .results-table td a {
    color: ${({ theme }) => theme.text};
  }
  .results-table td:nth-child(3) {
    text-align: center;
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
  .results-table td a:hover {
    color: #1290eb;
  }
`;
 const EventSeparator = styled.tr`
  background-color: #1290eb !important;
  color: white !important;
  font-weight: bold;
  text-align: left;
  text-shadow: 1px 1px 4px black;
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

const getEventLink = (eventId) => {
  return `/tournaments/${eventId}`;
};

const DeckProfile = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/decks/${label}`);
        const data = await response.json();
        setDeck(data);
      } catch (error) {
        console.error('Error fetching deck:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!deck) {
    return <div>No data found for this deck.</div>;
  }

  // Function to parse date from the format used in eventDate
  const parseDate = (dateString) => {
    return new Date(dateString.split(' - ')[0] + ', ' + dateString.split(', ')[1]);
  };

  // Get unique formats and divisions from deck data
  const uniqueFormats = [...new Set(deck.decks.map(d => d.eventFormat))];
  const uniqueDivisions = ['All', ...new Set(deck.decks.map(d => d.division))];

  // Sort decks by event date and apply filters
  const filteredDecks = deck.decks
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

  return (
    <DeckProfileContainer theme={theme} className='center-me'>
      <Helmet>
        <title>{deck.label}</title>
      </Helmet>
      <div className='player-results-container'>
        <div className='completed-n-upcoming'>
          <div className='bts-in'></div>
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
              <select value={selectedDivision} onChange={e => setSelectedDivision(e.target.value)}>
                {uniqueDivisions.map((division, index) => (
                  <option key={index} value={division}>{division}</option>
                ))}
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
              // Check if the previous result is from a different event
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
                    <td>{result.placement}</td>
                    <td><Link className='link-to-playerprofile' to={`/player/${result.playerId}`}>{formatName(result.playerName)}</Link></td>
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
                        className={result.decklist && result.decklist.length ? '' : 'no-decklist'}
                      >
                        <span className={`material-symbols-outlined ${result.decklist && result.decklist.length ? '' : 'no-decklist'}`}>
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
