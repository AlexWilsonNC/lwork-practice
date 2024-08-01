const customLabelsConfig = {
    '2024': {
        '-gardevoir': 'Gardevoir',
        'chien-pao-baxcalibur': 'Chien-pao',
        'comfey-sableye': 'Lost Box',
        'lugia-archeops': 'Lugia',
        'raging-bolt-ogerpon': 'Raging Bolt',
        '-miraidon': 'Miraidon',
        'charizard-pidgeot': 'Charizard',
        'snorlax-rotom': 'Snorlax Stall',
        'dragapult-pidgeot': 'Dragapult',
        '-pidgeot': 'Pidgeot',
        'regidrago-ogerpon': 'Regidrago',
        'iron-hands-iron-crown': 'Future Box',
        '-roaring-moon': 'Roaring Moon',
        'charizard-dragapult': 'Charizard',
        'iron-thorns-': 'Iron Thorns',
        'gholdengo-palkia-origin': 'Gholdengo',
        'dragapult-xatu': 'Dragapult',
        'dialga-origin-metang': 'Dialga',
        'roaring-moon-koraidon': 'Ancient Box',
        'roaring-moon-great-tusk': 'Ancient Box',
        'froslass-munkidori': 'Froslass',
        'raging-bolt-sandy-shocks': 'Raging Bolt',
        'klawf-brute-bonnet': 'Klawf',
        'eeee': 'eee',
    },
    '2023': {

    },
    '2022': {

    },
    '2021': {

    },
    '2020': {
        'adp-zacian-crowned': 'ADP',
        '-pikachu-zekrom-tagteam': 'PikaRom',
        'mewtwo-mew-tagteam-malamar': 'Mewtwo & Mew + Malamar',
        '-mewtwo-mew-tagteam': 'Mewtwo & Mew',
        '-blacephalon': 'Baby Blowns',
        'oranguru-cinccino': 'Oranguru Mill',
        'malamar-giratina': 'Malamar',
        '-magcargo': 'Magcargo GX',
        'reshiram-charizard-tagteam-ninetales': 'ReshiZard',
        '-reshiram-charizard-tagteam': 'ReshiZard',
        '-obstagoon': 'Obstagoon',
        'magcargo-oranguru': 'Magcargo Mill',
        'lucario-melmetal-tagteam-zacian-crowned': 'LucMetal',
        'oranguru-pidgeotto': 'Oranguru Mill',
        'adp-keldeo': 'ADP',
        '-adp': 'ADP',
        'blacephalon-pidgeotto': 'Baby Blowns',
        'blacephalon-naganadel': 'Blowns',
        'florges-munchlax': 'Florges Stall',
        'guzzlord-naganadel-tagteam-mismagius': 'Guzzlord & Naganadel',
        'giratina-garchomp-tagteam-mismagius': 'Giratina & Garchomp',
        'gardevoir-sylveon-tagteam-omastar': 'Gardevoir & Sylveon',
        'charizard-braixen-tagteam-volcanion': 'Charizard & Braixen',
        'silvally-quagsire': 'Silvally GX',
        'gardevoir-sylveon-tagteam-xerneas-active': 'Gardevoir & Sylveon',
        'mewtwo-mew-tagteam-victini': 'Mewtwo & Mew',
        'quagsire-naganadel': 'QuagNag',
        '-charizard-braixen-tagteam': 'Charizard & Braixen',
    },
    '2019': {

    },
    '2018': {

    },
    '2017': {

    },
    '2016': {

    },
    '2015': {

    },
    '2014': {
        'yveltal-darkrai': 'Yveltal',
        'yveltal-garbodor': 'Yveltal',
        'virizion-genesect': 'VirGen',
        'kyurem-deoxys': 'TDK',
        'flygon-dusknoir': 'Flygon',
        'lugia-deoxys': 'Plasma',
        'weavile-lopunny': 'Weavile Lopunny',
        '-pyroar': 'Pyroar',
        'landorus-therian-raichu': 'Landorus',
        'yveltal-raticate': 'Yveltal',
        'keldeo-resolute-blastoise': 'Keldeo Blastoise',
        'empoleon-dusknoir': 'Empoleon',
        'aromatisse-deoxys': 'Fairy Box',
        '-ninetales': 'Ninetales',
        'eeee': 'eee',
    },
    '2013': {

    },
    '2012': {

    },
    '2011': {

    },
    '2010': {
        'luxray-garchomp': 'LuxChomp',
        'gardevoir-gallade': 'Gardevoir',
        'dialga-garchomp': 'DialgaChomp',
        '-gengar': 'Gengar',
        '-jumpluff': 'Jumpluff',
        'flygon-torterra': 'FlyTerra',
        '-arceus': 'Arceus',
        '-regigigas': 'Regigigas',
        'steelix-blissey': 'Steelix PRIME',
        '-donphan': 'Donphan PRIME',
        '-gyarados': 'Gyarados',
        'kingdra-donphan': 'Kingdra PRIME',
        'abomasnow-ampharos': 'Abomasnow Ampharos',
        'eeee': 'eee',
        'eeee': 'eee',
    },
    '2009': {

    },
    '2008': {

    },
    '2007': {

    },
    '2006': {

    },
    '2005': {

    },
    '2004': {

    },
    '2003': {

    },
    '2002': {

    },
    '2001': {

    },
    '2000': {

    },
    '1999': {

    },
};

const getCustomLabel = (eventId, sprite1, sprite2) => {
    let eventYearKey = '';
    if (eventId.includes('2014')) {
      eventYearKey = '2014';
    } else if (eventId.includes('2010')) {
      eventYearKey = '2010';
    } else if (eventId.includes('2020')) {
        eventYearKey = '2020';
      } else if (eventId.includes('2024')) {
        eventYearKey = '2024';
      }
    const eventLabels = customLabelsConfig[eventYearKey];
    if (eventLabels) {
      const key = sprite1 !== 'blank' ? `${sprite1}-${sprite2}` : sprite2;
      return eventLabels[key] || key;
    }
    return sprite1 !== 'blank' ? `${sprite1}-${sprite2}` : sprite2;
  };
export { getCustomLabel };