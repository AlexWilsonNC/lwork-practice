import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/decklist.css';
import DecklistOptions from '../Tools/DecklistOptions';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const PlayerDeckCenter = styled.div`
    background: ${({ theme }) => theme.body};
    .player-deck {
        background: ${({ theme }) => theme.deckBg};
        color: ${({ theme }) => theme.text};
    }
    .deck-cards {
        background-image: ${({ theme }) => theme.deckPlaymat};
        border: ${({ theme }) => theme.deckBorder};
    }
    .copy-decklist-btn,
    .open-in-deckbuilder-btn,
    .deckview-switcher div {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }
    .list-item {
        background: ${({ theme }) => theme.listCardBg};
        color: ${({ theme }) => theme.listCardText};
    }
`;

const cleanCardName = (name) => {
    return name.replace(" - ACESPEC", "").replace(" - Basic", "");
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const normalizeString = (str) => {
    return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const getPlacementSuffix = (number) => {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) {
        return (
            <>
                {number}
                <sup>st</sup>
            </>
        );
    }
    if (j === 2 && k !== 12) {
        return (
            <>
                {number}
                <sup>nd</sup>
            </>
        );
    }
    if (j === 3 && k !== 13) {
        return (
            <>
                {number}
                <sup>rd</sup>
            </>
        );
    }
    return (
        <>
            {number}
            <sup>th</sup>
        </>
    );
};

const formatName = (name) => {
    const lowercaseWords = ['de', 'da', 'of', 'the'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jr', 'jt', 'jz', 'pj', 'sj', 'pk'];

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

const PlayerDeck = () => {
    const { theme } = useTheme();
    const { eventId, division, playerId } = useParams();
    const [playerData, setPlayerData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [placement, setPlacement] = useState(null);
    const [viewMode, setViewMode] = useState(localStorage.getItem('viewMode') || 'grid');
    const navigate = useNavigate();
    const [cardData, setCardData] = useState(null);

    useEffect(() => {
        const fetchCardData = async (format) => {
            try {
                console.log('Fetching cards from API with format:', format);
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/cards?format=${format}`);
                console.log('API response:', response);
                if (response.ok) {
                    const cards = await response.json();
                    console.log('Fetched card data:', cards);
                    const newCardData = {};
                    const cardMap = {};
                    const cardNameMap = {};

                    cards.forEach(card => {
                        const key = `${card.setAbbrev}-${card.number}`;
                        cardMap[key] = card;

                        const nameKey = normalizeString(card.name);
                        if (!cardNameMap[nameKey]) {
                            cardNameMap[nameKey] = [];
                        }
                        cardNameMap[nameKey].push(card);
                    });
                    newCardData.cardMap = cardMap;
                    newCardData.cardNameMap = cardNameMap;
                    setCardData(newCardData);
                } else {
                    console.error('Failed to fetch card data');
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        const fetchPlayerData = async () => {
            const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/events/${eventId}`);
            if (response.ok) {
                const eventData = await response.json();
                setEventData(eventData);
                const divisionData = eventData[division];
                if (divisionData) {
                    const decodedPlayerId = decodeURIComponent(playerId);
                    const playerIndex = divisionData.findIndex(p => `${encodeURIComponent(p.name)}-${p.flag}` === playerId);
                    const player = divisionData.find(p => {
                        const normalizedPlayerName = p.name;
                        const normalizedPlayerFlag = p.flag;
                        const normalizedPlayerId = `${normalizedPlayerName}-${normalizedPlayerFlag}`;
                        return normalizedPlayerId === decodedPlayerId;
                    });
                    if (player) {
                        setPlayerData(player);
                        setPlacement(playerIndex + 1);
                        fetchCardData(eventData.format);
                    } else {
                        console.error('Player not found in division data');
                    }
                } else {
                    console.error('Division not found in event data');
                }
            } else {
                console.error('Failed to fetch player data');
            }
        };
        fetchPlayerData();
    }, [eventId, division, playerId]);

    const cardImageUrl = (card) => {
        let key = `${card.set}-${card.number}`;

        if (card.name.toLowerCase() === 'grass energy - basic') {
            key = 'SVE-1';
        } else if (card.name.toLowerCase() === 'fire energy - basic') {
            key = 'SVE-2';
        } else if (card.name.toLowerCase() === 'water energy - basic') {
            key = 'SVE-3';
        } else if (card.name.toLowerCase() === 'lightning energy - basic') {
            key = 'SVE-4';
        } else if (card.name.toLowerCase() === 'psychic energy - basic') {
            key = 'SVE-5';
        } else if (card.name.toLowerCase() === 'fighting energy - basic') {
            key = 'SVE-6';
        } else if (card.name.toLowerCase() === 'darkness energy - basic') {
            key = 'SVE-7';
        } else if (card.name.toLowerCase() === 'metal energy - basic') {
            key = 'SVE-8';
        }

        let cardInfo = cardData?.cardMap?.[key];

        if (cardInfo) {
            return cardInfo.images.small;
        }
        return null;
    };

    const countCards = (decklist, type) => {
        return decklist[type].reduce((total, card) => total + card.count, 0);
    };

    const switchToGridView = () => {
        setViewMode('grid');
        localStorage.setItem('viewMode', 'grid');
    };
    const switchToListView = () => {
        setViewMode('list');
        localStorage.setItem('viewMode', 'list');
    };

    const handleCardClick = (card) => {
        navigate(`/card/${card.set}/${card.number}`);
    };

    if (!playerData) {
        return null;
    }

    return (
        <PlayerDeckCenter className='center' theme={theme}>
            <Helmet>
                <title>{formatName(playerData.name)}'s Decklist</title>
                <meta name="description" content={`${formatName(playerData.name)}'s decklist from ${eventData.name} - ${eventData.date}.`} />
                <meta property="og:title" content={eventData.name} />
                <meta property="og:description" content={`${formatName(playerData.name)}'s decklist from ${eventData.name} - ${eventData.date}.`} />
                <meta property="og:image" content={eventData.thumbnail} />
                <meta property="og:url" content={`https://www.ptcglegends.com/tournaments/${eventData.eventId}`} />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={eventData.name} />
                <meta name="twitter:description" content={`${formatName(playerData.name)}'s decklist from ${eventData.name} - ${eventData.date}.`} />
                <meta name="twitter:image" content={eventData.thumbnail} />
            </Helmet>
            <div className="player-deck">
                <div className='player-deck-top'>
                    <div>
                        <h2>{formatName(playerData.name)}</h2>
                        <hr className='playerdeck-hr'></hr>
                        <p>{getPlacementSuffix(placement)} Place ({capitalizeFirstLetter(division)})</p>
                        {eventData && <p><Link className='blue-link' to={`/tournaments/${eventId}/${division}`}>{eventData.name}</Link></p>}
                        {eventData && <p>{eventData.date} ({eventData.format})</p>}
                    </div>
                    <div className='deck-top-right-options'>
                        <DecklistOptions decklist={playerData.decklist} />
                        <div className='deckview-switcher'>
                            <div className={`list-form ${viewMode === 'list' ? 'active-grid-option' : ''}`} onClick={switchToListView}>
                                <span className="material-symbols-outlined">reorder</span>
                            </div>
                            <div className={`playmat-form ${viewMode === 'grid' ? 'active-grid-option' : ''}`} onClick={switchToGridView}>
                                <span className="material-symbols-outlined">grid_view</span>
                            </div>
                        </div>
                    </div>
                </div>
                {viewMode === 'grid' ? (
                    <div className="deck-cards">
                        {playerData.decklist.pokemon.map((card, index) => (
                            <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
                                <img src={cardImageUrl(card)} alt={card.name} />
                                <div className="card-count">{card.count}</div>
                            </div>
                        ))}
                        {playerData.decklist.trainer.map((card, index) => (
                            <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
                                <img src={cardImageUrl(card)} alt={card.name} />
                                <div className="card-count">{card.count}</div>
                            </div>
                        ))}
                        {playerData.decklist.energy.map((card, index) => (
                            <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
                                <img src={cardImageUrl(card)} alt={card.name} />
                                <div className="card-count">{card.count}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="deck-list">
                        <div className='column-section'>
                            <div className='list-category'><h2>Pokémon ({countCards(playerData.decklist, 'pokemon')})</h2></div>
                            <div className='list-of-cards'>{playerData.decklist.pokemon.map((card, index) => (
                                <div key={index} className="list-item" onClick={() => handleCardClick(card)}>
                                    <p className='list-card-count'>{card.count}</p>
                                    <p className='bold-name'>{cleanCardName(card.name)}</p>
                                    <img className='pokemon-list-img' src={cardImageUrl(card)} alt={card.name} />
                                </div>
                            ))}</div>
                        </div>
                        <div className='column-section'>
                            <div className='list-category'><h2>Trainer ({countCards(playerData.decklist, 'trainer')})</h2></div>
                            <div className='list-of-cards'>{playerData.decklist.trainer.map((card, index) => (
                                <div key={index} className="list-item" onClick={() => handleCardClick(card)}>
                                    <p className='list-card-count'>{card.count}</p>
                                    <p className='bold-name'>{cleanCardName(card.name)}</p>
                                    <img className='trainer-list-img' src={cardImageUrl(card)} alt={card.name} />
                                </div>
                            ))}</div>
                        </div>
                        <div className='column-section'>
                            <div className='list-category'><h2>Energy ({countCards(playerData.decklist, 'energy')})</h2></div>
                            <div className='list-of-cards'>{playerData.decklist.energy.map((card, index) => (
                                <div key={index} className="list-item" onClick={() => handleCardClick(card)}>
                                    <p className='list-card-count'>{card.count}</p>
                                    <p className='bold-name'>{cleanCardName(card.name)}</p>
                                    <img className='energy-list-img' src={cardImageUrl(card)} alt={card.name} />
                                </div>
                            ))}</div>
                        </div>
                    </div>
                )}
            </div>
        </PlayerDeckCenter>
    );
};

export default PlayerDeck;
