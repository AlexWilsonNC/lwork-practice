import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import '../css/card.css';

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const CardImage = styled.img`
  margin: 10px;
  width: 150px;
  height: 210px;
  object-fit: cover;
`;

const CardsPage = () => {
  const { theme } = useTheme();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/TWM');
        console.log('Response status:', response.status); // Log response status
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched card data:', data); // Log fetched data
          setCards(data);
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <CardsContainer theme={theme}>
      <Helmet>
        <title>All Cards</title>
        <meta name="description" content="Browse all cards from the TWM collection." />
        <meta property="og:title" content="PTCG Legends - All Cards" />
        <meta property="og:description" content="Browse all cards from the TWM collection." />
      </Helmet>
      {cards.map((card, index) => (
        <CardImage key={index} src={card.images.small} alt={card.name} />
      ))}
    </CardsContainer>
  );
};

export default CardsPage;
