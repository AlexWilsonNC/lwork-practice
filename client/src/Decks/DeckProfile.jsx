// DeckProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import DisplayPokemonSprites from '../Tournaments/pokemon-sprites';
// import logos from '../assets/event-logo'; // Assuming you have an index.js exporting all logos
// import flags from '../assets/flags'; // Assuming you have an index.js exporting all flags

const DeckProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  .results-table {
    width: 100%;
    margin-top: 15px;
    font-size: 14px;
  }
  .results-table th, .results-table td {
    padding: 8px;
    text-align: left;
  }
  .results-table th {
    background-color: #1290eb;
    color: white;
  }
`;

const formatName = (name) => {
  // Implement your format name function here
};

const DeckProfile = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [deckData, setDeckData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/decks/${id}`);
        if (!response.ok) {
          throw new Error('Deck not found');
        }
        const data = await response.json();
        setDeckData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDeckData();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!deckData) {
    return <div>Loading...</div>;
  }

  return (
    <DeckProfileContainer theme={theme}>
      <Helmet>
        <title>{deckData.label}</title>
      </Helmet>
      <h1>{deckData.label}</h1>
      <table className="results-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Player</th>
            <th>Placement</th>
            <th>Sprites</th>
            <th>Decklist</th>
          </tr>
        </thead>
        <tbody>
          {deckData.decks.map((deck, index) => (
            <tr key={index}>
              <td>{deck.eventDate}</td>
              <td>
                <img src={logos[deck.eventLogo]} alt="Event Logo" />
                <Link to={`/tournaments/${deck.eventId}`}>
                  {deck.eventName}
                </Link>
              </td>
              <td>
                <img src={flags[deck.flag]} alt="Flag" />
                <Link to={`/player/${deck.playerId}`}>
                  {formatName(deck.playerName)}
                </Link>
              </td>
              <td>{deck.placement}</td>
              <td>
                <DisplayPokemonSprites sprite1={deck.sprite1} sprite2={deck.sprite2} />
              </td>
              <td>
                <Link to={`/tournaments/${deck.eventId}/${deck.division}/${encodeURIComponent(deck.playerName)}-${deck.flag}`}>
                  <span className="material-symbols-outlined">format_list_bulleted</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DeckProfileContainer>
  );
};

export default DeckProfile;
