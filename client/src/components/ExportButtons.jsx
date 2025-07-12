import React, { useState } from 'react'
import './ExportButtons.css'

export default function ExportButtons({ deck, onImportDeck }) {
  const [importing, setImporting] = useState(false)
  const copyText = () => {
    const text = deck
      .map(c => `${c.count} ${c.name} ${c.setAbbrev}-${c.number}`)
      .join('\n')
    navigator.clipboard.writeText(text)
  }

  const copyJson = () => {
    const json = deck.map(({ count, name, setAbbrev, number }) => ({
      count, name, set: setAbbrev, number
    }))
    navigator.clipboard.writeText(JSON.stringify(json, null, 2))
  }

   const handleImport = async () => {
    setImporting(true)
    try {
      await onImportDeck()
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="deck-build-options">
        <div class='all-options-box'>
            <div class='options-left'>
                <div class='options-row row-options-1'>
                    <button onClick={copyText} disabled={!deck.length}>
                        Copy as Text
                    </button>
                    <button onClick={copyJson} disabled={!deck.length}>
                        Copy as JSON
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={importing}
                    >
                        {importing ? 'Importing…' : 'Import Deck'}
                    </button>
                        {/* <div class='import-as-deck option-btn' onclick="importDeck()">
                            <span class="material-symbols-outlined">content_paste</span>
                            <p>Paste Deck</p>
                        </div>
                        <div class='copy-as-dckli option-btn'>
                            <span class="material-symbols-outlined">content_copy</span>
                            <p>Copy Deck</p>
                        </div>
                        <div class='share-decklist option-btn' style="opacity: 0.1;">
                            <span class="material-symbols-outlined">ios_share</span>
                            <p>Share Deck</p>
                        </div>
                        <div class='save-as-img option-btn' onclick="takeshot()" style="opacity: 0.1;">
                            <span class="material-symbols-outlined">photo_camera</span>
                            <p>Save Image</p>
                        </div>
                        <div class='print-deck option-btn' style="opacity: 0.1;">
                            <span class="material-symbols-outlined">print</span>
                            <p>Print List</p>
                        </div>
                        <div class='export-json option-btn'>
                            <span class="material-symbols-outlined">code</span>
                            <p>Export Jsoɴ</p>
                        </div> */}
                </div>
            </div>
        </div>
    </div>
  )
}
