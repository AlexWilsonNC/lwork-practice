import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const DeckListContainer = styled.div`
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
`;

const Decks = () => {
  const { theme } = useTheme();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch('https://your-api-url.com/api/decks');
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

  return (
    <DeckListContainer theme={theme} className='center-me'>
      <Helmet>
        <title>Decks</title>
      </Helmet>
      <div className='deck-results-container'>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <table className='results-table'>
            <thead>
              <tr>
                <th></th>
                <th>Archetype</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {decks.map((deck, index) => (
                <tr key={deck._id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/deck/${deck._id}`}>
                      {deck.label}
                    </Link>
                  </td>
                  <td>{deck.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DeckListContainer>
  );
};

export default Decks;
