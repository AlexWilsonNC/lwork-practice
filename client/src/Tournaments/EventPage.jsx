import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/eventpage.css';
import { displayResults } from './event-results';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import DisplayPokemonSprites, { getPokemonSprites } from './pokemon-sprites';
import { getCustomLabel } from './pokemon-labels';
import LiveStandings from '../Live/LiveStandings';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
import unknown from '../assets/flags/unknown.png';

const flags = {
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
    unknown: unknown,
};

const flagsAbbrev = {
    AR: argentina,
    AU: australia,
    AT: austria,
    BY: belarus,
    BE: belgium,
    BR: brazil,
    CA: canada,
    CL: chile,
    CN: china,
    CR: costaRica,
    CO: colombia,
    HR: croatia,
    CZ: czechia,
    DK: denmark,
    EC: ecuador,
    SV: elSalvador,
    FI: finland,
    FR: france,
    DE: germany,
    GR: greece,
    HK: hongKong,
    HU: hungary,
    IS: iceland,
    ID: indonesia,
    IE: ireland,
    IL: israel,
    IM: isleOfMan,
    IT: italy,
    JP: japan,
    KR: southKorea,
    LT: lithuania,
    MY: malaysia,
    MT: malta,
    MX: mexico,
    MA: morocco,
    NL: netherlands,
    NZ: newZealand,
    NI: nicaragua,
    NO: norway,
    PE: peru,
    PH: philippines,
    PL: poland,
    PT: portugal,
    PR: puertoRico,
    RU: russia,
    SG: singapore,
    SK: slovakia,
    SI: slovenia,
    SO: somalia,
    ZA: southAfrica,
    ES: spain,
    SE: sweden,
    CH: switzerland,
    TW: taiwan,
    TH: thailand,
    US: usa,
    UK: uk,
    unknown: unknown
}

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

const countryNames = {
    AR: 'Argentina (Latin America)',
    AU: 'Australia (Oceania)',
    AT: 'Austria (Europe)',
    BY: 'Belarus (Europe)',
    BE: 'Belgium (Europe)',
    BR: 'Brazil (Latin America)',
    CA: 'Canada (North America)',
    CL: 'Chile (Latin America)',
    CN: 'China (Asia-Pacific)',
    CR: 'Costa Rica (Latin America)',
    CO: 'Colombia (Latin America)',
    HR: 'Croatia (Europe)',
    CZ: 'Czechia (Europe)',
    DK: 'Denmark (Europe)',
    SV: 'El Salvador (Latin America)',
    FI: 'Finland (Europe)',
    FR: 'France (Europe)',
    DE: 'Germany (Europe)',
    GR: 'Greece (Europe)',
    HK: 'Hong Kong (Asia-Pacific)',
    HU: 'Hungary (Europe)',
    IS: 'Iceland (Europe)',
    ID: 'Indonesia (Asia-Pacific)',
    IE: 'Ireland (Europe)',
    IM: 'Isle of Man (Europe)',
    IL: 'Israel (Middle East-South Africa)',
    IT: 'Italy (Europe)',
    JP: 'Japan (Asia-Pacific)',
    SO: 'Somalia (Middle East-South Africa)',
    KR: 'South Korea (Asia-Pacific)',
    LT: 'Lithuania (Europe)',
    MY: 'Malaysia (Asia-Pacific)',
    MT: 'Malta (Europe)',
    MX: 'Mexico (Latin America)',
    MA: 'Moroco (Europe)',
    NL: 'Netherlands (Europe)',
    NZ: 'New Zealand (Oceania)',
    NI: 'Nicaragua (Latin America)',
    NO: 'Norway (Europe)',
    PE: 'Peru (Latin America)',
    PH: 'Philippines (Asia-Pacific)',
    PL: 'Poland (Europe)',
    PT: 'Portugal (Europe)',
    PR: 'Puerto Rico (North America)',
    RU: 'Russia (Russia)',
    SG: 'Singapore (Asia-Pacific)',
    SK: 'Slovakia (Europe)',
    ZA: 'South Africa (Middle East-South Africa)',
    ES: 'Spain (Europe)',
    SE: 'Sweden (Europe)',
    CH: 'Switzerland (Europe)',
    TW: 'Taiwan (Asia-Pacific)',
    TH: 'Thailand (Asia-Pacific)',
    UK: 'United Kingdom (Europe)',
    US: 'USA (North America)',
    unknown: 'Unknown',
    SI: 'Slovenia (Europe)',
    EC: 'Ecuador (Latin America)'
};

const orderedSets = [
  "DRI", "JTG", "PRE", "SSP", "SCR", "SFA", "TWM", "TEF", "PAF", "PAR", "MEW", "OBF", "PAL", "SVE", "SVI", "PR-SV",
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

const EventPageContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.body};
  .event-option:hover {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
  }
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
    margin-top: -15px;
    display: flex;
    justify-content: flex-end;
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
  .chart-description {
      color: ${({ theme }) => theme.chartdescrip};
  }
  .day1btn, .day2btn, .conversbtn {
    background-color: ${({ theme }) => theme.day1btn};
  }
  .chart-button.active {
    background-color: #1290eb;
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
        background-color: rgb(80, 80, 80);
    }
    .active-button {
        background-color: #1290eb !important;
        border: 1px solid #007bff;
    }
    .flag-container {
        position: relative;
        display: inline-block;
        text-align: center;
        margin-top: 5px;
    }
    .link-to-playerrecords {
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
    // Normalize common variations in energy card names
    return name
        .toLowerCase()
        .replace("basic ", "")
        .replace(" - basic", "")
        .replace(" energy", "");
};
const compareEnergyCards = (card1, card2) => {
    // Normalize both energy card names
    const normalizedCard1Name = normalizeEnergyCardName(card1.name);
    const normalizedCard2Name = normalizeEnergyCardName(card2.name);

    // Compare based on normalized names, set, and number
    return normalizedCard1Name === normalizedCard2Name && card1.set === card2.set && card1.number === card2.number;
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
    
    const [eliminatedDecks, setEliminatedDecks] = useState([]);
    const [loadingEliminatedDecks, setLoadingEliminatedDecks] = useState(false);
    const [showAllDecks, setShowAllDecks] = useState(false);
    const [eliminatedRecords, setEliminatedRecords] = useState([]);
    const [loadingEliminatedRecs, setLoadingEliminatedRecs] = useState(false);
    const [showAllRecs, setShowAllRecs] = useState(false);
    
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

    const is2025Event = eventId.includes('2025');

   let day2Results;
    if (is2025Event) {
        // only for 2025+ events do we cut on Swiss rounds
        const totalPlayers = results.length;
        const day1Rounds =
            totalPlayers >= 2049 ? 9 :
            totalPlayers >=  257 ? 8 :
                                7 ;

        day2Results = results.filter(p => {
            const { wins = 0, losses = 0, ties = 0 } = p.record ?? {};
            return wins + losses + ties > day1Rounds;
        });
        } else {
        // legacy events (pre-2025): everyone is shown
        day2Results = results;
    }
    
    const normalizeString = (str) => {
        return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const fetchCardData = async (format) => {
        try {
            const collectionsParam = formatToCollections(format).join(',');
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
        if (divisionParam) {
            setDivision(divisionParam);
        }
    }, [divisionParam]);

    useEffect(() => {
        sessionStorage.setItem(`activeTab_${eventId}`, activeTab);
    }, [activeTab, eventId]);

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
    }, [division]);

    const loadEliminated = async () => {
    if (viewTab === 'Records') {
        if (loadingEliminatedRecs) return;
        setLoadingEliminatedRecs(true);
    }
  
  const [year, slug] = eventId.split('_');
  const url = `https://alexwilsonnc.github.io/eliminated-players/${year}/${slug.toLowerCase()}.json`;
  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const key  = `${division}`;
    const raw  = Array.isArray(data[key]) ? data[key] : [];

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
        sprite1 = clean(firstSprite)  || '';
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
        const savedShowTop30 = sessionStorage.getItem(`showTop30_${eventId}`);
        if (savedShowTop30 !== null) {
            setShowTop30(JSON.parse(savedShowTop30));
        }
    
        if (selectedArchetype) {
            const filteredDecks = results.filter(result => {
                let sprite1 = result.sprite1 || '';
                let sprite2 = result.sprite2 || '';
            
                if (!sprite1 && !sprite2) {
                    const { firstSprite, secondSprite } = getPokemonSprites(result.decklist, '', '');
                    sprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
                    sprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
                }
            
                const key = getCustomLabel(eventId, sprite1, sprite2);
                return key === selectedArchetype;
            });
            
            const cardSets = {
                pokemon: new Map(),
                trainer: new Map(),
                energy: new Map(),
            };
            
            filteredDecks.forEach(({ decklist }) => {
                if (decklist) {
                    ['pokemon', 'trainer', 'energy'].forEach((category) => {
                        if (decklist[category]) {
                            decklist[category].forEach(card => {
                                const existingCardKey = Array.from(cardSets[category].keys()).find(key => {
                                    const existingCard = cardSets[category].get(key).cardInfo;
                                    if (category === 'pokemon') {
                                        return normalizeString(existingCard.name) === normalizeString(card.name) &&
                                            comparePokemonCards(existingCard, card);
                                    } else if (category === 'energy') {
                                        return compareEnergyCards(existingCard, card);
                                    } else {
                                        return normalizeString(existingCard.name) === normalizeString(card.name);
                                    }
                                });
    
                                if (existingCardKey) {
                                    const cardData = cardSets[category].get(existingCardKey);
                                    cardData.count += parseInt(card.count, 10);
                                    cardData.occurrences += 1;
                                    cardSets[category].set(existingCardKey, cardData);
                                } else {
                                    const cardKey = `${card.set}-${card.number}`;
                                    cardSets[category].set(cardKey, {
                                        cardInfo: card,
                                        count: parseInt(card.count, 10),
                                        occurrences: 1,
                                    });
                                }
                            });
                        }
                    });
                }
            });
                            
            const commonCards = {
                pokemon: [],
                trainer: [],
                energy: [],
            };
    
            // Populate the commonCards and sort them by averageCount
            ['pokemon', 'trainer', 'energy'].forEach((category) => {
                cardSets[category].forEach((cardData) => {
                    if (!showTop30 && cardData.occurrences === filteredDecks.length) {
                        commonCards[category].push({
                            ...cardData.cardInfo,
                            averageCount: (cardData.count / cardData.occurrences).toFixed(2),
                        });
                    } else if (showTop30) {
                        commonCards[category].push({
                            ...cardData.cardInfo,
                            averageCount: (cardData.count / filteredDecks.length).toFixed(2),
                        });
                    }
                });
    
                // Sort each category by averageCount in descending order
                commonCards[category].sort((a, b) => b.averageCount - a.averageCount);
            });
    
            const allCommonCards = [
                ...commonCards.pokemon,
                ...commonCards.trainer,
                ...commonCards.energy
            ];
    
            setAverageCardCounts(allCommonCards);
        } else {
            setAverageCardCounts([]);
        }
    }, [selectedArchetype, showTop30, eventId, results]);
                            
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
            : results;

            
    const deckTypeCount = chartResults.reduce((acc, player) => {
        let sprite1 = player.sprite1 || '';
        let sprite2 = player.sprite2 || '';

        if (!sprite1 && !sprite2) {
            const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
            sprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
            sprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
        }

        if (sprite2 === 'hyphen') return acc;

        let key;
        let spriteToShow;

        if (sprite1 !== 'blank' && sprite1) {
            key = getCustomLabel(eventId, sprite1, sprite2);
            spriteToShow = sprite1;
        } else if (sprite2 !== 'blank' && sprite2) {
            key = getCustomLabel(eventId, '', sprite2);
            spriteToShow = sprite2;
        } else {
            return acc;
        }

        if (!acc[key]) {
            acc[key] = { count: 0, sprite: spriteToShow };
        }
        acc[key].count += 1;

        return acc;
    }, {});

    const deckTypeCountArray = Object.entries(deckTypeCount)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => b.count - a.count);

    useEffect(() => {
        if (!isChartReady || deckTypeCountArray.length === 0) return;

        const storageKey = `selectedArchetype_${eventId}`;
        const savedKey   = sessionStorage.getItem(storageKey);
        const validSaved = savedKey && deckTypeCountArray.some(a => a.key === savedKey);

        const defaultKey = validSaved
            ? savedKey
            : deckTypeCountArray[0].key;

        setSelectedArchetype(defaultKey);
        sessionStorage.setItem(storageKey, defaultKey);
    }, [isChartReady, deckTypeCountArray, eventId]);

    const getPlayerCount = (division) => {
        switch (division) {
            case 'masters':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneMasters}
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
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
                                <strong>Day 2:</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                    </>
                );
            case 'professors':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneMasters}
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                    </>
                );
            case 'seniors':
                return (
                    <>
                        {eventData?.dayOneSeniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneSeniors}
                            </p>
                        )}
                        {eventData?.dayTwoSeniors && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoSeniors}
                            </p>
                        )}
                    </>
                );
            case 'juniors':
                return (
                    <>
                        {eventData?.dayOneJuniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneJuniors}
                            </p>
                        )}
                        {eventData?.dayTwoJuniors && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoJuniors}
                            </p>
                        )}
                    </>
                );
            case 'olderSeniors':
                return (
                    <>
                        {eventData?.dayOneSeniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneSeniors}
                            </p>
                        )}
                    </>
                );
            case 'youngSeniors':
                return (
                    <>
                        {eventData?.dayOneJuniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneJuniors}
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

    if (!eventData) {
        return;
    }

    const isMastersEmpty = mastersResults.length === 0;
    const otherDivisionsHaveResults =
        seniorsResults.length > 0 ||
        juniorsResults.length > 0 ||
        professorsResults.length > 0;

    const dayOneData = eventData.dayOneMeta || [];
    const dayTwoData = chartResults;

    const combinedData = dayOneData.reduce((acc, dayOneDeck) => {
        let dayOneLabel = getCustomLabel(eventId, dayOneDeck.sprite1, dayOneDeck.sprite2);
    
        // Treat 'Radiant Charizard LZB' as 'Lost Box' in Day 1 data
        if (dayOneLabel === 'Radiant Charizard LZB') {
            dayOneLabel = 'Lost Box';
        }
    
        const dayTwoDeck = dayTwoData.find(dayTwoDeck => {
            const { firstSprite, secondSprite } = getPokemonSprites(dayTwoDeck.decklist, '', '');
            let normalizedSprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
            let normalizedSprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '');
    
            let dayTwoLabel = getCustomLabel(eventId, normalizedSprite1, normalizedSprite2);
    
            // Treat 'Radiant Charizard LZB' as 'Lost Box' in Day 2 data
            if (dayTwoLabel === 'Radiant Charizard LZB') {
                dayTwoLabel = 'Lost Box';
            }
    
            return dayOneLabel === dayTwoLabel;
        });
    
        if (dayTwoDeck) {
            const dayTwoCount = dayTwoData.filter(dayTwoDeck => {
                const { firstSprite, secondSprite } = getPokemonSprites(dayTwoDeck.decklist, '', '');
                let normalizedSprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
                let normalizedSprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '');
    
                let dayTwoLabel = getCustomLabel(eventId, normalizedSprite1, normalizedSprite2);
    
                // Treat 'Radiant Charizard LZB' as 'Lost Box' in Day 2 data
                if (dayTwoLabel === 'Radiant Charizard LZB') {
                    dayTwoLabel = 'Lost Box';
                }
    
                return dayTwoLabel === dayOneLabel;
            }).length;
    
            acc.push({
                label: dayOneLabel,
                conversionRate: ((dayTwoCount / dayOneDeck.deckcount) * 100).toFixed(2),
            });
        } else {
            acc.push({
                label: dayOneLabel,
                conversionRate: '0.00%',
            });
        }
    
        return acc;
    }, []);
    

    const conversionChartData = {
        labels: combinedData.map(data => data.label),
        datasets: [
            {
                label: 'Conversion Rate (%)',
                data: combinedData.map(data => data.conversionRate),
                backgroundColor: '#1291eb8b'
            }
        ]
    };


    const handleDayOneClick = () => {
        setShowDayOneMeta(true);
        setShowConversionRate(false);
    };

    const handleDayTwoClick = () => {
        setShowDayOneMeta(false);
        setShowConversionRate(false);
    };
    const handleConversionRateClick = () => {
        setShowDayOneMeta(false);
        setShowConversionRate(true);
    };

    const chartData = showDayOneMeta
        ? {
            labels: eventData.dayOneMeta.map(meta => {
                const { sprite1, sprite2 } = meta;
                return getCustomLabel(eventId, sprite1, sprite2);
            }),
            datasets: [
                {
                    label: 'Deck Count',
                    data: eventData.dayOneMeta.map(meta => meta.deckcount),
                    backgroundColor: '#1291eb8b'
                }
            ]
        }
        : showConversionRate
            ? conversionChartData
            : {
                labels: deckTypeCountArray.map((entry) => {
                    // console.log("Day 2 Label:", entry.key);
                    return entry.key;
                }), datasets: [
                    {
                        label: 'Deck Count',
                        data: deckTypeCountArray.map((entry) => entry.count),
                        backgroundColor: '#1291eb8b'
                    }
                ]
            };

    const getDayOneMetaSprites = (meta) => {
        return {
            firstSprite: meta.sprite1 || '',
            secondSprite: meta.sprite2
        };
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
                top: 40,
            },
        },
        animation: {
            onComplete: () => {
                setIsChartReady(true)
                if (chartRef.current) {
                    const chartInstance = chartRef.current;
                    const ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = theme.chartNumber;

                    chartInstance.data.labels.forEach((label, index) => {
                        const meta = chartInstance.getDatasetMeta(0);
                        const dataset = chartInstance.data.datasets[0];
                        const data = dataset.data[index];

                        let sprite;

                        if (showDayOneMeta) {
                            const metaKey = eventData.dayOneMeta[index];
                            const { firstSprite, secondSprite } = getDayOneMetaSprites(metaKey);
                            sprite = firstSprite !== '' ? firstSprite : secondSprite;
                        } else {
                            sprite = deckTypeCount[label]?.sprite;
                        }

                        const bar = meta.data[index];
                        if (sprite && bar) {
                            const { x, y } = bar.tooltipPosition();
                            const img = new Image();
                            img.src = `/assets/sprites/${sprite}.png`;
                            img.onload = () => {
                                const aspectRatio = img.width / img.height;
                                const displayWidth = 45;
                                const displayHeight = displayWidth / aspectRatio;

                                ctx.drawImage(img, x - displayWidth / 2, y - displayHeight - 0, displayWidth, displayHeight);
                            };
                        }
                        if (data >= 0) {
                            const textYPosition = bar.y + 10;
                            ctx.fillText(data, bar.x, textYPosition);
                        }
                    });
                }
            },
        },
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
    const is2024Event = eventId.includes('2024') || eventId.includes('2025') && !eventId.toLowerCase().includes('retro');

    return (
        <EventPageContent className='center' theme={theme}>
            <Helmet>
                <title>{eventData.name}</title>
                <meta
                    name='description'
                    content={`Results, decklists and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`}
                />
                <meta property='og:title' content={eventData.name} />
                <meta
                    property='og:description'
                    content={`Results, decklists and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`}
                />
                <meta property='og:image' content={eventData.thumbnail} />
                <meta
                    property='og:url'
                    content={`https://www.ptcglegends.com/tournaments/${eventData.eventId}`}
                />
                <meta property='og:type' content='website' />
                <meta name='author' content='PTCG Legends' />
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={eventData.name} />
                <meta
                    name='twitter:description'
                    content={`Results, lists and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`}
                />
                <meta name='twitter:image' content={eventData.thumbnail} />
            </Helmet>
            <div className='regional-container'>
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
                    ) : eventData.all ? (
                        <Link
                            className={`professorsBtn ${division === 'all'
                                ? 'active-division'
                                : 'other-division'
                                }`}
                            to={`/tournaments/${eventId}/all`}
                            style={{ opacity: 1, pointerEvents: 'all' }}
                        >
                            Combined
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
                <div className='regional-info'>
                    <div className='left-regional-info'>
                        <h2>{eventData.name}</h2>
                        <p>{eventData.date}</p>
                        <div className='place-n-flag'>
                            <img
                                src={flags[eventData.flag]}
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
                        {eventData.format && (
                            <p>
                                <strong>Format:</strong> {getEventFormat(division)}
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
                        }}
                    >
                        Results
                    </a>
                    <a
                        className={`event-option ${activeTab === 'Statistics' ? 'active-option' : ''}`}
                        onClick={() => {
                            if (resultsAvailable) {
                                setActiveTab('Statistics');
                            }
                        }}
                        style={statisticsTabStyle}
                    >
                        Statistics
                    </a>
                    <a className='event-option' style={{ opacity: 0.1, pointerEvents: 'none' }}>Photos</a>
                </div>
                <div className='contain-event'>
                    <div className='event-content'>
                        {activeTab === 'Results' ? (
                            <div className='event-results'>
                                {(eventId.includes('2025')) && (
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
                            {viewTab === 'Decks' ? (
                                results.length ? (
                                    <>
                                    {displayResults(day2Results, eventId, division)}

                                    {eventId.includes('2025') && !showAllDecks && !loadingEliminatedDecks && (
                                        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                            <button onClick={loadEliminated} className="day1buttons">
                                                Show Day 1 Results
                                            </button>
                                        </div>
                                    )}

                                    {loadingEliminatedDecks && (
                                        <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                                            Loading Day 1 Results
                                        </p>
                                    )}

                                    {showAllDecks && eliminatedDecks.length > 0 && (
                                        <>
                                            <div className="day-divider">
                                            <span>Day 2 cutoff</span>
                                            </div>
                                            {displayResults(
                                            eliminatedDecks,
                                            eventId,
                                            division
                                            )}
                                            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                            <button
                                                onClick={() => setShowAllDecks(false)}
                                                className="day1buttons"
                                            >
                                                Hide Day 1 Results
                                            </button>
                                            </div>
                                        </>
                                    )}
                                    </>
                                ) : (
                                    <p className='notavailable'>Results not yet available.</p>
                                )
                            ) : (
                                <>
                                <ul className="result-list-ol">
                                    {day2Results.map((p, i) => {
                                        const { wins = 0, losses = 0, ties = 0 } = p.record ?? {};
                                        const matchPts = wins * 3 + ties * 1;
                                        return (
                                        <li
                                            key={`d2-${i}`}
                                            className="player-list-hover records-list-hover"
                                            onClick={() => handleRecordClick(p)}
                                        >
                                            <div className='results-list-item'>
                                                <div className='name-n-flag'>
                                                    <span className="player-placement">{p.placing}.</span>
                                                    <div className="flag-container">
                                                    <img
                                                        className='flag-size'
                                                        src={flagsAbbrev[p.flag]}
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
                                            </div>
                                        </li>
                                        );
                                    })}
                                </ul>
                                <div className="day-divider">
                                    <span>Day 2</span>
                                </div>

                                {/* ─── Day 1 players ─── */}
                                <ul className="result-list-ol">
                                    {eliminatedRecords.map((p, i) => {
                                        const { wins = 0, losses = 0, ties = 0 } = p.record ?? {};
                                        const matchPts = wins * 3 + ties * 1;
                                        return (
                                        <li
                                            key={`d1-${i}`}
                                            className="player-list-hover records-list-hover"
                                            onClick={() => handleRecordClick(p)}
                                        >
                                            <div className='results-list-item'>
                                                <div className='name-n-flag'>
                                                    <span className="player-placement">{p.placing}.</span>
                                                    <div className="flag-container">
                                                    <img
                                                        className='flag-size'
                                                        src={flagsAbbrev[p.flag]}
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
                                <div className='chart-btns-container'>
                                    <div className='alignrow'>
                                        {hasDayOneMeta && division === 'masters' ? (
                                            <>
                                                <button
                                                    className={`chart-button day2btn ${!showDayOneMeta && !showConversionRate ? 'active' : ''}`}
                                                    onClick={handleDayTwoClick}
                                                >
                                                    Day 2
                                                </button>
                                                <>
                                                    <button
                                                        className={`chart-button day1btn ${showDayOneMeta && !showConversionRate ? 'active' : ''}`}
                                                        onClick={handleDayOneClick}
                                                    >
                                                        Day 1
                                                    </button>
                                                    <button
                                                        className={`chart-button conversbtn ${showConversionRate ? 'active' : ''}`}
                                                        onClick={handleConversionRateClick}
                                                    >
                                                        % Conversion
                                                    </button>
                                                </>
                                            </>
                                        ) : eventId.includes("_CL") ? ( // Check for _CL first to prioritize it
                                            <p className='chart-button'>Top {chartResults.length}</p>
                                        ) : (is2024Event && division === 'masters' || eventId.includes("2024_WORLDS")) ? (
                                            <button className={`chart-button day2btn active`}>
                                                Day 2
                                            </button>
                                        ) : (
                                            <p className='chart-button'>Top {chartResults.length}</p>
                                        )}
                                    </div>
                                </div>
                                {division === 'masters' && eventId.includes('2024') && !eventId.includes('RETRO') && chartResults.length > 16 && (
                                    <div className='chart-description'>
                                        {showDayOneMeta && !showConversionRate && (
                                            <p>* Most played decks from Day 1 (data collected from event stream)</p>
                                        )}
                                        {!showDayOneMeta && !showConversionRate && (
                                            <p>* Total count for each deck archetype from Day 2</p>
                                        )}
                                        {showConversionRate && (
                                            <p>* Percentage of the top Day 1 decks that made Day 2</p>
                                        )}
                                    </div>
                                )}
                                {!hasChartData && (
                                    <div className='chart-description'><p>* No known decks available for this division</p></div>
                                )}
                                <div className='chart-container-wrapper'>
                                    <div className='chart-container'>
                                        <Bar ref={chartRef} data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            {isChartReady && (
                            <>
                                <div className='deck-archetypes'>
                                    <h3>Data per Archetype</h3>
                                    <div className='filter-container'>
                                        <div className='filters-top'>
                                            <div className='indiv-filter'>
                                            <select 
                                                value={selectedArchetype} 
                                                onChange={handleArchetypeChange} 
                                                className="archetype-dropdown"
                                            >
                                                {/* <option value="">Select Deck</option> */}
                                                {deckTypeCountArray.map((archetype, index) => (
                                                    <option key={index} value={archetype.key}>
                                                        {archetype.key} ({archetype.count})
                                                    </option>
                                                ))}
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {selectedArchetype && (
                                    <div className='average-card-counts'>
                                        <p>Average card count from all <strong>{selectedArchetype}</strong> list(s) - {eventData.name} ({division.charAt(0).toUpperCase() + division.slice(1).toLowerCase()})</p>
                                        <hr
                                            style={{
                                                marginTop: '5px',
                                                border: 'none',
                                                borderBottom: '2px solid #ccc',
                                                opacity: 0.5
                                            }}
                                        />
                                        <div className='button-container'>
                                            <button
                                                onClick={() => setShowTop30(true)}
                                                className={showTop30 ? 'active-button' : ''}
                                            >
                                                Show All Cards %
                                            </button>
                                            <button
                                                onClick={() => setShowTop30(false)}
                                                className={!showTop30 ? 'active-button' : ''}
                                            >
                                                Only Cards in All Lists
                                            </button>
                                        </div>
                                        <div className="deck-cards">
                                            {averageCardCounts.length > 0 ? (
                                                averageCardCounts.map((card, index) => {
                                                    const isBasicEnergy = card.name.toLowerCase().includes("basic");
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="card-container-avg"
                                                            onClick={() => {
                                                                if (!isBasicEnergy) {
                                                                    handleCardClick(card);
                                                                }
                                                            }}
                                                        >
                                                            <img src={cardImageUrl(card)} alt={card.name} />
                                                            <div className="card-count-avg">{card.averageCount}</div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p></p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className='filtered-results'>
                                    <p>All <strong>{selectedArchetype}</strong> results from {eventData.name} ({division.charAt(0).toUpperCase() + division.slice(1).toLowerCase()})</p>
                                    <hr
                                        style={{
                                            marginTop: '5px',
                                            border: 'none',
                                            borderBottom: '2px solid #ccc',
                                            opacity: 0.35
                                        }}
                                    />
                                    <br></br>
                                    <div className='results-table charted-decks'>
                                    {results
                                        .map((result, idx) => ({ result, originalIndex: idx + 1 }))
                                        .filter(({ result }) => {
                                        // helper to strip off any "-assets-sprites-" prefix and ".png" suffix
                                        const cleanName = str =>
                                            str
                                            .split('/')           // take last segment
                                            .pop()                // "-assets-sprites-froslass-png.png"
                                            .replace(/^-?assets-sprites-/, '') // "froslass-png.png"
                                            .replace(/\.png$/, '');             // "froslass-png"

                                        // 1) clean whatever was already in result
                                        let sprite1 = cleanName(result.sprite1 || '');
                                        let sprite2 = cleanName(result.sprite2 || '');

                                        // 2) if still both empty, derive from decklist
                                        if (!sprite1 && !sprite2 && result.decklist) {
                                            const { firstSprite, secondSprite } = getPokemonSprites(
                                            result.decklist, '', ''
                                            );
                                            sprite1 = cleanName(firstSprite)  || '';
                                            sprite2 = cleanName(secondSprite) || '';
                                        }

                                        // 3) drop the special “blank” placeholder
                                        if (!sprite1) sprite1 = '/assets/sprites/blank.png';

                                        // 4) overwrite the result object so displayResults uses the clean versions
                                        result.sprite1 = sprite1;
                                        result.sprite2 = sprite2;

                                        // 5) filter by your selected archetype
                                        const key = getCustomLabel(eventId, sprite1, sprite2);
                                        return key === selectedArchetype;
                                        })
                                        .map(({ result, originalIndex }, index) => {
                                        const backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.3)';
                                        return (
                                            <div key={index} style={{ backgroundColor }}>
                                            {displayResults([result], eventId, division, originalIndex)}
                                            </div>
                                        );
                                        })}
                                    </div>
                                </div>
                            </>
                            )}
                            </div>
                        )}
                        {showModal && modalPlayer && (
                            <div className="modal-overlay" onClick={closeModal}>
                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <button className="close-btn" onClick={closeModal}><span class="material-symbols-outlined">close</span></button>
                                <div className="modal-player-header">
                                    <div className='modal-name-sprites'>
                                        <h3>{formatName(modalPlayer.name)}</h3>
                                        <DisplayPokemonSprites
                                            decklist={modalPlayer.decklist}
                                            sprite1={modalPlayer.sprite1}
                                            sprite2={modalPlayer.sprite2}
                                        />
                                    </div>
                                    <p style={{ marginTop: '-10px' }}><span className='bold'>{getPlacementSuffix(modalPlayer.placing)} Place</span> ({division.charAt(0).toUpperCase() + division.slice(1)})</p>
                                    <p style={{ marginTop: '3px' }}>{eventData.name}</p>
                                    <p style={{ marginTop: '3px' }}><span className='bold'>Record: </span>({modalPlayer.record.wins}-{modalPlayer.record.losses}-{modalPlayer.record.ties})</p>
                                    <div className='decklist-modal-btns'>
                                        <Link className='link-to-playerprofile' to={`/player/${normalizeName(modalPlayer.name)}-${modalPlayer.flag}`}>
                                            <button className="decklist-modal-button">Player Profile</button>
                                        </Link>
                                        {modalPlayer.decklist && (
                                            <Link
                                                to={`/tournaments/${eventId}/${division}/${encodeURIComponent(modalPlayer.name)}-${modalPlayer.flag}`}
                                                className="decklist-link-icon"
                                                title="View full decklist"
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
                                        <th style={{ textAlign: 'center' }}>Res</th>
                                        <th>Opponent</th>
                                        <th style={{ textAlign: 'center' }}>Deck</th>
                                        <th style={{ textAlign: 'center' }}>List</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(modalPlayer.rounds).reverse().map(([rnd, info]) => {
                                            const { code, name } = parseOpponent(info.name);

                                            const allPlayers = [...results, ...eliminatedRecords];
                                            const opponent   = allPlayers.find(p =>
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
                                                <td className="name-n-flag">
                                                    <div className="flag-container">
                                                        <img
                                                            className="flag-size"
                                                            src={flagsAbbrev[code] || flagsAbbrev.unknown}
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
                                                    : <em>-</em>
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
