import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Account.css'

export default function Account() {
  // Only user & logout come from context
  const { user, logout } = useContext(AuthContext);
  const token = user?.token;            // <-- derive token here
  const navigate = useNavigate();

  const [tab, setTab] = useState('profile');
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [selectedDeck, setSelectedDeck] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/user/decks', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load decks');
        return res.json();
      })
      .then(async decks => {
        // for each deck, pull its mascotCard image from your cards API
        const withImages = await Promise.all(
          decks.map(async deck => {
            // mascotCard is e.g. "TWM-95"
            const [set, num] = deck.mascotCard.split('-');
            try {
              const r = await fetch(`/api/cards/${set}/${num}`);
              const card = await r.json();
              return {
                ...deck,
                mascotImageUrl: card.images?.large || card.images?.small
              };
            } catch {
              return deck;
            }
          })
        );
        setDecks(withImages);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const openModal = deck => setSelectedDeck(deck);
  const closeModal = () => setSelectedDeck(null);

  if (loading) return <p>Loading your decks…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="account-page">
      <div className="account-tabs">
        <button onClick={() => setTab('decks')} className={`decks-account-btn ${tab === 'decks' ? 'active' : ''}`}>
          Deck Collection
        </button>
        <button onClick={() => setTab('profile')} className={`profile-account-btn ${tab === 'profile' ? 'active' : ''}`}>
          Profile <span className="material-symbols-outlined">settings_account_box</span>
        </button>
      </div>
      {tab === 'profile' ? (
        <section>
          <p><strong>Email:</strong> {user?.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </section>
      ) : (
        <section>
          {decks.length === 0
            ? <p>You haven’t saved any decks yet.</p>
            : (
              <div className="account-decks">
                <div className="decks-grid">
                    {decks.map((d,i) => {
                    // assume you’ve attached `d.mascotImageUrl` when you fetched decks
                    return (
                        <div
                            key={i}
                            className="deck-card"
                            onClick={() => openModal(d)}
                        >
                            <div className="deck-card-img">
                                <img
                                    src={d.mascotImageUrl}
                                    alt={`${d.name} mascot`}
                                    className="cropped-mascot-card"
                                />
                            </div>
                            <div className="deck-card-info">
                                <h3>{d.name}</h3>
                                {d.description && <p>{d.description}</p>}
                            </div>
                        </div>
                    );
                    })}
                </div>

                {selectedDeck && (
                    <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <h2>{selectedDeck.name}</h2>
                        <p><strong>Mascot:</strong> {selectedDeck.mascotCard}</p>
                        {selectedDeck.description && <p>{selectedDeck.description}</p>}

                        {/* reuse your deck‑grid from PlayerDeck */}
                        <div className="deck-cards">
                        {selectedDeck.decklist.pokemon.map((c,i)=>(
                            <div key={i} className="card-container">
                                <img src={c.imageUrl} alt={c.name}/>
                                <div className="card-count">{c.count}</div>
                            </div>
                        ))}
                        {selectedDeck.decklist.trainer.map((c,i)=>(
                            <div key={i} className="card-container">
                                <img src={c.imageUrl} alt={c.name}/>
                                <div className="card-count">{c.count}</div>
                            </div>
                        ))}
                        {selectedDeck.decklist.energy.map((c,i)=>(
                            <div key={i} className="card-container">
                                <img src={c.imageUrl} alt={c.name}/>
                                <div className="card-count">{c.count}</div>
                            </div>
                        ))}
                        </div>

                        <button
                            className="edit-button"
                            onClick={() => window.open(`/deckbuilder#deck=${encodeURIComponent(JSON.stringify(selectedDeck.decklist))}`, '_blank')}
                            >
                            Edit in DeckBuilder
                        </button>
                    </div>
                    </div>
                )}
              </div>
            )
          }
        </section>
      )}
    </div>
  );
}
