import React from 'react';
import '../css/about.css';
import styled from 'styled-components';
import ferr from '../assets/article-thumbnails/ferr.png'

const AboutContainer = styled.div`
    color: ${({ theme }) => theme.abouttxt};
    background-color: ${({ theme }) => theme.aboutbg};
`;

const About = () => {
    return (
        <AboutContainer className="about-container">
            <div className="about-content">
                <h1 className="about-title">About Us</h1>
                <p className="about-description">
                    PTCG Legends is a resource catered towards the competitive Pokémon TCG community, with event info, results, stats, player info, and the game's history at the site's forefront. Prior to the site's launch - no other site covered major events from 1999-2022+
                </p>
                <h1 className="about-title">History</h1>
                <p className="about-description">
                    PTCG Legends was a site originally made as a school project... catered towards the retro Pokémon TCG community. With the initial goal to document all major events that could not be found on the internet prior to our launch, and to archive any relevant deck that ever existed competitively. As other "retro" sites that had existed prior only ever featured the top decks from each era/format. <i>"No deck left behind..." ~ PTCG Legends</i>
                </p>
                <p className="about-description">
                    The site first launched on Christmas Day of 2022, after nearly a year of development. The site's largest component being its "Decks by Era" section - highlighting nearly every deck that was ever played per format, featuring eras 1999 - 2019. Since then, many amazing community members have helped us document additional decks and formats!
                </p>
                <p className="about-description">
                    In 2023, articles and modern event coverage, including Regionals, were integrated as part of the site's second phase. For the entire 2023 season, PTCG Legends stayed on top of modern events from around the world as more and more non-retro players learned of this resource. But behind the scenes, the site's creator was never truley satisfied with PTCG Legends...
                </p>
                <p className="about-description">
                    In the summer of 2024, PTCG Legends was shocklingly, and without warning, DELETED! Just to be surprisingly relaunched a week later as a fully-functional database! Player pages, event & deck statistics, finding decks by card and more... so much more, to come!
                </p>
                <h1 className="about-title">Staff</h1>
                <p className="about-description">• Alex Wilson (<a href='https://x.com/alexwilsonTCG' target='_blank' className='blue-link-about italic'>@alexwilsonTCG</a>)</p>
            </div>
            <div className="about-visual">
                <img 
                    src={ferr} 
                    alt="About Us Visual" 
                    className="about-image"
                />
                <br></br>
                <h1 className="about-title">Special Thanks</h1>
                <p className="about-description">
                    The community as a whole is owed a massive thank you for how far this site has come, esspecially to those that constantly help with corrections and finding new content! But there are a few indiviuals that deserve a special spotlight for their amazing help.
                </p>
                <ul>
                    <li><strong>• Jeremiah Schmutz</strong> - <i>"without you, the site wouldn't exist, as I would have never learned to code... and thank you for the incredible amount of time that you've spent helping me with this project! It's truly meant alot." ~ Alex</i></li>
                    <br></br>
                    <li><strong>• <a href='https://pokedata.ovh/' className='blue-link-about' target='_blank'>pokedata.ovh</a></strong> - It's thanks to Julien's amazing work that we're able to download modern event results. Without pokedata, we'd have to manually upload results by hand...</li>
                    <br></br>
                    <li><strong>• Jeremy Evans</strong> - The man behind our amazing discord server (originally known as "Battle Frontier"). Thank you for absorbing the PTCG Legends community into your discord and maintaining it!</li>
                    <br></br>
                    <li><strong>• Jesse Benedict</strong> - An amazing indivual that spent hours, days, weeks, months behind the scenes converting card data from the prehistoric first iteration of the site.</li>
                    <br></br>
                    <li><strong>• Other Resources</strong> - We've referenced and/or use these amazing sites, so check them out. <a href='https://retro-library.com/' target='_blank' className='blue-link-about'>Retro Library</a>, <a href='https://jklaczpokemon.com/' target='_blank' className='blue-link-about'>Jason Klaczynski's Blog</a>, <a href='https://limitlesstcg.com/' target='_blank' className='blue-link-about'>Limitless TCG</a>, <a href='https://ptcgarchive.com/' target='_blank' className='blue-link-about'>PTCG Archive</a>, <a href='https://pkmncards.com/' target='_blank' className='blue-link-about'>PkmnCards</a>, <a href='https://pokemontcg.io/' target='_blank' className='blue-link-about'>Pokemon Card API</a>, <a href='https://rk9.gg/' target='_blank' className='blue-link-about'>RK9 Labs</a> & obviously Pokémon's official resources.
                    </li>
                </ul>
            </div>
            <div></div>
        </AboutContainer>
    );
};

export default About;
