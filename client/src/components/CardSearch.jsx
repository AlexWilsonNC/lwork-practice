import React, { useState, useEffect } from 'react'
import './CardSearch.css'
import setOrder from '../Tournaments/setorder'

export default function CardSearch({ onAddCard, onCardClick }) {
  const [query,  setQuery]  = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2 && trimmed.toUpperCase() !== 'N') {
      setResults([])
      return
    }
    const t = setTimeout(() => {
      fetch(`/api/cards/searchbyname/partial/${encodeURIComponent(query)}`)
        .then(res => {
          if (!res.ok) throw new Error(`Network ${res.status}`)
          return res.json()
        })
        .then(data => {
          // ensure we have an array
          let arr = Array.isArray(data) ? data : []

           if (trimmed.toUpperCase() === 'N') {
                arr = arr.filter(c => c.name.toUpperCase() === 'N')
           }

          // sort by setOrder: newest sets last in setOrder → highest index → come first
          arr.sort((a, b) => {
            const idxA = setOrder.indexOf(a.setAbbrev)
            const idxB = setOrder.indexOf(b.setAbbrev)
            return idxA - idxB
          })

          setResults(arr)
        })
        .catch(err => {
          console.error('Search failed:', err)
          setResults([])
        })
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="card-search-container">
        <div class='event-searchbar'>
            <span class="material-symbols-outlined search-mag">search</span>
            <div className="search-input-wrapper">
            <input
                type="text"
                placeholder="Search cards…"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
                {query && (
                    <button
                    type="button"
                    className="clear-input-btn"
                    onClick={() => {
                        setQuery('')
                        setResults([])
                    }}
                    aria-label="Clear search"
                    >×</button>
                )}
            </div>
            {/* <button id='searchButton' type="button">Search</button> */}
            <div id='filter-search' style={{ opacity: 0.1, pointerEvents: 'none' }}>
                <p>Search Filter</p>
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </div>
            <button
                type="button"
                id="search-reset"
                onClick={() => setQuery('')}
            >
                <span className="material-symbols-outlined">close</span>
                <p>Reset</p>
            </button>
        </div>
        <div className="all-cards-container">
            <div class='all-cards-displayed'>
                {results.map(card => (
                    <div
                      key={`${card.setAbbrev}-${card.number}`}
                      className="searched-card-wrap"
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData(
                          'application/json',
                          JSON.stringify(card)
                        )
                        e.dataTransfer.effectAllowed = 'copy'
                      }}
                      onClick={() => onCardClick(card)}
                      style={{ cursor: 'pointer' }}
                    >
                        <img src={card.images.small} alt={card.name} className='database-card-in-list' />
                        <button
                            type="button"
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                onAddCard(card)
                            }}
                            className='add-card-to-deck'
                        ></button>
                    </div>
                ))}

            </div>
        </div>
    </div>
  )
}
