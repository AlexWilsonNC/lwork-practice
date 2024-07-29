import React from 'react';

const DecklistOptions = ({ decklist }) => {
    const cleanCardName = (name) => {
        return name.replace(" - ACESPEC", "");
    };

    const copyToClipboard = () => {
        if (!decklist) return;

        const formatCards = (cards) =>
            cards.map(card => `${card.count} ${cleanCardName(card.name)} ${card.set} ${card.number}`).join('\n');

        const decklistText = `
Pokémon:
${formatCards(decklist.pokemon)}

Trainers:
${formatCards(decklist.trainer)}

Energy:
${formatCards(decklist.energy)}
        `;

        navigator.clipboard.writeText(decklistText.trim()).then(() => {
            console.log('Decklist copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy decklist:', err);
        });
    };
    const openInDeckbuilder = () => {
        console.log('Opened in deckbuilder');
    };

    return (
    <div className='deck-top-right-options'>
        <div className='copy-decklist-btn' onClick={copyToClipboard}>
            <span className="material-symbols-outlined">content_copy</span>
            <span className="tooltip-text">Copy to Clipboard</span>
        </div>
        <div className='open-in-deckbuilder-btn not-ready' onClick={openInDeckbuilder}>
            <span className="material-symbols-outlined">build_circle</span>
            <span className="tooltip-text">Open in Deckbuilder</span>
        </div>
    </div>
    );
};

export default DecklistOptions;