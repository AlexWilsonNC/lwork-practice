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

const formatName = (name) => {
    const lowercaseWords = ['de', 'da', 'of', 'the'];
    const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jr', 'jt', 'jz', 'pj', 'sj', 'pk'];

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
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [eventsScanned, setEventsScanned] = useState(false);
    const [cardData, setCardData] = useState({ cardMap: {}, cardNameMap: {} });

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await fetch('https://ptcg-legends-6abc11783376.herokuapp.com/api/cards');
                if (response.ok) {
                    const cards = await response.json();
                    console.log('Fetched card data:', cards);
                    const cardMap = {};
                    const cardNameMap = {};
        
                    cards.forEach(card => {
                        const key = `${card.setAbbrev}-${card.number}`;
                        cardMap[key] = card;
        
                        const nameKey = normalizeString(card.name);
                        if (!cardNameMap[nameKey]) {
                            cardNameMap[nameKey] = [];
                        }
                        cardNameMap[nameKey].push(card);
                    });
                    setCardData({ cardMap, cardNameMap });

                    // Find the specific card using set and number params
                    const specificCardKey = `${set}-${number}`;
                    const specificCard = cardMap[specificCardKey];
                    if (specificCard) {
                        console.log('Specific card found:', specificCard);
                        setCardInfo(specificCard);
                    } else {
                        console.error('Card not found in card data');
                    }
                } else {
                    console.error('Failed to fetch card data');
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        fetchCardData();
    }, [set, number]);

    // Fetch event data if card info is set
    useEffect(() => {
        if (!cardInfo) {
            console.log('Card info is not set, skipping event fetch');
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

        const fetchAndFilterEvents = async () => {
            if (!cardInfo) return;

            if (cardInfo.supertype === "Energy" && cardInfo.subtypes.includes("Basic")) {
                setIsBasicEnergy(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            const eventIds = await fetchEventIds();
            setEventResults([]);

            for (const eventId of eventIds) {
                const eventData = await fetchEventData(eventId);
                if (eventData) {
                    const divisions = ['masters', 'seniors', 'juniors'];
                    const results = [];

                    divisions.forEach(division => {
                        if (eventData[division]) {
                            eventData[division].forEach((player, playerIndex) => {
                                if (player.decklist) {
                                    let hasCard = false;

                                    if (cardInfo.supertype === 'Pokémon') {
                                        hasCard = player.decklist.pokemon?.some(p => {
                                            const isMatch = 
                                                p.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase() &&
                                                p.set.trim().toLowerCase() === cardInfo.setAbbrev.trim().toLowerCase() &&
                                                String(p.number).trim() === String(cardInfo.number).trim();
                                            return isMatch;
                                        });
                                    } else {
                                        hasCard = player.decklist.trainer?.some(t => t.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase()) ||
                                                  player.decklist.energy?.some(e => e.name.trim().toLowerCase() === cardInfo.name.trim().toLowerCase());
                                    }

                                    if (hasCard) {
                                        results.push({
                                            eventId: eventData.id,
                                            eventName: eventData.name,
                                            eventDate: eventData.date,
                                            playerName: player.name,
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

                    setEventResults(prevResults => {
                        const uniqueResults = results.filter(result => 
                            !prevResults.some(prevResult => 
                                prevResult.eventId === result.eventId &&
                                prevResult.playerName === result.playerName &&
                                prevResult.division === result.division
                            )
                        );
                        return [...prevResults, ...uniqueResults];
                    });
                }
            }

            setLoading(false);
            setEventsScanned(true);
        };

        fetchAndFilterEvents();
    }, [cardInfo]);

    const bannedInExpanded = [
        { name: 'Archeops', set: 'DEX', number: '110' },
        { name: 'Archeops', set: 'NVI', number: '67' },
        { name: 'Chip-Chip Ice Axe', set: 'UNB', number: '165' },
        { name: 'Delinquent', set: 'BKP', number: '98' },
        { name: 'Delinquent', set: 'BKP', number: '98a' },
        { name: 'Delinquent', set: 'BKP', number: '98b' },
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
    const isStandardLegal = (card) => {
        const regulationMarks = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        if (card.regulationMark && regulationMarks.includes(card.regulationMark)) {
            return true;
        }
        if (card.supertype !== 'Pokémon' && 
            !(card.supertype === 'Energy' && card.subtypes.includes('Basic')) && 
            !(card.supertype === 'Energy' && ['Darkness Energy', 'Metal Energy'].includes(card.name))) {
            const otherVersions = Object.values(cardData.cardMap).filter(otherCard =>
                otherCard.name && otherCard.name.toLowerCase() === card.name.toLowerCase() &&
                otherCard.regulationMark &&
                regulationMarks.includes(otherCard.regulationMark)
            );
            return otherVersions.length > 0;
        }
        return false;
    };
    const isExpandedLegal = (card) => {
        const expandedSets = ['black & white', 'xy', 'sun & moon', 'sword & shield', 'scarlet & violet'];
        if (card.set && card.set.series && expandedSets.includes(card.set.series.toLowerCase())) {
            if (!bannedInExpanded.some(bannedCard =>
                bannedCard.name && bannedCard.name.toLowerCase() === card.name.toLowerCase() &&
                bannedCard.set && bannedCard.set.toLowerCase() === card.setAbbrev.toLowerCase() &&
                bannedCard.number === card.number
            )) {
                return true;
            }
        }
        if (card.supertype !== 'Pokémon' && 
            !(card.supertype === 'Energy' && card.subtypes.includes('Basic')) && 
            !(card.supertype === 'Energy' && ['Darkness Energy', 'Metal Energy'].includes(card.name))) {
            const otherVersions = Object.values(cardData.cardMap).filter(otherCard =>
                otherCard.name && otherCard.name.toLowerCase() === card.name.toLowerCase() &&
                otherCard.set && otherCard.set.series && expandedSets.includes(otherCard.set.series.toLowerCase()) &&
                !bannedInExpanded.some(bannedCard =>
                    bannedCard.name && bannedCard.name.toLowerCase() === otherCard.name.toLowerCase() &&
                    bannedCard.set && bannedCard.set.toLowerCase() === otherCard.setAbbrev.toLowerCase() &&
                    bannedCard.number === otherCard.number
                )
            );
    
            return otherVersions.length > 0;
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

    const otherVersions = cardInfo ? Object.values(cardData.cardMap).filter(otherCard => 
        otherCard.name?.toLowerCase() === cardInfo.name?.toLowerCase() &&
        otherCard.supertype === cardInfo.supertype &&
        (otherCard.supertype !== 'Pokémon') &&
        (cardInfo.supertype === 'Trainer' || 
        (cardInfo.supertype === 'Energy' && 
        (otherCard.subtypes && !otherCard.subtypes.includes('Basic'))))
    ) : [];
    
    const otherVersionsToShow = otherVersions.filter(otherCard =>
        otherCard.setAbbrev !== cardInfo.setAbbrev || otherCard.number !== cardInfo.number
    );
    const showOtherVersions = otherVersionsToShow.length > 0;
    const displayedOtherVersions = showAllVersions ? otherVersionsToShow : otherVersionsToShow.slice(0, 5);
        
    const getPreviousCard = () => {
        const prevNumber = parseInt(number, 10) - 1;
        const prevKey = `${set}-${prevNumber}`;
        return cardData?.cardMap?.[prevKey];
    };
    const getNextCard = () => {
        const nextNumber = parseInt(number, 10) + 1;
        const nextKey = `${set}-${nextNumber}`;
        return cardData?.cardMap?.[nextKey];
    };
    const previousCard = getPreviousCard();
    const nextCard = getNextCard();

    if (!cardInfo) {
        return <div>Card not found</div>;
    }

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

    return (
        <CardViewTheme className='center column-align' theme={theme}>
            {/* <Helmet>
                <title>{cardInfo.name} {cardInfo.setAbbrev} {cardInfo.number}</title>
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
            </Helmet> */}
            <div className='navigation-links'>
                {previousCard ? (
                    <Link to={`/card/${set}/${previousCard.number}`} className='previous-card-link'>
                        <span className="material-symbols-outlined">chevron_left</span> {previousCard.name} ({previousCard.setAbbrev}-{previousCard.number})
                    </Link>
                ) : (
                    <div className='previous-card-link'>&nbsp;</div>
                )}
                {nextCard ? (
                    <Link to={`/card/${set}/${nextCard.number}`} className='next-card-link'>
                        {nextCard.name} ({nextCard.setAbbrev}-{nextCard.number}) <span className="material-symbols-outlined">chevron_right</span>
                    </Link>
                ) : (
                    <div className='next-card-link'>&nbsp;</div>
                )}
            </div>
            <div className='card-view' style={{ position: 'relative' }}>
                {cardInfo.images.large && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${cardInfo.images.large})`,
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
                        <img className='the-card-img' src={cardInfo.images.large} alt={cardInfo.name} />
                        {cardInfo.set && (
                            <div>
                                <img className='cardview-setlogo' src={cardInfo.set.images.logo} alt={`${cardInfo.set.name} logo`} />
                                <p className='show-ninefifty'>
                                    {cardInfo.set.name}
                                    <span className='align-center'>
                                        <img className='cardview-setsymbol' src={cardInfo.set.images.symbol} alt={`${cardInfo.set.images.symbol} logo`} />
                                        &nbsp;
                                        <span className='italic'>{cardInfo.number}/{cardInfo.set.printedTotal}</span>
                                    </span>
                                    Released {cardInfo.set && formatDate(cardInfo.set.releaseDate)}
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
                        {cardInfo.supertype !== 'Energy' || cardInfo.subtypes[0] !== 'Basic' ? <hr className='small-grey-hr'></hr> : null}
                        {cardInfo.rarity && <p className='marginthree'>Rarity: {cardInfo.rarity}</p>}
                        {cardInfo.artist && <p>Illustrator: <span className='italic'>{cardInfo.artist}</span></p>}
                        <hr className='blue-hr'></hr>
                        {!isBasicEnergy && ( <>
                            <p className='marginthree'>Modern Legality:</p>
                            {cardInfo.regulationMark && (
                                <p className='marginthree smaller-than-others'>Regulation Mark: {cardInfo.regulationMark}</p>
                            )}
                            <div className='legality-checks'>
                                <p>Standard: {isStandardLegal(cardInfo) ? <span className="material-symbols-outlined" style={{ color: 'rgb(0, 198, 0)' }}>check</span> : <span className="material-symbols-outlined" style={{ color: 'rgb(204, 37, 37)' }}>close</span>}</p>
                                <p>Expanded: {isExpandedLegal(cardInfo) ? <span className="material-symbols-outlined" style={{ color: 'rgb(0, 198, 0)' }}>check</span> : <span className="material-symbols-outlined" style={{ color: 'rgb(204, 37, 37)' }}>close</span>}
                                    {isBannedInExpanded(cardInfo) && <span style={{ color: 'rgb(204, 37, 37)', marginLeft: '1px' }}>(Banned)</span>}
                                </p>
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
                                            {showAllVersions ? 'See Less ⮝' : 'See More ⮟'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>)}
                    </div>
                </div>
            </div>
            <div className="event-results marginbottom">
                <p className='decks-that-contain'>Decklists that contain {cardInfo.name}</p>
                <p className='italic ordered-by-most-recent'>(Ordered by most recent event appearance - Trainer & Special Energy cards of the same name appear together across all eras.)</p>
                {loading && !eventsScanned ? (
                    <p className='margintop'>Loading...</p>
                ) : isBasicEnergy ? (
                    <p className='margintop'>This search function is not available for Basic Energy cards, that type of query would cause the planet to impode...</p>
                ) : eventResults.length > 0 ? (
                    <table className='cards-specific-results'>
                        <thead>
                            <tr>
                                <th style={{width: '1%'}}>Place</th>
                                <th style={{width: '1%'}}>Player</th>
                                <th style={{width: '1%'}}>Division</th>
                                <th style={{width: '1%'}}>Event Link</th>
                                <th style={{width: '1%'}}>Decklist</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(
                                eventResults.reduce((acc, result) => {
                                    if (!acc[result.eventId]) {
                                        acc[result.eventId] = [];
                                    }
                                    acc[result.eventId].push(result);
                                    return acc;
                                }, {})
                            ).map(([eventId, results]) => {
                                const sortedResults = results.sort((a, b) => {
                                    const divisionOrder = { masters: 0, seniors: 1, juniors: 2 };
                                    const divisionComparison = divisionOrder[a.division] - divisionOrder[b.division];
                                    if (divisionComparison !== 0) return divisionComparison;
                                    return a.placement - b.placement;
                                });
                                const { eventName, eventDate } = results[0];
                                return (
                                    <React.Fragment key={eventId}>
                                        <tr className="event-separator">
                                            <td colSpan="5">
                                                <div className="event-separator-content">
                                                    <strong>{eventName}</strong> &nbsp;&nbsp;-&nbsp;&nbsp; {eventDate} &nbsp;&nbsp; <Link className='blue-link' to={`/tournaments/${eventId}`}><span class="material-symbols-outlined turned-link">link</span></Link>
                                                </div>
                                            </td>
                                        </tr>
                                        {sortedResults.map((result, index) => (
                                            <tr key={index}>
                                                <td>{getPlacementSuffix(result.placement)}</td>
                                                <td>{formatName(result.playerName)}</td>
                                                <td><span className='grey'>{formatName(result.division)}</span></td>
                                                <td><Link className='blue-link' to={`/tournaments/${result.eventId}`}>{result.eventName}</Link></td>
                                                <td className='player-deck-icons pushright'>
                                                    <DisplayPokemonSprites decklist={result.decklist} sprite1={result.sprite1} sprite2={result.sprite2} />
                                                    <Link to={`/tournaments/${result.eventId}/${result.division}/${encodeURIComponent(result.playerName)}-${encodeURIComponent(result.flag)}`}>
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
                ) : (
                    eventsScanned && (
                        <p className='margintop'>Looks like this card has never seen success... at least not from what we've documented.<br /><br /><span className='smaller-txt italic'>Have a list featuring {cardInfo.name}? Send it in to <a href="mailto:ptcglegends@gmail.com">ptcglegends@gmail.com</a> for review.</span></p>
                    )
                )}
            </div>
        </CardViewTheme>
    );
};

export default CardView;
