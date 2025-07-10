import React, { useState, useEffect } from 'react'
import CardSearch     from './CardSearch'
import DeckList       from './DeckList'
import ExportButtons  from './ExportButtons'
import './DeckBuilder.css'   // feel free to copy over your old styles

const STORAGE_KEY = 'deckbuilder-deck'

export default function DeckBuilder() {
  // — load deck from localStorage or start empty
  const [deck, setDeck] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  // — persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck))
  }, [deck])

  // — add a card (or bump count if already in deck)
  function addCard(card) {
    setDeck(d => {
      const idx = d.findIndex(c => (
        c.setAbbrev === card.setAbbrev && c.number === card.number
      ))
      if (idx > -1) {
        const copy = [...d]
        copy[idx].count = Math.min(copy[idx].count + 1, 4)
        return copy
      }
      return [...d, { ...card, count: 1 }]
    })
  }

  // — update count for a card by its index in the array
  function updateCount(index, newCount) {
    setDeck(d => d
      .map((c,i) => i === index ? { ...c, count: newCount } : c)
      .filter(c => c.count > 0)
    )
  }

  return (
    <div className="deck-builder">
      <CardSearch onAddCard={addCard} />
      <div className='active-deck-container'>
        <ExportButtons deck={deck} />
        <DeckList deck={deck} onUpdateCount={updateCount} />
      </div>
    </div>
  )
}
