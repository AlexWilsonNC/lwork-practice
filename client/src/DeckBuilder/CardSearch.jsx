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
import mechCapEX from '../assets/icons/capital-ex.png';
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
import mechLegend from '../assets/icons/legend.png';
import mechDelta from '../assets/icons/ds.png';
import mechPlasma from '../assets/icons/plasma.png';
import mechSP from '../assets/icons/sp.png';
import mechUltraBeast from '../assets/icons/ub.png';
import mechRadiant from '../assets/icons/other-shiny.png';
import mechShining from '../assets/icons/shiny.png';

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
    { key: 'ex', label: 'ex' },
    { key: 'v', label: 'V' },
    { key: 'gx', label: 'GX' },
    { key: 'EX', label: 'EX' },
    { key: 'tera', label: 'Tera' },
    { key: 'ace spec', label: 'Ace Spec' },
    { key: 'mega', label: 'Mega' },
    { key: 'ancient', label: 'Ancient' },
    { key: 'future', label: 'Future' },
    { key: 'radiant', label: 'Radiant' },
    { key: 'fusion strike', label: 'Fusion Strike' },
    { key: 'rapid strike', label: 'Rapid Strike' },
    { key: 'single strike', label: 'Single Strike' },
    { key: 'prism', label: 'Prism' },
    { key: 'tag team', label: 'Tag Team' },
    { key: 'ultra beast', label: 'Ultra Beast' },
    { key: 'plasma', label: 'Team Plasma' },
    { key: 'legend', label: 'Legend' },
    { key: 'sp', label: 'SP' },
    { key: 'star', label: 'Gold Star' },
    { key: 'delta species', label: 'Delta Species' },
    { key: 'shining', label: 'Shining' },
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
    { value: 'ge', label: '≥' },
    { value: 'le', label: '≤' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
];
const HP_VALUES = Array.from({ length: 32 }, (_, i) => (i + 3) * 10);
const RETREAT_VALUES = [0, 1, 2, 3, 4, 5];
const ENERGY_ABBR_TO_FULL = {
    G: 'Grass',
    R: 'Fire',
    W: 'Water',
    L: 'Lightning',
    P: 'Psychic',
    F: 'Fighting',
    D: 'Darkness',
    M: 'Metal',
    Y: 'Fairy',
    C: 'Colorless',
};
const ENERGY_OPTIONS = Object.entries(ENERGY_ABBR_TO_FULL).map(([abbr, label]) => ({ abbr, label }));
const ENERGY_ABBR_TO_IMG = {
    G: typeGrass,
    R: typeFire,
    W: typeWater,
    L: typeLightning,
    P: typePsychic,
    F: typeFighting,
    D: typeDark,
    M: typeMetal,
    Y: typeFairy,
    C: typeColorless,
};
const RARITY_PRIMARY = [
    'Common', 'Uncommon', 'Rare', 'Double Rare',
    'Ultra Rare', 'Secret Rare', 'Illustration Rare',
];

const RARITY_ALL = [
    ...RARITY_PRIMARY,
    'Rainbow Rare', 'Rare Secret',
    'Holo Rare V', 'Special Illustration Rare',
    'Rare Holo GX', 'Rare Holo ex', 'Holo Rare VMAX',
    'Hyper Rare', 'Rare Holo LV.X',
    'Holo Rare VSTAR', 'Radiant Rare', 'Amazing Rare', 'Black White Rare',
    'Trainer Gallery'
];

const RARITY_TO_PATTERNS = {
    'Common': [/^Common$/i],
    'Uncommon': [/^Uncommon$/i],
    'Rare': [/^Rare$/i],
    'Double Rare': [/^Double Rare$/i],
    'Ultra Rare': [/^Ultra Rare$/i, /^Rare Ultra$/i],
    'Secret Rare': [/^Rare Secret$/i, /^rare rainbow$/i, /^Hyper Rare$/i, /Secret Rare/i],
    'Illustration Rare': [/^Illustration Rare$/i],
    'Rainbow Rare': [/^rare rainbow$/i],
    'Rare Secret': [/^Rare Secret$/i],
    'Holo Rare V': [/^Holo Rare V$/i, /^Rare Holo V$/i],
    'Special Illustration Rare': [/^Special Illustration Rare$/i],
    'Rare Holo GX': [/^Rare Holo GX$/i],
    'Rare Holo ex': [/^Rare Holo ex$/i],
    'Holo Rare VMAX': [/^Holo Rare VMAX$/i, /^Rare Holo VMAX$/i],
    'Hyper Rare': [/^Hyper Rare$/i],
    'Rare Holo LV.X': [/^Rare Holo LV\.?X$/i],
    'Holo Rare VSTAR': [/^Holo Rare VSTAR$/i, /^Rare Holo VSTAR$/i],
    'Radiant Rare': [/^Radiant Rare$/i],
    'Amazing Rare': [/^Amazing Rare$/i],
    'Black White Rare': [/^Black White Rare$/i],
    'Trainer Gallery': [/trainer[^a-z0-9]*gallery/i],
};

const MECH_BG = {
    'ex': mechEX,
    'EX': mechCapEX,
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
    'legend': mechLegend,
    'delta species': mechDelta,
    'plasma': mechPlasma,
    'sp': mechSP,
    'ultra beast': mechUltraBeast,
    'radiant': mechRadiant,
    'shining': mechShining,
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

    const MECH_PRIMARY_KEYS = ['ex', 'EX', 'v', 'gx', 'tera', 'ace spec', 'mega'];
    const [showMoreMechs, setShowMoreMechs] = useState(false);
    const [showMoreStages, setShowMoreStages] = useState(false);
    const [showEnergyMenu, setShowEnergyMenu] = useState(false);
    const [showMoreRarity, setShowMoreRarity] = useState(false);
    const setsInputFocusedRef = useRef(false);
    const [selectedQuickFormat, setSelectedQuickFormat] = useState('');

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
        'diamond & pearl': 'DP1',
        'diamond and pearl': 'DP1',
        'diamond pearl': 'DP1',
        'platinum': 'DP1',
        'ex': 'RS1',
        'ex series': 'RS1',
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

    function anyFilterActive(f) {
        const basic =
            Object.values(f.supertypes || {}).some(Boolean) ||
            Object.values(f.sets || {}).some(Boolean) ||
            Object.values(f.eras || {}).some(Boolean) ||
            Object.values(f.mechanics || {}).some(Boolean) ||
            Object.values(f.pokeTypes || {}).some(Boolean) ||
            Object.values(f.stage || {}).some(Boolean) ||
            (f.hp && f.hp.value !== '' && f.hp.value !== null) ||
            Object.values(f.has || {}).some(Boolean) ||
            (f.artist && String(f.artist).trim() !== '') ||
            Object.values(f.rarity || {}).some(Boolean)

        const retreatActive = f.retreat && f.retreat.value !== '' && f.retreat.value !== null;

        const attackValActive = f.attackCost && f.attackCost.value !== '' && f.attackCost.value !== null;
        const attackEnergyActive = f.attackCost && f.attackCost.energies &&
            Object.values(f.attackCost.energies).some(Boolean);

        const formatActive = f.formatRange && f.formatRange.from && f.formatRange.to;

        return basic || retreatActive || attackValActive || attackEnergyActive || formatActive || f.includePromos;
    }

    function buildFiltersForRequest(f) {
        const out = {
            supertypes: f.supertypes || {},
            sets: f.sets || {},
            eras: f.eras || {},
            mechanics: f.mechanics || {},
            pokeTypes: f.pokeTypes || {},
            stage: f.stage || {},
            hp: f.hp || { op: 'eq', value: '' },
            has: f.has || {},
            retreat: f.retreat || { op: 'eq', value: '' },
            attackCost: f.attackCost || { op: 'eq', value: '', energies: {} }
        };
        if (f.artist && String(f.artist).trim() !== '') {
            out.artist = String(f.artist).trim();
        }

        if (f.formatRange?.from && f.formatRange?.to) {
            const fi = setOrder.indexOf(f.formatRange.from);
            const ti = setOrder.indexOf(f.formatRange.to);
            if (fi !== -1 && ti !== -1) {
                const lo = Math.min(fi, ti);
                const hi = Math.max(fi, ti);
                const rangeKeys = setOrder.slice(lo, hi + 1);

                let mergedSets = { ...(out.sets || {}) };
                for (const key of rangeKeys) mergedSets[key] = true;

                if (f.includePromos) {
                    const withPromos = addPromosForRange(new Set(Object.keys(mergedSets)));
                    mergedSets = Object.fromEntries(Array.from(withPromos).map(k => [k, true]));
                }

                out.sets = mergedSets;
            }
        }

        if (f.rarity && Object.values(f.rarity).some(Boolean)) {
            const picked = {};
            for (const [k, v] of Object.entries(f.rarity)) if (v) picked[k] = true;
            out.rarity = picked;
        }
        return trimEmptyFilters(out);
    }

    function trimEmptyFilters(f) {
        const g = { ...f };
        if (!g.hp || g.hp.value === '' || g.hp.value === null) delete g.hp;
        if (!g.has || !Object.values(g.has).some(Boolean)) delete g.has;
        if (!g.retreat || g.retreat.value === '' || g.retreat.value === null) delete g.retreat;
        const ac = g.attackCost;
        const acValOn = ac && ac.value !== '' && ac.value !== null;
        const acEOn = ac && ac.energies && Object.values(ac.energies).some(Boolean);
        if (!acValOn && !acEOn) delete g.attackCost;
        if (!g.supertypes || !Object.values(g.supertypes).some(Boolean)) delete g.supertypes;
        if (!g.sets || !Object.values(g.sets).some(Boolean)) delete g.sets;
        if (!g.eras || !Object.values(g.eras).some(Boolean)) delete g.eras;
        if (!g.mechanics || !Object.values(g.mechanics).some(Boolean)) delete g.mechanics;
        if (!g.pokeTypes || !Object.values(g.pokeTypes).some(Boolean)) delete g.pokeTypes;
        if (!g.stage || !Object.values(g.stage).some(Boolean)) delete g.stage;
        return g;
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
    function getSubtypesRaw(card) {
        const raw = Array.isArray(card.subtypes) ? card.subtypes
            : Array.isArray(card.subtype) ? card.subtype
                : typeof card.subtypes === 'string' ? [card.subtypes]
                    : typeof card.subtype === 'string' ? [card.subtype]
                        : [];
        return raw.map(s => (s ?? '').toString());
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
                    if (hasSub('prism star') || /[♢◆]/.test(nm)) return true;
                    break;
                case 'ex': {
                    if (st !== 'pokemon') break;
                    const rawSubs = getSubtypesRaw(card);
                    if (rawSubs.some(s => s === 'ex')) return true;
                    break;
                }
                case 'EX': {
                    if (st !== 'pokemon') break;
                    const rawSubs = getSubtypesRaw(card);
                    if (rawSubs.some(s => s === 'EX')) return true;
                    break;
                }
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
                case 'legend':
                    if (st === 'pokemon' && (hasSub('legend') || /\blegend\b/i.test(nm))) return true;
                    break;
                case 'delta species':
                    if (st === 'pokemon' && (hasSub('delta species') || /δ/.test(nm))) return true;
                    break;
                case 'plasma':
                    if (st === 'pokemon' && (hasSub('team plasma'))) return true;
                    break;
                case 'ultra beast':
                    if (st === 'pokemon' && (hasSub('ultra beast'))) return true;
                    break;
                case 'radiant':
                    if (st === 'pokemon' && (hasSub('radiant'))) return true;
                    break;
                case 'shining':
                    if (st === 'pokemon' && /\bshining\b/i.test(nm)) return true;
                    break;
                case 'sp':
                    if (st === 'pokemon' && (hasSub('sp'))) return true;
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

    function compareByOp(x, v, op) {
        switch (op) {
            case 'gt': return x > v;
            case 'ge': return x >= v;
            case 'lt': return x < v;
            case 'le': return x <= v;
            case 'eq':
            default: return x === v;
        }
    }

    function parseAttackCostText(text = '') {
        const raw = String(text || '').toUpperCase().trim();

        const m = raw.match(/\d+/);
        const num = m ? Number(m[0]) : '';

        const energies = {};
        for (const ch of raw.replace(/\d+/g, '').replace(/[^A-Z]/g, '')) {
            if ('GRWLPFDMYC'.includes(ch)) energies[ch] = true;
        }
        return { value: num, energies };
    }

    function buildAttackCostText(ac = {}) {
        const parts = [];
        if (ac.value !== '' && ac.value != null) parts.push(String(ac.value));
        const picks = Object.keys(ac.energies || {}).filter(k => ac.energies[k]);
        if (picks.length) parts.push(picks.join(''));
        return parts.join(' ').trim();
    }

    function matchesSelectedRetreat(card, retreat) {
        if (!retreat || retreat.value === '' || retreat.value === null) return true;
        const st = (card.supertype || '').toLowerCase();
        if (!/pokémon|pokemon/.test(st)) return false;

        const crc = Number(card.convertedRetreatCost ?? card.retreatCost?.length ?? 0) || 0;
        const v = Number(retreat.value);
        return compareByOp(crc, v, retreat.op || 'eq');
    }

    function typeToAbbr(s) {
        const t = String(s || '').toLowerCase();
        const map = {
            grass: 'G', fire: 'R', water: 'W', lightning: 'L', electric: 'L',
            psychic: 'P', fighting: 'F', darkness: 'D', dark: 'D',
            metal: 'M', steel: 'M', fairy: 'Y', colorless: 'C'
        };
        return map[t] || '';
    }

    function attackHasEnergies(attack, energiesObj) {
        const required = Object.entries(energiesObj || {})
            .filter(([, on]) => !!on)
            .map(([abbr]) => abbr.toUpperCase());
        if (!required.length) return true;

        const have = new Set((attack?.cost || []).map(typeToAbbr).filter(Boolean));
        return required.every(r => have.has(r));
    }

    function matchesSelectedAttackCost(card, attackCost) {
        if (!attackCost) return true;
        const valActive = attackCost.value !== '' && attackCost.value !== null;
        const energyActive = attackCost.energies && Object.values(attackCost.energies).some(Boolean);
        if (!valActive && !energyActive) return true;

        const v = Number(attackCost.value);
        const op = attackCost.op || 'eq';
        const attacks = Array.isArray(card.attacks) ? card.attacks : [];
        return attacks.some(a => {
            let ok = true;
            if (valActive) ok = compareByOp(Number(a.convertedEnergyCost || a.cost?.length || 0), v, op);
            if (ok && energyActive) ok = attackHasEnergies(a, attackCost.energies);
            return ok;
        });
    }

    function matchesSelectedHas(card, selected = {}) {
        const active = Object.keys(selected).filter(k => selected[k]);
        if (active.length === 0) return true;

        const st = getSupertype(card);
        const abilArr = Array.isArray(card.abilities)
            ? card.abilities
            : (card.ability ? [card.ability] : []);
        const abilTypes = abilArr
            .map(a => (a?.type || ''))
            .map(s => N(s));

        const hasAbilityType = (needle) =>
            abilTypes.some(t => t.includes(N(needle)));

        for (const k of active) {
            switch (k) {
                case 'Ability':
                    if (st === 'pokemon' && hasAbilityType('ability')) return true;
                    break;
                case 'Poké-Power':
                    if (st === 'pokemon' && (hasAbilityType('poké-power') || hasAbilityType('poke-power') || hasAbilityType('pokemon power'))) return true;
                    break;
                case 'Poké-Body':
                    if (st === 'pokemon' && hasAbilityType('poké-body')) return true;
                    break;
                case 'Ancient Trait': {
                    if (st !== 'pokemon') break;
                    const rulesArr = Array.isArray(card.rules)
                        ? card.rules
                        : (typeof card.rules === 'string' ? [card.rules] : []);
                    const rulesText = rulesArr.join(' ').toLowerCase();
                    if (hasAncientTrait(card) || rulesText.includes('ancient trait')) return true;
                    break;
                }
                case 'Rule Box': {
                    const arr = Array.isArray(card.rules)
                        ? card.rules
                        : (typeof card.rules === 'string' ? [card.rules] : []);
                    const hasRuleBox = arr.some(r => /\brule\s*:/i.test(String(r || '')));
                    if (hasRuleBox) return true;
                    break;
                }
                case 'Dual Type': {
                    if (st !== 'pokemon') break;
                    const n = getCardPokeTypes(card).length;
                    if (n >= 2) return true;
                    break;
                }
                case 'Held Item': {
                    if (st !== 'pokemon') break;
                    const held =
                        card.heldItem ?? card.helditem ?? card['held item'] ?? false;
                    if (held === true || String(held).toLowerCase() === 'true') return true;
                    break;
                }
                default:
                    break;
            }
        }
        return false;
    }

    function matchesArtist(card, artistInput) {
        const q = String(artistInput || '').trim();
        if (!q) return true;
        const have = String(card.artist || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const want = q.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return have.includes(want);
    }

    function matchesSelectedRarity(card, selected = {}) {
        const active = Object.keys(selected || {}).filter(k => selected[k]);
        if (active.length === 0) return true;

        const r = String(card.rarity || '');
        const setName = String(card.set?.name || '');
        const num = String(card.number || '');
        const tgRx = /trainer[^a-z0-9]*gallery/i;

        return active.some(key => {
            if (key === 'Trainer Gallery') {
                if (tgRx.test(r)) return true;
                if (tgRx.test(setName)) return true;
                if (/^TG\d+/i.test(num)) return true;
                return false;
            }
            const pats = RARITY_TO_PATTERNS[key] || [new RegExp(`^${key}$`, 'i')];
            return pats.some(rx => rx.test(r));
        });
    }

    const ERA_PATTERNS = {
        SV1: /^(SV|SVI|PAL|OBF|MEW|PAR|PAF|TEF|TWM|SFA|SCR|SSP|PRE|JTG|DRI|WHT|BLK|MEG)/i,
        SSH1: /^(SWSH|SSH|RCL|DAA|CPA|VIV|SHF|BST|CRE|EVS|FST|BRS|ASR|LOR|SIT|CRZ)/i,
        SM1: /^(SM|SUM|GRI|BUS|CIN|UPR|FLI|CES|LOT|TEU|UNB|UNM|CEC|DRM|HIF|DET|TM)/i,
        XY1: /^(XY|FLF|FFI|PHF|PRC|ROS|AOR|BKT|BKP|FCO|STS|EVO|GEN)/i,
        BW1: /^(BW|NVI|EPO|DEX|DRX|BCR|PLS|PLF|PLB|LTR)/i,
        HGSS1: /^(HGSS|HS|UL|UD|TM|CL)/i,
        DP1: /^(DP|MT|SW|GE|MD|LA|SF|PL)/i,
        RS1: /^(RS|SS|DR|MA|HL|TRR|DX|EM|UF|DS|LM|HP|CG|DF|PK)/i,
        WOTC: /^(BS|JU|FO|G[12]|N[1-4]|LC|E[1-3])\/?/i
    };

    const setIndexMap = React.useMemo(
        () => Object.fromEntries(setOrder.map((k, i) => [k, i])),
        []
    );

    const WORLDS_FORMATS = [
        { label: '2025 Worlds', from: 'SVI', to: 'BLK' },
        { label: '2024 Worlds', from: 'BRS', to: 'SFA' },
        { label: '2023 Worlds', from: 'BST', to: 'PAL' },
        { label: '2022 Worlds', from: 'SSH', to: 'PGO' },
        { label: '2019 Worlds', from: 'UPR', to: 'UNM' },
        { label: '2018 Worlds', from: 'BKT', to: 'CES' },
        { label: '2017 Worlds', from: 'PRC', to: 'BUS' },
        { label: '2016 Worlds', from: 'XY', to: 'STS' },
        { label: '2015 Worlds', from: 'BCR', to: 'ROS' },
        { label: '2014 Worlds', from: 'NXD', to: 'FLF' },
        { label: '2013 Worlds', from: 'BLW', to: 'PLF' },
        { label: '2012 Worlds', from: 'HS', to: 'DEX' },
        { label: '2011 Worlds', from: 'HS', to: 'BLW' },
        { label: '2010 Worlds', from: 'DP', to: 'UL' },
        { label: '2009 Worlds', from: 'DP', to: 'RR' },
        { label: '2008 Worlds', from: 'HP', to: 'MD' },
        { label: '2007 Worlds', from: 'DX', to: 'DP' },
        { label: '2006 Worlds', from: 'HL', to: 'HP' },
        { label: '2005 Worlds', from: 'RS', to: 'EM' },
        { label: '2004 Worlds', from: 'EX', to: 'HL' },
    ];

    const POPULAR_FORMATS = [
        { label: '2017 NAIC', from: 'PRC', to: 'GRI' },
        { label: 'SUM-LOT', from: 'SUM', to: 'LOT' },
        { label: 'RS-PK', from: 'RS', to: 'PK' },
    ];

    // TODO: replace promo set codes below with YOUR actual promo abbrevs (e.g., 'WOTC-P', 'NP', 'DP-P', etc.).
    const PROMO_RULES = [
        { label: 'Wizards Black Star Promos', mainFrom: 'BS', mainTo: 'SK', promoKey: 'WOTC-P' },
        { label: 'Nintendo Black Star Promos', mainFrom: 'RS', mainTo: 'PK', promoKey: 'NP' },
        { label: 'DP Black Star Promos', mainFrom: 'DP', mainTo: 'AR', promoKey: 'DP-P' },
        { label: 'HGSS Black Star Promos', mainFrom: 'HS', mainTo: 'CL', promoKey: 'HSP' },
        { label: 'BW Black Star Promos', mainFrom: 'BLW', mainTo: 'LTR', promoKey: 'BWP' },
        { label: 'XY Black Star Promos', mainFrom: 'XY', mainTo: 'EVO', promoKey: 'XYP' },
        { label: 'SM Black Star Promos', mainFrom: 'SUM', mainTo: 'CEC', promoKey: 'SMP' },
        { label: 'SWSH Black Star Promos', mainFrom: 'SSH', mainTo: 'CRZ', promoKey: 'SWSHP' },
        { label: 'SV Black Star Promos', mainFrom: 'SVI', mainTo: 'MEG', promoKey: 'SVP' },
    ];

    const PROMO_SET_KEYS = new Set(PROMO_RULES.map(p => p.promoKey));

    const SET_OPTIONS_SORTED_NO_PROMOS = React.useMemo(() => {
        const safeIdx = k => (setIndexMap[k] ?? Number.MAX_SAFE_INTEGER);
        return SET_OPTIONS
            .filter(o => !PROMO_SET_KEYS.has(o.key))
            .sort((a, b) => safeIdx(a.key) - safeIdx(b.key));
    }, [SET_OPTIONS, setIndexMap]);

    // Inclusive range check
    const isAbbrevInRange = (abbr, fromKey, toKey) => {
        const ai = setIndexMap[abbr];
        const fi = setIndexMap[fromKey];
        const ti = setIndexMap[toKey];
        if (ai == null || fi == null || ti == null) return false;
        const lo = Math.min(fi, ti);
        const hi = Math.max(fi, ti);
        return ai >= lo && ai <= hi;
    };

    // Given a set of included main-set keys, add matching promos based on PROMO_RULES
    function addPromosForRange(selectedKeysSet) {
        const keys = new Set(selectedKeysSet);
        for (const rule of PROMO_RULES) {
            // If any main set from the block is present, include the promo key
            const fi = setIndexMap[rule.mainFrom];
            const ti = setIndexMap[rule.mainTo];
            if (fi === -1 || ti === -1 || fi == null || ti == null) continue;
            const lo = Math.min(fi, ti), hi = Math.max(fi, ti);
            const hit = Array.from(keys).some(k => {
                const ki = setIndexMap[k];
                return ki != null && ki >= lo && ki <= hi;
            });
            if (hit && rule.promoKey) keys.add(rule.promoKey);
        }
        return keys;
    }

    function takeFirstMatching(arr, limit = Number.POSITIVE_INFINITY) {
        const out = [];

        for (let i = 0; i < arr.length; i++) {
            const card = arr[i];

            if (!inSelectedEras(card, filters.eras)) continue;

            const setsChecked = Object.values(filters.sets).some(Boolean);
            if (setsChecked && !filters.sets[card.setAbbrev]) continue;

            const fr = filters.formatRange?.from;
            const to = filters.formatRange?.to;
            if (fr && to && !isAbbrevInRange(card.setAbbrev, fr, to)) continue;

            if (!matchesSelectedTypes(card, filters.supertypes)) continue;
            if (!matchesSelectedMechanics(card, filters.mechanics)) continue;
            if (!matchesSelectedPokeTypes(card, filters.pokeTypes)) continue;
            if (!matchesSelectedStage(card, filters.stage)) continue;
            if (!matchesSelectedHP(card, filters.hp)) continue;
            if (!matchesSelectedHas(card, filters.has)) continue;
            if (!matchesSelectedRetreat(card, filters.retreat)) continue;
            if (!matchesSelectedAttackCost(card, filters.attackCost)) continue;
            if (!matchesSelectedRarity(card, filters.rarity)) continue;
            if (!matchesArtist(card, filters.artist)) continue;

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
        hp: { op: 'eq', value: null },
        has: {},
        retreat: { op: 'eq', value: '' },
        attackCost: { op: 'eq', value: '', energies: {} },
        artist: '',
        rarity: {},
        formatRange: { from: '', to: '' },
        includePromos: false
    }), [ERA_OPTIONS]);

    const [filters, setFilters] = useState(emptyFilters);

    const [draftFilters, setDraftFilters] = useState(emptyFilters);

    const attackCostText = React.useMemo(
        () => buildAttackCostText(draftFilters.attackCost),
        [draftFilters.attackCost]
    );

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
        setSelectedQuickFormat('');
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

        s = s.replace(/[-–—·•'._/]/g, '');

        s = s.replace(/\s+/g, '');

        return s;
    }

    function expandAliasToSymbolQueries(q) {
        const base = String(q || '').trim();
        const variants = new Set([base]);

        let sym = base.toLowerCase();
        sym = sym.replace(/\bprism\s*star\b/g, '♢');
        sym = sym.replace(/\bgold\s*star\b/g, '★');
        sym = sym.replace(/\bdelta\s*species\b/g, 'δ');
        sym = sym.replace(/\bprism\b/g, '♢');
        sym = sym.replace(/\bstar\b/g, '★');
        sym = sym.replace(/\bdelta\b/g, 'δ');
        sym = sym.replace(/\bspecies\b/g, 'δ');
        if (sym !== base.toLowerCase()) variants.add(sym);

        const SUFFIX_MAP = {
            'ex': 'EX',
            'gx': 'GX',
            'v': 'V',
            'vmax': 'VMAX',
            'vstar': 'VSTAR',
            'lv.x': 'LV.X',
            'lvx': 'LV.X',
            'lv x': 'LV.X',
        };

        const tokens = base.split(/\s+/).filter(Boolean);
        if (tokens.length >= 2) {
            const lastRaw = tokens[tokens.length - 1];
            const stem = tokens.slice(0, -1).join(' ');
            const key = lastRaw.toLowerCase().replace(/\./g, '');
            const cap = SUFFIX_MAP[key];

            if (cap) {
                variants.add(`${stem}-${cap}`);
                variants.add(`${stem} ${cap}`);
                variants.add(`${stem}-${key.toUpperCase()}`);
            }

            const secondLast = tokens[tokens.length - 2];
            if (/^ho$/i.test(secondLast) && /^oh$/i.test(lastRaw)) {
                variants.add('Ho-Oh');
                variants.add('Ho oh');
                variants.add('Hooh');
            }
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
                        return normQueries.some(nq => nm.includes(nq));
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
                const fr = draftFilters.formatRange?.from;
                const to = draftFilters.formatRange?.to;
                if (fr && to) {
                    arr = arr.filter(c => isAbbrevInRange(c.setAbbrev, fr, to));
                }
                setResults(arr);
            }).catch(() => setResults([]));
        }, 300)

        return () => clearTimeout(t)
    }, [query, defaultCards, searchMode])

    const { items: displayResults } = React.useMemo(() => {
        return takeFirstMatching(results);
    }, [results, filters]);

    const SET_NAME_TO_KEY = React.useMemo(() => {
        const m = {};
        for (const { key, name } of SET_OPTIONS) {
            m[name.toLowerCase()] = key;
            m[key.toLowerCase()] = key;
        }
        return m;
    }, [SET_OPTIONS]);

    const [setsInput, setSetsInput] = useState('');

    useEffect(() => {
        if (setsInputFocusedRef.current) return;
        const selected = Object.entries(draftFilters.sets || {})
            .filter(([, on]) => on)
            .map(([k]) => k);
        setSetsInput(selected.join(', '));
    }, [draftFilters.sets]);

    const applySetsFromInput = React.useCallback((raw) => {
        const tokens = String(raw || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        const picked = {};
        for (const t of tokens) {
            const key = SET_NAME_TO_KEY[t.toLowerCase()];
            if (key) picked[key] = true;
        }
        setDraftFilters(f => ({ ...f, sets: picked }));
    }, [SET_NAME_TO_KEY, setDraftFilters]);

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
                                <div className="filter-group">
                                    <h3>Sets:</h3>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            className='type-btn non-bold-typebtn hp-btn-dropdown'
                                            aria-label="Add a set"
                                            onChange={(e) => {
                                                const key = e.target.value;
                                                if (!key) return;
                                                const current = setsInput.split(',').map(s => s.trim()).filter(Boolean);
                                                if (!current.some(t => t.toLowerCase() === key.toLowerCase())) {
                                                    const next = current.concat([key]).join(', ');
                                                    setSetsInput(next);
                                                    applySetsFromInput(next);
                                                }
                                                e.target.value = '';
                                            }}
                                            style={{ padding: '8px', minWidth: 220 }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a set…</option>
                                            {SET_OPTIONS.map(({ key, name }) => (
                                                <option key={key} value={key}>
                                                    {name} ({key})
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            placeholder="Type set codes or names, comma-separated (e.g., PAF, OBF)"
                                            className='type-btn non-bold-typebtn'
                                            value={setsInput}
                                            onFocus={() => { setsInputFocusedRef.current = true; }}
                                            onBlur={(e) => {
                                                setsInputFocusedRef.current = false;
                                                applySetsFromInput(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    applySetsFromInput(setsInput);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setSetsInput(e.target.value);
                                            }}
                                            style={{ flex: 1, minWidth: 280, padding: '8px' }}
                                        />

                                        <button
                                            type="button"
                                            className="type-btn non-bold-typebtn"
                                            onClick={() => {
                                                setSetsInput('');
                                                applySetsFromInput('');
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>Format:</h3>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            className="type-btn non-bold-typebtn hp-btn-dropdown"
                                            value={selectedQuickFormat}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                if (!v) return;
                                                const [from, to] = v.split('|');
                                                setDraftFilters(f => ({ ...f, formatRange: { from, to } }));
                                                setSelectedQuickFormat(v);
                                            }}
                                            style={{ minWidth: 290 }}
                                        >
                                            <option value="" disabled style={{ opacity: 0.55 }}>
                                                Select a quick format…
                                            </option>

                                            <optgroup label="Worlds Championships">
                                                {WORLDS_FORMATS.map(({ label, from, to }) => (
                                                    <option key={label} value={`${from}|${to}`}>
                                                        {label} ({from}–{to})
                                                    </option>
                                                ))}
                                            </optgroup>

                                            <optgroup label="Other Popular Formats">
                                                {POPULAR_FORMATS.map(({ label, from, to }) => (
                                                    <option key={label} value={`${from}|${to}`}>
                                                        {label} ({from}–{to})
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>

                                        {/* <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <input
                                                type="checkbox"
                                                checked={!!draftFilters.includePromos}
                                                onChange={(e) => setDraftFilters(f => ({ ...f, includePromos: e.target.checked }))}
                                            />
                                            <span>Include promos? <span style={{ opacity: 0.7 }}>
                                                Some legalities may be inaccurate; preselected formats are more accurate.
                                            </span></span>
                                        </label> */}
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3></h3>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            className={`type-btn non-bold-typebtn hp-btn-dropdown ${draftFilters.formatRange?.from ? '' : 'is-placeholder'}`}
                                            value={draftFilters.formatRange?.from || ''}
                                            onChange={(e) => setDraftFilters(f => ({ ...f, formatRange: { ...(f.formatRange || {}), from: e.target.value } }))}
                                            style={{ minWidth: 220, color: draftFilters.formatRange?.from ? 'inherit' : 'rgba(255,255,255,0.55)' }}
                                        >
                                            <option value="" disabled>Select first set…</option>
                                            {SET_OPTIONS_SORTED_NO_PROMOS.map(({ key, name }) => (
                                                <option key={key} value={key}>{name} ({key})</option>
                                            ))}
                                        </select>

                                        <label style={{ opacity: 0.85 }}>through</label>

                                        <select
                                            className={`type-btn non-bold-typebtn hp-btn-dropdown ${draftFilters.formatRange?.to ? '' : 'is-placeholder'}`}
                                            value={draftFilters.formatRange?.to || ''}
                                            onChange={(e) => setDraftFilters(f => ({ ...f, formatRange: { ...(f.formatRange || {}), to: e.target.value } }))}
                                            style={{ minWidth: 220, color: draftFilters.formatRange?.to ? 'inherit' : 'rgba(255,255,255,0.55)' }}
                                        >
                                            <option value="" disabled>Select second set…</option>
                                            {SET_OPTIONS_SORTED_NO_PROMOS.map(({ key, name }) => (
                                                <option key={key} value={key}>{name} ({key})</option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            className="type-btn non-bold-typebtn"
                                            onClick={() => {
                                                setSelectedQuickFormat('');
                                                setDraftFilters(f => ({ ...f, formatRange: { from: '', to: '' } }))
                                            }
                                            }
                                        >
                                            Clear
                                        </button>
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
                                        <button
                                            type="button"
                                            className="type-btn mechanics-toggle non-bold-typebtn"
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
                                    <h3>Stage:</h3>
                                    <div className="stage-type-buttons">
                                        {(showMoreStages
                                            ? STAGE_OPTIONS
                                            : STAGE_OPTIONS.filter(s => STAGE_PRIMARY_KEYS.includes(s.key))
                                        ).map(({ key, label }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`type-btn non-bold-typebtn ${(draftFilters.stage && draftFilters.stage[key]) ? 'active' : ''}`}
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
                                            className="type-btn non-bold-typebtn mechanics-toggle"
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
                                    <h3>Has:</h3>
                                    <div className="stage-type-buttons">
                                        {['Ability', 'Rule Box', 'Ancient Trait', 'Poké-Power', 'Poké-Body', 'Dual Type', 'Held Item'].map(label => (
                                            <button
                                                key={label}
                                                type="button"
                                                className={`type-btn non-bold-typebtn ${draftFilters.has?.[label] ? 'active' : ''}`}
                                                onClick={() =>
                                                    setDraftFilters(f => ({
                                                        ...f,
                                                        has: { ...(f.has || {}), [label]: !f.has?.[label] }
                                                    }))
                                                }
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>HP:</h3>
                                    <div className="poke-type-buttons">
                                        <select
                                            aria-label="HP comparison"
                                            value={(draftFilters.hp && draftFilters.hp.op) || 'eq'}
                                            onChange={(e) =>
                                                setDraftFilters(f => ({
                                                    ...f,
                                                    hp: { ...(f.hp || { op: 'eq', value: null }), op: e.target.value }
                                                }))
                                            }
                                            className="type-btn non-bold-typebtn hp-btn-dropdown"
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
                                            className="type-btn non-bold-typebtn hp-btn-dropdown"
                                            style={{ width: 100 }}
                                        >
                                            <option value="">Any</option>
                                            {HP_VALUES.map(v => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>

                                        {/* {Number.isFinite(Number(draftFilters.hp?.value)) && (
                                            <button
                                                type="button"
                                                className="type-btn non-bold-typebtn clear-button-btn"
                                                style={{ '--typeIcon': 'none' }}
                                                onClick={() => setDraftFilters(f => ({ ...f, hp: { op: f.hp?.op || 'eq', value: null } }))}
                                            >
                                                Reset HP
                                            </button>
                                        )} */}
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>Retreat:</h3>
                                    <div className="poke-type-buttons">
                                        <select
                                            value={draftFilters.retreat?.op || 'eq'}
                                            className='type-btn non-bold-typebtn hp-btn-dropdown'
                                            onChange={(e) => setDraftFilters(f => ({ ...f, retreat: { ...(f.retreat || {}), op: e.target.value } }))}
                                        >
                                            {HP_OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        <select
                                            value={draftFilters.retreat?.value ?? ''}
                                            className='type-btn non-bold-typebtn hp-btn-dropdown'
                                            onChange={(e) => setDraftFilters(f => ({ ...f, retreat: { ...(f.retreat || {}), value: e.target.value === '' ? '' : Number(e.target.value) } }))}
                                        >
                                            <option value="">Any</option>
                                            {RETREAT_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        {/* <button
                                            onClick={() => setDraftFilters(f => ({ ...f, retreat: { op: 'eq', value: '' } }))}
                                            className='type-btn non-bold-typebtn'
                                        >Reset</button> */}
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h3>Attack Cost:</h3>
                                    <div className="poke-type-buttons" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            value={draftFilters.attackCost?.op || 'eq'}
                                            className='type-btn non-bold-typebtn hp-btn-dropdown'
                                            onChange={(e) =>
                                                setDraftFilters(f => ({ ...f, attackCost: { ...(f.attackCost || {}), op: e.target.value } }))
                                            }
                                        >
                                            {HP_OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="# or energy type >"
                                                className="type-btn non-bold-typebtn"
                                                style={{ width: 180 }}
                                                value={attackCostText}
                                                onChange={(e) => {
                                                    const parsed = parseAttackCostText(e.target.value);
                                                    setDraftFilters(f => ({
                                                        ...f,
                                                        attackCost: {
                                                            ...(f.attackCost || { op: 'eq' }),
                                                            value: parsed.value,
                                                            energies: parsed.energies
                                                        }
                                                    }));
                                                }}
                                            />
                                            <div
                                                className="energy-picker"
                                                style={{ position: 'relative' }}
                                                tabIndex={-1}
                                                onBlur={(e) => {
                                                    if (!e.currentTarget.contains(e.relatedTarget)) setShowEnergyMenu(false);
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="type-btn non-bold-typebtn hp-btn-dropdown"
                                                    onClick={() => setShowEnergyMenu(v => !v)}
                                                    aria-haspopup="listbox"
                                                    aria-expanded={showEnergyMenu}
                                                >
                                                    Add energy
                                                    <span className="material-symbols-outlined" aria-hidden>expand_more</span>
                                                </button>

                                                {showEnergyMenu && (
                                                    <div
                                                        role="listbox"
                                                        className="energy-menu"
                                                        style={{
                                                            position: 'absolute',
                                                            zIndex: 20,
                                                            top: '100%',
                                                            left: 0,
                                                            marginTop: 4,
                                                            background: 'var(--dropdown-bg, #fff)',
                                                            border: '1px solid rgba(0,0,0,0.15)',
                                                            borderRadius: 8,
                                                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                                                            padding: 6,
                                                            minWidth: 180,
                                                            maxHeight: 240,
                                                            overflowY: 'auto'
                                                        }}
                                                    >
                                                        {ENERGY_OPTIONS.map(({ abbr, label }) => (
                                                            <button
                                                                key={abbr}
                                                                role="option"
                                                                className="energy-menu-item"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 8,
                                                                    padding: '6px 8px',
                                                                    width: '100%'
                                                                }}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                onClick={() => {
                                                                    const nextText = (attackCostText ? (attackCostText + ' ') : '') + abbr;
                                                                    const parsed = parseAttackCostText(nextText);
                                                                    setDraftFilters(f => ({
                                                                        ...f,
                                                                        attackCost: {
                                                                            ...(f.attackCost || { op: 'eq' }),
                                                                            value: parsed.value,
                                                                            energies: parsed.energies
                                                                        }
                                                                    }));
                                                                    setShowEnergyMenu(false);
                                                                }}
                                                                title={`${abbr} — ${label}`}
                                                            >
                                                                <img
                                                                    src={ENERGY_ABBR_TO_IMG[abbr]}
                                                                    alt=""
                                                                    width={20}
                                                                    height={20}
                                                                    style={{ display: 'inline-block', borderRadius: 2 }}
                                                                />
                                                                <span style={{ fontFamily: 'monospace', width: 18 }}>{abbr}</span>
                                                                <span>{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {/* <button
                                                onClick={() => setDraftFilters(f => ({ ...f, attackCost: { op: 'eq', value: '', energies: {} } }))}
                                                className='type-btn non-bold-typebtn'
                                            >
                                                Clear
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                                <hr style={{ width: '100%', margin: '25px 0' }}></hr>
                                <div className="filter-group">
                                    <h3>Artist:</h3>
                                    <input
                                        type="text"
                                        className="type-btn hp-input"
                                        placeholder="e.g. Mitsuhiro Arita"
                                        value={draftFilters.artist || ''}
                                        onChange={(e) => setDraftFilters(f => ({ ...f, artist: e.target.value }))}
                                    />
                                </div>
                                <div className="filter-group">
                                    <h3>Rarity:</h3>
                                    <div className="stage-type-buttons">
                                        {(showMoreRarity ? RARITY_ALL : RARITY_PRIMARY).map(r => {
                                            const on = !!(draftFilters.rarity && draftFilters.rarity[r]);
                                            return (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    className={`type-btn non-bold-typebtn ${on ? 'active' : ''}`}
                                                    aria-pressed={!!on}
                                                    onClick={() => {
                                                        const on = draftFilters.rarity?.[r];
                                                        setDraftFilters(f => ({
                                                            ...f,
                                                            rarity: { ...(f.rarity || {}), [r]: !on }
                                                        }));
                                                    }}
                                                >
                                                    {r}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        className="type-btn mechanics-toggle non-bold-typebtn"
                                        style={{ '--typeIcon': 'none' }}
                                        onClick={() => setShowMoreRarity(v => !v)}
                                        aria-expanded={showMoreRarity}
                                    >
                                        <span className="toggle-label">
                                            {showMoreRarity ? 'Show less' : 'Show more'}
                                        </span>
                                        <span className="material-symbols-outlined" aria-hidden="true">
                                            {showMoreRarity ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
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
                                                !Number.isFinite(Number((draftFilters.hp || {}).value)) &&
                                                !(draftFilters.artist && String(draftFilters.artist).trim() !== '') &&
                                                !Object.values(draftFilters.rarity || {}).some(Boolean);

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

                                                const cleaned = buildFiltersForRequest(draftFilters);

                                                const payload = {
                                                    filters: cleaned
                                                };

                                                const resp = await fetch('/api/cards/filter-search', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(payload)
                                                });

                                                const list = resp.ok ? await resp.json() : [];

                                                const fr = draftFilters.formatRange?.from;
                                                const to = draftFilters.formatRange?.to;
                                                let arr = Array.isArray(list) ? list : [];
                                                if (fr && to) {
                                                    arr = arr.filter(c => isAbbrevInRange(c.setAbbrev, fr, to));
                                                }

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
