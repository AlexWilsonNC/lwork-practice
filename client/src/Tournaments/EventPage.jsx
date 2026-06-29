import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/eventpage.css';
import { displayResults } from './event-results';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import DisplayPokemonSprites, { getPokemonSprites } from './pokemon-sprites';
import { getCustomLabel } from './pokemon-labels';
// import LiveStandings from '../Live/LiveStandings';
import { flags, countryNames, regions } from '../Tools/flags';
import blueUltraBallSpinner from '../assets/logos/blue-ultra-ball.png';


ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

import regional25 from '../assets/event-logo/regionals-2025.png';
import regionals from '../assets/event-logo/regionals-hd.png';
import internats25 from '../assets/event-logo/internats-2025.png';
import speSeries from '../assets/profile-pics/play-pokemon-logo.png';
import worlds from '../assets/event-logo/worlds-hd.png';
import premierBallLeague from '../assets/event-logo/premier-ball-league.png';
import malaysiaChampionships from '../assets/event-logo/ch-malaysia.png';
import hongkongChampionships from '../assets/event-logo/ch-hongkong.png';
import indonesiaChampionships from '../assets/event-logo/ch-indonesia.png';
import philippenesChampionships from '../assets/event-logo/ch-philippenes.png';
import singaporeChampionships from '../assets/event-logo/ch-singapore.png';
import taiwanChampionships from '../assets/event-logo/ch-taiwan.png';
import thailandChampionships from '../assets/event-logo/ch-thailand.png';
import japanChampionships from '../assets/event-logo/jp-nationals.png';
import ogInternats from '../assets/event-logo/internats-logo-hd.png';
import koreaLeague from '../assets/event-logo/korean-league.png';
import wotcWorlds from '../assets/event-logo/worlds-2002.png';
import worldsOten from '../assets/event-logo/2010worlds.png';
import worldsOnine from '../assets/event-logo/2009worlds.jpg';
import worldsOeight from '../assets/event-logo/2008worlds.png';
import worldsOSeven from '../assets/event-logo/2007worlds.png';
import worldsOsix from '../assets/event-logo/2006worlds.png';
import worldsOfive from '../assets/event-logo/2005worlds.png';
import worldsOfour from '../assets/event-logo/2004worlds.png';
import nationals from '../assets/event-logo/nats-hd.png';
import oldNationals from '../assets/event-logo/old-nats-logo-hd.png';
import oFourNationals from '../assets/event-logo/nats-logo-04-hd.png';
import retro from '../assets/event-logo/retro.png';
import stadiumChallenge from '../assets/event-logo/stadium-challenge-wotc.png';
import fourStadiumChallenge from '../assets/event-logo/old-stadium-challenge.png';
import superTrainerShowdown from '../assets/event-logo/super-trainer-showdown-logo.png';
import megaTropicalBattle from '../assets/event-logo/mega-tropical-battle.png';
import championsLeague from '../assets/event-logo/champions-league.png';

import argentina from '../assets/flags/argentina.png';
import andorra from '../assets/flags/andorra.png';
import australia from '../assets/flags/australia.png';
import austria from '../assets/flags/austria.png';
import belarus from '../assets/flags/belarus.png';
import belgium from '../assets/flags/belgium.png';
import brazil from '../assets/flags/brazil.png';
import canada from '../assets/flags/canada.png';
import chile from '../assets/flags/chile.png';
import china from '../assets/flags/china.png';
import colombia from '../assets/flags/colombia.png';
import costaRica from '../assets/flags/costa-rica.png';
import croatia from '../assets/flags/croatia.png';
import czechia from '../assets/flags/czech-republic.png';
import denmark from '../assets/flags/denmark.png';
import dominicanRepublic from '../assets/flags/dominican-republic.png';
import ecuador from '../assets/flags/ecuador.png';
import elSalvador from '../assets/flags/el-salvador.png';
import finland from '../assets/flags/finland.png';
import france from '../assets/flags/france.png';
import germany from '../assets/flags/germany.png';
import greece from '../assets/flags/greece.png';
import hongKong from '../assets/flags/hong-kong.png';
import hungary from '../assets/flags/hungary.png';
import iceland from '../assets/flags/iceland.png';
import indonesia from '../assets/flags/indonesia.png';
import ireland from '../assets/flags/ireland.png';
import israel from '../assets/flags/isreal.png';
import isleOfMan from '../assets/flags/im.png';
import italy from '../assets/flags/italy.png';
import japan from '../assets/flags/japan.png';
import southKorea from '../assets/flags/korea.png';
import lithuania from '../assets/flags/lithuania.png';
import malaysia from '../assets/flags/malaysia.png';
import malta from '../assets/flags/malta.png';
import mexico from '../assets/flags/mexico.png';
import morocco from '../assets/flags/morocco.png';
import netherlands from '../assets/flags/netherlands.png';
import newZealand from '../assets/flags/new-zealand.png';
import nicaragua from '../assets/flags/nicaragua.png';
import norway from '../assets/flags/norway.png';
import peru from '../assets/flags/peru.png';
import philippines from '../assets/flags/philippines.png';
import poland from '../assets/flags/poland.png';
import portugal from '../assets/flags/portugal.png';
import puertoRico from '../assets/flags/puerto-rico.png';
import russia from '../assets/flags/russia.png';
import singapore from '../assets/flags/singapore.png';
import slovakia from '../assets/flags/slovakia.png';
import slovenia from '../assets/flags/slovenia.png';
import somalia from '../assets/flags/somalia.png';
import southAfrica from '../assets/flags/south-africa.png';
import spain from '../assets/flags/spain.png';
import sweden from '../assets/flags/sweden.png';
import switzerland from '../assets/flags/switzerland.png';
import taiwan from '../assets/flags/taiwan.png';
import thailand from '../assets/flags/thailand.png';
import usa from '../assets/flags/usa.png';
import uk from '../assets/flags/uk.png';
import uruguay from '../assets/flags/uruguay.png';
import guatemala from '../assets/flags/guatemala.png';
import bolivia from '../assets/flags/bolivia.png';
import all from '../assets/flags/all.png';
import unknown from '../assets/flags/unknown.png';

const flagForDiffPurpose = {
    usa: usa,
    italy: italy,
    southAfrica: southAfrica,
    indonesia: indonesia,
    japan: japan,
    mexico: mexico,
    peru: peru,
    philippines: philippines,
    chile: chile,
    singapore: singapore,
    colombia: colombia,
    sweden: sweden,
    thailand: thailand,
    puertoRico: puertoRico,
    southKorea: southKorea,
    argentina: argentina,
    australia: australia,
    austria: austria,
    belarus: belarus,
    belgium: belgium,
    brazil: brazil,
    canada: canada,
    china: china,
    croatia: croatia,
    czechia: czechia,
    denmark: denmark,
    dominicanRepublic: dominicanRepublic,
    ecuador: ecuador,
    elSalvador: elSalvador,
    finland: finland,
    france: france,
    germany: germany,
    hongKong: hongKong,
    malaysia: malaysia,
    netherlands: netherlands,
    newZealand: newZealand,
    norway: norway,
    poland: poland,
    portugal: portugal,
    russia: russia,
    singapore: singapore,
    slovakia: slovakia,
    spain: spain,
    switzerland: switzerland,
    taiwan: taiwan,
    uk: uk,
    uruguay: uruguay,
    guatemala: guatemala,
    bolivia: bolivia,
    all: all,
    unknown: unknown,
};

const logos = {
    retro: retro,
    regionals: regionals,
    speSeries: speSeries,
    ogInternats: ogInternats,
    worlds: worlds,
    premierBallLeague: premierBallLeague,
    indonesiaChampionships: indonesiaChampionships,
    japanChampionships: japanChampionships,
    philippenesChampionships: philippenesChampionships,
    thailandChampionships: thailandChampionships,
    singaporeChampionships: singaporeChampionships,
    koreaLeague: koreaLeague,
    regional25: regional25,
    internats25: internats25,
    malaysiaChampionships: malaysiaChampionships,
    hongkongChampionships: hongkongChampionships,
    taiwanChampionships: taiwanChampionships,
    wotcWorlds: wotcWorlds,
    nationals: nationals,
    worldsOten: worldsOten,
    worldsOnine: worldsOnine,
    worldsOeight: worldsOeight,
    worldsOSeven: worldsOSeven,
    worldsOsix: worldsOsix,
    worldsOfive: worldsOfive,
    worldsOfour: worldsOfour,
    oldNationals: oldNationals,
    oFourNationals: oFourNationals,
    stadiumChallenge: stadiumChallenge,
    fourStadiumChallenge: fourStadiumChallenge,
    superTrainerShowdown: superTrainerShowdown,
    megaTropicalBattle: megaTropicalBattle,
    championsLeague: championsLeague,
};

const orderedSets = [
    "CRI", "POR", "ASC", "PFL", "MEG", "MEE", "MEP", "BLK", "WHT", "DRI", "JTG", "PRE", "SSP", "SCR", "SFA", "TWM", "TEF", "PAF", "PAR", "MEW", "OBF", "PAL", "SVE", "SVI", "PR-SV",
    "CRZ", "SIT", "LOR", "PGO", "ASR", "BRS", "FST", "CEL", "EVS", "CRE", "BST",
    "SHF", "VIV", "CPA", "DAA", "RCL", "SSH", "PR-SW",
    "CEC", "HIF", "UNM", "UNB", "DET", "TEU", "LOT", "DRM", "CES", "FLI", "UPR",
    "CIN", "SLG", "BUS", "GRI", "SUM", "PR-SM",
    "EVO", "STS", "FCO", "GEN", "BKP", "BKT", "AOR", "ROS", "DCR", "PRC", "PHF", "FFI",
    "FLF", "KSS", "XY", "PR-XY",
    "LTR", "PLB", "PLF", "PLS", "BCR", "DRV", "DRX", "DEX", "NXD", "NVI", "EPO", "BLW", "PR-BLW",
    "CL", "TM", "UD", "UL", "HS", "RM", "PR-HS",
    "AR", "SV", "RR", "P9", "PL", "SF", "P8", "LA", "MD", "P7", "GE", "SW", "P6",
    "MT", "DP", "PR-DP",
    "P5", "PK", "DF", "CG", "P4", "HP", "P3", "TK2", "LM", "DS", "P2", "UF", "EM", "DX",
    "TRR", "P1", "RG", "HL", "TK1", "MA", "DR", "SS", "RS", "PR-EX",
    "SK", "AQ", "EX", "LC", "N4", "N3", "SI", "N2", "N1", "G2", "G1", "TR", "B2",
    "FO", "JU", "BS", "PR-BS",
];

const promoSets = {
    "CRI": ["PR-SV", "MEP"],
    "POR": ["PR-SV", "MEP"],
    "ASC": ["PR-SV", "MEP"],
    "PFL": ["PR-SV", "MEP"],
    "MEG": ["PR-SV", "MEP"],
    "MEE": ["PR-SV", "MEP"],
    "BLK": "PR-SV",
    "WHT": "PR-SV",
    "DRI": "PR-SV",
    "JTG": "PR-SV",
    "PRE": "PR-SV",
    "SSP": ["PR-SV", "PRE"],
    "SCR": ["PR-SV", "PRE"],
    "SFA": "PR-SV",
    "TWM": "PR-SV",
    "TEF": ["PR-SV", "SVI"],
    "PAF": "PR-SV",
    "PAR": ["PR-SV", "PAF"],
    "MEW": "PR-SV",
    "OBF": "PR-SV",
    "PAL": "PR-SV",
    "SVI": ["PR-SV", "ASC"],
    "SVE": "PR-SV",
    "CRZ": "PR-SW",
    "SIT": "PR-SW",
    "LOR": "PR-SW",
    "PGO": "PR-SW",
    "ASR": "PR-SW",
    "BRS": ["PR-SW", "PRE"],
    "BST": ["PR-SW", "PAF"],
    "CEC": "PR-SM",
    "HIF": "PR-SM",
    "UNM": "PR-SM",
    "UNB": "PR-SM",
    "DET": "PR-SM",
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
    "DCR": "PR-XY",
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
    "RG": "PR-EX",
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

const formatToCollections = (format, eventId) => {
    if (format === "BS-BS") return ["BS"];

    const [startSet, endSet] = format.split('-');
    const startIndex = orderedSets.indexOf(startSet);
    const endIndex = orderedSets.indexOf(endSet);

    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Invalid format range');
    }

    const [actualStart, actualEnd] =
        startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

    const baseCollections = orderedSets.slice(actualStart, actualEnd + 1).reverse();
    const extras = [];

    Object.keys(promoSets).forEach((set) => {
        if (!baseCollections.includes(set)) return;

        const promoValue = promoSets[set];
        if (Array.isArray(promoValue)) {
            extras.push(...promoValue);
        } else {
            extras.push(promoValue);
        }
    });

    // cards not in format , but allowed for display without messing up the event's format
    // in PlayerDeck.jsx too!
    if (
        ['2026_SANTIAGO', '2026_SYDNEY', '2026_EUIC', '2026_SEATTLE'].includes(eventId) &&
        !baseCollections.includes('ASC') &&
        !extras.includes('ASC')
    ) {
        extras.unshift('ASC');
    }

    return [...new Set([...baseCollections, ...extras])];
};

const EventPageContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.body};
  .event-option:hover {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
  }
  .meta-pie-legend, .meta-share-list {color: ${({ theme }) => theme.text};}
  .active-option {
    background: ${({ theme }) => theme.body};
  }
  .results-list-item {
    color: ${({ theme }) => theme.text};
  }
    .modal-content {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }
    .player-decklink-cell a {
        color: ${({ theme }) => theme.text};
    }
    .close-btn {
        color: ${({ theme }) => theme.text};
    }
  .player-list-hover:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.playerlisthover};
  }
  .filter-container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
    select {background: ${({ theme }) => theme.body};}
    select {color: ${({ theme }) => theme.text};}
    button {background: ${({ theme }) => theme.body};}
    button {color: ${({ theme }) => theme.text};}
  }
  .average-card-counts p,
  .filtered-results p {
    color: ${({ theme }) => theme.text};
  }
    .matchups-overview {
        color: ${({ theme }) => theme.text};
    }
  .spinner {
    margin-top: 25px;
    border-left-color: ${({ theme }) => theme.spinner};
  }
  .notavailable,
  .chart-bold,
  .active-option,
  h3 {
    color: ${({ theme }) => theme.text};
  }
    .stats-tab-h3-label {
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
    }
  .chart-description {
      color: ${({ theme }) => theme.chartdescrip};
  }
  .day1btn, .day2btn, .conversbtn {
    background-color: ${({ theme }) => theme.day1btn};
  }
  .chart-button.active {
    background-color: #1290eb;
  }
    .regional-info::before {
        opacity: ${({ theme }) => theme.blueballopacity};
    }
    @media screen and (max-width: 1115px) {
        .filters-top {
            margin-top: 15px;
            margin-left: 0px !important;
        }
        .indiv-filter select {
            width: 150px;
        }
        .indiv-filter select {
            width: 175px;
            height: 24px;
            font-size: 12px;
            margin-top: 5px;
        }
    }
    .button-container button {
        margin: 7px 7px -7px 0;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        color: white;
    }
    .button-container button:not(.active-button) {
        background-color: ${({ theme }) => theme.statsBtns};
    }
    .active-button {
        background-color: #1290eb !important;
        border: 1px solid #007bff;
    }
    .stat-toggle-buttons button, .meta-view-toggle button {background-color: ${({ theme }) => theme.statsBtns};}
    .day-toggle-buttons button {
        padding: 5px 7px;
        border-radius: 2px;
        border: none;
        color:#fff;
        margin-right: 10px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
    }
    .day-toggle-buttons button:not(.active-button) {
        background-color: ${({ theme }) => theme.statsBtns};
    }
    .flag-container {
        position: relative;
        display: inline-block;
        text-align: center;
        margin-top: 5px;
    }
    .link-to-playerrecords, .results-country-filter, .country-filter-toggle, .meta-share-table, .player-search-wrapper input, .matrix-info-modal {
        color: ${({ theme }) => theme.text};
    }
    .link-to-playerrecords:hover {
        color: #1290eb;
    }
    .flag-tooltip {
        visibility: hidden;
        background-color: #1290eb;
        color: white;
        text-align: center;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 10px;
        position: absolute;
        z-index: 9999 !important;
        bottom: 95%;
        left: 35%;
        transform: translateX(-50%);
        white-space: nowrap;
        display: block;
    }
    .flag-container:hover .flag-tooltip {
        visibility: visible;
        opacity: 1;
    }
    .matchup-matrix th:first-child,
    .matchup-matrix thead th {
        background-color: ${({ theme }) => theme.themeName === 'dark' ? '#27292c' : '#fff'};
    }
    .matchup-matrix-table th,
    .matchup-matrix-table td {
        border-color: ${({ theme }) => theme.themeName === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.18)'};
    }
    .matchup-matrix-table th {
        background: ${({ theme }) => theme.themeName === 'dark' ? '#f4f4f4' : '#fff'};
    }
    .matchup-matrix-table .row-header,
    .matchup-matrix-table .corner-cell {
        background: ${({ theme }) => theme.themeName === 'dark' ? '#f7f7f7' : '#fff'};
    }
    .matchup-matrix-cell {
        color: ${({ theme }) => theme.themeName === 'dark' ? '#f5f5f5' : '#111'};
        text-shadow: ${({ theme }) => theme.themeName === 'dark' ? '0 1px 2px rgba(0,0,0,0.65)' : 'none'};
    }
    .results-country-filter {background: ${({ theme }) => theme.resultscountryfilter};}
    .player-search-wrapper input {background: ${({ theme }) => theme.searchwrapperinputbg};}
    .country-filter-toggle {background: ${({ theme }) => theme.searchwrapperbtn};}
    .matrix-info-modal {background: ${({ theme }) => theme.matrixmodalbg};}
`;

const cleanSpriteName = url => {
    if (!url) return '';
    let fn = url.split('/').pop();            // "-assets-sprites-foo-png.png"
    fn = fn.replace(/^-?assets-sprites-/, ''); // "foo-png.png"
    return fn.replace(/\.png$/, '');           // "foo-png"
};

// runs cleanSpriteName on sprite1/2, falls back to getPokemonSprites if needed
const normalizePlayerSprites = player => {
    let s1 = cleanSpriteName(player.sprite1 || '');
    let s2 = cleanSpriteName(player.sprite2 || '');

    if (!s1 && !s2 && player.decklist) {
        const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
        s1 = cleanSpriteName(firstSprite);
        s2 = cleanSpriteName(secondSprite);
    }

    if (s1 === 'blank') s1 = '';
    if (s2 === 'blank') s2 = '';
    if (!s1) s1 = 'blank';

    return { ...player, sprite1: s1, sprite2: s2 };
};
const getCountryName = (code) => {
    return countryNames[code] || 'Unknown';
};

const regionLabelMap = {
    NA: 'North America',
    LA: 'Latin America',
    EU: 'Europe',
    OC: 'Oceania',
    AP: 'Asia-Pacific',
    MS: 'Middle East-South Africa',
};

const normalizeAttacks = (attacks) => {
    return attacks.map(attack => ({
        ...attack,
        cost: attack.cost.slice().sort()
    })).sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeAbilities = (abilities) => {
    if (!abilities) return [];
    return abilities.map(ability => ({
        ...ability
    })).sort((a, b) => a.name.localeCompare(b.name));
};

const parseOpponent = rawName => {
    const m = rawName.match(/\[([A-Z]{2})\]\s*$/);
    const code = m ? m[1] : 'unknown';
    const name = rawName.replace(/\s*\[[A-Z]{2}\]\s*$/, '').trim();
    return { code, name };
};

const normalizeWeaknesses = (weaknesses) => {
    if (!weaknesses) return [];
    return weaknesses.map(weakness => ({
        ...weakness
    })).sort((a, b) => a.type.localeCompare(b.type));
};

const normalizeResistances = (resistances) => {
    if (!resistances) return [];
    return resistances.map(resistance => ({
        ...resistance
    })).sort((a, b) => a.type.localeCompare(b.type));
};

const normalizeName = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
};

const formatName = (name) => {
    const lowercaseWords = ['de', 'of', 'the', 'van', 'der'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.', 'mk', 'jc'];

    const specialCases = {
        'de haes damien': 'De Haes Damien',
        'jamie depamphilis': 'Jamie DePamphilis',
        'der cherng lee': 'Der Cherng Lee',
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

const comparePokemonCards = (card1, card2) => {
    const typesMatch = JSON.stringify(card1.types) === JSON.stringify(card2.types);
    const hpMatch = card1.hp === card2.hp;
    const attacksMatch = JSON.stringify(normalizeAttacks(card1.attacks || [])) === JSON.stringify(normalizeAttacks(card2.attacks || []));
    const abilitiesMatch = JSON.stringify(normalizeAbilities(card1.abilities || [])) === JSON.stringify(normalizeAbilities(card2.abilities || []));
    const retreatCostMatch = JSON.stringify(card1.convertedRetreatCost || []) === JSON.stringify(card2.convertedRetreatCost || []);
    const weaknessesMatch = JSON.stringify(normalizeWeaknesses(card1.weaknesses || [])) === JSON.stringify(normalizeWeaknesses(card2.weaknesses || []));
    const resistancesMatch = JSON.stringify(normalizeResistances(card1.resistances || [])) === JSON.stringify(normalizeResistances(card2.resistances || []));

    return typesMatch && hpMatch && attacksMatch && abilitiesMatch && retreatCostMatch && weaknessesMatch && resistancesMatch;
};

const normalizeEnergyCardName = (name) => {
    return name
        .toLowerCase()
        .replace("basic ", "")
        .replace(" - basic", "")
        .replace(" energy", "");
};
const compareEnergyCards = (card1, card2) =>
    normalizeEnergyCardName(card1.name) === normalizeEnergyCardName(card2.name);

const forcedArchetypeSprites = {
    'Gardevoir & Sylveon': ['gardevoir-sylveon-tagteam'],
    'Gliscor': ['gliscor'],
    'Tyranitar PRIME': ['tyranitar'],
    'Malamar': ['malamar'],
    'Blacephalon GX': ['blacephalon'],
    'Spiritomb': ['spiritomb'],
    'Zapdos': ['zapdos'],
    'Wall Stall': ['substitute'],
    'Lucario GX': ['lucario'],
    'Gardevoir GX': ['gardevoir'],
    'Gardevoir': ['gardevoir'],
    'Buzzwole GX': ['buzzwole'],
    'Volcanion': ['volcanion'],
    'Rainbow Road': ['xerneas-active'],
    'Zoroark BREAK': ['zoroark'],
    'Gardevoir ex': ['gardevoir'],
    'Darkrai': ['darkrai'],
    'Mega Mewtwo': ['mewtwo-mega-y'],
    'Vespiquen': ['vespiquen'],
    'Mega Rayquaza': ['rayquaza-mega'],
    'Mega Gardevoir Brilliant Arrow': ['gardevoir-mega'],
    'Toad Bats': ['seismitoad', 'crobat'],
    'Primal Groudon': ['groudon-primal'],
    'Mega Manectric': ['manectric-mega'],
    'Darkrai-EX': ['darkrai'],
    'Yanmega PRIME': ['yanmega'],
    'Empoleon': ['empoleon'],
    'Scizor': ['scizor'],
    'Flygon': ['flygon'],
    'LBS': ['lugia', 'blastoise'],
    'Medicham': ['medicham'],
    'Walrein': ['walrein'],
    'Blaziken': ['blaziken'],
    'Dark Feraligatr': ['feraligatr'],
    'Espeon': ['espeon'],
    'Kingdra': ['kingdra'],
    'Dark Blastoise': ['blastoise'],
    'Sneasel': ['sneasel'],
    'Riptide Feraligatr': ['feraligatr'],
    'Crobat': ['crobat'],
    'Typhlosion': ['typhlosion'],
    'Steelix': ['steelix'],
    'Wigglytuff': ['wigglytuff'],
    'Haymaker': ['hitmonchan'],
    'Mega Starmie': ['starmie-mega'],
    'Hydrapple': ['hydrapple'],
};

const getForcedSprites = (key, fallback = []) => {
    return forcedArchetypeSprites[key] || fallback;
};

const EventPage = () => {
    const { theme } = useTheme();
    const { eventId, division: divisionParam } = useParams();
    const [eventData, setEventData] = useState(null);
    const [division, setDivision] = useState('masters');
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem(`activeTab_${eventId}`) || 'Results');
    const STORAGE_KEY = `lastModalPlayer_${eventId}`;
    const chartRef = useRef(null);
    const [isChartReady, setIsChartReady] = useState(false)
    const navigate = useNavigate();
    const [showDayOneMeta, setShowDayOneMeta] = useState(false);
    const [showConversionRate, setShowConversionRate] = useState(false);
    const [selectedArchetype, setSelectedArchetype] = useState('');
    const [averageCardCounts, setAverageCardCounts] = useState([]);
    // const [top30CardCounts, setTop30CardCounts] = useState([]);
    const [showTop30, setShowTop30] = useState(true);
    const [cardData, setCardData] = useState(null);
    const [viewTab, setViewTab] = useState('Decks');
    const [eventName, setEventName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalPlayer, setModalPlayer] = useState(null);
    const [fetchedDayOneCount, setFetchedDayOneCount] = useState(null);
    const [dataDay, setDataDay] = useState('day2'); // 'day2' or 'day1'
    const [showAllCardsList, setShowAllCardsList] = useState(false);
    const [matchupDay, setMatchupDay] = useState('combined');
    const [matchupView, setMatchupView] = useState('matrix');
    const [eliminatedDecks, setEliminatedDecks] = useState([]);
    const [loadingEliminatedDecks, setLoadingEliminatedDecks] = useState(false);
    const [showAllDecks, setShowAllDecks] = useState(false);
    const [showAllPlayers, setShowAllPlayers] = useState(false);
    const [eliminatedRecords, setEliminatedRecords] = useState([]);
    const [loadingEliminatedRecs, setLoadingEliminatedRecs] = useState(false);
    const [showAllRecs, setShowAllRecs] = useState(false);
    const [statView, setStatView] = useState('meta'); // 'meta' | 'decklists' | 'records' | 'matchups'
    const [metaView, setMetaView] = useState('bar'); // 'bar' | 'list' | 'pie'
    const [infoArchetype, setInfoArchetype] = useState(null);
    const [infoStats, setInfoStats] = useState({ wins: 0, losses: 0, ties: 0 });
    const [infoOpponentArchetype, setInfoOpponentArchetype] = useState(null);
    const [playerSearch, setPlayerSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showCountryFilter, setShowCountryFilter] = useState(false);
    const doughnutSpriteCache = useRef({});
    const didFetchCounts = useRef({});
    const [hoveredDoughnutIndex, setHoveredDoughnutIndex] = useState(null);
    const doughnutChartRef = useRef(null);
    const [showAllAverageCards, setShowAllAverageCards] = useState(false);

    useEffect(() => {
        didFetchCounts.current[division] = false;
    }, [eventId, division]);

    const mastersResults = eventData?.masters || [];
    const seniorsResults = eventData?.seniors || [];
    const juniorsResults = eventData?.juniors || [];
    const professorsResults = eventData?.professors || [];
    const olderSeniorsResults = eventData?.olderSeniors || [];
    const youngSeniorsResults = eventData?.youngSeniors || [];
    const allResults = eventData?.all || [];

    const results =
        division === 'masters'
            ? mastersResults
            : division === 'seniors'
                ? seniorsResults
                : division === 'juniors'
                    ? juniorsResults
                    : division === 'professors'
                        ? professorsResults
                        : division === 'olderSeniors'
                            ? olderSeniorsResults
                            : division === 'youngSeniors'
                                ? youngSeniorsResults
                                : division === 'all'
                                    ? allResults
                                    : [];

    const resultsWithPlacement = results.map((player, idx) => ({
        ...player,
        placing: player.placing ?? idx + 1
    }));

    const regionCountArray = Object.entries(regions).map(([region, codes]) => ({
        region,
        label: regionLabelMap[region] || region,
        count: results.filter(player =>
            codes.includes(player.flag || 'unknown')
        ).length
    }));

    const is2025Event = eventId.includes('2025') && eventId !== '2025_BALTIMORE' && eventId !== '2025_TOKYO_CL';
    const is2026Event = eventId.includes('2026');

    const isModernEvent = is2025Event || is2026Event;
    const noPhaseDataEvents = [
        '2026_AUCKLAND',
        '2026_LIMA',
        '2026_BUENOS-AIRES',
        '2026_LILLE',
        '2025_CAROLINA',
        '2025_BOGOTA',
        '2025_BUENOS_AIRES',
        '2025_LIMA',
        '2024_CAPE_TOWN',
    ];
    const usesPhaseData =
        isModernEvent &&
        !noPhaseDataEvents.includes(eventId) &&
        eventId !== '2025_BALTIMORE' &&
        eventId !== '2025_TOKYO_CL';

    const showMatchupsTab = is2026Event && usesPhaseData;
    const hasResultsForDivision = results.length > 0;
    const hasStoredPhaseCounts =
        eventData?.dayOneMasters ||
        eventData?.dayTwoMasters ||
        eventData?.dayOneSeniors ||
        eventData?.dayTwoSeniors ||
        eventData?.dayOneJuniors ||
        eventData?.dayTwoJuniors;

    const showPhaseCounts =
        hasResultsForDivision &&
        (usesPhaseData || hasStoredPhaseCounts);
    const label = (n, colon = false) => `${is2026Event ? 'Phase' : 'Day'} ${n}${colon ? ':' : ''}`;

    let day2Results;
    if (usesPhaseData) {
        // only for 2025+ events do we cut on Swiss rounds
        const totalPlayers = results.length;
        const day1Rounds =
            totalPlayers >= 2049 ? 9 :
                totalPlayers >= 257 ? 8 :
                    7;

        day2Results = resultsWithPlacement.filter(p => {
            const { wins = 0, losses = 0, ties = 0 } = p.record ?? {};
            return wins + losses + ties > day1Rounds;
        });
    } else {
        // legacy events (pre-2025): everyone is shown
        day2Results = resultsWithPlacement;
    }

    const EVENT_PAGE_STATE_KEY = `PTCGLegendsEventPageState_${eventId}`;

    const saveEventPageState = () => {
        sessionStorage.setItem(
            EVENT_PAGE_STATE_KEY,
            JSON.stringify({
                scrollY: window.scrollY,
                division,
                activeTab,
                viewTab,
                dataDay,
                showAllDecks,
                showAllPlayers,
                showAllRecs,
                matchupDay,
                matchupView,
                statView,
                selectedArchetype,
                savedAt: Date.now()
            })
        );
    };

    const handleEventResultsClickCapture = (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const url = new URL(link.href, window.location.origin);

        const isTournamentDecklistLink =
            url.pathname.startsWith(`/tournaments/${eventId}/`) &&
            url.pathname.split('/').filter(Boolean).length >= 4;

        if (isTournamentDecklistLink) {
            saveEventPageState();
        }
    };

    const normalizeString = (str) => {
        return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const fetchCardData = async (format) => {
        try {
            const collectionsParam = formatToCollections(format, eventId).join(',');
            const url = `https://ptcg-legends-6abc11783376.herokuapp.com/api/cards?format=${collectionsParam}`;
            const response = await fetch(url);

            if (response.ok) {
                const cards = await response.json();
                const cardMap = {};

                cards.forEach(card => {
                    const key = `${card.setAbbrev}-${card.number}`;
                    cardMap[key] = card;
                });

                setCardData(cardMap);
            } else {
                console.error('Failed to fetch card data, status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching card data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/events/${eventId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.masters) data.masters = data.masters.map(normalizePlayerSprites);
                    if (data.seniors) data.seniors = data.seniors.map(normalizePlayerSprites);
                    if (data.juniors) data.juniors = data.juniors.map(normalizePlayerSprites);
                    if (data.professors) data.professors = data.professors.map(normalizePlayerSprites);
                    if (data.olderSeniors) data.olderSeniors = data.olderSeniors.map(normalizePlayerSprites);
                    if (data.youngSeniors) data.youngSeniors = data.youngSeniors.map(normalizePlayerSprites);
                    if (data.all) data.all = data.all.map(normalizePlayerSprites);
                    setEventData(data);
                    setEventName(data.name);

                    const format = data.format || '';
                    await fetchCardData(format);
                } else {
                    console.error('Failed to fetch event data');
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchData();
    }, [eventId]);

    useEffect(() => {
        if (!eventData || !usesPhaseData) return;
        if (didFetchCounts.current[division]) return;
        const [year, ...slugParts] = eventId.split('_');
        const slug = slugParts.join('-').toLowerCase();
        const elUrl = `https://alexwilsonnc.github.io/eliminated-players/${year}/${slug}.json`;

        (async () => {
            try {
                const elRes = await fetch(elUrl);
                if (!elRes.ok) throw new Error(`HTTP ${elRes.status}`);

                const elData = await elRes.json();
                const rawElim = Array.isArray(elData[division]) ? elData[division] : [];
                const dayTwoCount = Array.isArray(eventData[division]) ? eventData[division].length : 0;
                const dayOneCount = rawElim.length + dayTwoCount;

                const divCap = division[0].toUpperCase() + division.slice(1);
                const dayOneKey = `dayOne${divCap}`;
                const dayTwoKey = `dayTwo${divCap}`;

                setEventData(prev => ({
                    ...prev,
                    [dayOneKey]: dayOneCount,
                    [dayTwoKey]: dayTwoCount
                }));

                // mark it done so we don’t loop
                didFetchCounts.current[division] = true;
            } catch (err) {
                console.error('Could not fetch Day 1 counts for', division, err);
            }
        })();
    }, [eventData, division, eventId]);

    useEffect(() => {
        if (divisionParam) {
            setDivision(divisionParam);
        }
        setShowAllDecks(false);
        setEliminatedRecords([]);
    }, [divisionParam]);

    useEffect(() => {
        sessionStorage.setItem(`activeTab_${eventId}`, activeTab);
    }, [activeTab, eventId]);

    useEffect(() => {
        if (!showMatchupsTab && (statView === 'matchups' || statView === 'records')) {
            setStatView('meta');
        }
    }, [showMatchupsTab, statView]);

    useEffect(() => {
        if (!results.length) return;
        const savedTab = sessionStorage.getItem(`viewTab_${eventId}`);
        if (savedTab !== 'Records') {
            localStorage.removeItem(STORAGE_KEY);
            if (savedTab) setViewTab(savedTab);
            return;
        }
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const { placing, name } = JSON.parse(raw);
                const match = results.find(p => p.placing === placing && p.name === name);
                if (match) {
                    setViewTab('Records');
                    setModalPlayer(match);
                    setShowModal(true);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, [results]);

    useEffect(() => {
        setShowDayOneMeta(false);
        setShowConversionRate(false);
        setShowCountryFilter(false);
        setSelectedCountry('');
    }, [division]);
    useEffect(() => {
        setShowAllAverageCards(false);
    }, [selectedArchetype, dataDay, showTop30]);

    useEffect(() => {
        const shouldUsePhase1 = usesPhaseData;

        if (!shouldUsePhase1) return;
        if (viewTab !== 'Decks') return;

        setEliminatedDecks([]);
        setShowAllDecks(false);

        loadEliminated();
    }, [division, eventId, viewTab]);

    const loadEliminated = async () => {
        if (viewTab === 'Records') {
            if (loadingEliminatedRecs) return;
            setLoadingEliminatedRecs(true);
        } else {
            if (loadingEliminatedDecks) return;
            setLoadingEliminatedDecks(true);
        }

        const [year, ...slugParts] = eventId.split('_');
        const slug = slugParts.join('-').toLowerCase();
        const url = `https://alexwilsonnc.github.io/eliminated-players/${year}/${slug.toLowerCase()}.json`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const key = `${division}`;
            const raw = Array.isArray(data[key]) ? data[key] : [];

            const normalized = raw.map(player => {
                let sprite1 = player.sprite1 || '';
                let sprite2 = player.sprite2 || '';

                if (!sprite1 && !sprite2 && player.decklist) {
                    const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');

                    const clean = str =>
                        str
                            .split('/')
                            .pop()
                            .replace(/^-?assets-sprites-/, '')
                            .replace(/\.png$/, '');

                    sprite1 = clean(firstSprite) || '';
                    sprite2 = clean(secondSprite) || '';
                }

                if (sprite1 === 'blank') sprite1 = '';
                if (sprite2 === 'blank') sprite2 = '';
                if (!sprite1) sprite1 = 'blank';

                return { ...player, sprite1, sprite2 };
            });

            if (viewTab === 'Decks') {
                setEliminatedDecks(normalized);
                setShowAllDecks(true);
            } else {
                setEliminatedRecords(normalized);
                setShowAllRecs(true);
            }
        } catch (err) {
            console.error('Failed to load eliminated players:', err);

            if (viewTab === 'Decks') {
                setEliminatedDecks([]);
                setShowAllDecks(false);
            } else {
                setEliminatedRecords([]);
                setShowAllRecs(false);
            }
        } finally {
            if (viewTab === 'Decks') {
                setLoadingEliminatedDecks(false);
            } else {
                setLoadingEliminatedRecs(false);
            }
        }
    };

    useEffect(() => {
        if (viewTab !== 'Records') return;
        if (eliminatedRecords.length === 0 && !loadingEliminatedRecs) {
            loadEliminated();    // defined just below
        }
    }, [viewTab, eliminatedRecords.length, loadingEliminatedRecs]);

    const handleRecordClick = (player) => {
        setViewTab('Records');
        sessionStorage.setItem(`viewTab_${eventId}`, 'Records');
        setModalPlayer(player);
        setShowModal(true);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ placing: player.placing, name: player.name })
        );
    };

    const closeModal = () => {
        setShowModal(false);
        setModalPlayer(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    useEffect(() => {
        // 1) restore the “showTop30” setting
        const saved = sessionStorage.getItem(`showTop30_${eventId}`);
        if (saved !== null) {
            const savedValue = JSON.parse(saved);
            setShowTop30(prev => prev === savedValue ? prev : savedValue);
        }

        // 2) if nothing selected, clear out and bail
        if (!selectedArchetype) {
            setAverageCardCounts(prev => prev.length ? [] : prev);
            return;
        }

        // 3) pick Day 2 vs Day 1 decks
        const sourceDecks = dataDay === 'day2' ? results : eliminatedDecks;
        const filteredDecks = sourceDecks.filter(player => {
            let s1 = player.sprite1 || '';
            let s2 = player.sprite2 || '';
            if (!s1 && !s2 && player.decklist) {
                const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
                s1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
                s2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
            }
            const key = getCustomLabel(eventId, s1, s2);
            return key === selectedArchetype;
        });

        // 4) aggregate counts exactly as before
        const cardSets = {
            pokemon: new Map(),
            trainer: new Map(),
            energy: new Map(),
        };

        filteredDecks.forEach(({ decklist }) => {
            if (!decklist) return;
            ['pokemon', 'trainer', 'energy'].forEach(category => {
                (decklist[category] || []).forEach(card => {
                    const existingKey = Array
                        .from(cardSets[category].keys())
                        .find(k => {
                            const info = cardSets[category].get(k).cardInfo;
                            if (category === 'pokemon') {
                                return normalizeString(info.name) === normalizeString(card.name)
                                    && comparePokemonCards(info, card);
                            }
                            if (category === 'energy') {
                                return compareEnergyCards(info, card);
                            }
                            return normalizeString(info.name) === normalizeString(card.name);
                        });

                    if (existingKey) {
                        const cd = cardSets[category].get(existingKey);
                        cd.count += Number(card.count);
                        cd.occurrences += 1;
                        cardSets[category].set(existingKey, cd);
                    } else {
                        const newKey = `${card.set}-${card.number}`;
                        cardSets[category].set(newKey, {
                            cardInfo: card,
                            count: Number(card.count),
                            occurrences: 1
                        });
                    }
                });
            });
        });

        // 5) build commonCards & sort
        const commonCards = { pokemon: [], trainer: [], energy: [] };
        ['pokemon', 'trainer', 'energy'].forEach(cat => {
            cardSets[cat].forEach(cd => {
                const avg = showTop30
                    ? cd.count / filteredDecks.length
                    : cd.occurrences === filteredDecks.length
                        ? cd.count / cd.occurrences
                        : null;

                if (avg == null) return;

                const formatted = avg.toFixed(2);
                const display = (formatted === "0.00" && avg > 0)
                    ? avg.toFixed(3)
                    : formatted;

                commonCards[cat].push({
                    ...cd.cardInfo,
                    averageCount: display
                });
            });
            commonCards[cat].sort((a, b) => b.averageCount - a.averageCount);
        });

        // 6) flatten & set state
        const allCommon = [
            ...commonCards.pokemon,
            ...commonCards.trainer,
            ...commonCards.energy
        ];
        setAverageCardCounts(allCommon);

    }, [selectedArchetype, showTop30, dataDay, eliminatedDecks, eventId, results]);

    const cardImageUrl = (card) => {
        if (!cardData) {
            return 'https://via.placeholder.com/150';
        }

        const key = `${card.set}-${card.number}`;

        const cardInfo = cardData[key];

        if (cardInfo && cardInfo.images) {
            return cardInfo.images.small;
        } else {
            return 'https://via.placeholder.com/150';
        }
    };

    const handleShowTop30 = () => {
        setShowTop30(true);
        sessionStorage.setItem(`showTop30_${eventId}`, true);
    };

    const handleShowAllCommonCards = () => {
        setShowTop30(false);
        sessionStorage.setItem(`showTop30_${eventId}`, false);
    };

    const chartResults =
        eventId === '2018_NAIC' && division === 'masters'
            ? mastersResults.slice(0, 64)
            : (eventId === '2007_WORLDS' && division === 'masters')
                ? mastersResults.slice(0, 16)
                : results;

    const visibleAverageCards = showAllAverageCards
        ? averageCardCounts
        : averageCardCounts.slice(0, 30);

    const deckTypeCount = chartResults.reduce((acc, player) => {
        let sprite1 = player.sprite1 || '';
        let sprite2 = player.sprite2 || '';

        if (!sprite1 && !sprite2) {
            const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
            sprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
            sprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
        }

        if (sprite2 === 'hyphen') return acc;

        let key = getCustomLabel(eventId, sprite1, sprite2);

        if (!acc[key]) {
            // start with an array of the two (if present)
            const sprites = [];
            if (sprite1 && sprite1 !== 'blank') sprites.push(sprite1);
            if (sprite2 && sprite2 !== 'blank') sprites.push(sprite2);
            acc[key] = { count: 0, sprites };
        }

        // increment count
        acc[key].count++;

        // also merge in any new sprite we discover
        [sprite1, sprite2].forEach(s => {
            if (s && s !== 'blank' && !acc[key].sprites.includes(s)) {
                acc[key].sprites.push(s);
            }
        });

        return acc;
    }, {});

    const getPhaseOneRoundCount = (playerCount) => {
        if (!isModernEvent) return 0;

        if (playerCount >= 4097) return 9;

        if (playerCount >= 129) return 8;

        return 7;
    };

    const getMatchupSourcePlayers = () => {
        if (matchupDay === 'day1') {
            return [...day2Results, ...eliminatedDecks];
        }

        if (matchupDay === 'combined') {
            return [...day2Results, ...eliminatedDecks];
        }

        return day2Results;
    };

    const getRoundsForMatchupDay = (player) => {
        const rounds = Object.entries(player.rounds || {});
        const phaseOneRoundCount = getPhaseOneRoundCount(day2Results.length + eliminatedDecks.length);
        if (!isModernEvent) {
            return rounds;
        }

        if (matchupDay === 'day1') {
            return rounds.filter(([round]) => Number(round) <= phaseOneRoundCount);
        }

        if (matchupDay === 'day2') {
            return rounds.filter(([round]) => Number(round) > phaseOneRoundCount);
        }

        return rounds;
    };

    const getRecordForMatchupDay = (player) => {
        const rounds = getRoundsForMatchupDay(player);

        return rounds.reduce(
            (acc, [, info]) => {
                if (info.result === 'W') acc.wins += 1;
                else if (info.result === 'L') acc.losses += 1;
                else if (info.result === 'T') acc.ties += 1;
                return acc;
            },
            { wins: 0, losses: 0, ties: 0 }
        );
    };

    const matchupRecordByArchetype = useMemo(() => {
        // pick which players to include
        const sourcePlayers = getMatchupSourcePlayers();

        // aggregate wins/losses/ties *and* collect sprites
        const acc = {};
        sourcePlayers.forEach(p => {
            const { wins, losses, ties } = getRecordForMatchupDay(p);

            // normalize sprites
            let s1 = p.sprite1 || '';
            let s2 = p.sprite2 || '';
            if (!s1 && !s2 && p.decklist) {
                const { firstSprite, secondSprite } = getPokemonSprites(p.decklist, '', '');
                s1 = firstSprite.split('/').pop().replace('.png', '');
                s2 = secondSprite.split('/').pop().replace('.png', '');
            }

            const key = getCustomLabel(eventId, s1, s2) || 'Other';

            if (!acc[key]) acc[key] = { wins: 0, losses: 0, ties: 0, sprites: [] };
            acc[key].wins += wins;
            acc[key].losses += losses;
            acc[key].ties += ties;

            [s1, s2].forEach(s => {
                if (s && s !== 'blank' && !acc[key].sprites.includes(s)) {
                    acc[key].sprites.push(s);
                }
            });
        });

        // turn into an array for rendering, sorted by total matches
        return Object.entries(acc)
            .filter(([key]) => key !== 'blank-')
            .map(([key, { wins, losses, ties, sprites }]) => ({
                key,
                wins,
                losses,
                ties,
                sprites: getForcedSprites(key, sprites)
            }))
            .sort((a, b) => {
                const totalA = a.wins + a.losses + a.ties;
                const totalB = b.wins + b.losses + b.ties;
                return totalB - totalA;
            });
    }, [matchupDay, day2Results, eliminatedDecks, results, eventId]);

    Object.entries(forcedArchetypeSprites).forEach(([key, sprites]) => {
        if (deckTypeCount[key]) {
            deckTypeCount[key].sprites = sprites;
        }
    });

    const deckTypeCountArray = Object.entries(deckTypeCount)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => b.count - a.count);
    const filteredDeckTypeCountArray = deckTypeCountArray;

    const finalDeckTypeCountArray = filteredDeckTypeCountArray.map(d => {
        return d;
    });
    const barSpritePlugin = {
        id: 'barSpritePlugin',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            const dataset = chart.data.datasets[0];

            chart.data.labels.forEach((label, index) => {
                const data = dataset.data[index];

                const sprites = showDayOneMeta
                    ? dayOneTypeArray[index]?.sprites || []
                    : deckTypeCount[label]?.sprites || [];

                const bar = meta.data[index];
                if (!bar || !sprites.length) return;

                const { x } = bar.tooltipPosition();
                const displayWidth = 35;
                const spacing = -15;
                const totalWidth = sprites.length * displayWidth + (sprites.length - 1) * spacing;
                const startX = x - totalWidth / 2;

                sprites.forEach((spr, i) => {
                    const img = new Image();
                    img.src = `/assets/sprites/${spr}.png`;

                    if (!img.complete) {
                        img.onload = () => chart.draw();
                        return;
                    }

                    const aspectRatio = img.width / img.height;
                    const w = displayWidth;
                    const h = w / aspectRatio;
                    const drawX = startX + i * (displayWidth + spacing);
                    const drawY = bar.y - h;

                    ctx.drawImage(img, drawX, drawY, w, h);
                });

                if (data > 0) {
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = theme.chartNumber;
                    ctx.fillText(data, x, bar.y + 10);
                    ctx.restore();
                }
            });
        }
    };
    const spriteOnDoughnutPlugin = {
        id: 'spriteOnDoughnutPlugin',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);

            meta.data.forEach((slice, index) => {
                const deck = doughnutRows[index];

                if (!deck || deck.key === 'Other Decks') return;

                const sprites = (deck?.sprites || [])
                    .filter(s => s && s !== 'blank')
                    .slice(0, 2);

                if (!sprites.length) return;

                const angle = (slice.startAngle + slice.endAngle) / 2;
                const radius = (slice.outerRadius + slice.innerRadius) / 2;

                const x = slice.x + Math.cos(angle) * radius;
                const y = slice.y + Math.sin(angle) * radius;

                sprites.forEach((sprite, spriteIndex) => {
                    const src = `/assets/sprites/${sprite}.png`;

                    if (!doughnutSpriteCache.current[src]) {
                        const image = new Image();
                        image.src = src;
                        image.onload = () => chart.draw();
                        doughnutSpriteCache.current[src] = image;
                    }

                    const image = doughnutSpriteCache.current[src];

                    if (!image.complete) return;

                    const offsetX = sprites.length === 2
                        ? spriteIndex === 0
                            ? -10
                            : 10
                        : 0;

                    ctx.save();
                    const displayWidth = 36;
                    const aspectRatio = image.width / image.height;

                    const drawWidth = displayWidth;
                    const drawHeight = drawWidth / aspectRatio;

                    ctx.drawImage(
                        image,
                        x - drawWidth / 2 + offsetX,
                        y - drawHeight / 2,
                        drawWidth,
                        drawHeight
                    );
                    ctx.restore();
                });
            });
        }
    };

    const handleDataDayChange = (day) => {
        setDataDay(day);
        if (day === 'day2') {
            // pick the #1 archetype (skip blank-)
            const top = finalDeckTypeCountArray.find(d => d.key !== 'blank-')?.key;
            if (top) {
                setSelectedArchetype(top);
                sessionStorage.setItem(`selectedArchetype_${eventId}`, top);
            }
        }
    };

    useEffect(() => {
        if (!isChartReady || deckTypeCountArray.length === 0) return;
        if (selectedArchetype) return;

        const storageKey = `selectedArchetype_${eventId}`;
        const savedKey = sessionStorage.getItem(storageKey);
        const validSaved = savedKey && finalDeckTypeCountArray.some(a => a.key === savedKey);

        const defaultKey = validSaved
            ? savedKey
            : finalDeckTypeCountArray[0].key;

        setSelectedArchetype(defaultKey);
        sessionStorage.setItem(storageKey, defaultKey);
    }, [isChartReady, deckTypeCountArray, eventId, selectedArchetype]);

    const getPlayerCount = (division) => {
        switch (division) {
            case 'masters':
                if (!showPhaseCounts) {
                    return null;
                }
                const total = mastersResults.length;
                const day2 = day2Results.length;
                const day1Count = eventData.dayOneMasters ?? total;
                const day2Count = eventData.dayTwoMasters ?? day2;
                return (
                    <>
                        <p>
                            <strong>{label(1, true)}</strong> {day1Count}{' '}
                            {division.charAt(0).toUpperCase() + division.slice(1)}
                        </p>
                        <p>
                            <strong>{label(2, true)}</strong> {day2Count}{' '}
                            {division.charAt(0).toUpperCase() + division.slice(1)}
                        </p>
                    </>
                );
            case 'all':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                {eventData.dayOneMasters} Players
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>{label(2, true)}</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                        {eventData?.dayOnePlayers && (
                            <p>
                                <strong>Players</strong> {eventData.dayOnePlayers}
                            </p>
                        )}
                    </>
                );
            case 'professors':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                <strong>{label(1, true)}</strong> {eventData.dayOneMasters}
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>{label(2, true)}</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                    </>
                );
            case 'seniors':
                if (!showPhaseCounts) {
                    return null;
                }
                const totalSrs = seniorsResults.length;
                const day2Srs = day2Results.length;
                const day1CountSrs = eventData.dayOneSeniors ?? totalSrs;
                const day2CountSrs = eventData.dayTwoSeniors ?? day2Srs;
                return (
                    <>
                        <p>
                            <strong>{label(1, true)}</strong> {day1CountSrs}{' '}
                            {division.charAt(0).toUpperCase() + division.slice(1)}
                        </p>
                        <p>
                            <strong>{label(2, true)}</strong> {day2CountSrs}{' '}
                            {division.charAt(0).toUpperCase() + division.slice(1)}
                        </p>
                    </>
                );
            case 'juniors':
                if (!showPhaseCounts) {
                    return null;
                }
                const totalJrs = juniorsResults.length;
                const day2Jrs = day2Results.length;
                const day1CountJrs = eventData.dayOneJuniors ?? totalJrs;
                const day2CountJrs = eventData.dayTwoJuniors ?? day2Jrs;
                return (
                    <>
                        <p>
                            <strong>{label(1, true)}</strong> {day1CountJrs}{' '}
                            {division.charAt(0).toUpperCase() + division.slice(1)}
                        </p>
                        <p>
                            <strong>{label(2, true)}</strong> {day2CountJrs}{' '}
                            {division.charAt(0).toUpperCase() + division.slice(1)}
                        </p>
                    </>
                );
            case 'olderSeniors':
                return (
                    <>
                        {eventData?.dayOneSeniors && (
                            <p>
                                <strong>{label(1, true)}</strong> {eventData.dayOneSeniors}
                            </p>
                        )}
                    </>
                );
            case 'youngSeniors':
                return (
                    <>
                        {eventData?.dayOneJuniors && (
                            <p>
                                <strong>{label(1, true)}</strong> {eventData.dayOneJuniors}
                            </p>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const getEventFormat = (division) => {
        if (division === 'professors' && eventData?.formatProfessors) {
            return eventData.formatProfessors;
        }
        return eventData?.format;
    };

    const handleTabChange = (tab) => {
        setViewTab(tab);

        if (tab === 'Decks') {
            setShowAllDecks(false);
            setEliminatedDecks([]);
        } else {
            setShowAllRecs(false);
            setEliminatedRecords([]);
        }
    };

    const handleActiveTabChange = (tab) => {
        setActiveTab(tab);
    };

    const dayOneTypeArray = React.useMemo(() => {
        if (isModernEvent) {
            const allDayOneDecks = [...eliminatedDecks, ...day2Results];
            const dayOneMap = allDayOneDecks.reduce((acc, player) => {
                let s1 = player.sprite1 || '';
                let s2 = player.sprite2 || '';
                if (!s1 && !s2 && player.decklist) {
                    const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
                    s1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
                    s2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '');
                }
                if (s2 === 'hyphen') return acc;
                const key = getCustomLabel(eventId, s1, s2);
                if (!acc[key]) acc[key] = { count: 0, sprites: [] };
                acc[key].count++;
                [s1, s2].forEach(s => {
                    if (s && s !== 'blank' && !acc[key].sprites.includes(s)) {
                        acc[key].sprites.push(s);
                    }
                });
                return acc;
            }, {});
            return Object.entries(dayOneMap)
                .map(([key, { count, sprites }]) => ({ key, count, sprites }))
                .filter(item => item.key !== 'blank-')      // ← remove the empty-sprite bucket
                .sort((a, b) => b.count - a.count);
        }

        // pre-2025: safely default to an empty array if there is no dayOneMeta
        const meta = eventData?.dayOneMeta ?? [];
        return meta
            .map(m => {
                const s1 = (m.sprite1 || '').replace('.png', '');
                const s2 = (m.sprite2 || '').replace('.png', '');
                const sprites = [];
                if (s1 && s1 !== 'blank') sprites.push(s1);
                if (s2 && s2 !== 'blank') sprites.push(s2);
                return {
                    key: getCustomLabel(eventId, s1, s2),
                    count: m.deckcount,
                    sprites,
                };
            })
            .sort((a, b) => b.count - a.count);
    },
        [
            isModernEvent,
            eliminatedDecks,
            day2Results,
            eventData?.dayOneMeta,
            eventId
        ]
    );

    const archetypes = useMemo(() => {
        // gather every archetype you know *plus* “Other”
        const keys = new Set();
        matchupRecordByArchetype.forEach(r => keys.add(r.key));
        keys.add('Other');
        return Array.from(keys);
    }, [matchupRecordByArchetype]);

    const headToHead = useMemo(() => {
        // init empty buckets
        const m = {};
        archetypes.forEach(rk => {
            m[rk] = {};
            archetypes.forEach(ck => {
                m[rk][ck] = { wins: 0, losses: 0, ties: 0 };
            });
        });

        // pick which players (day1/day2/combined)
        const source = getMatchupSourcePlayers();

        source.forEach(p => {
            const myKey = getCustomLabel(eventId, p.sprite1, p.sprite2) || 'Other';

            // If somehow we didn’t seed this bucket, skip
            if (!m[myKey]) return;

            getRoundsForMatchupDay(p).forEach(([, info]) => {
                const { code: flag, name: oppName } = parseOpponent(info.name);
                const opp = source.find(pl => pl.name === oppName && pl.flag === flag);

                // always default to Other
                const oppKey = opp
                    ? (getCustomLabel(eventId, opp.sprite1, opp.sprite2) || 'Other')
                    : 'Other';

                // if this meta‐matchup wasn’t initialized, seed it now
                if (!m[myKey][oppKey]) {
                    m[myKey][oppKey] = { wins: 0, losses: 0, ties: 0 };
                }

                const cell = m[myKey][oppKey];
                if (info.result === 'W') cell.wins++;
                else if (info.result === 'L') cell.losses++;
                else if (info.result === 'T') cell.ties++;
            });
        });

        return m;
    }, [matchupDay, day2Results, eliminatedDecks, archetypes, eventId]);

    const spriteMap = React.useMemo(() => {
        return matchupRecordByArchetype.reduce((m, { key, sprites }) => {
            m[key] = sprites;
            return m;
        }, {});
    }, [matchupRecordByArchetype]);

    const summaryByArchetype = useMemo(() => {
        return archetypes.reduce((acc, key) => {
            const { wins, losses, ties } = headToHead[key][key];
            acc[key] = { wins, losses, ties };
            return acc;
        }, {});
    }, [archetypes, headToHead]);

    // useEffect(() => {
    //     if (isModernEvent && (showDayOneMeta || showConversionRate) && eliminatedDecks.length === 0) {
    //         loadEliminated();
    //     }
    // }, [isModernEvent, showDayOneMeta, showConversionRate, eliminatedDecks.length]);

    useEffect(() => {
        if (usesPhaseData && eliminatedDecks.length === 0) {
            loadEliminated();
        }
    }, [usesPhaseData, eliminatedDecks.length]);

    useEffect(() => {
        if (!eventData) return;

        const raw = sessionStorage.getItem(EVENT_PAGE_STATE_KEY);
        if (!raw) return;

        try {
            const state = JSON.parse(raw);

            const isExpired = Date.now() - Number(state.savedAt || 0) > 2 * 60 * 1000;

            if (isExpired) {
                sessionStorage.removeItem(EVENT_PAGE_STATE_KEY);
                return;
            }

            if (state.division) setDivision(state.division);
            if (state.activeTab) setActiveTab(state.activeTab);
            if (state.viewTab) setViewTab(state.viewTab);
            if (state.dataDay) setDataDay(state.dataDay);
            if (typeof state.showAllDecks === 'boolean') setShowAllDecks(state.showAllDecks);
            if (typeof state.showAllPlayers === 'boolean') setShowAllPlayers(state.showAllPlayers);
            if (typeof state.showAllRecs === 'boolean') setShowAllRecs(state.showAllRecs);
            if (state.matchupDay) setMatchupDay(state.matchupDay);
            if (state.matchupView) setMatchupView(state.matchupView);
            if (state.statView) setStatView(state.statView);
            if (state.selectedArchetype) setSelectedArchetype(state.selectedArchetype);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo(0, Number(state.scrollY) || 0);
                    sessionStorage.removeItem(EVENT_PAGE_STATE_KEY);
                });
            });
        } catch {
            sessionStorage.removeItem(EVENT_PAGE_STATE_KEY);
        }
    }, [eventData, EVENT_PAGE_STATE_KEY]);

    if (!eventData) {
        return (
            <EventPageContent theme={theme}>
                <div className="deck-profile-spinner-wrap">
                    <img
                        src={blueUltraBallSpinner}
                        alt="Loading"
                        className="pokeball-spinner"
                    />
                </div>
            </EventPageContent>
        );
    }

    const divisionLabelMap = {
        masters: 'Masters',
        seniors: 'Seniors',
        juniors: 'Juniors',
        professors: 'Professors',
        olderSeniors: 'Older Seniors',
        youngSeniors: 'Young Seniors',
        all: 'All Divisions'
    };

    const divisionLabel = divisionLabelMap[division] || 'Masters';

    const totalResultsCount =
        (eventData?.masters?.length || 0) +
        (eventData?.seniors?.length || 0) +
        (eventData?.juniors?.length || 0) +
        (eventData?.professors?.length || 0) +
        (eventData?.olderSeniors?.length || 0) +
        (eventData?.youngSeniors?.length || 0) +
        (eventData?.all?.length || 0);

    const canonicalUrl = `https://www.ptcglegends.com/tournaments/${eventId}`;
    const pageTitle = eventData
        ? `${eventData.name} ${divisionLabel} Results & Decklists | PTCG Legends`
        : `Tournament Results & Decklists | PTCG Legends`;

    const pageDescription = eventData
        ? `${eventData.name} ${divisionLabel} results, standings, decklists, and tournament data on PTCG Legends. View placements, archetypes, and player decks from ${eventData.date}.${totalResultsCount ? ` Featuring ${totalResultsCount}+ tournament results across divisions.` : ''}`
        : `Pokémon TCG tournament results, standings, and decklists on PTCG Legends.`;

    const socialImage =
        eventData?.thumbnail ||
        'https://www.ptcglegends.com/images/tournaments-default-preview.png';

    const isMastersEmpty = mastersResults.length === 0;
    const otherDivisionsHaveResults =
        seniorsResults.length > 0 ||
        juniorsResults.length > 0 ||
        professorsResults.length > 0;

    let combinedData;

    if (isModernEvent) {
        // ——— NEW 2025+ logic ———
        // Build Day 1 counts off of your dynamic "dayOneTypeArray"
        const dayOneItems = dayOneTypeArray.map(e => ({ label: e.key, count: e.count }));
        // Build Day 2 counts off of your deckTypeCountArray
        const dayTwoItems = deckTypeCountArray.map(e => ({ label: e.key, count: e.count }));

        // Zip them together
        combinedData = dayOneItems.map(({ label, count: dayOneCount }) => {
            const dayTwoCount = dayTwoItems.find(d2 => d2.label === label)?.count || 0;
            const rate = dayOneCount > 0
                ? ((dayTwoCount / dayOneCount) * 100).toFixed(2)
                : '0.00';
            return { label, conversionRate: rate };
        });
    } else {
        // ——— FALLBACK pre-2025 logic ———
        // Use your existing dayOneMeta → chartResults reduce
        const dayOneData = eventData.dayOneMeta || [];
        const dayTwoData = chartResults;

        combinedData = dayOneData.reduce((acc, dayOneDeck) => {
            const dayOneLabel = getCustomLabel(eventId, dayOneDeck.sprite1, dayOneDeck.sprite2);

            // find matching Day 2 decks…
            const matches = dayTwoData.filter(d2 => {
                const { firstSprite, secondSprite } = getPokemonSprites(d2.decklist, '', '');
                const d2Label = getCustomLabel(
                    eventId,
                    firstSprite.replace('/assets/sprites/', '').replace('.png', ''),
                    secondSprite.replace('/assets/sprites/', '').replace('.png', '')
                );
                return d2Label === dayOneLabel;
            });

            const dayTwoCount = matches.length;
            const rate = dayOneDeck.deckcount > 0
                ? ((dayTwoCount / dayOneDeck.deckcount) * 100).toFixed(2)
                : '0.00';

            acc.push({ label: dayOneLabel, conversionRate: rate });
            return acc;
        }, []);
    }

    const conversionChartData = {
        labels: combinedData.map(d => d.label),
        datasets: [{
            label: '% Conversion',
            data: combinedData.map(d => d.conversionRate),
            backgroundColor: '#1290eb8b'
        }]
    };

    const nonBlankDecks = finalDeckTypeCountArray.filter(e => e.key !== 'blank-');

    const buildMetaShareRows = (rows) => {
        const cleanRows = rows.filter(e => e.key !== 'blank-');
        const total = cleanRows.reduce((sum, deck) => sum + deck.count, 0);

        return cleanRows.map(deck => ({
            ...deck,
            percent: total > 0
                ? ((deck.count / total) * 100).toFixed(1)
                : '0.0'
        }));
    };

    const dayTwoMetaRows = buildMetaShareRows(nonBlankDecks);
    const dayOneMetaRows = buildMetaShareRows(dayOneTypeArray);

    const conversionMetaRows = combinedData
        .map(d => {
            const matchingDayOneDeck = dayOneTypeArray.find(deck => deck.key === d.label);
            const matchingDayTwoDeck = nonBlankDecks.find(deck => deck.key === d.label);

            return {
                key: d.label,

                // this keeps the pie hover as real deck count
                count: matchingDayTwoDeck?.count || 0,

                // this keeps the legend as conversion %
                percent: Number(d.conversionRate).toFixed(1),

                sprites: matchingDayOneDeck?.sprites || matchingDayTwoDeck?.sprites || []
            };
        })
        .filter(deck => deck.key && deck.key !== 'blank-')
        .sort((a, b) => Number(b.percent) - Number(a.percent));

    const metaShareRows = showConversionRate
        ? conversionMetaRows
        : showDayOneMeta
            ? dayOneMetaRows
            : dayTwoMetaRows;

    const shouldGroupOtherDecks = metaShareRows.length > 10 && !showConversionRate;

    const doughnutRows = shouldGroupOtherDecks
        ? (() => {
            const mainDecks = metaShareRows.filter(deck => Number(deck.percent) >= 2);
            const otherDecks = metaShareRows.filter(deck => Number(deck.percent) < 2);

            const otherCount = otherDecks.reduce((sum, deck) => sum + deck.count, 0);

            if (otherCount === 0) return mainDecks;

            const visibleTotal = metaShareRows.reduce((sum, deck) => sum + deck.count, 0);

            return [
                ...mainDecks,
                {
                    key: 'Other Decks',
                    count: otherCount,
                    percent: visibleTotal > 0
                        ? ((otherCount / visibleTotal) * 100).toFixed(1)
                        : '0.0',
                    sprites: []
                }
            ];
        })()
        : metaShareRows;

    const chartData = showDayOneMeta
        ? {
            labels: dayOneTypeArray.map(e => e.key),
            datasets: [{
                label: 'Deck Count',
                data: dayOneTypeArray.map(e => e.count),
                backgroundColor: '#1291eb8b'
            }]
        }
        : showConversionRate
            ? conversionChartData
            : {
                labels: nonBlankDecks.map(e => e.key),
                datasets: [{
                    label: 'Deck Count',
                    data: nonBlankDecks.map(e => e.count),
                    backgroundColor: '#1291eb8b'
                }]
            };

    const doughnutColors = [
        '#ff0000', // Red
        '#ff7f00', // Orange
        '#ffd700', // Yellow
        '#7fff00', // Yellow-Green
        '#00c853', // Green
        '#00bcd4', // Cyan
        '#2196f3', // Blue
        '#3f51b5', // Indigo
        '#7b1fa2', // Violet
        '#e91e63', // Pink
        '#ff4081', // Hot Pink
        '#ff5722', // Deep Orange
    ];

    const isDarkMode = theme.themeName === 'dark';
    const doughnutBorderColor = isDarkMode
        ? '#27292C'
        : '#ffffff';

    const doughnutData = {
        labels: doughnutRows.map(e => e.key),
        datasets: [{
            label: 'Deck Count',
            data: doughnutRows.map(e => e.count),
            borderColor: doughnutBorderColor,
            borderWidth: 3,
            backgroundColor: (context) => {
                const { chart, dataIndex } = context;
                const { ctx, chartArea } = chart;

                if (!chartArea) return doughnutColors[dataIndex % doughnutColors.length];
                const deck = doughnutRows[dataIndex];
                if (deck.key === 'Other Decks') {
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

                    gradient.addColorStop(0, 'rgb(210, 210, 210)');
                    gradient.addColorStop(1, 'rgb(245, 245, 245)');

                    return gradient;
                }

                const base = doughnutColors[dataIndex % doughnutColors.length];

                const gradient = ctx.createLinearGradient(
                    chartArea.left,
                    chartArea.top,
                    chartArea.right,
                    chartArea.bottom
                );

                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, base);

                return gradient;
            },

            offset: doughnutRows.map((deck, index) => {
                if (index === 0) return 28;
                return [0, 0, 0, 0, 0, 0][index % 6];
            }),

            hoverOffset: 50,
            spacing: 0
        }]
    };

    const pieOptions = {
        cutout: '37.5%',
        radius: '125%',
        layout: {
            padding: 35
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        onHover: (event, activeElements) => {
            if (activeElements.length > 0) {
                setHoveredDoughnutIndex(activeElements[0].index);
            } else {
                setHoveredDoughnutIndex(null);
            }
        },
        maintainAspectRatio: false
    };

    const dropdownOptions = dataDay === 'day2'
        ? finalDeckTypeCountArray
        : dayOneTypeArray;

    const handleDayOneClick = () => {
        setShowDayOneMeta(true);
        setShowConversionRate(false);
    };

    const handleDayTwoClick = () => {
        setShowDayOneMeta(false);
        setShowConversionRate(false);
        const topDay2 = dropdownOptions[0]?.key || '';
        setSelectedArchetype(topDay2);
        sessionStorage.setItem(
            `selectedArchetype_${eventId}`,
            topDay2
        );
    };
    const handleConversionRateClick = () => {
        setShowDayOneMeta(false);
        setShowConversionRate(true);
    };

    function countByArchetype(players, eventId) {
        return players.reduce((acc, player) => {
            let { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
            firstSprite = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
            secondSprite = secondSprite.replace('/assets/sprites/', '').replace('.png', '');

            // skip hyphens/blanks
            if (secondSprite === 'hyphen') return acc;

            const key = getCustomLabel(eventId, firstSprite || '', secondSprite || '');
            if (!key) return acc;

            acc[key] = acc[key] || { count: 0, sprite: firstSprite || secondSprite };
            acc[key].count++;
            return acc;
        }, {});
    }
    const allResultsPlayers = usesPhaseData
        ? [...day2Results, ...eliminatedDecks]
        : resultsWithPlacement;
    const source = dataDay === 'day2'
        ? day2Results
        : [...day2Results, ...eliminatedDecks];
    const filteredResults = (dataDay === 'day2'
        ? day2Results
        : [...day2Results, ...eliminatedDecks]
    ).filter(p => {
        let s1 = p.sprite1 || '', s2 = p.sprite2 || '';
        if (!s1 && !s2 && p.decklist) {
            const { firstSprite, secondSprite } = getPokemonSprites(p.decklist, '', '');
            s1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
            s2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '');
        }
        return getCustomLabel(eventId, s1, s2) === selectedArchetype;
    });

    const normalizePlayerSearch = (value) =>
        value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const shouldFilterPlayers = playerSearch.trim().length >= 2;

    const filterPlayersBySearch = (players) => {
        if (!shouldFilterPlayers) return players;

        const query = normalizePlayerSearch(playerSearch.trim());

        return players.filter(player =>
            normalizePlayerSearch(player.name || '').includes(query)
        );
    };

    const searchedDay2Results = filterPlayersBySearch(day2Results);
    const searchedEliminatedDecks = filterPlayersBySearch(eliminatedDecks);
    const searchedEliminatedRecords = filterPlayersBySearch(eliminatedRecords);

    const allVisiblePlayersForFilters = [...day2Results, ...eliminatedDecks];

    const countryCounts = allVisiblePlayersForFilters.reduce((acc, player) => {
        const code = player.flag || 'unknown';
        acc[code] = (acc[code] || 0) + 1;
        return acc;
    }, {});

    const countryCountArray = Object.entries(countryCounts)
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count);

    const filterPlayersByCountry = (players) => {
        if (!selectedCountry) return players;
        return players.filter(player => (player.flag || 'unknown') === selectedCountry);
    };

    const filteredDay2Results = filterPlayersByCountry(searchedDay2Results);
    const filteredEliminatedDecks = filterPlayersByCountry(searchedEliminatedDecks);
    const filteredEliminatedRecords = filterPlayersByCountry(searchedEliminatedRecords);

    const getDayOneMetaSprites = (meta) => {
        return {
            firstSprite: meta.sprite1 || '',
            secondSprite: meta.sprite2
        };
    };

    const centerImagePlugin = {
        id: 'centerImage',

        afterDraw(chart) {
            const { ctx } = chart;

            const image = new Image();
            image.src = eventData?.eventLogo;

            image.onload = () => {
                const x =
                    chart.getDatasetMeta(0).data[0].x;

                const y =
                    chart.getDatasetMeta(0).data[0].y;

                ctx.drawImage(
                    image,
                    x - 75,
                    y - 40,
                    150,
                    80
                );
            };
        }
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
        },
        hover: {
            mode: null,
        },
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        events: [],
        layout: {
            padding: {
                top: 20,
            },
        },
        animation: {
            onComplete: () => {
                setIsChartReady(true);
            }
        }
    };

    const handleCardClick = (card) => {
        navigate(`/card/${card.set}/${card.number}`);
    };

    const handleArchetypeChange = (e) => {
        const archetype = e.target.value;
        setSelectedArchetype(archetype);
        sessionStorage.setItem(`selectedArchetype_${eventId}`, archetype);
    };

    const hasChartData = chartData.labels && chartData.labels.length > 0;
    const resultsAvailable = results.length > 0;
    const statisticsTabStyle = !resultsAvailable ? { opacity: 0.1, pointerEvents: 'none' } : {};
    const hasDayOneMeta = eventData?.dayOneMeta !== undefined;
    const is2024Event = eventId.includes('2024') || isModernEvent && !eventId.toLowerCase().includes('retro');

    return (
        <EventPageContent className='center' theme={theme}>
            <Helmet>
                <title>{pageTitle}</title>

                <meta name="description" content={pageDescription} />
                <meta name="author" content="PTCG Legends" />
                <meta
                    name="keywords"
                    content={`${eventData?.name || 'Pokemon TCG tournament'}, Pokémon TCG results, Pokemon tournament results, ${divisionLabel} results, Pokémon decklists, PTCG Legends`}
                />

                <link rel="canonical" href={canonicalUrl} />

                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={socialImage} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="PTCG Legends" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={socialImage} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SportsEvent',
                        name: eventData?.name || 'Pokémon TCG Tournament',
                        startDate: eventData?.date || undefined,
                        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                        eventStatus: 'https://schema.org/EventCompleted',
                        url: canonicalUrl,
                        image: socialImage,
                        description: pageDescription,
                        organizer: {
                            '@type': 'Organization',
                            name: 'PTCG Legends'
                        }
                    })}
                </script>
            </Helmet>
            <div className='regional-container'>
                {division !== 'all' && (
                    <div className='top-divisions'>
                        {eventData.masters ? (
                            <Link
                                className={`mastersBtn ${division === 'masters' ? 'active-division' : 'other-division'
                                    }`}
                                to={`/tournaments/${eventId}/masters`}
                                style={{
                                    opacity: isMastersEmpty && otherDivisionsHaveResults ? 0.1 : 1,
                                    pointerEvents:
                                        isMastersEmpty && otherDivisionsHaveResults
                                            ? 'none'
                                            : 'all',
                                }}
                            >
                                Masters
                            </Link>
                        ) : eventData.professors ? (
                            <Link
                                className={`professorsBtn ${division === 'professors'
                                    ? 'active-division'
                                    : 'other-division'
                                    }`}
                                to={`/tournaments/${eventId}/professors`}
                                style={{ opacity: 1, pointerEvents: 'all' }}
                            >
                                Professors
                            </Link>
                        ) : null}
                        {eventData.olderSeniors || eventData.youngSeniors ? (
                            <>
                                {eventData.olderSeniors && (
                                    <Link
                                        className={`olderSeniorsBtn ${division === 'olderSeniors'
                                            ? 'active-division'
                                            : 'other-division'
                                            }`}
                                        to={`/tournaments/${eventId}/olderSeniors`}
                                        style={{ opacity: 1, pointerEvents: 'all' }}
                                    >
                                        Older Seniors
                                    </Link>
                                )}
                                {eventData.youngSeniors && (
                                    <Link
                                        className={`youngSeniorsBtn ${division === 'youngSeniors'
                                            ? 'active-division'
                                            : 'other-division'
                                            }`}
                                        to={`/tournaments/${eventId}/youngSeniors`}
                                        style={{ opacity: 1, pointerEvents: 'all' }}
                                    >
                                        Young Seniors
                                    </Link>
                                )}
                            </>
                        ) : (
                            <Link
                                className={`seniorsBtn ${division === 'seniors' ? 'active-division' : 'other-division'
                                    }`}
                                to={`/tournaments/${eventId}/seniors`}
                                style={{
                                    opacity: eventData.seniors ? 1 : 0.1,
                                    pointerEvents: eventData.seniors ? 'all' : 'none',
                                }}
                            >
                                Seniors
                            </Link>
                        )}
                        <Link
                            className={`juniorsBtn ${division === 'juniors' ? 'active-division' : 'other-division'
                                }`}
                            to={`/tournaments/${eventId}/juniors`}
                            style={{
                                opacity: eventData.juniors ? 1 : 0.1,
                                pointerEvents: eventData.juniors ? 'all' : 'none',
                            }}
                        >
                            Juniors
                        </Link>
                    </div>
                )}
                <div className='regional-info'>
                    <div className='left-regional-info'>
                        <h2>{eventData.name}</h2>
                        <p>{eventData.date}</p>
                        <div className='place-n-flag'>
                            <img
                                src={flagForDiffPurpose[eventData.flag]}
                                alt={`Flag of ${eventData.flag.toUpperCase()}`}
                            />
                            <p>{eventData.location}</p>
                        </div>
                        {eventData.address && (
                            <p>
                                Venue Address:{' '}
                                <a href={eventData.address} target='_blank'>
                                    Map
                                </a>
                            </p>
                        )}
                        {eventData.eventSite && (
                            <p>
                                Event{' '}
                                <a href={eventData.eventSite} target='_blank'>
                                    Website
                                </a>
                            </p>
                        )}
                        {(eventData.streamsDay1 ||
                            eventData.streamsDay2 ||
                            eventData.streamsDay3) && (
                                <p>
                                    Streams:&nbsp;
                                    {eventData.streamsDay1 && (
                                        <a href={eventData.streamsDay1} target='_blank'>
                                            Day 1
                                        </a>
                                    )}
                                    {eventData.streamsDay1 && eventData.streamsDay2 && ' | '}
                                    {eventData.streamsDay2 && (
                                        <a href={eventData.streamsDay2} target='_blank'>
                                            Day 2
                                        </a>
                                    )}
                                    {eventData.streamsDay2 && eventData.streamsDay3 && ' | '}
                                    {eventData.streamsDay3 && (
                                        <a href={eventData.streamsDay3} target='_blank' rel='noopener noreferrer'>
                                            Day 3
                                        </a>
                                    )}
                                    {eventData.streamsDay4 && (
                                        <>
                                            {eventData.streamsDay3 && " | "}
                                            <a href={eventData.streamsDay4} target='_blank' rel='noopener noreferrer'>
                                                Finals
                                            </a>
                                        </>
                                    )}
                                </p>
                            )}
                    </div>
                    <img
                        className={`regional-info-bg-logo ${[
                            'worldsOfour',
                            'oFourNationals',
                            'oldNationals',
                            'stadiumChallenge',
                            'stadiumChallenge',
                        ].includes(eventData.eventLogo)
                            ? 'pushed-logo'
                            : ''
                            } ${eventData.eventLogo === 'superTrainerShowdown' || 'megaTropicalBattle' ? 'sts-logo' : ''}`}
                        src={logos[eventData.eventLogo]}
                        alt='event logo'
                    />
                    <hr className='reg-hr'></hr>
                    <div className='outer-links'>
                        {eventData.organizer && (
                            <p>
                                <strong>Organizer:</strong>{' '}
                                <a href={eventData.organizerLink} target='_blank'>
                                    {eventData.organizer}
                                </a>
                            </p>
                        )}
                        {eventData.format && eventData.format.toUpperCase() !== 'TBA' && (
                            <p>
                                <strong>Format:</strong>{' '}
                                <Link to={`/decks?format=${encodeURIComponent(eventData.format)}`}>
                                    {getEventFormat(division)}
                                </Link>
                                {eventData.formatAdd && (
                                    <span>
                                        &nbsp;{eventData.formatAdd}
                                    </span>
                                )}
                            </p>
                        )}

                        {getPlayerCount(division)}
                    </div>
                </div>
                <div className='bottom-options'>
                    <a
                        className={`event-option ${activeTab === 'Results' ? 'active-option' : ''}`}
                        onClick={() => {
                            setActiveTab('Results');
                            setShowAllDecks(false);
                        }}
                    >
                        Results
                    </a>
                    <a
                        className={`event-option ${activeTab === 'Statistics' ? 'active-option' : ''}`}
                        onClick={() => {
                            // only open Statistics when allowed…
                            if (resultsAvailable) {
                                setActiveTab('Statistics');
                                setStatView('meta');      // ← reset to the “Meta” sub‐tab
                            }
                        }}
                    >
                        Statistics
                    </a>
                    <a className='event-option' style={{ opacity: 0.1, pointerEvents: 'none' }}>More</a>
                </div>
                <div className='contain-event'>
                    <div className='event-content'>
                        {activeTab === 'Results' ? (
                            <div className='event-results' onClickCapture={handleEventResultsClickCapture}>
                                {usesPhaseData && (
                                    <div className="decks-records-btns">
                                        <button
                                            onClick={() => handleTabChange('Decks')}
                                            className={viewTab === 'Decks' ? 'active' : ''}
                                            style={{ backgroundColor: viewTab === 'Decks' ? '#1290eb' : 'grey' }}
                                        >
                                            Decklists
                                        </button>
                                        <button
                                            onClick={() => handleTabChange('Records')}
                                            className={viewTab === 'Records' ? 'active' : ''}
                                            style={{ backgroundColor: viewTab === 'Records' ? '#1290eb' : 'grey' }}
                                        >
                                            Records
                                        </button>
                                    </div>
                                )}
                                {results.length > 0 && (
                                    <div className="country-filter-toggle-wrap">
                                        <button
                                            type="button"
                                            className="country-filter-toggle"
                                            onClick={() => setShowCountryFilter(prev => !prev)}
                                        >
                                            Country Filter
                                            <span className="material-symbols-outlined">
                                                {showCountryFilter ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                            </span>
                                        </button>
                                    </div>
                                )}
                                {showCountryFilter && (
                                    <div className="results-country-filter">
                                        <div className="region-filter-counts">
                                            {regionCountArray.map(({ region, count }) => (
                                                <div key={region} className="region-count-item">
                                                    <span>{region}</span>
                                                    <strong>{count}</strong>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="country-filter-divider" />
                                        <button
                                            type="button"
                                            className={`country-filter-item ${!selectedCountry ? 'active-country-filter' : ''}`}
                                            onClick={() => setSelectedCountry('')}
                                            title="All countries"
                                        >
                                            <img src={flags.all} alt="All countries" />
                                            <span>{allResultsPlayers.length}</span>
                                        </button>
                                        {countryCountArray.map(({ code, count }) => (
                                            <button
                                                key={code}
                                                type="button"
                                                className={`country-filter-item ${selectedCountry === code ? 'active-country-filter' : ''}`}
                                                onClick={() => setSelectedCountry(code)}
                                                title={getCountryName(code)}
                                            >
                                                <img src={flags[code] || flags.unknown} alt={code} />
                                                <span>{count}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {results.length > 0 && (
                                    <div className="results-player-search">
                                        <div className="player-search-wrapper">
                                            <input
                                                type="text"
                                                value={playerSearch}
                                                onChange={(e) => setPlayerSearch(e.target.value)}
                                                placeholder="Search player name..."
                                            />
                                            {playerSearch && (
                                                <button
                                                    type="button"
                                                    className="clear-player-search"
                                                    onClick={() => setPlayerSearch('')}
                                                    aria-label="Clear search"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {viewTab === 'Decks' ? (
                                    results.length ? (
                                        <>
                                            {displayResults(filteredDay2Results, eventId, division, undefined, getEventFormat(division))}

                                            {usesPhaseData && eventId !== '2025_BALTIMORE' && eventId !== '2025_TOKYO_CL' && !showAllDecks && !loadingEliminatedDecks && (
                                                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                                    <button onClick={loadEliminated} className="day1buttons">
                                                        Show {label(1)} Results
                                                    </button>
                                                </div>
                                            )}

                                            {loadingEliminatedDecks && (
                                                <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                                                    Loading {label(1)} Results
                                                </p>
                                            )}

                                            {showAllDecks && eliminatedDecks.length > 0 && (
                                                <>
                                                    <div className="day-divider">
                                                        <span>{label(2)} cutoff</span>
                                                    </div>
                                                    {/* <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                                        <button
                                                            onClick={() => setShowAllDecks(false)}
                                                            className="day1buttons"
                                                        >
                                                            Hide {label(1)} Results
                                                        </button>
                                                    </div> */}
                                                    {displayResults(
                                                        filteredEliminatedDecks,
                                                        eventId,
                                                        division,
                                                        undefined,
                                                        getEventFormat(division)
                                                    )}
                                                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                                        <button
                                                            onClick={() => setShowAllDecks(false)}
                                                            className="day1buttons"
                                                        >
                                                            Hide {label(1)} Results
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <p className='notavailable'>Results not yet available</p>
                                    )
                                ) : (
                                    <>
                                        <ul className="result-list-ol">
                                            {filteredDay2Results.map((p, i) => {
                                                const { wins = 0, losses = 0, ties = 0 } = p.record ?? {};
                                                const matchPts = wins * 3 + ties * 1;
                                                const imgSrc = p.flag
                                                    ? (flags[p.flag] || '')
                                                    : flags.unknown;
                                                return (
                                                    <li
                                                        key={`d2-${i}`}
                                                        className="player-list-hover records-list-hover"
                                                        onClick={() => handleRecordClick(p)}
                                                    >
                                                        <div className='results-list-item'>
                                                            <div className='name-n-flag'>
                                                                <span className="player-placement">
                                                                    {p.placing !== 9999 ? `${p.placing}.` : ''}
                                                                </span>
                                                                <div className="flag-container">
                                                                    <img
                                                                        className='flag-size'
                                                                        src={imgSrc}
                                                                        alt={p.flag}
                                                                    />
                                                                    <div className="flag-tooltip">
                                                                        {getCountryName(p.flag)}
                                                                    </div>
                                                                </div>
                                                                <Link
                                                                    className="link-to-playerrecords"
                                                                    style={{ pointerEvents: 'none' }}
                                                                >
                                                                    {formatName(p.name)}
                                                                </Link>
                                                            </div>
                                                            <div className="player-stats">
                                                                <span className="match-points">{matchPts}</span>
                                                                <span className="record-summary">
                                                                    {wins}-{losses}-{ties}
                                                                </span>
                                                            </div>
                                                            {(() => {
                                                                let sprites;
                                                                if (p?.sprite1) {
                                                                    sprites = { first: p.sprite1, second: p.sprite2 };
                                                                } else if (p?.decklist) {
                                                                    const { firstSprite, secondSprite } = getPokemonSprites(p.decklist, '', '');
                                                                    sprites = { first: firstSprite, second: secondSprite };
                                                                }
                                                                return sprites ? (
                                                                    <span className="record-sprites" style={{ display: 'inline-flex', gap: 6, marginLeft: 8 }}>
                                                                        <DisplayPokemonSprites
                                                                            decklist={p.decklist}
                                                                            sprite1={sprites.first}
                                                                            sprite2={sprites.second}
                                                                        />
                                                                    </span>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="day-divider">
                                            <span>{label(2)}</span>
                                        </div>

                                        {/* ─── Day 1 players ─── */}
                                        <ul className="result-list-ol">
                                            {filteredEliminatedRecords.map((p, i) => {
                                                const { wins = 0, losses = 0, ties = 0 } = p.record ?? {};
                                                const matchPts = wins * 3 + ties * 1;
                                                const imgSrc = p.flag
                                                    ? (flags[p.flag] || '')
                                                    : flags.unknown;
                                                return (
                                                    <li
                                                        key={`d1-${i}`}
                                                        className="player-list-hover records-list-hover"
                                                        onClick={() => handleRecordClick(p)}
                                                    >
                                                        <div className='results-list-item'>
                                                            <div className='name-n-flag'>
                                                                <span className="player-placement">
                                                                    {p.placing !== 9999 ? `${p.placing}.` : ''}
                                                                </span>
                                                                <div className="flag-container">
                                                                    <img
                                                                        className='flag-size'
                                                                        src={imgSrc}
                                                                        alt={p.flag}
                                                                    />
                                                                    <div className="flag-tooltip">
                                                                        {getCountryName(p.flag)}
                                                                    </div>
                                                                </div>
                                                                <Link
                                                                    className="link-to-playerrecords"
                                                                    style={{ pointerEvents: 'none' }}
                                                                >
                                                                    {formatName(p.name)}
                                                                </Link>
                                                            </div>
                                                            <div className="player-stats">
                                                                <span className="match-points">{matchPts}</span>
                                                                <span className="record-summary">
                                                                    {wins}-{losses}-{ties}
                                                                </span>
                                                            </div>
                                                            {(() => {
                                                                let sprites;
                                                                if (p?.sprite1) {
                                                                    sprites = { first: p.sprite1, second: p.sprite2 };
                                                                } else if (p?.decklist) {
                                                                    const { firstSprite, secondSprite } = getPokemonSprites(p.decklist, '', '');
                                                                    sprites = { first: firstSprite, second: secondSprite };
                                                                }
                                                                return sprites ? (
                                                                    <span className="record-sprites" style={{ display: 'inline-flex', gap: 6, marginLeft: 8 }}>
                                                                        <DisplayPokemonSprites
                                                                            decklist={p.decklist}
                                                                            sprite1={sprites.first}
                                                                            sprite2={sprites.second}
                                                                        />
                                                                    </span>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className='event-statistics'>
                                <div className="stat-toggle-buttons" style={{ marginBottom: '1rem' }}>
                                    <button onClick={() => setStatView('meta')}
                                        className={statView === 'meta' ? 'active-button' : ''}>Meta
                                    </button>
                                    <button onClick={() => setStatView('decklists')}
                                        className={statView === 'decklists' ? 'active-button' : ''}>Decks
                                    </button>
                                    {showMatchupsTab && (
                                        <>
                                            <button
                                                className={`chart-button ${statView === 'records' ? 'active' : ''}`}
                                                onClick={() => setStatView('records')}
                                            >
                                                Records
                                            </button>
                                            <button
                                                className={`matchups-btn-only chart-button ${statView === 'matchups' ? 'active' : ''}`}
                                                onClick={() => setStatView('matchups')}
                                            >
                                                Matchups
                                            </button>
                                        </>
                                    )}
                                </div>
                                {statView === 'meta' && (
                                    <>
                                        <h3 className='stats-tab-h3-label'>Meta Share</h3>
                                        <div className='chart-btns-container'>
                                            <div className='alignrow'>
                                                <button
                                                    className={`chart-button day2btn ${!showDayOneMeta && !showConversionRate ? 'active' : ''}`}
                                                    onClick={handleDayTwoClick}
                                                >{label(2, true)}
                                                </button>
                                                {(
                                                    usesPhaseData ||
                                                    (!isModernEvent && eventData?.dayOneMeta?.length > 0 && division === 'masters')
                                                ) && (
                                                        <>
                                                            <button
                                                                className={`chart-button day1btn ${showDayOneMeta && !showConversionRate ? 'active' : ''}`}
                                                                onClick={handleDayOneClick}
                                                            >{label(1)}</button>
                                                            <button
                                                                className={`chart-button conversbtn ${showConversionRate ? 'active' : ''}`}
                                                                onClick={handleConversionRateClick}
                                                            >Conversion %
                                                            </button>
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                        {isModernEvent && chartResults.length > 16 && (
                                            <div className='chart-description'>
                                                {showDayOneMeta && !showConversionRate && <p>* Total count for each archetype from {label(1)}</p>}
                                                {!showDayOneMeta && !showConversionRate && <p>* Total count for each archetype from {label(2)} only</p>}
                                                {showConversionRate && (
                                                    <p>* Conversion rate of each archetype, from {label(1)} into {label(2)}<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;(decimal values = percentage)
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        <div className="meta-view-toggle">
                                            <button className={metaView === 'bar' ? 'active-button' : ''} onClick={() => setMetaView('bar')}>Bar</button>
                                            <button className={metaView === 'doughnut' ? 'active-button' : ''} onClick={() => setMetaView('doughnut')}>Pie</button>
                                            <button className={metaView === 'list' ? 'active-button' : ''} onClick={() => setMetaView('list')}>List</button>
                                        </div>
                                        {!hasChartData && (
                                            <div className='chart-description'><p>* No known decks available for this division</p></div>
                                        )}
                                        {metaView === 'bar' && (
                                            <div className='chart-container-wrapper' style={{ overflowX: 'auto', paddingBottom: showDayOneMeta ? '1rem' : undefined }}>
                                                <div className='chart-container' style={{ minWidth: `${Math.max(chartData.labels.length * 50, 600)}px`, height: '400px' }}>
                                                    <Bar
                                                        key={`bar-${eventId}-${division}-${showDayOneMeta}-${showConversionRate}`}
                                                        ref={chartRef}
                                                        data={chartData}
                                                        options={chartOptions}
                                                        plugins={[barSpritePlugin]}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {metaView === 'doughnut' && (
                                            <div className="pie-chart-container">
                                                <div className="meta-doughnut-canvas">
                                                    <Doughnut
                                                        ref={doughnutChartRef}
                                                        key={`doughnut-${eventId}-${division}-${doughnutRows.length}`}
                                                        data={doughnutData}
                                                        options={pieOptions}
                                                        plugins={[spriteOnDoughnutPlugin]}
                                                    />
                                                </div>
                                                <div className="meta-pie-legend">
                                                    {metaShareRows.map(deck => (
                                                        <div
                                                            key={deck.key}
                                                            className={`legend-row ${hoveredDoughnutIndex !== null && doughnutRows[hoveredDoughnutIndex]?.key === deck.key ? 'legend-row-highlighted' : ''}`}
                                                            onMouseEnter={() => {
                                                                const index = doughnutRows.findIndex(row => row.key === deck.key);

                                                                if (index === -1) return;

                                                                setHoveredDoughnutIndex(index);

                                                                const chart = doughnutChartRef.current;
                                                                if (!chart) return;

                                                                chart.setActiveElements([
                                                                    {
                                                                        datasetIndex: 0,
                                                                        index
                                                                    }
                                                                ]);

                                                                chart.tooltip.setActiveElements(
                                                                    [
                                                                        {
                                                                            datasetIndex: 0,
                                                                            index
                                                                        }
                                                                    ],
                                                                    {
                                                                        x: chart.chartArea.left + chart.chartArea.width / 2,
                                                                        y: chart.chartArea.top + chart.chartArea.height / 2
                                                                    }
                                                                );

                                                                chart.update();
                                                            }}
                                                            onMouseLeave={() => {
                                                                setHoveredDoughnutIndex(null);

                                                                const chart = doughnutChartRef.current;
                                                                if (!chart) return;

                                                                chart.setActiveElements([]);
                                                                chart.tooltip.setActiveElements([], { x: 0, y: 0 });
                                                                chart.update();
                                                            }}
                                                        >
                                                            <div className="legend-sprites">
                                                                {(deck.sprites || []).map(sprite => (
                                                                    <img
                                                                        key={sprite}
                                                                        src={`/assets/sprites/${sprite}.png`}
                                                                        alt={sprite}
                                                                    />
                                                                ))}
                                                            </div>

                                                            <span>{deck.key}</span>

                                                            <strong>{deck.percent}%</strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {metaView === 'list' && (
                                            <table className="meta-share-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ padding: '0', textAlign: 'start' }}>Archetype</th>
                                                        <th></th>
                                                        <th style={{ textAlign: 'center' }}>Players</th>
                                                        <th style={{ textAlign: 'center' }}>Meta %</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {metaShareRows.map(deck => (
                                                        <tr key={deck.key}>
                                                            <td>
                                                                <div className="meta-share-list-sprites">
                                                                    {(deck.sprites || []).map(sprite => (
                                                                        <img
                                                                            key={sprite}
                                                                            src={`/assets/sprites/${sprite}.png`}
                                                                            alt={sprite}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </td>

                                                            <td>{deck.key}</td>

                                                            <td style={{ textAlign: 'center' }}>
                                                                {deck.count}
                                                            </td>

                                                            <td style={{ textAlign: 'center' }}>
                                                                {deck.percent}%
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </>
                                )}
                                {statView === 'decklists' && isChartReady && (
                                    <>
                                        <div className='deck-archetypes'>
                                            <h3 className='stats-tab-h3-label'>Data per Archetype</h3>
                                            {usesPhaseData && (
                                                <div className="day-toggle-buttons" style={{ margin: '0.5rem 0' }}>
                                                    <button onClick={() => handleDataDayChange('day2')} className={dataDay === 'day2' ? 'active-button' : ''}>{label(2)}</button>
                                                    <button onClick={() => handleDataDayChange('day1')} className={dataDay === 'day1' ? 'active-button' : ''}>{label(1)}</button>
                                                </div>
                                            )}
                                            <div className='filter-container'>
                                                <select
                                                    value={selectedArchetype}
                                                    onChange={handleArchetypeChange}
                                                    className="archetype-dropdown"
                                                >
                                                    {dropdownOptions.map((a, i) => (
                                                        <option key={i} value={a.key}>
                                                            {a.key === 'blank-' ? 'Unknown' : a.key} ({a.count})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedArchetype && (
                                            <div className='average-card-counts'>
                                                <p>Average card count from all {dataDay === 'day2' ? label(2) : ''}{' '}
                                                    <strong style={{ color: '#1290eb' }}>
                                                        {selectedArchetype === 'blank-' ? 'Unknown' : selectedArchetype}
                                                    </strong> lists
                                                </p>
                                                <hr style={{ marginTop: '5px', border: 'none', borderBottom: '2px solid #ccc', opacity: 0.5 }} />
                                                <div className='button-container'>
                                                    <button onClick={() => setShowTop30(true)} className={showTop30 ? 'active-button' : ''}>Show All Cards %</button>
                                                    <button onClick={() => setShowTop30(false)} className={!showTop30 ? 'active-button' : ''}>
                                                        Only Cards in All Lists
                                                    </button>
                                                </div>
                                                <div className="deck-cards">
                                                    {visibleAverageCards.length > 0 ? visibleAverageCards.map((card, idx) => (
                                                        <div key={idx} className="card-container-avg" onClick={() => handleCardClick(card)}>
                                                            <img src={cardImageUrl(card)} alt={card.name} />
                                                            <div className="card-count-avg">{card.averageCount}</div>
                                                        </div>
                                                    )) : <p></p>}
                                                </div>
                                                {averageCardCounts.length > 30 && (
                                                    <button
                                                        className="expand-average-cards-btn"
                                                        onClick={() => setShowAllAverageCards(prev => !prev)}
                                                    >
                                                        {showAllAverageCards
                                                            ? 'Show Less Cards'
                                                            : `Show All ${averageCardCounts.length} Cards`}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div className='filtered-results'>
                                            <p>All {dataDay === 'day2' ? label(2) : label(1)} <strong>{selectedArchetype}</strong> results
                                                <span style={{ opacity: 0.25 }}>
                                                    &nbsp;• {eventData.name} ({division.charAt(0).toUpperCase() + division.slice(1)})
                                                </span>
                                            </p>
                                            <hr style={{ marginTop: '5px', border: 'none', borderBottom: '2px solid #ccc', opacity: 0.35 }} />
                                            <br />
                                            <div className='results-table charted-decks'>
                                                {displayResults(filteredResults, eventId, division, undefined, getEventFormat(division))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {statView === 'records' && showMatchupsTab && (
                                    <div className="matchups-overview">
                                        <h3 className='stats-tab-h3-label'>Archetype Records</h3>
                                        <div className="day-toggle-buttons" style={{ margin: '1rem 0' }}>
                                            <button
                                                onClick={() => setMatchupDay('combined')}
                                                className={matchupDay === 'combined' ? 'active-button' : ''}
                                            >
                                                Overall
                                            </button>
                                            <button
                                                onClick={() => setMatchupDay('day2')}
                                                className={matchupDay === 'day2' ? 'active-button' : ''}
                                            >{label(2)}</button>
                                            <button
                                                onClick={() => setMatchupDay('day1')}
                                                className={matchupDay === 'day1' ? 'active-button' : ''}
                                            >{label(1)}</button>
                                        </div>
                                        <div className='chart-description'>
                                            {matchupDay === 'day1' && (
                                                <p>* Records for each archetype from {label(1)} rounds only</p>
                                            )}

                                            {matchupDay === 'day2' && (
                                                <p>* Records for each archetype from {label(2)} rounds only</p>
                                            )}

                                            {matchupDay === 'combined' && (
                                                <p>* Records for each archetype from both {label(1)} and {label(2)} rounds</p>
                                            )}
                                        </div>
                                        <table className="matchup-table archetype-records">
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'start' }}>Archetype</th>
                                                    <th></th>
                                                    <th style={{ textAlign: 'start' }}>Record</th>
                                                    <th style={{ textAlign: 'center' }}>Win %</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {matchupRecordByArchetype.map(({ key, wins, losses, ties, sprites }) => {
                                                    const total = wins + losses + ties;
                                                    const winPct = total > 0
                                                        ? ((wins + ties * 0.5) / total * 100).toFixed(2)
                                                        : '0.00';
                                                    return (
                                                        <tr key={key}>
                                                            <td className="opponent-sprites-cell sing-cells-sprites">
                                                                {sprites.map(spr => (
                                                                    <img
                                                                        key={spr}
                                                                        src={`/assets/sprites/${spr}.png`}
                                                                        alt={spr}
                                                                        className="archetype-sprite"
                                                                    />
                                                                ))}
                                                            </td>
                                                            <td className='sing-arch-name'>{key}</td>
                                                            <td className='record-summary sing-arch-rec tabular table-nums-sizes'>{wins}-{losses}-{ties}</td>
                                                            <td className='table-nums-sizes' style={{ textAlign: 'center' }}>
                                                                {winPct}%
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {statView === 'matchups' && (
                                    <div className="matchups-overview">
                                        <h3 className='stats-tab-h3-label'>VS Matchup Data</h3>
                                        <div className="day-toggle-buttons matchup-and-record-data-btns" style={{ margin: '1rem 0' }}>
                                            <button
                                                onClick={() => setMatchupDay('combined')}
                                                className={matchupDay === 'combined' ? 'active-button' : ''}
                                            >
                                                Overall
                                            </button>
                                            <button
                                                onClick={() => setMatchupDay('day2')}
                                                className={matchupDay === 'day2' ? 'active-button' : ''}
                                            >{label(2)}</button>
                                            <button
                                                onClick={() => setMatchupDay('day1')}
                                                className={matchupDay === 'day1' ? 'active-button' : ''}
                                            >{label(1)}</button>
                                        </div>
                                        <div className='chart-description' style={{ marginBottom: '15px' }}>
                                            {matchupDay === 'day1' && (
                                                <p>* Records for each archetype from {label(1)} rounds only</p>
                                            )}

                                            {matchupDay === 'day2' && (
                                                <p>* Records for each archetype from {label(2)} rounds only</p>
                                            )}

                                            {matchupDay === 'combined' && (
                                                <p>* Records for each archetype from both {label(1)} and {label(2)} rounds</p>
                                            )}
                                        </div>
                                        {statView === 'matchups' && showMatchupsTab && (
                                            <>
                                                <ul className='matchups-graph-instructions'>
                                                    <li>Pick a deck on the left side (↕ row).</li>
                                                    <li>Move across to a deck on the top (↔ column).</li>
                                                    <li>The percentage in the box is the row deck's <strong>win</strong>% against the column deck.</li>
                                                </ul>
                                                <div className="matchup-matrix-wrapper">
                                                    <table className="matchup-matrix">
                                                        <thead>
                                                            <tr>
                                                                {/* top-left corner blank */}
                                                                <th>vs</th>
                                                                {archetypes.map(ck => {
                                                                    const sprites = spriteMap[ck] || [];
                                                                    return (
                                                                        <th key={ck} className="matrix-header-cell">
                                                                            {sprites.map(s => {
                                                                                return (
                                                                                    <img
                                                                                        key={s}
                                                                                        src={`/assets/sprites/${s}.png`}
                                                                                        alt={s}
                                                                                        className="matrix-header-sprite"
                                                                                    />
                                                                                );
                                                                            })}
                                                                            {/* <button
                                                                            className="matrix-info-btn"
                                                                            onClick={() => {
                                                                                setInfoArchetype(ck);
                                                                                setInfoStats(summaryByArchetype[ck]);
                                                                            }}
                                                                        >
                                                                            ℹ️
                                                                        </button> */}
                                                                        </th>
                                                                    );
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {archetypes.map(rk => (
                                                                <tr key={rk}>
                                                                    <th className='bottom-border-matrix'>
                                                                        {spriteMap[rk]?.map(spr => (
                                                                            <img
                                                                                key={spr}
                                                                                src={`/assets/sprites/${spr}.png`}
                                                                                alt={spr}
                                                                                className="matrix-header-sprite"
                                                                            />
                                                                        ))}
                                                                    </th>
                                                                    {archetypes.map(ck => {
                                                                        const { wins, losses, ties } = headToHead[rk][ck];
                                                                        const total = wins + losses + ties;

                                                                        // no matches → blank cell
                                                                        if (total === 0) {
                                                                            return (
                                                                                <td
                                                                                    key={ck}
                                                                                    style={{
                                                                                        background: 'transparent',
                                                                                        textAlign: 'center',
                                                                                        fontVariantNumeric: 'tabular-nums',
                                                                                    }}
                                                                                />
                                                                            );
                                                                        }

                                                                        const pct = ((wins + ties * 0.5) / total) * 100;
                                                                        const intensity = Math.abs(pct - 50) / 50;
                                                                        const isDarkMode = theme.themeName === 'dark';

                                                                        let bg;

                                                                        if (isDarkMode && Math.abs(pct - 50) < 0.01) {
                                                                            bg = '#27292c';
                                                                        } else {
                                                                            bg = pct >= 50
                                                                                ? isDarkMode
                                                                                    ? `rgba(47, 129, 177, ${0.18 + intensity * 0.72})`
                                                                                    : `rgba(18, 144, 235, ${intensity})`
                                                                                : isDarkMode
                                                                                    ? `rgba(164, 55, 65, ${0.18 + intensity * 0.72})`
                                                                                    : `rgba(235, 18, 18, ${intensity})`;
                                                                        }

                                                                        return (
                                                                            <td
                                                                                key={ck}
                                                                                className="matchup-matrix-cell"
                                                                                onClick={() => {
                                                                                    setInfoArchetype(rk);
                                                                                    setInfoOpponentArchetype(ck);
                                                                                    setInfoStats({ wins, losses, ties });
                                                                                }}
                                                                                style={{
                                                                                    background: bg,
                                                                                    textAlign: 'center',
                                                                                    fontVariantNumeric: 'tabular-nums',
                                                                                }}
                                                                            >
                                                                                {pct.toFixed(2)}%
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {infoArchetype && (
                            <div className="matrix-info-modal-overlay" onClick={() => setInfoArchetype(null)}>
                                <div className="matrix-info-modal" onClick={e => e.stopPropagation()}>
                                    <h4>
                                        {infoArchetype}
                                        {infoOpponentArchetype && ` vs ${infoOpponentArchetype}`}
                                    </h4>
                                    <div className="matrix-modal-vs-sprites">
                                        <div className="modal-sprites tight-modal-sprites">
                                            {(spriteMap[infoArchetype] || []).map(s => (
                                                <img key={s} src={`/assets/sprites/${s}.png`} alt={s} />
                                            ))}
                                        </div>

                                        {infoOpponentArchetype && (
                                            <>
                                                <span className="matrix-modal-vs-text">vs</span>

                                                <div className="modal-sprites tight-modal-sprites">
                                                    {(spriteMap[infoOpponentArchetype] || []).map(s => (
                                                        <img key={s} src={`/assets/sprites/${s}.png`} alt={s} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p style={{ marginBottom: '15px' }}>Record: {infoStats.wins}–{infoStats.losses}–{infoStats.ties}</p>
                                    <p>
                                        {(() => {
                                            const total = infoStats.wins + infoStats.losses + infoStats.ties;
                                            const pct = total
                                                ? ((infoStats.wins + infoStats.ties * .5) / total * 100).toFixed(2)
                                                : "0.00";
                                            return pct;
                                        })()}% win rate<br></br>for {infoArchetype}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setInfoArchetype(null);
                                            setInfoOpponentArchetype(null);
                                        }}
                                        aria-label="Close"
                                    >
                                        <span className="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {showModal && modalPlayer && (
                            <div className="modal-overlay" onClick={closeModal}>
                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                    <button className="close-btn" onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
                                    <div className="modal-player-header">
                                        <div className='modal-name-sprites'>
                                            <h3>{formatName(modalPlayer.name)}</h3>
                                            <DisplayPokemonSprites
                                                decklist={modalPlayer.decklist}
                                                sprite1={modalPlayer.sprite1}
                                                sprite2={modalPlayer.sprite2}
                                            />
                                        </div>
                                        {modalPlayer.placing !== 9999 && (
                                            <p style={{ marginTop: '-10px' }}>
                                                <span className='bold'>
                                                    {getPlacementSuffix(modalPlayer.placing)} Place
                                                </span>
                                                &nbsp;
                                                ({division.charAt(0).toUpperCase() + division.slice(1)})
                                            </p>
                                        )}
                                        <p style={{ marginTop: '3px' }}>{eventData.name}</p>
                                        <p style={{ marginTop: '3px' }}><span className='bold'>Record: </span>{modalPlayer.record.wins}-{modalPlayer.record.losses}-{modalPlayer.record.ties}</p>
                                        <div className='decklist-modal-btns'>
                                            <Link className='link-to-playerprofile' to={`/player/${normalizeName(modalPlayer.name)}-${modalPlayer.flag}`}>
                                                <button className="decklist-modal-button">Player Profile</button>
                                            </Link>
                                            {modalPlayer.decklist && (
                                                <Link
                                                    to={`/tournaments/${eventId}/${division}/${encodeURIComponent(modalPlayer.name)}-${modalPlayer.flag}`}
                                                    className="decklist-link-icon"
                                                    title="View full decklist"
                                                    onClick={saveEventPageState}
                                                >
                                                    <button className="decklist-modal-button">Decklist</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <table className="matchup-table">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }}>Rnd</th>
                                                <th style={{ textAlign: 'center', opacity: 0 }}>Res</th>
                                                <th>&nbsp;Opponent</th>
                                                <th style={{ textAlign: 'center' }}>Deck</th>
                                                <th style={{ textAlign: 'center' }}>List</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(modalPlayer.rounds).reverse().map(([rnd, info]) => {
                                                const { code, name } = parseOpponent(info.name);

                                                const allPlayers = [...results, ...eliminatedRecords];
                                                const opponent = allPlayers.find(p =>
                                                    p.name === name && p.flag === code
                                                );
                                                let sprites;
                                                if (opponent?.sprite1) {
                                                    sprites = { first: opponent.sprite1, second: opponent.sprite2 };
                                                } else if (opponent?.decklist) {
                                                    const { firstSprite, secondSprite } = getPokemonSprites(opponent.decklist, '', '');
                                                    sprites = { first: firstSprite, second: secondSprite };
                                                }

                                                const bgColor =
                                                    info.result === 'W' ? 'rgba(144,238,144,0.6)' :
                                                        info.result === 'L' ? 'rgba(255,182,193,0.6)' :
                                                            info.result === 'T' ? 'rgba(255,255,102,0.6)' :
                                                                'transparent';
                                                const textColor =
                                                    info.result === 'W' ? 'rgb(1, 63, 1)' :
                                                        info.result === 'L' ? 'darkred' :
                                                            info.result === 'T' ? 'rgb(78, 78, 7)' :
                                                                'inherit';
                                                return (
                                                    <tr key={rnd}>
                                                        <td style={{ textAlign: 'center' }}>{rnd}</td>
                                                        <td className='player-result-wlt' style={{ backgroundColor: bgColor, textAlign: 'center', color: textColor }}>
                                                            {info.result}
                                                        </td>
                                                        <td className="name-n-flag-recmodal" style={{ marginLeft: '3px' }}>
                                                            <div
                                                                className="flag-container"
                                                                style={{ opacity: name === 'BYE' ? 0 : 1 }}
                                                            >
                                                                <img
                                                                    className="flag-size"
                                                                    src={flags[code] || flags.unknown}
                                                                    alt={code}
                                                                />
                                                                <div className="flag-tooltip">
                                                                    {getCountryName(code)}
                                                                </div>
                                                            </div>
                                                            <a
                                                                href="#"
                                                                className="link-to-playerrecords"
                                                                title="View opponent’s records"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    handleRecordClick(opponent);
                                                                }}
                                                            >
                                                                {formatName(name)}
                                                            </a>
                                                        </td>
                                                        <td className="opponent-sprites-cell">
                                                            {sprites
                                                                ? <DisplayPokemonSprites
                                                                    decklist={opponent.decklist}
                                                                    sprite1={sprites.first}
                                                                    sprite2={sprites.second}
                                                                />
                                                                : <em></em>
                                                            }
                                                        </td>
                                                        <td
                                                            className="player-decklink-cell"
                                                            style={{ textAlign: 'center', verticalAlign: 'middle' }}
                                                        >
                                                            {opponent?.decklist ? (
                                                                <Link
                                                                    to={`/tournaments/${eventId}/${division}/${encodeURIComponent(name)}-${code}`}
                                                                    title="View opponent’s decklist"
                                                                    onClick={saveEventPageState}
                                                                >
                                                                    <span className="material-symbols-outlined">
                                                                        format_list_bulleted
                                                                    </span>
                                                                </Link>
                                                            ) : (
                                                                <em></em>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </EventPageContent>
    );
};

export default EventPage;
