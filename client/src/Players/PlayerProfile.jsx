import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
// import '../css/player-profile.css';
// import { flags } from './flags';

const PlayerProfileContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const formatName = (name) => {
    const lowercaseWords = ['de', 'da', 'of', 'the', 'van'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.'];

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

const PlayerProfile = () => {
    const { theme } = useTheme();
    const { playerId } = useParams();
    const [playerData, setPlayerData] = useState(null);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/players/${playerId}`);
                const data = await response.json();
                setPlayerData(data);
            } catch (error) {
                console.error('Error fetching player data:', error);
            }
        };

        fetchPlayerData();
    }, [playerId]);

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
