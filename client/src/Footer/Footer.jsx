import '../css/footer.css';
import React from 'react';
import twitterIcon from '../assets/social-media-icons/twitter-icon.svg';
import discordIcon from '../assets/social-media-icons/discord-icon.png';
import patreonIcon from '../assets/social-media-icons/patreon-icon.webp';
import tiktokIcon from '../assets/social-media-icons/tiktok-icon.webp';
import emailIcon from '../assets/social-media-icons/email-icon.png';
import totodileSprite from '../assets/footer/footerspriteleft.png';
import feraligatrSprite from '../assets/footer/footersprite.png';

function Footer() {
    return (
        <footer className='site-footer'>
            <div className="footer-content">
                <div>
                    <a className='legends-brand' href="./home">
                        <img src='' className="nav-logo-footer" alt="logo" />
                        <h1>PTCG <span className='legends-font-footer'>Legends</span></h1>
                    </a>
                    <div className='hide-footer'>
                        <p>The literal and graphical information presented on this website about the Pokémon Trading Card Game, including sprites, card text, images and tournament-related content, are copyrights of The Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, Play! Pokémon, and/or Wizards of the Coast. This website is not produced by, endorsed by, supported by, or affiliated with The Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, Play! Pokémon, nor Wizards of the Coast.</p>
                        <br></br>
                        <p>This website is simply a place for Pokémon TCG fans to look at events and results from the greatest game in history!</p>
                    </div>
                </div>
                <div>
                    <p className='useful-links'>Useful Links:</p>
                    <hr className='footer-hr'></hr>
                    <div className='usefuls'>
                        <div className='useful-row1'>
                            <a href='/'>Home</a>
                            <a href='/tournaments/completed'><span>Tournaments</span>Completed</a>
                            <a href='/tournaments/upcoming'><span>Tournaments</span>Upcoming</a>
                            <a href=''>Decks</a>
                            <a href=''>Players</a>
                            <a href=''>Articles</a>
                        </div>
                        <div className='useful-row2'>
                            <a href=''>Archive Updates</a>
                            <a href=''>Card Database</a>
                            <a href=''>Deck Builder</a>
                            <a href=''>Rules by Era</a>
                            <a href=''>TCG Expansions</a>
                            <a href=''>Worlds Booklets</a>
                        </div>
                    </div>
                </div>
                <div className='socials-pushed-down'>
                    <p className='useful-links'>Follow / Contact:</p>
                    <hr className='footer-hr'></hr>
                    <div className='footer-socials'>
                        <a href='https://twitter.com/PTCG_Legends' target='_blank' rel="noopener noreferrer">
                            <img src={twitterIcon} alt="social-icon" />
                            <p>Follow on X / Twitter</p>
                        </a>
                        <a href='https://discord.com/invite/P8vKM8REr4' target='_blank' rel="noopener noreferrer">
                            <img src={discordIcon} alt="social-icon" />
                            <p>Join our Discord Community</p>
                        </a>
                        <a href='https://www.patreon.com/PTCGLegends' target='_blank' rel="noopener noreferrer">
                            <img src={patreonIcon} alt="social-icon" />
                            <p>Support us on Patreon</p>
                        </a>
                        <a href='' target='_blank' rel="noopener noreferrer" className='not-ready'>
                            <img src={tiktokIcon} alt="social-icon" />
                            <p>Watch us on Tiktok</p>
                        </a>
                        <a href='mailto:ptcglegends@gmail.com'>
                            <img src={emailIcon} alt="social-icon" />
                            <p>Send us an Email</p>
                        </a>
                    </div>
                </div>
                <div className='unhide-footer'>
                    <p>The literal and graphical information presented on this website about the Pokémon Trading Card Game, including sprites, card text, images and tournament-related content, are copyrights of The Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, Play! Pokémon, and/or Wizards of the Coast. This website is not produced by, endorsed by, supported by, or affiliated with The Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, Play! Pokémon, nor Wizards of the Coast.</p>
                    <br></br>
                    <p>This website is simply a place for Pokémon TCG fans to look at events and results from the greatest game in history!</p>
                </div>
            </div>
            <div className='bottom-footer'>
                <img src={totodileSprite}></img>
                <p>PTCG Legends 3.0 - 2024&nbsp;&nbsp;|&nbsp;&nbsp;Website Design: Alex Wilson&nbsp;&nbsp;|&nbsp;&nbsp;Find me on X / Twitter: <a href='https://twitter.com/alexwilsonTCG' target='_blank' rel="noopener noreferrer">@alexwilsonTCG</a></p>
                <img src={feraligatrSprite}></img>
            </div>
        </footer>
    );
}

export default Footer;
