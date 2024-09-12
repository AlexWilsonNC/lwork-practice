import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CalculateMeta = styled.div`
  padding-left: 25px;
  margin-bottom: 25px;
  width: 27%;
  color: ${({ theme }) => theme.text};
  select, input {
    background-color: transparent !important;
    color: ${({ theme }) => theme.text};
    margin: 0 0 6px 15px;
    border-radius: 2px;
    border: 1px solid grey;
    padding: 2px 5px;
    width: 115px;
  }
  h4 {
    font-size: 18px;
    text-decoration: underline;
    margin-bottom: 5px;
  }
  ol {
      padding-left: 35px;
  }
  button {
    padding: 5px 7px;
    font-weight: bold;
  }
  .marginfive {margin-bottom: 10px;}
`;
const SpriteContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  img {
    width: 55px;
    height: auto;
  }
`;

const decks = [
    "Regidrago",
    "Raging Bolt",
    "Charizard Pidgeot",
    "Lugia Archeops",
    "Iron Thorns",
    "Gardevoir",
    "Snorlax",
    "Ancient Box",
    "Miraidon",
    "Dragapult",
    "Chien-Pao",
    "Pidgeot Control",
    "Gholdengo",
    "Roaring Moon (Turbo)",
    "Radiant Charizard LZB",
    "Banette ex",
    "United Wings",
];
const archetypeSpriteOverrides = {
    "Regidrago": { "sprite1": "regidrago", sprite2: "ogerpon" },
    "Raging Bolt": { sprite1: "raging-bolt", sprite2: "ogerpon" },
    "Charizard Pidgeot": { sprite1: "charizard", sprite2: "pidgeot" },
    "Lugia Archeops": { sprite1: "lugia", sprite2: "archeops" },
    "Iron Thorns": { sprite1: "blank", sprite2: "ironthorns" },
    "Gardevoir": { sprite1: "blank", sprite2: "gardevoir" },
    "Snorlax": { sprite1: "blank", sprite2: "snorlax" },
    "Ancient Box": { sprite1: "roaring-moon", sprite2: "flutter-mane" },
    "Miraidon": { sprite1: "blank", sprite2: "miraidon" },
    "Dragapult": { sprite1: "blank", sprite2: "dragapult" },
    "Chien-Pao": { sprite1: "chien-pao", sprite2: "baxcalibur" },
    "Pidgeot Control": { sprite1: "blank", sprite2: "pidgeot" },
    "Gholdengo": { sprite1: "blank", sprite2: "gholdengo" },
    "Roaring Moon (Turbo)": { sprite1: "blank", sprite2: "roaring-moon" },
    "Radiant Charizard LZB": { sprite1: "comfey", sprite2: "charizard-shiny" },
    "Banette ex": { sprite1: "blank", sprite2: "banette" },
    "United Wings": { sprite1: "flamigo", sprite2: "murkrow" },
  };
  
const DeckCalculator = () => {
  const [matchupWinRates, setMatchupWinRates] = useState({});
  const [metaShare, setMetaShare] = useState({});
  const [calculatedWinRates, setCalculatedWinRates] = useState([]);

  // Load values from localStorage when the component mounts
  useEffect(() => {
    const savedMatchupWinRates = localStorage.getItem('matchupWinRates');
    const savedMetaShare = localStorage.getItem('metaShare');
    const savedCalculatedWinRates = localStorage.getItem('calculatedWinRates');

    if (savedMatchupWinRates) {
      setMatchupWinRates(JSON.parse(savedMatchupWinRates));
    }
    if (savedMetaShare) {
      setMetaShare(JSON.parse(savedMetaShare));
    }
    if (savedCalculatedWinRates) {
      setCalculatedWinRates(JSON.parse(savedCalculatedWinRates));
    }
  }, []);

  // Save matchupWinRates and metaShare to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('matchupWinRates', JSON.stringify(matchupWinRates));
  }, [matchupWinRates]);

  useEffect(() => {
    localStorage.setItem('metaShare', JSON.stringify(metaShare));
  }, [metaShare]);

  // Update matchup win rate for a specific deck and its opponent
  const handleWinRateChange = (deck, opponent, value) => {
    const winRate = parseFloat(value);
    const reciprocalValue = 100 - winRate; // Calculate the reciprocal win rate for the opponent
    
    setMatchupWinRates((prev) => ({
      ...prev,
      [deck]: {
        ...prev[deck],
        [opponent]: winRate,
      },
      [opponent]: {
        ...prev[opponent],
        [deck]: reciprocalValue, // Set the reciprocal win rate for the opponent
      },
    }));
  };

  // Update meta share percentage for each deck
  const handleMetaShareChange = (deck, value) => {
    setMetaShare((prev) => ({
      ...prev,
      [deck]: parseFloat(value),
    }));
  };

  // Calculate overall expected win rate for each deck and sort them by highest to lowest
  const calculateAllExpectedWinRates = () => {
    const calculated = {};
    decks.forEach((deck) => {
      const winRates = matchupWinRates[deck] || {};
      let expectedWinRate = 0;
      Object.keys(winRates).forEach((opponent) => {
        const winRate = winRates[opponent] / 100 || 0;
        const opponentMetaShare = metaShare[opponent] / 100 || 0;
        expectedWinRate += winRate * opponentMetaShare;
      });
      calculated[deck] = (expectedWinRate * 100).toFixed(2);
    });

    // Convert to array and sort by expected win rates in descending order
    const sortedWinRates = Object.entries(calculated).sort(([, a], [, b]) => b - a);
    setCalculatedWinRates(sortedWinRates);
    localStorage.setItem('calculatedWinRates', JSON.stringify(sortedWinRates)); // Save calculated win rates
  };

  // Helper function to generate the options for win rate percentages
  const generateWinRateOptions = () => {
    const options = [];
    for (let i = 10; i <= 90; i += 5) { // Exclude 0%, 5%, 95%, and 100%
      options.push(
        <option key={i} value={i}>
          {i}%
        </option>
      );
    }
    return options;
  };

  return (
    <CalculateMeta>
      <div>
      <SpriteContainer>
  {decks.map((deck) => {
    const overriddenSprites = archetypeSpriteOverrides[deck] || { sprite1: deck.sprite1, sprite2: deck.sprite2 };
    console.log(`Rendering ${deck}`, overriddenSprites); // Debugging output

    return (
      <div key={deck}>
        <img
          src={`/assets/sprites/${overriddenSprites.sprite1}.png`}
          alt={`${deck} sprite 1`}
        />
        <img
          src={`/assets/sprites/${overriddenSprites.sprite2}.png`}
          alt={`${deck} sprite 2`}
        />
      </div>
    );
  })}
</SpriteContainer>

        <br></br>
        <h3>Select Deck Match-Ups</h3>
        <br></br>
        {decks.map((deck) => (
          <div key={deck}>
            <h4>{deck}</h4>
            {decks
              .filter((opponent) => opponent !== deck) // Exclude the same deck from the dropdown
              .map((opponent) => (
                <div key={opponent}>
                  <label>{`win % vs ${opponent}:`}</label>
                  <select
                    onChange={(e) =>
                      handleWinRateChange(deck, opponent, e.target.value)
                    }
                    value={
                      matchupWinRates[deck]?.[opponent] || ''
                    }
                  >
                    <option value="" disabled>
                        &nbsp;win rate&nbsp;
                    </option>
                    {generateWinRateOptions()}
                  </select>
                </div>
              ))}
            <br />
          </div>
        ))}
      </div>
      <hr></hr>
      <br></br>
      <div>
        <h3 className='marginfive'>Set Meta Share (%)</h3>
        {decks.map((deck) => (
          <div key={deck}>
            <label>{`${deck}:`}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              onChange={(e) => handleMetaShareChange(deck, e.target.value)}
              placeholder="meta share (%)"
              value={metaShare[deck] || ''}
            />
          </div>
        ))}
      </div>

      <br />
      <div>
        <button onClick={calculateAllExpectedWinRates}>
          Calculate
        </button>
      </div>
      <br></br>
      <div>
        <h3>Calculated Expected Win Rates</h3>
        {calculatedWinRates.length > 0 ? (
            <ol>
            {calculatedWinRates.map(([deck, winRate], index) => {
                let backgroundColor = 'transparent';
                if (index === 0) backgroundColor = 'gold';
                else if (index === 1) backgroundColor = 'silver';
                else if (index === 2) backgroundColor = 'brown'; // Bronze color as brown

                return (
                <li key={deck} style={{ backgroundColor }}>
                    {`${deck}: ${winRate}%`}
                </li>
                );
            })}
            </ol>
        ) : (
            <p>Please select values and click the button to calculate.</p>
        )}
      </div>
    </CalculateMeta>
  );
};

export default DeckCalculator;
