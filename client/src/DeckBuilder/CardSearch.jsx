import React, { useState, useEffect, useRef } from 'react'
// GREAT SPOT!
import setOrder from '../Tournaments/setorder'
import { availableSets as cardsPageSets } from '../Cards/CardsPage';
import './setsInAdvancedDropdown.css'

import bw1 from '../assets/sets/black-white/bw1-bw.png'
import dp1 from '../assets/sets/diamond-pearl/dp1-diamond-pearl.png'
import rs1 from '../assets/sets/ruby-saphire/ex1-ruby-sapphire.png'
import sm1 from '../assets/sets/sun-moon/sm1-sm.png'
import ssh1 from '../assets/sets/sword-shield/ssh1.webp'
import sv1 from '../assets/sets/scarlet-violet/sv1.png'
import wotc from '../assets/sets/wizards-of-the-coast/wotc.png'
import xy1 from '../assets/sets/xy/xy1-xy.png'
import hgss1 from '../assets/sets/heartgold-soulsilver/hs1-hgss.png'

import mechEX from '../assets/icons/ex.png';
import mechV from '../assets/icons/v.png';
import mechGX from '../assets/icons/gx.png';
import mechAceSpec from '../assets/icons/acespec.png';
import mechTagTeam from '../assets/icons/tagteam.png';
import mechPrism from '../assets/icons/prism.png';
import mechTera from '../assets/icons/tera.png';
import mechFuture from '../assets/icons/future.webp';
import mechAncient from '../assets/icons/ancient.png';
import mechGoldStar from '../assets/icons/gold-star.png';
import mechFusion from '../assets/icons/fusion.png';
import mechRapid from '../assets/icons/rs.png';
import mechSingle from '../assets/icons/ss.png';
import mechMega from '../assets/icons/mega.png';
import mechAncientTrait from '../assets/icons/omega.png';
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
    { key: 'darkness', label: 'Darkness', img: typeDark },
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
    Pokémon: pikachuImg,
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
    { key: 'tera', label: 'Tera' },
    { key: 'prism', label: 'Prism' },
    { key: 'mega', label: 'Mega' },
    { key: 'star', label: 'Gold Star' },
    { key: 'ace spec', label: 'Ace Spec' },
    { key: 'ancient', label: 'Ancient' },
    { key: 'future', label: 'Future' },
    { key: 'fusion strike', label: 'Fusion Strike' },
    { key: 'rapid strike', label: 'Rapid Strike' },
    { key: 'single strike', label: 'Single Strike' },
    { key: 'tag team', label: 'Tag Team' },
    { key: 'ancient trait', label: 'Ancient Trait' },
    { key: 'legend', label: 'Legend' },
    { key: 'delta species', label: 'Delta Species' },
];
const STAGE_OPTIONS = [
    { key: 'basic', label: 'Basic' },
    { key: 'stage 1', label: 'Stage 1' },
    { key: 'stage 2', label: 'Stage 2' },
    { key: 'vstar', label: 'VSTAR' },
    { key: 'vmax', label: 'VMAX' },
    { key: 'v-union', label: 'V-UNION' },
    { key: 'mega', label: 'MEGA' },
    { key: 'break', label: 'BREAK' },
    { key: 'restored', label: 'Restored' },
    { key: 'legend', label: 'Legend' },
    { key: 'lv.x', label: 'LV.X' }
];
const STAGE_PRIMARY_KEYS = ['basic', 'stage 1', 'stage 2'];
const HP_OPERATORS = [
    { value: 'eq', label: '=' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
    { value: 'ge', label: '≥' },
    { value: 'le', label: '≤' },
];
const HP_VALUES = Array.from({ length: 32 }, (_, i) => (i + 3) * 10);
const MECH_BG = {
    'ex': mechEX,
    'v': mechV,
    'gx': mechGX,
    'ace spec': mechAceSpec,
    'tag team': mechTagTeam,
    'prism': mechPrism,
    'future': mechFuture,
    'ancient': mechAncient,
    'tera': mechTera,
    'star': mechGoldStar,

    'fusion strike': mechFusion,
    'rapid strike': mechRapid,
    'single strike': mechSingle,
    'mega': mechMega,
    'ancient trait': mechAncientTrait,
    'legend': mechLegend,
    'delta species': mechDelta,
};

const slugCss = (s) =>
    String(s || '')
        .normalize('NFKD')                      // strip accents (e.g., Pokémon -> Pokemon)
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, 'and')                   // "Scarlet & Violet" -> "scarlet-and-violet"
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')            // non-alphanum -> hyphen
        .replace(/^-+|-+$/g, '');

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
    const skipNextQueryEffectRef = useRef(false);

    const MECH_PRIMARY_KEYS = ['ex', 'v', 'gx', 'tera', 'prism', 'star'];
    const [showMoreMechs, setShowMoreMechs] = useState(false);
    const [showMoreStages, setShowMoreStages] = useState(false);

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
        // modern
        'scarlet & violet': 'SV1',
        'scarlet and violet': 'SV1',

        'sword & shield': 'SSH1',
        'sword and shield': 'SSH1',

        'sun & moon': 'SM1',
        'sun and moon': 'SM1',

        'xy': 'XY1',

        'black & white': 'BW1',
        'black and white': 'BW1',

        'heartgold & soulsilver': 'HGSS1',
        'heartgold and soulsilver': 'HGSS1',
        'heartgold soulsilver': 'HGSS1',

        // DP era (treat “Platinum” series as part of the DP era selection, as you wanted)
        'diamond & pearl': 'DP1',
        'diamond and pearl': 'DP1',
        'diamond pearl': 'DP1',
        'platinum': 'DP1',

        // EX era
        'ex': 'RS1',
        'ex series': 'RS1',

        // WotC era families
        'base': 'WOTC',
        'jungle': 'WOTC',
        'fossil': 'WOTC',
        'gym': 'WOTC',
        'neo': 'WOTC',
        'legendary collection': 'WOTC',
        'e-card': 'WOTC',
        'ecard': 'WOTC',
    };

    const [setLogos, setSetLogos] = useState({});

    useEffect(() => {
        let cancelled = false;
        fetch('/api/sets/logos')
            .then(r => (r.ok ? r.json() : []))
            .then(arr => {
                if (cancelled) return;
                const map = {};
                for (const it of Array.isArray(arr) ? arr : []) {
                    if (it?.abbrev && it?.logo) map[it.abbrev] = it.logo;
                }
                setSetLogos(map);
            })
            .catch(() => { });
        return () => { cancelled = true; };
    }, []);

    const SET_OPTIONS = React.useMemo(
        () =>
            (cardsPageSets || [])
                .filter(s => !s.separator && s.abbrev)
                .map(({ abbrev, name }) => ({
                    key: abbrev,      // e.g. "ROS"
                    name,             // e.g. "Roaring Skies"
                    img: setLogos[abbrev] || ''
                })),
        [cardsPageSets, setLogos]
    );

    function inSelectedEras(card, eras) {
        const activeEraKeys = Object.keys(eras).filter(k => eras[k]);
        if (activeEraKeys.length === 0) return true;

        const series = getCardSeries(card);
        const eraFromSeries = SERIES_TO_ERA[series] || null;
        if (eraFromSeries && activeEraKeys.includes(eraFromSeries)) return true;

        const abbr = (card.setAbbrev || '').toString();
        for (const eraKey of activeEraKeys) {
            const rx = ERA_PATTERNS[eraKey];
            if (rx && rx.test(abbr)) return true;
        }

        return false;
    }

    function anyFilterActive(filters) {
        return (
            Object.values(filters.supertypes || {}).some(Boolean) ||
            Object.values(filters.sets || {}).some(Boolean) ||
            Object.values(filters.eras || {}).some(Boolean) ||
            Object.values(filters.mechanics || {}).some(Boolean) ||
            Object.values(filters.pokeTypes || {}).some(Boolean) ||
            Object.values(filters.stage || {}).some(Boolean) ||
            Number.isFinite(Number((filters.hp || {}).value))
        );
    }

    function getCardSeries(card) {
        let s = (card.setSeries ?? card.series ?? card.set?.series ?? '')
            .toString()
            .trim()
            .toLowerCase();

        s = s.replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
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
        return !!(card.ancientTrait || card.ancienttrait);
    }

    function matchesSelectedMechanics(card, selected) {
        const active = Object.keys(selected).filter(k => selected[k]);
        if (active.length === 0) return true;

        const subs = getSubtypesArr(card);
        const st = getSupertype(card);
        const nm = (card.name || '').toString();
        const rulesArr = Array.isArray(card.rules)
            ? card.rules
            : (typeof card.rules === 'string' ? [card.rules] : []);
        const rulesText = rulesArr.join(' ').toLowerCase();

        const hasSub = s => subs.includes(s);

        for (const mech of active) {
            switch (mech) {
                case 'prism':
                    if (hasSub('prism star') || /[♢◆]/.test(nm) || rulesText.includes('prism star')) return true;
                    break;
                case 'ex':
                    if (st === 'pokemon' && hasSub('ex')) return true;
                    break;
                case 'v':
                    if (st === 'pokemon' && (hasSub('v') || hasSub('vmax') || hasSub('vstar') || hasSub('v-union'))) return true;
                    break;
                case 'gx':
                    if (st === 'pokemon' && hasSub('gx')) return true;
                    break;
                case 'tag team':
                    if (hasSub('tag team')) return true;
                    break;
                case 'ancient':
                    if (hasSub('ancient')) return true;
                    break;
                case 'future':
                    if (hasSub('future')) return true;
                    break;
                case 'tera':
                    if (st === 'pokemon' && hasSub('tera')) return true;
                    break;

                // --- “Show more” mechanics:
                case 'fusion strike':
                    if (hasSub('fusion strike') || rulesText.includes('fusion strike')) return true;
                    break;
                case 'rapid strike':
                    if (hasSub('rapid strike') || rulesText.includes('rapid strike')) return true;
                    break;
                case 'single strike':
                    if (hasSub('single strike') || rulesText.includes('single strike')) return true;
                    break;
                case 'mega':
                    if (st === 'pokemon' && (hasSub('mega') || /^m\s/i.test(nm))) return true;
                    break;
                case 'ancient trait':
                    if (st === 'pokemon' && (hasAncientTrait(card) || rulesText.includes('ancient trait'))) return true;
                    break;
                case 'legend':
                    if (st === 'pokemon' && (hasSub('legend') || /\blegend\b/i.test(nm))) return true;
                    break;
                case 'delta species':
                    if (st === 'pokemon' && (hasSub('delta species') || /δ/.test(nm) || rulesText.includes('delta species'))) return true;
                    break;

                case 'ace spec':
                    if (hasSub('ace spec') || rulesText.includes('ace spec')) return true;
                    break;
                case 'star':
                    if (st === 'pokemon' && (hasSub('star') || /★/.test(nm) || rulesText.includes('gold star'))) return true;
                    break;
                default:
                    break;
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

    function matchesSelectedStage(card, selected) {
        const active = Object.keys(selected || {}).filter(k => selected[k]);
        if (active.length === 0) return true;

        if (getSupertype(card) !== 'pokemon') return false;

        const subs = getSubtypesArr(card);
        const has = (needle) => subs.includes(needle) || subs.some(s => s.includes(needle));

        const nameLower = (card.name || '').toLowerCase();

        for (const k of active) {
            switch (k) {
                case 'basic': if (has('basic')) return true; break;
                case 'stage 1': if (has('stage 1') || has('stage1')) return true; break;
                case 'stage 2': if (has('stage 2') || has('stage2')) return true; break;
                case 'vstar': if (has('vstar')) return true; break;
                case 'vmax': if (has('vmax')) return true; break;
                case 'v-union': if (has('v-union') || has('v union')) return true; break;
                case 'mega': if (has('mega')) return true; break;
                case 'break': if (has('break')) return true; break;
                case 'restored': if (has('restored')) return true; break;
                case 'legend': if (has('legend') || /\blegend\b/i.test(card.name || '')) return true; break;
                case 'lv.x':
                    if (has('lv.x') || has('level-up') || nameLower.includes('lv.x') || nameLower.includes('lv. x')) return true;
                    break;
                default: break;
            }
        }
        return false;
    }

    function matchesSelectedHP(card, hpFilter) {
        const op = hpFilter?.op || 'eq';
        const val = Number(hpFilter?.value || NaN);
        // If no value chosen, don't filter by HP
        if (!Number.isFinite(val)) return true;

        // HP is a Pokémon concept; if a Pokémon is required when HP is active:
        if (getSupertype(card) !== 'pokemon') return false;

        const hpNum = Number.parseInt(card.hp, 10);
        if (!Number.isFinite(hpNum)) return false;

        switch (op) {
            case 'gt': return hpNum > val;
            case 'lt': return hpNum < val;
            case 'ge': return hpNum >= val;
            case 'le': return hpNum <= val;
            case 'eq':
            default: return hpNum === val;
        }
    }

    const ERA_PATTERNS = {
        // Scarlet & Violet
        SV1: /^(SV|SVI|PAL|OBF|PAR|TEF|TWM|SCR)/i,

        // Sword & Shield
        SSH1: /^(SWSH|SSH|RCL|DAA|CPA|VIV|SHF|BST|CRE|EVS|FST|BRS|ASR|LOR|SIT|CRZ)/i,

        // Sun & Moon
        SM1: /^(SM|SUM|GRI|BUS|CIN|UPR|FLI|CES|LOT|TEU|UNB|UNM|CEC|DRM|HIF|DET|TM)/i,

        // XY
        XY1: /^(XY|FLF|FFI|PHF|PRC|ROS|AOR|BKT|BKP|FCO|STS|EVO|GEN)/i,

        // Black & White
        BW1: /^(BW|NVI|EPO|DEX|DRX|BCR|PLS|PLF|PLB|LTR)/i,

        // HeartGold & SoulSilver
        HGSS1: /^(HGSS|HS|UL|UD|TM|CL)/i,

        // Diamond & Pearl (+ Platinum)
        DP1: /^(DP|MT|SW|GE|MD|LA|SF|PL)/i,

        // EX (ADV/RS era)
        RS1: /^(RS|SS|DR|MA|HL|TRR|DX|EM|UF|DS|LM|HP|CG|DF|PK)/i,

        // Wizards of the Coast
        WOTC: /^(BS|JU|FO|G[12]|N[1-4]|LC|E[1-3])\/?/i
    };

    function takeFirstMatching(arr, limit = Number.POSITIVE_INFINITY) {
        const out = [];

        for (let i = 0; i < arr.length; i++) {
            const card = arr[i];

            if (!inSelectedEras(card, filters.eras)) continue;

            const setsChecked = Object.values(filters.sets).some(Boolean);
            if (setsChecked && !filters.sets[card.setAbbrev]) continue;

            if (!matchesSelectedTypes(card, filters.supertypes)) continue;
            if (!matchesSelectedMechanics(card, filters.mechanics)) continue;
            if (!matchesSelectedPokeTypes(card, filters.pokeTypes)) continue;
            if (!matchesSelectedStage(card, filters.stage)) continue;
            if (!matchesSelectedHP(card, filters.hp)) continue;

            out.push(card);
        }

        const setIdx = (abbr) => {
            const i = setOrder.indexOf(abbr);
            return i === -1 ? Number.MAX_SAFE_INTEGER : i;
        };
        out.sort((a, b) => {
            const ia = setIdx(a.setAbbrev);
            const ib = setIdx(b.setAbbrev);
            if (ia !== ib) return ia - ib;
            const na = parseInt(a.number, 10) || 0;
            const nb = parseInt(b.number, 10) || 0;
            return na - nb;
        });

        if (out.length > limit) {
            return { items: out.slice(0, limit), hasMore: true };
        }
        return { items: out, hasMore: false };
    }

    const [showAdvanced, setShowAdvanced] = useState(false);

    const emptyFilters = React.useMemo(() => ({
        supertypes: {},
        sets: {},
        eras: ERA_OPTIONS.reduce((acc, e) => ({ ...acc, [e.key]: false }), {}),
        mechanics: {},
        pokeTypes: {},
        stage: {},
        hp: { op: 'eq', value: null }
    }), [ERA_OPTIONS]);

    const [filters, setFilters] = useState(emptyFilters);

    const [draftFilters, setDraftFilters] = useState(emptyFilters);

    const allSetKeys = React.useMemo(() => SET_OPTIONS.map(o => o.key), []);

    const selectedSetKeys = React.useMemo(
        () => Object.entries(draftFilters.sets || {})
            .filter(([, on]) => !!on)
            .map(([k]) => k),
        [draftFilters.sets]
    );

    const handleSetsChange = React.useCallback((e) => {
        const chosen = new Set(Array.from(e.target.selectedOptions).map(o => o.value));
        setDraftFilters(f => {
            const next = {};
            for (const key of allSetKeys) next[key] = chosen.has(key);
            return { ...f, sets: next };
        });
    }, [allSetKeys]);

    const selectAllSets = React.useCallback(() => {
        setDraftFilters(f => ({
            ...f,
            sets: Object.fromEntries(allSetKeys.map(k => [k, true]))
        }));
    }, [allSetKeys]);

    const clearAllSets = React.useCallback(() => {
        setDraftFilters(f => ({ ...f, sets: {} }));
    }, []);

    const resetDraftAdvancedFilters = React.useCallback(() => {
        setDraftFilters(emptyFilters);
    }, [emptyFilters]);

    const toggleSet = key =>
        setDraftFilters(f => ({ ...f, sets: { ...f.sets, [key]: !f.sets[key] } }));

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
        const imgs = [
            ...ERA_OPTIONS.map(o => o.src),
            ...SET_OPTIONS.map(o => o.img),
        ];
        imgs.forEach(src => { const im = new Image(); im.src = src; });
    }, [SET_OPTIONS]);

    useEffect(() => {
        if (skipNextQueryEffectRef.current) {
            skipNextQueryEffectRef.current = false;
            return;
        }
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

        setResults([]);

        const reqId = ++latestReqId.current;

        const t = setTimeout(() => {
            const normalizedQuery = aliasNormalize(query);

            const rawQuery = query.trim();
            const terms = rawQuery.split(',').map(s => s.trim()).filter(Boolean);

            const primeMode = /\bprime\b/i.test(rawQuery);

            const nameTerms = (searchMode === 'name')
                ? (terms.length ? terms : [rawQuery])
                : [rawQuery];

            const variants = nameTerms.flatMap(v => expandAliasToSymbolQueries(v));

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
                    const normQueries = nameTerms
                        .map(t => aliasNormalize(t))
                        .filter(Boolean);

                    arr = arr.filter(c => {
                        const nm = aliasNormalize(c.name);
                        return normQueries.some(nq => nm.includes(nq)); // match ANY comma term
                    });
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

    const { items: displayResults } = React.useMemo(() => {
        return takeFirstMatching(results);
    }, [results, filters]);

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
                        onClick={() => {
                            setDraftFilters(filters);
                            setShowAdvanced(true);
                        }}
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
                                                className={`era-btn ${draftFilters.eras[key] ? 'active' : ''}`}
                                                onClick={() =>
                                                    setDraftFilters(f => ({
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
                                {/* <div className="filter-group sets-dropdown">
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
                                                            className={`set-cube ${css} ${draftFilters.sets[key] ? 'darkon' : ''}`}
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
                                </div> */}
                                <div className="filter-group sets-dropdown">
                                    <h3 onClick={() => setShowSets(s => !s)}>Sets:</h3>
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
                                                <div className="sets-overlay" onClick={() => setShowSets(false)} />
                                                <div className="sets-grid">
                                                    {SET_OPTIONS.map(({ key, name, img, css }) => (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            className={`set-cube ${slugCss(name)} set-${key.toLowerCase()} ${draftFilters.sets[key] ? 'darkon' : ''}`}
                                                            onClick={() =>
                                                                setDraftFilters(f => ({
                                                                    ...f,
                                                                    sets: { ...f.sets, [key]: !f.sets[key] }
                                                                }))
                                                            }
                                                            aria-pressed={!!draftFilters.sets[key]}
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
                                                className={`type-btn ${draftFilters.supertypes[type] ? 'active' : ''} ${typeToClass(type)}`}
                                                style={{ '--typeIcon': TYPE_BG[type] ? `url("${TYPE_BG[type]}")` : 'none' }}
                                                onClick={() => {
                                                    setDraftFilters(f => ({
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
                                                className={`type-btn ${draftFilters.supertypes[type] ? 'active' : ''} ${typeToClass(type)}`}
                                                style={{ '--typeIcon': TYPE_BG[type] ? `url("${TYPE_BG[type]}")` : 'none' }}
                                                onClick={() => {
                                                    setDraftFilters(f => ({
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
                                                className={`type-btn ${draftFilters.mechanics[key] ? 'active' : ''}`}
                                                style={{
                                                    '--typeIcon': MECH_BG[key] ? `url("${MECH_BG[key]}")` : 'none'
                                                }}
                                                onClick={() => {
                                                    setDraftFilters(f => ({
                                                        ...f,
                                                        mechanics: { ...f.mechanics, [key]: !f.mechanics[key] }
                                                    }));
                                                }}
                                                aria-pressed={!!draftFilters.mechanics[key]}
                                            >
                                                {label}
                                            </button>
                                        ))}

                                        {/* Show more / Show less toggle */}
                                        <button
                                            type="button"
                                            className="type-btn mechanics-toggle"
                                            style={{ '--typeIcon': 'none' }}
                                            onClick={() => setShowMoreMechs(v => !v)}
                                            aria-expanded={showMoreMechs}
                                        >
                                            <span className="toggle-label">
                                                {showMoreMechs ? 'Show less' : 'Show more'}
                                            </span>
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
                                                className={`type-btn ${draftFilters.pokeTypes[key] ? 'active' : ''}`}
                                                style={{ '--typeIcon': `url("${img}")` }}
                                                onClick={() => {
                                                    setDraftFilters(f => ({
                                                        ...f,
                                                        pokeTypes: { ...f.pokeTypes, [key]: !f.pokeTypes[key] }
                                                    }));
                                                }}
                                                title={label}
                                                aria-pressed={!!draftFilters.pokeTypes[key]}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>Stage:</h3>
                                    <div className="stage-type-buttons">
                                        {(showMoreStages
                                            ? STAGE_OPTIONS
                                            : STAGE_OPTIONS.filter(s => STAGE_PRIMARY_KEYS.includes(s.key))
                                        ).map(({ key, label }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`type-btn ${(draftFilters.stage && draftFilters.stage[key]) ? 'active' : ''}`}
                                                style={{ '--typeIcon': 'none' }}
                                                onClick={() => {
                                                    setDraftFilters(f => {
                                                        const prev = f.stage || {};
                                                        return { ...f, stage: { ...prev, [key]: !prev[key] } };
                                                    });
                                                }}
                                                aria-pressed={!!(draftFilters.stage && draftFilters.stage[key])}
                                                title={label}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            className="type-btn mechanics-toggle"
                                            style={{ '--typeIcon': 'none' }}
                                            onClick={() => setShowMoreStages(v => !v)}
                                            aria-expanded={showMoreStages}
                                        >
                                            <span className="toggle-label">
                                                {showMoreStages ? 'Show less' : 'Show more'}
                                            </span>
                                            <span className="material-symbols-outlined" aria-hidden="true">
                                                {showMoreStages ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>HP:</h3>
                                    <div className="poke-type-buttons" style={{ gap: '0.5rem' }}>
                                        <select
                                            aria-label="HP comparison"
                                            value={(draftFilters.hp && draftFilters.hp.op) || 'eq'}
                                            onChange={(e) =>
                                                setDraftFilters(f => ({
                                                    ...f,
                                                    hp: { ...(f.hp || { op: 'eq', value: null }), op: e.target.value }
                                                }))
                                            }
                                            className="search-mode-dropdown"
                                            style={{ width: 100 }}
                                        >
                                            {HP_OPERATORS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>

                                        <select
                                            aria-label="HP value"
                                            value={Number.isFinite(Number(draftFilters.hp?.value)) ? Number(draftFilters.hp.value) : ''}
                                            onChange={(e) =>
                                                setDraftFilters(f => ({
                                                    ...f,
                                                    hp: {
                                                        ...(f.hp || { op: 'eq', value: null }),
                                                        value: e.target.value ? Number(e.target.value) : null
                                                    }
                                                }))
                                            }
                                            className="search-mode-dropdown"
                                            style={{ width: 100 }}
                                        >
                                            <option value="">All</option>
                                            {HP_VALUES.map(v => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>

                                        {Number.isFinite(Number(draftFilters.hp?.value)) && (
                                            <button
                                                type="button"
                                                className="type-btn clear-button-btn"
                                                style={{ '--typeIcon': 'none' }}
                                                onClick={() => setDraftFilters(f => ({ ...f, hp: { op: f.hp?.op || 'eq', value: null } }))}
                                            >
                                                Clear HP
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="buttons-row-modal flex-end">
                                    <button className='cancel-button' onClick={resetDraftAdvancedFilters}>
                                        Reset
                                    </button>
                                    <button
                                        className='save-button'
                                        onClick={() => {
                                            const noneActive =
                                                !Object.values(draftFilters.supertypes || {}).some(Boolean) &&
                                                !Object.values(draftFilters.sets || {}).some(Boolean) &&
                                                !Object.values(draftFilters.eras || {}).some(Boolean) &&
                                                !Object.values(draftFilters.mechanics || {}).some(Boolean) &&
                                                !Object.values(draftFilters.pokeTypes || {}).some(Boolean) &&
                                                !Object.values(draftFilters.stage || {}).some(Boolean) &&
                                                !Number.isFinite(Number((draftFilters.hp || {}).value));

                                            setFilters(draftFilters);
                                            setShowAdvanced(false);

                                            if (noneActive) {
                                                setResults([]);
                                                setQuery('');
                                                setSuppressDefault(true);
                                            }
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                                <div className="buttons-row-modal flex-end">
                                    <button
                                        className='save-button width-full'
                                        style={{ backgroundImage: 'linear-gradient(to bottom right, rgb(6, 174, 174), #1290eb, #1290eb)' }}
                                        disabled={!anyFilterActive(draftFilters)}
                                        onClick={async () => {
                                            try {
                                                setFilters(draftFilters);

                                                const payload = {
                                                    filters: {
                                                        supertypes: draftFilters.supertypes || {},
                                                        sets: draftFilters.sets || {},
                                                        eras: draftFilters.eras || {},
                                                        mechanics: draftFilters.mechanics || {},
                                                        pokeTypes: draftFilters.pokeTypes || {},
                                                        stage: draftFilters.stage || {},
                                                        hp: draftFilters.hp || { op: 'eq', value: null }
                                                    }
                                                };

                                                const resp = await fetch('/api/cards/filter-search', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(payload)
                                                });

                                                const list = resp.ok ? await resp.json() : [];
                                                skipNextQueryEffectRef.current = true;
                                                setSuppressDefault(true);
                                                setQuery('');
                                                setResults(Array.isArray(list) ? list : []);
                                                setShowAdvanced(false);
                                            } catch (e) {
                                                console.error('Search all failed:', e);
                                            }
                                        }}
                                        title="Fetch and show all cards that match your filters"
                                    >
                                        Search all
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
                                onClick={() => {
                                    setDraftFilters(filters);
                                    setShowAdvanced(true);
                                }}
                            style={{ pointerEvents: 'none' }}
                            >
                                Advanced Search
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>
                    <div className="all-cards-container">
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
