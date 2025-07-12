import React, { useState, useEffect } from 'react'
import CardSearch     from './CardSearch'
import DeckList       from './DeckList'
import ExportButtons  from './ExportButtons'
import './DeckBuilder.css'
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const STORAGE_KEY = 'deckbuilder-deck'

const DeckBuilderComp = styled.div`
    .active-deck-container {
        background-image: ${({ theme }) => theme.deckPlaymat};
        border: ${({ theme }) => theme.deckBorder};
    }
`;

export default function DeckBuilder() {
  // — load deck from localStorage or start empty
  const { theme } = useTheme();
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

    const [importing, setImporting] = useState(false)
  async function importDeck() {
    try {
      setImporting(true)
      const text = await navigator.clipboard.readText()
      // split into lines, remove blank & section headers
      const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.endsWith(':'))
        .filter(l => /^\d+\s/.test(l))  // only lines starting with a count

      // build a new array so we can merge in one go
      const merged = [...deck]

      for (const line of lines) {
        const parts = line.split(/\s+/)
        const count = parseInt(parts[0], 10)
        const number = parts.pop()
        const setAbbrev = parts.pop()
        const name = parts.slice(1).join(' ')

        // fetch matching card(s)
        const results = await fetch(
          `/api/cards/searchbyname/partial/${encodeURIComponent(name)}`
        ).then(r => r.json())

        const match = results.find(
          c => c.setAbbrev === setAbbrev && c.number === number
        )
        if (match) {
          const idx = merged.findIndex(
            c => c.setAbbrev === setAbbrev && c.number === number
          )
          if (idx > -1) {
            // merge counts
            if (match.supertype !== 'Energy') {
              merged[idx].count = Math.min(merged[idx].count + count, 4)
            } else {
              merged[idx].count += count
            }
          } else {
            merged.push({ ...match, count })
          }
        } else {
          console.warn('Could not import:', name, setAbbrev, number)
        }
      }

      setDeck(merged)
    } catch (err) {
      console.error('Import failed', err)
    } finally {
      setImporting(false)
    }
  }

  return (
    <DeckBuilderComp className='center' theme={theme}>
            <Helmet>
                {/* <title>{isFeatured ? `${formatName(playerData.name)}'s Featured Deck` : `${formatName(playerData.name)}'s Decklist`}</title>
                <meta name="description" content={`${formatName(playerData.name)}'s decklist from ${eventData.name} - ${eventData.date}.`} />
                <meta property="og:title" content={eventData.name} />
                <meta property="og:description" content={`${formatName(playerData.name)}'s decklist from ${eventData.name} - ${eventData.date}.`} />
                <meta property="og:image" content={eventData.thumbnail} />
                <meta property="og:url" content={`https://www.ptcglegends.com/tournaments/${eventData.eventId}`} />
                <meta property="og:type" content="website" />
                <meta name="author" content="PTCG Legends" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={eventData.name} />
                <meta name="twitter:description" content={`${formatName(playerData.name)}'s decklist from ${eventData.name} - ${eventData.date}.`} />
                <meta name="twitter:image" content={eventData.thumbnail} /> */}
            </Helmet>
    <div className="deck-builder">
      <CardSearch onAddCard={addCard} />
      <div className='active-deck-container'>
        <ExportButtons 
            deck={deck} 
            onImportDeck={importDeck}
        />
        <DeckList deck={deck} onUpdateCount={updateCount} />
      </div>
    </div>
    </DeckBuilderComp>
  )
}
