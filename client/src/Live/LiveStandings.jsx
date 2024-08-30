import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import '../css/live.css';
import { getPokemonSprites } from '../Tournaments/pokemon-sprites';

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
import costaRica from '../assets/flags/costa-rica.png';
import croatia from '../assets/flags/croatia.png';
import czechia from '../assets/flags/czech-republic.png';
import denmark from '../assets/flags/denmark.png';
import ecuador from '../assets/flags/ecuador.png';
import elSalvador from '../assets/flags/el-salvador.png';
import finland from '../assets/flags/finland.png';
import france from '../assets/flags/france.png';
import germany from '../assets/flags/germany.png';
import greece from '../assets/flags/greece.png';
import hongKong from '../assets/flags/hong-kong.png';
import hungary from '../assets/flags/hungary.png';
import iceland from '../assets/flags/iceland.png';
import indonesia from '../assets/flags/indonesia.png';
import ireland from '../assets/flags/ireland.png';
import israel from '../assets/flags/isreal.png';
import isleOfMan from '../assets/flags/im.png';
import italy from '../assets/flags/italy.png';
import japan from '../assets/flags/japan.png';
import southKorea from '../assets/flags/korea.png';
import lithuania from '../assets/flags/lithuania.png';
import malaysia from '../assets/flags/malaysia.png';
import malta from '../assets/flags/malta.png';
import mexico from '../assets/flags/mexico.png';
import morocco from '../assets/flags/morocco.png';
import netherlands from '../assets/flags/netherlands.png';
import newZealand from '../assets/flags/new-zealand.png';
import nicaragua from '../assets/flags/nicaragua.png';
import norway from '../assets/flags/norway.png';
import peru from '../assets/flags/peru.png';
import philippines from '../assets/flags/philippines.png';
import poland from '../assets/flags/poland.png';
import portugal from '../assets/flags/portugal.png';
import puertoRico from '../assets/flags/puerto-rico.png';
import russia from '../assets/flags/russia.png';
import singapore from '../assets/flags/singapore.png';
import slovakia from '../assets/flags/slovakia.png';
import slovenia from '../assets/flags/slovenia.png';
import somalia from '../assets/flags/somalia.png';
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
  AR: argentina,
  AU: australia,
  AT: austria,
  BY: belarus,
  BE: belgium,
  BR: brazil,
  CA: canada,
  CL: chile,
  CN: china,
  CR: costaRica,
  CO: colombia,
  HR: croatia,
  CZ: czechia,
  DK: denmark,
  EC: ecuador,
  SV: elSalvador,
  FI: finland,
  FR: france,
  DE: germany,
  GR: greece,
  HK: hongKong,
  HU: hungary,
  IS: iceland,
  ID: indonesia,
  IE: ireland,
  IL: israel,
  IM: isleOfMan,
  IT: italy,
  JP: japan,
  KR: southKorea,
  LT: lithuania,
  MY: malaysia,
  MT: malta,
  MX: mexico,
  MA: morocco,
  NL: netherlands,
  NZ: newZealand,
  NI: nicaragua,
  NO: norway,
  PE: peru,
  PH: philippines,
  PL: poland,
  PT: portugal,
  PR: puertoRico,
  RU: russia,
  SG: singapore,
  SK: slovakia,
  SI: slovenia,
  SO: somalia,
  ZA: southAfrica,
  ES: spain,
  SE: sweden,
  CH: switzerland,
  TW: taiwan,
  TH: thailand,
  US: usa,
  UK: uk,
  unknown: unknown
}

const LiveStandingsDiv = styled.div`
  color: ${({ theme }) => theme.text};
`;
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.modalbg};
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  button {
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.text};
  }
  .link-to-playerprofile {margin-top: 5px;}
  .second-sprite {margin-left: 0px !important;}
  .player-sprites .second-sprite {margin-left: -7px !important;}
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const normalizeName = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const formatName = (name) => {
  const lowercaseWords = ['de', 'of', 'the', 'van', 'der'];
  const uppercaseWords = ['jw', 'aj', 'dj', 'bj', 'rj', 'cj', 'lj', 'jp', 'kc', 'mj', 'tj', 'cc', 'jj', 'jt', 'jz', 'pj', 'sj', 'pk', 'j.r.', 'ii', 'iii', 'iiii', 'o.s.', 'mk', 'jc'];

  const specialCases = {
    'de haes damien': 'De Haes Damien',
    'jamie depamphilis': 'Jamie DePamphilis'
  };

  const lowerCaseName = name.toLowerCase();
  if (specialCases[lowerCaseName]) {
    return specialCases[lowerCaseName];
  }

  return name
    .toLowerCase()
    .split(' ')
    .map(word =>
      word
        .split('-')
        .map(part =>
          part
            .split("'")
            .map(subPart => {
              if (lowercaseWords.includes(subPart.toLowerCase())) {
                return subPart.toLowerCase();
              } else if (uppercaseWords.includes(subPart.toLowerCase())) {
                return subPart.toUpperCase();
              } else if (subPart.startsWith('mc')) {
                return subPart.charAt(0).toUpperCase() + 'c' + subPart.charAt(2).toUpperCase() + subPart.slice(3);
              } else {
                return subPart.charAt(0).toUpperCase() + subPart.slice(1);
              }
            })
            .join("'")
        )
        .join("-")
    )
    .join(' ');
};

const LiveStandings = ({ eventName }) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showDeckSubmissionModal, setShowDeckSubmissionModal] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [availableDecks, setAvailableDecks] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    console.log('LiveStandings component mounted');
    const fetchStandings = async () => {
      try {
        setLoading(true);
        console.log('Fetching standings...');
        const response = await fetch('/api/live-standings');
        console.log('Full response:', response);
        const text = await response.text();
        console.log('Response text:', text);
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Unexpected HTML response, expected JSON.');
        }
        const data = JSON.parse(text);
        setStandings(data);
        console.log('Fetched standings:', data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch live standings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
    const intervalId = setInterval(fetchStandings, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getCountryFlag = (name) => {
    const countryCodeMatch = name.match(/\[(.*?)\]/);
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : 'unknown';
    const flag = flags[countryCode] || flags['unknown'];
    const playerName = name.replace(/\s*\[.*?\]\s*/g, '');
    return { flag, playerName, countryCode };
  };

  const getCurrentRound = (standings) => {
    const rounds = standings.flatMap(player => Object.keys(player.rounds).map(Number));
    return Math.max(...rounds);
  };

  const currentRound = getCurrentRound(standings);

  const handlePlayerClick = (standing, index) => {
    const { flag, playerName, countryCode } = getCountryFlag(standing.name);
    const { firstSprite, secondSprite } = getPokemonSprites(standing.decklist, standing.sprite1, standing.sprite2);
    setSelectedPlayer({
      ...standing,
      flag,
      playerName: formatName(playerName),
      countryCode,
      placement: index + 1,
      firstSprite,
      secondSprite,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
  };

  const getOpponentDropStatus = (opponentName) => {
    const opponent = standings.find(player => player.name.includes(opponentName));
    return opponent ? opponent.drop : -1;
  };

  const handleDeckSubmission = (opponent) => {
    setSelectedOpponent(opponent);
    setAvailableDecks(['Deck A', 'Deck B', 'Deck C']); // Example options
    setShowDeckSubmissionModal(true);
  };


  const handleDeckSelection = (deck) => {
    console.log(`Selected deck: ${deck} for opponent: ${selectedOpponent.name}`);
    setShowDeckSubmissionModal(false);
  };

  return (
    <LiveStandingsDiv className='center-me marginbottom'>
      {/* <p>Current Round: {currentRound}</p> */}
      <table className='live-table'>
        <thead>
          <tr>
            <th>Standing</th>
            <th>Player</th>
            <th>Record</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const { wins, losses, ties } = standing.record;
            const totalPoints = (wins * 3) + (ties * 1);
            const { flag, playerName } = getCountryFlag(standing.name);

            return (
              <tr key={index} className='live-table-tr' id={`player-${index}`}>
                <td>{standing.placing === 9999 ? "DQ" : standing.placing}</td>
                <td
                  className='live-table-flag-name'
                  onClick={() => handlePlayerClick(standing, index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={flag} alt={standing.name} style={{ width: '20px', marginRight: '8px' }} />
                  {formatName(playerName)}
                </td>
                <td>{wins}-{losses}-{ties}</td>
                <td>{totalPoints}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <>
          <Overlay onClick={closeModal} />
          <Modal className='live-modal'>
            <button onClick={closeModal} className='close-live-modal'>X</button>
            <div className='modal-player-standings'>
              <h2 className='align-center'>
                <span className='player-placement-live'>{selectedPlayer.placement}.&nbsp;&nbsp;</span>
                <img src={selectedPlayer.flag} alt="flag" style={{ width: '20px', marginRight: '8px' }} />
                {selectedPlayer.playerName}
              </h2>
              <span className='selectedplayer-record'>
                <div className='player-sprites'>
                  {selectedPlayer.firstSprite && selectedPlayer.firstSprite !== '/assets/sprites/hyphen.png' && selectedPlayer.firstSprite !== '/assets/sprites/blank.png' && (
                    <img className='sprite' src={selectedPlayer.firstSprite} alt="sprite" />
                  )}
                  {selectedPlayer.secondSprite && selectedPlayer.secondSprite !== '/assets/sprites/hyphen.png' && selectedPlayer.secondSprite !== '/assets/sprites/blank.png' && (
                      <img className='sprite second-sprite' src={selectedPlayer.secondSprite} alt="sprite" />
                  )}
                </div>
                Record: ({selectedPlayer.record.wins}-{selectedPlayer.record.losses}-{selectedPlayer.record.ties}) 
              </span>
              <span className='selectedplayer-record'>
                {eventName}
              </span>
              <Link
                className='link-to-playerprofile'
                to={`/player/${normalizeName(selectedPlayer.playerName)}-${selectedPlayer.countryCode}`}
              >
                Link to Player's Page
              </Link>
            </div>
            <ul>
              {Object.entries(selectedPlayer.rounds)
                .reverse()
                .map(([round, opponent], idx) => {
                  const opponentPlayer = standings.find((player) => player.name.includes(opponent.name));
                  const { playerName: opponentName, flag, countryCode } = getCountryFlag(opponent.name);

                  const { firstSprite, secondSprite } = opponentPlayer
                    ? getPokemonSprites(opponentPlayer.decklist, opponentPlayer.sprite1, opponentPlayer.sprite2)
                    : { firstSprite: '', secondSprite: '' };

                  const backgroundColor =
                    opponent.result === 'W'
                      ? theme.winBg
                      : opponent.result === 'L'
                      ? theme.lossBg
                      : theme.tieBg;

                  const opponentRecord = opponentPlayer ? opponentPlayer.record : null;
                  const opponentRecordText = opponentRecord
                    ? `${opponentRecord.wins}-${opponentRecord.losses}-${opponentRecord.ties}`
                    : '';

                  const opponentDropStatus = getOpponentDropStatus(opponentName);
                  const isBye = opponentName.toLowerCase().includes("bye");
                  const opponentSprites = isBye ? { firstSprite: '/assets/sprites/blank.png', secondSprite: '/assets/sprites/blank.png' } : { firstSprite, secondSprite };

                  const handleOpponentClick = () => {
                    if (opponentPlayer) {
                        setShowModal(false);
                        setTimeout(() => {
                            const opponentIndex = standings.indexOf(opponentPlayer);
                            document.getElementById(`player-${opponentIndex}`).scrollIntoView({ behavior: 'smooth' });
                            setSelectedPlayer({
                                ...opponentPlayer,
                                flag,
                                playerName: formatName(opponentName),
                                countryCode,
                                placement: opponentIndex + 1,
                                firstSprite,
                                secondSprite,
                            });
                            setShowModal(true);
                        }, 300);
                    }
                };
                
                return (
                  <li key={idx} style={{ backgroundColor }}>
                    <div>Rd {round}</div>
                    <div
                      style={{ cursor: isBye ? 'default' : 'pointer', opacity: isBye ? 0.5 : 1 }}
                      onClick={() => !isBye && handleOpponentClick()}
                    >
                      {isBye ? <i>bye</i> : formatName(opponentName)}
                    </div>
                    <div className='opponent-sprites'>
                      {opponentSprites.firstSprite && opponentSprites.firstSprite !== '/assets/sprites/hyphen.png' && (
                        <img className='sprite' src={opponentSprites.firstSprite} alt="sprite" />
                      )}
                      {opponentSprites.secondSprite && opponentSprites.secondSprite !== '/assets/sprites/hyphen.png' && (
                        <img className='sprite second-sprite' src={opponentSprites.secondSprite} alt="sprite" />
                      )}
                      {/* Display the submit button if both sprites are blank */}
                      {opponentSprites.firstSprite === '/assets/sprites/blank.png' && (
                        <button className='submitdeckbtnopp' onClick={() => handleDeckSubmission(opponent)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                          +
                        </button>
                      )}
                    </div>
                    <div>{opponentRecordText}</div>
                    <div className='italic'>{opponentDropStatus !== -1 ? 'dropped' : ''}</div>
                  </li>
                );
              })}
            </ul>
          </Modal>
        </>
      )}

{showDeckSubmissionModal && (
        <>
          <Overlay onClick={() => setShowDeckSubmissionModal(false)} />
          <Modal className='deck-submission-modal'>
            <button onClick={() => setShowDeckSubmissionModal(false)}>X</button>
            <h3>Select Deck for {selectedOpponent.name}</h3>
            <ul>
              {availableDecks.map((deck, idx) => (
                <li key={idx}>
                  <button onClick={() => handleDeckSelection(deck)}>{deck}</button>
                </li>
              ))}
            </ul>
          </Modal>
        </>
      )}
    </LiveStandingsDiv>
  );
};

export default LiveStandings;
