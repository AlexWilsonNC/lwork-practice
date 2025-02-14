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

    const getPokemonCount = (pokemonName) => {
        const pokemon = decklist.pokemon.find(pokemon => pokemon.name === pokemonName);
        return pokemon ? parseInt(pokemon.count, 10) : 0;
    };

    // Function to check if a specific Pokémon is in the deck
    const hasPokemon = (pokemonName) => getPokemonCount(pokemonName) > 0;

    // Multiple checks
    if (hasPokemon('Regidrago VSTAR') && hasPokemon('Teal Mask Ogerpon ex')) {
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
        secondSprite = getPokemonSpriteURL('pidgeot');
    }
    else if (hasPokemon('Snorlax') && hasPokemon('Rotom V')) {
        firstSprite = getPokemonSpriteURL('snorlax');
        secondSprite = getPokemonSpriteURL('rotom');
    }
    else if (hasPokemon('Zoroark') && hasPokemon('Kirlia')) {
        secondSprite = getPokemonSpriteURL('zoroark');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Zapdos')) {
        secondSprite = getPokemonSpriteURL('miraidon');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Raichu V')) {
        secondSprite = getPokemonSpriteURL('miraidon');
    }
    else if (hasPokemon('Miraidon ex') && hasPokemon('Iron Valiant ex')) {
        secondSprite = getPokemonSpriteURL('miraidon');
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
        secondSprite = getPokemonSpriteURL('dragapult');
    }
    else if (hasPokemon('Dragapult ex') && hasPokemon('Xatu')) {
        firstSprite = getPokemonSpriteURL('dragapult');
        secondSprite = getPokemonSpriteURL('xatu');
    }
    else if (hasPokemon('Pidgeot ex') && hasPokemon('Chi-Yu ex')) {
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
    else if (hasPokemon('Gholdengo ex') && hasPokemon('Scizor')) {
        firstSprite = getPokemonSpriteURL('gholdengo');
        secondSprite = getPokemonSpriteURL('scizor');
    }
    else if (hasPokemon('Origin Forme Dialga VSTAR') && hasPokemon('Metang')) {
        firstSprite = getPokemonSpriteURL('dialga-origin');
        secondSprite = getPokemonSpriteURL('metang');
    }
    else if (hasPokemon('Klawf') && hasPokemon('Brute Bonnet')) {
        firstSprite = getPokemonSpriteURL('klawf');
        secondSprite = getPokemonSpriteURL('brute-bonnet');
    }
    else if (hasPokemon('Froslass') && hasPokemon('Munkidori')) {
        firstSprite = getPokemonSpriteURL('froslass');
        secondSprite = getPokemonSpriteURL('munkidori');
    }
    else if (hasPokemon('Feraligatr') && hasPokemon('Origin Forme Palkia VSTAR')) {
        firstSprite = getPokemonSpriteURL('feraligatr');
        secondSprite = getPokemonSpriteURL('palkia-origin');
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
        else if(hasPokemon('Pidgeot ex')) {
            secondSprite = getPokemonSpriteURL('pidgeot');
        }
        else if(hasPokemon('Iron Thorns ex')) {
            secondSprite = getPokemonSpriteURL('ironthorns');
        }
        else if(hasPokemon('Inteleon VMAX')) {
            secondSprite = getPokemonSpriteURL('inteleon-vmax');
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
