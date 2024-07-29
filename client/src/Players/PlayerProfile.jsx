import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const PlayerProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const PlayerProfile = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

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
    return <div>Loading...</div>;
  }

  return (
    <PlayerProfileContainer theme={theme}>
      <Helmet>
        <title>{player.name}</title>
      </Helmet>
      <h1>{player.name}</h1>
      <p>Flag: {player.flag}</p>
      <h2>Results</h2>
      <ul>
        {player.results.map(result => (
          <li key={result.eventId}>
            Event: {result.eventId}, Sprite 1: {result.sprite1}, Sprite 2: {result.sprite2}
          </li>
        ))}
      </ul>
    </PlayerProfileContainer>
  );
};

export default PlayerProfile;
