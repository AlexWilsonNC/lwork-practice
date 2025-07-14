import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import CardSearch     from './CardSearch'
import DeckList       from './DeckList'
import ExportButtons  from './ExportButtons'
import './DeckBuilder.css'
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import patreonImg from '../assets/social-media-icons/patreon-icon.webp';
import tcgplayerIcon from '../assets/social-media-icons/tcgplayer-logo.png'

const energyIcons = {
  Colorless: '/assets/energy-symbols/colorless.png',
  Grass:     '/assets/energy-symbols/grass.png',
  Fire:      '/assets/energy-symbols/fire.png',
  Water:     '/assets/energy-symbols/water.png',
  Lightning: '/assets/energy-symbols/lightning.png',
  Psychic:   '/assets/energy-symbols/psychic.png',
  Fighting:  '/assets/energy-symbols/fighting.png',
  Darkness:  '/assets/energy-symbols/dark.png',
  Metal:     '/assets/energy-symbols/metal.png',
  Fairy:     '/assets/energy-symbols/fairy.png',
  Dragon:    '/assets/energy-symbols/dragon.png',
  NoCost:    '/assets/energy-symbols/deselect-all.png'
};

function renderEnergyIcons(cost) {
  if (!Array.isArray(cost) || cost.length === 0 || cost.some(c => String(c).toLowerCase() === 'free')) {
    return <img src={energyIcons.NoCost} alt="No Cost" className="energy-icon" />;
  }
  return cost.map((type, i) => (
    <img
      key={i}
      src={energyIcons[type]}
      alt={type}
      className="energy-icon"
    />
  ));
}

const basicEnergyTypes = ["Grass","Fire","Water","Lightning","Psychic","Fighting","Darkness","Metal","Fairy"];
const stageOrder = { "Stage 2": 0, "Stage 1": 1, "Basic": 2 };
const trainerPriority  = {
    "Supporter": 0,
    "Item": 1,
    "Rocket's Secret Machine": 1,
    "Rocket's Secret Robot": 1,
    "Goldenrod Game Corner": 1,
    "Pokémon Tool": 2,
    "Technical Machine": 2,
    "Stadium": 3,
};

function sortDeck(deck) {
  const pokemons = deck.filter(c => c.supertype === "Pokémon");
  const trainers = deck.filter(c => c.supertype === "Trainer");
  const energies = deck.filter(c => c.supertype === "Energy");

  // ── Trainers ─────────────────────────────────────────────────────────────
  const sortedTrainers = [...trainers].sort((a, b) => {
    const subA = a.subtypes?.[0] ?? "";
    const subB = b.subtypes?.[0] ?? "";
    const priA = trainerPriority[subA] ?? 99;
    const priB = trainerPriority[subB] ?? 99;
    if (priA !== priB) return priA - priB;
    return b.count - a.count;
  });

  // ── Energies ─────────────────────────────────────────────────────────────
  const sortedEnergies = [...energies].sort((a, b) => {
    // extract basic vs special
    const typeOf = card => {
      const m = card.name.match(/^Basic\s+(\w+)/i);
      return m ? m[1] : card.name.split(" ")[1];
    };
    const tA = typeOf(a), tB = typeOf(b);
    const specA = !basicEnergyTypes.includes(tA);
    const specB = !basicEnergyTypes.includes(tB);
    if (specA !== specB) return specA ? 1 : -1;
    if (b.count !== a.count) return b.count - a.count;
    return basicEnergyTypes.indexOf(tA) - basicEnergyTypes.indexOf(tB);
  });

  // ── Pokémon (families) ───────────────────────────────────────────────────
  const evoGraph = {};
  pokemons.forEach(card => {
    const name = card.name;
    evoGraph[name] = evoGraph[name] || new Set();
    if (card.evolvesFrom) {
      evoGraph[name].add(card.evolvesFrom);
      evoGraph[card.evolvesFrom] = evoGraph[card.evolvesFrom] || new Set();
      evoGraph[card.evolvesFrom].add(name);
    }
    (card.evolvesTo || []).forEach(child => {
      evoGraph[name].add(child);
      evoGraph[child] = evoGraph[child] || new Set();
      evoGraph[child].add(name);
    });
  });

  // Extract connected components (families)
  const visited = new Set();
  const families = [];
  pokemons.forEach(card => {
    if (visited.has(card.name)) return;
    const queue = [card.name];
    visited.add(card.name);
    const family = [];
    while (queue.length) {
      const cur = queue.shift();
      pokemons.forEach(c => {
        if (c.name === cur) family.push(c);
      });
      (evoGraph[cur] || []).forEach(nei => {
        if (!visited.has(nei)) {
          visited.add(nei);
          queue.push(nei);
        }
      });
    }
    families.push(family);
  });

  // Compute family metrics
  families.forEach(fam => {
    fam.highestStage = fam.reduce((minSt, c) => {
      const st = c.subtypes?.[0] || "Basic";
      return Math.min(minSt, stageOrder[st] ?? stageOrder.Basic);
    }, stageOrder.Basic);
    fam.highestCount = fam.reduce((maxC, c) => Math.max(maxC, c.count), 0);
  });

  // Sort families (by count desc, then by stage asc)
  families.sort((a, b) => {
    if (b.highestCount !== a.highestCount) {
      return b.highestCount - a.highestCount;
    }
    return a.highestStage - b.highestStage;
  });

  // Flatten back, sorting within each family by stage then count
  const sortedPokemons = [];
  families.forEach(fam => {
    fam.sort((a, b) => {
      const pa = stageOrder[a.subtypes?.[0] ?? "Basic"];
      const pb = stageOrder[b.subtypes?.[0] ?? "Basic"];
      if (pa !== pb) return pa - pb;
      return b.count - a.count;
    });
    sortedPokemons.push(...fam);
  });

  // 3) Combine and return
  return [...sortedPokemons, ...sortedTrainers, ...sortedEnergies];
}

const STORAGE_KEY = 'deckbuilder-deck'

const DeckBuilderComp = styled.div`
    .active-deck-container {
        background-image: ${({ theme }) => theme.deckPlaymat};
        border: ${({ theme }) => theme.deckBorder};
    }
    height: 100vh;
    overflow: hidden;
    display: flex;

`;

export default function DeckBuilder() {
  // — load deck from localStorage or start empty
  const { theme } = useTheme();
  const [deck, setDeck] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })
  const [zoomCard, setZoomCard] = useState(null);

  // persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck))
  }, [deck])

  // add a card (or bump count if already in deck)
  function addCard(card) {
    setDeck(prev => {
        const idx = prev.findIndex(c =>
        c.setAbbrev === card.setAbbrev && c.number === card.number
        )
        let next
        if (idx >= 0) {
        const newCount = Math.min(prev[idx].count + 1, 4)
        next = prev.map((c,i) =>
            i === idx ? { ...c, count: newCount } : c
        )
        } else {
        next = [...prev, { ...card, count: 1 }]
        }
        return next
    })
  }

  // update count for a card by its index in the array
  function updateCount(index, newCount) {
    setDeck(d => d
      .map((c,i) => i === index ? { ...c, count: newCount } : c)
      .filter(c => c.count > 0)
    )
  }

    const [importing, setImporting] = useState(false)
    const [dragOver, setDragOver]   = useState(false)

    async function importDeck(overwrite = false) {
    setImporting(true)
    try {
        // Snapshot the starting deck: either empty (overwrite) or existing
        const startingDeck = overwrite ? [] : [...deck]
        // Immediately clear UI if overwriting
        if (overwrite) setDeck([])
        const text = await navigator.clipboard.readText()
        const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.endsWith(':'))
        .filter(l => /^\d+\s/.test(l))
        // Build new merged deck from the snapshot
        const merged = [...startingDeck]

        for (const line of lines) {
            const parts = line.split(/\s+/)
            const count = parseInt(parts[0], 10)
            const number = parts.pop()
            const setAbbrev = parts.pop()
            const name = parts.slice(1).join(' ')

            // fetch matching card(s)
            const results = await fetch(
            `/api/cards/searchbyname/partial/${encodeURIComponent(name)}`
            ).then(r => r.json())

            const match = results.find(
            c => c.setAbbrev === setAbbrev && c.number === number
            )
            if (match) {
            const idx = merged.findIndex(
                c => c.setAbbrev === setAbbrev && c.number === number
            )
            if (idx > -1) {
                // merge counts
                if (match.supertype !== 'Energy') {
                merged[idx].count = Math.min(merged[idx].count + count, 4)
                } else {
                merged[idx].count += count
                }
            } else {
                merged.push({ ...match, count })
            }
            } else {
            console.warn('Could not import:', name, setAbbrev, number)
            }
        }

        setDeck(merged)
        } catch (err) {
        console.error('Import failed', err)
        } finally {
        setImporting(false)
        }
    }

  const handleCardClick = card => setZoomCard(card);

  const totalCount = deck.reduce((sum, c) => sum + c.count, 0);

  const handleSort = () => {
    setDeck(current => sortDeck(current));
  };
  const tcgUrl = zoomCard?.tcgplayer?.url

  return (
    <DeckBuilderComp className='center' theme={theme}>
        <Helmet>
            {/* <title>{isFeatured ? `${formatName(playerData.name)}'s Featured Deck` : `${formatName(playerData.name)}'s Decklist`}</title>
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
            <meta name="twitter:image" content={eventData.thumbnail} /> */}
        </Helmet>
        {zoomCard && (() => {
            const idx = deck.findIndex(
                c => c.setAbbrev === zoomCard.setAbbrev && c.number === zoomCard.number
            );
            const currentCount = idx >= 0 ? deck[idx].count : 0;

            const handleDelta = delta => {
                const newCount = currentCount + delta;
                    if (idx >= 0) {
                        updateCount(idx, newCount);
                    } else if (delta > 0) {
                        addCard(zoomCard);
                }
            };

            return (
                <div
                className="card-modal-overlay"
                onClick={() => setZoomCard(null)}
                >
                    <div
                        className="card-modal-content"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                        className="modal-close"
                        onClick={() => setZoomCard(null)}
                        >
                        ×
                        </button>

                        <img
                            src={zoomCard.images.large}
                            alt={zoomCard.name}
                            className="card-modal-image"
                        />

                        <div className="modal-count-controls">
                            <button
                                type="button"
                                onClick={() => handleDelta(-1)}
                                disabled={currentCount <= 0}
                            >–</button>
                            <span className="modal-count">{currentCount}</span>
                            <button
                                type="button"
                                onClick={() => handleDelta(1)}
                                disabled={zoomCard.supertype !== 'Energy' && currentCount >= 4}
                            >＋</button>
                        </div>

                        <div className="card-details">
                            <h2>{zoomCard.name}</h2>
                            <p>{zoomCard.supertype} • {zoomCard.subtypes?.join(' • ')}</p>
                            {zoomCard.supertype === 'Pokémon' && (
                                <p>{zoomCard.types} • {zoomCard.hp}</p>
                            )}
                            <hr className="zoomed-card-db-hr" />
                            {zoomCard.abilities?.map((ab, i) => (
                                <p key={i}>
                                    <strong><span style={{ color: 'red' }}>Ability:</span> {ab.name}</strong>
                                    <br></br>{ab.text}
                                </p>
                            ))}
                            {zoomCard.attacks?.map((atk, i) => (
                                <div key={i}>
                                    <p style={{ margin: '15px 0'}}> 
                                        {renderEnergyIcons(atk.cost)}&nbsp;&nbsp;
                                        <strong>{atk.name}</strong>&nbsp;&nbsp;&nbsp;&nbsp;{atk.damage}
                                        <br></br>{atk.text}
                                    </p>
                                </div>
                            ))}
                            {zoomCard.supertype != 'Pokémon' && zoomCard.rules?.length > 0 && (
                                <div className="modal-rules">
                                    <ul>
                                        {zoomCard.rules.map((text, i) => (
                                            <li key={i}>{text}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {zoomCard.supertype === 'Pokémon' && (
                                <hr className='zoomed-card-db-hr'></hr>
                            )}
                            {(zoomCard.retreatCost != null || zoomCard.convertedRetreatCost != null) && (
                                <div className="modal-retreat-cost">
                                    <strong>Retreat:</strong>&nbsp;&nbsp;{' '}
                                    {(() => {
                                        if (zoomCard.convertedRetreatCost != null) {
                                        return zoomCard.convertedRetreatCost;
                                        }
                                        if (Array.isArray(zoomCard.retreatCost)) {
                                        return zoomCard.retreatCost.length;
                                        }
                                        return 0;
                                    })()}
                                </div>
                            )}
                            {zoomCard.weaknesses && (
                                <p>
                                    <strong>Weakness:</strong>{' '}
                                    {zoomCard.weaknesses.map(w=>`${w.type} ${w.value}`).join(', ')}
                                </p>
                            )}
                            {zoomCard.resistances && (
                                <p>
                                    <strong>Resistanc:</strong>{' '}
                                    {zoomCard.resistances.map(r=>`${r.type} ${r.value}`).join(', ')}
                                </p>
                            )}
                        </div>
                        <div className='bottom-db-modal-bts'>
                            {tcgUrl ? (
                                <a
                                    href={tcgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tcgplayer-link"
                                >
                                <button className="tcgplayer-btn">
                                    <img
                                    src={tcgplayerIcon}
                                    alt="TCGplayer"
                                    className="tcgplayer-btn__icon"
                                    />
                                    &nbsp;TCGplayer
                                </button>
                                </a>
                            ) : (
                                <button className="tcgplayer-btn" disabled>
                                <img
                                    src={tcgplayerIcon}
                                    alt="TCGplayer"
                                    className="tcgplayer-btn__icon"
                                />
                                &nbsp;TCGplayer
                                </button>
                            )}
                            <Link to={`/card/${zoomCard.setAbbrev}/${zoomCard.number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>View in Database</button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        })()}
        <div className="deck-builder">
            <CardSearch onAddCard={addCard} onCardClick={handleCardClick} />
            <div
              className={`active-deck-container${dragOver ? ' drag-over' : ''}`}
              onDragOver={e => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={e => {
                e.preventDefault()
                setDragOver(false)
              }}
              onDrop={e => {
                e.preventDefault()
                setDragOver(false)
                const json = e.dataTransfer.getData('application/json')
                if (json) {
                  try {
                    const card = JSON.parse(json)
                    addCard(card)
                  } catch {}
                }
              }}
            >
                <ExportButtons 
                    deck={deck} 
                    onImportDeck={importDeck}
                />
                <div className='deck-stats'>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <p className='stat-count'>
                            Card Count: <span className='current-deck-count'>{totalCount}</span>
                        </p>
                        <div id='deck-sort'style={{ cursor: 'pointer' }} onClick={handleSort}>
                            <span className="material-symbols-outlined">sort</span>
                            <p>&nbsp;Sort&nbsp;</p>
                        </div>
                        <div id="deck-reset" onClick={() => setDeck([])}>
                            <span className="material-symbols-outlined">close</span>
                            <p>Reset</p>
                        </div>
                    </div>
                    <a href='https://www.patreon.com/PTCGLegends' target="_blank" className='support-again'>
                        <p>Support this Project</p>
                        <img src={patreonImg} />
                    </a>
                </div>
                <DeckList 
                    deck={deck} 
                    onUpdateCount={updateCount} 
                    onCardClick={handleCardClick} 
                    loading={importing} 
                    onCardDrop={addCard}
                />
            </div>
        </div>
    </DeckBuilderComp>
    )
}
