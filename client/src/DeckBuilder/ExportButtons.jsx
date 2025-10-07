import React, { useState, useRef, useEffect, useContext } from 'react'
import { toPng } from 'html-to-image'
import { AuthContext } from '../contexts/AuthContext'

function MascotSelect({
  value,
  onChange,
  deck,
  placeholder = 'Select a card',
  allowNone = false,
  noneLabel = 'None',
  className = 'mascot-select'
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const keyFor = c => `${c.setAbbrev || c.set}-${c.number}`;

  const options = deck.map(c => ({
    key: keyFor(c),
    name: c.name,
    img: c?.images?.small || ''
  }));

  const selected = options.find(o => o.key === value);

  const hasCurrent = !!selected;
  const displayLabel = selected ? selected.name : (value || placeholder);

  React.useEffect(() => {
    const onDocClick = e => {
      if (!ref.current || ref.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className={className} ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`${className}-trigger`}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.img ? (
          <div style={{
            position: 'relative',
            width: 50,
            height: 30,
            overflow: 'hidden',
            borderRadius: 2
          }}>
            <img
              src={selected.img}
              alt=""
              style={{
                position: 'absolute',
                top: '-40%',
                left: '-10%',
                width: '120%',
                height: 'auto',
                transform: 'scale(1)',
                transformOrigin: 'top left'
              }}
            />
          </div>
        ) : (
          <span style={{ width: 24, height: 34 }} />
        )}
        <span style={{ flex: 1, textAlign: 'left' }}>
          {hasCurrent ? selected.name : (value ? value : placeholder)}
        </span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>

      {open && (
        <div
          className={`${className}-menu`}
          role="listbox"
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: 260,
            overflowY: 'auto',
            borderRadius: 6,
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'var(--card, #1f1f22)',
            marginTop: 6,
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
          }}
        >
          {allowNone && (
            <div
              role="option"
              tabIndex={0}
              className={`${className}-item`}
              onClick={() => { onChange(''); setOpen(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { onChange(''); setOpen(false); } }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', cursor: 'pointer' }}
            >
              <span style={{ width: 24, height: 34 }} />
              <span>{noneLabel}</span>
            </div>
          )}

          {!hasCurrent && value && (
            <div
              role="option"
              tabIndex={0}
              className={`${className}-item`}
              onClick={() => { onChange(value); setOpen(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { onChange(value); setOpen(false); } }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', cursor: 'pointer' }}
            >
              <span style={{ width: 24, height: 34 }} />
              <span>(Original) {value}</span>
            </div>
          )}

          {options.map(opt => (
            <div
              key={opt.key}
              role="option"
              aria-selected={opt.key === value}
              tabIndex={0}
              className={`${className}-item`}
              onClick={() => { onChange(opt.key); setOpen(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { onChange(opt.key); setOpen(false); } }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                cursor: 'pointer',
                background: opt.key === value ? 'rgba(255,255,255,0.06)' : 'transparent'
              }}
            >
              {opt.img ? (
                <div style={{
                  position: 'relative',
                  width: 50,
                  height: 30,
                  overflow: 'hidden',
                  borderRadius: 2
                }}>
                  <img
                    src={opt.img}
                    alt=""
                    style={{
                      position: 'absolute',
                      top: '-33%',
                      left: '-10%',
                      width: '120%',
                      height: 'auto',
                      transform: 'scale(1)',
                      transformOrigin: 'top left'
                    }}
                  />
                </div>
              ) : (
                <span style={{ width: 24, height: 34 }} />
              )}
              <span>{opt.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [overwriteDeckName, setOverwriteDeckName] = useState('')
  const [overwriteMascot, setOverwriteMascot] = useState('')
  const [overwriteSecondary, setOverwriteSecondary] = useState('')
  const [overwriteDescription, setOverwriteDescription] = useState('')
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const overwritePrefilledRef = useRef(false)


  const [originalMeta, setOriginalMeta] = useState(null);
  const prefilledOnceRef = useRef(false);

  useEffect(() => {
    if (!originalDeckId) return;
    try {
      const raw = localStorage.getItem('PTCGLegendsOriginalDeckMeta');
      if (!raw) return;
      const meta = JSON.parse(raw);
      if (meta && meta.id === originalDeckId) {
        setOriginalMeta({
          name: meta.name || '',
          mascotCard: meta.mascotCard || '',
          secondaryMascotCard: meta.secondaryMascotCard || '',
          description: meta.description || '',
        });
      }
    } catch { }
  }, [originalDeckId]);

  useEffect(() => {
    if (originalDeckId && originalMeta) setOverwriteMode(true);
  }, [originalDeckId, originalMeta]);

  useEffect(() => {
    if (!originalDeckId) return;
    const token = localStorage.getItem('PTCGLegendsToken');
    (async () => {
      try {
        const res = await fetch(`/api/user/decks/${originalDeckId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setOriginalMeta({
          name: data.name || '',
          mascotCard: data.mascotCard || '',
          secondaryMascotCard: data.secondaryMascotCard || '',
          description: data.description || '',
          folderId: data.folderId || ''
        });
      } catch { /* no-op */ }
    })();
  }, [originalDeckId]);

  useEffect(() => {
    if (!showSaveModal || !overwriteMode || !originalMeta) return;
    if (overwritePrefilledRef.current) return;
    setOverwriteDeckName(v => v || originalMeta.name);
    setOverwriteMascot(v => v || originalMeta.mascotCard);
    setOverwriteSecondary(v => v || originalMeta.secondaryMascotCard);
    setOverwriteDescription(v => v || originalMeta.description);
    overwritePrefilledRef.current = true;
    try { localStorage.removeItem('PTCGLegendsOriginalDeckMeta'); } catch { }
  }, [showSaveModal, overwriteMode, originalMeta]);

  useEffect(() => {
    if (!showSaveModal || !user) return;
    const token = localStorage.getItem('PTCGLegendsToken');

    fetch('/api/user/folders', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const list = (data.folders || data || []).slice().sort((a, b) => a.order - b.order);
        setFolders(list);

        // If overwriting an existing deck, preselect its current folder once
        if (overwriteMode && originalMeta?.folderId && !selectedFolderId) {
          setSelectedFolderId(String(originalMeta.folderId));
        }
      })
      .catch(console.error);
  }, [showSaveModal, user, overwriteMode, originalMeta, selectedFolderId]);

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
      .map(({ count, name, setAbbrev, set, number }) => ({
        count,
        name,
        set: setAbbrev || set, // fallback just in case
        number
      }));

    const trainer = deck
      .filter(c => c.supertype === 'Trainer')
      .map(({ count, name, setAbbrev, set, number }) => ({
        count,
        name,
        set: setAbbrev || set,
        number
      }));

    const energy = deck
      .filter(c => c.supertype === 'Energy')
      .map(({ count, name, setAbbrev, set, number }) => ({
        count,
        name,
        set: setAbbrev || set,
        number
      }));

    const decklist = { pokemon, trainer, energy };

    const text = `"decklist": ${JSON.stringify(decklist, null, 2)}`;

    navigator.clipboard.writeText(text);
    setShowCopyMenu(false);
    setShowSuccess(true);
  };

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
    const hasPrefill = !!(originalMeta && (originalMeta.name || originalMeta.mascotCard || originalMeta.description));
    setOverwriteMode(hasPrefill);

    if (!hasPrefill) {
      setOverwriteDeckName('');
      setOverwriteMascot('');
      setOverwriteSecondary('');
      setOverwriteDescription('');
    }
    overwritePrefilledRef.current = false;
    setShowSaveModal(true);
  }

  const handleModalSave = async () => {
    const name = overwriteMode ? overwriteDeckName : deckName;
    const mascotCard = overwriteMode ? overwriteMascot : selectedMascot;
    const secondaryMascotCard = overwriteMode ? overwriteSecondary : secondaryMascot;
    const desc = overwriteMode ? overwriteDescription : description;

    if (!name.trim() || !mascotCard) return;

    const flatDeck = deck.map(c => ({
      set: c.setAbbrev || c.set,
      number: c.number,
      count: c.count,

      name: c.name,
      supertype: c.supertype,
      setAbbrev: c.setAbbrev || c.set,
      regulationMark: c.regulationMark || '',

      images: c.images
        ? { small: c.images.small, large: c.images.large }
        : undefined,
    }));

    setSaving(true)
    try {
      const token = localStorage.getItem('PTCGLegendsToken')
      const url = overwriteMode && originalDeckId
        ? `/api/user/decks/${originalDeckId}`
        : '/api/user/decks';
      const method = overwriteMode && originalDeckId ? 'PUT' : 'POST';
      const payload = {
        name,
        mascotCard,
        secondaryMascotCard,
        description: desc,
        decklist: flatDeck,
        ...(overwriteMode ? {} : { folderId: selectedFolderId || null })
      };
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json();
        const deckId = overwriteMode && originalDeckId
          ? originalDeckId
          : (data.deck?._id || data._id);

        if (selectedFolderId && deckId) {
          await fetch(`/api/user/decks/${deckId}/move`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ folderId: selectedFolderId })
          }).catch(console.error);
        }

        window.location.href = '/taco';
        setShowSaveModal(false);
        setDeckName('');
        setSelectedMascot('');
        setSecondaryMascot('');
        setDescription('');
        setOverwriteDeckName('');
        setOverwriteMascot('');
        setOverwriteSecondary('');
        setOverwriteDescription('');
        setSelectedFolderId('');
      } else {
        console.error('Failed to save deck')
      }
    } catch (err) {
      console.error('Error saving deck', err)
    } finally {
      setSaving(false)
    }
  }

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
          <div className="deck-collection-modal-box save-deck-modal">
            {!user ? (
              <>
                <p>You need to be logged in to save decks and view your deck collection.</p>
                <div className='buttons-row-modal'>
                  <button
                    className='save-button'
                    onClick={handleModalSave}
                    disabled={
                      saving ||
                      (overwriteMode
                        ? !overwriteDeckName.trim() || !overwriteMascot
                        : !deckName.trim() || !selectedMascot)
                    }
                  ></button>
                  <button className='cancel-button' onClick={() => setShowSaveModal(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                {originalDeckId && originalMeta && (
                  <>
                    <label
                      className={`folder-tab tab-new ${!overwriteMode ? 'active' : ''}`}
                      onClick={() => setOverwriteMode(false)}
                    >
                      <input
                        type="radio"
                        checked={!overwriteMode}
                        onChange={() => setOverwriteMode(false)}
                        className="visually-hidden"
                        aria-label="Save as new deck"
                      />
                      <span>Save New Deck</span>
                    </label>
                    <label
                      className={`folder-tab tab-overwrite ${overwriteMode ? 'active' : ''}`}
                      onClick={() => setOverwriteMode(true)}
                    >
                      <input
                        type="radio"
                        checked={overwriteMode}
                        onChange={() => setOverwriteMode(true)}
                        className="visually-hidden"
                        aria-label="Overwrite existing deck"
                      />
                      <span>Overwrite Deck</span>
                    </label>
                    <div className="save-overwrite-decks-container only-overwrite" style={{ display: 'none' }} />
                  </>
                )}
                <h3 className='push-ttl-dwn'>{overwriteMode ? 'Overwrite Deck (Opened from Collection)' : 'Save as New Deck'}</h3>
                <label>
                  Name*<br />
                  <input
                    type="text"
                    value={overwriteMode ? overwriteDeckName : deckName}
                    onChange={e => overwriteMode ? setOverwriteDeckName(e.target.value) : setDeckName(e.target.value)}
                  />
                </label>
                <label>
                  Assign to Folder<br />
                  <select
                    value={selectedFolderId}
                    onChange={e => setSelectedFolderId(e.target.value)}
                  >
                    <option value="">None</option>
                    {folders.map(f => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Mascot*<br />
                  <MascotSelect
                    value={overwriteMode ? overwriteMascot : selectedMascot}
                    onChange={val => overwriteMode ? setOverwriteMascot(val) : setSelectedMascot(val)}
                    deck={deck}
                    placeholder="Select a card"
                  />
                </label>
                <label>
                  Secondary Mascot<br />
                  <MascotSelect
                    value={overwriteMode ? overwriteSecondary : secondaryMascot}
                    onChange={val => overwriteMode ? setOverwriteSecondary(val) : setSecondaryMascot(val)}
                    deck={deck}
                    placeholder="None"
                    allowNone
                    noneLabel="None"
                  />
                </label>
                <label>
                  Description<br />
                  <textarea
                    value={overwriteMode ? overwriteDescription : description}
                    onChange={e => overwriteMode ? setOverwriteDescription(e.target.value) : setDescription(e.target.value)}
                  />
                </label>
                <div className="buttons-row-modal push-more-dwn">
                  <button className='cancel-button' onClick={() => setShowSaveModal(false)} disabled={saving}>Cancel</button>
                  <button
                    className='save-button'
                    onClick={handleModalSave}
                    disabled={
                      saving ||
                      (overwriteMode
                        ? !overwriteDeckName.trim() || !overwriteMascot
                        : !deckName.trim() || !selectedMascot)
                    }
                  >Save
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
