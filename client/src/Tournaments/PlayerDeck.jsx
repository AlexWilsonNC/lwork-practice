import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/decklist.css';
import DecklistOptions from '../Tools/DecklistOptions';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import DisplayPokemonSprites, { getPokemonSprites } from './pokemon-sprites';
import { flags, countryNames } from '../Tools/flags';

const PlayerDeckCenter = styled.div`
    background: ${({ theme }) => theme.body};
    .player-deck {
        background: ${({ theme }) => theme.deckBg};
        color: ${({ theme }) => theme.text};
    }
    .deck-cards {
        background-image: ${({ theme }) => theme.deckModalAccountList};
        border: ${({ theme }) => theme.deckBorder};
    }
    .copy-decklist-btn,
    .open-in-deckbuilder-btn,
    .save-to-collection-btn,
    .deckview-switcher div {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }
    .list-item {
        background: ${({ theme }) => theme.listCardBg};
        color: ${({ theme }) => theme.listCardText};
    }
    .spinner {
        border-left-color: ${({ theme }) => theme.spinner};
    }
    .link-to-playerprofile {
        color: ${({ theme }) => theme.text};
    }
    .link-to-playerprofile:hover,
    .link-to-playerprofile:hover .turned-link {
        color: #1290eb;
    }
    .turned-link,
    .player-decklink-cell a,
    .opponents-playerdeck-list {
        color: ${({ theme }) => theme.text};
    }
`;

const orderedSets = [
    "MEG", "MEE", "MEP", "BLK", "WHT", "DRI", "JTG", "PRE", "SSP", "SCR", "SFA", "TWM", "TEF", "PAF", "PAR", "MEW", "OBF", "PAL", "SVE", "SVI", "SVE", "PR-SV",
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
    "MEG": ["PR-SV", "MEP"],
    "MEE": ["PR-SV", "MEP"],
    "BLK": "PR-SV",
    "WHT": "PR-SV",
    "DRI": "PR-SV",
    "JTG": "PR-SV",
    "PRE": "PR-SV",
    "SSP": "PR-SV",
    "SCR": "PR-SV",
    "SFA": "PR-SV",
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
    "PRC": ["PR-XY", "PHF"],
    "PHF": "PR-XY",
    "FFI": "PR-XY",
    "FLF": "PR-XY",
    "XY": "PR-XY",
    "KSS": "PR-XY",
    "LTR": "PR-BLW",
    "PLB": "PR-BLW",
    "PLF": "PR-BLW",
    "PLS": "PR-BLW",
    "BCR": ["PR-BLW", "EPO", "DEX"],
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
    "N1": ["PR-BS", "BS", "TR", "LC"],
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
    return name.replace(" - ACESPEC Energy", "").replace(" - ACESPEC", "").replace(" - Basic", "").replace(" - Special", "");
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

const normalizeName = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/(^-|-$)/g, ''); // Remove leading and trailing hyphens
};

const formatName = (name) => {
    const lowercaseWords = ['de', 'of', 'the', 'van', 'der'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.', 'mk', 'jc'];

    const specialCases = {
        'de haes damien': 'De Haes Damien',
        'jamie depamphilis': 'Jamie DePamphilis',
    };

    const lowerCaseName = name.toLowerCase();
    if (specialCases[lowerCaseName]) {
        return specialCases[lowerCaseName];
    }
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

const isFeaturedEvent = (eventId) => eventId.includes("FEATURED");

const formatToCollections = (format) => {
    if (format === "BS-BS") return ["BS"];

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
    const [totalCardCount, setTotalCardCount] = useState(0);

    const isFeatured = isFeaturedEvent(eventId);

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
                    const [rawName, rawFlag] = decodedPlayerId.split(/-(?=[^-]+$)/);
                    const playerName = rawName;
                    const playerFlag = rawFlag === 'undefined' ? undefined : rawFlag;
                    const normalizedPlayerName = normalizeString(playerName);

                    let player = divisionData.find(p =>
                        normalizeString(p.name) === normalizedPlayerName
                        && (playerFlag
                            ? p.flag === playerFlag        // exact match when a real flag was provided
                            : (p.flag === undefined || p.flag === null)  // match missing flags
                        )
                    );

                    // 2) If not there, pull in the Day-1 static JSON and search that:
                    if (!player) {
                        try {
                            const eliminated = await fetchEliminatedJson(eventId, division);
                            player = eliminated.find(p =>
                                normalizeString(p.name) === normalizedPlayerName &&
                                p.flag === playerFlag
                            );
                            // optionally capture their “placing” if it’s in the JSON
                            if (player && typeof player.placing === 'number') {
                                setPlacement(player.placing);
                            }
                        } catch (e) {
                            console.error('Error loading Day-1 JSON:', e);
                        }
                    }

                    // 3) If we *still* don’t have them, bail out:
                    if (!player) {
                        console.error('Player not found in any source:', decodedPlayerId);
                        return;
                    }

                    // 4) Finally set state & kick off card fetch:
                    setPlayerData(player);
                    setPlayerData(player);

                    // Determine placement: use explicit if available, otherwise fallback to index+1
                    let pl = null;
                    if (typeof player.placing === 'number' && player.placing > 0) {
                        pl = player.placing;
                    } else {
                        const idx = divisionData.findIndex(p =>
                            normalizeString(p.name) === normalizeString(player.name)
                            && p.flag === player.flag
                        );
                        pl = idx >= 0 ? idx + 1 : null;
                    }
                    setPlacement(pl);

                    const fmt = division === 'professors'
                        ? eventData.formatProfessors
                        : eventData.format;
                    fetchCardData(fmt);

                } else {
                    console.error('Division not found in event data');
                }
            } else {
                console.error('Failed to fetch player data');
            }
        };

        fetchPlayerData();
    }, [eventId, division, playerId]);

    const fetchEliminatedJson = async (eventId, division) => {
        const [year, slug] = eventId.split('_');
        const url = `https://alexwilsonnc.github.io/eliminated-players/${year}/${slug.toLowerCase()}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Eliminated JSON ${res.status}`);
        const data = await res.json();
        const key = `${division}`;
        return Array.isArray(data[key]) ? data[key] : [];
    };

    const [eliminatedRecords, setEliminatedRecords] = useState([]);

    useEffect(() => {
        if (!eventId || !division) return;
        (async () => {
            try {
                const data = await fetchEliminatedJson(eventId, division);
                setEliminatedRecords(Array.isArray(data) ? data : []);
            } catch (e) {
                console.warn('No eliminated JSON for opponents:', e);
            }
        })();
    }, [eventId, division]);

    const parseOpponent = (val = '') => {
        const m = val.match(/\[([A-Z]{2})\]\s*$/);
        const code = m ? m[1] : 'unknown';
        const name = val.replace(/\s*\[[A-Z]{2}\]\s*$/, '').trim();
        return { code, name };
    };

    // const getCountryNameSafe = (code) => {
    //     if (typeof countryNames !== 'undefined' && countryNames) {
    //         return countryNames[code] || 'Unknown';
    //     }
    //     return code || 'Unknown';
    // };

    const flagSrc = (code) => flags[code] || flags.unknown;

    const normalizeSpriteKey = (val) => {
        if (!val) return '';
        const base = String(val).split('/').pop();
        return base.replace(/\.png$/i, '');
    };

    const makeDisplayPair = (firstIn, secondIn) => {
        const first = normalizeSpriteKey(firstIn);
        const second = normalizeSpriteKey(secondIn);

        // both present → keep order
        if (first && second) return { first, second };

        // exactly one present → put it in SECOND slot, and use "blank" for first
        const only = first || second;
        if (only) return { first: 'blank', second: only };

        // nothing → no sprites
        return null;
    };

    useEffect(() => {
        if (playerData) {
            const pokemonCount = countCards(playerData.decklist, 'pokemon');
            const trainerCount = countCards(playerData.decklist, 'trainer');
            const energyCount = countCards(playerData.decklist, 'energy');
            const totalCount = pokemonCount + trainerCount + energyCount;

            setTotalCardCount(totalCount);
        }
    }, [playerData]);

    useEffect(() => {
        if (cardData) {
            const totalImages =
                Number(playerData.decklist.pokemon.length) +
                Number(playerData.decklist.trainer.length) +
                Number(playerData.decklist.energy.length);
            if (imagesLoadedCount === totalImages) {
                setLoadingImages(false);
            }
        }
    }, [imagesLoadedCount, cardData, playerData]);

    const handleImageLoad = () => {
        setImagesLoadedCount(prevCount => prevCount + 1);
    };

    const energyKeyMap = {
        'grass energy - basic': 'SVE-1',
        'fire energy - basic': 'SVE-2',
        'water energy - basic': 'SVE-3',
        'lightning energy - basic': 'SVE-4',
        'psychic energy - basic': 'SVE-5',
        'fighting energy - basic': 'SVE-6',
        'darkness energy - basic': 'SVE-7',
        'metal energy - basic': 'SVE-8',
    };

    const cardImageUrl = (card) => {
        const nameKey = card.name.trim().toLowerCase();
        const mapKey = energyKeyMap[nameKey] || `${card.set}-${card.number}`;
        const cardInfo = cardData?.cardMap?.[mapKey];
        return cardInfo?.images?.small || null;
    };

    const countCards = (decklist, type) => {
        return decklist[type].reduce((total, card) => total + Number(card.count), 0);
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

    const cleanedDecklist = {
        pokemon: playerData.decklist.pokemon.map(c => ({ ...c, name: cleanCardName(c.name) })),
        trainer: playerData.decklist.trainer.map(c => ({ ...c, name: cleanCardName(c.name) })),
        energy: playerData.decklist.energy.map(c => ({ ...c, name: cleanCardName(c.name) })),
    };

    return (
        <PlayerDeckCenter className='center' theme={theme}>
            <Helmet>
                <title>{isFeatured ? `${formatName(playerData.name)}'s Featured Deck` : `${formatName(playerData.name)}'s Decklist`}</title>
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
            <div className='playerlistnewcolumn'>
                <div className="player-deck">
                    <div className='player-deck-top'>
                        <div>
                            {!isFeatured && (
                                <Link className='link-to-playerprofile' to={`/player/${normalizeName(playerData.name)}-${playerData.flag}`}>
                                    <h2>
                                        {playerData.label ? formatName(playerData.label) : formatName(playerData.name)}
                                    </h2>
                                </Link>
                            )}
                            {isFeatured ? (
                                <>
                                    <h2>{playerData && playerData.label && <p>{playerData.label}</p>}</h2>
                                    <hr className='playerdeck-hr'></hr>
                                    {playerData && playerData.source && <p><span className='bold'>Source:</span> {playerData.source}</p>}
                                    {eventData && <p><Link className='blue-link bold' to={`/decks-by-era`}>{eventData.name}</Link></p>}
                                    {eventData && <p><span className='bold'>Date:</span> {eventData.date}</p>}
                                    {eventData && <p><span className='bold'>Format:</span> <Link className='blue-link' to={`/decks?format=${division === 'professors' ? eventData.formatProfessors : eventData.format}`}>{division === 'professors' ? eventData.formatProfessors : eventData.format}</Link></p>}
                                </>
                            ) : (
                                <>
                                    <hr className='playerdeck-hr'></hr>
                                    <p>
                                        <span className='bold'>
                                            {placement !== null && placement > 0 ? getPlacementSuffix(placement) : ''} Place
                                        </span>
                                        {division !== 'all' && (
                                            <> ({capitalizeFirstLetter(division)})</>
                                        )}
                                    </p>
                                    {eventData && <p><Link className='blue-link bold' to={`/tournaments/${eventId}/${division}`}>{eventData.name}</Link></p>}
                                    {eventData && <p><span className='bold'>Date:</span> {eventData.date}</p>}
                                    {eventData && <p><span className='bold'>Format:</span> <Link className='blue-link' to={`/decks?format=${division === 'professors' ? eventData.formatProfessors : eventData.format}`}>{division === 'professors' ? eventData.formatProfessors : eventData.format}</Link></p>}
                                </>
                            )}
                        </div>
                        <div className='deck-top-right-options'>
                            <Link className='link-to-playerprofile-btn' to={`/player/${normalizeName(playerData.name)}-${playerData.flag}`}>
                                <button className="decklist-modal-button-deckprofile">Player Profile</button>
                            </Link>
                            {cardData && (
                                <DecklistOptions
                                    decklist={cleanedDecklist}
                                    cardMap={cardData.cardMap}
                                />
                            )}
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
                    {totalCardCount !== 60 && (
                        <div className="warning-message">
                            Warning: Deck contains {totalCardCount} cards.
                        </div>
                    )}
                    {!playerData ? (
                        null
                    ) : !cardData ? (
                        <div className="spinner"></div>
                    ) : viewMode === 'grid' ? (
                        <div className="deck-cards">
                            {playerData.decklist.pokemon.map((card, index) => (
                                <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
                                    <img src={cardImageUrl(card)} alt={card.name} onLoad={handleImageLoad} />
                                    <div className="card-count">{card.count}</div>
                                </div>
                            ))}
                            {playerData.decklist.trainer.map((card, index) => (
                                <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
                                    {
                                        (() => {
                                            const mapKey = `${card.set}-${card.number}`;
                                            const info = cardData?.cardMap?.[mapKey];
                                            const altTxt = info?.name ?? card.name;
                                            return (
                                                <img
                                                    src={cardImageUrl(card)}
                                                    alt={altTxt}
                                                    onLoad={handleImageLoad}
                                                />
                                            );
                                        })()
                                    }
                                    <div className="card-count">{card.count}</div>
                                </div>
                            ))}
                            {playerData.decklist.energy.map((card, index) => (
                                <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
                                    <img src={cardImageUrl(card)} alt={card.name} onLoad={handleImageLoad} />
                                    <div className="card-count">{card.count}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="deck-list">
                            <div className='column-section'>
                                <div className='list-category'><h3>Pokémon ({countCards(playerData.decklist, 'pokemon')})</h3></div>
                                <div className='list-of-cards'>{playerData.decklist.pokemon.map((card, index) => (
                                    <div key={index} className="list-item" onClick={() => handleCardClick(card)}>
                                        <p className='list-card-count'>{card.count}</p>
                                        <p className='bold-name'>{cleanCardName(card.name)}</p>
                                        <img className='pokemon-list-img' src={cardImageUrl(card)} alt={card.name} onLoad={handleImageLoad} />
                                    </div>
                                ))}</div>
                            </div>
                            <div className='column-section'>
                                <div className='list-category'><h3>Trainer ({countCards(playerData.decklist, 'trainer')})</h3></div>
                                <div className='list-of-cards'>{playerData.decklist.trainer.map((card, index) => (
                                    <div key={index} className="list-item" onClick={() => handleCardClick(card)}>
                                        <p className='list-card-count'>{card.count}</p>
                                        <p className='bold-name'>{cleanCardName(card.name)}</p>
                                        <img className='trainer-list-img' src={cardImageUrl(card)} alt={card.name} onLoad={handleImageLoad} />
                                    </div>
                                ))}</div>
                            </div>
                            <div className='column-section'>
                                <div className='list-category'><h3>Energy ({countCards(playerData.decklist, 'energy')})</h3></div>
                                <div className='list-of-cards'>{playerData.decklist.energy.map((card, index) => (
                                    <div key={index} className="list-item" onClick={() => handleCardClick(card)}>
                                        <p className='list-card-count'>{card.count}</p>
                                        <p className='bold-name'>{cleanCardName(card.name)}</p>
                                        <img className='energy-list-img' src={cardImageUrl(card)} alt={card.name} onLoad={handleImageLoad} />
                                    </div>
                                ))}</div>
                            </div>
                        </div>
                    )}
                    {playerData?.rounds && (
                    <div className='opponents-playerdeck-list'>
                        <h3>Matchups</h3>
                        <table className="matchup-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>Rd</th>
                                    <th style={{ textAlign: 'center', opacity: 0 }}>Res</th>
                                    <th>&nbsp;&nbsp;&nbsp;Opponent</th>
                                    <th style={{ textAlign: 'start',paddingLeft:'47.5px' }}>Deck</th>
                                    <th style={{ textAlign: 'center' }}>List</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(playerData.rounds).reverse().map(([rnd, info]) => {
                                    const { code, name } = parseOpponent(info.name);

                                    const results = Array.isArray(eventData?.[division]) ? eventData[division] : [];
                                    const allPlayers = [...results, ...eliminatedRecords];
                                    const opponent = allPlayers.find(
                                        p => normalizeName(p?.name || '') === normalizeName(name) && p?.flag === code
                                    );

                                    let sprites = null;
                                    if (opponent?.sprite1 || opponent?.sprite2) {
                                        sprites = makeDisplayPair(opponent.sprite1, opponent.sprite2);
                                    } else if (opponent?.decklist) {
                                        const { firstSprite, secondSprite } = getPokemonSprites(opponent.decklist, '', '');
                                        sprites = makeDisplayPair(firstSprite, secondSprite);
                                    }

                                    const bgColor =
                                        info.result === 'W' ? 'rgba(144,238,144,0.6)' :
                                            info.result === 'L' ? 'rgba(255,182,193,0.6)' :
                                                info.result === 'T' ? 'rgba(255,255,102,0.6)' : 'transparent';
                                    const textColor =
                                        info.result === 'W' ? 'rgb(1, 63, 1)' :
                                            info.result === 'L' ? 'darkred' :
                                                info.result === 'T' ? 'rgb(78, 78, 7)' : 'inherit';

                                    const isBye = name === 'BYE';

                                    return (
                                        <tr key={rnd}>
                                            <td style={{ textAlign: 'center' }}>{rnd}</td>
                                            <td className="player-result-wlt"
                                                style={{ backgroundColor: bgColor, textAlign: 'center', color: textColor }}>
                                                {info.result}
                                            </td>

                                            <td className="name-n-flag-recmodal name-n-flag-recmodal-decklistpage" style={{ marginLeft: 3 }}>
                                                <div className="flag-container" style={{ opacity: isBye ? 0 : 1 }}>
                                                    <img className="flag-size" src={flagSrc(code)} alt={code} />
                                                </div>

                                                <span className="link-to-playerrecords">
                                                    {isBye ? 'BYE' : formatName(name)}
                                                </span>
                                            </td>

                                            <td className='opponent-sprites-cell sing-cells-sprites'>
                                                {sprites ? (
                                                    <DisplayPokemonSprites
                                                        decklist={opponent?.decklist}
                                                        sprite1={sprites.first}
                                                        sprite2={sprites.second}
                                                    />
                                                ) : (
                                                    <em style={{ opacity: 0.7 }}>{opponent?.decklist ? '—' : ''}</em>
                                                )}
                                            </td>

                                            <td className="player-decklink-cell" style={{ textAlign: 'center' }}>
                                                {opponent?.decklist ? (
                                                    <Link
                                                        to={`/tournaments/${eventId}/${division}/${encodeURIComponent(opponent?.name || name)}-${opponent?.flag || code}`}
                                                        title="Decklist"
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            format_list_bulleted
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <span style={{ opacity: 0.4 }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                </div>
            </div>
        </PlayerDeckCenter>
    );
};

export default PlayerDeck;

