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
    const [showAllResults, setShowAllResults] = useState(false);
    const [isStandardLegalAny, setIsStandardLegalAny] = useState(false);
    const [isExpandedLegalAny, setIsExpandedLegalAny] = useState(false);
    const [isGLCLegalAny, setIsGLCLegalAny] = useState(false);

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
            // Debugging log
        };
        hasOtherArtseses();
    }, [otherVersions]);

    useEffect(() => {
        if (!cardInfo) {
            return;
        }

        const fetchEventIds = async () => {
            try {
                const response = await fetch('https://ptcg-legends-6abc11783376.herokuapp.com/event-ids');
                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    console.error('Failed to fetch event IDs');
                    return [];
                }
            } catch (error) {
                console.error('Error fetching event IDs:', error);
                return [];
            }
        };

        const fetchEventData = async (eventId) => {
            try {
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/events/${eventId}`);
                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    console.error(`Failed to fetch event data for event ID: ${eventId}`);
                    return null;
                }
            } catch (error) {
                console.error(`Error fetching event data for event ID: ${eventId}`, error);
                return null;
            }
        };

        const parseDate = (dateString) => {
            const regexRange = /(\w+ \d+) - (\d+), (\d+)/;
            const regexSingle = /(\w+ \d+), (\d+)/;

            let match = regexRange.exec(dateString);
            if (match) {
                return new Date(`${match[1]}, ${match[3]}`);
            }

            match = regexSingle.exec(dateString);
            if (match) {
                return new Date(`${match[1]}, ${match[2]}`);
            }

            return new Date(dateString);
        };

        const fetchAndFilterEvents = async () => {
            if (!cardInfo) return;

            if (cardInfo.supertype === "Energy" && cardInfo.subtypes && cardInfo.subtypes.includes("Basic")) {
                setIsBasicEnergy(true);
                setLoading(false);
                return;
            }
            
            setLoading(true);
            const eventIds = await fetchEventIds();
            const allResults = [];

            for (const eventId of eventIds) {
                const eventData = await fetchEventData(eventId);
                if (eventData) {
                    const divisions = ['masters', 'all', 'seniors', 'olderseniors', 'youngseniors', 'juniors', 'professors', 'decksbyera'];
                    const results = [];

                    divisions.forEach(division => {
                        if (eventData[division]) {
                            eventData[division].forEach((player, playerIndex) => {
                                if (player.decklist) {
                                    let hasCard = false;

                                    hasCard = (player.decklist.pokemon?.some(p => p.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase() &&
                                        p.set === cardInfo.setAbbrev &&
                                        p.number === cardInfo.number
                                    )) ||
                                        player.decklist.trainer?.some(t => t.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase()) ||
                                        player.decklist.energy?.some(e => e.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase());

                                    otherVersions.forEach(version => {
                                        if (player.decklist.pokemon?.some(p => p.name.trim().toLowerCase() === version.name.trim().toLowerCase() &&
                                            p.set === version.setAbbrev &&
                                            p.number === version.number
                                        )) { hasCard = true }
                                    })

                                    if (hasCard) {
                                        results.push({
                                            eventId: eventData.id,
                                            eventName: eventData.name,
                                            eventFormat: eventData.format,
                                            eventDate: eventData.date,
                                            playerName: player.name,
                                            playerLabel: player.source,
                                            division,
                                            flag: player.flag,
                                            placement: playerIndex + 1,
                                            decklist: player.decklist,
                                            sprite1: player.sprite1,
                                            sprite2: player.sprite2
                                        });
                                    }
                                }
                            });
                        }
                    });

                    allResults.push(...results);
                }
            }

            console.log('Before sorting:', allResults.map(result => result.eventDate));

            allResults.sort((a, b) => parseDate(b.eventDate) - parseDate(a.eventDate));

            console.log('After sorting:', allResults.map(result => result.eventDate));

            setEventResults(allResults);

            setLoading(false);
            setEventsScanned(true);
        };

        fetchAndFilterEvents();
    }, [cardInfo, otherVersions]);

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
    ];
    const isGLCLegal = (card) => {
        const expandedSets = ['black & white', 'xy', 'sun & moon', 'sword & shield', 'scarlet & violet'];
        const excludedSubtypes = ["EX", "GX", "ex", "V", "VMAX", "VSTAR", "Prism Star", "Radiant", "ACE SPEC", "V-UNION"];

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

        const isFromAllowedSet = card.set && card.set.series && expandedSets.includes(card.set.series.toLowerCase());
        const hasExcludedSubtype = card.subtypes && card.subtypes.some(subtype => excludedSubtypes.includes(subtype));

        if (isFromAllowedSet && !hasExcludedSubtype) {
            const isBanned = bannedInGLC.some(bannedCard =>
                bannedCard.name.toLowerCase() === card.name.toLowerCase() &&
                bannedCard.set.toLowerCase() === card.setAbbrev.toLowerCase() &&
                bannedCard.number === card.number
            );

            return !isBanned;
        }
        return false;
    };
    const isBannedInGLC = (card) => {
        return bannedInGLC.some(bannedCard =>
            bannedCard.name.toLowerCase() === card.name.toLowerCase() &&
            bannedCard.set.toLowerCase() === card.setAbbrev.toLowerCase() &&
            bannedCard.number === card.number
        );
    };
    const isStandardLegal = (card) => {
        const regulationMarks = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

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

    const renderEnergyIcons = (cost) => {
        if (!cost || cost.length === 0) {
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
    const displayedEventResults = showAllResults ? eventResults : eventResults.slice(0, 5);

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
                            className={`the-card-img ${isFullScreen ? 'full-screen' : ''}`}
                            src={cardInfo.images.large}
                            alt={cardInfo.name}
                            onClick={handleImageClick}
                            style={{ cursor: viewportWidth >= 600 ? 'zoom-in' : 'auto' }}
                        />
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
                                        <>Released {formatDate(cardInfo.set.releaseDate)}</>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className='card-info'>
                        <p className='card-name-view'><strong>{cardInfo.name}</strong></p>
                        <hr className='blue-hr'></hr>
                        <div className='one-row marginthree'>
                            {cardInfo.types && <p>{cardInfo.types.join(', ')}</p>}
                            {cardInfo.hp && <p>&nbsp;•&nbsp;{cardInfo.hp}<span className='shrink'> HP</span></p>}
                        </div>
                        {cardInfo.supertype && (
                            <p className='marginthree'>
                                {cardInfo.supertype}
                                {cardInfo.subtypes && cardInfo.subtypes.length > 0 && ` • ${cardInfo.subtypes.join(' • ')}`}
                            </p>
                        )}
                        {cardInfo.evolvesFrom && (
                            <p className='marginthree'>
                                {cardInfo.subtypes && cardInfo.subtypes.includes('Level-Up') ? 'Levels up from' : 'Evolves from'} {cardInfo.evolvesFrom}
                            </p>
                        )}
                        <hr className='small-grey-hr'></hr>
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
                        <hr className='small-grey-hr'></hr>
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
                                    <p>Standard: {(isStandardLegal(cardInfo) || isStandardLegalAny) ? <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(0, 198, 0)' }}>check</span> : <span className="material-symbols-outlined" style={{ color: 'rgb(204, 37, 37)' }}>close</span>}</p>
                                    <p>
                                        Expanded:
                                        {cardInfo.set.releaseDate === "N/A" ? (
                                            <>
                                                <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(204, 37, 37)' }}>close</span>
                                            </>
                                        ) : (
                                            <>
                                                {(isExpandedLegal(cardInfo) || isExpandedLegalAny) ? (
                                                    <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(0, 198, 0)' }}>check</span>
                                                ) : (
                                                    <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(204, 37, 37)' }}>close</span>
                                                )}
                                                {isBannedInExpanded(cardInfo) && (
                                                    <span style={{ color: 'rgb(204, 37, 37)', marginLeft: '1px' }}>(Banned)</span>
                                                )}
                                            </>
                                        )}
                                    </p>
                                    <p>
                                        GLC:
                                        {cardInfo.set.releaseDate === "N/A" ? (
                                            <>
                                                <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(204, 37, 37)' }}>close</span>
                                                <span style={{ color: 'rgb(204, 37, 37)', marginLeft: '1px' }}>(not released)</span>
                                            </>
                                        ) : (
                                            <>
                                                {(isGLCLegal(cardInfo) || isGLCLegalAny) ? (
                                                    <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(0, 198, 0)' }}>check</span>
                                                ) : (
                                                    <span className="material-symbols-outlined legality-mark" style={{ color: 'rgb(204, 37, 37)' }}>close</span>
                                                )}
                                                {isBannedInGLC(cardInfo) && (
                                                    <span style={{ color: 'rgb(204, 37, 37)', marginLeft: '1px' }}>(Banned)</span>
                                                )}
                                            </>
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
                                            <button onClick={() => setShowAllVersions(!showAllVersions)} className='showmoreversions'>
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
            <div className="event-results marginbottom">
        <p className='decks-that-contain'>Decklists that contain <span className='italic'>{cardInfo.name}</span></p>
        <p className='italic ordered-by-most-recent'>(Ordered by most recent event appearance - Trainer & Special Energy cards of the same name appear together across all eras.)</p>
        {loading && !eventsScanned ? (
            <div className="spinner margintop"></div>
        ) : isBasicEnergy ? (
            <p className='margintop'>This search function is not available for Basic Energy cards, that type of query would cause the planet to implode...</p>
        ) : eventResults.length > 0 ? (
            <>
                <table className='cards-specific-results'>
                    <thead>
                        <tr>
                            <th style={{ width: '1%' }}>Place</th>
                            <th style={{ width: '1%' }}>Player</th>
                            <th style={{ width: '1%' }}>Division</th>
                            <th style={{ width: '1%' }}></th>
                            <th style={{ width: '1%' }}>Decklist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(
                            displayedEventResults.reduce((acc, result) => {
                                if (!acc[result.eventId]) {
                                    acc[result.eventId] = [];
                                }
                                acc[result.eventId].push(result);
                                return acc;
                            }, {})
                        ).sort((a, b) => {
                            const dateA = new Date(a[1][0].eventDate);
                            const dateB = new Date(b[1][0].eventDate);
                            return dateB - dateA;
                        }).map(([eventId, results]) => {
                            const sortedResults = results.sort((a, b) => {
                                const divisionOrder = { masters: 0, seniors: 1, juniors: 2, professors: 3, all: 4 };
                                const divisionComparison = divisionOrder[a.division] - divisionOrder[b.division];
                                if (divisionComparison !== 0) return divisionComparison;
                                return a.placement - b.placement;
                            });
                            const { eventName, eventDate, eventFormat } = results[0];
                            return (
                                <React.Fragment key={eventId}>
                                    <tr className="event-separator">
                                    <td colSpan="5">
                                        <Link 
                                            className="event-separator-content" 
                                            to={`/tournaments/${eventId}${
                                                eventId === '2002_WORLDS' || eventId === '2000_MEGA_TROPICAL_BATTLE' || eventId === '2002_ECSC' || eventId === '2002_WCSC'
                                                    ? '/seniors' 
                                                    : eventId.toLowerCase().includes('retro') 
                                                        ? '/all' 
                                                        : ''
                                            }`}
                                        >
                                            <strong>{eventName}</strong> &nbsp;&nbsp;-&nbsp; {eventDate} &nbsp;({eventFormat})
                                        </Link>
                                    </td>
                                    </tr>
                                    {sortedResults.map((result, index) => (
                                        <tr key={index} style={{ marginBottom: '5px' }}>
                                            {result.division !== 'decksbyera' && (
                                                <>
                                                    <td>{getPlacementSuffix(result.placement)}</td>
                                                    <td><Link className='link-to-playerprofile' to={`/player/${normalizeName(result.playerName)}-${result.flag}`}>{formatName(result.playerName)}</Link></td>
                                                    <td><span className='grey'>{formatName(result.division)}</span></td>
                                                    <td></td>
                                                </>
                                            )}
                                            {result.division === 'decksbyera' && (
                                                <>
                                                    <td></td>
                                                    <td>{result.playerLabel}</td>
                                                    <td></td>
                                                </>
                                            )}
                                            <td className='player-deck-icons pushright'>
                                                <DisplayPokemonSprites decklist={result.decklist} sprite1={result.sprite1} sprite2={result.sprite2} />
                                                <Link to={eventId.includes('FEATURED') ? `/tournaments/${eventId}/decksbyera/${encodeURIComponent(result.decklist.label)}` : `/tournaments/${eventId}/${result.division}/${encodeURIComponent(result.playerName)}-${encodeURIComponent(result.flag)}`}>
                                                    <span className="material-symbols-outlined">format_list_bulleted</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
                {eventResults.length > 5 && (
                    <button onClick={() => setShowAllResults(!showAllResults)} className='showmoreversions'>
                        {showAllResults ? (
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
            </>
        ) : (
            eventsScanned && (
                <p className='margintop italic'>~ Looks like this card isn't featured in any of PTCG Legend's documented decks yet.</p>
            )
        )}
        <br></br>
        <p className='margintop smaller-txt italic'>Have a list featuring {cardInfo.name}? Or spot a mistake? Send it in to <a className='blue' href="mailto:ptcglegends@gmail.com">ptcglegends@gmail.com</a> for review.</p>
    </div>
            {isFullScreen && viewportWidth >= 600 && (
                <div className="fullscreen-overlay" onClick={handleImageClick}>
                    <img className="fullscreen-image" src={cardInfo.images.large} alt={cardInfo.name} />
                </div>
            )}
        </CardViewTheme>
    );
};

export default CardView;
