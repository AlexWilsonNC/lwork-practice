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
    .spinner {
        border-left-color: ${({ theme }) => theme.searchTxt};
    }
`;

const orderedSets = [
    "TWM", "TEF", "PAF", "PAR", "MEW", "OBF", "PAL", "SVI", "SVE", "PR-SV",

    "CRZ", "SIT", "LOR", "PGO", "ASR", "BRS", "FST", "CEL", "EVS", "CRE", "BST",
    "SHF", "VIV", "CPA", "DAA", "RCL", "SSH", "PR-SW",

    "CEC", "HIF", "UNM", "UNB", "DPI", "TEU", "LOT", "DRM", "CES", "FLI", "UPR",
    "CIN", "SLG", "BUS", "GRI", "SUM", "PR-SM",

    "EVO", "STS", "FCO", "GEN", "BKP", "BKT", "AOR", "ROS", "DCE", "PRC", "PHF", "FFI",
    "FLF", "KSS", "XY", "PR-XY",

    "LTR", "PLB", "PLF", "PLS", "BCR", "DRV", "DRX", "DEX", "NXD", "NVI", "EPO", "BLW", "PR-BLW",

    "CL", "TM", "UD", "UL", "HS", "RM", "PR-HS",

    "AR", "SV", "RR", "P9", "PL", "SF", "P8", "LA", "MD", "P7", "GE", "SW", "P6",
    "MT", "DP", "PR-DP",

    "P5", "PK", "DF", "CG", "P4", "HP", "P3", "TK2", "LM", "DS", "P2", "UF", "EM", "DX",
    "TRR", "P1", "FL", "HL", "TK1", "MA", "DR", "SS", "RS", "PR-EX",

    "SK", "AQ", "EX", "LC", "N4", "N3", "SI", "N2", "N1", "G2", "G1", "TR", "B2",
    "FO", "JU", "BS", "PR-BS",
];

const promoSets = {
    "TWM": "PR-SV",
    "TEF": "PR-SV",
    "PAF": "PR-SV",
    "PAR": "PR-SV",
    "MEW": "PR-SV",
    "OBF": "PR-SV",
    "PAL": "PR-SV",
    "SVI": "PR-SV",
    "SVE": "PR-SV",
    "CRZ": "PR-SW",
    "SIT": "PR-SW",
    "LOR": "PR-SW",
    "PGO": "PR-SW",
    "ASR": "PR-SW",
    "BRS": "PR-SW",
    "CEC": "PR-SM",
    "HIF": "PR-SM",
    "UNM": "PR-SM",
    "UNB": "PR-SM",
    "DPI": "PR-SM",
    "TEU": "PR-SM",
    "LOT": "PR-SM",
    "DRM": "PR-SM",
    "CES": "PR-SM",
    "FLI": "PR-SM",
    "UPR": ["PR-SM", "CIN", "SUM", "GRI"],
    "CIN": "PR-SM",
    "SLG": "PR-SM",
    "BUS": "PR-SM",
    "GRI": "PR-SM",
    "SUM": "PR-SM",
    "EVO": "PR-XY",
    "STS": "PR-XY",
    "FCO": "PR-XY",
    "GEN": "PR-XY",
    "BKP": "PR-XY",
    "BKT": "PR-XY",
    "AOR": "PR-XY",
    "ROS": "PR-XY",
    "DCE": "PR-XY",
    "PRC": "PR-XY",
    "PHF": "PR-XY",
    "FFI": "PR-XY",
    "FLF": "PR-XY",
    "XY": "PR-XY",
    "KSS": "PR-XY",
    "LTR": "PR-BLW",
    "PLB": "PR-BLW",
    "PLF": "PR-BLW",
    "PLS": "PR-BLW",
    "BCR": ["PR-BLW", "EPO"],
    "DRV": "PR-BLW",
    "DRX": "PR-BLW",
    "DEX": "PR-BLW",
    "NXD": ["PR-BLW", "EPO"],
    "NVI": "PR-BLW",
    "EPO": "PR-BLW",
    "BLW": "PR-BLW",
    "CL": "PR-HS",
    "TM": "PR-HS",
    "UD": "PR-HS",
    "UL": "PR-HS",
    "HS": "PR-HS",
    "AR": "PR-DP",
    "SV": "PR-DP",
    "RR": "PR-DP",
    "P9": "PR-DP",
    "PL": "PR-DP",
    "SF": "PR-DP",
    "P8": "PR-DP",
    "LA": "PR-DP",
    "MD": "PR-DP",
    "P7": "PR-DP",
    "GE": "PR-DP",
    "SW": "PR-DP",
    "P6": "PR-DP",
    "MT": "PR-DP",
    "DP": "PR-DP",
    "P5": "PR-EX",
    "PK": "PR-EX",
    "DF": "PR-EX",
    "CG": "PR-EX",
    "P4": "PR-EX",
    "HP": "PR-EX",
    "P3": "PR-EX",
    "TK2": "PR-EX",
    "LM": "PR-EX",
    "DS": "PR-EX",
    "P2": "PR-EX",
    "UF": "PR-EX",
    "EM": "PR-EX",
    "DX": "PR-EX",
    "TRR": "PR-EX",
    "P1": "PR-EX",
    "FL": "PR-EX",
    "HL": ["PR-EX", "RS"],
    "TK1": "PR-EX",
    "MA": "PR-EX",
    "DR": "PR-EX",
    "SS": "PR-EX",
    "RS": "PR-EX",
    "SK": "PR-BS",
    "AQ": "PR-BS",
    "EX": "PR-BS",
    "N4": "PR-BS",
    "N3": "PR-BS",
    "SI": "PR-BS",
    "N2": "PR-BS",
    "N1": ["PR-BS", "BS", "TR"],
    "G2": "PR-BS",
    "G1": "PR-BS",
    "LC": "PR-BS",
    "TR": "PR-BS",
    "B2": "PR-BS",
    "FO": "PR-BS",
    "JU": "PR-BS",
    "BS": "PR-BS"
};

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
    if (number === null || number === 0) return '';
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

const formatToCollections = (format) => {
    const [startSet, endSet] = format.split('-');
    const startIndex = orderedSets.indexOf(startSet);
    const endIndex = orderedSets.indexOf(endSet);

    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Invalid format range');
    }

    const [actualStart, actualEnd] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
    const collections = orderedSets.slice(actualStart, actualEnd + 1).reverse();

    Object.keys(promoSets).forEach((set) => {
        if (collections.includes(set) && !collections.includes(promoSets[set])) {
            collections.push(promoSets[set]);
        }
    });
    
    return collections;
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
    const [loadingImages, setLoadingImages] = useState(true);
    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    useEffect(() => {
        const fetchCardData = async (format) => {
            try {
                const collections = formatToCollections(format);
                const collectionsParam = collections.join(',');
                const url = `https://ptcg-legends-6abc11783376.herokuapp.com/api/cards?format=${collectionsParam}`;
        
                const response = await fetch(url);
        
                if (response.ok) {
                    const cards = await response.json();
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
                    console.error('Failed to fetch card data, status:', response.status);
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
                    const [playerName, playerFlag] = decodedPlayerId.split(/-(?=[^-]+$)/);
                    const normalizedPlayerName = normalizeString(playerName);
        
                    const playerIndex = divisionData.findIndex(p => normalizeString(p.name) === normalizedPlayerName && p.flag === playerFlag);
        
                    if (playerIndex !== -1) {
                        const player = divisionData[playerIndex];
                        setPlayerData(player);
                        setPlacement(playerIndex + 1);
                        const format = division === 'professors' ? eventData.formatProfessors : eventData.format;
                        fetchCardData(format);
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
    
    {eventData && <p>{eventData.date} ({division === 'professors' ? eventData.formatProfessors : eventData.format})</p>}
    
    useEffect(() => {
        if (cardData) {
            const totalImages = playerData.decklist.pokemon.length + playerData.decklist.trainer.length + playerData.decklist.energy.length;
            if (imagesLoadedCount === totalImages) {
                setLoadingImages(false);
            }
        }
    }, [imagesLoadedCount, cardData, playerData]);

    const handleImageLoad = () => {
        setImagesLoadedCount(prevCount => prevCount + 1);
    };
      
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
                    <p>{placement !== null && placement > 0 ? getPlacementSuffix(placement) : ''} Place ({capitalizeFirstLetter(division)})</p>
                    {eventData && <p><Link className='blue-link' to={`/tournaments/${eventId}/${division}`}>{eventData.name}</Link></p>}
                    {eventData && <p>{eventData.date} ({division === 'professors' ? eventData.formatProfessors : eventData.format})</p>}
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
            {!playerData ? (
                null
                ) : !cardData ? (
                <div className="spinner"></div>
                ) : viewMode === 'grid' ? (
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
