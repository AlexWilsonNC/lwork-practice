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

import mechEX from '../assets/icons/ex.png';
import mechV from '../assets/icons/v.png';
import mechGX from '../assets/icons/gx.png';
import mechAceSpec from '../assets/icons/acespec.png';
import mechPrism from '../assets/icons/prism.png';
import mechGoldStar from '../assets/icons/gold-star.png';
import mechFusion from '../assets/icons/fusion.png';
import mechRapid from '../assets/icons/rs.png';
import mechSingle from '../assets/icons/ss.png';
import mechMega from '../assets/icons/mega.png';
import mechAncient from '../assets/icons/omega.png';
import mechLegend from '../assets/icons/legend.png';
import mechDelta from '../assets/icons/ds.png';

import typeGrass from '../assets/energy-symbols/grass.png';
import typeFire from '../assets/energy-symbols/fire.png';
import typeWater from '../assets/energy-symbols/water.png';
import typeLightning from '../assets/energy-symbols/lightning.png';
import typePsychic from '../assets/energy-symbols/psychic.png';
import typeFighting from '../assets/energy-symbols/fighting.png';
import typeDark from '../assets/energy-symbols/dark.png';
import typeMetal from '../assets/energy-symbols/metal.png';
import typeDragon from '../assets/energy-symbols/dragon.png';
import typeColorless from '../assets/energy-symbols/colorless.png';
import typeFairy from '../assets/energy-symbols/fairy.png';
const POKE_TYPE_OPTIONS = [
    { key: 'grass', label: 'Grass', img: typeGrass },
    { key: 'fire', label: 'Fire', img: typeFire },
    { key: 'water', label: 'Water', img: typeWater },
    { key: 'lightning', label: 'Lightning', img: typeLightning },
    { key: 'psychic', label: 'Psychic', img: typePsychic },
    { key: 'fighting', label: 'Fighting', img: typeFighting },
    { key: 'darkness', label: 'Dark', img: typeDark },
    { key: 'metal', label: 'Metal', img: typeMetal },
    { key: 'dragon', label: 'Dragon', img: typeDragon },
    { key: 'fairy', label: 'Fairy', img: typeFairy },
    { key: 'colorless', label: 'Colorless', img: typeColorless },
];

import pikachuImg from '../assets/icons/pikachu-solid.png';
import trainerCap from '../assets/icons/ball.png';
import pokeballImg from '../assets/icons/pokedex.png';
import supporterIcon from '../assets/icons/supporter.png';
import stadiumIcon from '../assets/icons/stadium.png';
import toolWrench from '../assets/icons/tool.png';
import basicEnergyIcon from '../assets/icons/basic-e.png';
import specialEnergyIcon from '../assets/icons/special-e.png';
const TYPE_BG = {
    'Pokémon': pikachuImg,
    Item: pokeballImg,
    Trainer: trainerCap,
    Supporter: supporterIcon,
    Stadium: stadiumIcon,
    Tool: toolWrench,
    Basic: basicEnergyIcon,
    Special: specialEnergyIcon
};

const MECHANICS_OPTIONS = [
    { key: 'ex', label: 'ex / EX' },
    { key: 'v', label: 'V' },
    { key: 'gx', label: 'GX' },
    { key: 'ace spec', label: 'Ace Spec' },
    { key: 'prism', label: 'Prism' },
    { key: 'star', label: 'Gold Star' },

    { key: 'fusion strike', label: 'Fusion Strike' },
    { key: 'rapid strike', label: 'Rapid Strike' },
    { key: 'single strike', label: 'Single Strike' },
    { key: 'mega', label: 'Mega' },
    { key: 'ancient trait', label: 'Ancient Trait' },
    { key: 'legend', label: 'Legend' },
    { key: 'delta species', label: 'Delta Species' },
];
const mechBadge = (text, bg = '#222', fg = '#fff') => {
    const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
       <rect width='64' height='64' rx='12' fill='${bg}'/>
       <text x='50%' y='55%' text-anchor='middle'
             font-family='Inter,system-ui,Segoe UI,Arial'
             font-size='24' font-weight='700' fill='${fg}'>${text}</text>
     </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};
const MECH_BG = {
    'ex': mechEX,
    'v': mechV,
    'gx': mechGX,
    'ace spec': mechAceSpec,
    'prism': mechPrism,
    'star': mechGoldStar,

    'fusion strike': mechFusion,
    'rapid strike': mechRapid,
    'single strike': mechSingle,
    'mega': mechMega,
    'ancient trait': mechAncient,
    'legend': mechLegend,
    'delta species': mechDelta,
};

export default function CardSearch({ onAddCard, onCardClick, onRemoveFromDeck }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [defaultCards, setDefault] = useState([])
    const [suppressDefault, setSuppressDefault] = useState(true) // PT2 - Auto load most recent set - value=false
    const [showSets, setShowSets] = useState(false)
    const [isSearchVisible, setIsSearchVisible] = useState(() => window.innerWidth > 1160);
    const widthRef = useRef(window.innerWidth);
    const toggleBtnRef = useRef(null);
    const [searchMode, setSearchMode] = useState('name');
    const latestReqId = useRef(0);
    const lastAutoSig = useRef('');
    const PAGE = 40;
    const [visibleCount, setVisibleCount] = useState(PAGE);
    const listRootRef = useRef(null);
    const loadMoreRef = useRef(null);
    const PREFILL_CAP = 100; // first batch size you want rendered
    const [prefillCursor, setPrefillCursor] = useState(0);      // index into setOrder where we stopped
    const [prefillHasMore, setPrefillHasMore] = useState(false); // there are more sets to scan
    const prefillRunId = useRef(0);                              // cancels older prefill runs
    const prefillControllers = useRef([]);
    const prefillSetListRef = useRef(setOrder);

    const MECH_PRIMARY_KEYS = ['ex', 'v', 'gx', 'ace spec', 'prism', 'star'];
    const [showMoreMechs, setShowMoreMechs] = useState(false);

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
    const SERIES_TO_ERA = {
        'scarlet & violet': 'SV1',
        'sword & shield': 'SSH1',
        'sun & moon': 'SM1',
        'xy': 'XY1',
        'black & white': 'BW1',
        'heartgold & soulsilver': 'HGSS1',
        'diamond & pearl': 'DP1',
        'platinum': 'DP1',
        'ex': 'RS1',
        'base': 'WOTC',
        'jungle': 'WOTC',
        'fossil': 'WOTC',
        'gym': 'WOTC',
        'neo': 'WOTC',
        'legendary collection': 'WOTC',
        'e-card': 'WOTC',
    };
    const SET_OPTIONS = [
        { key: 'SV4', name: 'Paradox Rift', img: sv4Img, css: 'paradox-rift' },
        { key: 'SV1', name: 'Scarlet & Violet', img: sv1, css: 'scarlet-violet' },
    ]
    function inSelectedEras(card, eras) {
        const activeEraKeys = Object.keys(eras).filter(k => eras[k]);
        if (activeEraKeys.length === 0) return true;

        const series = getCardSeries(card);
        const eraKey = SERIES_TO_ERA[series] || null;

        if (!eraKey) return false;

        return activeEraKeys.includes(eraKey);
    }

    function getCardSeries(card) {
        const s =
            (card.setSeries ?? card.series ?? card.set?.series ?? '').toString().trim().toLowerCase();
        return s;
    }

    const N = s => (s || '').toString()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim();

    const normalizePokeTypeKey = t => {
        const s = N(t);
        if (s === 'dark') return 'darkness';
        if (s === 'steel') return 'metal';
        if (s === 'electric') return 'lightning';
        return s;
    };

    function getSupertype(card) {
        return N(card.supertype ?? card.superType ?? card.super_type);
    }

    function getSubtypesArr(card) {
        const raw = Array.isArray(card.subtypes) ? card.subtypes
            : Array.isArray(card.subtype) ? card.subtype
                : typeof card.subtypes === 'string' ? [card.subtypes]
                    : typeof card.subtype === 'string' ? [card.subtype]
                        : [];
        return raw.map(N);
    }

    function hasAncientTrait(card) {
        if (card.ancientTrait || card.ancienttrait) return true;
        const rules = Array.isArray(card.rules) ? card.rules
            : typeof card.rules === 'string' ? [card.rules] : [];
        if (rules.some(r => N(r).includes('ancient trait'))) return true;
        const nm = card.name || '';
        if (/[αθω]/i.test(nm)) return true; // Alpha/Theta/Omega markers
        return false;
    }

    function matchesSelectedMechanics(card, selected) {
        const active = Object.keys(selected).filter(k => selected[k]);
        if (active.length === 0) return true;

        const subs = getSubtypesArr(card);    // normalized, e.g. ['basic','ex','single strike']
        const st = getSupertype(card);       // 'pokemon' | 'trainer' | 'energy'
        const nm = (card.name || '').toString();

        for (const mech of active) {
            switch (mech) {
                case 'prism':
                    if (subs.includes('prism star') || /◇/.test(nm)) return true;
                    break;
                case 'ex':
                    if (st === 'pokemon' && subs.includes('ex')) return true;
                    break;
                case 'v':
                    if (st === 'pokemon' && (subs.includes('v') || subs.includes('vmax') || subs.includes('vstar') || subs.includes('v-union'))) return true;
                    break;
                case 'gx':
                    if (st === 'pokemon' && subs.includes('gx')) return true;
                    break;
                case 'fusion strike':
                    if (subs.includes('fusion strike')) return true;
                    break;
                case 'rapid strike':
                    if (subs.includes('rapid strike')) return true;
                    break;
                case 'single strike':
                    if (subs.includes('single strike')) return true;
                    break;
                case 'mega':
                    if (st === 'pokemon' && subs.includes('mega')) return true;
                    break;
                case 'ace spec':
                    if (subs.includes('ace spec')) return true;   // (Trainer Item: ACE SPEC)
                    break;
                case 'star': // Gold Star, avoid VSTAR by checking exact subtype or symbol
                    if (st === 'pokemon' && (subs.includes('star') || /★/.test(nm))) return true;
                    break;
                case 'legend':
                    if (st === 'pokemon' && subs.includes('legend')) return true;
                    break;
                case 'ancient trait':
                    if (st === 'pokemon' && hasAncientTrait(card)) return true;
                    break;
                case 'delta species':
                    if (st === 'pokemon' && /δ/.test(nm)) return true; // per spec: name contains δ
                    break;
                default: break;
            }
        }
        return false;
    }

    function matchesSelectedTypes(card, selected) {
        const active = Object.keys(selected).filter(k => selected[k]);
        if (active.length === 0) return true;

        const st = getSupertype(card);
        const subs = getSubtypesArr(card);
        const has = t => subs.some(s => s === t || s.includes(t));

        for (const key of active) {
            switch (key) {
                case 'Pokémon': if (st === 'pokemon') return true; break;
                case 'Trainer': if (st === 'trainer') return true; break;
                case 'Energy': if (st === 'energy') return true; break;

                case 'Item': if (st === 'trainer' && has('item')) return true; break;
                case 'Supporter': if (st === 'trainer' && has('supporter')) return true; break;
                case 'Stadium': if (st === 'trainer' && has('stadium')) return true; break;
                case 'Tool': if (st === 'trainer' && (has('pokemon tool') || has('tool'))) return true; break;

                case 'Basic': if (st === 'energy' && has('basic')) return true; break;
                case 'Special': if (st === 'energy' && has('special')) return true; break;
            }
        }
        return false;
    }
    const typeToClass = (t) => {
        const base = (t || '')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
        return `type-btn--${base}`;
    };

    function getCardPokeTypes(card) {
        const raw = Array.isArray(card.types)
            ? card.types
            : typeof card.types === 'string'
                ? [card.types]
                : [];
        return raw.map(t => normalizePokeTypeKey(t));
    }

    function matchesSelectedPokeTypes(card, selected) {
        const active = Object.keys(selected).filter(k => selected[k]);
        if (active.length === 0) return true;

        if (getSupertype(card) !== 'pokemon') return false;

        const activeSet = new Set(active.map(normalizePokeTypeKey));
        const cardTypes = getCardPokeTypes(card);
        return cardTypes.some(t => activeSet.has(t));
    }

   function isAutoFilterActive() {
  if ((query || '').trim() !== '') return false;
  const f = filters;
  return (
    Object.values(f.mechanics || {}).some(Boolean) ||
    Object.values(f.supertypes || {}).some(Boolean) ||
    Object.values(f.pokeTypes || {}).some(Boolean) ||
    Object.values(f.eras || {}).some(Boolean)       // ← enable era-only prefill
  );
}

    // Apply ALL current filters to a single card (early reject during prefill)
    function cardPassesCurrentFilters(card) {
        if (!inSelectedEras(card, filters.eras)) return false;

        const setsChecked = Object.values(filters.sets).some(Boolean);
        if (setsChecked && !filters.sets[card.setAbbrev]) return false;

        if (!matchesSelectedTypes(card, filters.supertypes)) return false;
        if (!matchesSelectedMechanics(card, filters.mechanics)) return false;
        if (!matchesSelectedPokeTypes(card, filters.pokeTypes)) return false;

        return true;
    }

    // Cancel any running prefill (called when query starts typing or filters change)
    function cancelPrefill() {
        prefillRunId.current += 1;
        prefillControllers.current.forEach(c => { try { c.abort(); } catch { } });
        prefillControllers.current = [];
        setPrefillHasMore(false);
    }

    const ERA_PATTERNS = {
  SV1:   /^SV/i,
  SSH1:  /^(SWSH|SSH)/i,
  SM1:   /^SM/i,
  XY1:   /^XY/i,
  BW1:   /^BW/i,
  HGSS1: /^(HS|UL|UD|TM|HGSS)/i,
  DP1:   /^(DP|PL)/i,
  RS1:   /^(EX|RS)/i,
  WOTC:  /^(BS|JU|FO|G[12]|N[1-4]|LC|E[1-3])/i
};

// If these are selected, start with OLDER sets first.
function preferOldestForCurrentFilters() {
  const f = filters;
  return !!(
    f.mechanics?.['star'] ||
    f.mechanics?.['legend'] ||
    f.mechanics?.['delta species'] ||
    f.mechanics?.['ancient trait'] ||
    f.eras?.['HGSS1'] || f.eras?.['DP1'] || f.eras?.['RS1'] || f.eras?.['WOTC']
  );
}

// Build the set list we’ll scan for prefill.
function getSetsToScanForCurrentFilters() {
  const activeEras = Object.keys(filters.eras || {}).filter(k => filters.eras[k]);
  let list = setOrder;

  if (activeEras.length) {
    const regexes = activeEras.map(k => ERA_PATTERNS[k]).filter(Boolean);
    const narrowed = setOrder.filter(code => regexes.some(rx => rx.test(code)));
    if (narrowed.length) list = narrowed;
  }

  if (preferOldestForCurrentFilters()) list = list.slice().reverse(); // oldest → newest
  return list;
}

async function prefillResultsForActiveFilters() {
  if (!isAutoFilterActive()) return;

  // cancel any older run and mark this one
  cancelPrefill();
  const runId = prefillRunId.current;

  const sig = JSON.stringify({
    mech: filters.mechanics,
    types: filters.supertypes,
    poke: filters.pokeTypes,
    eras: filters.eras
  });
  if (sig === lastAutoSig.current && results.length) return;
  lastAutoSig.current = sig;

  // fresh start
  setResults([]);
  setPrefillCursor(0);
  setPrefillHasMore(false);
  setSuppressDefault(true);

  const setsToScan = getSetsToScanForCurrentFilters();
  prefillSetListRef.current = setsToScan;

  let matches = [];
  let cursor = 0;

  while (cursor < setsToScan.length && matches.length < PREFILL_CAP) {
    // abort if user starts typing or a new run began
    if ((query || '').trim() !== '' || runId !== prefillRunId.current) return;

    const code = setsToScan[cursor];
    const ctrl = new AbortController();
    prefillControllers.current.push(ctrl);

    const list = await fetch(`/api/cards/${encodeURIComponent(code)}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : []))
      .catch(() => []);

    const before = matches.length;

    const filtered = (Array.isArray(list) ? list : [])
      .filter(cardPassesCurrentFilters)
      .sort((a, b) => (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0));

    if (filtered.length) {
      matches = matches.concat(filtered);

      // 👉 Stream partial results immediately (cap to PREFILL_CAP for consistency)
      setResults(matches.slice(0, PREFILL_CAP));
      // yield so the browser can paint immediately
      await new Promise(requestAnimationFrame);
    }

    cursor += 1;
  }

  if (runId !== prefillRunId.current) return;

  setPrefillCursor(cursor);
  setPrefillHasMore(cursor < setsToScan.length);
}

    async function resumePrefill() {
        if (!isAutoFilterActive()) return;

        const runId = prefillRunId.current;  // continue the current run
 const setsToScan = prefillSetListRef.current || setOrder;
 let cursor = prefillCursor;
        let acc = results.slice();           // start from what’s already shown
        let added = 0;

        while (cursor < setsToScan.length && added < PREFILL_CAP) {
            if (!isAutoFilterActive() || runId !== prefillRunId.current) return;

            const code = setsToScan[cursor];
            const ctrl = new AbortController();
            prefillControllers.current.push(ctrl);

            const list = await fetch(`/api/cards/${encodeURIComponent(code)}`, { signal: ctrl.signal })
                .then(r => (r.ok ? r.json() : []))
                .catch(() => []);

            const before = acc.length;
            const filtered = (Array.isArray(list) ? list : [])
                .filter(cardPassesCurrentFilters)
                .sort((a, b) => (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0));

            acc = acc.concat(filtered);
            added += (acc.length - before);
            cursor += 1;
        }

        if (!isAutoFilterActive() || runId !== prefillRunId.current) return;

        setResults(acc);
        setPrefillCursor(cursor);
        setPrefillHasMore(cursor < setsToScan.length);
    }

    function takeFirstMatching(arr, limit) {
        const out = [];
        let taken = 0;

        for (let i = 0; i < arr.length; i++) {
            const card = arr[i];

            if (!inSelectedEras(card, filters.eras)) continue;

            const setsChecked = Object.values(filters.sets).some(Boolean);
            if (setsChecked && !filters.sets[card.setAbbrev]) continue;

            if (!matchesSelectedTypes(card, filters.supertypes)) continue;
            if (!matchesSelectedMechanics(card, filters.mechanics)) continue;
            if (!matchesSelectedPokeTypes(card, filters.pokeTypes)) continue;

            out.push(card);
            taken++;
            if (taken >= limit) {
                return { items: out, hasMore: true };
            }
        }
        return { items: out, hasMore: false };
    }

    const [showAdvanced, setShowAdvanced] = useState(false)
    const [filters, setFilters] = useState({
        supertypes: { Pokémon: false, Trainer: false, Energy: false },
        sets: {},
        eras: ERA_OPTIONS.reduce((acc, e) => ({ ...acc, [e.key]: false }), {}),
        mechanics: {},
        pokeTypes: {}
    })
    const resetAdvancedFilters = React.useCallback(() => {
        setFilters({
            supertypes: {},
            sets: {},
            eras: ERA_OPTIONS.reduce((acc, e) => ({ ...acc, [e.key]: false }), {}),
            mechanics: {},
            pokeTypes: {}
        });
    }, []);

    const toggleSet = key => {
        setFilters(f => ({
            ...f,
            sets: { ...f.sets, [key]: !f.sets[key] }
        }))
    }

    const handleDragOver = e => {
        if (Array.from(e.dataTransfer?.types || []).includes('application/ptcg-card')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const handleDrop = e => {
        const types = Array.from(e.dataTransfer?.types || []);
        if (!types.includes('application/ptcg-card')) return;
        e.preventDefault();
        try {
            const payload = JSON.parse(e.dataTransfer.getData('application/ptcg-card') || '{}');
            if (payload?.action === 'decrement' && onRemoveFromDeck) {
                onRemoveFromDeck(payload);
            }
        } catch { /* no-op */ }
    };

    function aliasNormalize(input = '') {
        let s = (input || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        s = s
            .replace(/\bprism\s*star\b/g, 'prismstar')
            .replace(/\bgold\s*star\b/g, 'goldstar')
            .replace(/\bdelta\s*species\b/g, 'deltaspecies');

        s = s
            .replace(/\bprism\b/g, 'prismstar')
            .replace(/\bgoldstar\b/g, 'goldstar')
            .replace(/\bstar\b/g, 'goldstar')
            .replace(/\bdelta\b/g, 'deltaspecies')
            .replace(/\bspecies\b/g, 'deltaspecies');

        s = s
            .replace(/[♢◆]/g, 'prismstar')
            .replace(/★/g, 'goldstar')
            .replace(/δ/g, 'deltaspecies');

        s = s.replace(/\s+/g, '');

        return s;
    }

    function expandAliasToSymbolQueries(q) {
        const base = q.trim();
        const variants = new Set([base]);

        let sym = base.toLowerCase();

        sym = sym.replace(/\bprism\s*star\b/g, '♢');
        sym = sym.replace(/\bgold\s*star\b/g, '★');
        sym = sym.replace(/\bdelta\s*species\b/g, 'δ');

        sym = sym.replace(/\bprism\b/g, '♢');
        sym = sym.replace(/\bstar\b/g, '★');
        sym = sym.replace(/\bdelta\b/g, 'δ');
        sym = sym.replace(/\bspecies\b/g, 'δ');

        if (sym !== base.toLowerCase()) {
            variants.add(sym);
        }

        return Array.from(variants);
    }

    // LOAD MOST RECENT SET IN CARD SEARCH ON LOAD - SEARCH FOR PT2 TO ADD BACK
    // useEffect(() => {
    //     const newestSet = setOrder[0]
    //     fetch(`/api/cards/${encodeURIComponent(newestSet)}`)
    //         .then(res => {
    //             if (!res.ok) throw new Error(`Network ${res.status}`)
    //             return res.json()
    //         })
    //         .then(data => {
    //             const arr = Array.isArray(data) ? data : []
    //             arr.sort((a, b) => {
    //                 const nA = parseInt(a.number, 10) || 0
    //                 const nB = parseInt(b.number, 10) || 0
    //                 return nA - nB
    //             })
    //             setDefault(arr)
    //             setResults(arr)
    //         })
    //         .catch(err => {
    //             console.error('Failed to load default set:', err)
    //         })
    // }, [])

    useEffect(() => {
        // Preload era and set images
        const imgs = [
            ...ERA_OPTIONS.map(o => o.src),
            ...SET_OPTIONS.map(o => o.img),
        ];
        imgs.forEach(src => { const im = new Image(); im.src = src; });
    }, []);

    useEffect(() => {
        const trimmed = query.trim()

        // typing should pre-empt any running prefill
        if (trimmed !== '') cancelPrefill();

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

        setResults([]);

        const reqId = ++latestReqId.current;

        const t = setTimeout(() => {
            const normalizedQuery = aliasNormalize(query);

            const rawQuery = query.trim();
            const primeMode = /\bprime\b/i.test(rawQuery);
            const variants = expandAliasToSymbolQueries(rawQuery);

            const routes = (() => {
                if (!primeMode) {
                    return (searchMode === 'name'
                        ? variants.map(v => `/api/cards/searchbyname/partial/${encodeURIComponent(v)}`)
                        : variants.map(v => `/api/cards/searchbytext/partial/${encodeURIComponent(v)}`));
                }
                const primeSetCodes = setOrder.filter(code => /^(HS|UL|UD|TM|HGSS)/i.test(code));
                if (!primeSetCodes.length) {
                    return variants.map(v => `/api/cards/searchbytext/partial/${encodeURIComponent(v)}`);
                }
                return primeSetCodes.map(s => `/api/cards/${encodeURIComponent(s)}`);
            })();

            Promise.all(
                routes.map(r =>
                    fetch(r)
                        .then(res => (res.ok ? res.json() : []))
                        .catch(() => [])
                )
            ).then(resLists => {
                if (reqId !== latestReqId.current) return;
                const byKey = new Map();
                for (const list of resLists) {
                    for (const c of Array.isArray(list) ? list : []) {
                        const key = `${c.setAbbrev}|${c.number}`;
                        if (!byKey.has(key)) byKey.set(key, c);
                    }
                }
                let arr = Array.from(byKey.values());
                if (primeMode) {
                    const getSubtypes = c => {
                        if (Array.isArray(c.subtypes)) return c.subtypes;
                        if (Array.isArray(c.subtype)) return c.subtype;
                        if (typeof c.subtypes === 'string') return [c.subtypes];
                        if (typeof c.subtype === 'string') return [c.subtype];
                        return [];
                    };
                    arr = arr.filter(c =>
                        getSubtypes(c).some(st => (st || '').toLowerCase().includes('prime'))
                    );
                }

                if (/^[N★δ♢◆]$/i.test(trimmed)) {
                    const t = trimmed.toUpperCase();

                    if (t === 'N') {
                        // exact "N" only (prevents unrelated trainers/items with an 'n' somewhere)
                        arr = arr.filter(c => (c.name || '').toUpperCase() === 'N');
                    } else if (t === '★') {
                        // gold star: name must actually contain the star OR alias match
                        arr = arr.filter(c =>
                            (c.name || '').includes('★') ||
                            aliasNormalize(c.name).includes('goldstar')
                        );
                    } else if (t === 'δ') {
                        // delta species: must contain delta symbol OR alias match
                        arr = arr.filter(c =>
                            (c.name || '').includes('δ') ||
                            aliasNormalize(c.name).includes('deltaspecies')
                        );
                    } else { // ♢ or ◆ (prism star)
                        arr = arr.filter(c =>
                            (c.name || '').includes('♢') ||
                            (c.name || '').includes('◆') ||
                            aliasNormalize(c.name).includes('prismstar')
                        );
                    }
                }

                if (searchMode === 'name' && !primeMode) {
                    const normalizedQuery = aliasNormalize(rawQuery);
                    arr = arr.filter(c => aliasNormalize(c.name).includes(normalizedQuery));
                }

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

    useEffect(() => {
        const t = setTimeout(() => { prefillResultsForActiveFilters(); }, 150);
        return () => clearTimeout(t);
    }, [filters.mechanics, filters.supertypes, filters.pokeTypes, filters.eras, query]);

    const { items: displayResults, hasMore } = React.useMemo(() => {
        return takeFirstMatching(results, visibleCount);
    }, [results, filters, visibleCount]);

    useEffect(() => {
        const root = listRootRef.current;
        const target = loadMoreRef.current;
        if (!root || !target) return;

        const io = new IntersectionObserver(
            entries => {
                if (entries.some(e => e.isIntersecting)) {
                    setVisibleCount(c => c + PAGE);
                }
            },
            { root, rootMargin: '400px 0px 400px 0px', threshold: 0.01 }
        );

        io.observe(target);
        return () => io.disconnect();
    }, [hasMore]);

    useEffect(() => {
        setVisibleCount(PAGE);
    }, [query, searchMode, filters]);

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
            const dy = startY - t.clientY;
            const dx = Math.abs(startX - t.clientX);

            if (Math.abs(dy) < 50 || dx > 40) return;

            if (dy > 0 && !isSearchVisible) {
                setIsSearchVisible(true);
            } else if (dy < 0 && isSearchVisible) {
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
            if (w === widthRef.current) return;
            widthRef.current = w;

            if (w < 1160) {
                document.body.classList.add('no-scroll');
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
                <div
                    className="card-search-content"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <button
                        className="advanced-search-button"
                        onClick={() => setShowAdvanced(true)}
                    style={{ pointerEvents: 'none' }}
                    >
                        Advanced Search
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </button>
                    {showAdvanced && (
                        <div className="advanced-search-modal-overlay" onClick={() => setShowAdvanced(false)}>
                            <div className="advanced-search-modal" onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Advanced Search</h2>
                                    <button
                                        className="modal-close-x"
                                        aria-label="Close advanced search"
                                        onClick={() => setShowAdvanced(false)}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <hr style={{ width: '100%', margin: '25px 0' }}></hr>
                                <div className="filter-group">
                                    <h3>Eras:</h3>
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
                                        Sets:
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
                                <hr style={{ width: '100%', margin: '25px 0' }}></hr>
                                <div className="filter-group">
                                    <h3>Card Type:</h3>
                                    <div className="type-buttons">
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
                                                className={`type-btn ${filters.supertypes[type] ? 'active' : ''} ${typeToClass(type)}`}
                                                style={{ '--typeIcon': TYPE_BG[type] ? `url("${TYPE_BG[type]}")` : 'none' }}
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
                                                className={`type-btn ${filters.supertypes[type] ? 'active' : ''} ${typeToClass(type)}`}
                                                style={{ '--typeIcon': TYPE_BG[type] ? `url("${TYPE_BG[type]}")` : 'none' }}
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
                                </div>
                                <div className="filter-group">
                                    <h3>Mechanics:</h3>
                                    <div className="mechanics-buttons">
                                        {(showMoreMechs
                                            ? MECHANICS_OPTIONS
                                            : MECHANICS_OPTIONS.filter(m => MECH_PRIMARY_KEYS.includes(m.key))
                                        ).map(({ key, label }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`type-btn ${filters.mechanics[key] ? 'active' : ''}`}
                                                style={{
                                                    '--typeIcon': MECH_BG[key] ? `url("${MECH_BG[key]}")` : 'none'
                                                }}
                                                onClick={() => {
                                                    setFilters(f => ({
                                                        ...f,
                                                        mechanics: { ...f.mechanics, [key]: !f.mechanics[key] }
                                                    }));
                                                }}
                                                aria-pressed={!!filters.mechanics[key]}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            className="type-btn mechanics-toggle"
                                            style={{ '--typeIcon': 'none' }}
                                            onClick={() => setShowMoreMechs(v => !v)}
                                            aria-expanded={showMoreMechs}
                                        >
                                            <span className="toggle-label">{showMoreMechs ? 'Show less' : 'Show more'}</span>
                                            <span className="material-symbols-outlined" aria-hidden="true">
                                                {showMoreMechs ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>Poké Type:</h3>
                                    <div className="poke-type-buttons">
                                        {POKE_TYPE_OPTIONS.map(({ key, label, img }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`type-btn ${filters.pokeTypes[key] ? 'active' : ''}`}
                                                style={{ '--typeIcon': `url("${img}")` }}
                                                onClick={() => {
                                                    setFilters(f => ({
                                                        ...f,
                                                        pokeTypes: { ...f.pokeTypes, [key]: !f.pokeTypes[key] }
                                                    }));
                                                }}
                                                title={label}
                                                aria-pressed={!!filters.pokeTypes[key]}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="buttons-row-modal flex-end">
                                    <button className='cancel-button' onClick={resetAdvancedFilters}>
                                        Reset
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
                                {query && (
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
                                )}
                                <button
                                    type="button"
                                    id="search-reset"
                                    onClick={() => {
                                        setQuery('')
                                        setSuppressDefault(true)
                                        setResults([])
                                    }}
                                >
                                    {/* <span className="material-symbols-outlined">autorenew</span> */}
                                </button>
                                {/* <span className="material-symbols-outlined search-mag">search</span> */}
                            </div>
                            <button
                                className="advanced-search-button-small"
                                onClick={() => setShowAdvanced(true)}
                            style={{ pointerEvents: 'none' }}
                            >
                                Advanced Search
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>
                    <div className="all-cards-container" ref={listRootRef}>
                        <div className='all-cards-displayed'>
                            {displayResults.map(card => (
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
                                    <img
                                        draggable={false}
                                        onDragStart={e => e.preventDefault()}
                                        loading="lazy"
                                        src={card.images.small} alt={card.name} className='database-card-in-list' />
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
                            {hasMore && <div ref={loadMoreRef} className="infinite-sentinel" aria-hidden="true" />}
                            {(query.trim() === '' && prefillHasMore) && (
                                <button
                                    type="button"
                                    className="show-more-cards"
                                    onClick={resumePrefill}
                                    style={{ margin: '12px auto', display: 'block' }}
                                >
                                    Show more
                                </button>
                            )}
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
