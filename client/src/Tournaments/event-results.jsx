import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DisplayPokemonSprites from './pokemon-sprites';
import styled from 'styled-components';

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
import croatia from '../assets/flags/croatia.png';
import czechia from '../assets/flags/czech-republic.png';
import denmark from '../assets/flags/denmark.png';
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
    AR: argentina,
    AU: australia,
    AT: austria,
    BY: belarus,
    BE: belgium,
    BR: brazil,
    CA: canada,
    CL: chile,
    CN: china,
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

const OlResults = styled.ol`
    .player-deck-icons a {
        color: ${({ theme }) => theme.text};
    }
    .player-deck-icons a:hover {
        color: #1290eb;
    }
    .link-to-playerprofile {
        color: ${({ theme }) => theme.text};
    }
    .link-to-playerprofile:hover {
        color: #1290eb;
    }
`;

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
        'jamie depamphilis': 'Jamie DePamphilis'
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

export const displayResults = (players, eventId, division, customPlacement) => {
    return (
        <OlResults className='result-list-ol'>
            {players.map((player, index) => {
                const placement = customPlacement !== undefined ? customPlacement : index + 1;

                return (
                    <li key={`${player.name}-${index}`} className='player-list-hover'>
                        <div className='results-list-item'>
                            <div className='name-n-flag'>
                                <div className='player-placement'>{placement}.</div>
                                <img className='flag-size' src={flags[player.flag]} alt="flag" />
                                <Link className='link-to-playerprofile' to={`/player/${normalizeName(player.name)}-${player.flag}`}>
                                    {formatName(player.name)}
                                </Link>
                            </div>
                            <div className="player-deck-icons">
                                <DisplayPokemonSprites decklist={player.decklist} sprite1={player.sprite1} sprite2={player.sprite2} />
                                <a
                                    href={`/tournaments/${eventId}/${division}/${encodeURIComponent(player.name)}-${encodeURIComponent(player.flag)}`}
                                    style={{
                                        opacity: player.decklist ? 1 : 0,
                                        pointerEvents: player.decklist ? 'auto' : 'none'
                                    }}
                                >
                                    <span className="material-symbols-outlined">
                                        format_list_bulleted
                                    </span>
                                </a>
                            </div>
                        </div>
                    </li>
                );
            })}
        </OlResults>
    );
};
