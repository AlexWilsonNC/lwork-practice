import React, { useState, useEffect, useRef } from 'react'
import setOrder from '../Tournaments/setorder'
import bw1 from '../assets/sets/black-white/bw1-bw.png'
import dp1 from '../assets/sets/diamond-pearl/dp1-diamond-pearl.png'
import rs1 from '../assets/sets/ruby-saphire/ex1-ruby-sapphire.png'
import sm1 from '../assets/sets/sun-moon/sm1-sm.png'
import ssh1 from '../assets/sets/sword-shield/ssh1.webp'
import sv1 from '../assets/sets/scarlet-violet/sv1.png'
import wotc from '../assets/sets/wizards-of-the-coast/wotc.png'
import xy1 from '../assets/sets/xy/xy1-xy.png'
import hgss1 from '../assets/sets/heartgold-soulsilver/hs1-hgss.png'

import sv4Img from '../assets/sets/scarlet-violet/logos/sv4-paradox-rift.png'

export default function CardSearch({ onAddCard, onCardClick }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [defaultCards, setDefault] = useState([])
    const [suppressDefault, setSuppressDefault] = useState(false)
    const [showSets, setShowSets] = useState(false)
    const [isSearchVisible, setIsSearchVisible] = useState(() => window.innerWidth > 1160);
    const widthRef = useRef(window.innerWidth);
    const toggleBtnRef = useRef(null);

    const ERA_OPTIONS = [
        { key: 'SV1', name: 'Scarlet & Violet', src: sv1 },
        { key: 'SSH1', name: 'Sword & Shield', src: ssh1 },
        { key: 'SM1', name: 'Sun & Moon', src: sm1 },
        { key: 'XY1', name: 'XY', src: xy1 },
        { key: 'BW1', name: 'Black & White', src: bw1 },
        { key: 'HGSS1', name: 'Heatgold & Soulsilver', src: hgss1 },
        { key: 'DP1', name: 'Diamond & Pearl', src: dp1 },
        { key: 'RS1', name: 'Ruby & Saphire', src: rs1 },
        { key: 'WOTC', name: 'Wizards of the Coast', src: wotc }
    ];
    const SET_OPTIONS = [
        { key: 'SV4', name: 'Paradox Rift', img: sv4Img, css: 'paradox-rift' },
        { key: 'SV1', name: 'Scarlet & Violet', img: sv1, css: 'scarlet-violet' },
    ]

    const [showAdvanced, setShowAdvanced] = useState(false)
    const [filters, setFilters] = useState({
        supertypes: { Pokémon: false, Trainer: false, Energy: false },
        sets: {},
        eras: ERA_OPTIONS.reduce((acc, e) => ({ ...acc, [e.key]: false }), {})
    })

    const toggleSet = key => {
        setFilters(f => ({
            ...f,
            sets: { ...f.sets, [key]: !f.sets[key] }
        }))
    }

    useEffect(() => {
        const newestSet = setOrder[0]
        fetch(`/api/cards/${encodeURIComponent(newestSet)}`)
            .then(res => {
                if (!res.ok) throw new Error(`Network ${res.status}`)
                return res.json()
            })
            .then(data => {
                const arr = Array.isArray(data) ? data : []
                arr.sort((a, b) => {
                    const nA = parseInt(a.number, 10) || 0
                    const nB = parseInt(b.number, 10) || 0
                    return nA - nB
                })
                setDefault(arr)
                setResults(arr)
            })
            .catch(err => {
                console.error('Failed to load default set:', err)
            })
    }, [])

    useEffect(() => {
        const trimmed = query.trim()

        if (trimmed === '') {
            if (suppressDefault) {
                setResults([])
            } else {
                setResults(defaultCards)
            }
            return
        }

        if (trimmed.length < 2 && trimmed.toUpperCase() !== 'N') {
            setResults([])
            return
        }
        const t = setTimeout(() => {
            // ➊ normalize the user’s query: remove accents & spaces, lowercase
            const normalizedQuery = query
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '')
                .toLowerCase();

            // hit your existing endpoint with the normalized query
            fetch(`/api/cards/searchbyname/partial/${encodeURIComponent(normalizedQuery)}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Network ${res.status}`)
                    return res.json()
                })
                .then(data => {
                    let arr = Array.isArray(data) ? data : []

                    // preserve your special “N” logic
                    if (trimmed.toUpperCase() === 'N') {
                        arr = arr.filter(c => c.name.toUpperCase() === 'N')
                    }
                    // ➋ now client‐side filter to ignore accents/spaces in names too
                    const normalize = str =>
                        str
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/\s+/g, '')
                            .toLowerCase();
                    arr = arr.filter(c => normalize(c.name).includes(normalizedQuery));

                    arr.sort((a, b) => {
                        const idxA = setOrder.indexOf(a.setAbbrev)
                        const idxB = setOrder.indexOf(b.setAbbrev)
                        if (idxA !== idxB) return idxA - idxB
                        const numA = parseInt(a.number, 10) || 0
                        const numB = parseInt(b.number, 10) || 0
                        return numA - numB
                    })

                    setResults(arr)
                })
                .catch(err => {
                    console.error('Search failed:', err)
                    setResults([])
                })
        }, 300)
        return () => clearTimeout(t)
    }, [query, defaultCards])

    const displayResults = results.filter(card => {
        if (!filters.supertypes[card.supertype]) return false
        const setsChecked = Object.values(filters.sets).some(v => v)
        if (setsChecked && !filters.sets[card.setAbbrev]) return false
        return true
    })

    useEffect(() => {
        const btn = toggleBtnRef.current;
        if (!btn) return;

        let startY = 0;
        let startX = 0;

        const onTouchStart = (e) => {
            const t = e.touches[0];
            startY = t.clientY;
            startX = t.clientX;
        };

        const onTouchEnd = (e) => {
            const t = e.changedTouches[0];
            const dy = startY - t.clientY;   // up = positive, down = negative
            const dx = Math.abs(startX - t.clientX);

            // ignore mostly-horizontal swipes
            if (Math.abs(dy) < 50 || dx > 40) return;

            if (dy > 0 && !isSearchVisible) {
                // swipe up on button -> open
                setIsSearchVisible(true);
            } else if (dy < 0 && isSearchVisible) {
                // swipe down on button -> close
                setIsSearchVisible(false);
            }
        };

        btn.addEventListener('touchstart', onTouchStart, { passive: true });
        btn.addEventListener('touchend', onTouchEnd);

        return () => {
            btn.removeEventListener('touchstart', onTouchStart);
            btn.removeEventListener('touchend', onTouchEnd);
        };
    }, [isSearchVisible]);

    useEffect(() => {
        const onResize = () => {
            const w = window.innerWidth;
            if (w === widthRef.current) return; // keyboard changed height only → ignore
            widthRef.current = w;

            if (w < 1160) {
                document.body.classList.add('no-scroll');
                // don't auto-close if user already opened it
                // setIsSearchVisible(false); <-- remove this line
            } else {
                document.body.classList.remove('no-scroll');
                setIsSearchVisible(true);
            }
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <>
            <div className={`card-search-container ${isSearchVisible ? 'visible' : ''}`}>
                <div className="card-search-content">
                    <button
                        className="advanced-search-button"
                        onClick={() => setShowAdvanced(true)}
                    >
                        Advanced Search
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </button>
                    {showAdvanced && (
                        <div className="advanced-search-modal-overlay" onClick={() => setShowAdvanced(false)}>
                            <div className="advanced-search-modal" onClick={e => e.stopPropagation()}>
                                <h2>Advanced Search</h2>
                                <hr></hr>
                                <div className="filter-group">
                                    <h3>Eras</h3>
                                    <div className="era-buttons">
                                        {ERA_OPTIONS.map(({ key, name, src }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`era-btn ${filters.eras[key] ? 'active' : ''}`}
                                                onClick={() =>
                                                    setFilters(f => ({
                                                        ...f,
                                                        eras: {
                                                            ...f.eras,
                                                            [key]: !f.eras[key]
                                                        }
                                                    }))
                                                }
                                            >
                                                <img src={src} alt={name} title={name} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-group sets-dropdown">
                                    <h3 onClick={() => setShowSets(s => !s)}>
                                        Sets
                                    </h3>
                                    <div className="toggle-sets-wrapper">
                                        <button
                                            type="button"
                                            className="toggle-sets-btn"
                                            onClick={() => setShowSets(s => !s)}
                                            aria-expanded={showSets}
                                        >
                                            {showSets ? 'Hide sets' : 'Show sets'}
                                            <span className="material-symbols-outlined bold-span">keyboard_arrow_down</span>
                                        </button>
                                        {showSets && (
                                            <>
                                                <div
                                                    className="sets-overlay"
                                                    onClick={() => setShowSets(false)}
                                                />
                                                <div className="sets-grid">
                                                    {SET_OPTIONS.map(({ key, name, img, css }) => (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            className={`set-cube ${css} ${filters.sets[key] ? 'darkon' : ''}`}
                                                            onClick={() => toggleSet(key)}
                                                        >
                                                            <p>
                                                                <img className="adv-set-logo" src={img} alt={name} title={name} />
                                                            </p>
                                                            <div className="set-name">{name}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>Card Type:</h3>
                                    {[
                                        'Pokémon',
                                        'Trainer',
                                        // 'Energy',
                                        'Item',
                                        'Supporter',
                                        'Stadium',
                                        'Tool'
                                        // 'Basic Energy',
                                        // 'Special Energy'
                                    ].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            className={`type-btn ${filters.supertypes[type] ? 'active' : ''}`}
                                            onClick={() => {
                                                setFilters(f => ({
                                                    ...f,
                                                    supertypes: {
                                                        ...f.supertypes,
                                                        [type]: !f.supertypes[type]
                                                    }
                                                }))
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                    <span className='cardtypeenergy'>Energy:</span>
                                    {[
                                        'Basic',
                                        'Special'
                                    ].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            className={`type-btn ${filters.supertypes[type] ? 'active' : ''}`}
                                            onClick={() => {
                                                setFilters(f => ({
                                                    ...f,
                                                    supertypes: {
                                                        ...f.supertypes,
                                                        [type]: !f.supertypes[type]
                                                    }
                                                }))
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div className="buttons-row-modal flex-end">
                                    <button className='cancel-button' onClick={() => setShowAdvanced(false)}>
                                        Cancel
                                    </button>
                                    <button className='save-button' onClick={() => setShowAdvanced(false)}>
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='event-searchbar'>
                        <div className='search-cards-div'>
                            <div className="search-input-wrapper">
                                <span className="material-symbols-outlined search-mag">search</span>
                                <input
                                    type="text"
                                    placeholder="Search cards…"
                                    value={query}
                                    onChange={e => {
                                        setSuppressDefault(false)
                                        setQuery(e.target.value)
                                    }}
                                />
                                {query && (
                                    <button
                                        type="button"
                                        className="clear-input-btn"
                                        onClick={() => {
                                            setQuery('')
                                            setSuppressDefault(true)
                                            setResults([])
                                        }}
                                        aria-label="Clear search"
                                    >×</button>
                                )}
                            </div>
                            <button
                                type="button"
                                id="search-reset"
                                onClick={() => {
                                    setQuery('')
                                    setSuppressDefault(true)
                                    setResults([])
                                }}
                            >
                                <span className="material-symbols-outlined">close</span>
                                <p>Reset</p>
                            </button>
                            <button
                                className="advanced-search-button-small"
                                onClick={() => setShowAdvanced(true)}
                            >
                                Advanced Search
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>
                    <div className="all-cards-container">
                        <div className='all-cards-displayed'>
                            {results.map(card => (
                                <div
                                    key={`${card.setAbbrev}-${card.number}`}
                                    className="searched-card-wrap"
                                    draggable
                                    onDragStart={e => {
                                        e.dataTransfer.setData(
                                            'application/json',
                                            JSON.stringify(card)
                                        )
                                        e.dataTransfer.effectAllowed = 'copy'
                                    }}
                                    onClick={() => onCardClick(card)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={card.images.small} alt={card.name} className='database-card-in-list' />
                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            onAddCard(card)
                                        }}
                                        className='add-card-to-deck'
                                        onTouchStart={e => e.currentTarget.classList.add('pressed')}
                                        onTouchEnd={e => e.currentTarget.classList.remove('pressed')}
                                    ></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    ref={toggleBtnRef}
                    className={`card-search-toggle-btn ${isSearchVisible ? 'at-top' : 'at-bottom'}`}
                    onClick={() => setIsSearchVisible(v => !v)}
                    aria-expanded={isSearchVisible}
                >
                    {isSearchVisible ? (
                        <>
                            Close Search
                            <hr className="card-search-toggle-line line-bottom" />
                        </>
                    ) : (
                        <>
                            <hr className="card-search-toggle-line line-top" />
                            Card Search
                        </>
                    )}
                </button>
            </div>
        </>
    )
}
