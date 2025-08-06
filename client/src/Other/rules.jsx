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
            { text: '~ (confused Pokémon can NOT attempt to retreat again this turn)' },
            { text: 'Players CAN play multiple Stadium cards per turn.' },
            { text: '~ (Players CAN replace in-play Stadiums with Stadiums of the same name)' },
            { text: '~ (Stadium cards are considered Trainers)', paddingAfter: true },
        ],
        mechanics: {
            weakness: 'x2',
            resistance: '-30',
            sleep: {
                description: 'coin flip in between turns',
                details: [
                    '~ heads = awake',
                    '~ tails = remains asleep, Pokémon cannot retreat or attack until awake'
                ]
            },
            paralysis: 'Pokémon cannot retreat or attack until next turn',
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
            label: "Click here to download or print a PDF of 1999-2002's rules."
        }
    },
    {
        title: '2003 - 2004',
        paragraphs: [
            { text: 'Players flip coin <span class="highlight">BEFORE</span> setup - <span class="highlight">winner of flip chooses who goes first.</span>' },
            { text: 'For each mulligan, opponent may draw <span class="highlight">up to 1 card per mulligan,</span> as they occur.' },
            { text: '(if a player\'s opening hand contains only a Fossil(s) card, they may choose to mulligan)' },
            { text: 'Player going First:', paddingBefore: true },
            { text: '~ <span class="highlight">player does NOT draw a card to start their turn<s/span>' },
            { text: '~ <span class="highlight">player can NOT play Supporters</span>' },
            { text: '~ player CAN attack', paddingAfter: true },
            { text: '<span class="highlight">Players may use card effects to evolve Basic Pokémon on the first turn and or the turn they\'re played.</span>' },
            { text: 'Players can only retreat <span class="highlight">once</span> per turn.' },
            { text: '~ <span class="highlight">(coinflip no longer required to retreat confused Pokemon)</span>' },
            { text: 'Players <span class="highlight">can only play one</span> Stadium card per turn.' },
            { text: '~ (Players CAN replace in-play Stadiums with Stadiums of the same name)' },
            { text: '~ (Stadium cards are considered Trainers)', paddingAfter: true },
        ],
        mechanics: {
            weakness: 'x2',
            resistance: '-30',
            sleep: {
                description: 'coin flip in between turns',
                details: [
                    '~ heads = awake',
                    '~ tails = remains asleep, Pokémon cannot retreat or attack until awake'
                ]
            },
            paralysis: 'Pokémon cannot retreat or attack until next turn',
            poison: '1 damage counter between turns',
            confusion: {
                description: 'coin flip before attack',
                details: [
                    '~ heads = attack successful',
                    '~ tails = 30 dmg to self (weakness & resistance does NOT apply)'
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
            label: "Click here to download or print a PDF of 1999-2002's rules."
        }
    },
    {
        title: '2005',
        paragraphs: [
            { text: 'Players flip coin <span class="highlight">AFTER</span> setup - winner of flip chooses who goes first.' },
            { text: 'For each mulligan, opponent may draw up to 1 card per mulligan, as they occur.' },
            { text: '(if a player\'s opening hand contains only a Fossil(s) card, they may choose to mulligan)' },
            { text: 'Player going First:', paddingBefore: true },
            { text: '~ player does NOT draw a card to start their turn' },
            { text: '~ player can NOT play Supporters' },
            { text: '~ player CAN attack', paddingAfter: true },
            { text: 'Players may use card effects to evolve Basic Pokémon on the first turn and or the turn they\'re played.' },
            { text: 'Players can only play one Stadium card per turn' },
            { text: '~ (Players CAN replace in-play Stadiums with Stadiums of the same name)' },
            { text: '~ (Stadium cards are considered Trainers)', paddingAfter: true },
        ],
        mechanics: {
            weakness: 'x2',
            resistance: '-30',
            sleep: {
                description: 'coin flip in between turns',
                details: [
                    '~ heads = awake',
                    '~ tails = remains asleep, Pokémon cannot retreat or attack until awake'
                ]
            },
            paralysis: 'Pokémon cannot retreat or attack until next turn',
            poison: '1 damage counter between turns',
            confusion: {
                description: 'coin flip before attack',
                details: [
                    '~ heads = attack successful',
                    '~ tails = 30 dmg to self (weakness & resistance does NOT apply)'
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
            label: "Click here to download or print a PDF of 1999-2002's rules."
        }
    },
    {
        title: '2006',
        paragraphs: [
            { text: 'Players flip coin AFTER setup - winner of flip <span class="highlight">MUST go first</span>.' },
            { text: 'For each mulligan, opponent may draw up to 1 card per mulligan, as they occur.' },
            { text: '(if a player\'s opening hand contains only a Fossil(s) card, <span class="highlight">player MUST start with it</span>)' },
            { text: 'Player going First:', paddingBefore: true },
            { text: '~ player does NOT draw a card to start their turn' },
            { text: '~ player can NOT play Supporters' },
            { text: '~ player CAN attack', paddingAfter: true },
            { text: 'Players may use card effects to evolve Basic Pokémon on the first turn and or the turn they\'re played.' },
            { text: 'Players can only play one Stadium card per turn' },
            { text: '~ (Players <span class="highlight">CANNOT</span> replace in-play Stadiums with Stadiums of the same name)' },
            { text: '~ (Stadium cards are considered Trainers)', paddingAfter: true },
        ],
        mechanics: {
            weakness: 'x2',
            resistance: '-30',
            sleep: {
                description: 'coin flip in between turns',
                details: [
                    '~ heads = awake',
                    '~ tails = remains asleep, Pokémon cannot retreat or attack until awake'
                ]
            },
            paralysis: 'Pokémon cannot retreat or attack until next turn',
            poison: '1 damage counter between turns',
            confusion: {
                description: 'coin flip before attack',
                details: [
                    '~ heads = attack successful',
                    '~ tails = 30 dmg to self (weakness & resistance does NOT apply)'
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
            label: "Click here to download or print a PDF of 1999-2002's rules."
        }
    },
    {
        title: '2007 - 2010',
        paragraphs: [
            { text: 'Players flip coin AFTER setup - winner of flip MUST go first.' },
            { text: 'For each mulligan, opponent may draw up to 1 card per mulligan, as they occur.' },
            { text: '(if a player\'s opening hand contains only a Fossil(s) card, player MUST start with it)' },
            { text: 'Player going First:', paddingBefore: true },
            { text: '~ <span class="highlight">player draws a card to start their turn</span>' },
            { text: '~ player can NOT play <span class="highlight">Supporters, Stadiums, nor Trainers</span>' },
            { text: '~ player CAN attack', paddingAfter: true },
            { text: 'Players may use card effects to evolve Basic Pokémon on the first turn and or the turn they\'re played.' },
            { text: 'Players can only play one Stadium card per turn' },
            { text: '~ (Players CANNOT replace in-play Stadiums with Stadiums of the same name)' },
            { text: '~ (Stadiums are <span class="highlight">NOT considered Trainers</span>)', paddingAfter: true },
        ],
        mechanics: {
            btwinfo: 'Weakness & Resistance specified on cards, otherwise:',
            weakness: 'x2',
            resistance: '-30',
            sleep: {
                description: 'coin flip in between turns',
                details: [
                    '~ heads = awake',
                    '~ tails = remains asleep, Pokémon cannot retreat or attack until awake'
                ]
            },
            paralysis: 'Pokémon cannot retreat or attack until next turn',
            poison: '1 damage counter between turns',
            confusion: {
                description: 'coin flip before attack',
                details: [
                    '~ heads = attack successful',
                    '~ tails = 30 dmg to self (weakness & resistance does NOT apply)'
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
            label: "Click here to download or print a PDF of 1999-2002's rules."
        }
    },
    {
        title: '2011 - 2013',
        paragraphs: [
            { text: 'Players flip coin AFTER setup - winner of flip MUST go first.' },
            { text: 'For each mulligan, opponent may draw up to 1 card per mulligan, as they occur.' },
            { text: '(if a player\'s opening hand contains only a Fossil(s) card, player MUST start with it)' },
            { text: 'Player going First:', paddingBefore: true },
            { text: '~ <span class="highlight">player draws a card to start their turn</span>' },
            { text: '~ player can NOT play <span class="highlight">Supporters, Stadiums, nor Trainers</span>' },
            { text: '~ player CAN attack', paddingAfter: true },
            { text: 'Players may use card effects to evolve Basic Pokémon on the first turn and or the turn they\'re played.' },
            { text: 'Players can only play one Stadium card per turn' },
            { text: '~ (Players CANNOT replace in-play Stadiums with Stadiums of the same name)' },
            { text: '~ (Stadiums are <span class="highlight">NOT considered Trainers</span>)', paddingAfter: true },
        ],
        mechanics: {
            btwinfo: 'Weakness & Resistance specified on cards, otherwise:',
            weakness: 'x2',
            resistance: '-30',
            sleep: {
                description: 'coin flip in between turns',
                details: [
                    '~ heads = awake',
                    '~ tails = remains asleep, Pokémon cannot retreat or attack until awake'
                ]
            },
            paralysis: 'Pokémon cannot retreat or attack until next turn',
            poison: '1 damage counter between turns',
            confusion: {
                description: 'coin flip before attack',
                details: [
                    '~ heads = attack successful',
                    '~ tails = 30 dmg to self (weakness & resistance does NOT apply)'
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
            label: "Click here to download or print a PDF of 1999-2002's rules."
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
                <p><span class="highlight">Highlighted</span> text implies rule change from the previous era</p>
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
                                            <span dangerouslySetInnerHTML={{ __html: par.text }} />
                                        </li>
                                    ))}
                                </ul>
                                <hr className="weakness-hr" />
                                <div className="center-rules" style={{ textAlign: 'center' }}>
                                    {era.mechanics.btwinfo && <p className="italic highlight" style={{ margin: '0.5em 0' }}>{era.mechanics.btwinfo}</p>}
                                    <p>&nbsp;<strong>•</strong> &nbsp;Weakness:&nbsp;&nbsp;{era.mechanics.weakness}</p>
                                    <p>&nbsp;<strong>•</strong> &nbsp;Resistance:&nbsp;&nbsp;{era.mechanics.resistance}</p>
                                    <p className="reg-txt"><span className="material-symbols-outlined fun-condition-icon sleep-condition">snooze</span> Asleep: {era.mechanics.sleep.description}</p>
                                    <ul className="sub-list">
                                        {era.mechanics.sleep.details.map((d, j) => (
                                            <li key={j} className="reg-txt indent">{d}</li>
                                        ))}
                                    </ul>
                                    <p><span className="material-symbols-outlined fun-condition-icon paralyzed-condition">flash_off</span> Paralysis: {era.mechanics.paralysis}</p>
                                    <p className="reg-txt"><span className="material-symbols-outlined fun-condition-icon confused-condition">psychology_alt</span> Confusion: {era.mechanics.confusion.description}</p>
                                    <ul className="sub-list">
                                        {era.mechanics.confusion.details.map((d, j) => (
                                            <li key={j} className="reg-txt indent">{d}</li>
                                        ))}
                                    </ul>
                                    <p className="reg-txt"><span className="material-symbols-outlined fun-condition-icon burned-condition">mode_heat</span> Burn: {era.mechanics.burn.description}</p>
                                    <ul className="sub-list">
                                        {era.mechanics.burn.details.map((d, j) => (
                                            <li key={j} className="reg-txt indent">{d}</li>
                                        ))}
                                    </ul>
                                    <p><span className="material-symbols-outlined fun-condition-icon poisoned-condition">skull</span> Poison: {era.mechanics.poison}</p>
                                    {/* <a
                                        className="a-new-color center"
                                        href={era.pdf.href}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="material-symbols-outlined">
                                            sim_card_download
                                        </span>
                                        <span>{era.pdf.label}</span>
                                    </a> */}
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