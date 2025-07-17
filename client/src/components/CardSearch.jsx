import React, { useState, useEffect } from 'react'
import setOrder from '../Tournaments/setorder'

export default function CardSearch({ onAddCard, onCardClick }) {
  const [query,  setQuery]  = useState('')
  const [results, setResults] = useState([])
  const [defaultCards, setDefault] = useState([])
  const [suppressDefault, setSuppressDefault] = useState(false)

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    supertypes: { Pokémon: false, Trainer: false, Energy: false },
    sets: {},
  })

  useEffect(() => {
    const newestSet = setOrder[0]
    fetch(`/api/cards/${encodeURIComponent(newestSet)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Network ${res.status}`)
        return res.json()
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : []
        arr.sort((a, b) => {
          const nA = parseInt(a.number, 10) || 0
          const nB = parseInt(b.number, 10) || 0
          return nA - nB
        })
        setDefault(arr)
        setResults(arr)
      })
      .catch(err => {
        console.error('Failed to load default set:', err)
      })
  }, [])

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed === '') {
      if (suppressDefault) {
        setResults([])
      } else {
        setResults(defaultCards)
      }
      return
    }

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
          let arr = Array.isArray(data) ? data : []

           if (trimmed.toUpperCase() === 'N') {
                arr = arr.filter(c => c.name.toUpperCase() === 'N')
           }

          arr.sort((a, b) => {
            const idxA = setOrder.indexOf(a.setAbbrev)
            const idxB = setOrder.indexOf(b.setAbbrev)
            if (idxA !== idxB) return idxA - idxB
            const numA = parseInt(a.number, 10)  || 0
            const numB = parseInt(b.number, 10)  || 0
            return numA - numB
          })

          setResults(arr)
        })
        .catch(err => {
          console.error('Search failed:', err)
          setResults([])
        })
    }, 300)
    return () => clearTimeout(t)
  }, [query, defaultCards])

  const displayResults = results.filter(card => {
    // supertype filter
    if (!filters.supertypes[card.supertype]) return false
    // set filter: if ANY set checkbox is checked, only include those sets
    const setsChecked = Object.values(filters.sets).some(v => v)
    if (setsChecked && !filters.sets[card.setAbbrev]) return false
    return true
  })

  return (
    <div className="card-search-container">
        {/* --- Advanced Search Button --- */}
        <button
            className="advanced-search-button"
            onClick={() => setShowAdvanced(true)}
        >
            Advanced Search
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </button>

        {showAdvanced && (
            <div className="advanced-search-modal-overlay" onClick={() => setShowAdvanced(false)}>
            <div className="advanced-search-modal" onClick={e => e.stopPropagation()}>
                <h2>Advanced Search</h2>
                <hr></hr>
                <div className="filter-group">
                    <h3>Card Type:</h3>
                    {[
                        'Pokémon',
                        'Trainer',
                        // 'Energy',
                        'Item',
                        'Supporter',
                        'Stadium',
                        'Tool'
                        // 'Basic Energy',
                        // 'Special Energy'
                    ].map(type => (
                        <button
                            key={type}
                            type="button"
                            className={`type-btn ${filters.supertypes[type] ? 'active' : ''}`}
                            onClick={() => {
                                setFilters(f => ({
                                ...f,
                                supertypes: {
                                    ...f.supertypes,
                                    [type]: !f.supertypes[type]
                                }
                                }))
                            }}
                        >
                            {type}
                        </button>
                    ))}
                    <span className='cardtypeenergy'>Energy:</span>
                    {[
                        'Basic',
                        'Special'
                    ].map(type => (
                        <button
                            key={type}
                            type="button"
                            className={`type-btn ${filters.supertypes[type] ? 'active' : ''}`}
                            onClick={() => {
                                setFilters(f => ({
                                ...f,
                                supertypes: {
                                    ...f.supertypes,
                                    [type]: !f.supertypes[type]
                                }
                                }))
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="filter-group">
                    <h3>Sets</h3>
                    {/* {setOrder.map(set => (
                        <label key={set}>
                        <input
                            type="checkbox"
                            checked={!!filters.sets[set]}
                            onChange={() => {
                            setFilters(f => ({
                                ...f,
                                sets: {
                                ...f.sets,
                                [set]: !f.sets[set]
                                }
                            }))
                            }}
                        />
                        {set}
                        </label>
                    ))} */}
                </div>

                <div className="modal-buttons">
                <button onClick={() => setShowAdvanced(false)}>
                    Apply
                </button>
                <button onClick={() => setShowAdvanced(false)}>
                    Cancel
                </button>
                </div>
            </div>
            </div>
        )}
        <div className='event-searchbar'>
            <div className='search-cards-div'>
                <div className="search-input-wrapper">
                    <span className="material-symbols-outlined search-mag">search</span>
                    <input
                        type="text"
                        placeholder="Search cards…"
                        value={query}
                        onChange={e => {
                        setSuppressDefault(false)
                        setQuery(e.target.value)
                        }}
                    />
                    {query && (
                        <button
                        type="button"
                        className="clear-input-btn"
                        onClick={() => {
                            setQuery('')
                            setSuppressDefault(true)
                            setResults([])
                        }}
                        aria-label="Clear search"
                        >×</button>
                    )}
                </div>
                <button
                    type="button"
                    id="search-reset"
                    onClick={() => {
                      setQuery('')
                      setSuppressDefault(true)
                      setResults([])
                    }}
                >
                    <span className="material-symbols-outlined">close</span>
                    <p>Reset</p>
                </button>
            </div>
            </div>
            <div className="all-cards-container">
                <div className='all-cards-displayed'>
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
