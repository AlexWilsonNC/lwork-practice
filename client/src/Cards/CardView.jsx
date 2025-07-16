import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import DisplayPokemonSprites from '../Tournaments/pokemon-sprites';
import '../css/card.css';

const CardViewTheme = styled.div`
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    .card-info,
    .card-and-setinfo div {
        background: ${({ theme }) => theme.cardInfoBg};
    }
    .other-versions tr:nth-child(odd) {
        background: ${({ theme }) => theme.otherVers};
    }
    .player-deck-icons a {
        color: ${({ theme }) => theme.text};
    }
    .player-deck-icons a:hover {
        color: #1290eb;
    }
    .spinner {
        border-left-color: ${({ theme }) => theme.spinner};
    }
    .link-to-playerprofile,
    .white-link {
        color: ${({ theme }) => theme.text};
    }
    .link-to-playerprofile:hover,
    .white-link:hover {
        color: #1290eb;
    }
`;

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

const normalizeString = (str) => {
    return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const parseEventDate = (dateStr) => {
    // Try the built-in parser first
    const d = new Date(dateStr);
    if (!isNaN(d)) return d;

    // Try "StartMonth Day - EndMonth Day, Year"
    let m = dateStr.match(/(\w+ \d+)\s*-\s*(?:\w+ \d+),\s*(\d{4})/);
    if (m) {
        return new Date(`${m[1]}, ${m[2]}`);
    }

    // Try single "Month Day, Year"
    m = dateStr.match(/(\w+ \d+),\s*(\d{4})/);
    if (m) {
        return new Date(`${m[1]}, ${m[2]}`);
    }

    // Fallback to Invalid Date
    return d;
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString.replace(/-/g, '/'));
    return date.toLocaleDateString('en-US', options);
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

    // Define the special case with capital "De"
    const specialCases = {
        'de haes damien': 'De Haes Damien',
        'jamie depamphilis': 'Jamie DePamphilis',
    };

    // Check for special case match
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

const CardView = () => {
    const { theme } = useTheme();
    const { set, number } = useParams();
    const [cardInfo, setCardInfo] = useState(null);
    const [eventResults, setEventResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBasicEnergy, setIsBasicEnergy] = useState(false);
    const [showAllVersions, setShowAllVersions] = useState(false);
    const [otherVersions, setOtherVersions] = useState([]);
    const [eventsScanned, setEventsScanned] = useState(false);
    const [cardData, setCardData] = useState({ cardMap: {}, cardNameMap: {} });
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isStandardLegalAny, setIsStandardLegalAny] = useState(false);
    const [isExpandedLegalAny, setIsExpandedLegalAny] = useState(false);
    const [isGLCLegalAny, setIsGLCLegalAny] = useState(false);
    const [expandedEvents, setExpandedEvents] = useState(new Set());
    const [isRotated, setIsRotated] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchCardData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/${set}/${number}`);
                if (response.ok) {
                    const card = await response.json();
                    setCardInfo(card);
                } else {
                    console.error('Failed to fetch card data');
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCardData();
    }, [set, number]);

    useEffect(() => {
        if (!cardInfo) return;

        const fetchOtherVersions = async () => {
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/searchbyname/${encodeURIComponent(cardInfo.name)}`);
                if (response.ok) {
                    const data = await response.json();

                    const isMatch = (p) => {
                        if (cardInfo.supertype === 'Pokémon') {
                            const typesMatch = arraysEqual(p.types, cardInfo.types);
                            const attacksMatch = compareAttacks(p.attacks, cardInfo.attacks);
                            const weaknessesMatch = compareWeaknesses(p.weaknesses, cardInfo.weaknesses);
                            const resistancesMatch = compareWeaknesses(p.resistances, cardInfo.resistances);
                            const retreatCostMatch = compareRetreatCost(p, cardInfo);
                            const abilitiesMatch = (p.abilities || []).length === (cardInfo.abilities || []).length &&
                                (p.abilities || []).every((ability, index) => {
                                    const otherAbility = (cardInfo.abilities || [])[index];
                                    return (
                                        ability.name === otherAbility.name &&
                                        ability.type === otherAbility.type &&
                                        ability.text === otherAbility.text
                                    );
                                });

                            const ancientTraitMatch = p.ancientTrait?.name === cardInfo.ancientTrait?.name &&
                                p.ancientTrait?.text === cardInfo.ancientTrait?.text;

                            return (
                                p.hp === cardInfo.hp &&
                                typesMatch &&
                                attacksMatch &&
                                weaknessesMatch &&
                                resistancesMatch &&
                                retreatCostMatch &&
                                abilitiesMatch &&
                                ancientTraitMatch &&
                                p.name === cardInfo.name
                            );
                        } else {
                            return (
                                p.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase() &&
                                p.supertype === cardInfo.supertype
                            );
                        }
                    };

                    const compareRetreatCost = (card1, card2) => {
                        const retreat1 = card1.retreatCost || card1.convertedRetreatCost || 0;
                        const retreat2 = card2.retreatCost || card2.convertedRetreatCost || 0;

                        if (retreat1 === 0 && retreat2 === 0) {
                            return true;
                        }

                        if (typeof retreat1 === 'number' && typeof retreat2 === 'number') {
                            return retreat1 === retreat2;
                        }

                        if (Array.isArray(retreat1) && Array.isArray(retreat2)) {
                            return retreat1.length === retreat2.length;
                        }

                        return false;
                    };

                    const compareWeaknesses = (weaknesses1 = [], weaknesses2 = []) => {
                        if (weaknesses1.length !== weaknesses2.length) return false;
                        return weaknesses1.every((weakness, index) => {
                            const otherWeakness = weaknesses2[index];
                            return weakness.type === otherWeakness.type;
                        });
                    };

                    const compareAttacks = (attacks1 = [], attacks2 = []) => {
                        if (attacks1.length !== attacks2.length) return false;
                        return attacks1.every((attack, index) => {
                            const otherAttack = attacks2[index];
                            return (
                                attack.name === otherAttack.name &&
                                arraysEqual(attack.cost, otherAttack.cost) &&
                                attack.convertedEnergyCost === otherAttack.convertedEnergyCost &&
                                attack.damage === otherAttack.damage &&
                                attack.text === otherAttack.text
                            );
                        });
                    };

                    const arraysEqual = (arr1 = [], arr2 = []) => {
                        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
                        if (arr1.length !== arr2.length) return false;
                        return arr1.every((val, index) => val === arr2[index]);
                    };

                    const matchingCards = data.filter(isMatch);

                    setOtherVersions(matchingCards);

                    // Check legality across all versions
                    const isLegalInAnyFormat = (card, otherVersions, legalityCheck) => {
                        if (legalityCheck(card)) {
                            return true;
                        }
                        return otherVersions.some(legalityCheck);
                    };

                    setIsStandardLegalAny(isLegalInAnyFormat(cardInfo, matchingCards, isStandardLegal));
                    setIsExpandedLegalAny(isLegalInAnyFormat(cardInfo, matchingCards, isExpandedLegal));
                    setIsGLCLegalAny(isLegalInAnyFormat(cardInfo, matchingCards, isGLCLegal));

                } else {
                    console.error('Failed to fetch other versions data:', await response.json());
                }
            } catch (error) {
                console.error('Error fetching other versions:', error);
            }
        };

        fetchOtherVersions();
    }, [cardInfo]);

    useEffect(() => {
        const hasOtherArtseses = () => {
        };
        hasOtherArtseses();
    }, [otherVersions]);

    useEffect(() => {
        if (!cardInfo) return;

        // // Skip for Basic Energy
        // if (cardInfo.supertype === "Energy" && cardInfo.subtypes?.includes("Basic")) {
        //     setIsBasicEnergy(true);
        //     setLoading(false);
        //     setEventsScanned(true);
        //     return;
        // }

        setLoading(true);
        setEventsScanned(false);

        const prints = [{ set, number }];

        // 2) Add every other version of the same card
        otherVersions
            .filter(v => v.setAbbrev !== set || v.number !== number)
            .forEach(v => {
                prints.push({ set: v.setAbbrev, number: v.number });
            });

        // 3) Fetch all in parallel, flatten, sort by date, and set
        Promise.all(
            prints.map(({ set, number }) =>
                fetch(`/api/cardDecklists?set=${set}&number=${number}`)
                    .then(r => r.json())
                    .then(json => json.occurrences || [])
                    .catch(() => [])
            )
        )
        .then(arraysOfOcc => {
            const allOcc = arraysOfOcc.flat()

            // ═══════ dedupe by event+division+player+decklist ═══════
            const seen = new Set()
            const uniqueOcc = allOcc.filter(o => {
            // if you have a decklist.label field in o, include it here
            const key = [
                o.eventId,
                o.division,
                o.playerName,
                o.flag,
                o.decklist?.label || ''
            ].join('||')
            if (seen.has(key)) return false
            seen.add(key)
            return true
            })
            uniqueOcc.sort(
            (a, b) => parseEventDate(b.eventDate) - parseEventDate(a.eventDate)
            )
            setEventResults(uniqueOcc)
        })
        .catch(err => console.error("Error fetching card decklists:", err))
        .finally(() => {
            setLoading(false)
            setEventsScanned(true)
        })
    }, [cardInfo, set, number, otherVersions]);  // ← include otherVersions

    const toggleEventExpansion = (eventId) => {
        setExpandedEvents(prev => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    const bannedInExpanded = [
        { name: 'Archeops', set: 'DEX', number: '110' },
        { name: 'Archeops', set: 'NVI', number: '67' },
        { name: 'Chip-Chip Ice Axe', set: 'UNB', number: '165' },
        { name: 'Delinquent', set: 'BKP', number: '98' },
        { name: 'Delinquent', set: 'BKP', number: '98a' },
        { name: 'Delinquent', set: 'BKP', number: '98b' },
        { name: 'Duskull', set: 'CEC', number: '83' },
        { name: 'Flabébé', set: 'FLI', number: '83' },
        { name: 'Forest of Giant Plants', set: 'AOR', number: '74' },
        { name: 'Ghetsis', set: 'PLF', number: '101' },
        { name: 'Ghetsis', set: 'PLF', number: '115' },
        { name: 'Hex Maniac', set: 'AOR', number: '75' },
        { name: 'Hex Maniac', set: 'AOR', number: '75a' },
        { name: 'Island Challenge Amulet', set: 'CEC', number: '194' },
        { name: 'Island Challenge Amulet', set: 'CEC', number: '265' },
        { name: 'Jessie & James', set: 'HIF', number: '58' },
        { name: 'Jessie & James', set: 'HIF', number: '68' },
        { name: "Lt. Surge's Strategy", set: 'UNB', number: '178' },
        { name: "Lt. Surge's Strategy", set: 'HIF', number: '60' },
        { name: "Lysandre's Trump Card", set: 'PHF', number: '99' },
        { name: "Lysandre's Trump Card", set: 'PHF', number: '118' },
        { name: 'Marshadow', set: 'SLG', number: '45' },
        { name: 'Marshadow', set: 'PR-SM', number: '85' },
        { name: "Maxie's Hidden Ball Trick", set: 'PRC', number: '133' },
        { name: "Maxie's Hidden Ball Trick", set: 'PRC', number: '158' },
        { name: 'Milotic', set: 'FLF', number: '23' },
        { name: 'Mismagius', set: 'UNB', number: '78' },
        { name: 'Oranguru', set: 'UPR', number: '114' },
        { name: 'Puzzle of Time', set: 'BKP', number: '109' },
        { name: 'Red Card', set: 'GEN', number: '71' },
        { name: 'Reset Stamp', set: 'UNM', number: '206' },
        { name: 'Reset Stamp', set: 'UNM', number: '206a' },
        { name: 'Reset Stamp', set: 'UNM', number: '253' },
        { name: 'Sableye', set: 'DEX', number: '62' },
        { name: 'Scoop Up Net', set: 'RCL', number: '165' },
        { name: 'Scoop Up Net', set: 'RCL', number: '207' },
        { name: 'Shaymin-EX', set: 'ROS', number: '77' },
        { name: 'Shaymin-EX', set: 'ROS', number: '77a' },
        { name: 'Shaymin-EX', set: 'ROS', number: '106' },
        { name: 'Unown', set: 'LOT', number: '90' },
        { name: 'Unown', set: 'LOT', number: '91' },
    ];
    const bannedInGLC = [
        { name: 'Chip-Chip Ice Axe', set: 'UNB', number: '165' },
        { name: 'Forest of Giant Plants', set: 'AOR', number: '74' },
        { name: 'Hiker', set: 'CES', number: '133' },
        { name: 'Hiker', set: 'HIF', number: 'SV85' },
        { name: 'Kyogre', set: 'SHF', number: '21' },
        { name: "Lysandre's Trump Card", set: 'PHF', number: '99' },
        { name: "Lysandre's Trump Card", set: 'PHF', number: '118' },
        { name: 'Oranguru', set: 'UPR', number: '114' },
        { name: 'Pokémon Research Lab', set: 'UNM', number: '205' },
        { name: 'Raikou', set: 'VIV', number: '50' },
        { name: 'Marshadow', set: 'SLG', number: '45' },
        { name: 'Marshadow', set: 'PR-SM', number: '85' },
        { name: 'Duskull', set: 'CEC', number: '83' },
        { name: 'Double Colorless Energy', set: 'SLG', number: '69' },
        { name: 'Double Colorless Energy', set: 'SUM', number: '136' },
        { name: 'Double Colorless Energy', set: 'GRI', number: '166' },
        { name: 'Double Colorless Energy', set: 'EVO', number: '90' },
        { name: 'Double Colorless Energy', set: 'FCO', number: '114' },
        { name: 'Double Colorless Energy', set: 'PHF', number: '111' },
        { name: 'Double Colorless Energy', set: 'XY', number: '130' },
        { name: 'Double Colorless Energy', set: 'LTR', number: '113' },
        { name: 'Double Colorless Energy', set: 'NXD', number: '92' },
        { name: 'Double Colorless Energy', set: 'HGS', number: '103' },
        { name: 'Double Colorless Energy', set: 'BS2', number: '124' },
        { name: 'Double Colorless Energy', set: 'BS', number: '96' },
        { name: 'Twin Energy', set: 'RCL', number: '174' },
        { name: 'Twin Energy', set: 'RCL', number: '209' },
    ];

    function isGLCLegal(card) {
        // 1) cut any Pokémon subtypes you don’t want
            const expandedSets = [
                'black & white', 'xy', 'sun & moon',
                'sword & shield', 'scarlet & violet'
            ];
        const excluded = new Set(
            ["EX","GX","ex","V","VMAX","VSTAR","Prism Star","Radiant","ACE SPEC","V-UNION"]
            .map(s=>s.toLowerCase())
        );
        if (card.subtypes?.some(s=>excluded.has(s.toLowerCase()))) {
            return false;
        }
        if (isBannedInGLC(card)) return false;

        // 2) special case for Double Colorless Energy by name
        if (card.name.trim().toLowerCase()==='double colorless energy') {
            return false;
        }

        // 3) Pokémon use your existing logic...
        if (card.supertype==='Pokémon') {
            // …whatever you already have for Pokémon…
            // e.g. return expandedSets.includes(card.set.series.toLowerCase());
        }

        // 4) Trainer & Special Energy: just check series + banlist
        const series = card.set?.series?.toLowerCase();
        return expandedSets.includes(series);
    }
    const isBannedInGLC = (card) => {
        if (card.name.trim().toLowerCase() === 'double colorless energy') {
            return true;
        }

        return bannedInGLC.some(bannedCard =>
            bannedCard.name.toLowerCase() === card.name.toLowerCase() &&
            bannedCard.set.toLowerCase() === card.setAbbrev.toLowerCase() &&
            bannedCard.number === card.number
        );
    };

    const isStandardLegal = (card) => {
        // UPDATE every year with regulation mark legality (assumed G will rotate in 2026 and so on...)
        // add more regulation marks as cards release in the coming years
        const regulationMarks = ['G', 'H', 'I', 'J', 'K', 'L', 'M'];

        if (card.regulationMark && regulationMarks.includes(card.regulationMark)) {
            return true;
        }

        if (card.supertype !== 'Pokémon') {
            const otherVersions = Object.values(cardData.cardMap).filter(otherCard =>
                otherCard.name.toLowerCase() === card.name.toLowerCase() &&
                otherCard.regulationMark &&
                regulationMarks.includes(otherCard.regulationMark)
            );
            return otherVersions.length > 0;
        }

        return false;
    };
    const isExpandedLegal = (card) => {
        const expandedSets = ['black & white', 'xy', 'sun & moon', 'sword & shield', 'scarlet & violet'];

        // Check for banned CC cards in CEL set
        if (card.setAbbrev === "CEL" && (/^CC(1[0-9]|[1-9])$/.test(card.number))) {
            return false;
        }

        // Check if any version of this Trainer or Energy card is legal in Standard
        if (card.supertype !== 'Pokémon') {
            const hasLegalVersion = otherVersions.some(otherCard =>
                otherCard.name.toLowerCase() === card.name.toLowerCase() &&
                isStandardLegal(otherCard)
            );
            if (hasLegalVersion) {
                return true;
            }
        }

        if (card.set && card.set.series && expandedSets.includes(card.set.series.toLowerCase())) {
            if (!bannedInExpanded.some(bannedCard =>
                bannedCard.name.toLowerCase() === card.name.toLowerCase() &&
                bannedCard.set.toLowerCase() === card.setAbbrev.toLowerCase() &&
                bannedCard.number === card.number
            )) {
                return true;
            }
        }

        return false;
    };
    const isBannedInExpanded = (card) => {
        return bannedInExpanded.some(bannedCard =>
            bannedCard.name.toLowerCase() === card.name.toLowerCase() &&
            bannedCard.set.toLowerCase() === card.setAbbrev.toLowerCase() &&
            bannedCard.number === card.number
        );
    };

    const otherVersionsToShow = otherVersions.filter(otherCard =>
        otherCard.setAbbrev !== cardInfo.setAbbrev || otherCard.number !== cardInfo.number
    );
    const showOtherVersions = otherVersionsToShow.length > 0 && (cardInfo.supertype === 'Pokémon' || cardInfo.supertype === 'Trainer' || cardInfo.supertype === 'Energy');
    const displayedOtherVersions = showAllVersions
        ? otherVersionsToShow.sort((a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate))
        : otherVersionsToShow.sort((a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate)).slice(0, 5);

    if (!cardInfo) {
        return <div>Card not found</div>;
    }

    const isPromoSet = cardInfo.set.name.toLowerCase().includes('promo');

    // const skipNumberTypes = [
    //     'Grass','Fire','Water','Lightning',
    //     'Psychic','Fighting','Darkness','Metal','Fairy'
    // ];

    const renderEnergyIcons = (cost) => {
        if (!cost || cost.length === 0 || cost.some(c => String(c).toLowerCase() === 'free')) {
            return <img src={energyIcons.NoCost} alt="No Cost" className="energy-icon" />;
        }
        return cost.map((type, index) => (
            <img key={index} src={energyIcons[type]} alt={type} className="energy-icon" />
        ));
    };

    const getPlacementSuffix = (number) => {
        const j = number % 10;
        const k = number % 100;
        let suffix;
        if (j === 1 && k !== 11) {
            suffix = 'st';
        } else if (j === 2 && k !== 12) {
            suffix = 'nd';
        } else if (j === 3 && k !== 13) {
            suffix = 'rd';
        } else {
            suffix = 'th';
        }
        return (
            <>
                {number}
                <sup className='sup'>{suffix}</sup>
            </>
        );
    };

    const handleImageClick = () => {
        if (viewportWidth >= 600) {
            setIsFullScreen(!isFullScreen);
        }
    };

    const getEventLink = (eventId) => {
        return `/tournaments/${eventId}`;
    };

    const expandedSets = ['black & white', 'xy', 'sun & moon', 'sword & shield', 'scarlet & violet'];

    const monthMap = {
        Jan: 0, January: 0,
        Feb: 1, February: 1,
        Mar: 2, March: 2,
        Apr: 3, April: 3,
        May: 4,
        Jun: 5, June: 5,
        Jul: 6, July: 6,
        Aug: 7, August: 7,
        Sep: 8, September: 8,
        Oct: 9, October: 9,
        Nov: 10, November: 10,
        Dec: 11, December: 11
    };
    function parseEventDate(dateStr) {
        // split off the year
        const [left, yearPart] = dateStr.split(',').map(s => s.trim());
        const year = parseInt(yearPart, 10);

        // left might be "Aug 11" or "Aug 11 - 13" or "Aug 11–13"
        // so take everything before the dash if present
        const firstDate = left.split(/[-–]/)[0].trim();  // "Aug 11"

        // then split into monthName + day
        const [monthName, dayStr] = firstDate.split(/\s+/);
        const month = monthMap[monthName.slice(0, 3)];
        const day = parseInt(dayStr, 10);

        return new Date(year, month, day).getTime();
    }

    const isBasicEnergyCard =
        cardInfo.supertype === 'Energy' &&
        Array.isArray(cardInfo.subtypes) &&
        cardInfo.subtypes.includes('Basic');

    // const displayedEventResults = showAllResults ? eventResults : eventResults.slice(0, 5);
    const eventClusters = Object.entries(
        eventResults.reduce((acc, r) => {
            acc[r.eventId] = acc[r.eventId] || [];
            acc[r.eventId].push(r);
            return acc;
        }, {})
    )
    // 2) sort clusters by date
    .sort((a, b) =>
        new Date(b[1][0].eventDate).getTime() - new Date(a[1][0].eventDate).getTime()
    );
    // 3) pick how many clusters to show
    const displayedClusters = eventClusters

    return (
        <CardViewTheme className='center column-align justcardviewonly' theme={theme}>
            <Helmet>
                <title>{`${cardInfo.name} ${cardInfo.setAbbrev} ${cardInfo.number}`}</title>
                <meta name="description" content={`Pokémon card info on ${cardInfo.name} from ${cardInfo.set.name}, including every deck the card's been played in and more.`} />
                <meta property="og:title" content="PTCG Legends" />
                <meta property="og:description" content={`Pokémon card info on ${cardInfo.name} from ${cardInfo.set.name}, including every deck the card's been played in and more.`} />
                <meta property='og:image' content={cardInfo.images.small} />
                <meta property="og:url" content={`https://www.ptcglegends.com/card/${cardInfo.setAbbrev}/${cardInfo.number}`} />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PTCG Legends" />
                <meta name="twitter:description" content={`Pokémon card info on ${cardInfo.name} from ${cardInfo.set.name}, including every deck the card's been played in and more.`} />
                <meta name="twitter:image" content={cardInfo.images.small} />
            </Helmet>
            <div className='card-view' style={{ position: 'relative' }}>
                {cardInfo.images.large && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: viewportWidth > 600 ? `url(${cardInfo.images.large})` : 'none',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center 17%',
                            backgroundSize: '120%',
                            borderRadius: '10px',
                            opacity: 0.3,
                            zIndex: 0,
                            filter: 'blur(5px)',
                        }}
                    ></div>
                )}
                <div className='card-data-all'>
                    <div className='card-and-setinfo'>
                        <img
                            className={`the-card-img${isFullScreen ? ' full-screen' : ''}${isRotated ? ' rotated' : ''}`}
                            src={cardInfo.images.large}
                            alt={cardInfo.name}
                            onClick={handleImageClick}
                            style={{ cursor: viewportWidth >= 600 ? 'zoom-in' : 'auto' }}
                        />
                        {cardInfo.subtypes?.includes('BREAK') && (
                            <button
                                type="button"
                                className="rotate-button"
                                onClick={e => {
                                    e.stopPropagation();
                                    setIsRotated(prev => !prev);
                                }}
                            >
                                Rotate&nbsp;<span class="material-symbols-outlined">forward_media</span>
                            </button>
                        )}
                        {cardInfo.set && (
                            <div>
                                <img className='cardview-setlogo' src={cardInfo.set.images.logo} alt={`${cardInfo.set.name} logo`} />
                                <p className='show-ninefifty'>
                                    <Link to={`/cards/${cardInfo.setAbbrev}`}>{cardInfo.set.name}</Link>
                                    <span className='align-center'>
                                        {cardInfo.set && cardInfo.set.images && cardInfo.set.images.symbol && (
                                            <img
                                                className='cardview-setsymbol'
                                                src={cardInfo.set.images.symbol}
                                                alt={`${cardInfo.set.images.symbol} logo`}
                                            />
                                        )}
                                        &nbsp;
                                        <span className='italic'>{cardInfo.number}/{cardInfo.set.printedTotal}</span>
                                    </span>
                                    {!isPromoSet && cardInfo.set.releaseDate && (
                                        <span><span style={{ fontWeight: 600 }}>Release:</span> {formatDate(cardInfo.set.releaseDate)}</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className='card-info'>
                        <p className="card-name-view">
                            <strong>
                                {cardInfo.name.replace('★', '').trim()}
                                {cardInfo.name.includes('★') && (
                                    <img
                                        src="/assets/energy-symbols/gold-star.png"
                                        alt="★"
                                        className="star-icon"
                                    />
                                )}
                            </strong>
                        </p>
                        <hr className='blue-hr'></hr>
                        {cardInfo.supertype && (
                            <p className='marginthree'>
                                {cardInfo.supertype}
                                {cardInfo.subtypes && cardInfo.subtypes.length > 0 && (
                                    ` • ${cardInfo.subtypes
                                        .map(st => st === 'Star' ? 'Gold Star' : st)
                                        .join(' • ')
                                    }`
                                )}
                            </p>
                        )}
                        <div className='one-row marginthree'>
                            {cardInfo.types && <p>{cardInfo.types.join(', ')}</p>}
                            {cardInfo.hp && <p>&nbsp;•&nbsp;{cardInfo.hp}<span className='shrink'> HP</span></p>}
                        </div>
                        {cardInfo.evolvesFrom && (
                            <p className='marginthree'>
                                {cardInfo.subtypes && cardInfo.subtypes.includes('Level-Up') ? 'Levels up from' : 'Evolves from'} {cardInfo.evolvesFrom}
                            </p>
                        )}
                        {!
                            (cardInfo.supertype === 'Energy' &&
                            Array.isArray(cardInfo.subtypes) &&
                            cardInfo.subtypes.includes('Basic')
                            ) && <hr className='small-grey-hr' />
                        }
                        {cardInfo.ancientTrait && (
                            <div className='attack-ability'>
                                <ul>
                                    <strong>{cardInfo.ancientTrait.name}:</strong> {cardInfo.ancientTrait.text}
                                </ul>
                            </div>
                        )}
                        {cardInfo.abilities && (
                            <div className='attack-ability'>
                                <ul>
                                    {cardInfo.abilities.map((ability, index) => (
                                        <li key={index}>
                                            <strong>
                                                <span className={ability.type === 'Poké-Body' ? 'green' : 'red'}>
                                                    {ability.type}:
                                                </span>
                                                &nbsp;{ability.name}
                                            </strong>
                                            <br />
                                            {ability.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {cardInfo.attacks && (
                            <div className='attack-ability'>
                                <ul>
                                    {cardInfo.attacks.map((attack, index) => (
                                        <li key={index}>
                                            {renderEnergyIcons(attack.cost)}
                                            <strong>&nbsp;{attack.name}</strong>&nbsp;&nbsp;&nbsp;{attack.damage}
                                            <br />
                                            {attack.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {cardInfo.supertype === 'Pokémon' && (
                            <>
                                <hr className='small-grey-hr' />
                                {cardInfo.rules && (
                                    <div className='attack-ability rules-text'>
                                        <ul>
                                            {cardInfo.rules.map((rule, index) => (
                                                <li key={index}>{rule}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                        {cardInfo.supertype === 'Trainer' && (
                            <div className='trainer-details'>
                                <ul>
                                    {cardInfo.rules && cardInfo.rules.map((rule, index) => (
                                        <li key={index}>{rule}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {cardInfo.supertype === 'Energy' && (
                            <div className='trainer-details'>
                                <ul>
                                    {cardInfo.rules && cardInfo.rules.map((rule, index) => (
                                        <li key={index}>{rule}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {cardInfo.supertype === 'Pokémon' && (
                            <hr className='blue-hr'></hr>
                        )}
                        {cardInfo.supertype === 'Pokémon' && (
                            <div className='weakness-row'>
                                <p>Weakness:&nbsp;</p>
                                <ul>
                                    {cardInfo.weaknesses && cardInfo.weaknesses.length > 0 ? (
                                        cardInfo.weaknesses.map((weakness, index) => (
                                            <li key={index}>&nbsp;{weakness.type} {weakness.value}</li>
                                        ))
                                    ) : (
                                        <li className='grey'>--</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        {cardInfo.supertype === 'Pokémon' && (
                            <div className='weakness-row'>
                                <p>Resistance:&nbsp;</p>
                                <ul>
                                    {cardInfo.resistances && cardInfo.resistances.length > 0 ? (
                                        cardInfo.resistances.map((resistance, index) => (
                                            <li key={index}>&nbsp;{resistance.type} {resistance.value}</li>
                                        ))
                                    ) : (
                                        <li className='grey'>--</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        {cardInfo.supertype === 'Pokémon' && (
                            <p>Retreat Cost: &nbsp;{cardInfo.convertedRetreatCost || 0}</p>
                        )}
                        {!
                            (cardInfo.supertype === 'Energy' &&
                            Array.isArray(cardInfo.subtypes) &&
                            cardInfo.subtypes.includes('Basic')
                            ) && <hr className='small-grey-hr' />
                        }
                        {cardInfo.rarity && <p className='marginthree'>Rarity: {cardInfo.rarity}</p>}
                        {cardInfo.artist && <p>Illustrator: <span className='italic'>{cardInfo.artist}</span></p>}
                        <hr className='blue-hr'></hr>
                        {!isBasicEnergy && (
                            <>
                                <p className='marginthree'>Modern Legality:</p>
                                {cardInfo.regulationMark && (
                                    <p className='marginthree smaller-than-others'>Regulation Mark: {cardInfo.regulationMark}</p>
                                )}
                                <div className='legality-checks'>
                                    <p>
                                        Standard: {
                                        isBasicEnergyCard
                                            ? <span className="material-symbols-outlined legality-mark" style={{color:'rgb(110, 207, 110)'}}>check</span>
                                            : (isStandardLegal(cardInfo) || isStandardLegalAny)
                                            ? <span className="material-symbols-outlined legality-mark" style={{color:'rgb(110, 207, 110)'}}>check</span>
                                            : <span className="material-symbols-outlined" style={{color:'rgb(237, 91, 91)'}}>close</span>
                                        }
                                    </p>
                                    <p>
                                        Expanded: {
                                        isBasicEnergyCard
                                            ? <span className="material-symbols-outlined legality-mark" style={{color:'rgb(110, 207, 110)'}}>check</span>
                                            : (isExpandedLegal(cardInfo) || isExpandedLegalAny)
                                            ? <span className="material-symbols-outlined legality-mark" style={{color:'rgb(110, 207, 110)'}}>check</span>
                                            : <span className="material-symbols-outlined" style={{color:'rgb(237, 91, 91)'}}>close</span>
                                        }
                                    </p>
                                    <p>
                                        GLC:{' '}
                                        {isBannedInGLC(cardInfo) ? (
                                            <>
                                            <span className="material-symbols-outlined" style={{ color:'rgb(237, 91, 91)' }}>
                                                close
                                            </span>
                                            <span style={{ color:'rgb(237, 91, 91)' }}>
                                                <p>(Banned)</p>
                                            </span>
                                            </>
                                        ) : isBasicEnergyCard ? (
                                            <span className="material-symbols-outlined legality-mark" style={{ color:'rgb(110, 207, 110)' }}>
                                                check
                                            </span>
                                        ) : (isGLCLegal(cardInfo) || isGLCLegalAny) ? (
                                            <span className="material-symbols-outlined legality-mark" style={{ color:'rgb(110, 207, 110)' }}>
                                                check
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ color:'rgb(237, 91, 91)' }}>
                                                close
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className='show-cardinfo-on-small'>
                                    <hr className='small-grey-hr'></hr>
                                    <div>
                                        <img className='cardview-setlogo' src={cardInfo.set.images.logo} alt={`${cardInfo.set.name} logo`} />
                                        <p className='show-ninefifty'>
                                            <Link to={`/cards/${cardInfo.setAbbrev}`}>{cardInfo.set.name}</Link>
                                            <span className='align-center'>
                                                <img className='cardview-setsymbol' src={cardInfo.set.images.symbol} alt={`${cardInfo.set.images.symbol} logo`} />
                                                &nbsp;
                                                <span className='italic'>{cardInfo.number}/{cardInfo.set.printedTotal}</span>
                                            </span>
                                            Released {cardInfo.set && formatDate(cardInfo.set.releaseDate)}
                                        </p>
                                    </div>
                                </div>
                                <hr className='blue-hr'></hr>
                                {showOtherVersions && (
                                    <div>
                                        <p>Other Prints:</p>
                                        <table className='other-versions'>
                                            <tbody>
                                                {displayedOtherVersions.map((otherCard, index) => (
                                                    <tr key={index}>
                                                        <td className='card-art-td'>
                                                            <Link to={`/card/${otherCard.setAbbrev}/${otherCard.number}`}>
                                                                <img
                                                                    src={otherCard.images.small}
                                                                    alt={otherCard.name}
                                                                    className={
                                                                    otherCard.supertype === 'Energy'
                                                                        ? 'cropped-energycard-art-td'
                                                                        : 'cropped-imagecard-art-td'
                                                                    }
                                                                />
                                                            </Link>
                                                        </td>
                                                        <td className='linktoother'>
                                                            <Link to={`/card/${otherCard.setAbbrev}/${otherCard.number}`}>
                                                                {otherCard.set.name}
                                                            </Link>
                                                        </td>
                                                        <td>#{otherCard.number}</td>
                                                        <td>{otherCard.set && formatDate(otherCard.set.releaseDate)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {otherVersionsToShow.length > 5 && (
                                            <button onClick={() => setShowAllVersions(!showAllVersions)} className='showmoreversions-diffprints'>
                                                {showAllVersions ? (
                                                    <>
                                                        See Less <span className="material-symbols-outlined">keyboard_arrow_up</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        See More <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="event-results-cardview marginbottom">
                {loading && !eventsScanned ? (
                    <div className="spinner margintop"></div>
                ) : eventResults.length > 0 ? (
                    <>
                        <p className="decks-that-contain">
                            Decklists that feature <span style={{ color: '#1290eb' }}>{cardInfo.name}</span>
                        </p>
                        <p className="ordered-by-most-recent">
                            (Ordered by most recent event appearance - Day 1 decklists from modern events are not integrated into our database.)
                        </p>
                        <table className="cards-specific-results">
                        <thead>
                            <tr>
                            <th style={{ width: '1%' }}>Place</th>
                            <th style={{ width: '1%' }}>Player</th>
                            <th style={{ width: '1%' }}>Division</th>
                            <th style={{ width: '1%' }}></th>
                            <th style={{ width: '1%' }}>Decklist</th>
                            </tr>
                        </thead>
                            {displayedClusters.map(([eventId, results]) => {
                                const sortedResults = results.sort((a, b) => {
                                    const order = { masters: 0, seniors: 1, juniors: 2, all: 3 };
                                    const d = order[a.division] - order[b.division];
                                    return d !== 0 ? d : a.placement - b.placement;
                                });

                                const isExpanded = !!expandedEvents[eventId];
                                const rowsToShow = isExpanded
                                    ? sortedResults
                                    : sortedResults.slice(0, 5);

                                const { eventName, eventDate, eventFormat } = sortedResults[0];

                                return (
                                    <tbody key={eventId} className="event-cluster-body">
                                        <tr className="event-separator">
                                            <td colSpan="5">
                                                <Link
                                                    className="event-separator-content"
                                                    to={`/tournaments/${eventId}${
                                                        eventId === '2002_WORLDS' || /* … */ false
                                                            ? '/seniors'
                                                            : eventId.toLowerCase().includes('retro')
                                                                ? '/all'
                                                                : ''
                                                        }`}
                                                >
                                                    <strong>{eventName}</strong><span style={{ opacity: 0.5 }}>&nbsp;-&nbsp;{eventDate.replace(/ - [^,]*/, '')}&nbsp;({eventFormat})</span>
                                                </Link>
                                            </td>
                                        </tr>

                                        {rowsToShow.map((result, idx) => (
                                            <tr key={idx}>
                                                {result.division !== 'decksbyera' ? (
                                                    <>
                                                        <td>{getPlacementSuffix(result.placement)}</td>
                                                        <td>
                                                            <Link
                                                                className="link-to-playerprofile"
                                                                to={`/player/${normalizeName(
                                                                    result.playerName
                                                                )}-${result.flag}`}
                                                            >
                                                                {formatName(result.playerName)}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <span style={{ opacity: 0.4 }}>{formatName(result.division)}</span>
                                                        </td>
                                                        <td></td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td></td>
                                                        <td>{result.playerLabel}</td>
                                                        <td></td>
                                                        <td></td>
                                                    </>
                                                )}
                                                <td className="player-deck-icons pushright">
                                                    <DisplayPokemonSprites
                                                        decklist={result.decklist}
                                                        sprite1={result.sprite1}
                                                        sprite2={result.sprite2}
                                                    />
                                                    <Link
                                                        to={
                                                            eventId.includes('FEATURED')
                                                                ? `/tournaments/${eventId}/decksbyera/${encodeURIComponent(
                                                                    result.decklist.label
                                                                )}`
                                                                : `/tournaments/${eventId}/${result.division}/${encodeURIComponent(
                                                                    result.playerName
                                                                )}-${encodeURIComponent(result.flag)}`
                                                        }
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            format_list_bulleted
                                                        </span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}

                                        {sortedResults.length > 5 && (
                                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                                <a
                                                    className="showmoreversions"
                                                    onClick={() => toggleEventExpansion(eventId)}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            See less{' '}
                                                            <span className="material-symbols-outlined">
                                                                keyboard_arrow_up
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Expand {sortedResults.length} more results from this event{' '}
                                                            <span className="material-symbols-outlined expand-more-results">
                                                                keyboard_arrow_down
                                                            </span>
                                                        </>
                                                    )}
                                                </a>
                                            </td>
                                        )}
                                    </tbody>
                                );
                            })}
                        </table>
                    </>
                ) : cardInfo.name.toLowerCase().includes('magikarp') ? (
                    <p className="margintop italic" style={{ textAlign: 'center' }}>
                        <br />
                        Looks like the Pokédex was right, this Pokémon is utterly useless.
                        It's not in a single deck in our database...
                    </p>
                ) : (
                    <p className="margintop italic" style={{ textAlign: 'center' }}>
                        Looks like this card isn't featured in any of our documented decks, yet.
                        <br />
                        <br />
                        <span style={{ fontSize: '10px' }}>(Day 1 decklists from modern events are not integrated into our database.)</span>
                    </p>
                )}
                <br />
                <p className='margintop smaller-txt italic' style={{ textAlign: 'center' }}>Have a list featuring {cardInfo.name} that we should know about? Send it in to <a style={{ color: '#1290eb' }} href="mailto:ptcglegends@gmail.com">ptcglegends@gmail.com</a> for review.</p>
            </div>
            {isFullScreen && viewportWidth >= 600 && (
                <div className="fullscreen-overlay" onClick={handleImageClick}>
                    <img
                    className={
                        `fullscreen-image` +
                        (cardInfo.subtypes?.includes('BREAK') ? ' rotated' : '')
                    }
                    src={cardInfo.images.large}
                    alt={cardInfo.name}
                    />
                </div>
            )}
        </CardViewTheme>
    );
};

export default CardView;
