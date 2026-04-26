import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import CardSearch from './CardSearch'
import DeckList from './DeckList'
import ExportButtons from './ExportButtons'
import '../css/DeckBuilder.css'
import '../css/setsInAdvancedDropdown.css'
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import patreonImg from '../assets/social-media-icons/black-patreon-blob.png';
import tcgplayerIcon from '../assets/social-media-icons/tcgplayer-logo.png'
import blueUltraBallSpinner from '../assets/logos/blue-ultra-ball.png'
import { isGLCLegal, isExpandedLegal, isStandardLegal } from '../Tools/CardLegality';

// fetch('https://api.pokemontcg.io/v2/sets').then(res => { console.log('List of All Sets', res.json()) })
// /* set */ fetch('https://api.pokemontcg.io/v2/cards?q=set.id:"svp"').then(res => { console.log('Download New Set', res.json()) })
// /* set */ fetch('https://api.pokemontcg.io/v2/cards?q=set.id:"mep"').then(res => { console.log('Download New Set', res.json()) })
// /* set */ fetch('https://api.pokemontcg.io/v2/cards?q=set.id:"rsv10pt5"').then(res => { console.log('Download New Set', res.json()) })
// /* set 250+ */ fetch('https://api.pokemontcg.io/v2/cards?q=set.id:svp&page=2').then(res => { console.log('Download Page 2', res.json()) })
// /* card */ fetch('https://api.pokemontcg.io/v2/cards/sv2-1').then(res => { console.log('Download New Card', res.json()) })

const energyIcons = {
  Colorless: '/assets/energy-symbols/colorless.png',
  Grass: '/assets/energy-symbols/grass.png',
  Fire: '/assets/energy-symbols/fire.png',
  Water: '/assets/energy-symbols/water.png',
  Lightning: '/assets/energy-symbols/lightning.png',
  Psychic: '/assets/energy-symbols/psychic.png',
  Fighting: '/assets/energy-symbols/fighting.png',
  Darkness: '/assets/energy-symbols/dark.png',
  Metal: '/assets/energy-symbols/metal.png',
  Fairy: '/assets/energy-symbols/fairy.png',
  Dragon: '/assets/energy-symbols/dragon.png',
  NoCost: '/assets/energy-symbols/deselect-all.png'
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

const basicEnergyTypes = ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Darkness", "Metal", "Fairy"];
const stageOrder = { "Stage 2": 0, "Stage 1": 1, "Basic": 2 };
const trainerPriority = {
  "Supporter": 0,
  "Item": 1,
  "Rocket's Secret Machine": 1,
  "Rocket's Secret Robot": 1,
  "Goldenrod Game Corner": 1,
  "Pokémon Tool": 2,
  "Technical Machine": 2,
  "Stadium": 3,
};

const IMPORT_SET_ABBREV_ALIASES = {
  BS2: 'B2',
  WP: 'PR-BS',
  E1: 'EX',
  E2: 'AQ',
  E3: 'SK',
  NP: 'PR-EX',
  FL: 'RG',
  FRLG: 'RG',
  DPP: 'PR-DP',
  HSP: 'PR-HS',
  BWP: 'PR-BLW',
  'PR-BW': 'PR-BLW',
  XYP: 'PR-XY',
  SMP: 'PR-SM',
  SP: 'PR-SW',
  SVP: 'PR-SV'
};

const normalizeImportedSetAbbrev = (setAbbrev) => {
  if (!setAbbrev) return setAbbrev;
  const cleaned = String(setAbbrev).trim().toUpperCase();
  return IMPORT_SET_ABBREV_ALIASES[cleaned] || cleaned;
};

const normalizeImportedCardNumber = (setAbbrev, number) => {
  const cleanSet = String(setAbbrev || '').trim().toUpperCase();
  const rawNum = String(number || '').trim();

  if (!rawNum) return rawNum;

  const upperNum = rawNum.toUpperCase();

  if (cleanSet === 'PR-DP') {
    return upperNum.startsWith('DP') ? upperNum : `DP${upperNum}`;
  }

  if (cleanSet === 'PR-HS') {
    const n = upperNum.replace(/^HGSS/i, '');
    const parsed = parseInt(n, 10);
    return Number.isFinite(parsed) ? String(parsed).padStart(2, '0') : n;
  }

  if (cleanSet === 'PR-BLW') {
    const n = upperNum.replace(/^BW/i, '');
    const parsed = parseInt(n, 10);
    return Number.isFinite(parsed) ? String(parsed).padStart(2, '0') : n;
  }

  if (cleanSet === 'PR-XY') {
    const n = upperNum.replace(/^XY/i, '');
    const parsed = parseInt(n, 10);
    return Number.isFinite(parsed) ? String(parsed) : n;
  }

  if (cleanSet === 'PR-SM') {
    const n = upperNum.replace(/^SM/i, '');
    const parsed = parseInt(n, 10);
    return Number.isFinite(parsed) ? String(parsed).padStart(2, '0') : n;
  }

  if (cleanSet === 'PR-SW') {
    const n = upperNum.replace(/^SWSH/i, '');
    const parsed = parseInt(n, 10);
    return Number.isFinite(parsed) ? String(parsed).padStart(3, '0') : n;
  }

  if (cleanSet === 'PR-SV') {
    const n = upperNum.replace(/^SVP/i, '');
    const parsed = parseInt(n, 10);
    return Number.isFinite(parsed) ? String(parsed) : n;
  }

  // Keep normal set suffix letters lowercase: 75A -> 75a
  return rawNum.replace(/^(\d+)([A-Z])$/, (_, digits, suffix) => `${digits}${suffix.toLowerCase()}`);
};

function sortDeck(deck) {
  const pokemons = deck.filter(c => c.supertype === "Pokémon");
  const trainers = deck.filter(c => c.supertype === "Trainer");
  const energies = deck.filter(c => c.supertype === "Energy");

  const baseName = (s = '') =>
    s
      .replace(/\s*LV\.?X\s*$/i, '')
      .replace(/\s*(?:[☆★]\s*)?δ\s*$/u, '')
      .trim();

  const speciesKey = (s = '') =>
    baseName(s).replace(/\s+(?:VSTAR|VMAX|V)\s*$/i, '').trim();

  const isV = c => (c.subtypes?.includes('V')) || /\sV\s*$/i.test(c.name);
  const isVSTAR = c => (c.subtypes?.includes('VSTAR')) || /\sVSTAR\s*$/i.test(c.name);
  const isVMAX = c => (c.subtypes?.includes('VMAX')) || /\sVMAX\s*$/i.test(c.name);
  const isVLine = c => isV(c) || isVSTAR(c) || isVMAX(c);
  const vTier = c => (isVMAX(c) ? 0 : isVSTAR(c) ? 1 : isV(c) ? 2 : 99);
  const isMega = c => Array.isArray(c.subtypes) && c.subtypes.includes('MEGA');

  const sortedTrainers = [...trainers].sort((a, b) => {
    const subA = a.subtypes?.[0] ?? "";
    const subB = b.subtypes?.[0] ?? "";
    const fallback = trainerPriority["Item"] ?? 1;
    const priA = trainerPriority[subA] ?? fallback;
    const priB = trainerPriority[subB] ?? fallback;
    if (priA !== priB) return priA - priB;
    return b.count - a.count;
  });

  const sortedEnergies = [...energies].sort((a, b) => {
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

  const evoGraph = {};
  pokemons.forEach(card => {
    const self = baseName(card.name);
    evoGraph[self] = evoGraph[self] || new Set();
    if (card.evolvesFrom) {
      evoGraph[self].add(card.evolvesFrom);
      evoGraph[card.evolvesFrom] = evoGraph[card.evolvesFrom] || new Set();
      evoGraph[card.evolvesFrom].add(self);
    }
    (card.evolvesTo || []).forEach(child => {
      evoGraph[self].add(child);
      evoGraph[child] = evoGraph[child] || new Set();
      evoGraph[child].add(self);
    });
  });

  const speciesGroups = {};
  pokemons.forEach(c => {
    if (!isVLine(c)) return;
    const key = speciesKey(c.name);
    (speciesGroups[key] ||= []).push(c);
  });

  Object.values(speciesGroups).forEach(group => {
    if (group.length < 2) return;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = baseName(group[i].name);
        const b = baseName(group[j].name);
        evoGraph[a] = evoGraph[a] || new Set();
        evoGraph[b] = evoGraph[b] || new Set();
        evoGraph[a].add(b);
        evoGraph[b].add(a);
      }
    }
  });

  const visited = new Set();
  const families = [];
  pokemons.forEach(card => {
    const start = baseName(card.name);
    if (visited.has(start)) return;

    const queue = [start];
    visited.add(start);
    const family = [];

    while (queue.length) {
      const cur = queue.shift();
      pokemons.forEach(c => {
        if (baseName(c.name) === cur) family.push(c);
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

  families.forEach(fam => {
    fam.highestStage = fam.reduce((minSt, c) => {
      const st = c.subtypes?.[0] || "Basic";
      return Math.min(minSt, stageOrder[st] ?? stageOrder.Basic);
    }, stageOrder.Basic);

    fam.highestCount = fam.reduce((maxC, c) => Math.max(maxC, c.count), 0);

    fam.sort((a, b) => {
      const aLU = Array.isArray(a.subtypes) && a.subtypes.includes('Level-Up');
      const bLU = Array.isArray(b.subtypes) && b.subtypes.includes('Level-Up');
      if (aLU !== bLU) return aLU ? -1 : 1;

      const sameSpecies = speciesKey(a.name) === speciesKey(b.name);
      if (sameSpecies && (isVLine(a) || isVLine(b))) {
        const ta = vTier(a), tb = vTier(b);
        if (ta !== tb) return ta - tb;
      }

      if (isMega(a) !== isMega(b)) return isMega(a) ? -1 : 1;

      const pa = stageOrder[a.subtypes?.[0] ?? "Basic"];
      const pb = stageOrder[b.subtypes?.[0] ?? "Basic"];
      if (pa !== pb) return pa - pb;

      return b.count - a.count;
    });
  });

  families.sort((a, b) => {
    if (b.highestCount !== a.highestCount) {
      return b.highestCount - a.highestCount;
    }
    return a.highestStage - b.highestStage;
  });

  const sortedPokemons = [];
  families.forEach(fam => {
    fam.sort((a, b) => {
      if (isMega(a) !== isMega(b)) return isMega(a) ? -1 : 1;
      const pa = stageOrder[a.subtypes?.[0] ?? "Basic"];
      const pb = stageOrder[b.subtypes?.[0] ?? "Basic"];
      if (pa !== pb) return pa - pb;
      return b.count - a.count;
    });
    sortedPokemons.push(...fam);
  });

  return [...sortedPokemons, ...sortedTrainers, ...sortedEnergies];
}

const STORAGE_KEY = 'deckbuilder-deck'

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

const DeckBuilderComp = styled.div`
    .card-search-container {background-image: ${({ theme }) => theme.cardSearchBg}}
    height: 100vh;
    overflow: hidden;
    display: flex;
    .support-again {
      color: ${({ theme }) => theme.text};
      background-image: ${({ theme }) => theme.supportPatreonBtn};
      border: ${({ theme }) => theme.supportPatreonBg};
    }
    .card-modal-content {background-image: ${({ theme }) => theme.cardModalContentZoomCard};}
    .set-tile-code, .set-tile-trigger {color: ${({ theme }) => theme.text};}
    .set-tile-grid {background: ${({ theme }) => theme.setTileGridBg};}
    .set-tile-btn {
      background: ${({ theme }) => theme.setTileBtnBg};
      border: ${({ theme }) => theme.setTileBtnBorder};
    }
    .set-tile-btn:hover {background: ${({ theme }) => theme.setTileBtnBgHover};}
    .set-tile-era-header {border-top: ${({ theme }) => theme.setTileBtnHr};}
    .set-tile-era-header:first-child {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }
`;

export default function DeckBuilder() {
  const { theme } = useTheme();
  const [limitCounts, setLimitCounts] = useState(true);
  const [showLimitMenu, setShowLimitMenu] = useState(false);
  const [viewMode, setViewMode] = useState('image');
  const [zoomScale, setZoomScale] = useState(() => {
    const savedZoom = localStorage.getItem('decklistZoomScale');
    return savedZoom ? parseFloat(savedZoom) : 1.4;
  });
  const [loadingHash, setLoadingHash] = useState(false)
  const [exportingImage, setExportingImage] = useState(false)
  const deckRef = useRef()
  const menuRef = useRef(null)
  const params = new URLSearchParams(window.location.search);
  const originalDeckId = params.get('deckId');
  const [legalInfo, setLegalInfo] = useState({ std: null, exp: null, glc: null });

  const WALKTHROUGH_SEEN_KEY = 'ptcglegends_deckbuilder_walkthrough_seen';
  const searchPanelRef = useRef(null);
  const deckAreaRef = useRef(null);
  const actionsRowRef = useRef(null);
  const myDecksBtnRef = useRef(null);
  const deckOptionsBtnsRef = useRef(null);
  const helpBtnRef = useRef(null);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [walkthroughRect, setWalkthroughRect] = useState(null);
  const walkthroughOriginalDeckRef = useRef(null);
  const walkthroughInjectedDemoRef = useRef(false);
  const [walkthroughLoading, setWalkthroughLoading] = useState(false);

  const WALKTHROUGH_DECK_TEXT =
    `
3 M Rayquaza-EX ROS 105
2 Rayquaza-EX ROS 104
1 Rayquaza-EX PR-XY 73
4 Shaymin-EX ROS 106
2 Hoopa-EX AOR 89
1 Keldeo-EX BCR 142
1 Jirachi-EX PLB 98
1 Dragonite-EX EVO 106
1 Exeggcute PLB 102
1 Giratina PR-XY 184
2 Hex Maniac AOR 75a
2 Lysandre FLF 104
1 Ghetsis PLF 115
1 Colress PLS 135
1 N NVI 101
1 AZ PHF 117
1 Karen PR-XY 177
4 VS Seeker ROS 110
4 Ultra Ball PLF 122
4 Trainers' Mail AOR 100
3 Mega Turbo ROS 86
2 Battle Compressor Team Flare Gear PHF 92
1 Computer Search BCR 137
3 Rayquaza Spirit Link ROS 87
2 Float Stone PLF 99
4 Sky Field ROS 89
4 Double Colorless Energy GRI 166
3 Basic Water Energy CIN 124
`;

  const walkthroughSteps = [
    {
      ref: searchPanelRef,
      title: 'Search for Cards',
      body: 'Use this section to search for cards; either by name, card text, or flavor text. Click the blue "Advanced Search" button to access a ton of filters - from eras, popular formats, card types, legalities and more...'
    },
    {
      ref: deckAreaRef,
      title: 'Edit your Deck',
      body: 'Cards you add appear here in the decklist. You can edit card counts, click on cards to view their info, and drag cards around to manually re-order them. (You can drag and drop images from your device too!)'
    },
    {
      ref: actionsRowRef,
      title: 'Decklist Options',
      body: 'This row lets you sort your deck, delete it, upload custom images as cards, use the slider to adjust the zoom size of cards in your deck, remove card limits (allowing more than 4 copies per card or multiple Ace Specs), and more...'
    },
    {
      ref: deckOptionsBtnsRef,
      title: 'Import, Export, and Save',
      body: 'Use these buttons to import a decklist from somewhere else, export decks in different ways, (including saving as an image and printing it for league). Lastly, you can save decks to your collection if you\'re logged in.'
    },
    {
      ref: myDecksBtnRef,
      title: 'Your Deck Collection',
      body: (
        <>
          Click "My Decks" to open your deck collection. In your account page, you can organize your decks into folders, and even make them public for others to view your collection! (Perfect for content creators!){' '}
          <a
            href="https://www.ptcglegends.com/AlexWilson/deck-collection"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1290eb' }}
          >
            Check out this example
          </a>
        </>
      )
    },
    {
      ref: helpBtnRef,
      title: 'Thank You!',
      body: (
        <>
          If you love this app, please consider supporting us on
          {' '}
          <a
            href="https://www.patreon.com/PTCGLegends"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1290eb' }}
          >
            Patreon
          </a>.
          <br></br>
          <br></br>
          You can replay this walkthrough anytime, by clicking the blue info button in the bottom corner.{' '}
          <br></br>
          <br></br>
          Tag us{' '}
          <a
            href="https://x.com/PTCG_Legends"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1290eb' }}
          >
            @PTCG_Legends
          </a>
          {' '}on twitter with your new decklists! Happy building!
        </>
      )
    }
  ];

  useEffect(() => {
    const seen = localStorage.getItem(WALKTHROUGH_SEEN_KEY) === 'true';

    const looksLoggedIn =
      !!localStorage.getItem('PTCGLegendsToken') ||
      !!localStorage.getItem('PTCGLegendsUsername');

    if (!seen && !looksLoggedIn) {
      startWalkthrough();
    }
  }, []);

  const updateWalkthroughRect = () => {
    const step = walkthroughSteps[walkthroughStep];
    const el = step?.ref?.current;
    if (!el) {
      setWalkthroughRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    setWalkthroughRect(rect);
  };

  const startWalkthrough = async () => {
    setWalkthroughLoading(true);

    try {
      const currentDeck = Array.isArray(deck) ? deck : [];
      walkthroughOriginalDeckRef.current = currentDeck.map(card => ({ ...card }));
      walkthroughInjectedDemoRef.current = true;

      await importWalkthroughDeckFromText(WALKTHROUGH_DECK_TEXT, true);

      await new Promise(resolve => requestAnimationFrame(() => resolve()));

      setWalkthroughStep(0);
      setWalkthroughOpen(true);
    } finally {
      setWalkthroughLoading(false);
    }
  };

  const closeWalkthrough = (markSeen = true) => {
    const originalDeck = walkthroughOriginalDeckRef.current || [];
    const hadOriginalCards = originalDeck.length > 0;

    if (walkthroughInjectedDemoRef.current && hadOriginalCards) {
      setDeck(originalDeck);
    }

    walkthroughOriginalDeckRef.current = null;
    walkthroughInjectedDemoRef.current = false;

    setWalkthroughOpen(false);
    setWalkthroughStep(0);
    setWalkthroughRect(null);

    if (markSeen) {
      localStorage.setItem(WALKTHROUGH_SEEN_KEY, 'true');
    }
  };

  const nextWalkthroughStep = () => {
    if (walkthroughStep >= walkthroughSteps.length - 1) {
      closeWalkthrough(true);
      return;
    }
    setWalkthroughStep(s => s + 1);
  };

  const prevWalkthroughStep = () => {
    setWalkthroughStep(s => Math.max(0, s - 1));
  };

  useEffect(() => {
    if (!walkthroughOpen) return;

    updateWalkthroughRect();

    const onResize = () => updateWalkthroughRect();
    const onScroll = () => updateWalkthroughRect();

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [walkthroughOpen, walkthroughStep]);

  useEffect(() => {
    document.body.classList.add("deckbuilder-page");
    return () => document.body.classList.remove("deckbuilder-page");
  }, []);

  useEffect(() => {
    if (!showLimitMenu) return
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowLimitMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLimitMenu])

  const [deck, setDeck] = useState(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    if (params.has('deck')) {
      try {
        const arr = JSON.parse(decodeURIComponent(params.get('deck')));
        return [];
      } catch {
        console.warn('Invalid deck in URL');
      }
    }
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    if (!params.has('deck')) return;

    let minimal;
    try {
      minimal = JSON.parse(decodeURIComponent(params.get('deck')));
      minimal = minimal.map(c => ({ ...c, count: Number(c.count) }));
    } catch {
      return;
    }

    setLoadingHash(true);

    (async () => {
      try {
        const fullDeck = [];

        for (const c of minimal) {
          const setCode = c.set || c.setAbbrev;

          if (c.isUploadedImageCard || setCode === 'UPL') {
            fullDeck.push({
              ...c,
              set: setCode,
              setAbbrev: setCode,
              images: c.images || {
                small: c.imageUrl,
                large: c.imageUrl
              }
            });
            continue;
          }

          const resp = await fetch(`/api/cards/${setCode}/${c.number}`);
          if (!resp.ok) continue;

          const card = await resp.json();
          fullDeck.push({
            ...card,
            count: c.count
          });
        }

        setDeck(fullDeck);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHash(false);
      }
    })();
  }, []);

  const [zoomCard, setZoomCard] = useState(null);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    const safeDeck = deck.map(card => {
      if (!card?.isUploadedImageCard) return card;

      return {
        ...card,
        uploadedFileObject: undefined
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDeck));
  }, [deck]);

  useEffect(() => {
    setIsRotated(false);
  }, [zoomCard]);

  const isBasicEnergy = c =>
    c?.supertype === 'Energy' && /^Basic\s/i.test(c?.name || '');

  const isUnlimitedByRules = (c) => {
    const r = c?.rules;
    if (!r) return false;
    const rx = /You may have as many of this card in your deck as you like/i;
    return Array.isArray(r) ? r.some(s => rx.test(s)) : rx.test(r);
  };

  const isAceSpec = c =>
    Array.isArray(c?.subtypes) && c.subtypes.includes('ACE SPEC');
  const isRadiant = c =>
    Array.isArray(c?.subtypes) && c.subtypes.includes('Radiant');
  const isStar = c =>
    Array.isArray(c?.subtypes) && c.subtypes.includes('Star');

  const isSubtypeSingleton = (c) => isAceSpec(c) || isRadiant(c) || isStar(c);

  const totalAceSpec = arr =>
    arr.reduce((sum, c) => sum + (isAceSpec(c) ? (Number(c.count) || 0) : 0), 0);
  const totalRadiant = arr =>
    arr.reduce((sum, c) => sum + (isRadiant(c) ? (Number(c.count) || 0) : 0), 0);
  const totalStar = arr =>
    arr.reduce((sum, c) => sum + (isStar(c) ? (Number(c.count) || 0) : 0), 0);

  const hasDiamondInName = c => /[♢◇]/.test(c?.name || '');
  const hasShiningInName = (c) => {
    const rules = Array.isArray(c?.rules)
      ? c.rules
      : typeof c?.rules === 'string'
        ? [c.rules]
        : [];

    return rules.some(rule =>
      /you can't have more than 1 .* in your deck/i.test(String(rule))
    );
  };
  const isNameSingleton = c => hasDiamondInName(c) || hasShiningInName(c);

  const totalByExactName = (arr, name, excludeIdx = -1) =>
    arr.reduce((sum, c, i) =>
      i === excludeIdx ? sum : (c.name === name ? sum + (Number(c.count) || 0) : sum)
      , 0);

  const totalByNameNonSingleton = (arr, name, excludeIdx = -1) =>
    arr.reduce((sum, c, i) => {
      if (i === excludeIdx) return sum;
      if (isBasicEnergy(c) || isSubtypeSingleton(c) || isNameSingleton(c)) return sum;
      return c.name === name ? sum + (Number(c.count) || 0) : sum;
    }, 0);

  const isLevelUp = (c) =>
    Array.isArray(c?.subtypes) && c.subtypes.includes('Level-Up');

  const normalizeLimitName = (name = '') =>
    name.replace(/\s*LV\.?X\s*$/i, '').trim();

  const limitNameOf = (c) => normalizeLimitName(c?.name || '');

  const totalByExactLimitName = (arr, card, excludeIdx = -1) =>
    arr.reduce((sum, c, i) =>
      i === excludeIdx ? sum
        : (limitNameOf(c) === limitNameOf(card) ? sum + (Number(c.count) || 0) : sum)
      , 0);

  const totalByLimitNameNonSingleton = (arr, card, excludeIdx = -1) =>
    arr.reduce((sum, c, i) => {
      if (i === excludeIdx) return sum;
      if (isBasicEnergy(c) || isSubtypeSingleton(c) || isNameSingleton(c)) return sum;
      return (limitNameOf(c) === limitNameOf(card))
        ? sum + (Number(c.count) || 0)
        : sum;
    }, 0);

  const makeUploadedImageCard = (file) => {
    const objectUrl = URL.createObjectURL(file);
    const baseName = (file.name || 'Uploaded Card').replace(/\.[^.]+$/, '');

    return {
      id: `uploaded-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: baseName,
      setAbbrev: 'UPL',
      set: 'UPL',
      number: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      supertype: 'Custom',
      subtypes: ['Uploaded'],
      count: 1,
      isUploadedImageCard: true,
      uploadedFileName: file.name,
      uploadedFileObject: file,
      imageUrl: objectUrl,
      images: {
        small: objectUrl,
        large: objectUrl
      }
    };
  };

  const addUploadedImageCard = (customCard) => {
    setDeck(prev => [...prev, customCard]);
  };

  const handleUploadImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type && file.type.startsWith('image/'));

    imageFiles.forEach(file => {
      addUploadedImageCard(makeUploadedImageCard(file));
    });

    e.target.value = '';
  };

  function handleResetDeck() {
    if (deck.length === 0) return;

    const ok = window.confirm(
      'Delete current decklist?'
    );
    if (!ok) return;

    setDeck([]);
  }

  function addCard(cardToAdd) {
    setDeck(prevDeck => {
      const idx = prevDeck.findIndex(
        c => c.setAbbrev === cardToAdd.setAbbrev && c.number === cardToAdd.number
      );

      if (!limitCounts || isBasicEnergy(cardToAdd) || isUnlimitedByRules(cardToAdd)) {
        if (idx >= 0) {
          return prevDeck.map((c, i) => i === idx ? { ...c, count: c.count + 1 } : c);
        }
        return [...prevDeck, { ...cardToAdd, count: 1 }];
      }

      if (isAceSpec(cardToAdd)) {
        const canAdd = Math.max(0, 1 - totalAceSpec(prevDeck));
        if (canAdd <= 0) return prevDeck;
        if (idx >= 0) {
          return prevDeck.map((c, i) => i === idx ? { ...c, count: Math.min(c.count + 1, 1) } : c);
        }
        return [...prevDeck, { ...cardToAdd, count: 1 }];
      }

      if (isRadiant(cardToAdd)) {
        const canAdd = Math.max(0, 1 - totalRadiant(prevDeck));
        if (canAdd <= 0) return prevDeck;
        if (idx >= 0) {
          return prevDeck.map((c, i) => i === idx ? { ...c, count: Math.min(c.count + 1, 1) } : c);
        }
        return [...prevDeck, { ...cardToAdd, count: 1 }];
      }

      if (isStar(cardToAdd)) {
        const canAdd = Math.max(0, 1 - totalStar(prevDeck));
        if (canAdd <= 0) return prevDeck;
        if (idx >= 0) {
          return prevDeck.map((c, i) => i === idx ? { ...c, count: Math.min(c.count + 1, 1) } : c);
        }
        return [...prevDeck, { ...cardToAdd, count: 1 }];
      }

      if (isNameSingleton(cardToAdd)) {
        const byName = totalByExactLimitName(prevDeck, cardToAdd);
        if (byName >= 1) return prevDeck;
        if (idx >= 0) {
          return prevDeck.map((c, i) =>
            i === idx ? { ...c, count: Math.min(c.count + 1, 1) } : c
          );
        }
        return [...prevDeck, { ...cardToAdd, count: 1 }];
      }

      const totalSameName = totalByLimitNameNonSingleton(prevDeck, cardToAdd);
      if (totalSameName >= 4) return prevDeck;

      if (idx >= 0) {
        const totalOther = totalByLimitNameNonSingleton(prevDeck, cardToAdd, idx);
        const maxForThisPrinting = Math.max(0, 4 - totalOther);
        return prevDeck.map((c, i) =>
          i === idx ? { ...c, count: Math.min(c.count + 1, maxForThisPrinting) } : c
        );
      }

      return [...prevDeck, { ...cardToAdd, count: 1 }];
    });
  }

  function updateCount(index, newCount) {
    setDeck(prev => {
      const card = prev[index];

      if (!limitCounts || isBasicEnergy(card) || isUnlimitedByRules(card)) {
        return prev
          .map((c, i) => i === index ? { ...c, count: newCount } : c)
          .filter(c => c.count > 0);
      }

      if (isAceSpec(card)) {
        const others = prev.reduce((sum, c, i) =>
          i === index ? sum : sum + (isAceSpec(c) ? (Number(c.count) || 0) : 0), 0);
        const maxForThis = Math.max(0, 1 - others);
        const clamped = Math.min(Math.max(newCount, 0), maxForThis);
        return prev.map((c, i) => i === index ? { ...c, count: clamped } : c).filter(c => c.count > 0);
      }

      if (isRadiant(card)) {
        const others = prev.reduce((sum, c, i) =>
          i === index ? sum : sum + (isRadiant(c) ? (Number(c.count) || 0) : 0), 0);
        const maxForThis = Math.max(0, 1 - others);
        const clamped = Math.min(Math.max(newCount, 0), maxForThis);
        return prev.map((c, i) => i === index ? { ...c, count: clamped } : c).filter(c => c.count > 0);
      }

      if (isStar(card)) {
        const others = prev.reduce((sum, c, i) =>
          i === index ? sum : sum + (isStar(c) ? (Number(c.count) || 0) : 0), 0);
        const maxForThis = Math.max(0, 1 - others);
        const clamped = Math.min(Math.max(newCount, 0), maxForThis);
        return prev.map((c, i) => i === index ? { ...c, count: clamped } : c).filter(c => c.count > 0);
      }

      if (isNameSingleton(card)) {
        const othersByName = totalByExactLimitName(prev, card.name, index);
        const maxForThis = Math.max(0, 1 - othersByName);
        const clamped = Math.min(Math.max(newCount, 0), maxForThis);
        return prev
          .map((c, i) => i === index ? { ...c, count: clamped } : c)
          .filter(c => c.count > 0);
      }

      const totalOther = totalByLimitNameNonSingleton(prev, card, index);
      const maxForThis = Math.max(0, 4 - totalOther);
      const clamped = Math.min(Math.max(newCount, 0), maxForThis);

      return prev
        .map((c, i) => i === index ? { ...c, count: clamped } : c)
        .filter(c => c.count > 0);
    });
  }

  const [importing, setImporting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function importDeck(overwrite = false) {
    setImporting(true);
    try {
      const startingDeck = overwrite ? [] : [...deck];
      if (overwrite) setDeck([]);

      const text = await navigator.clipboard.readText();
      const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.endsWith(':'))
        .filter(l => /^\d+\s/.test(l));

      const merged = [...startingDeck];

      for (const line of lines) {
        const parts = line.split(/\s+/);
        const count = parseInt(parts[0], 10);
        const rawNumber = parts.pop();
        const rawSetAbbrev = parts.pop();
        const setAbbrev = normalizeImportedSetAbbrev(rawSetAbbrev);
        const number = normalizeImportedCardNumber(setAbbrev, rawNumber);
        const name = parts.slice(1).join(' ');

        // const safeName = encodeURIComponent(name).replace(/\./g, '%2E');
        // const url = `/api/cards/searchbyname/partial/${safeName}`;

        // const res = await fetch(url);
        // if (!res.ok) {
        //   console.error('search error', res.status, await res.text());
        //   continue;
        // }
        // const results = await res.json();

        // const match = results.find(c => c.setAbbrev === setAbbrev && c.number === number);
        // if (!match) {
        //   console.warn('Could not import:', name, setAbbrev, number);
        //   continue;
        // }

        // to allow AZ to be importable.

        let match = null;

        const directRes = await fetch(`/api/cards/${setAbbrev}/${number}`);
        if (directRes.ok) {
          match = await directRes.json();
        }

        if (!match) {
          const safeName = encodeURIComponent(name).replace(/\./g, '%2E');
          const res = await fetch(`/api/cards/searchbyname/partial/${safeName}`);
          if (!res.ok) {
            console.error('search error', res.status, await res.text());
            continue;
          }

          const results = await res.json();
          match = results.find(c => c.setAbbrev === setAbbrev && c.number === number);
        }

        if (!match) {
          console.warn('Could not import:', name, setAbbrev, number);
          continue;
        }

        const idx = merged.findIndex(c => c.setAbbrev === setAbbrev && c.number === number);

        if (!limitCounts || isBasicEnergy(match) || isUnlimitedByRules(match)) {
          if (idx > -1) merged[idx].count += count;
          else merged.push({ ...match, count });
          continue;
        }

        if (isAceSpec(match)) {
          const canAdd = Math.max(0, 1 - totalAceSpec(merged));
          if (canAdd <= 0) { console.warn('Skipped ACE SPEC (only one allowed):', match.name); continue; }
          if (idx > -1) merged[idx].count = Math.min(merged[idx].count + count, 1);
          else merged.push({ ...match, count: Math.min(count, 1) });
          continue;
        }

        if (isRadiant(match)) {
          const canAdd = Math.max(0, 1 - totalRadiant(merged));
          if (canAdd <= 0) { console.warn('Skipped Radiant (only one allowed):', match.name); continue; }
          if (idx > -1) merged[idx].count = Math.min(merged[idx].count + count, 1);
          else merged.push({ ...match, count: Math.min(count, 1) });
          continue;
        }

        if (isStar(match)) {
          const canAdd = Math.max(0, 1 - totalStar(merged));
          if (canAdd <= 0) { console.warn('Skipped Star (only one allowed):', match.name); continue; }
          if (idx > -1) merged[idx].count = Math.min(merged[idx].count + count, 1);
          else merged.push({ ...match, count: Math.min(count, 1) });
          continue;
        }

        if (isNameSingleton(match)) {
          const canAddByName = Math.max(0, 1 - totalByExactLimitName(merged, match.name));
          if (canAddByName <= 0) {
            console.warn('Skipped singleton-by-name (already have one):', match.name);
            continue;
          }
          if (idx > -1) {
            merged[idx].count = Math.min(merged[idx].count + count, 1);
          } else {
            merged.push({ ...match, count: Math.min(count, canAddByName) });
          }
          continue;
        }

        if (idx > -1) {
          const totalOther = totalByLimitNameNonSingleton(merged, match.name, idx);
          const maxForThis = Math.max(0, 4 - totalOther);
          merged[idx].count = Math.min(merged[idx].count + count, maxForThis);
        } else {
          const remaining = Math.max(0, 4 - totalByLimitNameNonSingleton(merged, match.name));
          if (remaining > 0) {
            merged.push({ ...match, count: Math.min(count, remaining) });
          } else {
            console.warn('Skipped (already 4 of this name):', match.name);
          }
        }
      }

      setDeck(merged);
    } catch (err) {
      console.error('Import failed', err);
    } finally {
      setImporting(false);
    }
  }

  async function importWalkthroughDeckFromText(text, overwrite = true) {
    const startingDeck = overwrite ? [] : [...deck];
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l && !l.endsWith(':'))
      .filter(l => /^\d+\s/.test(l));

    const merged = [...startingDeck];

    for (const line of lines) {
      const parts = line.split(/\s+/);
      const count = parseInt(parts[0], 10);
      const rawNumber = parts.pop();
      const rawSetAbbrev = parts.pop();
      const setAbbrev = normalizeImportedSetAbbrev(rawSetAbbrev);
      const number = normalizeImportedCardNumber(setAbbrev, rawNumber);
      const name = parts.slice(1).join(' ');

      let match = null;

      const directRes = await fetch(`/api/cards/${setAbbrev}/${number}`);
      if (directRes.ok) {
        match = await directRes.json();
      }

      if (!match) {
        const safeName = encodeURIComponent(name).replace(/\./g, '%2E');
        const res = await fetch(`/api/cards/searchbyname/partial/${safeName}`);
        if (!res.ok) continue;

        const results = await res.json();
        match = results.find(c => c.setAbbrev === setAbbrev && c.number === number);
      }

      if (!match) continue;

      const idx = merged.findIndex(c => c.setAbbrev === setAbbrev && c.number === number);

      if (!limitCounts || isBasicEnergy(match) || isUnlimitedByRules(match)) {
        if (idx > -1) merged[idx].count += count;
        else merged.push({ ...match, count });
        continue;
      }

      if (isAceSpec(match)) {
        const canAdd = Math.max(0, 1 - totalAceSpec(merged));
        if (canAdd <= 0) continue;
        if (idx > -1) merged[idx].count = Math.min(merged[idx].count + count, 1);
        else merged.push({ ...match, count: Math.min(count, 1) });
        continue;
      }

      if (isRadiant(match)) {
        const canAdd = Math.max(0, 1 - totalRadiant(merged));
        if (canAdd <= 0) continue;
        if (idx > -1) merged[idx].count = Math.min(merged[idx].count + count, 1);
        else merged.push({ ...match, count: Math.min(count, 1) });
        continue;
      }

      if (isStar(match)) {
        const canAdd = Math.max(0, 1 - totalStar(merged));
        if (canAdd <= 0) continue;
        if (idx > -1) merged[idx].count = Math.min(merged[idx].count + count, 1);
        else merged.push({ ...match, count: Math.min(count, 1) });
        continue;
      }

      if (isNameSingleton(match)) {
        const canAddByName = Math.max(0, 1 - totalByExactLimitName(merged, match));
        if (canAddByName <= 0) continue;
        if (idx > -1) {
          merged[idx].count = Math.min(merged[idx].count + count, 1);
        } else {
          merged.push({ ...match, count: Math.min(count, canAddByName) });
        }
        continue;
      }

      if (idx > -1) {
        const totalOther = totalByLimitNameNonSingleton(merged, match, idx);
        const maxForThis = Math.max(0, 4 - totalOther);
        merged[idx].count = Math.min(merged[idx].count + count, maxForThis);
      } else {
        const remaining = Math.max(0, 4 - totalByLimitNameNonSingleton(merged, match));
        if (remaining > 0) {
          merged.push({ ...match, count: Math.min(count, remaining) });
        }
      }
    }

    setDeck(merged);
  }

  const handleCardClick = card => setZoomCard(card);

  const totalCount = deck.reduce((sum, c) => sum + c.count, 0);

  const handleSort = () => {
    setDeck(current => sortDeck(current));
  };

  useEffect(() => {
    let abort = false;
    async function run() {
      if (!zoomCard) { setLegalInfo({ std: null, exp: null, glc: null }); return; }

      const glc = isGLCLegal(zoomCard);

      let std = isStandardLegal(zoomCard);
      let otherVersions = [];

      if (zoomCard.supertype !== 'Pokémon' && !std) {
        try {
          const safeName = encodeURIComponent(zoomCard.name).replace(/\./g, '%2E');
          const res = await fetch(`/api/cards/searchbyname/${safeName}`);
          if (res.ok) {
            otherVersions = await res.json();
            if (!abort) {
              std = otherVersions.some(o => isStandardLegal(o));
            }
          }
        } catch (_) { }
      }

      const exp = isExpandedLegal(zoomCard, { otherVersions });

      if (!abort) setLegalInfo({ std, exp, glc });
    }
    run();
    return () => { abort = true; };
  }, [zoomCard]);

  function Badge({ label, ok }) {
    if (ok == null) return null;
    return (
      <span
        className='legality-badge-zoomed'
        style={{
          padding: '4px 8px',
          borderRadius: 3,
          width: 110,
          textAlign: 'center',
          fontSize: 12,
          backgroundColor: ok ? '#3a9a22ab' : '#9a2e2287',
          border: `1px solid ${ok ? '#094a00' : '#6b0b00'}`,
          color: ok ? '#FFF' : '#FFF'
        }}
        title={ok ? `${label}: Legal` : `${label}: Illegal`}
      >
        {label}: {ok ? 'Legal' : 'Illegal'}
      </span>
    );
  }

  useEffect(() => {
    localStorage.setItem('decklistZoomScale', zoomScale);
  }, [zoomScale]);

  const TCGPLAYER_AFFILIATE_BASE = 'https://partner.tcgplayer.com/PTCG_Legends';

  function buildTcgplayerCardSearchUrl(card) {
    const query = [
      card?.name,
      card?.set?.name || card?.setName,
      card?.number
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    const landingUrl = new URL('https://www.tcgplayer.com/search/all/product');
    landingUrl.searchParams.set('q', query);
    landingUrl.searchParams.set('view', 'grid');

    const affiliateBase = TCGPLAYER_AFFILIATE_BASE.startsWith('http')
      ? TCGPLAYER_AFFILIATE_BASE
      : `https://${TCGPLAYER_AFFILIATE_BASE}`;

    const affiliateUrl = new URL(affiliateBase);
    affiliateUrl.searchParams.set('u', landingUrl.toString());

    return affiliateUrl.toString();
  }

  return (
    <DeckBuilderComp className='center' theme={theme}>
      <Helmet>
        <title>Pokémon TCG Deck Builder | PTCG Legends</title>
        <meta
          name="description"
          content="Build Pokémon TCG decks online with the PTCG Legends Deck Builder. Search cards, filter by format, import and export decklists, test ideas, and save decks to your collection."
        />
        <meta
          name="keywords"
          content="Pokemon TCG deck builder, PTCG deck builder, Pokémon card search, build Pokemon decks, decklist builder, Pokemon deck maker, PTCG Legends"
        />
        <link
          rel="canonical"
          href="https://www.ptcglegends.com/deckbuilder"
        />
        <meta property="og:title" content="Pokémon TCG Deck Builder | PTCG Legends" />
        <meta
          property="og:description"
          content="Build Pokémon TCG decks online with advanced card search, format filters, deck importing, exporting, and collection tools."
        />
        <meta
          property="og:url"
          content="https://www.ptcglegends.com/deckbuilder"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.ptcglegends.com/images/deckbuilder-preview.png"
        />
        <meta property="og:site_name" content="PTCG Legends" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pokémon TCG Deck Builder | PTCG Legends" />
        <meta
          name="twitter:description"
          content="Build Pokémon TCG decks online with advanced card search, format filters, deck importing, exporting, and collection tools."
        />
        <meta
          name="twitter:image"
          content="https://www.ptcglegends.com/images/deckbuilder-preview.png"
        />
        <meta name="author" content="PTCG Legends" />
      </Helmet>
      {walkthroughOpen && walkthroughRect && (
        <div className="walkthrough-overlay">
          <div
            className="walkthrough-highlight"
            style={{
              top: walkthroughRect.top - 6,
              left: walkthroughRect.left - 6,
              width: walkthroughRect.width + 12,
              height: walkthroughRect.height + 12
            }}
          />

          <div className="walkthrough-card">
            <p className="walkthrough-step-count">
              {walkthroughStep + 1} of {walkthroughSteps.length}
            </p>
            <h3>{walkthroughSteps[walkthroughStep].title}</h3>
            <p>{walkthroughSteps[walkthroughStep].body}</p>

            <div className="walkthrough-actions">
              <button onClick={() => closeWalkthrough(true)}>Skip</button>
              {walkthroughStep > 0 && (
                <button onClick={prevWalkthroughStep}>Back</button>
              )}
              <button onClick={nextWalkthroughStep}>
                {walkthroughStep === walkthroughSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
      {exportingImage && (
        <div className="image-export-overlay">
          <img src={blueUltraBallSpinner}
            alt="Loading"
            className="pokeball-spinner"
          />
        </div>
      )}
      {walkthroughLoading && (
        <div className="walkthrough-loading-overlay">
          <img
            src={blueUltraBallSpinner}
            alt="Loading walkthrough deck"
            className="pokeball-spinner"
          />
          <p className="walkthrough-loading-text">Loading Walkthrough...</p>
        </div>
      )}
      {loadingHash && (
        <div className="deckbuilder-spinner-overlay">
          <img src={blueUltraBallSpinner}
            alt="Loading"
            className="pokeball-spinner"
          />
        </div>
      )}
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

        const deckAceTotal = totalAceSpec(deck);
        const deckRadiantTotal = totalRadiant(deck);
        const deckStarTotal = totalStar(deck);
        const nameSingletonInDeck = totalByExactLimitName(deck, zoomCard);
        const remainingRegular = Math.max(0, 4 - totalByLimitNameNonSingleton(deck, zoomCard));

        const plusDisabled =
          !limitCounts ? false
            : isBasicEnergy(zoomCard) ? false
              : isUnlimitedByRules(zoomCard) ? false
                : isAceSpec(zoomCard)
                  ? ((deckAceTotal >= 1 && (currentCount || 0) === 0) || (currentCount || 0) >= 1)
                  : isRadiant(zoomCard)
                    ? ((deckRadiantTotal >= 1 && (currentCount || 0) === 0) || (currentCount || 0) >= 1)
                    : isStar(zoomCard)
                      ? ((deckStarTotal >= 1 && (currentCount || 0) === 0) || (currentCount || 0) >= 1)
                      : isNameSingleton(zoomCard)
                        ? ((nameSingletonInDeck >= 1 && (currentCount || 0) === 0) || (currentCount || 0) >= 1)
                        : remainingRegular <= 0;

        return (
          <div
            className="card-modal-overlay"
            onClick={() => setZoomCard(null)}
          >
            <div
              className="card-modal-content"
              onClick={e => e.stopPropagation()}
            >
              {zoomCard.images.large && (
                <div
                  className="modal-bg-blur"
                  style={{
                    backgroundImage: `url(${zoomCard.images.large})`
                  }}
                />
              )}
              <button
                className="modal-close"
                onClick={() => setZoomCard(null)}
              >
                ×
              </button>
              {['BREAK', 'LEGEND'].some(st => zoomCard.subtypes?.includes(st)) && (
                <button
                  type="button"
                  className="rotate-button"
                  onClick={e => {
                    e.stopPropagation();
                    setIsRotated(prev => !prev);
                  }}
                >
                  Rotate&nbsp;<span className="material-symbols-outlined">forward_media</span>
                </button>
              )}
              <img
                src={zoomCard.images.large}
                alt={zoomCard.name}
                className={`card-modal-image${isRotated ? ' rotated' : ''}`}
              />
              <div className="modal-count-controls">
                <button
                  className='btn-minus-r'
                  type="button"
                  onClick={() => handleDelta(-1)}
                  disabled={currentCount <= 0}
                >–</button>
                <span className="modal-count">
                  <p>( in deck )</p>
                  {currentCount}
                </span>
                <button
                  className='btn-plus-l'
                  type="button"
                  onClick={() => handleDelta(1)}
                  disabled={plusDisabled}
                >＋</button>
              </div>

              <div className="card-details">
                <h2>{zoomCard.name}</h2>
                <p>{zoomCard.supertype} • {zoomCard.subtypes?.join(' • ')}</p>
                {zoomCard.supertype === 'Pokémon' && (
                  <p>{zoomCard.types} • {zoomCard.hp}<span className='shrink'> HP</span></p>
                )}
                <hr className="zoomed-card-db-hr" />
                {(() => {
                  const trait = zoomCard.ancientTrait || zoomCard.ancienttrait;
                  if (!trait) return null;

                  const nameStr = String(trait.name || '');

                  const match = nameStr.match(/[ΔδαΑθΘΩω]/);

                  const colorMap = {
                    'Δ': '#138a15', 'δ': '#138a15',  // Delta → green
                    'α': '#1e88e5', 'Α': '#1e88e5',  // Alpha → blue
                    'θ': '#7b3fe4', 'Θ': '#7b3fe4',  // Theta → purple
                    'Ω': '#aa0300', 'ω': '#aa0300'   // Omega → red
                  };

                  const labelStyle = {
                    color: match ? colorMap[match[0]] : '#aa0300',
                    textShadow: '0 0 1px black'
                  };

                  return (
                    <p>
                      <strong>
                        Ancient Trait:
                        <span style={labelStyle}>
                          &nbsp;{trait.name}
                        </span>
                      </strong>
                      <br />{trait.text}
                    </p>
                  );
                })()}
                {zoomCard.abilities?.map((ab, i) => {
                  const abilityType = ab?.type || 'Ability';
                  const abilityColor =
                    abilityType === 'Poké-Body'
                      ? '#2e9b43'
                      : '#aa0300';

                  return (
                    <p key={i}>
                      <strong>
                        <span style={{ color: abilityColor, textShadow: '0 0 1px black' }}>
                          {abilityType}:
                        </span>{' '}
                        {ab.name}
                      </strong>
                      <br />
                      {ab.text}
                    </p>
                  );
                })}
                {zoomCard.attacks?.map((atk, i) => (
                  <div key={i}>
                    <p style={{ margin: '15px 0' }}>
                      {renderEnergyIcons(atk.cost)}&nbsp;&nbsp;
                      <strong>{atk.name}</strong>&nbsp;&nbsp;&nbsp;&nbsp;{atk.damage}
                      <br></br>{atk.text}
                    </p>
                  </div>
                ))}
                {Array.isArray(zoomCard.rules) && zoomCard.rules.length > 0 && (
                  <div className="modal-rules">
                    <ul>
                      {zoomCard.rules.map((text, i) => {
                        const shrinkRuleText =
                          zoomCard.supertype === 'Pokémon' &&
                          /^\s*.+?\s+rule\s*:/i.test(String(text || ''));

                        return (
                          <li
                            key={i}
                            style={shrinkRuleText ? { fontSize: '0.8em', fontStyle: 'italic' } : undefined}
                          >
                            {text}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {zoomCard.supertype === 'Pokémon' && (
                  <hr className='zoomed-card-db-hr'></hr>
                )}
                {zoomCard.supertype === 'Pokémon' && (
                  <>
                    <p>Weakness:&nbsp;
                      {zoomCard.weaknesses && zoomCard.weaknesses.length > 0 ? (
                        zoomCard.weaknesses.map((weakness, index) => (
                          <span key={index}>&nbsp;{weakness.type} {weakness.value}</span>
                        ))
                      ) : (
                        <span className='grey'>--</span>
                      )}
                    </p>
                    <p>Resistance:&nbsp;
                      {zoomCard.resistances && zoomCard.resistances.length > 0 ? (
                        zoomCard.resistances.map((resistance, index) => (
                          <span key={index}>&nbsp;{resistance.type} {resistance.value}</span>
                        ))
                      ) : (
                        <span className='grey'>--</span>
                      )}
                    </p>
                    <p>Retreat Cost: &nbsp;{zoomCard.convertedRetreatCost || 0}</p>
                  </>
                )}
                <hr className='zoomed-card-db-hr'></hr>
                {zoomCard.set && (
                  <p>
                    {zoomCard.rarity} • {zoomCard.number}/{zoomCard.set.printedTotal}
                    <br></br>{zoomCard.set.series}: {zoomCard.set.name}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  <Badge label="Standard" ok={legalInfo.std} />
                  <Badge label="Expanded" ok={legalInfo.exp} />
                  <Badge label="GLC" ok={legalInfo.glc} />
                </div>
              </div>
              <div className='bottom-db-modal-bts'>
                <a
                  href={buildTcgplayerCardSearchUrl(zoomCard)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="tcgplayer-btn">
                  <img
                    src={tcgplayerIcon}
                    alt="TCGplayer"
                    className="tcgplayer-btn__icon"
                  />
                  &nbsp;TCGplayer
                </a>
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
        <CardSearch
          onAddCard={addCard}
          onCardClick={handleCardClick}
          onRemoveFromDeck={({ setAbbrev, number }) => {
            setDeck(prev => {
              const next = prev.map(c => ({ ...c }));
              const idx = next.findIndex(c => c.setAbbrev === setAbbrev && c.number === number);
              if (idx !== -1) {
                next[idx].count = Math.max(0, (next[idx].count || 0) - 1);
                if (next[idx].count === 0) next.splice(idx, 1);
              }
              return next;
            });
          }}
          themeName={theme.themeName}
          ref={searchPanelRef}
        />
        <div
          className={`active-deck-container${dragOver ? ' drag-over' : ''}`}
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);

            const hasFiles = Array.from(e.dataTransfer?.types || []).includes('Files');
            e.dataTransfer.dropEffect = hasFiles ? 'copy' : 'move';
          }}
          onDragLeave={e => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);

            const files = Array.from(e.dataTransfer?.files || []);
            const imageFiles = files.filter(file => file.type && file.type.startsWith('image/'));

            if (imageFiles.length) {
              imageFiles.forEach(file => {
                addUploadedImageCard(makeUploadedImageCard(file));
              });
              return;
            }

            const json = e.dataTransfer.getData('application/json');
            if (json) {
              try {
                const card = JSON.parse(json);
                addCard(card);
              } catch { }
            }
          }}
        >
          <ExportButtons
            deck={deck}
            originalDeckId={originalDeckId}
            onImportDeck={importDeck}
            deckRef={deckRef}
            onExportStart={() => setExportingImage(true)}
            onExportEnd={() => setExportingImage(false)}
            myDecksBtnRef={myDecksBtnRef}
            deckOptionsBtnsRef={deckOptionsBtnsRef}
          />
          <div className='deck-stats'>
            <div className='moveit-moveit' ref={actionsRowRef}>
              <p className='stat-count'>
                Card Count:{' '}
                <span
                  className={`current-deck-count ${totalCount === 60
                    ? 'deck-count-green'
                    : totalCount > 60
                      ? 'deck-count-red'
                      : ''
                    }`}
                >
                  {totalCount}
                </span>
              </p>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <div id='deck-sort' style={{ cursor: 'pointer' }} onClick={handleSort}>
                  <span className="material-symbols-outlined">sort</span>
                  <p>&nbsp;Sort&nbsp;</p>
                </div>
                <div id="deck-reset" onClick={handleResetDeck}>
                  <span className="material-symbols-outlined">close</span>
                  <p>Reset</p>
                </div>
                <input
                  id="deck-upload-custom-image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleUploadImageSelect}
                />

                <button
                  type="button"
                  id="deck-upload-custom-image"
                  style={{ cursor: 'pointer' }}
                  title="Upload custom card image"
                  onClick={() => {
                    const input = document.getElementById('deck-upload-custom-image-input');
                    if (input) input.click();
                  }}
                >
                  <span className="material-symbols-outlined">upload_file</span>
                </button>
                <div className="limit-menu-container" ref={menuRef}>
                  <button
                    className="limit-menu-btn"
                    onClick={() => setShowLimitMenu(v => !v)}
                    aria-label="Open deck settings"
                  >
                    ⋮
                  </button>
                  {showLimitMenu && (
                    <div className="limit-menu-dropdown">
                      <div
                        className="menu-item"
                        onClick={() => {
                          setLimitCounts(true)
                          setShowLimitMenu(false)
                        }}
                      >
                        <span className="menu-check">
                          {limitCounts ? '✔︎' : ''}
                        </span>
                        Enforce Limits
                      </div>
                      <div
                        className="menu-item"
                        onClick={() => {
                          setLimitCounts(false)
                          setShowLimitMenu(false)
                        }}
                      >
                        <span className="menu-check">
                          {!limitCounts ? '✔︎' : ''}
                        </span>
                        Remove Limits
                      </div>
                      <hr className='dropdown-hr-options'></hr>
                      <div
                        className="menu-item"
                        onClick={() => {
                          setViewMode('image')
                          setShowLimitMenu(false)
                        }}
                      >
                        <span className="menu-check">{viewMode === 'image' ? '✔︎' : ''}</span>
                        Image View
                      </div>
                      <div
                        className="menu-item not-ready"
                        onClick={() => {
                          setViewMode('list')
                          setShowLimitMenu(false)
                        }}
                      >
                        <span className="menu-check">{viewMode === 'list' ? '✔︎' : ''}</span>
                        List View
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="zoom-slider hideon450">
                <button
                  type="button"
                  className="material-symbols-outlined slider-zoomout"
                  onClick={() =>
                    setZoomScale(z =>
                      Math.max(MIN_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(2)))
                    )
                  }
                  disabled={zoomScale <= MIN_ZOOM}
                >
                  remove
                </button>
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={ZOOM_STEP}
                  value={zoomScale}
                  onChange={e => setZoomScale(parseFloat(e.target.value))}
                />
                <button
                  type="button"
                  className="material-symbols-outlined slider-zoomin"
                  onClick={() =>
                    setZoomScale(z =>
                      Math.min(MAX_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(2)))
                    )
                  }
                  disabled={zoomScale >= MAX_ZOOM}
                >
                  add
                </button>
              </div>
            </div>
            <a href='https://www.patreon.com/PTCGLegends' target="_blank" className='support-again' ref={helpBtnRef}>
              <img src={patreonImg} />
              <p>Support Us</p>
            </a>
          </div>
          <div className="zoom-slider showon450">
            <button
              type="button"
              className="material-symbols-outlined slider-zoomout"
              onClick={() =>
                setZoomScale(z =>
                  Math.max(MIN_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(2)))
                )
              }
              disabled={zoomScale <= MIN_ZOOM}
            >
              remove
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              value={zoomScale}
              onChange={e => setZoomScale(parseFloat(e.target.value))}
            />
            <button
              type="button"
              className="material-symbols-outlined slider-zoomin"
              onClick={() =>
                setZoomScale(z =>
                  Math.min(MAX_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(2)))
                )
              }
              disabled={zoomScale >= MAX_ZOOM}
            >
              add
            </button>
          </div>
          <div
            ref={node => {
              deckRef.current = node;
              deckAreaRef.current = node;
            }}
            id="deck-to-export">
            <DeckList
              deck={deck}
              onUpdateCount={updateCount}
              onCardClick={handleCardClick}
              loading={importing}
              limitCounts={limitCounts}
              viewMode={viewMode}
              zoomScale={zoomScale}
              onCardDrop={addCard}
              onAddFromSearch={({ fromIndex, toIndex }) => {
                setDeck(prev => {
                  const next = [...prev];
                  const [moved] = next.splice(fromIndex, 1);
                  const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
                  next.splice(insertAt, 0, moved);
                  return next;
                });
              }}
            />
          </div>
        </div>
        <button
          type="button"
          className="deckbuilder-help-btn"
          onClick={startWalkthrough}
          disabled={walkthroughLoading}
          aria-label="Open deck builder walkthrough"
          title="Deck Builder walkthrough"
        >
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>
    </DeckBuilderComp>
  )
}
