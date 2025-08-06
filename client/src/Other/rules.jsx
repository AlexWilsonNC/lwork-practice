import React, { useState } from 'react';
import '../css/rules.css';
import styled from 'styled-components';

const RulesByEraComponent = styled.div`
    background-color: ${({ theme }) => theme.loginbg};
    min-height: 60vh;
    color: ${({ theme }) => theme.text};
    .era-header {
        color: ${({ theme }) => theme.text};
    }
    .era-header {
        background-color: ${({ theme }) => theme.dropdownsbg};
    }
    .no-bullet {
        list-style-type: none;
    }
    .indent {
        padding-left: 15px;
    }
`;

const ERA_RULES = [
    {
        title: '1999 - 2002',
        imgSrc: '/assets/sets/wotc.png',
        imgAlt: 'Wizards of the Coast logo',
        imgClass: 'wotc111',
        paragraphs: [
            { text: 'Players flip coin AFTER setup - winner of flip MUST go first.' },
            { text: 'For each mulligan, opponent may draw up to 2 cards per mulligan, as they occur.' },
            { text: '(if a player\'s opening hand contains only a Fossil(s) card, they may choose to mulligan)' },
            { text: 'Player going First:', paddingBefore: true },
            { text: '~ player draws a card to start their turn' },
            { text: '~ player has no Turn 1 restrictions' },
            { text: '~ player CAN attack', paddingAfter: true },
            { text: 'Players may retreat as many times per turn as they choose.' },
            { text: 'If player\'s Pokémon is confused & wants to retreat: pay retreat cost (first), then flip a coin.' },
            { text: '~ If Heads: proceed with retreat' },
            { text: '~ If Tails: retreat fails, leaving Pokémon confused and remaining Active' },
            { text: '~ (confused Pokémon can NOT attempt to retreat again this turn)', paddingAfter: true },
            { text: 'Players CAN play multiple Stadium cards per turn. (Including Stadiums of the same name)' },
            { text: '~ (\"Stadiums\" are simply Trainers)', paddingAfter: true },
        ],
        mechanics: {
            weakness: 'x2',
            resistance: '-30',
            poison: '1 damage counter between turns',
            confusion: {
                description: 'coin flip before attack',
                details: [
                    '~ heads = attack successful',
                    '~ tails = 20 dmg to self (weakness & resistance applies)'
                ]
            },
            burn: {
                description: 'coin flip between turns',
                details: [
                    '~ heads = no damage, but Pokémon remains burned',
                    '~ tails = 2 damage counters and Pokémon remains burned'
                ]
            }
        },
        pdf: {
            href: '/assets/99-03-rules.pdf',
            label: "Click here to open PDF of 1999-2002's rules."
        }
    },
    {
        title: '2003 - 2004',
        imgSrc: '/assets/sets/ex1-ruby-sapphire.png',
        imgAlt: 'Ruby & Sapphire era',
        imgClass: 'rs11',
        paragraphs: [
            'Players flip coin BEFORE setup - winner of flip chooses who goes first.',
            'For each mulligan, opponent may draw up to 1 card per mulligan, as they occur.',
            '(if a player\'s opening hand contains only a Fossil(s) card, they may choose to mulligan)',
            'Player going First:',
            '~ player does NOT draw a card to start their turn',
            '~ player can NOT play Supporters',
            '~ player CAN attack',
            'Players may use card effects to evolve Basic Pokémon on the first turn and or the turn they\'re played.',
            'Players can only retreat once per turn.',
            '(coinflip no longer required to retreat confused Pokemon)',
            'Players can only play one Stadium card per turn. (Players CAN replace in-play Stadiums with Stadiums of the same name)',
        ],
        mechanics: {
            weakness: 'x2',
            resistance: '-30',
            poison: '1 damage counter between turns',
            confusion: '30 dmg (weakness & resistance does NOT apply)',
            burn: 'coin flip between turns',
        },
        pdf: {
            href: '/assets/04-rules.pdf',
            label: "Click here to download or print a PDF version of 2003-2004's rules."
        }
    },
];

const RulesByEra = () => {
    const [openStates, setOpenStates] = useState(ERA_RULES.map(() => false));

    const toggleEra = index => {
        setOpenStates(states =>
            states.map((open, i) => (i === index ? !open : open))
        );
    };

    return (
        <RulesByEraComponent>
            <div className="center-column">
                <h2 className="doofus">Rules by Era</h2>
            </div>

            {ERA_RULES.map((era, idx) => (
                <div className="collapse-bts" key={era.title}>
                    <button
                        type="button"
                        className={`era-header ${idx % 2 === 0 ? 'collapsible2' : 'collapsible3'}`}
                        onClick={() => toggleEra(idx)}
                    >
                        <div className='era-rules-side'>
                            <div className="era-rule-title">
                                <p>{era.title}</p>
                            </div>
                            <span className="material-symbols-outlined">
                                {openStates[idx] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                            </span>
                        </div>

                        {openStates[idx] && (
                            <div className="era-specific-rules">
                                <br />
                                <ul>
                                    {era.paragraphs.map((par, i) => (
                                        <li
                                            key={i}
                                            className={`reg-txt${par.paddingBefore ? ' padding-top' : ''}${par.paddingAfter ? ' padding-bottom' : ''}${par.text.startsWith('~') ? ' no-bullet indent' : ''}`}
                                        >
                                            {par.text}
                                        </li>
                                    ))}
                                </ul>
                                <hr className="weakness-hr" />
                                <div className="center-rules" style={{ textAlign: 'center' }}>
                                    <p>• Weakness:&nbsp;&nbsp;{era.mechanics.weakness}</p>
                                    <p>• Resistance:&nbsp;&nbsp;{era.mechanics.resistance}</p>
                                    <p>• Poison: {era.mechanics.poison}</p>
                                    <p className="reg-txt">• <span>Confusion</span>: {era.mechanics.confusion.description}</p>
                                    <ul className="sub-list">
                                        {era.mechanics.confusion.details.map((d, j) => (
                                            <li key={j} className="reg-txt indent">{d}</li>
                                        ))}
                                    </ul>
                                    <p className="reg-txt">• <span>Burn</span>: {era.mechanics.burn.description}</p>
                                    <ul className="sub-list">
                                        {era.mechanics.burn.details.map((d, j) => (
                                            <li key={j} className="reg-txt indent">{d}</li>
                                        ))}
                                    </ul>
                                    <a
                                        className="a-new-color center"
                                        href={era.pdf.href}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span class="material-symbols-outlined">
                                            sim_card_download
                                        </span>
                                        <span>{era.pdf.label}</span>
                                    </a>
                                </div>
                                <br />
                            </div>
                        )}
                    </button>
                </div>
            ))}
        </RulesByEraComponent>
    );
};

export default RulesByEra;