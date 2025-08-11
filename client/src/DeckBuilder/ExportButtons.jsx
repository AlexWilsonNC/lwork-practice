import React, { useState, useRef, useEffect, useContext } from 'react'
import { toPng } from 'html-to-image'
import { AuthContext } from '../contexts/AuthContext'

export default function ExportButtons({ deck, originalDeckId, onImportDeck, deckRef, onExportStart, onExportEnd }) {
  const { user } = useContext(AuthContext)
  const [importing, setImporting] = useState(false)
  const [showCopyMenu, setShowCopyMenu] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [overwriteMode, setOverwriteMode] = useState(false);
  const [deckName, setDeckName] = useState('')
  const [selectedMascot, setSelectedMascot] = useState('')
  const [secondaryMascot, setSecondaryMascot] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!showCopyMenu) return
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowCopyMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCopyMenu])

  const copyText = () => {
    const text = deck
      .map(c => `${c.count} ${c.name} ${c.setAbbrev} ${c.number}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    setShowCopyMenu(false)
    setShowSuccess(true)
  }

  const copyJson = () => {
    const pokemon = deck
      .filter(c => c.supertype === 'Pokémon')
      .map(({ count, name, setAbbrev, number }) => ({
        count,
        name,
        set: setAbbrev,
        number
      }))

    const trainer = deck
      .filter(c => c.supertype === 'Trainer')
      .map(({ count, name, setAbbrev, number }) => ({
        count,
        name,
        set: setAbbrev,
        number
      }))

    const energy = deck
      .filter(c => c.supertype === 'Energy')
      .map(({ count, name, setAbbrev, number }) => ({
        count,
        name,
        set: setAbbrev,
        number
      }))

    const output = {
      decklist: {
        pokemon,
        trainer,
        energy
      }
    }

    navigator.clipboard.writeText(
      JSON.stringify(output, null, 2)
    )
    setShowCopyMenu(false)
    setShowSuccess(true)
  }

  const shareLink = () => {
    const minimal = deck.map(c => ({
      set: c.setAbbrev,
      number: c.number,
      count: c.count
    }));
    const fragment = encodeURIComponent(JSON.stringify(minimal));
    const url = `${window.location.origin}/ljhksdgbnksgkjsiodsfi#deck=${fragment}`;
    navigator.clipboard.writeText(url).then(/* show “✓ copied” */);
    setShowCopyMenu(false)
    setShowSuccess(true)
  };

  useEffect(() => {
    if (!showSuccess) return
    const t = setTimeout(() => setShowSuccess(false), 2000)
    return () => clearTimeout(t)
  }, [showSuccess])

  const handleImport = async () => {
    if (deck.length > 0) {
      const ok = window.confirm(
        'You currently have cards in your decklist, are you sure you want to overwrite it?'
      )
      if (!ok) return
    }

    setImporting(true)
    try {
      await onImportDeck(true)
    } finally {
      setImporting(false)
    }
  }

  const handleMyDecks = () => {
    if (user) {
      // same‐window nav to account
      window.location.href = '/taco'
    } else {
      // reuse your save‑modal login prompt
      setShowSaveModal(true)
    }
  }

  const openPrintDecklist = () => {
    const minimal = deck.map(c => ({
      supertype: c.supertype,
      set: c.setAbbrev,
      name: c.name,
      number: c.number,
      count: c.count,
      regMark: c.regulationMark || ''
    }))
    const payload = encodeURIComponent(JSON.stringify(minimal))
    window.open(`${window.location.origin}/print?deck=${payload}`, '_blank')
    setShowCopyMenu(false)
  }

  const handleExportImage = async () => {
  const node = deckRef.current;
  if (!node) return;

  onExportStart();
  setShowCopyMenu(false);
  node.classList.add('exporting');

  // keep your patterned background logic
  const patternSvg = `...`; // (leave yours as-is)
  const bgUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(patternSvg)}')`;
  const prevBg = node.style.background;
  node.style.background = bgUrl;
  node.style.backgroundSize = '75px 75px';
  node.style.paddingBottom = '10px';

  // allow the "exporting" styles to apply before capture
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.userAgent.includes('Mac') && 'ontouchend' in window);

  // Optional iOS viewer window
  let w = null;
  if (isIOS) {
    // Open synchronously so it isn't blocked, but don't steal focus
    w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.write(`<!doctype html>
        <html><head><title>Generating…</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;flex-direction:column;background:#000;height:100vh;color:#fff;">
          <p id="status">Generating image…</p>
          <img id="deckpng" style="max-width:95%;height:auto;max-height:95%;display:none;"/>
        </body></html>`);
      w.document.close();
      try { w.blur(); window.focus(); } catch {}
    }
  }

  try {
    const dataUrl = await toPng(node, {
      cacheBust: true,
      backgroundColor: null,
      pixelRatio
    });

    // restore styles immediately after capture
    node.style.background = prevBg;
    node.classList.remove('exporting');

    if (isIOS) {
      // Show in the already-opened tab (or navigate there if blocked)
      if (w && !w.closed) {
        const img = w.document.getElementById('deckpng');
        if (img) {
          img.src = dataUrl;
          img.style.display = 'block';
          const status = w.document.getElementById('status');
          if (status) status.textContent = '';
          try { w.document.title = 'Save your deck'; } catch {}
        } else {
          w.location.href = dataUrl;
        }
      } else {
        // If popup was blocked, just navigate current tab (iOS will show the image viewer)
        window.location.href = dataUrl;
      }
    } else {
      // Desktop/Android: direct download, no extra tab
      const blob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deck.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
  } catch (err) {
    console.error('Could not generate image', err);
    node.style.background = prevBg;
    node.classList.remove('exporting');
    alert('Could not generate image on this device. Try zooming out, or ensure images allow CORS.');
  } finally {
    onExportEnd();
  }
};

  const handleSaveClick = () => {
    setShowSaveModal(true)
  }

  const handleModalSave = async () => {
    if (!deckName.trim() || !selectedMascot) return
    setSaving(true)
    try {
      const token = localStorage.getItem('PTCGLegendsToken')
      const url = overwriteMode && originalDeckId
        ? `/api/user/decks/${originalDeckId}`
        : '/api/user/decks';
      const method = overwriteMode && originalDeckId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: deckName,
          mascotCard: selectedMascot,
          secondaryMascotCard: secondaryMascot,
          description,
          decklist: deck
        })
      })
      if (res.ok) {
        window.location.href = '/taco'
        setSaving(false)
        setShowSaveModal(false)
        setDeckName('')
        setSelectedMascot('')
        setSecondaryMascot('')
        setDescription('')
      } else {
        console.error('Failed to save deck')
      }
    } catch (err) {
      console.error('Error saving deck', err)
    } finally {
      setSaving(false)
    }
  }

  // const handleModalSave = async () => {
  //   if (!deckName.trim() || !selectedMascot) return
  //   setSaving(true)
  //   const pokemon = deck
  //     .filter(c => c.supertype === 'Pokémon')
  //     .map(({ count, name, setAbbrev, number }) => ({ count, name, set: setAbbrev, number }))
  //   const trainer = deck
  //     .filter(c => c.supertype === 'Trainer')
  //     .map(({ count, name, setAbbrev, number }) => ({ count, name, set: setAbbrev, number }))
  //   const energy = deck
  //     .filter(c => c.supertype === 'Energy')
  //     .map(({ count, name, setAbbrev, number }) => ({ count, name, set: setAbbrev, number }))
  //   const decklist = { pokemon, trainer, energy }
  //   setSaving(true)
  //   try {
  //     const token = localStorage.getItem('PTCGLegendsToken')
  //     const url = overwriteMode && originalDeckId
  //       ? `/api/user/decks/${originalDeckId}`
  //       : '/api/user/decks';
  //     const method = overwriteMode && originalDeckId ? 'PUT' : 'POST';
  //           const res = await fetch(url, {
  //       method,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         name: deckName,
  //         mascotCard: selectedMascot,
  //         secondaryMascotCard: secondaryMascot,
  //         description,
  //         decklist
  //       })
  //     });

  //     if (res.ok) {
  //       window.location.href = '/account'
  //       setSaving(false)
  //       setShowSaveModal(false)
  //       setDeckName('')
  //       setSelectedMascot('')
  //       setSecondaryMascot('')
  //       setDescription('')
  //     } else {
  //       console.error('Failed to save deck')
  //     }
  //   } catch (err) {
  //     console.error('Error saving deck', err)
  //   } finally {
  //     setSaving(false)
  //   }
  // }

  return (
    <>
      <div className="deck-build-options">
        <div className='all-options-box'>
          <div className='options-left'>
            <div className='options-row row-options-1'>
              <div className='my-decks-btn'>
                <button onClick={handleMyDecks}>
                  <p>My Decks</p>
                </button>
              </div>
              <div className='deck-options-btns-right'>
                <button onClick={handleImport} disabled={importing}>
                  <p>Import <span className='hideon450'>Deck</span></p>
                </button>
                <div className="copy-menu-container" ref={menuRef}>
                  <button
                    onClick={() => setShowCopyMenu(v => !v)}
                    disabled={!deck.length}
                  >
                    <p>Export <span className='hideon450'>Deck</span></p>
                    <span className="material-symbols-outlined bold-span">keyboard_arrow_down</span>
                  </button>
                  {showCopyMenu && (
                    <div className="copy-menu-dropdown">
                      <div
                        className="menu-item"
                        onClick={copyText}
                      >
                        Copy as Text
                      </div>
                      <div
                        className="menu-item"
                        onClick={shareLink}
                      >
                        Share via Link
                      </div>
                      <div
                        className="menu-item"
                        onClick={handleExportImage}
                      >
                        Download Image
                      </div>
                      <div className="menu-item" onClick={openPrintDecklist}>
                        Print Decklist
                      </div>
                      <div
                        className="menu-item"
                        onClick={copyJson}
                      >
                        Copy as Jsoɴ
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={handleSaveClick} disabled={!deck.length} className='save-deck-btn'>
                  <p>Save <span className='hideon450'>Deck</span></p>
                </button>
              </div>
            </div>
          </div>
        </div>
        {showSuccess && (
          <div className="copy-success-overlay">
            <div className="copy-success-icon">✔︎</div>
            <p>Copied</p>
          </div>
        )}
      </div>
      {showSaveModal && (
        <div className="deck-collection-modal-overlay">
          <div className="deck-collection-modal-box">
            {!user ? (
              <>
                <p>You need to be logged in to save decks and view your deck collection.</p>
                <div className='buttons-row-modal'>
                  <button className='save-button' onClick={() => window.open(`${window.location.origin}/login`, '_blank')}>Login</button>
                  <button className='cancel-button' onClick={() => setShowSaveModal(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                {originalDeckId && (
                  <div style={{ marginBottom: '1em' }}>
                    <label>
                      <input
                        type="radio"
                        checked={!overwriteMode}
                        onChange={() => setOverwriteMode(false)}
                      />
                      {' '}Save as new deck
                    </label>
                    <label style={{ marginLeft: '1em' }}>
                      <input
                        type="radio"
                        checked={overwriteMode}
                        onChange={() => setOverwriteMode(true)}
                      />
                      {' '}Overwrite existing deck
                    </label>
                  </div>
                )}
                <h3 className='push-ttl-dwn'>{overwriteMode ? 'Overwrite Deck' : 'Save Deck'}</h3>
                <label>
                  Name*<br />
                  <input type="text" value={deckName} onChange={e => setDeckName(e.target.value)} />
                </label>
                <label>
                  Mascot*<br />
                  <select value={selectedMascot} onChange={e => setSelectedMascot(e.target.value)}>
                    <option value="">Select a card</option>
                    {deck.map(card => (
                      <option key={`${card.setAbbrev}-${card.number}`} value={`${card.setAbbrev}-${card.number}`}> {`${card.count}x ${card.name}`} </option>
                    ))}
                  </select>
                </label>
                <label>
                  Secondary Mascot<br />
                  <select value={secondaryMascot} onChange={e => setSecondaryMascot(e.target.value)}>
                    <option value="">None</option>
                    {deck.map(card => (
                      <option key={`${card.setAbbrev}-${card.number}`} value={`${card.setAbbrev}-${card.number}`}>{`${card.count}x ${card.name}`}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Description<br />
                  <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                <div className="buttons-row-modal push-more-dwn">
                  <button className='cancel-button' onClick={() => setShowSaveModal(false)} disabled={saving}>Cancel</button>
                  <button className='save-button' onClick={handleModalSave} disabled={!deckName.trim() || !selectedMascot || saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
