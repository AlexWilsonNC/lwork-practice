import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../css/eventpage.css';
import { displayResults } from './event-results';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import DisplayPokemonSprites, { getPokemonSprites } from './pokemon-sprites';
import { getCustomLabel } from './pokemon-labels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

import regional25 from '../assets/event-logo/regionals-2025.png';
import regionals from '../assets/event-logo/regionals-hd.png';
import internats25 from '../assets/event-logo/internats-2025.png';
import speSeries from '../assets/event-logo/spe.png';
import worlds from '../assets/event-logo/worlds-hd.png';
import malaysiaChampionships from '../assets/event-logo/ch-malaysia.png';
import hongkongChampionships from '../assets/event-logo/ch-hongkong.png';
import indonesiaChampionships from '../assets/event-logo/ch-indonesia.png';
import philippenesChampionships from '../assets/event-logo/ch-philippenes.png';
import singaporeChampionships from '../assets/event-logo/ch-singapore.png';
import taiwanChampionships from '../assets/event-logo/ch-taiwan.png';
import thailandChampionships from '../assets/event-logo/ch-thailand.png';
import japanChampionships from '../assets/event-logo/jp-nationals.png';
import ogInternats from '../assets/event-logo/internats-logo-hd.png';
import koreaLeague from '../assets/event-logo/korean-league.png';
import wotcWorlds from '../assets/event-logo/worlds-2002.png';
import worldsOten from '../assets/event-logo/2010worlds.png';
import worldsOnine from '../assets/event-logo/2009worlds.jpg';
import worldsOeight from '../assets/event-logo/2008worlds.png';
import worldsOSeven from '../assets/event-logo/2007worlds.png';
import worldsOsix from '../assets/event-logo/2006worlds.png';
import worldsOfive from '../assets/event-logo/2005worlds.png';
import worldsOfour from '../assets/event-logo/2004worlds.png';
import nationals from '../assets/event-logo/nats-hd.png';
import oldNationals from '../assets/event-logo/old-nats-logo-hd.png';
import oFourNationals from '../assets/event-logo/nats-logo-04-hd.png';
import retro from '../assets/event-logo/retro.png';
import stadiumChallenge from '../assets/event-logo/stadium-challenge-wotc.png';
import fourStadiumChallenge from '../assets/event-logo/old-stadium-challenge.png';
import superTrainerShowdown from '../assets/event-logo/super-trainer-showdown-logo.png';
import megaTropicalBattle from '../assets/event-logo/mega-tropical-battle.png';
import championsLeague from '../assets/event-logo/champions-league.png';

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
import dominicanRepublic from '../assets/flags/dominican-republic.png';
import ecuador from '../assets/flags/ecuador.png';
import elSalvador from '../assets/flags/el-salvador.png';
import finland from '../assets/flags/finland.png';
import france from '../assets/flags/france.png';
import germany from '../assets/flags/germany.png';
import hongKong from '../assets/flags/hong-kong.png';
import indonesia from '../assets/flags/indonesia.png';
import italy from '../assets/flags/italy.png';
import japan from '../assets/flags/japan.png';
import southKorea from '../assets/flags/korea.png';
import malaysia from '../assets/flags/malaysia.png';
import mexico from '../assets/flags/mexico.png';
import netherlands from '../assets/flags/netherlands.png';
import newZealand from '../assets/flags/new-zealand.png';
import norway from '../assets/flags/norway.png';
import peru from '../assets/flags/peru.png';
import philippines from '../assets/flags/philippines.png';
import poland from '../assets/flags/poland.png';
import portugal from '../assets/flags/portugal.png';
import puertoRico from '../assets/flags/puerto-rico.png';
import russia from '../assets/flags/russia.png';
import singapore from '../assets/flags/singapore.png';
import slovakia from '../assets/flags/slovakia.png';
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
    usa: usa,
    italy: italy,
    southAfrica: southAfrica,
    indonesia: indonesia,
    japan: japan,
    mexico: mexico,
    peru: peru,
    philippines: philippines,
    chile: chile,
    singapore: singapore,
    colombia: colombia,
    sweden: sweden,
    thailand: thailand,
    puertoRico: puertoRico,
    southKorea: southKorea,
    argentina: argentina,
    australia: australia,
    austria: austria,
    belarus: belarus,
    belgium: belgium,
    brazil: brazil,
    canada: canada,
    china: china,
    croatia: croatia,
    czechia: czechia,
    denmark: denmark,
    dominicanRepublic: dominicanRepublic,
    ecuador: ecuador,
    elSalvador: elSalvador,
    finland: finland,
    france: france,
    germany: germany,
    hongKong: hongKong,
    malaysia: malaysia,
    netherlands: netherlands,
    newZealand: newZealand,
    norway: norway,
    poland: poland,
    portugal: portugal,
    russia: russia,
    singapore: singapore,
    slovakia: slovakia,
    spain: spain,
    switzerland: switzerland,
    taiwan: taiwan,
    uk: uk,
    unknown: unknown,
};

const logos = {
    retro: retro,
    regionals: regionals,
    speSeries: speSeries,
    ogInternats: ogInternats,
    worlds: worlds,
    indonesiaChampionships: indonesiaChampionships,
    japanChampionships: japanChampionships,
    philippenesChampionships: philippenesChampionships,
    thailandChampionships: thailandChampionships,
    singaporeChampionships: singaporeChampionships,
    koreaLeague: koreaLeague,
    regional25: regional25,
    internats25: internats25,
    malaysiaChampionships: malaysiaChampionships,
    hongkongChampionships: hongkongChampionships,
    taiwanChampionships: taiwanChampionships,
    wotcWorlds: wotcWorlds,
    nationals: nationals,
    worldsOten: worldsOten,
    worldsOnine: worldsOnine,
    worldsOeight: worldsOeight,
    worldsOSeven: worldsOSeven,
    worldsOsix: worldsOsix,
    worldsOfive: worldsOfive,
    worldsOfour: worldsOfour,
    oldNationals: oldNationals,
    oFourNationals: oFourNationals,
    stadiumChallenge: stadiumChallenge,
    fourStadiumChallenge: fourStadiumChallenge,
    superTrainerShowdown: superTrainerShowdown,
    megaTropicalBattle: megaTropicalBattle,
    championsLeague: championsLeague,
};

const EventPageContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.body};
  .event-option:hover {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
  }
  .active-option {
    background: ${({ theme }) => theme.body};
  }
  .results-list-item {
    color: ${({ theme }) => theme.text};
  }
  .player-list-hover:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.playerlisthover};
  }
  .filter-container {
    margin-top: -15px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    select {background: ${({ theme }) => theme.body};}
    select {color: ${({ theme }) => theme.text};}
    button {background: ${({ theme }) => theme.body};}
    button {color: ${({ theme }) => theme.text};}
  }
  .spinner {
    margin-top: 25px;
    border-left-color: ${({ theme }) => theme.spinner};
  }
  .notavailable,
  .chart-bold,
  .active-option,
  h3 {
    color: ${({ theme }) => theme.text};
  }
  .chart-description {
      color: ${({ theme }) => theme.chartdescrip};
  }
  .day1btn, .day2btn, .conversbtn {
    background-color: ${({ theme }) => theme.day1btn};
  }
  .chart-button.active {
    background-color: #1290eb;
  }
  @media screen and (max-width: 1115px) {
    .filters-top {
        margin-top: 15px;
        margin-left: 0px !important;
    }
    .indiv-filter select {
        width: 150px;
    }
    .indiv-filter select {
        width: 175px;
        height: 24px;
        font-size: 12px;
        margin-top: 5px;
    }
  }
`;

const EventPage = () => {
    const { theme } = useTheme();
    const { eventId, division: divisionParam } = useParams();
    const [eventData, setEventData] = useState(null);
    const [division, setDivision] = useState('masters');
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem(`activeTab_${eventId}`) || 'Results');
    const chartRef = useRef(null);
    const [showDayOneMeta, setShowDayOneMeta] = useState(false);
    const [showConversionRate, setShowConversionRate] = useState(false);
    const [selectedArchetype, setSelectedArchetype] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `https://ptcg-legends-6abc11783376.herokuapp.com/events/${eventId}`
            );
            if (response.ok) {
                const data = await response.json();
                setEventData(data);
            } else {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, [eventId]);

    useEffect(() => {
        if (divisionParam) {
            setDivision(divisionParam);
        }
    }, [divisionParam]);

    useEffect(() => {
        sessionStorage.setItem(`activeTab_${eventId}`, activeTab);
    }, [activeTab, eventId]);

    useEffect(() => {
        setShowDayOneMeta(false);
        setShowConversionRate(false);
    }, [division]);

    if (!eventData) {
        return (
            <EventPageContent className='center' theme={theme}>
                <div className="spinner"></div>
            </EventPageContent>
        );
    }

    const mastersResults = eventData?.masters || [];
    const seniorsResults = eventData?.seniors || [];
    const juniorsResults = eventData?.juniors || [];
    const professorsResults = eventData?.professors || [];
    const olderSeniorsResults = eventData?.olderSeniors || [];
    const youngSeniorsResults = eventData?.youngSeniors || [];
    const allResults = eventData?.all || [];

    const results =
        division === 'masters'
            ? mastersResults
            : division === 'seniors'
                ? seniorsResults
                : division === 'juniors'
                    ? juniorsResults
                    : division === 'professors'
                        ? professorsResults
                        : division === 'olderSeniors'
                            ? olderSeniorsResults
                            : division === 'youngSeniors'
                                ? youngSeniorsResults
                                : division === 'all'
                                    ? allResults
                                    : [];

    const chartResults =
        eventId === '2018_NAIC' && division === 'masters'
            ? mastersResults.slice(0, 64)
            : results;

    const getPlayerCount = (division) => {
        switch (division) {
            case 'masters':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneMasters}
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                    </>
                );
            case 'all':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                {eventData.dayOneMasters} Players
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                    </>
                );
            case 'professors':
                return (
                    <>
                        {eventData?.dayOneMasters && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneMasters}
                            </p>
                        )}
                        {eventData?.dayTwoMasters && (
                            <p>
                                <strong>Day 2:</strong> {eventData.dayTwoMasters}
                            </p>
                        )}
                    </>
                );
            case 'seniors':
                return (
                    <>
                        {eventData?.dayOneSeniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneSeniors}
                            </p>
                        )}
                    </>
                );
            case 'juniors':
                return (
                    <>
                        {eventData?.dayOneJuniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneJuniors}
                            </p>
                        )}
                    </>
                );
            case 'olderSeniors':
                return (
                    <>
                        {eventData?.dayOneSeniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneSeniors}
                            </p>
                        )}
                    </>
                );
            case 'youngSeniors':
                return (
                    <>
                        {eventData?.dayOneJuniors && (
                            <p>
                                <strong>Day 1:</strong> {eventData.dayOneJuniors}
                            </p>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const getEventFormat = (division) => {
        if (division === 'professors' && eventData?.formatProfessors) {
            return eventData.formatProfessors;
        }
        return eventData?.format;
    };

    if (!eventData) {
        return;
    }

    const isMastersEmpty = mastersResults.length === 0;
    const otherDivisionsHaveResults =
        seniorsResults.length > 0 ||
        juniorsResults.length > 0 ||
        professorsResults.length > 0;

    const deckTypeCount = chartResults.reduce((acc, player) => {
        let sprite1 = player.sprite1 || '';
        let sprite2 = player.sprite2 || '';

        if (!sprite1 && !sprite2) {
            const { firstSprite, secondSprite } = getPokemonSprites(player.decklist, '', '');
            sprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
            sprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
        }

        if (sprite2 === 'hyphen') return acc;

        let key;
        let spriteToShow;

        if (sprite1 !== 'blank' && sprite1) {
            key = getCustomLabel(eventId, sprite1, sprite2);
            spriteToShow = sprite1;
        } else if (sprite2 !== 'blank' && sprite2) {
            key = getCustomLabel(eventId, '', sprite2);
            spriteToShow = sprite2;
        } else {
            return acc;
        }

        if (!acc[key]) {
            acc[key] = { count: 0, sprite: spriteToShow };
        }
        acc[key].count += 1;

        return acc;
    }, {});

    const deckTypeCountArray = Object.entries(deckTypeCount)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => b.count - a.count);

    const dayOneData = eventData.dayOneMeta || [];
    const dayTwoData = chartResults;

    const combinedData = dayOneData.reduce((acc, dayOneDeck) => {
        const dayOneLabel = getCustomLabel(eventId, dayOneDeck.sprite1, dayOneDeck.sprite2);

        const dayTwoDeck = dayTwoData.find(dayTwoDeck => {
            const { firstSprite, secondSprite } = getPokemonSprites(dayTwoDeck.decklist, '', '');
            const normalizedSprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
            const normalizedSprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '');

            const dayTwoLabel = getCustomLabel(eventId, normalizedSprite1, normalizedSprite2);
            return dayOneLabel === dayTwoLabel;
        });

        if (dayTwoDeck) {
            const dayTwoCount = dayTwoData.filter(dayTwoDeck => {
                const { firstSprite, secondSprite } = getPokemonSprites(dayTwoDeck.decklist, '', '');
                const normalizedSprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '');
                const normalizedSprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '');

                const dayTwoLabel = getCustomLabel(eventId, normalizedSprite1, normalizedSprite2);
                return dayTwoLabel === dayOneLabel;
            }).length;

            acc.push({
                label: dayOneLabel,
                conversionRate: ((dayTwoCount / dayOneDeck.deckcount) * 100).toFixed(2),
            });
        } else {
            acc.push({
                label: dayOneLabel,
                conversionRate: '0.00%',
            });
        }

        return acc;
    }, []);

    const conversionChartData = {
        labels: combinedData.map(data => data.label),
        datasets: [
            {
                label: 'Conversion Rate (%)',
                data: combinedData.map(data => data.conversionRate),
                backgroundColor: '#1291eb8b'
            }
        ]
    };


    const handleDayOneClick = () => {
        setShowDayOneMeta(true);
        setShowConversionRate(false);
    };

    const handleDayTwoClick = () => {
        setShowDayOneMeta(false);
        setShowConversionRate(false);
    };
    const handleConversionRateClick = () => {
        setShowDayOneMeta(false);
        setShowConversionRate(true);
    };

    const chartData = showDayOneMeta
        ? {
            labels: eventData.dayOneMeta.map(meta => {
                const { sprite1, sprite2 } = meta;
                return getCustomLabel(eventId, sprite1, sprite2);
            }),
            datasets: [
                {
                    label: 'Deck Count',
                    data: eventData.dayOneMeta.map(meta => meta.deckcount),
                    backgroundColor: '#1291eb8b'
                }
            ]
        }
        : showConversionRate
            ? conversionChartData
            : {
                labels: deckTypeCountArray.map((entry) => {
                    console.log("Day 2 Label:", entry.key); // Log Day 2 labels
                    return entry.key;
                }), datasets: [
                    {
                        label: 'Deck Count',
                        data: deckTypeCountArray.map((entry) => entry.count),
                        backgroundColor: '#1291eb8b'
                    }
                ]
            };

    const getDayOneMetaSprites = (meta) => {
        return {
            firstSprite: meta.sprite1 || '',
            secondSprite: meta.sprite2
        };
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
        },
        hover: {
            mode: null,
        },
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        events: [],
        // animation: false,
        layout: {
            padding: {
                top: 40,
            },
        },
        animation: {
            onComplete: () => {
                if (chartRef.current) {
                    const chartInstance = chartRef.current;
                    const ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = theme.chartNumber;

                    chartInstance.data.labels.forEach((label, index) => {
                        const meta = chartInstance.getDatasetMeta(0);
                        const dataset = chartInstance.data.datasets[0];
                        const data = dataset.data[index];

                        let sprite;

                        if (showDayOneMeta) {
                            const metaKey = eventData.dayOneMeta[index];
                            const { firstSprite, secondSprite } = getDayOneMetaSprites(metaKey);
                            sprite = firstSprite !== '' ? firstSprite : secondSprite;
                        } else {
                            sprite = deckTypeCount[label]?.sprite;
                        }

                        const bar = meta.data[index];
                        if (sprite && bar) {
                            const { x, y } = bar.tooltipPosition();
                            const img = new Image();
                            img.src = `/assets/sprites/${sprite}.png`;
                            img.onload = () => {
                                const aspectRatio = img.width / img.height;
                                const displayWidth = 45;
                                const displayHeight = displayWidth / aspectRatio;

                                ctx.drawImage(img, x - displayWidth / 2, y - displayHeight - 0, displayWidth, displayHeight);
                            };
                        }
                        if (data >= 4) {
                            const textYPosition = bar.y + 10;
                            ctx.fillText(data, bar.x, textYPosition);
                        }
                    });
                }
            },
        },
    };

    const hasChartData = chartData.labels && chartData.labels.length > 0;
    const resultsAvailable = results.length > 0;
    const statisticsTabStyle = !resultsAvailable ? { opacity: 0.1, pointerEvents: 'none' } : {};
    const isNAIC2024 = eventId === '2024_NAIC' || eventId === '2024_WORLDS' || eventId === '2023_WORLDS';
    const is2024Event = eventId.includes('2024') && !eventId.toLowerCase().includes('retro');

    return (
        <EventPageContent className='center' theme={theme}>
            <Helmet>
                <title>{eventData.name}</title>
                <meta
                    name='description'
                    content={`Results, decks and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`}
                />
                <meta property='og:title' content={eventData.name} />
                <meta
                    property='og:description'
                    content={`Results, decks and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`}
                />
                <meta property='og:image' content={eventData.thumbnail} />
                <meta
                    property='og:url'
                    content={`https://www.ptcglegends.com/tournaments/${eventData.eventId}`}
                />
                <meta property='og:type' content='website' />
                <meta name='author' content='PTCG Legends' />
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={eventData.name} />
                <meta
                    name='twitter:description'
                    content={`Results, decks and statistics from the Pokémon TCG ${eventData.name} held on ${eventData.date}.`}
                />
                <meta name='twitter:image' content={eventData.thumbnail} />
            </Helmet>
            <div className='regional-container'>
                <div className='top-divisions'>
                    {eventData.masters ? (
                        <Link
                            className={`mastersBtn ${division === 'masters' ? 'active-division' : 'other-division'
                                }`}
                            to={`/tournaments/${eventId}/masters`}
                            style={{
                                opacity: isMastersEmpty && otherDivisionsHaveResults ? 0.1 : 1,
                                pointerEvents:
                                    isMastersEmpty && otherDivisionsHaveResults
                                        ? 'none'
                                        : 'all',
                            }}
                        >
                            Masters
                        </Link>
                    ) : eventData.professors ? (
                        <Link
                            className={`professorsBtn ${division === 'professors'
                                ? 'active-division'
                                : 'other-division'
                                }`}
                            to={`/tournaments/${eventId}/professors`}
                            style={{ opacity: 1, pointerEvents: 'all' }}
                        >
                            Professors
                        </Link>
                    ) : eventData.all ? (
                        <Link
                            className={`professorsBtn ${division === 'all'
                                ? 'active-division'
                                : 'other-division'
                                }`}
                            to={`/tournaments/${eventId}/all`}
                            style={{ opacity: 1, pointerEvents: 'all' }}
                        >
                            Combined
                        </Link>
                    ) : null}
                    {eventData.olderSeniors || eventData.youngSeniors ? (
                        <>
                            {eventData.olderSeniors && (
                                <Link
                                    className={`olderSeniorsBtn ${division === 'olderSeniors'
                                        ? 'active-division'
                                        : 'other-division'
                                        }`}
                                    to={`/tournaments/${eventId}/olderSeniors`}
                                    style={{ opacity: 1, pointerEvents: 'all' }}
                                >
                                    Older Seniors
                                </Link>
                            )}
                            {eventData.youngSeniors && (
                                <Link
                                    className={`youngSeniorsBtn ${division === 'youngSeniors'
                                        ? 'active-division'
                                        : 'other-division'
                                        }`}
                                    to={`/tournaments/${eventId}/youngSeniors`}
                                    style={{ opacity: 1, pointerEvents: 'all' }}
                                >
                                    Young Seniors
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link
                            className={`seniorsBtn ${division === 'seniors' ? 'active-division' : 'other-division'
                                }`}
                            to={`/tournaments/${eventId}/seniors`}
                            style={{
                                opacity: eventData.seniors ? 1 : 0.1,
                                pointerEvents: eventData.seniors ? 'all' : 'none',
                            }}
                        >
                            Seniors
                        </Link>
                    )}
                    <Link
                        className={`juniorsBtn ${division === 'juniors' ? 'active-division' : 'other-division'
                            }`}
                        to={`/tournaments/${eventId}/juniors`}
                        style={{
                            opacity: eventData.juniors ? 1 : 0.1,
                            pointerEvents: eventData.juniors ? 'all' : 'none',
                        }}
                    >
                        Juniors
                    </Link>
                </div>
                <div className='regional-info'>
                    <div className='left-regional-info'>
                        <h2>{eventData.name}</h2>
                        <p>{eventData.date}</p>
                        <div className='place-n-flag'>
                            <img
                                src={flags[eventData.flag]}
                                alt={`Flag of ${eventData.flag.toUpperCase()}`}
                            />
                            <p>{eventData.location}</p>
                        </div>
                        {eventData.address && (
                            <p>
                                Venue Address:{' '}
                                <a href={eventData.address} target='_blank'>
                                    Map
                                </a>
                            </p>
                        )}
                        {(eventData.streamsDay1 ||
                            eventData.streamsDay2 ||
                            eventData.streamsDay3) && (
                                <p>
                                    Streams:&nbsp;
                                    {eventData.streamsDay1 && (
                                        <a href={eventData.streamsDay1} target='_blank'>
                                            Day 1
                                        </a>
                                    )}
                                    {eventData.streamsDay1 && eventData.streamsDay2 && ' | '}
                                    {eventData.streamsDay2 && (
                                        <a href={eventData.streamsDay2} target='_blank'>
                                            Day 2
                                        </a>
                                    )}
                                    {eventData.streamsDay2 && eventData.streamsDay3 && ' | '}
                                    {eventData.streamsDay3 && (
                                        <a href={eventData.streamsDay3} target='_blank' rel='noopener noreferrer'>
                                            Day 3
                                        </a>
                                    )}
                                    {eventData.streamsDay4 && (
                                        <>
                                            {eventData.streamsDay3 && " | "}
                                            <a href={eventData.streamsDay4} target='_blank' rel='noopener noreferrer'>
                                                Finals
                                            </a>
                                        </>
                                    )}
                                </p>
                            )}
                    </div>
                    <img
                        className={`regional-info-bg-logo ${[
                            'worldsOfour',
                            'oFourNationals',
                            'oldNationals',
                            'stadiumChallenge',
                            'stadiumChallenge',
                        ].includes(eventData.eventLogo)
                            ? 'pushed-logo'
                            : ''
                            } ${eventData.eventLogo === 'superTrainerShowdown' || 'megaTropicalBattle' ? 'sts-logo' : ''}`}
                        src={logos[eventData.eventLogo]}
                        alt='event logo'
                    />
                    <hr className='reg-hr'></hr>
                    <div className='outer-links'>
                        {eventData.organizer && (
                            <p>
                                <strong>Organizer:</strong>{' '}
                                <a href={eventData.organizerLink} target='_blank'>
                                    {eventData.organizer}
                                </a>
                            </p>
                        )}
                        {eventData.format && (
                            <p>
                                <strong>Format:</strong> {getEventFormat(division)}
                                {eventData.formatAdd && (
                                    <span>
                                        &nbsp;{eventData.formatAdd}
                                    </span>
                                )}
                            </p>
                        )}

                        {getPlayerCount(division)}
                    </div>
                </div>
                <div className='bottom-options'>
                    <a
                        className={`event-option ${activeTab === 'Results' ? 'active-option' : ''}`}
                        onClick={() => {
                            setActiveTab('Results');
                        }}
                    >
                        Results
                    </a>
                    <a
                        className={`event-option ${activeTab === 'Statistics' ? 'active-option' : ''}`}
                        onClick={() => {
                            if (resultsAvailable) {
                                setActiveTab('Statistics');
                            }
                        }}
                        style={statisticsTabStyle}
                    >
                        Statistics
                    </a>
                    <a className='event-option' style={{ opacity: 0.1, pointerEvents: 'none' }}>Photos</a>
                </div>
                <div className='contain-event'>
                    <div className='event-content'>
                        {activeTab === 'Results' ? (
                            <div className='event-results'>
                                {results.length > 0 ? (
                                    displayResults(results, eventId, division)
                                ) : (
                                    <p className='notavailable'>Results not yet available for this event.</p>
                                )}
                            </div>
                        ) : (
                            <div className='event-statistics'>
                                <div className='chart-btns-container'>
                                    <div className='alignrow'>
                                        {isNAIC2024 && division === 'masters' ? (
                                            <>
                                                <button
                                                    className={`chart-button day2btn ${!showDayOneMeta && !showConversionRate ? 'active' : ''}`}
                                                    onClick={handleDayTwoClick}
                                                >
                                                    Day 2
                                                </button>
                                                <>
                                                    <button
                                                        className={`chart-button day1btn ${showDayOneMeta && !showConversionRate ? 'active' : ''}`}
                                                        onClick={handleDayOneClick}
                                                    >
                                                        Day 1
                                                    </button>
                                                    <button
                                                        className={`chart-button conversbtn ${showConversionRate ? 'active' : ''}`}
                                                        onClick={handleConversionRateClick}
                                                    >
                                                        % Conversion
                                                    </button>
                                                </>
                                            </>
                                        ) : (is2024Event && division === 'masters') ? (
                                            <button className={`chart-button day2btn active`}>
                                                Day 2
                                            </button>
                                        ) : (
                                            <p className='chart-button'>Top {chartResults.length}</p>
                                        )}
                                    </div>
                                </div>
                                {division === 'masters' && eventId.includes('2024') && !eventId.includes('RETRO') && chartResults.length > 16 && (
                                    <div className='chart-description'>
                                        {showDayOneMeta && !showConversionRate && (
                                            <p>* Most played decks from Day 1 (data collected from event stream)</p>
                                        )}
                                        {!showDayOneMeta && !showConversionRate && (
                                            <p>* Total count for each deck archetype from Day 2</p>
                                        )}
                                        {showConversionRate && (
                                            <p>* Percentage of the top Day 1 decks that made Day 2</p>
                                        )}
                                    </div>
                                )}
                                {!hasChartData && (
                                    <div className='chart-description'><p>* No known decks available for this division</p></div>
                                )}
                                <div className='chart-container-wrapper'>
                                    <div className='chart-container'>
                                        <Bar ref={chartRef} data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                                <div className='deck-archetypes'>
                                    <h3>All Results per Deck</h3>
                                    <div className='filter-container'>
                                        <div className='filters-top'>
                                            <div className='indiv-filter'>
                                                <select 
                                                    value={selectedArchetype} 
                                                    onChange={(e) => setSelectedArchetype(e.target.value)} 
                                                    className="archetype-dropdown"
                                                >
                                                    <option value="">Select Deck</option> {/* Default option */}
                                                    {deckTypeCountArray.map((archetype, index) => (
                                                        <option key={index} value={archetype.key}>
                                                            {archetype.key} ({archetype.count})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='filtered-results'>
                                    <div className='results-table charted-decks'>
                                        {results
                                            .map((result, idx) => ({ result, originalIndex: idx + 1 }))
                                            .filter(({ result }) => {
                                                let sprite1 = result.sprite1 || '';
                                                let sprite2 = result.sprite2 || '';

                                                if (!sprite1 && !sprite2) {
                                                    const { firstSprite, secondSprite } = getPokemonSprites(result.decklist, '', '');
                                                    sprite1 = firstSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
                                                    sprite2 = secondSprite.replace('/assets/sprites/', '').replace('.png', '') || '';
                                                }

                                                if (sprite1 === 'blank') {
                                                    sprite1 = '';
                                                }

                                                const key = getCustomLabel(eventId, sprite1, sprite2);
                                                return key === selectedArchetype;
                                            })
                                            .map(({ result, originalIndex }, index) => {
                                                const backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.3)';
                                                return (
                                                    <div key={index} style={{ backgroundColor }}>
                                                        {displayResults([result], eventId, division, originalIndex)}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </EventPageContent>
    );
};

export default EventPage;
