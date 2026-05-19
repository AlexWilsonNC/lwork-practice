import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisplayPokemonSprites from '../Tournaments/pokemon-sprites';
import '../css/tournamentreports.css';

const blankRound = round => ({
  round,
  opponentName: '',
  opponentDeck: {
    sprite1: '',
    sprite2: '',
    label: ''
  },
  result: 'W',
  wentFirst: 'unknown',
  notes: ''
});

export default function TournamentReportForm() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('League Challenge');
  const [format, setFormat] = useState('');
  const [placement, setPlacement] = useState('');
  const [playerDeck, setPlayerDeck] = useState({
    sprite1: '',
    sprite2: '',
    label: ''
  });
  const [rounds, setRounds] = useState([blankRound(1)]);
  const [saving, setSaving] = useState(false);

  const updateRound = (index, field, value) => {
    setRounds(prev =>
      prev.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    );
  };

  const updateOpponentDeck = (index, field, value) => {
    setRounds(prev =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              opponentDeck: {
                ...r.opponentDeck,
                [field]: value
              }
            }
          : r
      )
    );
  };

  const addRound = () => {
    setRounds(prev => [...prev, blankRound(prev.length + 1)]);
  };

  const removeRound = index => {
    setRounds(prev =>
      prev
        .filter((_, i) => i !== index)
        .map((r, i) => ({ ...r, round: i + 1 }))
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('PTCGLegendsToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setSaving(true);

      const res = await fetch('/api/user/tournament-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventName,
          eventType,
          format,
          placement: placement ? Number(placement) : null,
          playerDeck,
          rounds
        })
      });

      if (!res.ok) throw new Error('Could not save report');

      const data = await res.json();
      navigate(`/tournament-reports/${data.report._id}`);
    } catch (err) {
      console.error(err);
      alert('Could not save tournament report');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="report-page">
      <form className="report-card" onSubmit={handleSubmit}>
        <h1>Create Tournament Report</h1>

        <div className="report-grid">
          <label>
            Event Name
            <input value={eventName} onChange={e => setEventName(e.target.value)} required />
          </label>

          <label>
            Event Type
            <select value={eventType} onChange={e => setEventType(e.target.value)}>
              <option>League Challenge</option>
              <option>League Cup</option>
              <option>Regional</option>
              <option>International</option>
              <option>World Championship</option>
              <option>Online Tournament</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Format
            <input placeholder="SVI-BLK" value={format} onChange={e => setFormat(e.target.value)} required />
          </label>

          <label>
            Placement
            <input type="number" value={placement} onChange={e => setPlacement(e.target.value)} />
          </label>
        </div>

        <h2>Your Deck</h2>

        <div className="sprite-row">
          <input
            placeholder="sprite1, e.g. gardevoir"
            value={playerDeck.sprite1}
            onChange={e => setPlayerDeck(d => ({ ...d, sprite1: e.target.value }))}
            required
          />
          <input
            placeholder="sprite2 optional"
            value={playerDeck.sprite2}
            onChange={e => setPlayerDeck(d => ({ ...d, sprite2: e.target.value }))}
          />
          <input
            placeholder="Deck label optional"
            value={playerDeck.label}
            onChange={e => setPlayerDeck(d => ({ ...d, label: e.target.value }))}
          />
        </div>

        {playerDeck.sprite1 && (
          <div className="sprite-preview">
            <DisplayPokemonSprites sprite1={playerDeck.sprite1} sprite2={playerDeck.sprite2 || 'blank'} />
            <span>{playerDeck.label || 'Your Deck'}</span>
          </div>
        )}

        <h2>Rounds</h2>

        {rounds.map((round, index) => (
          <div className="round-card" key={index}>
            <div className="round-header">
              <h3>Round {round.round}</h3>
              {rounds.length > 1 && (
                <button type="button" onClick={() => removeRound(index)}>
                  Remove
                </button>
              )}
            </div>

            <div className="report-grid">
              <label>
                Opponent Name
                <input
                  value={round.opponentName}
                  onChange={e => updateRound(index, 'opponentName', e.target.value)}
                />
              </label>

              <label>
                Result
                <select
                  value={round.result}
                  onChange={e => updateRound(index, 'result', e.target.value)}
                >
                  <option value="W">Win</option>
                  <option value="L">Loss</option>
                  <option value="T">Tie</option>
                  <option value="ID">Intentional Draw</option>
                  <option value="BYE">Bye</option>
                  <option value="NO_SHOW">Opponent No Show</option>
                </select>
              </label>

              <label>
                Went First/Second
                <select
                  value={round.wentFirst}
                  onChange={e => updateRound(index, 'wentFirst', e.target.value)}
                >
                  <option value="unknown">Unknown</option>
                  <option value="first">First</option>
                  <option value="second">Second</option>
                </select>
              </label>
            </div>

            <div className="sprite-row">
              <input
                placeholder="opponent sprite1"
                value={round.opponentDeck.sprite1}
                onChange={e => updateOpponentDeck(index, 'sprite1', e.target.value)}
              />
              <input
                placeholder="opponent sprite2 optional"
                value={round.opponentDeck.sprite2}
                onChange={e => updateOpponentDeck(index, 'sprite2', e.target.value)}
              />
              <input
                placeholder="opponent deck label"
                value={round.opponentDeck.label}
                onChange={e => updateOpponentDeck(index, 'label', e.target.value)}
              />
            </div>

            {round.opponentDeck.sprite1 && (
              <div className="sprite-preview">
                <DisplayPokemonSprites
                  sprite1={round.opponentDeck.sprite1}
                  sprite2={round.opponentDeck.sprite2 || 'blank'}
                />
                <span>{round.opponentDeck.label || 'Opponent Deck'}</span>
              </div>
            )}

            <label>
              Notes
              <textarea
                value={round.notes}
                onChange={e => updateRound(index, 'notes', e.target.value)}
              />
            </label>
          </div>
        ))}

        <button type="button" className="secondary-report-btn" onClick={addRound}>
          + Add Round
        </button>

        <button className="primary-report-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Tournament Report'}
        </button>
      </form>
    </div>
  );
}