const fs = require('fs');
const path = require('path');

const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const cleanCardName = (name) => {
    return name.replace(" - ACESPEC", "").replace(" - Basic", "").replace(/ \(.+\)/, "").trim();
};

const loadCardData = () => {
    const cardData = { cardMap: {}, cardNameMap: {}, unwantedCards: {} };

    const sets = require('./standard/index.js');
    console.log('Sets loaded in order:');
    sets.reverse().forEach(set => {  // Reverse 
        console.log(`Processing set: ${set[0]?.set?.name || 'Unknown set'}`);
        set.forEach(card => {
            const key = `${card.setAbbrev}-${card.number}`;
            cardData.cardMap[key] = card;
            const nameKey = normalizeString(cleanCardName(card.name));
            if (!cardData.cardNameMap[nameKey]) {
                cardData.cardNameMap[nameKey] = [];
            }
            cardData.cardNameMap[nameKey].unshift(card);
        });
    });

    const unwantedSets = require('./unwanted/index.js');
    unwantedSets.forEach(set => {
        set.forEach(card => {
            const nameKey = normalizeString(cleanCardName(card.name));
            if (!cardData.unwantedCards[nameKey]) {
                cardData.unwantedCards[nameKey] = [];
            }
            cardData.unwantedCards[nameKey].push(card);
        });
    });

    console.log(`Loaded ${Object.keys(cardData.cardMap).length} cards in cardMap`);
    console.log(`Loaded ${Object.keys(cardData.cardNameMap).length} names in cardNameMap`);
    console.log(`Loaded ${Object.keys(cardData.unwantedCards).length} names in unwantedCards`);
    return cardData;
};

const cardData = loadCardData();

const comparePokemonCards = (card, unwantedCard) => {
    const typesMatch = JSON.stringify(card.types) === JSON.stringify(unwantedCard.types);
    const hpMatch = card.hp === unwantedCard.hp;
    const attacksMatch = JSON.stringify(card.attacks) === JSON.stringify(unwantedCard.attacks);
    const abilitiesMatch = JSON.stringify(card.abilities) === JSON.stringify(unwantedCard.abilities);

    console.log(`Comparing ${card.name} (${card.setAbbrev}-${card.number}) with unwanted ${unwantedCard.name} (${unwantedCard.setAbbrev}-${unwantedCard.number}):`);
    console.log(`  - Types: ${JSON.stringify(card.types)} === ${JSON.stringify(unwantedCard.types)} -> ${typesMatch}`);
    console.log(`  - HP: ${card.hp} === ${unwantedCard.hp} -> ${hpMatch}`);
    console.log(`  - Attacks: ${JSON.stringify(card.attacks)} === ${JSON.stringify(unwantedCard.attacks)} -> ${attacksMatch}`);
    console.log(`  - Abilities: ${JSON.stringify(card.abilities)} === ${JSON.stringify(unwantedCard.abilities)} -> ${abilitiesMatch}`);

    return typesMatch && hpMatch && attacksMatch && abilitiesMatch;
};

const normalizePokemonCard = (card) => {
    const nameKey = normalizeString(cleanCardName(card.name));
    const possibleCards = cardData.cardNameMap[nameKey];
    const unwantedCards = cardData.unwantedCards[nameKey] || [];

    console.log(`Available cards for ${card.name}:`);
    if (possibleCards && possibleCards.length > 0) {
        possibleCards.forEach(c => {
            console.log(`  - ${c.name} (${c.setAbbrev}-${c.number})`);
        });

        const validCards = possibleCards.filter(c => !unwantedCards.some(uw => comparePokemonCards(c, uw)));
        const latestCard = validCards.length > 0 ? validCards[0] : possibleCards[0];
        console.log(`Replacing with latest print: ${latestCard.name} (${latestCard.setAbbrev}-${latestCard.number})`);
        return {
            ...card,
            set: latestCard.setAbbrev,
            number: latestCard.number,
        };
    } else {
        console.log(`No replacement found for: ${card.name} (${card.set}-${card.number})`);
    }
    return card;
};

const normalizeCard = (card, type) => {
    if (type === 'pokemon') {
        return normalizePokemonCard(card);
    }
    const nameKey = normalizeString(cleanCardName(card.name));
    const possibleCards = cardData.cardNameMap[nameKey];

    console.log(`Available cards for ${card.name}:`);
    if (possibleCards && possibleCards.length > 0) {
        possibleCards.forEach(c => {
            console.log(`  - ${c.name} (${c.setAbbrev}-${c.number})`);
        });
        const latestCard = possibleCards[0]; // latest first
        console.log(`Replacing with latest print: ${latestCard.name} (${latestCard.setAbbrev}-${latestCard.number})`);
        return {
            ...card,
            set: latestCard.setAbbrev,
            number: latestCard.number,
        };
    } else {
        console.log(`No replacement found for: ${card.name} (${card.set}-${card.number})`);
    }
    return card;
};

const processPlayerDecklist = (decklist) => {
    const mergedDecklist = { pokemon: [], trainer: [], energy: [] };

    ['pokemon', 'trainer', 'energy'].forEach(type => {
        const cardCountMap = decklist[type].reduce((acc, card) => {
            const normalizedCard = normalizeCard(card, type);
            const cardKey = `${cleanCardName(normalizedCard.name)}`;

            if (!acc[cardKey]) {
                acc[cardKey] = { ...normalizedCard, count: 0 };
            }

            acc[cardKey].count += card.count;
            return acc;
        }, {});

        mergedDecklist[type] = Object.values(cardCountMap);
    });

    return mergedDecklist;
};

const normalizeAndMergeDecklist = (decklistData) => {
    return decklistData.map(player => {
        const processedDecklist = processPlayerDecklist(player.decklist);
        console.log(`Processed decklist for player: ${player.name}`);
        console.log(JSON.stringify(processedDecklist, null, 2));
        return {
            ...player,
            decklist: processedDecklist
        };
    });
};

const decklistData = {
    "juniors": [
        {
            "name": "Elijah L.",
            "flag": "US",
            "decklist": {
              "pokemon": [
                {
                  "count": 1,
                  "name": "Sableye",
                  "number": "70",
                  "set": "LOR"
                },
                {
                  "count": 1,
                  "name": "Cramorant",
                  "number": "50",
                  "set": "LOR"
                },
                {
                  "count": 1,
                  "name": "Radiant Greninja",
                  "number": "46",
                  "set": "ASR"
                },
                {
                    "count": 4,
                    "name": "Comfey",
                    "number": "GG14",
                    "set": "CRZ"
                  },
                {
                  "count": 1,
                  "name": "Raikou V",
                  "number": "GG41",
                  "set": "CRZ"
                },
                {
                  "count": 1,
                  "name": "Iron Bundle",
                  "number": "66",
                  "set": "PR-SV"
                },
                {
                  "count": 1,
                  "name": "Iron Hands ex",
                  "number": "223",
                  "set": "PAR"
                },
                {
                  "count": 1,
                  "name": "Bloodmoon Ursaluna ex",
                  "number": "141",
                  "set": "TWM"
                },
                {
                  "count": 1,
                  "name": "Spiritomb",
                  "number": "89",
                  "set": "PAL"
                }
              ],
              "trainer": [
                {
                  "count": 4,
                  "name": "Colress's Experiment",
                  "number": "GG59",
                  "set": "CRZ"
                },
                {
                  "count": 1,
                  "name": "Boss's Orders",
                  "number": "132",
                  "set": "BRS"
                },
                {
                  "count": 1,
                  "name": "Roxanne",
                  "number": "150",
                  "set": "ASR"
                },
                {
                  "count": 4,
                  "name": "Mirage Gate",
                  "number": "163",
                  "set": "LOR"
                },
                {
                  "count": 4,
                  "name": "Nest Ball",
                  "number": "84",
                  "set": "PAF"
                },
                {
                  "count": 4,
                  "name": "Super Rod",
                  "number": "188",
                  "set": "PAL"
                },
                {
                  "count": 4,
                  "name": "Switch Cart",
                  "number": "154",
                  "set": "ASR"
                },
                {
                  "count": 3,
                  "name": "Switch",
                  "number": "144",
                  "set": "CRZ"
                },
                {
                  "count": 3,
                  "name": "Buddy-Buddy Poffin",
                  "number": "144",
                  "set": "TEF"
                },
                {
                  "count": 1,
                  "name": "Hisuian Heavy Ball",
                  "number": "146",
                  "set": "ASR"
                },
                {
                  "count": 1,
                  "name": "Prime Catcher - ACESPEC",
                  "number": "157",
                  "set": "TEF"
                },
                {
                  "count": 3,
                  "name": "Lost Vacuum",
                  "number": "135",
                  "set": "CRZ"
                },
                {
                  "count": 1,
                  "name": "Pokegear 3.0",
                  "number": "174",
                  "set": "SSH"
                },
                {
                  "count": 2,
                  "name": "Forest Seal Stone",
                  "number": "156",
                  "set": "SIT"
                },
                {
                  "count": 1,
                  "name": "Rescue Board",
                  "number": "159",
                  "set": "TEF"
                },
                {
                  "count": 2,
                  "name": "PokeStop",
                  "number": "68",
                  "set": "PGO"
                },
                {
                  "count": 1,
                  "name": "Pal Pad",
                  "number": "172",
                  "set": "SSH"
                }
              ],
              "energy": [
                {
                  "count": 3,
                  "name": "Water Energy - Basic",
                  "number": "231",
                  "set": "CRE"
                },
                {
                  "count": 3,
                  "name": "Lightning Energy - Basic",
                  "number": "155",
                  "set": "CRZ"
                },
                {
                  "count": 2,
                  "name": "Psychic Energy - Basic",
                  "number": "232",
                  "set": "CRE"
                }
              ]
            }
          },
    ]
};

const processeddecklistData = normalizeAndMergeDecklist(decklistData.juniors);
