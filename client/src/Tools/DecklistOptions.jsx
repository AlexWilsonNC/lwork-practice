import React from 'react';
import { useNavigate } from 'react-router-dom'

const DecklistOptions = ({ decklist, cardMap }) => {
  const navigate = useNavigate()

  const cleanCardName = (name) => {
    return name
      .replace(" - ACESPEC", "")
  };

  const copyToClipboard = () => {
    if (!decklist) return;

    const formatCards = cards =>
    cards.map(card => {
      const key = `${card.set}-${card.number}`;
      const accented = cardMap[key]?.name;
      const displayName = accented ?? cleanCardName(card.name);
      return `${card.count} ${displayName} ${card.set} ${card.number}`;
    });

    const lines = [
      'Pokémon:',
      ...formatCards(decklist.pokemon),
      '',
      'Trainers:',
      ...formatCards(decklist.trainer),
      '',
      'Energy:',
      ...formatCards(decklist.energy),
    ];

    const decklistText = lines.join('\n');

    navigator.clipboard.writeText(decklistText).then(() => {
      console.log('Decklist copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy decklist:', err);
    });
  };

  const openInDeckbuilder = () => {
    const minimal = [
      ...decklist.pokemon,
      ...decklist.trainer,
      ...decklist.energy
    ].map(c => ({
      set:    c.set,
      number: c.number,
      count:  Number(c.count)
    }))

    const hash = `deck=${encodeURIComponent(JSON.stringify(minimal))}`

    navigate(`/deckbuilder#${hash}`)
  }

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
    </div>
  );
};

export default DecklistOptions;