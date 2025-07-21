

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
                label: "Alakazam Fighting",
                sprite1: "alakazam",
                sprite2: "onix",
                source: "Enigma",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Alakazam Gyarados",
                sprite1: "alakazam",
                sprite2: "gyarados",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-gyarados',
            },
            {
                label: "Arcanine Charizard",
                sprite1: "arcanine",
                sprite2: "charizard",
                source: "Unknown",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/arcanine-charizard',
            },
            {
                label: "Arcanine Electrode",
                sprite1: "arcanine",
                sprite2: "electrode",
                source: "@BeebeTCG",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/arcanine-electrode',
            },
            {
                label: "Beedrill",
                sprite1: "blank",
                sprite2: "beedrill",
                source: "Enigma",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/beedrill-1',
            },
            {
                label: "Buzzapdos",
                sprite1: "zapdos",
                sprite2: "electrode",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/buzzapdos-1',
            },
            {
                label: "Fighting Basics",
                sprite1: "hitmonchan",
                sprite2: "machop",
                source: "Grandrew",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/fighting-basics',
            },
            {
                label: "Haymaker",
                sprite1: "hitmonchan",
                sprite2: "electabuzz",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/haymaker-1',
            },
            {
                label: "Machamp Alakazam",
                sprite1: "machamp",
                sprite2: "alakazam",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/machamp-alakazam',
            },
            {
                label: "Rain Dance",
                sprite1: "blastoise",
                sprite2: "gyarados",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/rain-dance',
            },
        ],
    },
    {
        year: '1999',
        format: 'Base Set - Jungle',
        decks: [
            {
                label: "Alakazam Mr. Mime",
                sprite1: "alakazam",
                sprite2: "mr-mime",
                source: "PTCGArchive",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Clefable Electabuzz",
                sprite1: "clefable",
                sprite2: "electabuzz",
                source: "PTCGArchive",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Clefable Hitmonchan",
                sprite1: "clefable",
                sprite2: "hitmonchan",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Haymaker",
                sprite1: "hitmonchan",
                sprite2: "scyther",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Haymaker Rapidash",
                sprite1: "hitmonchan",
                sprite2: "rapidash",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Hitmonchan Charmander",
                sprite1: "hitmonchan",
                sprite2: "charmander",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Hitmonchan Mr. Mime",
                sprite1: "hitmonchan",
                sprite2: "mr-mime",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Lickitung Stall",
                sprite1: "blank",
                sprite2: "lickitung",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Mr. Mime Electabuzz",
                sprite1: "mr-mime",
                sprite2: "electabuzz",
                source: "PTCGArchive",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "The Cleaner 2",
                sprite1: "jigglypuff",
                sprite2: "arcanine",
                source: "\"I-Man\" Henry-Michael Brown",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Venusaur",
                sprite1: "venusaur",
                sprite2: "kangaskhan",
                source: "PTCGArchive",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
            {
                label: "Wigglytuff",
                sprite1: "blank",
                sprite2: "wigglytuff",
                source: "Jason Klaczynski's Blog",
                deckListLink: '/tournaments/FEATURED_BS/decksbyera/alakazam-fighting',
            },
        ],
    },
];
// {
//     label: "eee",
//     sprite1: "eee",
//     sprite2: "eee",
//     source: "eee",
//     deckListLink: '/tournaments/FEATURED_BS/decksbyera/eeeeeee',
// },


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
    const [selectedFormat, setSelectedFormat] = React.useState(''); // State for selected format
    const navigate = useNavigate();

    const getSourceLink = (source) => {
        switch (source) {
            case 'Jason Klaczynski\'s Blog':
                return 'https://jklaczpokemon.com';
            case 'PTCGArchive':
                return 'https://ptcgarchive.com';
            default:
                return null;
        }
    };

    const filteredDecksByFormat = featuredDecksByFormat.map(formatObj => ({
        ...formatObj,
        decks: formatObj.decks.filter(deck =>
            deck.label.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(deck => ({
            ...deck,
            sourceLink: getSourceLink(deck.source)
        }))
    }));

    const setSortByFormat = () => {
        navigate('/decks');
    };

    const filteredFormats = selectedFormat
    ? filteredDecksByFormat.filter(format => format.format === selectedFormat)
    : filteredDecksByFormat;

    const sortedDecksByFormat = sortOrder === 'asc' ? [...filteredFormats].reverse() : filteredFormats;

    const resetFilters = () => {
        setSortOrder('desc');
        setSearchTerm('');
        setSelectedFormat(''); // Reset the selected format
    };

    return (
        <DeckListContainer theme={theme} className='center-me'>
            <Helmet>
                <title>Featured Decks by Era</title>
            </Helmet>
            <div className='player-results-container'>
                <div className='completed-n-upcoming'>
                    <div className='bts-in'>
                        <a onClick={setSortByFormat} className={`completed-btn inactive-evt-btn`}>Event Results</a>
                        <a className={`upcoming-btn active-evt-btn`}>Decks by Era</a>
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
                            <p className='sort-events'>Format:</p>
                            <select
                                value={selectedFormat}
                                onChange={e => setSelectedFormat(e.target.value)}
                            >
                                <option value="">All Formats</option>
                                {featuredDecksByFormat.map(format => (
                                    <option key={format.format} value={format.format}>
                                        {format.year} - {format.format}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                            return (
                                            <tr key={index} className='deck-table'>
                                                <td>
                                                {deck.sprite1 && deck.sprite1 !== 'blank' ? (
                                                    <img 
                                                    src={`/assets/sprites/${deck.sprite1}.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: '55px' }}
                                                    />
                                                ) : (
                                                    <img 
                                                    src={`/assets/sprites/blank.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: '55px' }}
                                                    />
                                                )}
                                                </td>
                                                <td>
                                                {deck.sprite2 && deck.sprite2 !== 'blank' ? (
                                                    <img className='movesecondspritedecks'
                                                    src={`/assets/sprites/${deck.sprite2}.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: '55px' }}
                                                    />
                                                ) : (
                                                    <img 
                                                    src={`/assets/sprites/blank.png`} 
                                                    alt={`${deck.label} sprite`} 
                                                    style={{width: '55px' }}
                                                    />
                                                )}
                                                </td>
                                                <td>{deck.label}</td>
                                                <td className='fontsource'>
                                                    {deck.sourceLink ? (
                                                        <a href={deck.sourceLink} target="_blank" className='blue' rel="noopener noreferrer">
                                                            {deck.source}
                                                        </a>
                                                    ) : (
                                                        deck.source
                                                    )}
                                                </td>
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


