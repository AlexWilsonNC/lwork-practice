import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import '../css/homepage.css';
import { sortedEvents } from '../Tournaments/tournaments-data';
import SidebarComponent from '../SideContent/SideContent';

import ogInternats from '../assets/archive-updates/july-archive.jpg';
import legendsLogoProfile from '../assets/profile-pics/logo-darkmode.png';
import playPokemonProfile from '../assets/profile-pics/play-pokemon-logo.png';
import latestSet from '../assets/homepage/latest-expansion.webp';
import deckBuilder from '../assets/homepage/deckbuilder.png';

import article1 from '../Articles/whenModernBecomesRetro';
import article2 from '../Articles/forgottenFormat';

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
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

    return (
        <Container theme={theme}>
            <Helmet>
                <title>PTCG Legends</title>
                <meta name="description" content="The largest Pokémon TCG website containing both modern and retro events, decks, statistics, data and resources." />
                <meta property="og:title" content="PTCG Legends" />
                <meta property="og:description" content="The largest Pokémon TCG website containing both modern and retro events, decks, statistics, data and resources." />
                <meta property='og:image' content='https://i.ibb.co/gw8gG0B/imageedit-10-7777594416.png' />
                <meta property="og:url" content="https://www.ptcglegends.com/" />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PTCG Legends" />
                <meta name="twitter:description" content="The largest Pokémon TCG website containing both modern and retro events, decks, statistics, data and resources." />
                <meta name="twitter:image" content="https://i.ibb.co/gw8gG0B/imageedit-10-7777594416.png" />
            </Helmet>
            <div className='new-homepage'>
                <HomepageMainContent className='homepage-main-content hide-it-all'>
                    <div className='top-featured-row'>
                        <div className='homepage-box'>
                            <div className='flex-row-wide'>
                                <FeaturedHeaders className='featured-headers'>Latest Event Results</FeaturedHeaders>
                                <a href='/tournaments/completed' className='blue'>View All</a>
                            </div>
                            <a href='./tournaments/2025_BALTIMORE'>
                                <WrappedFeature className='wrapped-feature'>
                                    <img className='card-image' src='https://victoryroadvgc.com/wp-content/uploads/2024/07/Baltimore-Regional.jpg' />
                                    <img className='card-profile-pic transparent-profile-pic' src={playPokemonProfile} />
                                    <div className='homepage-box-content'>
                                        <h3>Results from 2025 Baltimore Regionals!</h3>
                                        <p>
                                            View all Day 2 lists from this event, including top lists from both Seniors & Juniors, meta statistics, and the event's livestream.
                                            {/* Check out some of the top lists from this event while we wait for all Day 2 lists, Seniors & Juniors results, and complete statistics. */}
                                        </p>
                                    </div>
                                    <div className='card-date-plus-read'>
                                        <p>Sep 16, 2024</p>
                                        <p>View Results</p>
                                    </div>
                                </WrappedFeature>
                            </a>
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
                                    <p className="card-profile-author">{latestArticle.author}</p>
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
                                    <img className='card-image' src={ogInternats} />
                                    <img className='card-profile-pic transparent-profile-pic' src={legendsLogoProfile} />
                                    <div className='homepage-box-content'>
                                        <h3><span className='new-color'>Long-lost</span> Decks & Results Discovered!</h3>
                                        <p>We found a bunch of long-lost decklists and results from many events, spanning from 2002 Worlds to a Top 4 list from 2008 Nationals and more!</p>
                                    </div>
                                    <div className='card-date-plus-read'>
                                        <p>June 30, 2024</p>
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
                            </UpcomingEventsHome>
                        </div>
                        <div className='homepage-box'>
                            <FeaturedHeaders className='featured-headers'>Latest Set List</FeaturedHeaders>
                            <a href='./cards/SSP'>
                                <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                    <img className='card-image' src={latestSet} />
                                    <div className='homepage-box-content'>
                                        <h3>View All Cards from <span className='new-color'>Surging Sparks</span> in
                                            our Database!</h3>
                                        <p>You can view every Pokémon card and TCG expansion in history within our database
                                            here! From Base Set through the latest release, we have them all!</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        </div>
                        <div className='homepage-box'>
                            <FeaturedHeaders className='featured-headers'>Deck Builder</FeaturedHeaders>
                            <div className='overlay'>Coming Soon</div>
                            <a href='/deckbuilder' className='not-ready'>
                                <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                    <img className='card-image' src={deckBuilder} />
                                    <div className='homepage-box-content'>
                                        <h3>Our <span className='new-color'>NEW</span> Deck Builder!</h3>
                                        <p>Try our new deck builder! From Base Set to Scarlet & Violet, our app has every card ever printed for your modern & retro deck building needs! Customize decks from our archive and share 'em with your friends!</p>
                                    </div>
                                </WrappedFeature>
                            </a>
                        </div>
                    </div>

                    <h3 className='alignstart not-ready'>Articles Will Return Soon</h3>
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
                        <a href='./tournaments/2025_BALTIMORE'>
                            <WrappedFeature className='wrapped-feature'>
                                <img className='card-image' src='https://victoryroadvgc.com/wp-content/uploads/2024/07/Baltimore-Regional.jpg' />
                                <img className='card-profile-pic transparent-profile-pic' src={playPokemonProfile} />
                                <div className='homepage-box-content'>
                                    <h3>Results from 2025 Baltimore Regionals!</h3>
                                    <p>
                                        View all Day 2 lists from this event, including top lists from both Seniors & Juniors, meta statistics, and the event's livestream.
                                        {/* Check out some of the top lists from this event while we wait for all Day 2 lists, Seniors & Juniors results, and complete statistics. */}
                                    </p>
                                </div>
                                <div className='card-date-plus-read'>
                                    <p>Sep 16, 2024</p>
                                    <p>View Results</p>
                                </div>
                            </WrappedFeature>
                        </a>
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
                                    <p className="card-profile-author">{latestArticle.author}</p>
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
                            </UpcomingEventsHome>
                    </div>
                    <div className='homepage-box'>
                        <FeaturedHeaders className='featured-headers'>Latest Archive Updates</FeaturedHeaders>
                        <a href='/archive-updates'>
                            <WrappedFeature className='wrapped-feature'>
                                <img className='card-image' src={ogInternats} />
                                <img className='card-profile-pic transparent-profile-pic' src={legendsLogoProfile} />
                                <div className='homepage-box-content'>
                                    <h3><span className='new-color'>Long-lost</span> Decks & Results Discovered!</h3>
                                    <p>We found a bunch of long-lost decklists and results from many events, spanning from 2002 Worlds to a Top 4 list from 2008 Nationals and more!</p>
                                </div>
                                <div className='card-date-plus-read'>
                                    <p>June 30, 2024</p>
                                    <p>View Updates</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                    <div className='homepage-box lessmarginbottomsmall'>
                        <FeaturedHeaders className='featured-headers'>Latest Set List</FeaturedHeaders>
                        <a href='/cards/SSP'>
                            <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                <img className='card-image' src={latestSet} />
                                <div className='homepage-box-content'>
                                    <h3>View All Cards from <span className='new-color'>Surging Sparks</span> in
                                        our Database!</h3>
                                    <p>You can view every Pokémon card and TCG expansion in history within our database
                                        here! From Base Set through the latest release, we have them all!</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                    <div className='homepage-box lessmarginbottomsmall footerupon-mobile'>
                        <FeaturedHeaders className='featured-headers'>Deck Builder</FeaturedHeaders>
                        <div className='overlay'>Coming Soon</div>
                        <a href='/deckbuilder' className='not-ready'>
                            <WrappedFeature className='wrapped-feature smaller-homepage-card'>
                                <img className='card-image' src={deckBuilder} />
                                <div className='homepage-box-content'>
                                    <h3>Our <span className='new-color'>NEW</span> Deck Builder!</h3>
                                    <p>Try our new deck builder! From Base Set to Scarlet & Violet, our app has every card ever printed for your modern & retro deck building needs! Customize decks from our archive and share 'em with your friends!</p>
                                </div>
                            </WrappedFeature>
                        </a>
                    </div>
                </HomepageMainContent>
            </div>
        </Container>
    )
}

export default Homepage