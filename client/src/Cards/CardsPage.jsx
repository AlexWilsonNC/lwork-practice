import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import { useParams, Link } from 'react-router-dom';
import '../css/card.css';

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const CardImage = styled.img`
  width: 150px;
  height: auto;
  margin: 4px 7px;
  transition: ease all 0.3s;
  box-shadow: 1px 1px 7px black;
  border-radius: 7px;
`;

const CardsPage = () => {
  const { theme } = useTheme();
  const { setName } = useParams();
  const [cards, setCards] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [nameText, setNameText] = useState(''); 
  const [setRelease, setSetRelease] = useState(''); 

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/${setName}`);
        console.log('Response status:', response.status); // Log response status
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched card data:', data); // Log fetched data
          data.sort((a, b) => parseInt(a.number) - parseInt(b.number));
          setCards(data);
          if (data.length > 0) {
            setLogoUrl(data[0].set.images.logo); // Extract logo URL from the first card
            setNameText(data[0].set.name); // Extract logo URL from the first card
            setSetRelease(data[0].set.setSetRelease); // Extract logo URL from the first card
          }
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, [setName]);

  return (
    <CardsContainer theme={theme}>
      <Helmet>
        <title>All Cards</title>
        <meta name="description" content={`Browse all cards from the ${setName} collection.`} />
        <meta property="og:title" content={`PTCG Legends - ${setName} Cards`} />
        <meta property="og:description" content={`Browse all cards from the ${setName} collection.`} />
      </Helmet>
      <div className='card-set-container'>
        <div className='set-search-area'>
          <h2>Change Set +</h2>
        </div>
        <div className='set-info-area'>
          {logoUrl && <img src={logoUrl} alt="Set Logo" />}
          {nameText && <p>{nameText}</p>}
          {setRelease && <p>{setRelease}</p>}
        </div>
        <div className='card-display-area'>
          {cards.map((card, index) => (
            <Link key={index} to={`/card/${card.setAbbrev}/${card.number}`}>
              <CardImage
                src={card.images.small}
                loading="lazy"
                alt={`${card.setAbbrev} ${card.number}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </CardsContainer>
  );
};

export default CardsPage;
