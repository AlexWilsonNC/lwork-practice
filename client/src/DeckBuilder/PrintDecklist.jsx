import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function PrintDecklist() {
  const q = useQuery()
  const [deck, setDeck] = useState([])
  const [form, setForm] = useState({
    name: '', playerId: '', dob: '', division: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const raw = q.get('deck')
    if (!raw) return
    try {
      // URLSearchParams#get auto‑decodes percent‑escapes, but if you ever double‑encoded:
      const json = decodeURIComponent(raw)
      setDeck(JSON.parse(json))
    } catch (e) {
      console.error('Couldn’t parse deck param:', e)
      setDeck([])  // fail gracefully
    }
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handlePrint = () => {
    const errs = {};
    ['name','playerId','dob','division'].forEach(k => {
      if (!form[k]) errs[k] = true
    })
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      window.print()
    }
  }

  const pokemon  = deck.filter(c => c.supertype === 'Pokémon')
  const trainers = deck.filter(c => c.supertype === 'Trainer')
  const energy   = deck.filter(c => c.supertype === 'Energy')
  const pokemonCount = pokemon.reduce((sum, c) => sum + Number(c.count), 0);
  const trainerCount = trainers.reduce((sum, c) => sum + Number(c.count), 0);
  const energyCount  = energy.reduce((sum, c) => sum + Number(c.count), 0);

  return (
    <>
    <style>
        {`
          @media print {
            body {
              font-size: 8pt !important;
              margin: 0.1in !important;
            }
            h3 {
              font-size: 8pt !important;
              margin-bottom: 0.2em;
            }
            table {
              font-size: 6pt !important;
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: avoid;
            }
            th, td {
              border: 1px solid #ccc !important;
              padding: 4px !important;
            }
            input, select {
                border: none !important;
                font-size: 12px;
            }
            .topformspan {
                width: 80px;
            }
            .print-top-form {
                margin: 0 0 10px 0;
            }
            label {
                margin-bottom: 2px !important;
            }
            .no-print {
              display: none !important;
            }
            .print-top-form select {
                -webkit-appearance: none;
                -moz-appearance:    none;
                appearance:         none;
                background:         transparent;
            }
            .print-top-form select::-ms-expand {
                display: none;
            }
          }
        `}
      </style>
      <div>
    <div style={{
      padding: '1rem',
      fontFamily: 'sans-serif',
      background: '#fff',
      color: '#000'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button className='no-print'
        onClick={() => window.close()}
        style={{
          background: 'transparent',
          color: 'black',
          padding: '0.5rem 1rem',
          border: '1px solid black',
          width: '100px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          Cancel
        </button>
        <button className='no-print' onClick={handlePrint} style={{
          background: '#1290eb',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: '1px solid black',
          width: '100px',
          cursor: 'pointer'
        }}>
          Print
        </button>
      </div>

      <form className='print-top-form'>
        <div>
            <label>
                <span className='topformspan'><p>Player Name:</p></span>&nbsp;&nbsp;
                <input name="name" value={form.name} onChange={handleChange}
                    style={{ border: errors.name ? '2px solid red' : undefined }} />
            </label>
            <label>
                <span className='topformspan'><p>Player ID:</p></span>&nbsp;&nbsp;
                <input name="playerId" value={form.playerId} onChange={handleChange}
                    style={{ border: errors.playerId ? '2px solid red' : undefined }} />
            </label>
        </div>
        <div>
            <label>
                <span className='topformspan'><p>Date of Birth:</p></span>&nbsp;&nbsp;
                <input type="date" name="dob" value={form.dob} onChange={handleChange}
                    style={{ border: errors.dob ? '2px solid red' : undefined }} />
            </label>
            <label>
                <span className='topformspan'><p>Division:</p></span>&nbsp;&nbsp;
                <select name="division" value={form.division} onChange={handleChange}
                    style={{ border: errors.division ? '2px solid red' : undefined }}>
                    <option value="">— select —</option>
                    <option value="masters">Masters</option>
                    <option value="senior">Senior</option>
                    <option value="junior">Junior</option>
                </select>
            </label>
        </div>
      </form>

      {pokemon.length > 0 && (
        <>
          <h3 style={{backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 10px'}}>Pokémon <span style={{opacity: 0.5}}>({pokemonCount})</span></h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{border: '1px solid #ccc',padding:'4px', textAlign:'start'}}>COUNT</th>
                <th style={{border: '1px solid #ccc',padding:'4px', textAlign:'start'}}>NAME</th>
                <th style={{border: '1px solid #ccc',padding:'4px', textAlign:'start'}}>SET</th>
                <th style={{border: '1px solid #ccc',padding:'4px', textAlign:'start'}}>NUM.</th>
                <th style={{border: '1px solid #ccc',padding:'4px', textAlign:'start'}}>REG.</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.map((c,i) => (
                <tr key={i}>
                  <td style={{border: '1px solid #ccc',padding:'4px', width:'100px'}}>{c.count}</td>
                  <td style={{border: '1px solid #ccc',padding:'4px'}}>{c.name}</td>
                  <td style={{border: '1px solid #ccc',padding:'4px'}}>{c.set}</td>
                  <td style={{border: '1px solid #ccc',padding:'4px'}}>{c.number}</td>
                  <td style={{border: '1px solid #ccc',padding:'4px'}}>{c.regMark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {trainers.length > 0 && (
        <>
          <br></br>
          <h3 style={{marginBottom: '-15px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 10px'}}>Trainers <span style={{opacity: 0.5}}>({trainerCount})</span></h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <tbody>
              {trainers.map((c,i) => (
                <tr key={i}>
                  <td style={{border: '1px solid #ccc',padding:'4px', width:'100px'}}>{c.count}</td>
                  <td style={{border: '1px solid #ccc',padding:'4px'}}>{c.name}</td>
                  <td className='no-print'></td>
                  <td className='no-print'></td>
                  <td className='no-print'></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {energy.length > 0 && (
        <>
          <br></br>
          <h3 style={{marginBottom: '-15px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 10px'}}>Energy <span style={{opacity: 0.5}}>({energyCount})</span></h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <tbody>
              {energy.map((c,i) => (
                <tr key={i}>
                  <td style={{border: '1px solid #ccc',padding:'4px', width:'100px'}}>{c.count}</td>
                  <td style={{border: '1px solid #ccc',padding:'4px'}}>{c.name}</td>
                  <td className='no-print'></td>
                  <td className='no-print'></td>
                  <td className='no-print'></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
    </div>
    </>
  )
}
