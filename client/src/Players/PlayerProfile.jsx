import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');

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
    <div>
      <h1>{player.name}</h1>
      <p>Flag: {player.flag}</p>
      <p>Results:</p>
      <ul>
        {player.results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerProfile;
