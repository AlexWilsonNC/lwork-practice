import sv1 from '../card-database/sv/sv1';
import sv2 from '../card-database/sv/sv2';
import sv3 from '../card-database/sv/sv3';
import sv3pt5 from '../card-database/sv/sv151';
import sv4 from '../card-database/sv/sv4';
import sv4pt5 from '../card-database/sv/sv45';
import sv5 from '../card-database/sv/sv5';
import sv6 from '../card-database/sv/sv6';
import svp from '../card-database/sv/promos';
import sve from '../card-database/sv/energy';
import energy from '../card-database/sv/imported-energy';

import swsh12pt5 from '../card-database/swsh/crown-zenith';
import swsh12 from '../card-database/swsh/silver-tempest';
import swsh11 from '../card-database/swsh/lost-origin';
import pgo from '../card-database/swsh/pokemon-go';
import swsh10 from '../card-database/swsh/astral-radiance';
import swsh9 from '../card-database/swsh/brilliant-stars';
import swsh8 from '../card-database/swsh/fusion-strike';
import cel25 from '../card-database/swsh/celebrations';
import swsh7 from '../card-database/swsh/evolving-skies';
import swsh6 from '../card-database/swsh/chilling-reign';
import swsh5 from '../card-database/swsh/battle-styles';
import swsh45 from '../card-database/swsh/shining-fates';
import swsh4 from '../card-database/swsh/vivid-voltage';
import swsh35 from '../card-database/swsh/champions-path';
import swsh3 from '../card-database/swsh/darkness-ablaze';
import swsh2 from '../card-database/swsh/rebel-clash';
import swsh1 from '../card-database/swsh/sword-shield';
import swshp from '../card-database/swsh/promos';

import sm12 from '../card-database/sm/cosmic-eclipse';
import sm115 from '../card-database/sm/hidden-fates';
import sm11 from '../card-database/sm/unified-minds';
import sm10 from '../card-database/sm/unbroken-bonds';
import det from '../card-database/sm/detective-pikachu';
import sm9 from '../card-database/sm/team-up';
import sm8 from '../card-database/sm/lost-thunder';
import sm75 from '../card-database/sm/dragon-majesty';
import sm7 from '../card-database/sm/celestial-storm';
import sm6 from '../card-database/sm/forbidden-light';
import sm5 from '../card-database/sm/ultra-prism';
import sm4 from '../card-database/sm/crimson-invasion';
import sm35 from '../card-database/sm/shining-legends';
import sm3 from '../card-database/sm/burning-shadow';
import sm2 from '../card-database/sm/guardians-rising';
import sm1 from '../card-database/sm/sun-moon';
import smp from '../card-database/sm/promos';

import xy12 from '../card-database/xy/evolutions';
import xy11 from '../card-database/xy/steam-siege';
import xy10 from '../card-database/xy/fates-collide';
import xy9 from '../card-database/xy/breakpoint';
import xy8 from '../card-database/xy/breakthrough';
import xy7 from '../card-database/xy/ancient-origins';
import g1 from '../card-database/xy/generations';
import xy6 from '../card-database/xy/roaring-skies';
import dc1 from '../card-database/xy/double-crisis';
import xy5 from '../card-database/xy/primal-clash';
import xy4 from '../card-database/xy/phantom-forces';
import xy3 from '../card-database/xy/furious-fists';
import xy2 from '../card-database/xy/flashfire';
import xy1 from '../card-database/xy/xy';
import xy0 from '../card-database/xy/kalos';
import xyp from '../card-database/xy/promos';

import bw11 from '../card-database/bw/legendary-treasures';
import bw10 from '../card-database/bw/plasma-blast';
import bw9 from '../card-database/bw/plasma-freeze';
import bw8 from '../card-database/bw/plasma-storm';
import bw7 from '../card-database/bw/boundaries-crossed';
import dv1 from '../card-database/bw/dragon-vault';
import bw6 from '../card-database/bw/dragons-exalted';
import bw5 from '../card-database/bw/dark-explorers';
import bw4 from '../card-database/bw/next-destinies';
import bw3 from '../card-database/bw/noble-victories';
import bw2 from '../card-database/bw/emerging-powers';
import bw1 from '../card-database/bw/black-white';
import bwp from '../card-database/bw/promos';

import col1 from '../card-database/hgss/call-of-legends';
import hgss4 from '../card-database/hgss/triumphant';
import hgss3 from '../card-database/hgss/undaunted';
import hgss2 from '../card-database/hgss/unleashed';
import hgss1 from '../card-database/hgss/hgss';
import hsp from '../card-database/hgss/promos';

import pl4 from '../card-database/dp/arceus';
import pl3 from '../card-database/dp/supreme-victores';
import pl2 from '../card-database/dp/rising-rivals';
import pl1 from '../card-database/dp/platinum';
import dp7 from '../card-database/dp/stormfront';
import dp6 from '../card-database/dp/legends-awakened';
import dp5 from '../card-database/dp/majestic-dawn';
import dp4 from '../card-database/dp/great-encounters';
import dp3 from '../card-database/dp/secret-wonders';
import dp2 from '../card-database/dp/mysterious-treasures';
import dp1 from '../card-database/dp/diamond-pearl';
import dpp from '../card-database/dp/promos';

import ex16 from '../card-database/rs/power-keepers';
import ex15 from '../card-database/rs/dragon-frontiers';
import ex14 from '../card-database/rs/crystal-guardians';
import ex13 from '../card-database/rs/holon-phantoms';
import ex12 from '../card-database/rs/legend-maker';
import ex11 from '../card-database/rs/delta-species';
import ex10 from '../card-database/rs/unseen-forces';
import ex9 from '../card-database/rs/emerald';
import ex8 from '../card-database/rs/deoxys';
import ex7 from '../card-database/rs/team-rocket-returns';
import ex6 from '../card-database/rs/firered-leafgreen';
import ex5 from '../card-database/rs/hidden-legends';
import ex4 from '../card-database/rs/magma-aqua';
import ex3 from '../card-database/rs/dragon';
import ex2 from '../card-database/rs/sandstorm';
import ex1 from '../card-database/rs/ruby-sapphire';
import np from '../card-database/rs/promos';

import ecard3 from '../card-database/wotc/skyridge';
import ecard2 from '../card-database/wotc/aquapolis';
import ecard1 from '../card-database/wotc/expedition';
import base6 from '../card-database/wotc/legendary-collection';
import neo4 from '../card-database/wotc/destiny';
import neo3 from '../card-database/wotc/revelation';
import neo2 from '../card-database/wotc/discovery';
import neo1 from '../card-database/wotc/genesis';
import gym2 from '../card-database/wotc/gym-challenge';
import gym1 from '../card-database/wotc/gym-heroes';
import base5 from '../card-database/wotc/team-rocket';
import base4 from '../card-database/wotc/base-set2';
import base3 from '../card-database/wotc/fossil';
import base2 from '../card-database/wotc/jungle';
import base1 from '../card-database/wotc/base-set';
import basep from '../card-database/wotc/promos';

import fr from '../card-database/other/foreign';
import pop9 from '../card-database/other/porganizedp9';
import pop8 from '../card-database/other/porganizedp8';
import pop7 from '../card-database/other/porganizedp7';
import pop6 from '../card-database/other/porganizedp6';
import pop5 from '../card-database/other/porganizedp5';
import pop4 from '../card-database/other/porganizedp4';
import pop3 from '../card-database/other/porganizedp3';
import pop2 from '../card-database/other/porganizedp2';
import pop1 from '../card-database/other/porganizedp1';
import ru1 from '../card-database/other/rumble';
import si1 from '../card-database/other/southern-islands';
import tk1a from '../card-database/other/tk1';
import tk2a from '../card-database/other/tk2';

const normalizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const consolidateCardData = () => {
    const allCards = [
        ...sv6,
        ...sv5,
        ...sv4pt5,
        ...sv4,
        ...sv3pt5,
        ...sv3,
        ...sv2,
        ...sv1,
        ...svp,
        ...sve,
        ...energy,
        
        ...swsh12pt5,
        ...swsh12,
        ...swsh11,
        ...pgo,
        ...swsh10,
        ...swsh9,
        ...swsh8,
        ...cel25,
        ...swsh7,
        ...swsh6,
        ...swsh5,
        ...swsh45,
        ...swsh4,
        ...swsh35,
        ...swsh3,
        ...swsh2,
        ...swsh1,
        ...swshp,

        ...sm12,
        ...sm115,
        ...sm11,
        ...sm10,
        ...det,
        ...sm9,
        ...sm8,
        ...sm75,
        ...sm7,
        ...sm6,
        ...sm5,
        ...sm4,
        ...sm35,
        ...sm3,
        ...sm2,
        ...sm1,
        ...smp,

        ...xy12,
        ...xy11,
        ...xy10,
        ...xy9,
        ...xy8,
        ...xy7,
        ...g1,
        ...xy6,
        ...dc1,
        ...xy5,
        ...xy4,
        ...xy3,
        ...xy2,
        ...xy1,
        ...xy0,
        ...xyp,

        ...bw11,
        ...bw10,
        ...bw9,
        ...bw8,
        ...bw7,
        ...dv1,
        ...bw6,
        ...bw5,
        ...bw4,
        ...bw3,
        ...bw2,
        ...bw1,
        ...bwp,

        ...col1,
        ...hgss4,
        ...hgss3,
        ...hgss2,
        ...hgss1,
        ...hgss1,
        ...hsp,

        ...pl4,
        ...pl3,
        ...pl2,
        ...pl1,
        ...dp7,
        ...dp6,
        ...dp5,
        ...dp4,
        ...dp3,
        ...dp2,
        ...dp1,
        ...dpp,

        ...ex16,
        ...ex15,
        ...ex14,
        ...ex13,
        ...ex12,
        ...ex11,
        ...ex10,
        ...ex9,
        ...ex8,
        ...ex7,
        ...ex6,
        ...ex5,
        ...ex4,
        ...ex3,
        ...ex2,
        ...ex1,
        ...np,

        ...ecard3,
        ...ecard2,
        ...ecard1,
        ...base6,
        ...neo4,
        ...neo3,
        ...neo2,
        ...neo1,
        ...gym2,
        ...gym1,
        ...base5,
        ...base4,
        ...base3,
        ...base2,
        ...base1,
        ...basep,

        ...fr,
        ...pop9,
        ...pop8,
        ...pop7,
        ...pop6,
        ...pop5,
        ...pop4,
        ...pop3,
        ...pop2,
        ...pop1,
        ...ru1,
        ...si1,
        ...tk2a,
        ...tk1a,
    ];

    const cardMap = {};
    const cardNameMap = {};

    allCards.forEach(card => {
        const key = `${card.setAbbrev}-${card.number}`;
        cardMap[key] = card;

        const nameKey = normalizeString(card.name);
        if (!cardNameMap[nameKey]) {
            cardNameMap[nameKey] = [];
        }
        cardNameMap[nameKey].push(card);
    });
    return { cardMap, cardNameMap };
};

export default consolidateCardData;