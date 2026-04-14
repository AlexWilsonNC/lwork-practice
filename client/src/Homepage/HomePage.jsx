import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/homepage.css';
import { sortedEvents } from '../Tournaments/tournaments-data';
import SidebarComponent from '../SideContent/SideContent';

import archiveUpdateImg from '../assets/archive-updates/apr-archive.jpg';
import legendsLogoProfile from '../assets/profile-pics/logo-darkmode.png';
import playPokemonProfile from '../assets/profile-pics/play-pokemon-logo.png';
import latestSet from '../assets/sets-filter-backgrounds/me/por.jpg';
import deckBuilder from '../../public/images/deckbuilder-preview.png';

import article1 from '../Articles/whenModernBecomesRetro';
import article2 from '../Articles/forgottenFormat';
import patreonImg from '../assets/social-media-icons/patreon-red-old-logo.png';

const Container = styled.div`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;
const FeaturedHeaders = styled.h2`
  color: ${({ theme }) => theme.featuredheadertext}
`;
const WrappedFeature = styled.div`
  background: ${({ theme }) => theme.whiteBackground};
  h3 {color: ${({ theme }) => theme.text};}
  p {color: ${({ theme }) => theme.text};}
  &:hover { background: ${({ theme }) => theme.hoverWrappedFeatureBg};}
  border-radius: 5px; 
  box-shadow: 1px 1px 5px rgba(0,0,0,0.25);
`;
const UpcomingEventsHome = styled.ul`
  li {
    color: ${({ theme }) => theme.text};
    &:hover {
      color: ${({ theme }) => theme.hoverText};
    }
    
    a {
      color: ${({ theme }) => theme.text};
      &:hover {
        color: ${({ theme }) => theme.hoverText};
      }
    }

  }
`;
const HomepageMainContent = styled.div`
  background: ${({ theme }) => theme.homepageMainContentBg};
`;
const ArticleType = styled.div`
    // dont change color
`;

const Homepage = () => {
    const { theme } = useTheme();

    const articles = [article1, article2 /* Add more articles as needed */];

    // Find the latest article
    const latestArticle = articles.reduce((latest, article) => {
        return new Date(article.date) > new Date(latest.date) ? article : latest;
    }, articles[0]);

    const upcomingEvents = sortedEvents
        .filter(event => {
            const cutoff = new Date(event.date);
            cutoff.setDate(cutoff.getDate() + 2);
            return cutoff >= new Date();
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

    const now = new Date();

    const latestCompletedEvent = [...sortedEvents]
        .filter(event => {
            const cutoff = new Date(event.date);
            cutoff.setDate(cutoff.getDate() + 2);
            return cutoff < now && event.id;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    const [latestCompletedEventData, setLatestCompletedEventData] = useState(null);

    useEffect(() => {
        const fetchLatestCompletedEventData = async () => {
            if (!latestCompletedEvent?.id) return;

            try {
                const eventId = latestCompletedEvent.id.replace('/tournaments/', '');
                const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/events/${eventId}`);

                if (response.ok) {
                    const data = await response.json();
                    setLatestCompletedEventData(data);
                } else {
                    console.error('Failed to fetch latest completed event data');
                }
            } catch (error) {
                console.error('Error fetching latest completed event data:', error);
            }
        };

        fetchLatestCompletedEventData();
    }, [latestCompletedEvent]);

    const latestCompletedEventName = latestCompletedEvent?.name || '';
    const latestCompletedEventDate = latestCompletedEvent?.date || '';
    const latestCompletedEventDisplayName = latestCompletedEventName
        .replace(/^202\d\s+/, '');

    const isResultsReady = latestCompletedEvent.results !== false;

    return (
        <Container theme={theme}>
            <Helmet>
                <title>PTCG Legends</title>
                <meta name="description" content="Pokémon TCG database containing modern and retro event results, decklists, statistics, data and other resources." />
                <meta property="og:title" content="PTCG Legends" />
                <meta property="og:description" content="Pokémon TCG database containing modern and retro event results, decklists, statistics, data and other resources." />
                <meta property='og:image' content='https://i.ibb.co/mrSpd4V3/legends-thumbnail.png' />
                <meta property="og:url" content="https://www.ptcglegends.com/" />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PTCG Legends" />
                <meta name="twitter:description" content="Pokémon TCG database containing modern and retro event results, decklists, statistics, data and other resources." />
                <meta name="twitter:image" content="https://i.ibb.co/mrSpd4V3/legends-thumbnail.png" />
            </Helmet>
            <div className='new-homepage'>
                <HomepageMainContent className='homepage-main-content hide-it-all'>
                    <div className='top-featured-row'>
                        <div className='homepage-box'>
                            <div className='flex-row-wide'>
                                <FeaturedHeaders className='featured-headers'>Latest Event Results</FeaturedHeaders>
                                <a href='/tournaments/completed' className='blue'>View All</a>
                            </div>
                            {latestCompletedEvent && (
                                <a href={`/tournaments/${latestCompletedEvent.id}`}>
                                    <WrappedFeature className='wrapped-feature'>
                                        {latestCompletedEventData?.thumbnail ? (
                                            <img
                                                className='card-image'
                                                src={latestCompletedEventData.thumbnail}
                                                alt={latestCompletedEvent.name}
                                            />
                                        ) : (
                                            <div className="card-image placeholder" />
                                        )}
                                        <img className='card-profile-pic transparent-profile-pic' src={playPokemonProfile} />
                                        <div className='homepage-box-content'>
                                            <h3>
                                                Results from <span className='new-color'>{latestCompletedEvent.name}</span>{' '}
                                                {isResultsReady ? 'are here!' : 'coming soon!'}
                                            </h3>
                                            <p>{isResultsReady ? 'Check out' : 'Once available, you\'\ll be able to check out'} all the lists & matchups from each division, plus deck stats and this event's meta shares.</p>
                                        </div>
                                        <div className='card-date-plus-read'>
                                            <p>{latestCompletedEventDate}</p>
                                            <p>View Results</p>
                                        </div>
                                    </WrappedFeature>
                                </a>
                            )}
                        </div>
                        <div className='homepage-box'>
                            <div className='flex-row-wide'>
                                <FeaturedHeaders className='featured-headers'>Latest Article</FeaturedHeaders>
                                <a href='/articles/all' className='blue not-ready'>View All</a>
                            </div>
                            <a href={`/articles/${latestArticle.id}`}>
                                <WrappedFeature className="wrapped-feature">
                                    <div className="article-thumbnail">
                                        <img src={latestArticle.headerImage} alt={latestArticle.title} />
                                        <ArticleType className="article-type retro-article">
                                            {latestArticle.type || 'Article'}
                                        </ArticleType>
                                    </div>
                                    <p className="card-profile-author" style={{ opacity: 0.5 }}>{latestArticle.author}</p>
                                    <img
                                        className="card-profile-pic"
                                        src={latestArticle.authorImage}
                                        alt={latestArticle.author}
                                    />
                                    <div className="homepage-box-content">
                                        <h3>{latestArticle.title}</h3>
                                        <p>{latestArticle.sneakPeakText}</p>
                                    </div>
                                    <div className="card-date-plus-read">
                                        <p>{latestArticle.date}</p>
                                        <p>Read More</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        </div>
                        <div className='homepage-box'>
                            <FeaturedHeaders className='featured-headers'>Latest Archive Updates</FeaturedHeaders>
                            <a href='/archive-updates'>
                                <WrappedFeature className='wrapped-feature'>
                                    <img className='card-image' src={archiveUpdateImg} />
                                    <img className='card-profile-pic transparent-profile-pic' src={legendsLogoProfile} />
                                    <div className='homepage-box-content'>
                                        <h3>More <span className='new-color'>Retro</span> Results Discovered!</h3>
                                        <p>New long-lost decklists from the 2015 World Championships, 2010 World Championships, and some 2004 Stadium Challenges are here, on PTCG Legends only!</p>
                                    </div>
                                    <div className='card-date-plus-read'>
                                        <p>Mar 29, 2026</p>
                                        <p>View Updates</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        </div>
                    </div>

                    <div className='top-featured-row'>
                        <div className='homepage-box'>
                            <div className='flex-row-wide'>
                                <FeaturedHeaders className='featured-headers'>Upcoming Tournaments</FeaturedHeaders>
                                <a href='/tournaments/upcoming' className='blue'>View All</a>
                            </div>
                            <UpcomingEventsHome className='upcoming-events-home'>
                                <ul>
                                    {upcomingEvents.map((event, index) => (
                                        <li key={index}>
                                            <img className='event-type-logo' src={event.eventLogo} alt="Event logo" />
                                            <div className='event-date'>
                                                <h4><a className='white-letters' href={`/tournaments/${event.id}`}>{event.name}</a></h4>
                                                <div className='upcoming-loc'>
                                                    <div className='flag-place'>
                                                        <img src={event.flag} alt="Country flag" />
                                                        <p className='white-letters'>{event.location}</p>
                                                    </div>
                                                    <p className='white-letters'>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {upcomingEvents.length < 5 && (
                                    <p className="tba-text">Awaiting future events to be announced...</p>
                                )}
                            </UpcomingEventsHome>
                        </div>
                        <div className='homepage-box'>
                            <FeaturedHeaders className='featured-headers'>Card Database</FeaturedHeaders>
                            <a href='./cards/POR'>
                                <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                    <img className='card-image' src={latestSet} />
                                    <div className='homepage-box-content'>
                                        <h3>View the lastest TCG expansion: <span className='new-color'>Perfect Order</span>!</h3>
                                        <p>View every Pokémon card from every expansion ever, in our database
                                            here! From Base Set through this latest release, we have them all!</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        </div>
                        <div className='homepage-box'>
                            <FeaturedHeaders className='featured-headers'>Deck Builder</FeaturedHeaders>
                            <a href='/deckbuilder'>
                                <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                    <img className='card-image' src={deckBuilder} />
                                    <div className='homepage-box-content'>
                                        <h3>Our <span className='new-color'>NEW</span> Deck Builder!</h3>
                                        <p>Try our new deck builder! Our app is perfect for your modern & retro deck building needs! Create new decks, customize decks from our archive, create collections and share them with your friends!</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        </div>
                    </div>

                    {/* <h3 className='alignstart not-ready'>Articles Will Return Soon</h3> */}
                    {/* <div className='top-featured-row not-ready'>
                        <div className='homepage-box'>
                            <div className='flex-row-wide'>
                                <FeaturedHeaders className='featured-headers'>Recent Articles</FeaturedHeaders>
                                <a href='' >.</a>
                            </div>
                            <a href='./articles/other/2024-retro-celebration'>
                                <div className='wrapped-feature'>
                                    <div className='article-thumbnail'>
                                        <img src='./assets/article-thumbnails/2024-retro-mobile.png' />
                                        <p className='article-type other-article'>Event</p>
                                    </div>
                                    <div className='homepage-box-content'>
                                        <h3>2024 Retro Celebration Events at NAIC!</h3>
                                        <p>This year, we're hosting two retro events at NAIC! Come compete in these exciting events celebrating 2010 Worlds & the 10-year anniversary of 2014! <span className='featured-link'>Read
                                            More</span></p>
                                    </div>
                                    <div className='featured-box-name-and-date'>
                                        <div className='profile-pic'>
                                            <img src='./assets/twitter-logo.jpg' />
                                            <p>PTCG Legends</p>
                                        </div>
                                        <p>Apr 27, 2024</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className='homepage-box'>
                            <FeaturedHeaders className='featured-headers'>.</FeaturedHeaders>
                            <a href='./articles/retro/problems-of-2010'>
                                <div className='wrapped-feature'>
                                    <div className='article-thumbnail'>
                                        <img src='./assets/article-thumbnails/garchomp-sup.jpg' />
                                        <p className='article-type retro-article'>Retro</p>
                                    </div>
                                    <div className='homepage-box-content'>
                                        <h3>Problems of the 2010 Worlds Format</h3>
                                        <p>The 2010 Worlds format is one of the most celebrated retro formats of all time, but no format comes without its flaws... <span
                                            className='featured-link'>Read More</span></p>
                                    </div>
                                    <div className='featured-box-name-and-date'>
                                        <div className='profile-pic'>
                                            <img src='./assets/people/whimsicast.png' />
                                            <p>Whimsicast</p>
                                        </div>
                                        <p>Jan 11, 2024</p>
                                    </div>
                                </div>
                            </a>


                        </div>
                        <div className='homepage-box'>
                            <div className='flex-row-wide'>
                                <FeaturedHeaders className='featured-headers' >.</FeaturedHeaders>
                                <a href='./articles/all' className='blue'>View All</a>
                            </div>
                            <a href='./articles/retro/md-bw-lame-duck-format.html'>
                                <div className='wrapped-feature'>
                                    <div className='article-thumbnail'>
                                        <img src='./assets/article-thumbnails/n.jpg' />
                                        <p className='article-type retro-article'>Retro</p>
                                    </div>
                                    <div className='homepage-box-content'>
                                        <h3>The Pokémon TCG's Lame Duck Format: MD-BW</h3>
                                        <p>One of the shortest lived formats in history, (due to the mid-season rotation of
                                            2011), take a dive into this unexplored format! <span className='featured-link'>Read
                                                More</span></p>
                                    </div>
                                    <div className='featured-box-name-and-date'>
                                        <div className='profile-pic'>
                                            <img src='./assets/people/groudon-head.png' />
                                            <p>Nicholas Baker</p>
                                        </div>
                                        <p>Dec 6, 2023</p>
                                    </div>
                                </div>
                            </a>
                        </div> 
                    </div>*/}
                </HomepageMainContent>

                <SidebarComponent></SidebarComponent>

                <HomepageMainContent className='homepage-main-content hide-on-small'>
                    <div className='homepage-box'>
                        <div className='flex-row-wide'>
                            <FeaturedHeaders className='featured-headers'>Latest Event Results</FeaturedHeaders>
                            <a href='/tournaments/completed' className='blue'>View All</a>
                        </div>
                        {latestCompletedEvent && (
                            <a href={`/tournaments/${latestCompletedEvent.id}`}>
                                <WrappedFeature className='wrapped-feature'>
                                    {latestCompletedEventData?.thumbnail ? (
                                        <img
                                            className='card-image'
                                            src={latestCompletedEventData.thumbnail}
                                            alt={latestCompletedEvent.name}
                                        />
                                    ) : (
                                        <div className="card-image placeholder" />
                                    )}
                                    <img className='card-profile-pic transparent-profile-pic' src={playPokemonProfile} />
                                    <div className='homepage-box-content'>
                                        <h3>
                                            Results from <span className='new-color'>{latestCompletedEvent.name}</span>{' '}
                                            {isResultsReady ? 'are here!' : 'coming soon!'}
                                        </h3>
                                        <p>{isResultsReady ? 'Check out' : 'Once available, you\'\ll be able to check out'} all the lists & matchups from each division, plus deck stats and this event's meta shares.</p>
                                    </div>
                                    <div className='card-date-plus-read'>
                                        <p>{latestCompletedEventDate}</p>
                                        <p>View Results</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        )}
                    </div>
                    <div className='homepage-box'>
                        <div className='flex-row-wide'>
                            <FeaturedHeaders className='featured-headers'>Latest Article</FeaturedHeaders>
                            <a href='/articles/all' className='blue not-ready'>View All</a>
                        </div>
                        <a href={`/articles/${latestArticle.id}`}>
                            <WrappedFeature className="wrapped-feature">
                                <div className="article-thumbnail">
                                    <img src={latestArticle.headerImage} alt={latestArticle.title} />
                                    <ArticleType className="article-type retro-article">
                                        {latestArticle.type || 'Article'}
                                    </ArticleType>
                                </div>
                                <p className="card-profile-author" style={{ opacity: 0.5 }}>{latestArticle.author}</p>
                                <img
                                    className="card-profile-pic"
                                    src={latestArticle.authorImage}
                                    alt={latestArticle.author}
                                />
                                <div className="homepage-box-content">
                                    <h3>{latestArticle.title}</h3>
                                    <p>{latestArticle.sneakPeakText}</p>
                                </div>
                                <div className="card-date-plus-read">
                                    <p>{latestArticle.date}</p>
                                    <p>Read More</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                    <div className='homepage-box3 zmore'>
                        <div className='flex-row-wide'>
                            <FeaturedHeaders className='featured-headers'>Upcoming Tournaments</FeaturedHeaders>
                            <a href='/tournaments/upcoming' className='blue'>View All</a>
                        </div>
                        <UpcomingEventsHome className='upcoming-events-home'>
                            <ul>
                                {upcomingEvents.map((event, index) => (
                                    <li key={index}>
                                        <img className='event-type-logo' src={event.eventLogo} alt="Event logo" />
                                        <div className='event-date'>
                                            <h4><a className='white-letters' href={`/tournaments/${event.id}`}>{event.name}</a></h4>
                                            <div className='upcoming-loc'>
                                                <div className='flag-place'>
                                                    <img src={event.flag} alt="Country flag" />
                                                    <p className='white-letters'>{event.location}</p>
                                                </div>
                                                <p className='white-letters'>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {upcomingEvents.length < 5 && (
                                <p className="tba-text">Awaiting future events to be announced...</p>
                            )}
                        </UpcomingEventsHome>
                    </div>
                    <div className='homepage-box'>
                        <FeaturedHeaders className='featured-headers'>Latest Archive Updates</FeaturedHeaders>
                        <a href='/archive-updates'>
                            <WrappedFeature className='wrapped-feature'>
                                <img className='card-image' src={archiveUpdateImg} />
                                <img className='card-profile-pic transparent-profile-pic' src={legendsLogoProfile} />
                                <div className='homepage-box-content'>
                                    <h3>More <span className='new-color'>Retro</span> Results Discovered!</h3>
                                    <p>New long-lost decklists from the 2015 World Championships, 2010 World Championships, and some 2004 Stadium Challenges are here, on PTCG Legends only!</p>
                                </div>
                                <div className='card-date-plus-read'>
                                    <p>Mar 29, 2026</p>
                                    <p>View Updates</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                    <div className='homepage-box lessmarginbottomsmall'>
                        <FeaturedHeaders className='featured-headers'>Card Database</FeaturedHeaders>
                        <a href='/cards/POR'>
                            <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                <img className='card-image' src={latestSet} />
                                <div className='homepage-box-content'>
                                    <h3>View the lastest TCG expansion: <span className='new-color'>Perfect Order</span>!</h3>
                                    <p>View every Pokémon card from every expansion ever, in our database
                                        here! From Base Set through this latest release, we have them all!</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                    <div className='homepage-box lessmarginbottomsmall footerupon-mobile'>
                        <FeaturedHeaders className='featured-headers'>Deck Builder</FeaturedHeaders>
                        <a href='/deckbuilder'>
                            <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                <img className='card-image' src={deckBuilder} />
                                <div className='homepage-box-content'>
                                    <h3>Our <span className='new-color'>NEW</span> Deck Builder!</h3>
                                    <p>Try our new deck builder! Our app is perfect for your modern & retro deck building needs! Create new decks, customize decks from our archive, create collections and share them with your friends!</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                </HomepageMainContent>
            </div>
            <div className='patreonBottom'>
                <div>
                    <img src={patreonImg} alt='Help us Archive' />
                    <h4>A Special Thank You!</h4>
                </div>
                <p id='belowLegends'>To the below Legends that support us on Patreon!</p>
                <ul className='patreonLegendsUl'>
                    <li>Jesse Benedict</li>
                    <li>CachoOfSinnoh</li>
                </ul>
            </div>
        </Container>
    )
}

export default Homepage