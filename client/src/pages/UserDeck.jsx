// src/pages/UserDeck.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
import DecklistOptions from '../Tools/DecklistOptions'; // if you use it
import '../css/decklist.css'; // reuse your existing styles

export default function UserDeck() {
    const { deckId, username } = useParams();
    //   const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cardMap, setCardMap] = useState(null);
    const [viewMode, setViewMode] = useState(
        localStorage.getItem('viewMode') || 'grid'
    );

    const cleanCardName = (name) => {
        return name.replace(" - ACESPEC Energy", "").replace(" - ACESPEC", "").replace(" - Basic", "").replace(" - Special", "");
    };

    // 1) fetch saved deck
    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('PTCGLegendsToken');
                const res = await fetch(
                `/api/user/decks/${deckId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
                if (!res.ok) throw new Error('Could not load deck');
                setDeck(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [deckId]);

    useEffect(() => {
        if (!deck?.decklist) return;

        let cancelled = false;

        const loadCards = async () => {
            const normalized = normalizeSavedDecklist(
                deck.decklist
            );

            const all = [
                ...normalized.pokemon,
                ...normalized.trainer,
                ...normalized.energy
            ];

            const map = {};

            for (const savedCard of all) {
                const setCode = getCardSetCode(savedCard);
                const key = `${setCode}-${savedCard.number}`;

                if (
                    savedCard.isUploadedImageCard ||
                    setCode === 'UPL'
                ) {
                    map[key] = {
                        ...savedCard,
                        set: setCode,
                        setAbbrev: setCode,
                        images: savedCard.images || {
                            small: savedCard.imageUrl,
                            large: savedCard.imageUrl
                        }
                    };

                    continue;
                }

                try {
                    const response = await fetch(
                        `/api/cards/${setCode}/${savedCard.number}`
                    );

                    if (!response.ok) {
                        console.warn(
                            'Could not load saved card:',
                            setCode,
                            savedCard.number
                        );

                        continue;
                    }

                    const fullCard = await response.json();

                    map[key] = {
                        ...fullCard,
                        count: Number(savedCard.count) || 0
                    };
                } catch (error) {
                    console.error(
                        'Could not load card:',
                        savedCard,
                        error
                    );
                }
            }

            if (!cancelled) {
                setCardMap(map);
            }
        };

        setCardMap(null);
        loadCards();

        return () => {
            cancelled = true;
        };
    }, [deck]);

    const normalizedDecklist = normalizeSavedDecklist(
        deck?.decklist
    );

    if (!deck) {
        return <div className="spinner"></div>;
    }
    if (!cardMap) {
        return <div className="spinner"></div>;
    }

    // const normalizedDecklist = Array.isArray(deck.decklist)
    //     ? {
    //         pokemon: deck.decklist.filter(
    //             card => card.supertype === 'Pokémon'
    //         ),

    //         trainer: deck.decklist.filter(
    //             card => card.supertype === 'Trainer'
    //         ),

    //         energy: deck.decklist.filter(
    //             card => card.supertype === 'Energy'
    //         )
    //     }
    //     : {
    //         pokemon: deck.decklist?.pokemon || [],
    //         trainer: deck.decklist?.trainer || [],
    //         energy: deck.decklist?.energy || []
    //     };

    const cleaned = {
        pokemon:
            normalizedDecklist.pokemon.map(c => ({
                ...c,
                name: cleanCardName(c.name)
            })) || [],
        trainer:
            normalizedDecklist.trainer.map(c => ({
                ...c,
                name: cleanCardName(c.name)
            })) || [],
        energy:
            normalizedDecklist.energy.map(c => ({
                ...c,
                name: cleanCardName(c.name)
            })) || []
    };

    const totalCount = [
        ...cleaned.pokemon,
        ...cleaned.trainer,
        ...cleaned.energy
    ].reduce(
        (sum, card) =>
            sum + (Number(card.count) || 0),
        0
    );

    return (
        <div className="center player-deck">
            <div className="player-deck">
                <div className="player-deck-top">
                    <h2>{deck.name}</h2>
                    <div className="deck-top-right-options">
                        <button onClick={() => navigate(-1)}>← Back</button>
                        {cardMap && (
                            <DecklistOptions decklist={cleaned} cardMap={cardMap} />
                        )}
                        <div className="deckview-switcher">
                            <div
                                className={`list-form ${viewMode === 'list' ? 'active-grid-option' : ''
                                    }`}
                                onClick={() => {
                                    setViewMode('list');
                                    localStorage.setItem('viewMode', 'list');
                                }}
                            >
                                <span className="material-symbols-outlined">reorder</span>
                            </div>
                            <div
                                className={`playmat-form ${viewMode === 'grid' ? 'active-grid-option' : ''
                                    }`}
                                onClick={() => {
                                    setViewMode('grid');
                                    localStorage.setItem('viewMode', 'grid');
                                }}
                            >
                                <span className="material-symbols-outlined">grid_view</span>
                            </div>
                        </div>
                    </div>
                </div>

                {totalCount !== 60 && (
                    <div className="warning-message">
                        <span class="material-symbols-outlined">warning</span> Deck contains {totalCount} cards
                    </div>
                )}

                {viewMode === 'grid' ? (
                    <div className="deck-cards">
                        {cleaned.pokemon.map((card, i) => (
                            <div
                                key={i}
                                className="card-container"
                                onClick={() =>
                                    navigate(
                                        `/card/${getCardSetCode(card)}/${card.number}`
                                    )
                                }
                            >
                                <img
                                    src={cardMap?.[
                                        `${getCardSetCode(card)}-${card.number}`
                                    ]?.images?.small}
                                    alt={card.name}
                                />
                                <div className="card-count">{card.count}</div>
                            </div>
                        ))}
                        {cleaned.trainer.map((card, i) => (
                            <div
                                key={i}
                                className="card-container"
                                onClick={() =>
                                    navigate(
                                        `/card/${getCardSetCode(card)}/${card.number}`
                                    )
                                }
                            >
                                <img
                                    src={cardMap?.[
                                        `${getCardSetCode(card)}-${card.number}`
                                    ]?.images?.small}
                                    alt={card.name}
                                />
                                <div className="card-count">{card.count}</div>
                            </div>
                        ))}
                        {cleaned.energy.map((card, i) => (
                            <div
                                key={i}
                                className="card-container"
                                onClick={() =>
                                    navigate(
                                        `/card/${getCardSetCode(card)}/${card.number}`
                                    )
                                }
                            >
                                <img
                                    src={cardMap?.[
                                        `${getCardSetCode(card)}-${card.number}`
                                    ]?.images?.small}
                                    alt={card.name}
                                />
                                <div className="card-count">{card.count}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="deck-list">
                        {/* Pokémon */}
                        <div className="column-section">
                            <div className="list-category">
                                <h3>Pokémon ({cleaned.pokemon.reduce((s, c) => s + +c.count, 0)})</h3>
                            </div>
                            <div className="list-of-cards">
                                {cleaned.pokemon.map((card, i) => (
                                    <div
                                        key={i}
                                        className="list-item"
                                        onClick={() =>
                                            navigate(
                                                `/card/${getCardSetCode(card)}/${card.number}`
                                            )
                                        }
                                    >
                                        <p className="list-card-count">{card.count}</p>
                                        <p className="bold-name">{card.name}</p>
                                        <img
                                            className="pokemon-list-img"
                                            src={cardMap?.[
                                                `${getCardSetCode(card)}-${card.number}`
                                            ]?.images?.small}
                                            alt={card.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Trainer */}
                        <div className="column-section">
                            <div className="list-category">
                                <h3>Trainer ({cleaned.trainer.reduce((s, c) => s + +c.count, 0)})</h3>
                            </div>
                            <div className="list-of-cards">
                                {cleaned.trainer.map((card, i) => (
                                    <div
                                        key={i}
                                        className="list-item"
                                        onClick={() =>
                                            navigate(
                                                `/card/${getCardSetCode(card)}/${card.number}`
                                            )
                                        }
                                    >
                                        <p className="list-card-count">{card.count}</p>
                                        <p className="bold-name">{card.name}</p>
                                        <img
                                            className="trainer-list-img"
                                            src={cardMap?.[
                                                `${getCardSetCode(card)}-${card.number}`
                                            ]?.images?.small}
                                            alt={card.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Energy */}
                        <div className="column-section">
                            <div className="list-category">
                                <h3>Energy ({cleaned.energy.reduce((s, c) => s + +c.count, 0)})</h3>
                            </div>
                            <div className="list-of-cards">
                                {cleaned.energy.map((card, i) => (
                                    <div
                                        key={i}
                                        className="list-item"
                                        onClick={() =>
                                            navigate(
                                                `/card/${getCardSetCode(card)}/${card.number}`
                                            )
                                        }
                                    >
                                        <p className="list-card-count">{card.count}</p>
                                        <p className="bold-name">{card.name}</p>
                                        <img
                                            className="energy-list-img"
                                            src={cardMap?.[
                                                `${getCardSetCode(card)}-${card.number}`
                                            ]?.images?.small}
                                            alt={card.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
