import React from 'react';
import '../css/eventpage.css';

const normalizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
};

const getPokemonSpriteURL = (name) => {
    const normalizedName = normalizeName(name);
    return `/assets/sprites/${normalizedName}.png`;
};

export const getPokemonSprites = (decklist, sprite1, sprite2) => {
    let firstSprite = '';
    let secondSprite = '';

    if (sprite1 && sprite2) {
        firstSprite = getPokemonSpriteURL(sprite1);
        secondSprite = getPokemonSpriteURL(sprite2);
        return { firstSprite, secondSprite };
    }

    if (!decklist) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('hyphen');
        return { firstSprite, secondSprite };
    }

    const getCount = (section, cardName) => {
        const list = decklist[section] || [];
        const card = list.find(c => c.name === cardName);
        return card ? parseInt(card.count, 10) : 0;
    };

    // Convenience wrappers
    const getPokemonCount = name   => getCount('pokemon', name);
    const getTrainerCount = name   => getCount('trainer', name);

    const hasPokemon = name        => getPokemonCount(name) > 0;
    const hasTrainer = name        => getTrainerCount(name) > 0;

    // Multiple checks
    if (hasPokemon('Lillie\'s Clefairy ex') && hasTrainer('Lillie\'s Pearl')) {
        firstSprite = getPokemonSpriteURL('clefairy');
        secondSprite = getPokemonSpriteURL('noctowl');
    }
    else if (hasPokemon('Iron Leaves ex') && hasPokemon('Iron Crown ex') && hasPokemon('Miraidon') && hasPokemon('Iron Valiant ex')) {
        firstSprite = getPokemonSpriteURL('iron-leaves');
        secondSprite = getPokemonSpriteURL('iron-crown');
    }     
    else if (hasPokemon('Ethan\'s Typhlosion')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('typhlosion');
    }
    else if (hasPokemon('Blissey ex') && hasPokemon('Munkidori')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('blissey');
    }
    else if (hasPokemon('Dipplin') && hasPokemon('Thwackey')) {
        firstSprite = getPokemonSpriteURL('dipplin');
        secondSprite = getPokemonSpriteURL('thwackey');
    }
    else if (hasPokemon('Team Rocket\'s Spidops') && hasPokemon('Team Rocket\'s Mewtwo ex')) {
        firstSprite = getPokemonSpriteURL('spidops');
        secondSprite = getPokemonSpriteURL('mewtwo');
    }
    else if (hasPokemon('Regidrago VSTAR') && hasPokemon('Teal Mask Ogerpon ex')) {
        firstSprite = getPokemonSpriteURL('regidrago');
        secondSprite = getPokemonSpriteURL('ogerpon');
    }
    else if (hasPokemon('Raging Bolt ex') && hasPokemon('Teal Mask Ogerpon ex')) {
        firstSprite = getPokemonSpriteURL('raging-bolt');
        secondSprite = getPokemonSpriteURL('ogerpon');
    }
    else if (hasPokemon('Mew VMAX') && hasPokemon('Genesect V')) {
        firstSprite = getPokemonSpriteURL('mew-vmax');
        secondSprite = getPokemonSpriteURL('genesect');
    }
    else if (hasPokemon('Chien-Pao ex') && hasPokemon('Baxcalibur')) {
        firstSprite = getPokemonSpriteURL('chien-pao');
        secondSprite = getPokemonSpriteURL('baxcalibur');
    }
    else if (hasPokemon('Origin Forme Palkia VSTAR') && hasPokemon('Chien-Pao ex')) {
        firstSprite = getPokemonSpriteURL('palkia-origin');
        secondSprite = getPokemonSpriteURL('chien-pao');
    }
    else if (hasPokemon('Alolan Vulpix VSTAR') && hasPokemon('Yveltal')) {
        firstSprite = getPokemonSpriteURL('vulpix-alola');
        secondSprite = getPokemonSpriteURL('yveltal');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Aggron VMAX')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('aggron-vmax');
    }
    else if (hasPokemon('Rapid Strike Urshifu VMAX') && hasPokemon('Inteleon VMAX')) {
        firstSprite = getPokemonSpriteURL('urshifu-rapid-strike-gmax');
        secondSprite = getPokemonSpriteURL('inteleon-vmax');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Regieleki VMAX')) {
        firstSprite = getPokemonSpriteURL('miraidon');
        secondSprite = getPokemonSpriteURL('regieliki-vmax');
    }
    else if (hasPokemon('Raging Bolt ex') && hasPokemon('Sandy Shocks ex')) {
        firstSprite = getPokemonSpriteURL('raging-bolt');
        secondSprite = getPokemonSpriteURL('sandy-shocks');
    }
    else if (hasPokemon('Comfey') && hasPokemon('Hisuian Goodra VSTAR')) {
        firstSprite = getPokemonSpriteURL('goodra-hisui');
        secondSprite = getPokemonSpriteURL('comfey');
    }
    else if (hasPokemon('Comfey') && hasPokemon('Dragapult ex')) {
        firstSprite = getPokemonSpriteURL('dragapult');
        secondSprite = getPokemonSpriteURL('comfey');
    }
    else if (hasPokemon('Comfey') && hasPokemon('Radiant Charizard')) {
        firstSprite = getPokemonSpriteURL('comfey');
        secondSprite = getPokemonSpriteURL('charizard-shiny');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Regidrago VSTAR')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('regidrago');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Hisuian Goodra VSTAR')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('goodra-hisui');
    }
    else if (hasPokemon('Comfey') && hasPokemon('Giratina VSTAR')) {
        firstSprite = getPokemonSpriteURL('giratina-origin');
        secondSprite = getPokemonSpriteURL('comfey');
    }
    else if (hasPokemon('Comfey') && hasPokemon('Sableye')) {
        firstSprite = getPokemonSpriteURL('comfey');
        secondSprite = getPokemonSpriteURL('sableye');
    }
    else if (hasPokemon('Pidgeot ex') && hasPokemon('Snorlax') && hasPokemon('Cornerstone Mask Ogerpon ex')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('pidgeot');
    }
    else if (hasPokemon('Snorlax') && hasPokemon('Rotom V')) {
        firstSprite = getPokemonSpriteURL('snorlax');
        secondSprite = getPokemonSpriteURL('rotom');
    }
    else if (hasPokemon('Zoroark') && hasPokemon('Kirlia')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('zoroark');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Zapdos')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('miraidon');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Raichu V')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('miraidon');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Iron Valiant ex')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('miraidon');
    }    
    else if (hasPokemon('Entei V') && hasPokemon('Iron Valiant ex')) {
        firstSprite = getPokemonSpriteURL('entei');
        secondSprite = getPokemonSpriteURL('iron-valiant');
    }    
    else if (hasPokemon('Iron Crown ex') && hasPokemon('Iron Hands ex')) {
        firstSprite = getPokemonSpriteURL('iron-hands');
        secondSprite = getPokemonSpriteURL('iron-crown');
    }
    else if (hasPokemon('Lugia VSTAR') && hasPokemon('Archeops')) {
        firstSprite = getPokemonSpriteURL('lugia');
        secondSprite = getPokemonSpriteURL('archeops');
    }
    else if (hasPokemon('Charizard ex') && hasPokemon('Dragapult ex')) {
        const dragapultCount = getPokemonCount('Dragapult ex');
        if (dragapultCount > 1) {
            firstSprite = getPokemonSpriteURL('dragapult');
            secondSprite = getPokemonSpriteURL('charizard');
        } else {
            firstSprite = getPokemonSpriteURL('charizard');
            secondSprite = getPokemonSpriteURL('pidgeot');
        }
    }
    else if (hasPokemon('Dragapult ex') && hasPokemon('Pidgeot ex')) {
        firstSprite = getPokemonSpriteURL('dragapult');
        secondSprite = getPokemonSpriteURL('pidgeot');
    }
    else if (hasPokemon('Dragapult ex') && hasPokemon('Bibarel')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('dragapult');
    }
    else if (hasPokemon('Dragapult ex') && hasPokemon('Xatu')) {
        firstSprite = getPokemonSpriteURL('dragapult');
        secondSprite = getPokemonSpriteURL('xatu');
    }
    else if (hasPokemon('Pidgeot ex') && hasPokemon('Chi-Yu ex')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('pidgeot');
    }
    else if (hasPokemon('Charizard ex') && hasPokemon('Pidgeot ex')) {
        firstSprite = getPokemonSpriteURL('charizard');
        secondSprite = getPokemonSpriteURL('pidgeot');
    }
    else if (hasPokemon('Charizard ex') && hasPokemon('Bibarel')) {
        firstSprite = getPokemonSpriteURL('charizard');
        secondSprite = getPokemonSpriteURL('bibarel');
    }
    else if (hasPokemon('Charizard ex') && hasPokemon('Dusknoir')) {
        firstSprite = getPokemonSpriteURL('charizard');
        secondSprite = getPokemonSpriteURL('dusknoir');
    }
    else if (hasPokemon('Roaring Moon') && hasPokemon('Flutter Mane')) {
        firstSprite = getPokemonSpriteURL('roaring-moon');
        secondSprite = getPokemonSpriteURL('flutter-mane');
    }
    else if (hasPokemon('Roaring Moon') && hasPokemon('Koraidon')) {
        firstSprite = getPokemonSpriteURL('roaring-moon');
        secondSprite = getPokemonSpriteURL('koraidon');
    }
    else if (hasPokemon('Roaring Moon ex') && hasPokemon('Dudunsparce')) {
        firstSprite = getPokemonSpriteURL('roaring-moon');
        secondSprite = getPokemonSpriteURL('dudunsparce');
    }
    else if (hasPokemon('Roaring Moon') && hasPokemon('Great Tusk')) {
        firstSprite = getPokemonSpriteURL('roaring-moon');
        secondSprite = getPokemonSpriteURL('great-tusk');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Giratina VSTAR')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('giratina-origin');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Armarouge')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('armarouge');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Radiant Charizard')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('charizard-shiny');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Alolan Vulpix VSTAR')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('vulpix-alola');
    }
    else if (hasPokemon('Tinkaton ex') && hasPokemon('Dudunsparce')) {
        firstSprite = getPokemonSpriteURL('tinkaton');
        secondSprite = getPokemonSpriteURL('dudunsparce');
    }
    else if (hasPokemon('Espathra ex') && hasPokemon('Xatu')) {
        firstSprite = getPokemonSpriteURL('espathra');
        secondSprite = getPokemonSpriteURL('xatu');
    }
    else if (hasPokemon('Gholdengo ex') && hasPokemon('Origin Forme Palkia VSTAR')) {
        firstSprite = getPokemonSpriteURL('gholdengo');
        secondSprite = getPokemonSpriteURL('palkia-origin');
    }
    else if (hasPokemon('Origin Forme Dialga VSTAR') && hasPokemon('Metang')) {
        firstSprite = getPokemonSpriteURL('dialga-origin');
        secondSprite = getPokemonSpriteURL('metang');
    }
    else if (hasPokemon('Klawf') && hasPokemon('Brute Bonnet')) {
        firstSprite = getPokemonSpriteURL('klawf');
        secondSprite = getPokemonSpriteURL('brute-bonnet');
    }
    else if (hasPokemon('Teal Mask Ogerpon ex') && hasPokemon('Wellspring Mask Ogerpon ex') && hasPokemon('Cornerstone Mask Ogerpon ex') && hasPokemon('Lillie\'s Clefairy ex')) {
        firstSprite = getPokemonSpriteURL('ogerpon');
        secondSprite = getPokemonSpriteURL('ogerpon-wellspring');
    }
    else if(hasPokemon('Marnie\'s Grimmsnarl ex') && hasPokemon('Froslass')) {
        firstSprite = getPokemonSpriteURL('grimmsnarl');
        secondSprite = getPokemonSpriteURL('froslass');
    }
    else if (hasPokemon('Froslass') && hasPokemon('Munkidori')) {
        firstSprite = getPokemonSpriteURL('froslass');
        secondSprite = getPokemonSpriteURL('munkidori');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Duraludon VMAX')) {
        firstSprite = getPokemonSpriteURL('duraludon-gmax');
        secondSprite = getPokemonSpriteURL('arceus');
    }
    else if (hasPokemon('Ting-Lu ex') && hasPokemon('Koraidon ex')) {
        firstSprite = getPokemonSpriteURL('ting-lu');
        secondSprite = getPokemonSpriteURL('koraidon');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Flying Pikachu VMAX')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('pikachu-gmax');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Umbreon VMAX')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('umbreon-vmax');
    }
    else if (hasPokemon('Arceus VSTAR') && hasPokemon('Dusknoir')) {
        firstSprite = getPokemonSpriteURL('arceus');
        secondSprite = getPokemonSpriteURL('dusknoir');
    }
    else if (hasPokemon('Origin Forme Palkia VSTAR') && hasPokemon('Dusknoir')) {
        firstSprite = getPokemonSpriteURL('palkia-origin');
        secondSprite = getPokemonSpriteURL('dusknoir');
    }
    else if (hasPokemon('Origin Forme Palkia VSTAR') && hasPokemon('Gardevoir')) {
        firstSprite = getPokemonSpriteURL('palkia-origin');
        secondSprite = getPokemonSpriteURL('gardevoir');
    }
    else if (hasPokemon('Cornerstone Mask Ogerpon ex') && hasPokemon('Noivern ex')) {
        firstSprite = getPokemonSpriteURL('ogerpon-cornerstone');
        secondSprite = getPokemonSpriteURL('noivern');
    }    
    else if (hasPokemon('Banette ex') && hasPokemon('Dusknoir')) {
        firstSprite = getPokemonSpriteURL('banette');
        secondSprite = getPokemonSpriteURL('dusknoir');
    }    
    else if (hasPokemon('Iron Valiant ex') && hasPokemon('Bloodmoon Ursaluna')) {
        firstSprite = getPokemonSpriteURL('iron-valiant');
        secondSprite = getPokemonSpriteURL('ursaluna-bloodmoon');
    }  
    else if (hasPokemon('Noctowl') && hasPokemon('Wellspring Mask Ogerpon ex') && hasPokemon('Flareon ex') && hasPokemon('Volcanion ex')) {
        firstSprite = getPokemonSpriteURL('flareon');
        secondSprite = getPokemonSpriteURL('noctowl');
    }     
    else if (hasPokemon('Noctowl') && hasPokemon('Leafeon ex') && hasPokemon('Flareon ex') && hasPokemon('Sylveon ex')) {
        firstSprite = getPokemonSpriteURL('flareon');
        secondSprite = getPokemonSpriteURL('noctowl');
    }     
    else if (hasPokemon('Sinistcha') && hasPokemon('Teal Mask Ogerpon ex')) {
        firstSprite = getPokemonSpriteURL('sinistcha');
        secondSprite = getPokemonSpriteURL('ogerpon');
    }     
    else if (hasPokemon('Noctowl') && hasPokemon('Wellspring Mask Ogerpon ex')) {
        firstSprite = getPokemonSpriteURL('noctowl');
        secondSprite = getPokemonSpriteURL('ogerpon-wellspring');
    }     
    else if (hasPokemon('Joltik') && hasPokemon('Pikachu ex')) {
        firstSprite = getPokemonSpriteURL('joltik');
        secondSprite = getPokemonSpriteURL('pikachu');
    }    
    else if (hasPokemon('Dragapult ex') && hasPokemon('Dusknoir')) {
        firstSprite = getPokemonSpriteURL('dragapult');
        secondSprite = getPokemonSpriteURL('dusknoir');
    }    
    else if (hasPokemon('Flareon ex') && hasPokemon('Noctowl')) {
        firstSprite = getPokemonSpriteURL('flareon');
        secondSprite = getPokemonSpriteURL('noctowl');
    }      
    else if (hasPokemon('Milotic ex') && hasPokemon('Farigiraf ex')) {
        firstSprite = getPokemonSpriteURL('milotic');
        secondSprite = getPokemonSpriteURL('farigiraf');
    }      
    else if (hasPokemon('N\'s Zoroark ex') && hasPokemon('N\'s Darmanitan')) {
        firstSprite = getPokemonSpriteURL('zoroark');
        secondSprite = getPokemonSpriteURL('darmanitan');
    }           
    else if (hasPokemon('N\'s Zoroark ex') && !hasPokemon('N\'s Darmanitan')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('zoroark');
    }           
    else if (hasPokemon('Ethan\'s Ho-Oh ex') && hasPokemon('Armarouge')) {
        firstSprite = getPokemonSpriteURL('ho-oh');
        secondSprite = getPokemonSpriteURL('armarouge');
    }           
    else if (hasPokemon('Cynthia\'s Garchomp ex')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('garchomp');
    }           
    else if (hasPokemon('Ceruledge ex') && hasPokemon('Revavroom')) {
        firstSprite = getPokemonSpriteURL('blank');
        secondSprite = getPokemonSpriteURL('ceruledge');
    }           
    else if (hasPokemon('Terapagos ex') && hasPokemon('Bouffalant')) {
        firstSprite = getPokemonSpriteURL('terapagos');
        secondSprite = getPokemonSpriteURL('noctowl');
    }           
    else if (hasPokemon('Okidogi') && hasPokemon('Dudunsparce')) {
        firstSprite = getPokemonSpriteURL('okidogi');
        secondSprite = getPokemonSpriteURL('dudunsparce');
    }           
    else if (hasPokemon('Toedscruel ex') && hasPokemon('Teal Mask Ogerpon ex')) {
        firstSprite = getPokemonSpriteURL('toedscruel');
        secondSprite = getPokemonSpriteURL('ogerpon');
    }           

    // Individual checks
    if (!secondSprite) {
        if (hasPokemon('Roaring Moon ex')) {
            secondSprite = getPokemonSpriteURL('roaring-moon');
        }
        else if (hasPokemon('Gardevoir ex')) {
            secondSprite = getPokemonSpriteURL('gardevoir');
        }
        else if(hasPokemon('Comfey')) {
            secondSprite = getPokemonSpriteURL('comfey');
        }
        else if(hasPokemon('Hydreigon ex')) {
            secondSprite = getPokemonSpriteURL('hydreigon');
        }
        else if(hasPokemon('Mamoswine ex')) {
            secondSprite = getPokemonSpriteURL('mamoswine');
        }
        else if(hasPokemon('Iron Thorns ex')) {
            secondSprite = getPokemonSpriteURL('ironthorns');
        }
        else if(hasPokemon('Inteleon VMAX')) {
            secondSprite = getPokemonSpriteURL('inteleon-vmax');
        }
        else if(hasPokemon('Dragapult ex')) {
            secondSprite = getPokemonSpriteURL('dragapult');
        }
        else if(hasPokemon('Gholdengo ex')) {
            secondSprite = getPokemonSpriteURL('gholdengo');
        }
        else if(hasPokemon('Archaludon ex')) {
            secondSprite = getPokemonSpriteURL('archaludon');
        }
        else if(hasPokemon('Feraligatr')) {
            secondSprite = getPokemonSpriteURL('feraligatr');
        }
        // always keep last, so any deck with pidgeot doesnt get overwritten
        else if(hasPokemon('Pidgeot ex')) {
            secondSprite = getPokemonSpriteURL('pidgeot');
        }
    }

    return { firstSprite, secondSprite };
};

const DisplayPokemonSprites = ({ decklist, sprite1, sprite2 }) => {
    const { firstSprite, secondSprite } = getPokemonSprites(decklist, sprite1, sprite2);
    return (
        <div className="player-deck-icons">
            {firstSprite && <img className="sprite" src={firstSprite} alt="sprite" />}
            {secondSprite && <img className="sprite second-sprite" src={secondSprite} alt="sprite" />}
        </div>
    );
};

export default DisplayPokemonSprites;
