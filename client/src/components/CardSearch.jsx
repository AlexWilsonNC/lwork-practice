import React, { useState, useEffect } from 'react'
import './CardSearch.css'

export default function CardSearch({ onAddCard }) {
  const [query,  setQuery]  = useState('')
  const [results, setResults] = useState([])

  // Debounced fetch to your existing search endpoint
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const t = setTimeout(() => {
      fetch(`/api/cards/searchbyname/partial/${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(setResults)
        .catch(console.error)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="card-search-container">
        <div class='event-searchbar'>
            <span class="material-symbols-outlined search-mag">search</span>
            <input
                type="text"
                placeholder="Search cards…"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <button id='searchButton'>Search</button>
            <div id='filter-search' style={{ opacity: 0.1, pointerEvents: 'none' }}>
                <p>Search Filter</p>
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </div>
            <div id='search-reset' onclick="searchReset()">
                <span className="material-symbols-outlined">refresh</span>
                <p>Reset</p>
            </div>
        </div>
        <div className="all-cards-container">
            <div class='all-cards-displayed'>
            {results.map(card => (
            <div
                key={`${card.setAbbrev}-${card.number}`}
                className="searched-card-wrap"
            >
                <img src={card.images.small} alt={card.name} className='database-card-in-list' />
                <button onClick={() => onAddCard(card)} className='add-card-to-deck'></button>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}
