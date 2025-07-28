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
                const res = await fetch(`/api/user/decks/${deckId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Could not load deck');
                setDeck(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [deckId]);

    // 2) fetch all card data (same as PlayerDeck)
useEffect(() => {
  if (!deck) return;
  (async () => {
    const all = [
      ...(deck.decklist.pokemon  || []),
      ...(deck.decklist.trainer  || []),
      ...(deck.decklist.energy   || [])
    ];
    const map = {};
    // loop through each deck entry (c)
    for (let c of all) {
      const key = `${c.set}-${c.number}`;      // now c is defined
      const resp = await fetch(`/api/cards/${c.set}/${c.number}`);  // your GET /api/cards/:set/:number
      if (!resp.ok) continue;
      const card = await resp.json();
      map[key] = card;
    }
    setCardMap(map);
  })();
}, [deck]);

    if (!deck) {
        return <div className="spinner"></div>;
    } if (!cardMap) {
        return <div className="spinner"></div>;
    }

    const cleaned = {
        pokemon:
            deck.decklist.pokemon.map(c => ({
                ...c,
                name: cleanCardName(c.name)
            })) || [],
        trainer:
            deck.decklist.trainer.map(c => ({
                ...c,
                name: cleanCardName(c.name)
            })) || [],
        energy:
            deck.decklist.energy.map(c => ({
                ...c,
                name: cleanCardName(c.name)
            })) || []
    };

    const totalCount =
        cleaned.pokemon.length +
        cleaned.trainer.length +
        cleaned.energy.length;

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
                        Warning: Deck contains {totalCount} cards.
                    </div>
                )}

                {viewMode === 'grid' ? (
                    <div className="deck-cards">
                        {cleaned.pokemon.map((card, i) => (
                            <div
                                key={i}
                                className="card-container"
                                onClick={() =>
                                    navigate(`/card/${card.set}/${card.number}`)
                                }
                            >
                                <img
                                    src={cardMap?.[`${card.set}-${card.number}`]?.images?.small}
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
                                    navigate(`/card/${card.set}/${card.number}`)
                                }
                            >
                                <img
                                    src={cardMap?.[`${card.set}-${card.number}`]?.images?.small}
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
                                    navigate(`/card/${card.set}/${card.number}`)
                                }
                            >
                                <img
                                    src={cardMap?.[`${card.set}-${card.number}`]?.images?.small}
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
                                            navigate(`/card/${card.set}/${card.number}`)
                                        }
                                    >
                                        <p className="list-card-count">{card.count}</p>
                                        <p className="bold-name">{card.name}</p>
                                        <img
                                            className="pokemon-list-img"
                                            src={cardMap?.[`${card.set}-${card.number}`]?.images?.small}
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
                                            navigate(`/card/${card.set}/${card.number}`)
                                        }
                                    >
                                        <p className="list-card-count">{card.count}</p>
                                        <p className="bold-name">{card.name}</p>
                                        <img
                                            className="trainer-list-img"
                                            src={cardMap?.[`${card.set}-${card.number}`]?.images?.small}
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
                                            navigate(`/card/${card.set}/${card.number}`)
                                        }
                                    >
                                        <p className="list-card-count">{card.count}</p>
                                        <p className="bold-name">{card.name}</p>
                                        <img
                                            className="energy-list-img"
                                            src={cardMap?.[`${card.set}-${card.number}`]?.images?.small}
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
