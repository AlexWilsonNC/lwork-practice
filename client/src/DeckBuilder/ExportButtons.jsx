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
    const url = `${window.location.origin}/bobthebuilder#deck=${fragment}`;
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
      window.location.href = '/taco'
    } else {
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

    const patternSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="140%" height="140%">
  <defs>
    <pattern id="patternBg" patternUnits="userSpaceOnUse" width="75" height="75" patternTransform="rotate(45 30 30)">
      <rect x="0" y="0" width="100%" height="100%" fill="#2e2e32ff"/>
      <path
        d="M59.995 52.87
           m-14.557 7.125h7.450z
           m15.687 0h7.427z
           a4 4 0 01-4 4 4 4 0 01-4 -4 4 4 0 014 -4 4 4 0 014 4
           zm-6.757-14.547
           c-4.212-.069-8.465 1.673-11.262 4.869
             -4.23 4.606-4.845 11.985-1.55 17.274
             3.09 5.2 9.628 7.954 15.517 6.635
             6.53-1.292 11.604-7.583 11.48-14.231
             .096-5.628-3.495-11.014-8.606-13.298
             -1.757-.813-3.665-1.217-5.58-1.249z"
        stroke-width="1.5" stroke="#ffffff24" fill="none"
      />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#patternBg)"/>
</svg>`;
    const bgUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(patternSvg)}')`;
    const prevBg = node.style.background;
    const prevPaddingBottom = node.style.paddingBottom;
    node.style.background = bgUrl;
    node.style.backgroundSize = '75px 75px';
    node.style.paddingBottom = '21px';

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in window);

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: null,
        pixelRatio
      });

      node.style.background = prevBg;
      node.style.paddingBottom = prevPaddingBottom;
      node.classList.remove('exporting');

      if (isIOS) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'deck.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'PTCG Legends Deck' });
          } catch (e) {
            const url = URL.createObjectURL(blob);
            window.location.assign(url);
            setTimeout(() => URL.revokeObjectURL(url), 15000);
          }
        } else {
          const url = URL.createObjectURL(blob);
          window.location.assign(url);
          setTimeout(() => URL.revokeObjectURL(url), 15000);
        }
      } else {
        const blob = await (await fetch(dataUrl)).blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'deckbuilder-image.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }

    } catch (err) {
      console.error('Could not generate image', err);
      node.style.background = prevBg;
      node.classList.remove('exporting');
      alert('Could not generate image. Please contact us at ptcglegends@gmail.com with the decklist so we can look into this error.');
    } finally {
      setTimeout(() => {
        const ae = document.activeElement;
        if (ae && typeof ae.blur === 'function') ae.blur();
      }, 0);

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
