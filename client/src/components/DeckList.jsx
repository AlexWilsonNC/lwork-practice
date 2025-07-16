import React from 'react'
import './DeckList.css'

export default function DeckList({ deck, onUpdateCount, onCardClick, loading = false, onCardDrop, limitCounts = true, viewMode = 'image' }) {
  const shrink = Array.isArray(deck) && deck.length > 45

   if (viewMode === 'list') {
    return (
      <div className={`deck-box list-view${shrink ? ' shrink-cards' : ''}`}>
        <table className="deck-list-table">
          <thead>
            <tr>
              <th>Count</th>
              <th>Name</th>
              <th>Set</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {deck.map((c, i) => (
              <tr key={`${c.setAbbrev}-${c.number}`}>
                <td>{c.count}</td>
                <td>{c.name}</td>
                <td>{c.setAbbrev}</td>
                <td>{c.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`deck-box${shrink ? ' shrink-cards' : ''}`}>
         {/* spinner overlay */}
          {loading && (
            <div className="deck-spinner">
              <span className="material-symbols-outlined spinner-icon">
                autorenew
              </span>
            </div>
          )}
      {!loading && deck.length === 0 && <p></p>}
      {!loading && deck.map((c, i) => {
        const isBasicEnergy =
          c.supertype === 'Energy' && c.name.startsWith('Basic')
        return (
        <div
          key={`${c.setAbbrev}-${c.number}`}
          className="deckbuilt-card-container"
          onClick={() => onCardClick(c)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={c.images.small}
            alt={c.name}
            onClick={() => {/* TODO: open modal with c.images.large */}}
            className='database-card-in-list card-added-in-decklist'
          />
          <div className="deck-add-minus">
            <button
              onClick={e => {
                e.stopPropagation()
                onUpdateCount(i, c.count - 1)
              }}
              className='pm-card minus-card'
            >–</button>
            <span className='current-cnt-num'>{c.count}</span>
            <button
               onClick={e => {
                 e.stopPropagation()
                 onUpdateCount(i, c.count + 1)
               }}
               disabled={limitCounts && !isBasicEnergy && c.count >= 4}
               className='pm-card plus-card'
            >＋</button>
          </div>
          {/* <div className="card-label">
            {c.name} ({c.setAbbrev}-{c.number})
          </div> */}
        </div>
        )
    })}
    </div>
  )
}
