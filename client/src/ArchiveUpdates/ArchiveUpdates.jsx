import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import SidebarComponent from '../SideContent/SideContent'
import '../css/articles.css';
import fbIcon from '../assets/social-media-icons/facebook.png';
import patreonIcon from '../assets/social-media-icons/patreon-icon.png';
import archiveImage from '../assets/archive-updates/apr-archive.jpg';

import yveltal from '../../public/assets/sprites/yveltal.png'
import garbodor from '../../public/assets/sprites/garbodor.png'
import jumpluff from '../../public/assets/sprites/jumpluff.png'
import rhyperior from '../../public/assets/sprites/rhyperior.png'
import regigigas from '../../public/assets/sprites/regigigas.png'
import tyranitar from '../../public/assets/sprites/tyranitar.png'
import machamp from '../../public/assets/sprites/machamp.png'
import empoleon from '../../public/assets/sprites/empoleon.png'
import bronzong from '../../public/assets/sprites/bronzong.png'
import gardevoir from '../../public/assets/sprites/gardevoir.png'
import absol from '../../public/assets/sprites/absol.png'
import eevee from '../../public/assets/sprites/eevee.png'
import eelektrik from '../../public/assets/sprites/eelektrik.png'
import mewtwo from '../../public/assets/sprites/mewtwo.png'
import emboar from '../../public/assets/sprites/emboar.png'
import magnezone from '../../public/assets/sprites/magnezone.png'
import altaria from '../../public/assets/sprites/altaria.png'
import garchomp from '../../public/assets/sprites/garchomp.png'
import blank from '../../public/assets/sprites/blank.png'
import blastoise from '../../public/assets/sprites/blastoise.png'
import darkrai from '../../public/assets/sprites/darkrai.png'
import flygon from '../../public/assets/sprites/flygon.png'
import exeggutor from '../../public/assets/sprites/exeggutor.png'
import terrakion from '../../public/assets/sprites/terrakion.png'
import unownexclamation from '../../public/assets/sprites/unown-exclamation.png'
import kyurem from '../../public/assets/sprites/kyurem.png'
import deoxys from '../../public/assets/sprites/deoxys.png'
import sableye from '../../public/assets/sprites/sableye.png'
import gallade from '../../public/assets/sprites/gallade.png'
import gliscor from '../../public/assets/sprites/gliscor.png'
import spiritomb from '../../public/assets/sprites/spiritomb.png'
import tyrantiar from '../../public/assets/sprites/tyranitar.png'
import shiftry from '../../public/assets/sprites/shiftry.png'
import glaceon from '../../public/assets/sprites/glaceon.png'
import blaziken from '../../public/assets/sprites/blaziken.png'
import ninetales from '../../public/assets/sprites/ninetales.png'
import slaking from '../../public/assets/sprites/slaking.png'
import gorebyss from '../../public/assets/sprites/gorebyss.png'
import rayquaza from '../../public/assets/sprites/rayquaza.png'
import lanturn from '../../public/assets/sprites/lanturn.png'
import swampert from '../../public/assets/sprites/swampert.png'
import leafeon from '../../public/assets/sprites/leafeon.png'
import donphan from '../../public/assets/sprites/donphan.png'
import muk from '../../public/assets/sprites/muk.png'
import wobbuffet from '../../public/assets/sprites/wobbuffet.png'
import serperior from '../../public/assets/sprites/serperior.png'
import abomasnow from '../../public/assets/sprites/abomasnow.png'
import aggron from '../../public/assets/sprites/aggron.png'
import pumpkaboo from '../../public/assets/sprites/pumpkaboo.png'
import joltik from '../../public/assets/sprites/joltik.png'
import genesect from '../../public/assets/sprites/genesect.png'
import hippowdon from '../../public/assets/sprites/hippowdon.png'
import raichu from '../../public/assets/sprites/raichu.png'
import gengar from '../../public/assets/sprites/gengar.png'
import trevenant from '../../public/assets/sprites/trevenant.png'
import reshiram from '../../public/assets/sprites/reshiram.png'
import volcanion from '../../public/assets/sprites/volcanion.png'
import megamanectric from '../../public/assets/sprites/manectric-mega.png'
import keldeo from '../../public/assets/sprites/keldeo-resolute.png'
import crobat from '../../public/assets/sprites/crobat.png'
import landorustherian from '../../public/assets/sprites/landorus-therian.png'
import seismitoad from '../../public/assets/sprites/seismitoad.png'
import manectric from '../../public/assets/sprites/manectric.png'
import groudonprimal from '../../public/assets/sprites/groudon-primal.png'
import trubbish from '../../public/assets/sprites/trubbish.png'
import flareon from '../../public/assets/sprites/flareon.png'
import klinklang from '../../public/assets/sprites/klinklang.png'

const ArticleContainer = styled.div`
    width: 100%;
    color: ${({ theme }) => theme.text};

    .new-div-fix-wrap {
      color: ${({ theme }) => theme.text};
    }
    
    .top-article-image {
      background-image: url(${archiveImage});
      width: 80%;height:300px;
      background-position: 50% 40%;
      background-repeat: no-repeat;
      background-size: cover;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }
`;

const ArchiveUpdates = () => {
  return (
    <div className='new-homepage'>
      <ArticleContainer className='article-container'>
        <Helmet>
          <title>Documented Archive Updates</title>
          <meta name="description" content="All documented additions and updates to our site - updated monthly." />
          <meta property="og:title" content="Documented Archive Updates" />
          <meta property="og:description" content="All documented additions and updates to our site - updated monthly." />
          {/* <meta property='og:image' content='https://i.ibb.co/mrSpd4V3/legends-thumbnail.png' /> */}
          <meta property="og:url" content="https://www.ptcglegends.com/" />
          <meta property="og:type" content="website" />
          <meta name="author" content="PTCG Legends" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Documented Archive Updates" />
          <meta name="twitter:description" content="All documented additions and updates to our site - updated monthly." />
          {/* <meta name="twitter:image" content="https://i.ibb.co/mrSpd4V3/legends-thumbnail.png" /> */}
        </Helmet>
        <div className='article-title'>
          <h2>Documented Archive Updates</h2>
          <p>Last Updated: Apr 8, 2026</p>
        </div>

        {/* Article Image */}
        <div className='top-article-image'></div>

        {/* Article Content */}
        <div className='article-content archive-updates'>

          {/* <hr className='archive-updates-mini-hr'></hr> */}

          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>April 2026</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>

          <a href='/tournaments/tournaments/2017_EUIC' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={volcanion} alt="sprite" />
            </div>
            <p>Nicolas Galaz (Masters) - 33<sup>rd</sup> Place <span>2017 EUIC</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Alex Dao (Masters) - 62<sup>nd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Alex%20Koch-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={klinklang} alt="sprite" />
              <img className="sprite second-sprite" src={bronzong} alt="sprite" />
            </div>
            <p>Alex Koch (Masters) - 87<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2009_WORLDS' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={flygon} alt="sprite" />
              <img className="sprite second-sprite" src={abomasnow} alt="sprite" />
            </div>
            <p>Anna Schipper (Masters) - 25<sup>th</sup> Place <span>2009 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>March 2026</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Grant Manley (Masters) - 33<sup>rd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={landorustherian} alt="sprite" />
              <img className="sprite second-sprite" src={crobat} alt="sprite" />
            </div>
            <p>Israel Sosa (Masters) - 34<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Ryan%20Moorhouse-GB' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Ryan Moorhouse (Masters) - 35<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={raichu} alt="sprite" />
              <img className="sprite second-sprite" src={crobat} alt="sprite" />
            </div>
            <p>Frank Diaz (Masters) - 36<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blastoise} alt="sprite" />
              <img className="sprite second-sprite" src={keldeo} alt="sprite" />
            </div>
            <p>Brandon Cantu (Masters) - 37<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={landorustherian} alt="sprite" />
              <img className="sprite second-sprite" src={raichu} alt="sprite" />
            </div>
            <p>Clifton Goh (Masters) - 38<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Andrea%20Ceolin-IT' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Andrea Ceolin (Masters) - 39<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={seismitoad} alt="sprite" />
              <img className="sprite second-sprite" src={garbodor} alt="sprite" />
            </div>
            <p>Marcus Raj (Masters) - 41<sup>st</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={donphan} alt="sprite" />
            </div>
            <p>Gawein Wagner (Masters) - 42<sup>nd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Christian%20Cruz%20Esquivel-MX' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={donphan} alt="sprite" />
            </div>
            <p>Christian Cruz (Masters) - 43<sup>rd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={seismitoad} alt="sprite" />
              <img className="sprite second-sprite" src={garbodor} alt="sprite" />
            </div>
            <p>Jason Yong (Masters) - 44<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={groudonprimal} alt="sprite" />
              <img className="sprite second-sprite" src={wobbuffet} alt="sprite" />
            </div>
            <p>Kenny Britton (Masters) - 46<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Johnny Rabus (Masters) - 47<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Connor%20Finton-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={groudonprimal} alt="sprite" />
              <img className="sprite second-sprite" src={wobbuffet} alt="sprite" />
            </div>
            <p>Connor Finton (Masters) - 51<sup>st</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Josh%20Marking-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={hippowdon} alt="sprite" />
            </div>
            <p>Josh Marking (Masters) - 52<sup>nd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          
          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={donphan} alt="sprite" />
            </div>
            <p>Steffen Eriksen (Masters) - 53<sup>rd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Dylan%20Bryan-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={raichu} alt="sprite" />
              <img className="sprite second-sprite" src={bronzong} alt="sprite" />
            </div>
            <p>Dylan Bryan (Masters) - 54<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Christopher%20Schemanske-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={trevenant} alt="sprite" />
              <img className="sprite second-sprite" src={gengar} alt="sprite" />
            </div>
            <p>Christopher Schemanske (Masters) - 56<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={seismitoad} alt="sprite" />
              <img className="sprite second-sprite" src={genesect} alt="sprite" />
            </div>
            <p>Takuya Yoneda (Masters) - 60<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Bob%20Zhang-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={flareon} alt="sprite" />
              <img className="sprite second-sprite" src={empoleon} alt="sprite" />
            </div>
            <p>Bob Zhang (Masters) - 63<sup>rd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={landorustherian} alt="sprite" />
              <img className="sprite second-sprite" src={crobat} alt="sprite" />
            </div>
            <p>Samuel Sosa (Masters) - 69<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={megamanectric} alt="sprite" />
              <img className="sprite second-sprite" src={trubbish} alt="sprite" />
            </div>
            <p>Kyle Sabelhaus (Masters) - 70<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Jordan Nelle (Masters) - 72<sup>nd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Benjamin%20Pham-NL' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={megamanectric} alt="sprite" />
              <img className="sprite second-sprite" src={reshiram} alt="sprite" />
            </div>
            <p>Benjamin Pham (Masters) - 81<sup>st</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Jonathan%20Paranada-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={joltik} alt="sprite" />
              <img className="sprite second-sprite" src={pumpkaboo} alt="sprite" />
            </div>
            <p>Jonathan Paranada (Masters) - 88<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          
          <a href='/tournaments/2015_WORLDS/masters/Nathan%20Brower-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={groudonprimal} alt="sprite" />
              <img className="sprite second-sprite" src={wobbuffet} alt="sprite" />
            </div>
            <p>Nathan Brower (Masters) - 89<sup>st</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Mike%20Fouchet-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={raichu} alt="sprite" />
              <img className="sprite second-sprite" src={crobat} alt="sprite" />
            </div>
            <p>Mike Fouchet (Masters) - 95<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Jit%20Min%20Lim-SG' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={raichu} alt="sprite" />
              <img className="sprite second-sprite" src={bronzong} alt="sprite" />
            </div>
            <p>Jit Min Lim (Masters) - 97<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={megamanectric} alt="sprite" />
              <img className="sprite second-sprite" src={genesect} alt="sprite" />
            </div>
            <p>Long Bui (Masters) - 103<sup>rd</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Kristy%20Britton-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={seismitoad} alt="sprite" />
              <img className="sprite second-sprite" src={manectric} alt="sprite" />
            </div>
            <p>Kristy Britton (Masters) - 104<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          
          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={seismitoad} alt="sprite" />
              <img className="sprite second-sprite" src={manectric} alt="sprite" />
            </div>
            <p>Manuel Riemis (Masters) - 106<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>
          
          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={groudonprimal} alt="sprite" />
              <img className="sprite second-sprite" src={hippowdon} alt="sprite" />
            </div>
            <p>Sebastian Lugo (Masters) - 107<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={hippowdon} alt="sprite" />
            </div>
            <p>Lukas Peer (Masters) - 111<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters/Justin%20Aaron-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={hippowdon} alt="sprite" />
            </div>
            <p>Justin Aaron (Masters) - 112<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={hippowdon} alt="sprite" />
            </div>
            <p>Niklas Rappel (Masters) - 113<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={landorustherian} alt="sprite" />
              <img className="sprite second-sprite" src={leafeon} alt="sprite" />
            </div>
            <p>Brad Curcio (Masters) - 115<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={hippowdon} alt="sprite" />
            </div>
            <p>Luca Schuster (Masters) - 116<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={landorustherian} alt="sprite" />
              <img className="sprite second-sprite" src={crobat} alt="sprite" />
            </div>
            <p>Kolton Day (Masters) - 119<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={seismitoad} alt="sprite" />
              <img className="sprite second-sprite" src={manectric} alt="sprite" />
            </div>
            <p>Tord Reklev (Masters) - 126<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <a href='/tournaments/2015_WORLDS/masters' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={landorustherian} alt="sprite" />
              <img className="sprite second-sprite" src={crobat} alt="sprite" />
            </div>
            <p>Fatih Akdemir (Masters) - 127<sup>th</sup> Place <span>2015 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>
          
          <a href='/tournaments/2010_WORLDS/masters/Stephan%20Nørregård-DK' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={gengar} alt="sprite" />
              <img className="sprite second-sprite" src={garchomp} alt="sprite" />
            </div>
            <p>Stephan Nørregård (Masters) - 30<sup>th</sup> Place <span>2010 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2004_WC_SC/masters/Kory%20S-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={slaking} alt="sprite" />
              <img className="sprite second-sprite" src={gorebyss} alt="sprite" />
            </div>
            <p>Kory S (Masters) - 7<sup>th</sup> Place <span>2004 West Coast Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_WC_SC/seniors/Stuart%20B-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={gardevoir} alt="sprite" />
            </div>
            <p>Stuart B (Seniors) - 1<sup>st</sup> Place <span>2004 West Coast Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_WC_SC/seniors/Mike%20C-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blaziken} alt="sprite" />
              <img className="sprite second-sprite" src={rayquaza} alt="sprite" />
            </div>
            <p>Mike C (Seniors) - 2<sup>nd</sup> Place <span>2004 West Coast Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_WC_SC/seniors/Jon%20Brooks-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={shiftry} alt="sprite" />
              <img className="sprite second-sprite" src={ninetales} alt="sprite" />
            </div>
            <p>Jon Brooks (Seniors) - 3<sup>rd</sup> Place <span>2004 West Coast Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_WC_SC/seniors/Andrew%20Knaack-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blaziken} alt="sprite" />
              <img className="sprite second-sprite" src={rayquaza} alt="sprite" />
            </div>
            <p>Andrew Knaack (Seniors) - 4<sup>th</sup> Place <span>2004 West Coast Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_S_SC/seniors/juniors/Rachael%20B-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={lanturn} alt="sprite" />
            </div>
            <p>Rachael B (Juniors) - 1<sup>st</sup> Place <span>2004 West Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_S_SC/seniors/juniors/Reed%20Weichler-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={swampert} alt="sprite" />
            </div>
            <p>Reed Weichler (Juniors) - 2<sup>nd</sup> Place <span>2004 West Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_S_SC/seniors/juniors/Josh%20G-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={muk} alt="sprite" />
              <img className="sprite second-sprite" src={wobbuffet} alt="sprite" />
            </div>
            <p>Josh G (Juniors) - 3<sup>rd</sup> Place <span>2004 West Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2004_S_SC/seniors/juniors/Patrick%20W-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={machamp} alt="sprite" />
              <img className="sprite second-sprite" src={aggron} alt="sprite" />
            </div>
            <p>Patrick W (Juniors) - 4<sup>th</sup> Place <span>2004 West Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2004_S_SC/seniors/Jordan%20D-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blaziken} alt="sprite" />
              <img className="sprite second-sprite" src={ninetales} alt="sprite" />
            </div>
            <p>Jordan D (Seniors) - 3<sup>rd</sup> Place <span>2004 South Stadium Challenge</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>
          <p style={{ fontWeight: 600 }}>Corrections:</p>

          <a href='/tournaments/2011_NATS_US/masters/James%20Arnold-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={tyranitar} alt="sprite" />
              <img className="sprite second-sprite" src={serperior} alt="sprite" />
            </div>
            <p>James Arnold (Masters) - 7<sup>th</sup> Place <span>2011 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> -4 Basic Darkness Energy | +4 Special Darkness Energy</p>

          <a href='/tournaments/2008_WORLDS/masters/Esa%20Juntunen-FI' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={glaceon} alt="sprite" />
              <img className="sprite second-sprite" src={absol} alt="sprite" />
            </div>
            <p>Esa Juntunen (Masters) - 8<sup>th</sup> Place <span>2008 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> Wrong Glaceon corrected</p>


          <p className='shout-out'>Shout-out to all the people I personally pestered for their lists, <a href='https://x.com/Whimsicast' target='_blank' rel='noopener noreferrer'>Whimsicast</a> for some of the 2015 Worlds lists and the 2010 Worlds list, Limitless for the Top 128 list, and <a href='https://x.com/2_riskee' target='_blank'>@2_riskee</a> for finding the Stadium Challenge lists on pokegym! (all three sources below)</p>
          <ul className='shout-out' style={{marginTop: '-15px', marginLeft: '25px', display: 'flex', flexDirection: 'row'}}>
            <li style={{marginRight: '35px'}}><a href='https://pokegym.net/community/index.php?threads/deck-that-got-me-to-worlds.8595/' target='_blank'>source 1</a></li>
            <li style={{marginRight: '35px'}}><a href='https://pokegym.net/community/index.php?threads/east-coast-stadium-challenge-report.8765/' target='_blank'>source 2</a></li>
            <li style={{marginRight: '35px'}}><a href='https://pokegym.net/community/index.php?threads/10-under-top-4-decks.8761/#post-106724' target='_blank'>source 3</a></li>
          </ul>

          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>October 2025</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>

          <a href='/tournaments/2008_WORLDS/masters/Esa%20Juntunen-FI' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={glaceon} alt="sprite" />
              <img className="sprite second-sprite" src={absol} alt="sprite" />
            </div>
            <p>Esa Juntunen (Masters) - 8<sup>th</sup> Place <span>2008 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> -4 Team Galactic's Wager | +4 Team Galactic's Mars</p>

          <a href='/tournaments/2004_WORLDS/masters/Kenneth%20Wong-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={shiftry} alt="sprite" />
            </div>
            <p>Kenneth Wong (Masters) - 7<sup>th</sup> Place <span>2004 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> -2 Sentret (62 cards)</p>

          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>September 2025</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>

          <a href='/tournaments/2010_NATS_US/masters/Ryan%20Murray-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={gardevoir} alt="sprite" />
              <img className="sprite second-sprite" src={gallade} alt="sprite" />
            </div>
            <p>Ryan Murray (Masters) - 43<sup>rd</sup> Place <span>2010 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <a href='/tournaments/2010_NATS_US/masters/Chris%20Abernathy-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={gliscor} alt="sprite" />
              <img className="sprite second-sprite" src={spiritomb} alt="sprite" />
            </div>
            <p>Chris Abernathy (Masters) - 60<sup>th</sup> Place <span>2010 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <a href='/tournaments/2010_NATS_US/masters/Stephen%20Silvestro-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={tyrantiar} alt="sprite" />
              <img className="sprite second-sprite" src={machamp} alt="sprite" />
            </div>
            <p>Stephen Silvestro (Masters) - 88<sup>th</sup> Place <span>2010 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>
          <a href='/tournaments/2009_WORLDS/masters/Chris%20Fulop-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={flygon} alt="sprite" />
              <img className="sprite second-sprite" src={machamp} alt="sprite" />
            </div>
            <p>Chris Fulop (Masters) - 19<sup>th</sup> Place <span>2009 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>
          <a href='/tournaments/2007_WORLDS/masters/Jason%20Windham-AU' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={flygon} alt="sprite" />
              <img className="sprite second-sprite" src={exeggutor} alt="sprite" />
            </div>
            <p>Jason Windham (Masters) - 26<sup>th</sup> Place <span>2007 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          
          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>August 2025</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>

          <a href='/tournaments/2014_WORLDS/masters/Trevore%20Read-CA' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={yveltal} alt="sprite" />
              <img className="sprite second-sprite" src={garbodor} alt="sprite" />
            </div>
            <p>Trevore Read (Masters) - 27<sup>th</sup> Place <span>2014 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2013_WORLDS/seniors' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={terrakion} alt="sprite" />
              <img className="sprite second-sprite" src={garbodor} alt="sprite" />
            </div>
            <p>Jeremy Gibson (Seniors) - 10<sup>th</sup> Place <span>2013 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>
          <a href='/tournaments/2013_WORLDS/seniors' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={kyurem} alt="sprite" />
              <img className="sprite second-sprite" src={deoxys} alt="sprite" />
            </div>
            <p>Alexander Weber (Seniors) - 11<sup>th</sup> Place <span>2013 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>
          <a href='/tournaments/2013_WORLDS/seniors' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={darkrai} alt="sprite" />
              <img className="sprite second-sprite" src={sableye} alt="sprite" />
            </div>
            <p>Jacob Howard (Seniors) - 13<sup>th</sup> Place <span>2013 Worlds</span> <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2012_WORLDS/masters/Aaron%20Curry-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={mewtwo} alt="sprite" />
              <img className="sprite second-sprite" src={eelektrik} alt="sprite" />
            </div>
            <p>Aaron Curry (Masters) - 13<sup>th</sup> Place <span>2012 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2012_WORLDS/masters/Austin%20Baggs-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={darkrai} alt="sprite" />
              <img className="sprite second-sprite" src={mewtwo} alt="sprite" />
            </div>
            <p>Austin Baggs (Masters) - 24<sup>th</sup> Place <span>2012 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2011_WORLDS/masters/Lorenzo%20Voltolina-IT' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={emboar} alt="sprite" />
              <img className="sprite second-sprite" src={magnezone} alt="sprite" />
            </div>
            <p>Lorenzo Voltolina (Masters) - 7<sup>th</sup> Place <span>2011 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2011_WORLDS/masters/Marco%20Escher-IT' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={emboar} alt="sprite" />
              <img className="sprite second-sprite" src={magnezone} alt="sprite" />
            </div>
            <p>Marco Escher (Masters) - 27<sup>th</sup> Place <span>2011 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2010_NATS_US/masters/John%20Kettler-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={jumpluff} alt="sprite" />
            </div>
            <p>John Kettler (Masters) - 66<sup>th</sup> Place <span>2010 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <hr className='archive-updates-mini-hr'></hr>

          <a href='/tournaments/2007_WORLDS/masters/Daniel%20Cohen-AT' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={rhyperior} alt="sprite" />
            </div>
            <p>Daniel Cohen (Masters) - 28<sup>th</sup> Place <span>2007 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2007_WORLDS/masters/Max%20Benczek-DE' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={absol} alt="sprite" />
              <img className="sprite second-sprite" src={eevee} alt="sprite" />
            </div>
            <p>Max Benczek (Masters) -  32<sup>nd</sup> Place <span>2007 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2007_WORLDS/masters/Allan%20Apter-BR' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={flygon} alt="sprite" />
              <img className="sprite second-sprite" src={exeggutor} alt="sprite" />
            </div>
            <p>Allan Apter (Masters) -  58<sup>th</sup> Place <span>2007 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>

          <a href='/tournaments/2007_WORLDS/masters' className='new-div-fix-wrap'>
          <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={unownexclamation} alt="sprite" />
            </div>
            <p><span>2007 Worlds</span> (Masters) &nbsp;33<sup>rd</sup> - 60<sup>th</sup> Placements <span className='small-text-archive archive-update-nolist'>list&nbsp;X</span></p>
          </a>

          <hr className='archive-updates-mini-hr'></hr>
          <p style={{ fontWeight: 600 }}>Corrections:</p>

          <a href='/tournaments/2014_WORLDS/masters/Chase%20Moloney-CA' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={yveltal} alt="sprite" />
              <img className="sprite second-sprite" src={garbodor} alt="sprite" />
            </div>
            <p>Chase Moloney (Masters) - 6<sup>th</sup> Place <span>2014 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> Wrong Trubbish fixed</p>

          <a href='/tournaments/2013_NATS_US/masters/Ross%20Cawthon-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={garchomp} alt="sprite" />
              <img className="sprite second-sprite" src={altaria} alt="sprite" />
            </div>
            <p>Ross Cawthon (Masters) - 54<sup>th</sup> Place <span>2013 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> Completely wrong list accidently...</p>

          <a href='/tournaments/2010_WORLDS/masters/Tomi%20Sjöblom-FI' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={regigigas} alt="sprite" />
            </div>
            <p>Tomi Sjöblom (Masters) - 12<sup>th</sup> Place <span>2010 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> -1 VS Seeker | -1 Time Space Destortion | +1 Night Maintenance | +1 Pokemon Rescue</p>

          <a href='/tournaments/2010_NATS_US/masters/Aaron%20Curry-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={tyranitar} alt="sprite" />
              <img className="sprite second-sprite" src={machamp} alt="sprite" />
            </div>
            <p>Aaron Curry (Masters) - 28<sup>th</sup> Place <span>2010 US Nationals</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> -2 Judge | +1 Expert Belt | +1 Night Maintenance</p>

          <a href='/tournaments/2008_WORLDS/seniors/Aziz%20Al-Yami-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={empoleon} alt="sprite" />
              <img className="sprite second-sprite" src={bronzong} alt="sprite" />
            </div>
            <p>Aziz Al-Yami (Seniors) - 5<sup>th</sup> Place <span>2008 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> -5 Roseanne's Research | +3 Roseanne's Research | +2 Professor Rowan</p>

          <a href='/tournaments/2004_WORLDS/seniors/Kevin%20Nguyen-US' className='new-div-fix-wrap'>
            <div className="player-deck-icons">
              <img className="sprite" src={blank} alt="sprite" />
              <img className="sprite second-sprite" src={gardevoir} alt="sprite" />
            </div>
            <p>Kevin Nguyen (Seniors) -  2<sup>nd</sup> Place <span>2004 Worlds</span> <span className='small-text-archive archive-update-has-list'>list&nbsp;✔</span></p>
          </a>
          <p className='shortcircuited'><strong>Correction:</strong> Wrong Ralts, Skitty & Magnemite fixed</p>

          <br></br>
          <p className='shout-out'>Shout-out to <a href='https://x.com/Whimsicast' target='_blank' rel='noopener noreferrer'>Whimsicast</a> for nearly all of the above updates this month & <a href='https://x.com/PtcgArchive' target='_blank' rel='noopener noreferrer'>PTCG Archive</a> for the 32<sup>nd</sup> Place list from '07 Worlds!</p>

          {/* */}
          {/* 2024 */}
          {/* */}
          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>August 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>New Event Archived:</p>
          <p>• <a href='/tournaments/2000_MEGA_TROPICAL_BATTLE/seniors'>2000 Tropical Mega Battle</a></p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p>• <a href='/tournaments/2010_NATS_US/seniors/Michael%20Diaz-US'>2010 US Nationals</a> 1<sup>st</sup> Place (Seniors) - LuxChomp <span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}>(list)</span></p>
          <p>• <a href='/tournaments/2015_WORLDS/masters/Jason%20Martinez-US'>2015 World Championships</a> 10<sup>th</sup> Place (Masters) - Toad Manectric Bats <span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}>(list)</span></p>
          <p>• <a href='/tournaments/2018_NAIC/masters/Caleb%20Rice-US'>2018 NAIC</a> 85<sup>th</sup> Place (Masters) - BuzzGarb <span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}>(list)</span></p>

          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>June 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p className='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2012/hgss-nxd#zekchamp' className='not-ready'>2012 (HGS-NXD)</a> Zekrom Machamp</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p className='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> 31<sup>st</sup> Place (older division) - Donphan Slowking <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/juniors'>2002 World Championships</a> 16<sup>th</sup> Place (younger division) - Kingdra <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/juniors'>2002 World Championships</a> 24<sup>th</sup> Place (younger division) - Dark Feraligatr <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/juniors/Dillon%20Jarman-US'>2002 World Championships</a> 29<sup>th</sup> Place (younger division) - Kingdra <span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}>(list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/professors'>2002 World Championships</a> 32<sup>nd</sup> Place (professor) - Tyranitar <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2007_WORLDS/masters/Steffen%20Eriksen-DK'>2007 World Championships</a> 12<sup>th</sup> Place (Masters) - Flygon <span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}>(list)</span></p>
          <p>• <a href='/tournaments/2008_NATS_US/masters/Mike%20Fouchet-US'>2008 US Nationals</a> 4th Place - Gardevoir<span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}> (list)</span></p>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p className='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='/tournaments/2007_WORLDS/juniors/Paul%20Atanassov-CA'>2007 World Championships</a> 4<sup>th</sup> Place (Juniors) - Flariados</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Eevee corrected</p>
          <p>• <a href='/tournaments/2012_WORLDS/seniors/Henry%20Prior-US'>2012 World Championships</a> 16<sup>th</sup> Place (Seniors) - Chandygor</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Munna corrected</p>
          <p>• <a href='/tournaments/2015_WORLDS/seniors/Calvin%20Connor-US'>2015 World Championships</a> 5<sup>th</sup> Place (Seniors) - Klinklang</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Klang corrected</p>

          <hr className='title-hr' />
          <br />
          <h3 className='boxxed'>May 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p className='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2002/n1-lc#darkferaligatr' className='not-ready'>2002 (N1-LC)</a> Dark Feraligatr</p>
          <p>• <a href='../decks-by-era/2002/n1-lc#lanturn' className='not-ready'>2002 (N1-LC)</a> Lanturn Slowking</p>
          <p>• <a href='../decks-by-era/2003/n1-sk#zardsaur' className='not-ready'>2003 (N1-SK)</a> Charizard Venusaur</p>
          <p>• <a href='../decks-by-era/2003/n1-sk#lugiavena' className='not-ready'>2003 (N1-SK)</a> Lugia Venusaur</p>
          <p>• <a href='../decks-by-era/2008/hp-md#raichuzong' className='not-ready'>2008 (HP-MD)</a> Raichu Bronzong</p>
          <p>• <a href='../decks-by-era/2013/bw-plf#snorlax' className='not-ready'>2013 (BW-PLF)</a> Snorlax (Block)</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p className='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> 3<sup>rd</sup> Place (older division) - Dark Tyranitar <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors/Joe%20Spanier-US'>2002 World Championships</a> 5<sup>th</sup> Place (older division) - Lanturn Slowking</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> 12<sup>th</sup> Place (older division) - Blastoise <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors/Eric%20Brooks-US'>2002 World Championships</a> 14<sup>th</sup> Place (older division) - Espeon Slowking</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors/David%20Marquardt-US'>2002 World Championships</a> 16<sup>th</sup> Place (older division) - Dark Feraligatr</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> 17<sup>th</sup> Place (older division) - Espeon <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/juniors'>2002 World Championships</a> 17<sup>th</sup> Place (younger division) - Kingdra <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/professors'>2002 World Championships</a> 11<sup>th</sup> Place (professor) - Kingdra Muk <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/professors'>2002 World Championships</a> 22<sup>nd</sup> Place (professor) - Espeon Kingdra <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/professors'>2002 World Championships</a> 24<sup>th</sup> Place (professor) - Ninetales Steelix <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/professors'>2002 World Championships</a> 26<sup>th</sup> Place (professor) - Gengar <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='../major-events/2009/global-nationals-results' className='not-ready'>2009 France Nationals</a> 1<sup>st</sup> Place (Masters) - Gyarados</p>
          <p>• <a href='../major-events/2009/global-nationals-results' className='not-ready'>2009 France Nationals</a> 2<sup>nd</sup> Place (Masters) - Porygon-Z</p>
          <p>• <a href='/tournaments/2009_NATS_US/masters/Stephen%20Silvestro-US'>2009 US Nationals</a> 21<sup>st</sup> Place (Masters) - Stephen Silvestro - Beedrill</p>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p className='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='../decks-by-era/2009/dp-pl#speedrill' className='not-ready'>2008 (DP-PL)</a> Speedrill</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Kakuna corrected</p>
          <p>• <a href='../major-events/2009/global-nationals-results' className='not-ready'>2009 Germany Nationals </a> 3<sup>rd</sup> Place (Masters) - Tyranitar</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Palkia Lv.X line corrected</p>
          <p>• <a href='../decks-by-era/2013/nxd-plb#snorlax' className='not-ready'>2013 (BW-PLB)</a> Snorlax (Block)</p>
          <p>&nbsp;&nbsp;&nbsp;- Moved from incorrect format BW-PLF</p>
          <p>• <a href='../decks-by-era/2016/prc-evo#loooord' className='not-ready'>2016 (PRC-EVO)</a> Wailord EX</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Carbink</p>
          <br />
          <br />
          <p><i>( HUGE shout out and a massive thank you to <a href='https://twitter.com/Pkmn_RubyRetro' target='_blank' rel='noopener noreferrer'>Ruby Retro</a> for finding the 2002 World Championship results above! )</i></p>
          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>April 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2005/rs-em#rocloc' className='not-ready'>2005 RS - EM</a> Rock Lock (Build 1)</p>
          <p>• <a href='../decks-by-era/2006/hl-hp#ockock' className='not-ready'>2006 HL - HP</a> Rock Lock (Build 1)</p>
          <p>• <a href='../decks-by-era/2009/dp-pl#machamppalkia' className='not-ready'>2009 DP - PL</a> Machamp Palkia</p>
          <p>• <a href='../decks-by-era/2016/xy-sts#mmtwojolt' className='not-ready'>2016 XY - STS</a> Mega Mewtwo Jolteon</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> 13<sup>th</sup> Place - Feraligatr Parasect <span class='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2005_WORLDS/masters/Jaime%20Guerrero-US'>2005 World Championships</a> 5<sup>th</sup> Place - Jaime Guerrero's Rock Lock</p>
          <p>• <a href='/tournaments/2006_WORLDS/masters/Jaime%20Guerrero-US'>2006 World Championships</a> 9<sup>th</sup> Place - Jaime Guerrero's Rock Lock</p>
          <p>• <a href='../major-events/2008/global-nationals-results' className='not-ready'>2008 Italy Nationals</a> 4<sup>th</sup> Place - Banette Gorebyss <span class='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='../major-events/2013/global-nationals-results' className='not-ready'>2013 Australia Nationals</a> Senior's Finals <span class='small-text-archive'>(no lists)</span></p>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p class='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='../decks-by-era/2011/md-col#regi2' className='not-ready'>2011 MD - COL</a> Regigigas (Build 1)</p>
          <p>&nbsp;&nbsp;&nbsp;- 4 Collector and 2 Judge instead of 6 Collector</p>
          <p>• <a href='../decks-by-era/2013/bw-plf#watchlock' className='not-ready'>2013 BW - PLF</a> Watchlock</p>
          <p>&nbsp;&nbsp;&nbsp;- Wrong Amoongus</p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>March 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2010/dp-ul#flygross' className='not-ready'>2010 DP - UL</a> Flygon Metagross</p>
          <p>• <a href='../decks-by-era/2012/bw-drx#dragon' className='not-ready'>2012 BW - DRX</a> Hydreigon</p>
          <p>• <a href='../decks-by-era/2016/bw-fco#beesflareon' className='not-ready'>2016 BW - FCO</a> Vespiquen Flareon (Build 2)</p>
          <p>• <a href='../decks-by-era/2018/bkt-fli#zmewtwo' className='not-ready'>2018 BKT - FLI</a> Zoroark Mewtwo</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2002_WCSC/seniors'>2002 WC Stadium Challenge</a> 2<sup>nd</sup> Place - Kingdra Slowking <span class='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WCSC/seniors'>2002 WC Stadium Challenge</a> 1<sup>st</sup> Place - Feraligatr <span class='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WCSC/seniors'>2002 WC Stadium Challenge</a> 8<sup>th</sup> Place - Kingdra <span class='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_CSC/masters'>2002 Central Stadium Challenge</a> 5<sup>th</sup> Place - Pooka - Meganium <span class='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2018_NAIC/masters/Jeremiah%20Schmutz-US'>2018 NAIC</a> 66<sup>th</sup> Place - Jeremiah Schmutz <span className='small-text-archive' style={{ color: 'rgb(33, 175, 38)' }}>(list)</span></p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>February 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>New Event Page:</p>
          <p class='small-text-archive'>(The below page(s), have been added to the completed tournaments page.)</p>
          <p>• <a href='/tournaments/2001_STS_QUALIFIER_SE'>2001 Super Trainer Showdown Qualifier</a> 600+ player event documented</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> 14<sup>th</sup> Place (Sr) - Espeon Slowking <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/juniors'>2002 World Championships</a> 10<sup>th</sup> Place (Jr) - Ampharos Raichu <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/juniors'>2002 World Championships</a> 13<sup>th</sup> Place (Jr) - Dark Blastoise <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='../major-events/2006/global-nationals-results' className='not-ready'>2006 UK Nationals</a> 5<sup>th</sup> Place (Sr) - DragTrode</p>
          <p>• <a href='../major-events/2007/global-nationals-results' className='not-ready'>2007 Denmark Nationals</a> Top 4 <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='../major-events/2008/global-nationals-results' className='not-ready'>2008 Denmark Nationals</a> Top 4 <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='../major-events/2008/global-nationals-results' className='not-ready'>2008 Netherlands Nationals</a> 5<sup>th</sup> Place - Empoleon</p>
          <p>• <a href='/tournaments/2010_NATS_US/masters/Stephen%20M-US'>2010 US Nationals</a> 47<sup>th</sup> Place - SableLock</p>
          <p>• <a href='/tournaments/2010_NATS_US/masters/Zachary%20Mirman-US'>2010 US Nationals</a> 56<sup>th</sup> Place - SableLock</p>
          <br />
          <p><i>( HUGE shout out and a massive thank you to Ruby Retro for finding the Sweden STS Qualifier info and Richard Pietrek & Whimsicast for finding some of the newly discovered results above! )</i></p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>January 2024</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2001/bs-n4#jumpluff' className='not-ready'>2001 BS - N4</a> Jumpluff</p>
          <p>• <a href='../decks-by-era/2002/n1-lc#blastoisesteelix' className='not-ready'>2002 N1 - LC</a> Dark Blastoise Steelix</p>
          <p>• <a href='../decks-by-era/2002/n1-lc#kingdra' className='not-ready'>2002 N1 - LC</a> Kingdra - Top 32 Worlds</p>
          <p>• <a href='../decks-by-era/2002/n1-lc#arcanine' className='not-ready'>2002 N1 - LC</a> Arcanine Entei</p>
          <p>• <a href='../decks-by-era/2004/expedit-hidleg#aquateam3' className='not-ready'>2004 EX - HL</a> Team Aqua (3)</p>
          <p>• <a href='../decks-by-era/2013/nxd-plb#flareon' className='not-ready'>2013 NXD - PLB</a> Flareon (Build 2)</p>
          <p>• <a href='../decks-by-era/2017/prc-gri#garbodortrevenant' className='not-ready'>2017 PRC - SUM</a> Garbodor Trevenant</p>
          <p>• <a href='../decks-by-era/2017/prc-gri#tauros' className='not-ready'>2017 PRC - SUM</a> Tauros Garbodor</p>
          <p>• <a href='../decks-by-era/2017/bw-sm#manectric' className='not-ready'>2017 BW - SUM</a> Mega Manectric (Metal)</p>
          <p>• <a href='../decks-by-era/2018/sum-lot#beastbox' className='not-ready'>2018 SUM - LOT</a> Beast Box</p>
          <p>• <a href='../decks-by-era/2018/sum-lot#honchkrow' className='not-ready'>2018 SUM - LOT</a> Honchkrow (Spread)</p>
          <p>• <a href='../decks-by-era/2018/sum-lot#sylveon' className='not-ready'>2018 SUM - LOT</a> Sylveon <i>GX</i></p>
          <p>• <a href='../decks-by-era/2018/sum-lot#zorogarb' className='not-ready'>2018 SUM - LOT</a> Zoroark Garbodor</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2001_CA_STS_DAY2'>2001 CA Super Trainer Showdown</a> Muliple decks confirmed</p>
          <p>• <a href='/tournaments/2002_ECSC/seniors'>2002 EC Stadium Challenge</a> Professor Event results added</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> Top 8 - Kevin Cheng (Kingdra) - <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> Top 16 - Drew Holton (Dark Blastoise) - <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors/Yi-An%20Lu-UK'>2002 World Championships</a> Top 32 - Yi-An Lu (Kingdra)</p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> Top 32 - Jonathan Brooks (Espeon Slowking )- <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> Top 32 - Joey Fulford (Dark Feraligatr) - <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> Top 32 - Alex Schanz (Steelix Gyarados) - <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <p>• <a href='/tournaments/2002_WORLDS/seniors'>2002 World Championships</a> Top 32 - Zer-Ken Yap (Dark Blastoise) - <span className='small-text-archive' style={{ color: 'rgb(255, 80, 80)' }}>(no list)</span></p>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p class='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='../decks-by-era/2017/prc-bus#eyezma' className='not-ready'>2017 PRC - BUS</a> Decidueye Necrozma (Level Ball instead of Heavy Ball)</p>

          <br />
          <p><i>( HUGE shout out and a massive thank you to <a href='https://www.youtube.com/@rubyretro' target='_blank' rel='noopener noreferrer'>Ruby Retro</a> for uncovering all the 2001-2002 results above! )</i></p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>December 2023</h3>
          <br />
          <p style={{ fontWeight: 600 }}>New Video:</p>
          <p>• <a href='../articles/retro/blastoise-mega-battle' className='not-ready'>Footage</a> from the FIRST EVER broadcasted Pokémon tournament in history!</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#aerodactylmew2' className='not-ready'>1999 BS - FO</a> Aerodactyl Mewtwo</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#eeclefabe' className='not-ready'>1999 BS - FO</a> Clefable</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#dgg' className='not-ready'>1999 BS - FO</a> Drought (Golduck)</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#exeggutor' className='not-ready'>1999 BS - FO</a> Exeggutor</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#moltres-stall' className='not-ready'>1999 BS - FO</a> Moltres Lickitung Stall (Build 1)</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#wigglypeek' className='not-ready'>1999 BS - FO</a> Wigglypeek</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#wigglytuff-magmar' className='not-ready'>1999 BS - FO</a> Wigglytuff Magmar (Build 1)</p>
          <p>• <a href='../decks-by-era/2011/md-col#regi2' className='not-ready'>2011 MD - COL</a> Regigigas (Build 1)</p>
          <p>• <a href='../decks-by-era/2019/4-upr-unm#beheeyem' className='not-ready'>2019 UPR - UNM</a> Beheeyem (Build 2)</p>
          <br />
          <p style={{ fontWeight: 600 }}>Updated Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have received updates in our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#alakazam' className='not-ready'>1999 BS - FO</a> Alakazam</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#electabuzz-magmar' className='not-ready'>1999 BS - FO</a> Magmar Electabuzz</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#venusaur' className='not-ready'>1999 BS - FO</a> Venusaur</p>
          {/* <p>• <a href='../decks-by-era/2011/hgss-bw#truth' className='not-ready'>2011 Worlds</a> Ross Cawthon's The Truth - Link to his Event Report added</p> */}
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p class='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='../major-events/2008/global-nationals-results' className='not-ready'>2008 Germany Nats</a> Finn Looft's Gallade Lock (Celio instead of Aarons)</p>
          <p>• <a href='../decks-by-era/2011/md-bw#sabledonk' className='not-ready'>2011 MD-BW</a> Sabledonk (Wrong Alph Lithograph has been corrected)</p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>November 2023</h3>
          <br />
          <p style={{ fontWeight: 600 }}>New Format Page:</p>
          <p>• <a href='../decks-by-era/2011/md-bw' className='not-ready'>2011 MD-BW</a> format page added with 16 new decks</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2009/dp-pl#kingdra' className='not-ready'>2009 DP - PL</a> Kindra - Jimmy O'Brein</p>
          <p>• <a href='../decks-by-era/2010/dp-ul#flyphan' className='not-ready'>2010 DP - UL</a> Flygon Donphan</p>
          <p>• <a href='../decks-by-era/2010/dp-ul#jumplf' className='not-ready'>2010 DP - UL</a> Jumpluff (Build 2)</p>
          <p>• <a href='../decks-by-era/2010/dp-ul#jumplf' className='not-ready'>2010 DP - UL</a> Jumpluff (Build 3)</p>
          <p>• <a href='../decks-by-era/2011/md-col#arceus' className='not-ready'>2011 MD - COL</a> Arceus</p>
          <p>• <a href='../decks-by-era/2011/md-col#staraptor' className='not-ready'>2011 MD - COL</a> Luxray Staraptor</p>
          <p>• <a href='../decks-by-era/2011/md-col#magnezone' className='not-ready'>2011 MD - COL</a> Magnezone</p>
          <p>• <a href='../decks-by-era/2011/md-col#magnephan' className='not-ready'>2011 MD - COL</a> Magnezone Donphan</p>
          <p>• <a href='../decks-by-era/2011/md-col#mamoswine' className='not-ready'>2011 MD - COL</a> Mamoswine</p>
          <p>• <a href='../decks-by-era/2011/md-col#palkia-lucario' className='not-ready'>2011 MD - COL</a> Palkia Lucario</p>
          <p>• <a href='../decks-by-era/2011/md-col#sablechomp' className='not-ready'>2011 MD - COL</a> Sablelock (Build 1)</p>
          <p>• <a href='../decks-by-era/2013/nxd-plb#plasma' className='not-ready'>2013 NXD - PLB</a> Plasma (Build 2)</p>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p class='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='../decks-by-era/2010/dp-ul#shupp' className='not-ready'>2010 DP-UL</a> Shuppet Donk - Credited to Azul Garcia Griego</p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>October 2023</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2011_WORLDS/seniors/Ryan%20McGregor-US'>2011 World Championships</a> Top 8 (sr) MegaZone - Ryan McGregor</p>
          <p>• <a href='/tournaments/2018_EUIC/masters/Raz%20Wolpe-IL'>2018 EUIC</a> 33<sup>rd</sup> Place Volcanion - Raz Wolpe</p>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/1999/bs#arctrode' className='not-ready'>1999 Base Set</a> Magmar Electrode</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#arcmar' className='not-ready'>1999 BS-FO</a> Magmar Arcanine (Build 1) - Jason Klaczynski</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#scyther' className='not-ready'>1999 BS-FO</a> Scyther Hitmonchan - Jason Klaczynski</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#magchanduo' className='not-ready'>1999 BS-FO</a> Magmar Hitmonchan - Jason Klaczynski</p>
          <p>• <a href='../decks-by-era/2004/expedit-hidleg#exploudtile' className='not-ready'>2004 EX-HL</a> Exploud Sceptile</p>
          <p>• <a href='../decks-by-era/2004/expedit-hidleg#muk' className='not-ready'>2004 EX-HL</a> Muk <i>ex</i></p>
          <p>• <a href='../decks-by-era/2004/expedit-hidleg#ninjask' className='not-ready'>2004 EX-HL</a> Ninjask</p>
          <p>• <a href='../decks-by-era/2004/expedit-hidleg#typhlosion' className='not-ready'>2004 EX-HL</a> Typhlosion <i>ex</i></p>
          <p>• <a href='../decks-by-era/2008/hp-md#feonortar' className='not-ready'>2008 HP-MD</a> Magmortar Leafeon (Build 2)</p>
          <p>• <a href='../decks-by-era/2009/dp-pl#galactic' className='not-ready'>2009 DP-PL</a> Galactic's Toolbox</p>
          <p>• <a href='../decks-by-era/2011/md-col#gydos' className='not-ready'>2011 MD-COL</a> Gyarados (Build 2) - Dustin Zimmerman</p>
          <p>• <a href='../decks-by-era/2011/hgss-nvi#mewbox' className='not-ready'>2011 HGSS-NVI</a> MewBox - Jason Klaczynski</p>
          <p>• <a href='../decks-by-era/2011/hgss-nvi#raichu' className='not-ready'>2011 HGSS-NVI</a> Raichu Eels</p>
          <p>• <a href='../decks-by-era/2011/hgss-nvi#sharpedo' className='not-ready'>2011 HGSS-NVI</a> Sharpedo</p>
          <p>• <a href='../decks-by-era/2011/hgss-nvi#ttar' className='not-ready'>2011 HGSS-NVI</a> Tyranitar + Dragons</p>
          <p>• <a href='../decks-by-era/2018/bkt-fli#gourgeist' className='not-ready'>2018 BKT-FLI</a> Gourgeist</p>
          <p>• <a href='../decks-by-era/2018/bkt-ces#hooh-salazzle' className='not-ready'>2018 BKT-CES</a> Ho-oh Salazzle</p>
          <p>• <a href='../decks-by-era/2019/sum-teu#dark-ninetales' className='not-ready'>2019 SUM-TEU</a> Dark Alolan Ninetales</p>
          <br />
          <p style={{ fontWeight: 600 }}>Corrections:</p>
          <p class='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='/tournaments/2000_NJ_STS/seniors/Andrew%20Daly-unknown'>2000 NJ STS</a> Andrew Daly's Top 8 - Haymaker Arcanine</p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>September 2023</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='../major-events/2004/global-nationals-results' className='not-ready'>2004 Germany Nationals</a> 1<sup>st</sup> Place (sr) Kingdra</p>
          <p>• <a href='../major-events/2005/global-nationals-results' className='not-ready'>2005 Austria Nationals</a> Top 4 DragTrode</p>
          <p>• <a href='../major-events/2005/global-nationals-results' className='not-ready'>2005 Netherlands Nationals</a> Top 8 Spinning Tail</p>
          <p>• <a href='../major-events/2006/global-nationals-results' className='not-ready'>2006 Germany Nationals</a> Top 4 Mew Lock</p>
          <p>• <a href='../major-events/2007/global-nationals-results' className='not-ready'>2007 Germany Nationals</a> 1<sup>st</sup> Place Grumpig Stall</p>
          <p>• <a href='../major-events/2007/global-nationals-results' className='not-ready'>2008 Netherlands Nationals</a> 1<sup>st</sup> Place Empoleon</p>
          <p>• <a href='../major-events/2007/global-nationals-results' className='not-ready'>2008 Italy Nationals</a> 1<sup>st</sup> Place Magmortar Togekiss</p>
          <p>• <a href='../major-events/2007/global-nationals-results' className='not-ready'>2008 Germany Nationals</a> 1<sup>st</sup> Place Gardevoir - Karl Peters</p>
          <p>• <a href='/tournaments/2009_NATS_US'>2009 US Nationals</a> Top 16 & Top 32 Luxray Techs</p>
          <p>• <a href='../major-events/2009/global-nationals-results' className='not-ready'>2009 Germany Nationals</a> Masters & Seniors Results</p>
          <p>• <a href='/tournaments/2010_NATS_US/masters/Adam%20Capriola-US'>2010 US Nationals</a> Top 64 Gyarados - Adam Capriola</p>
          <p>• <a href='/tournaments/2012_WORLDS/seniors/Henry%20Prior-US'>2012 World Championships</a> Top 16 (sr) Chandygor - Henry Prior</p>
          <p>• <a href='../major-events/2012/global-nationals-results' className='not-ready'>2012 Germany Nationals</a> 2<sup>nd</sup> Place Terrakion Mewtwo</p>
          <p>• <a href='../major-events/2012/global-nationals-results' className='not-ready'>2012 Germany Nationals</a> Top 4 Celebi Mewtwo</p>
          <p>• <a href='../major-events/2013/global-nationals-results' className='not-ready'>2013 Germany Nationals</a> Top 16 Klinklang</p>
          <br /><p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#lickimuk' className='not-ready'>1999 BS-FO</a> Lickitung Muk Stall - Jason Klaczynski</p>
          <p>• <a href='../decks-by-era/1999/bs-fossil#hitting-lickitung' className='not-ready'>1999 BS-FO</a> Hitmonchan Lickitung</p>
          <p>• <a href='../decks-by-era/2001/tr-n3#jumpluff' className='not-ready'>2001 TR-N3</a> Jumpluff Espeon</p>
          <p>• <a href='../decks-by-era/2002/n1-lc#darkggar' className='not-ready'>2002 N1-LC</a> Dark Gengar Slowking</p>
          <p>• <a href='../decks-by-era/2005/rs-em#spinningtail' className='not-ready'>2005 RS-EM</a> Spinning Tail (Ttar Kingdra)</p>
          <p>• <a href='../decks-by-era/2008/hp-md#magkiss' className='not-ready'>2008 HP-MD</a> Magmortar Togekiss</p>
          <p>• <a href='../decks-by-era/2009/dp-rr#machamp' className='not-ready'>2009 DP-RR</a> Machamp - Stephen Silvestro</p>
          <p>• <a href='../decks-by-era/2009/dp-rr#blaziken' className='not-ready'>2009 DP-RR</a> Blaziken - Tobias Thesing</p>
          <p>• <a href='../decks-by-era/2009/dp-rr#ttar' className='not-ready'>2009 DP-RR</a> Tyranitar</p>
          <p>• <a href='../decks-by-era/2009/dp-rr#dialga-palkia' className='not-ready'>2009 DP-RR</a> Palkia Dialga</p>
          <p>• <a href='../decks-by-era/2009/dp-rr#spdialga' className='not-ready'>2009 DP-RR</a> Dialga (SP Box)</p>
          <p>• <a href='../decks-by-era/2011/md-col#gydos' className='not-ready'>2011 MD-COL</a> Gyarados (Build 1) - Stephen Silvestro</p>
          <p>• <a href='../decks-by-era/2012/hgss-nxd#mewbox' className='not-ready'>2012 HGSS-NXD</a> Mew Box - Sander Wojcik</p>
          <p>• <a href='../decks-by-era/2016/bw-fco#plumebox' className='not-ready'>2016 BW-FCO</a> Plume Box (Build 2)</p>
          <p>• <a href='../decks-by-era/2017/bw-sm#trevenant' className='not-ready'>2017 BW-SUM</a> Trevenant</p>
          <p>• <a href='../decks-by-era/2017/prc-sum#darkair' className='not-ready'>2017 PRC-SUM</a> Darkrai Dragonair</p>
          <p>• <a href='../decks-by-era/2017/prc-sum#darkraigarb' className='not-ready'>2017 PRC-SUM</a> Darkrai Garbodor</p>
          <p>• <a href='../decks-by-era/2017/prc-sum#houndoom' className='not-ready'>2017 PRC-SUM</a> Houndoom Mill</p>
          <p>• <a href='../decks-by-era/2018/bw-lot#gardevoir' className='not-ready'>2018 BW-LOT</a> Mega Gardevoir</p>
          <p>• <a href='../decks-by-era/2019/4-upr-unm#beheeyem-beasts' className='not-ready'>2019 UPR-UNM</a> Beheeyem + Beasts - Mike Fouchet</p>

          <br /><p style={{ fontWeight: 600 }}>Corrections:</p>
          <p class='small-text-archive'>(The below list(s) had some form of correction.)</p>
          <p>• <a href='/tournaments/2009_WORLDS/masters/Jay%20Hornung-US'>2009 Worlds</a> Jay Hornung's 3<sup>rd</sup> Place - Flygon Machamp</p>
          <p>• <a href='/tournaments/2017_NAIC/juniors/Regan%20Retzloff-US'>2017 NAIC</a> Regan Retzloff's 1<sup>st</sup> Place (jr) - Rainbow Road</p>
          <p>• <a href='/tournaments/2017_NAIC/masters/Ciaran%20Farah-CA'>2017 NAIC</a> Ciaran Farah's Top 64 - Mega Gardevoir</p>

          <br />
          <p><i>( HUGE shout out and a massive thank you to Richard Pietrek for discovering nearly every global Nationals result and list above! )</i></p>

          <hr className='title-hr' />
          <br />
          <h3 class='boxxed'>August 2023</h3>
          <br />
          <p style={{ fontWeight: 600 }}>Newly Discovered Results:</p>
          <p class='small-text-archive'>(The below result(s), (some with lists), have been added to their respective event pages.)</p>
          <p>• <a href='/tournaments/2001_NJ_STS/masters/Bruce%20Long-unknown'>2001 NJ Super Trainer Showdown</a> Top 8 Arcanine - Bruce Long</p>
          <p>• <a href='/tournaments/2001_NJ_STS_DAY1/masters/Bruce%20Long-unknown'>2001 NJ Super Trainer Showdown</a> Top 8 Victreebel - Bruce Long</p>
          <p>• <a href='/tournaments/2004_NATS_US/masters/Kyle%20Sucevich-US'>2004 US Nationals</a> 2<sup>nd</sup> Place Walrein - Kyle "Pooka" Sucevich</p>
          <p>• <a href='/tournaments/2005_NATS_US/masters/Kyle%20Sucevich-US'>2005 US Nationals</a> Top 8 Metagross - Kyle "Pooka" Sucevich</p>
          <p>• <a href='/tournaments/2011_WORLDS/masters/Dylan%20Lefavour-US'>2011 World Championships</a> Top 8 Reshiphlosion - Dylan Lefavour</p>
          <p>• <a href='/tournaments/2011_WORLDS/seniors/Miloslav%20Poslední-CZ'>2011 World Championships</a> Top 16 (sr) Stage 1s - Miloslav Poslední</p>
          <p>• <a href='/tournaments/2011_WORLDS/juniors/Sydney%20Morisoli-US'>2011 World Championships</a> Top 16 (jr) Reshiphlosion - Sydney Morisoli</p>
          <p>• <a href='/tournaments/2011_NATS_US/masters/Kyle%20Sucevich-US'>2011 US Nationals</a> 2<sup>nd</sup> Place Stage 1s - Kyle "Pooka" Sucevich</p>
          <p>• <a href='/tournaments/2011_NATS_US/juniors/Sydney%20Morisoli-US'>2011 US Nationals</a> 2<sup>nd</sup> Place Reshiphlosion - Sydney Morisoli</p>
          <p>• <a href='/tournaments/2013_NATS_US/masters/Dylan%20Lefavour-US'>2013 US Nationals</a> Top 32 Blastoise - Dylan Lefavour</p><br />
          <p style={{ fontWeight: 600 }}>Newly Archived Decks:</p>
          <p class='small-text-archive'>(The below deck(s) have been added to our <a href="https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/main">Decks by Era</a> section.)</p>
          <p>• <a href='../decks-by-era/2011/md-col#prizes' className='not-ready'>2011 MD-COL</a> Prize Mill (Magnezone Floatzle)</p>

          <br />
          <hr></hr>
          <br />
          <br />
          <p><i>~ Archive updates were not documented prior to August of 2023 ~</i></p>
          <hr className='title-hr' />

        </div>

        <div className='article-title'>
          <p className='share'>
            <i className="material-symbols-outlined">ios_share</i>&nbsp;Share Page:&nbsp;&nbsp;
            <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">Tweet</a>
            <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
            &nbsp;&nbsp;
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://ptcglegends.com/archive-updates/" target="_blank" rel="noopener noreferrer">
              <img className='a-social' src={fbIcon} alt='Facebook' />
            </a>
          </p>
          <p className='share'>
            Support Us on Patreon:&nbsp;&nbsp;
            <a href='https://www.patreon.com/PTCGLegends' target='_'>
              <img className='a-social' src={patreonIcon} alt='Patreon' style={{ borderRadius: '50%' }} />
            </a>
          </p>
        </div>
      </ArticleContainer>

      <SidebarComponent></SidebarComponent>
    </div>
  );
};

export default ArchiveUpdates;
