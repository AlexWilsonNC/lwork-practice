import React from 'react'
import blueUltraBallSpinner from '../assets/logos/blue-ultra-ball.png'

const isUnlimitedByRules = (c) => {
  const r = c?.rules;
  if (!r) return false;
  const rx = /You may have as many of this card in your deck as you like/i;
  return Array.isArray(r) ? r.some(s => rx.test(s)) : rx.test(r);
};

export default function DeckList({ deck, onUpdateCount, onCardClick, loading = false, onCardDrop, limitCounts = true, viewMode = 'image', zoomScale = 1 }) {
  const shrink = Array.isArray(deck) && deck.length > 45
  const BASE_CARD_WIDTH = 70;
  const BASE_MARGIN = 2.5;

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
      {loading && (
        <div className="deck-spinner">
          <img src={blueUltraBallSpinner}
            alt="Loading"
            className="pokeball-spinner"
          />
        </div>
      )}

      {!loading && deck.length === 0 && <p></p>}

      {!loading && deck.map((c, i) => {
        const isBasicEnergy =
          c.supertype === 'Energy' && c.name.startsWith('Basic')
        const unlimited = isUnlimitedByRules(c);

        const cardWidth = BASE_CARD_WIDTH * zoomScale
        const cardMargin = BASE_MARGIN * zoomScale

        return (
          <div
            key={`${c.setAbbrev}-${c.number}`}
            className="deckbuilt-card-container"
            onClick={() => onCardClick(c)}
            style={{
              width: `${cardWidth}px`,
              margin: `${cardMargin}px`,
              position: 'relative'
            }}
          >
            <img
              src={c.images.small}
              alt={c.name}
              className="database-card-in-list"
              style={{ width: '100%', height: 'auto' }}
            />
            <div
              className="deck-add-minus"
              style={{
                width: '100%',
                position: 'absolute',
              }}
            >
              <button
                onClick={e => {
                  e.stopPropagation()
                  onUpdateCount(i, c.count - 1)
                }}
                className='pm-card minus-card'
                style={{
                  fontSize: `${14 * zoomScale}px`,
                  padding: `${4 * zoomScale}px ${8 * zoomScale}px`,
                  height: `${20 * zoomScale}px`,
                  width: `${20 * zoomScale}px`,
                }}
              >–</button>
              <span
                className="current-cnt-num"
                style={{
                  fontSize: `${14 * zoomScale}px`,
                  height: `${20 * zoomScale}px`,
                  width: `${20 * zoomScale}px`,
                }}
              >{c.count}</span>
              <button
                onClick={e => {
                  e.stopPropagation()
                  onUpdateCount(i, c.count + 1)
                }}
                disabled={limitCounts && !isBasicEnergy && !unlimited && c.count >= 4}
                className='pm-card plus-card'
                style={{
                  fontSize: `${14 * zoomScale}px`,
                  padding: `${4 * zoomScale}px ${8 * zoomScale}px`,
                  height: `${20 * zoomScale}px`,
                  width: `${20 * zoomScale}px`,
                }}
              >＋</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
