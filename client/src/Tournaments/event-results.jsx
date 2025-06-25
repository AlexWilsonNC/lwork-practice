import React from 'react';
import { Link } from 'react-router-dom';
import DisplayPokemonSprites from './pokemon-sprites';
import styled from 'styled-components';

import { flags, countryNames } from '../Tools/flags';

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
    .flag-container {
        position: relative;
        display: inline-block;
        text-align: center;
        margin-top: 5px;
    }
    .flag-tooltip {
        visibility: hidden;
        background-color: #1290eb;
        color: white;
        text-align: center;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 10px;
        position: absolute;
        z-index: 9999 !important;
        bottom: 95%;
        left: 35%;
        transform: translateX(-50%);
        white-space: nowrap;
        display: block;
    }
    .flag-container:hover .flag-tooltip {
        visibility: visible;
        opacity: 1;
    }
`;

const getCountryName = (code) => {
    return countryNames[code] || 'Unknown';
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
                const placement = Number.isInteger(customPlacement)
                    ? customPlacement + index
                    : (player.placing != null 
                        ? player.placing 
                        : index + 1
                      );
                const displayPlacement = placement === 9999 ? '' : placement;
                let code = player.flag;
                if (code && !flags[code]) {
                    console.warn(`Unknown flag code "${code}" for player "${player.name}" (placing ${player.placing})`);
                }
                const imgSrc = code
                    ? (flags[code] || '')
                    : flags.unknown; 
                <img
                    className="flag-size"
                    src={imgSrc}
                    alt={code || "unknown"}
                />
                return (
                    <li key={`${player.name}-${index}`} className='player-list-hover'>
                        <div className='results-list-item'>
                            <div className='name-n-flag'>
                                <div className='player-placement'>
                                  {/* only show a number & dot if not blank */}
                                  {displayPlacement !== '' && `${displayPlacement}.`}
                                </div>
                                <div className="flag-container">
                                    <img 
                                        className='flag-size'
                                        src={imgSrc}
                                        alt="flag" 
                                    />
                                    <div className="flag-tooltip">
                                        {getCountryName(player.flag)}
                                    </div>
                                </div>
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
