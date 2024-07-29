import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
// import '../css/player-profile.css';
// import { flags } from './flags'; // Ensure you have the correct import for flags

const PlayerProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const formatName = (name) => {
    // your formatName function
};

const PlayerProfile = () => {
    const { theme } = useTheme();
    const { playerId } = useParams();
    const [playerData, setPlayerData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/players/${playerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPlayerData(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message);
                }
            } catch (error) {
                setError('Error fetching player data');
            }
        };

        fetchPlayerData();
    }, [playerId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!playerData) {
        return <div>Loading...</div>;
    }

    return (
        <PlayerProfileContainer theme={theme}>
            <Helmet>
                <title>{formatName(playerData.name)}'s Profile</title>
            </Helmet>
            <div className='player-profile'>
                <h1>{formatName(playerData.name)}</h1>
                <img src={flags[playerData.flag]} alt="flag" />
                <h2>Results</h2>
                <ul>
                    {playerData.results.map((result, index) => (
                        <li key={index}>{result.eventName} - {result.placement}</li>
                    ))}
                </ul>
            </div>
        </PlayerProfileContainer>
    );
};

export default PlayerProfile;
