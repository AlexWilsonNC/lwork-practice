import blueUltraBallSpinner from '../assets/logos/blue-ultra-ball.png'

const isUnlimitedByRules = (c) => {
  const r = c?.rules;
  if (!r) return false;
  const rx = /You may have as many of this card in your deck as you like/i;
  return Array.isArray(r) ? r.some(s => rx.test(s)) : rx.test(r);
};

export default function DeckList({ deck, onUpdateCount, onCardClick, loading = false, onCardDrop, onAddFromSearch, limitCounts = true, viewMode = 'image', zoomScale = 1, onAddCustomCard }) {
  const shrink = Array.isArray(deck) && deck.length > 45
  const BASE_CARD_WIDTH = 70;
  const BASE_MARGIN = 2.5;

  const handleFilesDrop = async (fileList, toIndex = deck.length) => {
    const files = Array.from(fileList || []).filter(f => {
      const hasImageMime = f.type && f.type.startsWith('image/');
      const byExt = /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i.test(f.name || '');
      return hasImageMime || byExt;
    });
    if (!files.length) return;

    const readAsDataURL = (file) =>
      new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.readAsDataURL(file);
      });

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    async function toThumbnailDataURL(file, targetW = 360, quality = 0.85) {
      const src = await readAsDataURL(file);
      const img = await loadImage(src);
      const ratio = img.height / img.width;
      const w = targetW;
      const h = Math.round(w * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try {
        return canvas.toDataURL('image/webp', quality);
      } catch {
        return canvas.toDataURL('image/jpeg', quality);
      }
    }

    const now = Date.now();
    const cards = [];
    let n = 0;
    for (const f of files) {
      const dataUrl = await toThumbnailDataURL(f, 240, 0.82);
      cards.push({
        uid: `CUSTOM-${now}-${n++}`,
        isCustom: true,
        name: f.name.replace(/\.(png|jpe?g|webp|gif)$/i, '') || 'Custom Image',
        supertype: 'Custom',
        setAbbrev: 'CUSTOM',
        number: String(now + n),
        count: 1,
        rules: 'You may have as many of this card in your deck as you like.',
        images: { small: dataUrl },
      });
    }

    if (typeof onAddCustomCard === 'function') {
      onAddCustomCard({ cards, toIndex });
    } else if (typeof onAddFromSearch === 'function') {
      onAddFromSearch({ cards, toIndex, from: 'files' });
    }
  };

  if (viewMode === 'list') {
    return (
      <div className={`deck-box list-view${shrink ? ' shrink-cards' : ''}`}>
        <table className="deck-list-table">
          <thead>
            <tr>
              <th>Count</th>
              <th>Name</th>
              <th>Set</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {deck.map((c, i) => (
              <tr key={`${c.setAbbrev}-${c.number}`}>
                <td>{c.count}</td>
                <td>{c.name}</td>
                <td>{c.setAbbrev}</td>
                <td>{c.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`deck-box${shrink ? ' shrink-cards' : ''}`}
      onDragOver={e => {
        const hasFiles = Array.from(e.dataTransfer?.types || []).includes('Files');
        if (hasFiles) {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDrop={async e => {
        const hasFiles = (e.dataTransfer?.files?.length || 0) > 0;
        if (!hasFiles) return;
        e.preventDefault();
        e.stopPropagation();
        await handleFilesDrop(e.dataTransfer.files, deck.length);
      }}>
      {loading && (
        <div className="deck-spinner">
          <img src={blueUltraBallSpinner}
            alt="Loading"
            className="pokeball-spinner"
          />
        </div>
      )}

      {!loading && deck.length === 0 && <p></p>}

      {!loading && deck.map((c, i) => {
        const isBasicEnergy =
          c.supertype === 'Energy' && c.name.startsWith('Basic')
        const unlimited = isUnlimitedByRules(c);

        const cardWidth = BASE_CARD_WIDTH * zoomScale
        const cardMargin = BASE_MARGIN * zoomScale

        return (
          <div
            key={c.uid || `${c.setAbbrev || 'CUSTOM'}-${c.number || i}`}
            className="deckbuilt-card-container"
            onClick={() => onCardClick(c)}
            style={{
              width: `${cardWidth}px`,
              margin: `${cardMargin}px`,
              position: 'relative'
            }}
            draggable
            onDragStart={e => {
              if (!c.isCustom) {
                e.dataTransfer.setData(
                  'application/ptcg-card',
                  JSON.stringify({
                    setAbbrev: c.setAbbrev,
                    number: c.number,
                    action: 'decrement'
                  })
                );
              }
              e.dataTransfer.setData('application/ptcg-reorder', String(i));
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={e => {
              const types = Array.from(e.dataTransfer?.types || []);
              const isReorder = types.includes('application/ptcg-reorder');
              const isFiles = types.includes('Files');
              if (!isReorder && !isFiles) return;
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = isFiles ? 'copy' : 'move';
              const rect = e.currentTarget.getBoundingClientRect();
              const threshold = rect.left + rect.width * 0.5;
              const before = e.clientX < threshold - 6;
              e.currentTarget.classList.toggle('drop-before', before);
              e.currentTarget.classList.toggle('drop-after', !before);
              e.currentTarget.__dropAfter = !before;
            }}
            onDragLeave={e => {
              const el = e.currentTarget;
              const r = el.getBoundingClientRect();
              const x = e.clientX ?? -1;
              const y = e.clientY ?? -1;
              if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return;
              el.classList.remove('drop-before', 'drop-after');
              el.__dropAfter = null;
            }}
            onDrop={async e => {
              const types = Array.from(e.dataTransfer?.types || []);
              const isFiles = (e.dataTransfer?.files?.length || 0) > 0;
              const isReorder = types.includes('application/ptcg-reorder');
              if (!isReorder && !isFiles) return;
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove('drop-before');
              e.currentTarget.classList.remove('drop-after');
              const after = !!e.currentTarget.__dropAfter;
              const to = after ? i + 1 : i;
              if (isFiles) {
                await handleFilesDrop(e.dataTransfer.files, to);
                return;
              }
              const from = parseInt(e.dataTransfer.getData('application/ptcg-reorder') || '-1', 10);
              if (Number.isInteger(from) && from !== -1 && from !== to) {
                if (typeof onAddFromSearch === 'function') {
                  onAddFromSearch({ fromIndex: from, toIndex: to });
                }
              }
            }}
          >
            <img
              src={c.images.small}
              draggable={false}
              onDragStart={e => e.preventDefault()}
              alt={c.name}
              className="database-card-in-list"
              style={
                c.isCustom
                  ? { width: '100%', aspectRatio: '0.71', objectFit: 'cover' }
                  : { width: '100%', height: 'auto' }
              }
            />
            <div
              className="deck-add-minus"
              style={{
                width: '100%',
                position: 'absolute',
              }}
            >
              <button
                onClick={e => {
                  e.stopPropagation()
                  onUpdateCount(i, c.count - 1)
                }}
                className='pm-card minus-card'
                style={{
                  fontSize: `${14 * zoomScale}px`,
                  padding: `${4 * zoomScale}px ${8 * zoomScale}px`,
                  height: `${20 * zoomScale}px`,
                  width: `${20 * zoomScale}px`,
                }}
              >–</button>
              <span
                className="current-cnt-num"
                style={{
                  fontSize: `${14 * zoomScale}px`,
                  height: `${20 * zoomScale}px`,
                  width: `${20 * zoomScale}px`,
                }}
              >{c.count}</span>
              <button
                onClick={e => {
                  e.stopPropagation()
                  onUpdateCount(i, c.count + 1)
                }}
                disabled={limitCounts && !isBasicEnergy && !unlimited && c.count >= 4}
                className='pm-card plus-card'
                style={{
                  fontSize: `${14 * zoomScale}px`,
                  padding: `${4 * zoomScale}px ${8 * zoomScale}px`,
                  height: `${20 * zoomScale}px`,
                  width: `${20 * zoomScale}px`,
                }}
              >＋</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
