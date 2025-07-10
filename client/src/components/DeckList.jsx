import React from 'react'
import './DeckList.css'

export default function DeckList({ deck, onUpdateCount }) {
  return (
    <div className="deck-box">
      {deck.length === 0 && <p>Your deck is empty</p>}
      {deck.map((c, i) => (
        <div key={`${c.setAbbrev}-${c.number}`} className="deckbuilt-card-container">
          <img
            src={c.images.small}
            alt={c.name}
            onClick={() => {/* TODO: open modal with c.images.large */}}
            className='database-card-in-list card-added-in-decklist'
          />
          <div className="deck-add-minus">
            <button
              onClick={() => onUpdateCount(i, c.count - 1)}
              disabled={c.count <= 1}
              className='pm-card minus-card'
            >–</button>
            <span className='current-cnt-num'>{c.count}</span>
            <button
              onClick={() => onUpdateCount(i, c.count + 1)}
              disabled={c.count >= 4}
              className='pm-card plus-card'
            >＋</button>
          </div>
          {/* <div className="card-label">
            {c.name} ({c.setAbbrev}-{c.number})
          </div> */}
        </div>
      ))}
    </div>
  )
}
