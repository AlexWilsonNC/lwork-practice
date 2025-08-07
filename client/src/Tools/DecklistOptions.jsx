import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const DecklistOptions = ({ decklist, cardMap }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [selectedMascot, setSelectedMascot] = useState('');
  const [secondaryMascot, setSecondaryMascot] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const cleanCardName = (name) => name.replace(' - ACESPEC', '');

  const flatDeck = [
    ...(decklist?.pokemon ?? []).map(c => ({
      count: Number(c.count),
      name: cardMap[`${c.set}-${c.number}`]?.name ?? cleanCardName(c.name),
      setAbbrev: c.set,
      number: c.number,
      supertype: 'Pokémon',
    })),
    ...(decklist?.trainer ?? []).map(c => ({
      count: Number(c.count),
      name: cardMap[`${c.set}-${c.number}`]?.name ?? cleanCardName(c.name),
      setAbbrev: c.set,
      number: c.number,
      supertype: 'Trainer',
    })),
    ...(decklist?.energy ?? []).map(c => ({
      count: Number(c.count),
      name: cardMap[`${c.set}-${c.number}`]?.name ?? cleanCardName(c.name),
      setAbbrev: c.set,
      number: c.number,
      supertype: 'Energy',
    })),
  ];

  const copyToClipboard = () => {
    if (!decklist) return;
    const fmt = (cards = []) =>
      cards.map(card => {
        const key = `${card.set}-${card.number}`;
        const displayName = cardMap[key]?.name ?? cleanCardName(card.name);
        return `${card.count} ${displayName} ${card.set} ${card.number}`;
      });

    const lines = [
      'Pokémon:',
      ...fmt(decklist.pokemon),
      '',
      'Trainers:',
      ...fmt(decklist.trainer),
      '',
      'Energy:',
      ...fmt(decklist.energy),
    ];

    navigator.clipboard.writeText(lines.join('\n')).catch(console.error);
  };

  const openInDeckbuilder = () => {
    const minimal = [
      ...(decklist?.pokemon ?? []),
      ...(decklist?.trainer ?? []),
      ...(decklist?.energy ?? []),
    ].map(c => ({ set: c.set, number: c.number, count: Number(c.count) }));

    const hash = `deck=${encodeURIComponent(JSON.stringify(minimal))}`;
    navigate(`/deckbuilder#${hash}`);
  };

  const handleSaveClick = () => setShowSaveModal(true);

  const handleModalSave = async () => {
    if (!deckName.trim() || !selectedMascot) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('PTCGLegendsToken');
      const res = await fetch('/api/user/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: deckName,
          mascotCard: selectedMascot,              // "SET-NUM"
          secondaryMascotCard: secondaryMascot || '',
          description,
          decklist: flatDeck,
        }),
      });
      if (!res.ok) throw new Error('Failed to save deck');
      window.location.href = '/account';
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="deck-top-right-options">
      <div className="copy-decklist-btn" onClick={copyToClipboard}>
        <span className="material-symbols-outlined">content_copy</span>
        <span className="tooltip-text">Copy to Clipboard</span>
      </div>

      <div className="open-in-deckbuilder-btn not-ready" onClick={openInDeckbuilder}>
        <span className="material-symbols-outlined">contract_edit</span>
        <span className="tooltip-text">Open in Deckbuilder</span>
      </div>

      <div className="save-to-collection-btn not-ready" onClick={handleSaveClick}>
        <span className="material-symbols-outlined">favorite</span>
        <span className="tooltip-text">Save to Collection</span>
      </div>

      {showSaveModal && (
        <div className="deck-collection-modal-overlay">
          <div className="deck-collection-modal-box">
            {!user ? (
              <>
                <p>You need to be logged in to save decks and view your deck collection.</p>
                <div className="buttons-row-modal">
                  <button
                    className="save-button"
                    onClick={() => window.open(`${window.location.origin}/login`, '_blank')}
                  >
                    Login
                  </button>
                  <button className="cancel-button" onClick={() => setShowSaveModal(false)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className='push-ttl-dwn'>Save Deck</h3>
                <label>
                  Name*<br />
                  <input
                    type="text"
                    value={deckName}
                    onChange={e => setDeckName(e.target.value)}
                  />
                </label>
                <label>
                  Mascot*<br />
                  <select
                    value={selectedMascot}
                    onChange={e => setSelectedMascot(e.target.value)}
                  >
                    <option value="">Select a card</option>
                    {flatDeck.map(card => (
                      <option
                        key={`${card.setAbbrev}-${card.number}`}
                        value={`${card.setAbbrev}-${card.number}`}
                      >
                        {`${card.count}x ${card.name}`}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Secondary Mascot<br />
                  <select
                    value={secondaryMascot}
                    onChange={e => setSecondaryMascot(e.target.value)}
                  >
                    <option value="">None</option>
                    {flatDeck.map(card => (
                      <option
                        key={`${card.setAbbrev}-${card.number}`}
                        value={`${card.setAbbrev}-${card.number}`}
                      >
                        {`${card.count}x ${card.name}`}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Description<br />
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </label>
                <div className="buttons-row-modal push-more-dwn">
                  <button className='cancel-button' onClick={() => setShowSaveModal(false)} disabled={saving}>
                    Cancel
                  </button>
                  <button
                    className='save-button'
                    onClick={handleModalSave}
                    disabled={!deckName.trim() || !selectedMascot || saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DecklistOptions;
