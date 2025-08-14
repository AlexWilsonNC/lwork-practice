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
    const [searchMode, setSearchMode] = useState('name');

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

    function aliasNormalize(input = '') {
        // 1) NFC→NFD and strip combining accents
        let s = (input || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        // 2) unify multi-word aliases to single tokens (before removing spaces)
        //    order matters: match the longest phrases first
        s = s
            .replace(/\bprism\s*star\b/g, 'prismstar')
            .replace(/\bgold\s*star\b/g, 'goldstar')
            .replace(/\bdelta\s*species\b/g, 'deltaspecies');

        // 3) single-word aliases
        s = s
            .replace(/\bprism\b/g, 'prismstar')
            .replace(/\bgoldstar\b/g, 'goldstar') // already handled, harmless
            .replace(/\bstar\b/g, 'goldstar')
            .replace(/\bdelta\b/g, 'deltaspecies')
            .replace(/\bspecies\b/g, 'deltaspecies');

        // 4) symbols → tokens
        s = s
            .replace(/[♢◆]/g, 'prismstar')
            .replace(/★/g, 'goldstar')
            .replace(/δ/g, 'deltaspecies');

        // 5) finally remove whitespace
        s = s.replace(/\s+/g, '');

        return s;
    }

    function expandAliasToSymbolQueries(q) {
        const base = q.trim();
        const variants = new Set([base]);

        // build symbol variants from words
        let sym = base.toLowerCase();

        // longest phrases first
        sym = sym.replace(/\bprism\s*star\b/g, '♢');
        sym = sym.replace(/\bgold\s*star\b/g, '★');
        sym = sym.replace(/\bdelta\s*species\b/g, 'δ');

        // single words
        sym = sym.replace(/\bprism\b/g, '♢');
        // be conservative with "star" so "starter" doesn't trigger:
        sym = sym.replace(/\bstar\b/g, '★');
        sym = sym.replace(/\bdelta\b/g, 'δ');
        sym = sym.replace(/\bspecies\b/g, 'δ');

        if (sym !== base.toLowerCase()) {
            variants.add(sym);
        }

        // Also, if user pasted a symbol, keep it as-is (already in base)

        return Array.from(variants);
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
            if (suppressDefault) setResults([])
            else setResults(defaultCards)
            return
        }

        const allowOneChar = /^[N★δ♢◆]$/i.test(trimmed);
        if (trimmed.length < 2 && !allowOneChar) {
            setResults([]);
            return;
        }

        const t = setTimeout(() => {
            const normalizedQuery = aliasNormalize(query);

            const rawQuery = query.trim();
            const variants = expandAliasToSymbolQueries(rawQuery); // e.g. "delta" -> ["delta", "δ"]

// Build all routes (name OR text)
const routes =
  searchMode === 'name'
    ? variants.map(v => `/api/cards/searchbyname/partial/${encodeURIComponent(v)}`)
    : variants.map(v => `/api/cards/searchbytext/partial/${encodeURIComponent(v)}`);

// fetch all variants in parallel and merge unique cards
Promise.all(
  routes.map(r =>
    fetch(r)
      .then(res => (res.ok ? res.json() : []))
      .catch(() => [])
  )
).then(resLists => {
  // flatten & de-dup by a stable key (setAbbrev+number is good here)
  const byKey = new Map();
  for (const list of resLists) {
    for (const c of Array.isArray(list) ? list : []) {
      const key = `${c.setAbbrev}|${c.number}`;
      if (!byKey.has(key)) byKey.set(key, c);
    }
  }
  let arr = Array.from(byKey.values());

  // exact "N" safeguard
  if (trimmed.toUpperCase() === 'N') {
    arr = arr.filter(c => (c.name || '').toUpperCase() === 'N');
  }

  // For NAME mode, apply your alias-aware client filter ONCE.
  // For TEXT mode, do NOT filter by name here (or you’ll hide legit text hits).
  if (searchMode === 'name') {
    const normalizedQuery = aliasNormalize(rawQuery);
    arr = arr.filter(c => aliasNormalize(c.name).includes(normalizedQuery));
  }

  // sort (set order, then number)
  arr.sort((a, b) => {
    const idxA = setOrder.indexOf(a.setAbbrev);
    const idxB = setOrder.indexOf(b.setAbbrev);
    if (idxA !== idxB) return idxA - idxB;
    const numA = parseInt(a.number, 10) || 0;
    const numB = parseInt(b.number, 10) || 0;
    return numA - numB;
  });

  setResults(arr);
}).catch(() => setResults([]));
        }, 300)

        return () => clearTimeout(t)
    }, [query, defaultCards, searchMode])

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
                                <select
                                    value={searchMode}
                                    onChange={e => setSearchMode(e.target.value)}
                                    className="search-mode-dropdown"
                                >
                                    <option value="name">Card name</option>
                                    <option value="text">Card text</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search cards…"
                                    value={query}
                                    onChange={e => {
                                        setSuppressDefault(false)
                                        setQuery(e.target.value)
                                    }}
                                />
                                {/* {query && (
                                    <button
                                        type="button"
                                        className={`clear-input-btn ${query ? '' : 'is-hidden'}`}
                                        onClick={() => {
                                            setQuery('')
                                            setSuppressDefault(true)
                                            setResults([])
                                        }}
                                        aria-label="Clear search"
                                    >×</button>
                                )} */}
                                <button
                                    type="button"
                                    id="search-reset"
                                    onClick={() => {
                                        setQuery('')
                                        setSuppressDefault(true)
                                        setResults([])
                                    }}
                                >
                                    <span className="material-symbols-outlined">autorenew</span>
                                </button>
                                {/* <span className="material-symbols-outlined search-mag">search</span> */}
                            </div>
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
