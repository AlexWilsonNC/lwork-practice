

import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/players.css';
import '../css/deckspage.css';

const featuredDecksByFormat = [
    {
        year: '1999',
        format: 'Base Set',
        decks: [
            {
                label: 'Alakazam Fighting',
                sprite1: 'alakazam',
                sprite2: 'onix',
                source: 'Enigma',
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
        ],
    },
    // {
    //     format: '2001',
    //     decks: [
    //         {
    //             label: 'Slowking',
    //             sprite1: 'scyther',
    //             sprite2: 'slowking',
    //             source: 'John Doe',
    //             deckListLink: '/deck/haymaker-world-championship-john-doe',
    //         },
    //     ],
    // },
];


const DeckListContainer = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  .results-table td a {
    color: ${({ theme }) => theme.text};
  }
  .results-table td:nth-child(3) {
    text-align: center;
  }
  .results-table td a:hover {
    color: #1290eb;
  }
  .filter-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    select {background: ${({ theme }) => theme.body};}
    select {color: ${({ theme }) => theme.text};}
    button {background: ${({ theme }) => theme.body};}
    button {color: ${({ theme }) => theme.text};}
  }
  .sort-events {
    color: ${({ theme }) => theme.text};
  }
  .spinner {
    border-left-color: ${({ theme }) => theme.spinner};
  }
  .search-input .searcheventsfield {
    background: ${({ theme }) => theme.searchBg};
    color: ${({ theme }) => theme.searchTxt};
  }
  .filter-container .sort-events {
    color: ${({ theme }) => theme.text};
  }
  .paddingfive {
    height: 27px !important;
  }
`;

const FormatSeparator = styled.tr`
  background-color: #1291eba4 !important;
  color: white !important;
  font-weight: bold;
  text-align: left;
  @media screen and (max-width: 950px) {
    .paddingfive {
        height: 28px !important;
    }
  }
  @media screen and (max-width: 450px) {
    .paddingfive {
        height: 20px !important;
    }
  }
`;

const FeaturedDecks = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState('desc');
    const navigate = useNavigate();

    const filteredDecksByFormat = featuredDecksByFormat.map(formatObj => ({
        ...formatObj,
        decks: formatObj.decks.filter(deck =>
            deck.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }));

    const setSortByFormat = () => {
        navigate('/decks');
    };

    const sortedDecksByFormat = sortOrder === 'asc' ? [...filteredDecksByFormat].reverse() : filteredDecksByFormat;

    const resetFilters = () => {
        setSortOrder('desc');
        setSearchTerm('');
    };

    return (
        <DeckListContainer theme={theme} className='center-me'>
            <Helmet>
                <title>Featured Decks by Era</title>
            </Helmet>
            <div className='player-results-container'>
                <div className='completed-n-upcoming'>
                    <div className='bts-in'>
                        <a onClick={setSortByFormat} className={`completed-btn inactive-evt-btn`}>Decks by Event Results</a>
                        <a className={`upcoming-btn active-evt-btn`}>Featured Decks by Era</a>
                    </div>
                    <div className='search-input'>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            className='searcheventsfield'
                            placeholder="Search decks..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className='filter-container'>
                    <div className='filters-top'>
                        <div className='indiv-filter'>
                            <p className='sort-events'>Order:</p>
                            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                <option value="asc">Oldest - Newest</option>
                                <option value="desc">Newest - Oldest</option>
                            </select>
                        </div>
                        <button onClick={resetFilters} className="reset-btn">Reset</button>
                    </div>
                </div>
                <table className='results-table featured-decks-table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Deck</th>
                            <th>Source</th>
                            <th>Decklist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDecksByFormat.map(formatObj => (
                            formatObj.decks.length > 0 && (
                                <React.Fragment key={formatObj.format}>
                                    <FormatSeparator>
                                        <td colSpan="6" className='paddingfive'>
                                        {formatObj.year} &nbsp;-&nbsp; {formatObj.format}
                                        </td>
                                    </FormatSeparator>
                                    {
                                        formatObj.decks.map((deck, index) => {
                                            const spriteFolder = formatObj.year === '1999' ? 'assets/sprites-gen1' : 'assets/sprites';
                                            const spriteWidth = formatObj.year === '1999' ? '33px' : '55px';
                                            return (
                                            <tr key={index} className='deck-table'>
                                                <td>
                                                {deck.sprite1 && deck.sprite1 !== 'blank' ? (
                                                    <img 
                                                    src={`/${spriteFolder}/${deck.sprite1}.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: spriteWidth }}
                                                    />
                                                ) : (
                                                    <img 
                                                    src={`/${spriteFolder}/blank.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: spriteWidth }}
                                                    />
                                                )}
                                                </td>
                                                <td>
                                                {deck.sprite2 && deck.sprite2 !== 'blank' ? (
                                                    <img
                                                    // <img className='movesecondspritedecks'
                                                    src={`/${spriteFolder}/${deck.sprite2}.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: spriteWidth }}
                                                    />
                                                ) : (
                                                    <img 
                                                    src={`/${spriteFolder}/blank.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: spriteWidth }}
                                                    />
                                                )}
                                                </td>
                                                <td>{deck.label}</td>
                                                <td>{deck.source}</td>
                                                <td>
                                                    <Link to={deck.deckListLink}>
                                                        <span className="material-symbols-outlined">format_list_bulleted</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </DeckListContainer>
    );
};

export default FeaturedDecks;


