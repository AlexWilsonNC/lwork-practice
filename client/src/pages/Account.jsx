import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Account.css'
import styled from 'styled-components';

const AccountSection = styled.div`
    background-color: ${({ theme }) => theme.loginbg};
    .deck-card-info {
        color: ${({ theme }) => theme.text};
    }
    .deck-card {
        background-color: ${({ theme }) => theme.savedDeckBg};
    }
    .favorite-heart {
        top: 0.5rem;
        right: 0.5rem;
        font-size: 1.5rem;
        cursor: pointer;
        color: ${({ theme }) => theme.favoriteHeart};
        transition: color 0.2s;
    }
    .favorite-heart.active {
        color: ${({ theme }) => theme.favoriteHeartRed};
    }
    .sort-favorites-btn {
        margin-bottom: 1rem;
    }
    .create-new-deck-link-btn {
        background-color: ${({ theme }) => theme.profileDarkBlue};
    }
    .account-tabs {
        background-color: ${({ theme }) => theme.profileSliderBg};
    }
`;

export default function Account() {
    const { user, logout } = useContext(AuthContext);
    const token = user?.token;
    const navigate = useNavigate();

    const [tab, setTab] = useState('decks');
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [selectedDeck, setSelectedDeck] = useState(null);

    const [favorites, setFavorites] = useState(new Set());
    const [showFavorites, setShowFavorites] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const menuContainerRef = useRef(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showDescModal, setShowDescModal] = useState(false);
    const [modalDeck, setModalDeck] = useState(null);
    const [newValue, setNewValue] = useState('');

    const [folders, setFolders] = useState([]);
    const [activeFolder, setActiveFolder] = useState(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [moveModalDeck, setMoveModalDeck] = useState(null);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
    const [renameFolderName, setRenameFolderName] = useState('');
    const [showSortModal, setShowSortModal] = useState(false);
    const [foldersOrder, setFoldersOrder] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuOpenId !== null &&
                menuContainerRef.current &&
                !menuContainerRef.current.contains(e.target)
            ) {
                setMenuOpenId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpenId]);

    const openMenu = (e, id) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    const toggleFavorite = async id => {
        const next = new Set(favorites);
        const isNowFav = next.has(id) ? (next.delete(id), false) : (next.add(id), true);
        setFavorites(next);

        try {
            const res = await fetch(`/api/user/decks/${id}/favorite`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ favorite: isNowFav })
            });
            if (!res.ok) throw new Error('failed to update');

            setDecks(ds =>
                ds.map(d => d._id === id
                    ? { ...d, favorite: isNowFav }
                    : d
                )
            );
        } catch (err) {
            console.error(err);
        }
    };
    const handleRename = async () => {
        await fetch(`/api/user/decks/${modalDeck._id}/rename`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: newValue })
        });
        setShowRenameModal(false);
        setMenuOpenId(null);
    };

    const handleDescr = async () => {
        await fetch(`/api/user/decks/${modalDeck._id}/description`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ description: newValue })
        });
        setShowDescModal(false);
        setMenuOpenId(null);
    };

    const handleDuplicate = async deck => {
        const res = await fetch(`/api/user/decks/${deck._id}/duplicate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        const { deck: newDeck } = await res.json();
        setDecks(ds => [...ds, { ...newDeck, mascotImageUrl: deck.mascotImageUrl }]);
        setMenuOpenId(null);
    }

    const handleDelete = async deck => {
        if (!window.confirm('Permanently delete this deck from your collection?')) return;
        await fetch(`/api/user/decks/${deck._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        setDecks(ds => ds.filter(d => d._id !== deck._id));
        setMenuOpenId(null);
    };

    const handleRenameFolder = async () => {
        try {
            const res = await fetch(`/api/user/folders/${activeFolder}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: renameFolderName.trim() }),
            });
            if (!res.ok) throw new Error('Failed to rename folder');
            setFolders(fs =>
                fs.map(f => (f._id === activeFolder ? { ...f, name: renameFolderName.trim() } : f))
            );
            setShowRenameFolderModal(false);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDeleteFolder = async () => {
        if (!window.confirm('Delete this folder? All its decks will become un‐assigned.')) return;
        try {
            const res = await fetch(`/api/user/folders/${activeFolder}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete folder');
            setFolders(fs => fs.filter(f => f._id !== activeFolder));
            setActiveFolder(null);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    function goToDeckbuilder(deck) {
        const raw = deck.decklist;
        const cards = Array.isArray(raw)
            ? raw
            : [
                ...(raw.pokemon || []),
                ...(raw.trainer || []),
                ...(raw.energy || []),
            ];

        const minimal = cards.map(c => ({
            set: c.setAbbrev || c.set,
            number: c.number,
            count: c.count,
        }));

        const fragment = encodeURIComponent(JSON.stringify(minimal));
        window.location.href =
            `/ljhksdgbnksgkjsiodsfi?deckId=${deck._id}#deck=${fragment}`;
    }

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
                const withImages = await Promise.all(
                    decks.map(async deck => {
                        const [set, num] = deck.mascotCard.split('-');
                        try {
                            const r = await fetch(`/api/cards/${set}/${num}`);
                            const card = await r.json();
                            return {
                                ...deck,
                                mascotImageUrl: card.images?.large || card.images?.small,
                                hasAncientTrait: !!card.ancientTrait
                            };
                        } catch {
                            return deck;
                        }
                    })
                );
                const favs = new Set(
                    withImages
                        .filter(d => d.favorite)
                        .map(d => d._id)
                );
                setFavorites(favs);
                setDecks(withImages);
                // load this user’s folders and seed both `folders` and `foldersOrder`
                fetch('/api/user/folders', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to load folders');
                        return res.json();
                    })
                    .then(data => {
                        const list = data.folders || data;       // in case your API returns { folders: [...] }
                        list.sort((a, b) => a.order - b.order);
                        setFolders(list);
                        setFoldersOrder(list.map(f => f._id));
                    })
                    .catch(err => console.error('Failed to load folders', err));
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
    if (error) return <p className="error">{error}</p>;

    const displayedDecks = (showFavorites
        ? decks.filter(d => d.favorite)
        : decks
    ).filter(d =>
        activeFolder
            ? String(d.folderId) === activeFolder
            : true
    );

    return (
        <AccountSection className="account-page">
            <div className="account-tabs">
                <button onClick={() => setTab('decks')} className={`decks-account-btn ${tab === 'decks' ? 'active' : ''}`}>
                    Deck Collection
                </button>
                <button onClick={() => setTab('profile')} className={`profile-account-btn ${tab === 'profile' ? 'active' : ''}`}>
                    Profile Settings
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
                                <div className="folders-bar">
                                    <button className='create-new-folder-btn' onClick={() => setShowFolderModal(true)}>+ New Folder</button>
                                    <button className='create-new-deck-link-btn' onClick={() => navigate('/ljhksdgbnksgkjsiodsfi')}><span className="material-symbols-outlined">contract_edit</span> Create New Deck</button>
                                </div>
                                <button
                                    className="folder-options-icon"
                                    onClick={() => {
                                        setFoldersOrder(folders.map(f => f._id));
                                        setShowSortModal(true);
                                    }}
                                >
                                    <span className="material-symbols-outlined">swap_horiz</span>
                                    <p>Organize Folders</p>
                                </button>
                                <div className="folders-list">
                                    <button
                                        className={!activeFolder ? 'active' : ''}
                                        onClick={() => setActiveFolder(null)}
                                    >All Decks</button>
                                    {folders.map(f => (
                                        <button
                                            key={f._id}
                                            className={f._id === activeFolder ? 'active' : ''}
                                            onClick={() => setActiveFolder(f._id)}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                                <div className='folder-options'>
                                    <button
                                        className="sort-favorites-btn"
                                        onClick={() => setShowFavorites(!showFavorites)}
                                    >
                                        {showFavorites ? (
                                            <>
                                                <p>Show All Decks</p>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">favorite</span>
                                                <p>Show Favorites</p>
                                            </>
                                        )}
                                    </button>
                                    {activeFolder && (
                                        <div className="folder-controls">
                                            <button
                                                className="sort-favorites-btn"
                                                onClick={() => {
                                                    // prefill with current folder’s name
                                                    const f = folders.find(f => f._id === activeFolder);
                                                    setRenameFolderName(f?.name || '');
                                                    setShowRenameFolderModal(true);
                                                }}
                                            >
                                                <span className="material-symbols-outlined">drive_file_rename_outline</span>
                                                <p>Rename Folder</p>
                                            </button>
                                            <button
                                                className="sort-favorites-btn"
                                                onClick={handleDeleteFolder}
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                                <p>Delete Folder</p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="decks-grid">
                                    {displayedDecks
                                        .filter(d => d != null)
                                        .map((d, i) => {
                                            const id = d._id || d.createdAt;
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
                                                            style={{
                                                                // if mascot card has an ancient trait, nudge it down a bit
                                                                top: d.hasAncientTrait ? '-80%' : undefined
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="deck-card-info">
                                                        <div className='favorite-heart-container'>
                                                            <span
                                                                className={`favorite-heart material-symbols-outlined ${d.favorite ? 'active' : ''}`}
                                                                onClick={e => { e.stopPropagation(); toggleFavorite(d._id); }}

                                                            >
                                                                {favorites.has(id) ? 'favorite' : 'favorite_border'}
                                                            </span>
                                                            <div
                                                                ref={el => {
                                                                    if (menuOpenId === d._id) {
                                                                        menuContainerRef.current = el;
                                                                    }
                                                                }}
                                                            >
                                                                <span
                                                                    className="material-symbols-outlined menu-icon"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        openMenu(e, d._id);
                                                                    }}
                                                                >
                                                                    more_vert
                                                                </span>
                                                                {menuOpenId === d._id && (
                                                                    <div className="deckcollection-menu-dropdown">
                                                                        <button onClick={e => {
                                                                            e.stopPropagation();
                                                                            setModalDeck(d);
                                                                            setNewValue(d.name);
                                                                            setShowRenameModal(true);
                                                                        }}>
                                                                            Rename
                                                                        </button>
                                                                        <button onClick={e => {
                                                                            e.stopPropagation();
                                                                            setModalDeck(d);
                                                                            setNewValue(d.description || '');
                                                                            setShowDescModal(true);
                                                                        }}>
                                                                            Edit Description
                                                                        </button>
                                                                        <button onClick={() => goToDeckbuilder(d)}>
                                                                            Edit in Deckbuilder
                                                                        </button>
                                                                        <button onClick={e => { e.stopPropagation(); handleDuplicate(d); }}>
                                                                            Duplicate
                                                                        </button>
                                                                        <button onClick={e => {
                                                                            e.stopPropagation();
                                                                            setMoveModalDeck(d);
                                                                            setSelectedFolderId(d.folderId || '');
                                                                            setShowMoveModal(true);
                                                                        }}>Move</button>
                                                                        <button onClick={e => { e.stopPropagation(); handleDelete(d); }}>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {!activeFolder && d.folderId && (
                                                            <span className="folder-label">
                                                                {folders.find(f => f._id === d.folderId)?.name || '—'}
                                                            </span>
                                                        )}
                                                        <h3>{d.name}</h3>
                                                        <hr className='saved-deck-hr'></hr>
                                                        {d.description && <p className='deck-card-description'>{d.description}</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                {showRenameModal && (
                                    <div className="deck-edit-modal">
                                        <div className="deck-edit-modal-box">
                                            <h4>Rename Deck</h4>
                                            <input
                                                value={newValue}
                                                onChange={e => setNewValue(e.target.value)}
                                            />
                                            <button onClick={() => setShowRenameModal(false)}>Cancel</button>
                                            <button onClick={handleRename} disabled={!newValue.trim()}>Save</button>
                                        </div>
                                    </div>
                                )}
                                {showDescModal && (
                                    <div className="deck-edit-modal">
                                        <div className="deck-edit-modal-box">
                                            <h4>Edit Description</h4>
                                            <textarea
                                                value={newValue}
                                                onChange={e => setNewValue(e.target.value)}
                                            />
                                            <button onClick={() => setShowDescModal(false)}>Cancel</button>
                                            <button onClick={handleDescr}>Save</button>
                                        </div>
                                    </div>
                                )}
                                {selectedDeck && (
                                    <div className="modal-overlay" onClick={closeModal}>
                                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                                            <button className="modal-close" onClick={closeModal}>×</button>
                                            <h2>{selectedDeck.name}</h2>
                                            <p><strong>Mascot:</strong> {selectedDeck.mascotCard}</p>
                                            {selectedDeck.description && <p>{selectedDeck.description}</p>}

                                            <div className="deck-cards">
                                                {selectedDeck.decklist.pokemon.map((c, i) => (
                                                    <div key={i} className="card-container">
                                                        <img src={c.imageUrl} alt={c.name} />
                                                        <div className="card-count">{c.count}</div>
                                                    </div>
                                                ))}
                                                {selectedDeck.decklist.trainer.map((c, i) => (
                                                    <div key={i} className="card-container">
                                                        <img src={c.imageUrl} alt={c.name} />
                                                        <div className="card-count">{c.count}</div>
                                                    </div>
                                                ))}
                                                {selectedDeck.decklist.energy.map((c, i) => (
                                                    <div key={i} className="card-container">
                                                        <img src={c.imageUrl} alt={c.name} />
                                                        <div className="card-count">{c.count}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* <button
                                                className="edit-button"
                                                onClick={() => window.open(`/ljhksdgbnksgkjsiodsfi#deck=${encodeURIComponent(JSON.stringify(selectedDeck.decklist))}`, '_blank')}
                                            >
                                                Edit in DeckBuilder
                                            </button> */}
                                        </div>
                                    </div>
                                )}
                                {showFolderModal && (
                                    <div className="deck-collection-modal-overlay" onClick={() => setShowFolderModal(false)}>
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>New Folder</h4>
                                            <input
                                                placeholder="Folder name"
                                                value={newFolderName}
                                                onChange={e => setNewFolderName(e.target.value)}
                                            />
                                            <div className='buttons-row-modal'>
                                                <button className='cancel-button' onClick={() => setShowFolderModal(false)}>Cancel</button>
                                                <button
                                                    style={{
                                                        backgroundColor: newFolderName.trim() ? '#1290eb' : '#1290eb'
                                                    }}
                                                    disabled={!newFolderName.trim()}
                                                    onClick={async () => {
                                                        try {
                                                            const res = await fetch('/api/user/folders', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({ name: newFolderName.trim() })
                                                            });
                                                            if (!res.ok) throw new Error('Failed to create folder');

                                                            const payload = await res.json();
                                                            const list = payload.folders || payload;
                                                            const created = Array.isArray(list)
                                                                ? list[list.length - 1]
                                                                : list;

                                                            setFolders(fs => [...fs, created]);
                                                            setFoldersOrder(o => [...o, created._id]);
                                                            setNewFolderName('');
                                                            setShowFolderModal(false);
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert(err.message);
                                                        }
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showMoveModal && (
                                    <div className="modal-overlay" onClick={() => setShowMoveModal(false)}>
                                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>Move “{moveModalDeck.name}” to…</h4>
                                            <select
                                                value={selectedFolderId || ''}
                                                onChange={e => setSelectedFolderId(e.target.value)}
                                            >
                                                <option value="">— Unassigned —</option>
                                                {folders.map(f => (
                                                    <option key={f._id} value={f._id}>{f.name}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => setShowMoveModal(false)}>Cancel</button>
                                            <button onClick={async () => {
                                                try {
                                                    const res = await fetch(
                                                        `/api/user/decks/${moveModalDeck._id}/move`,
                                                        {
                                                            method: 'PATCH',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                Authorization: `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify({ folderId: selectedFolderId || null })
                                                        }
                                                    );
                                                    if (!res.ok) {
                                                        const err = await res.json();
                                                        throw new Error(err.error || 'Failed to move deck');
                                                    }
                                                    const json = await res.json();
                                                    const updatedDeck = json.deck;
                                                    if (!updatedDeck) {
                                                        throw new Error('No deck returned from server');
                                                    }
                                                    setDecks(ds =>
                                                        ds.map(d => {
                                                            if (d._id !== updatedDeck._id) return d;
                                                            return {
                                                                ...d,
                                                                ...updatedDeck
                                                            };
                                                        })
                                                    );
                                                } catch (err) {
                                                    console.error('Move failed:', err);
                                                } finally {
                                                    setShowMoveModal(false);
                                                }
                                            }}>Move</button>
                                        </div>
                                    </div>
                                )}
                                {showRenameFolderModal && (
                                    <div
                                        className="modal-overlay"
                                        onClick={() => setShowRenameFolderModal(false)}
                                    >
                                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>Rename Folder</h4>
                                            <input
                                                value={renameFolderName}
                                                onChange={e => setRenameFolderName(e.target.value)}
                                            />
                                            <div className="modal-actions">
                                                <button onClick={() => setShowRenameFolderModal(false)}>
                                                    Cancel
                                                </button>
                                                <button
                                                    disabled={!renameFolderName.trim()}
                                                    onClick={handleRenameFolder}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showSortModal && (
                                    <div
                                        className="deck-collection-modal-overlay"
                                        onClick={() => setShowSortModal(false)}
                                    >
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>Sort Folders</h4>
                                            <ul className="sort-folders-list">
                                                {(foldersOrder || []).map((id, idx) => {
                                                    const folder = (folders || []).find(f => f._id === id)
                                                    if (!folder) return null
                                                    return (
                                                        <li key={id}>
                                                            <div>
                                                                <span className='order-folder-name'>{folder.name}</span>
                                                            </div>
                                                            <button
                                                                className='up-sort-btn'
                                                                disabled={idx === 0}
                                                                onClick={() => {
                                                                    const o = [...foldersOrder];
                                                                    [o[idx - 1], o[idx]] = [o[idx], o[idx - 1]];
                                                                    setFoldersOrder(o);
                                                                }}
                                                            >
                                                                <span class="material-symbols-outlined">
                                                                    keyboard_arrow_up
                                                                </span>
                                                            </button>
                                                            <button
                                                                className='down-sort-btn'
                                                                disabled={idx === (foldersOrder || []).length - 1}
                                                                onClick={() => {
                                                                    const o = [...foldersOrder];
                                                                    [o[idx], o[idx + 1]] = [o[idx + 1], o[idx]];
                                                                    setFoldersOrder(o);
                                                                }}
                                                            >
                                                                <span class="material-symbols-outlined">
                                                                    keyboard_arrow_down
                                                                </span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                            <div className="buttons-row-modal">
                                                <button className='cancel-button' onClick={() => setShowSortModal(false)}>Cancel</button>
                                                <button
                                                    className='save-button'
                                                    onClick={async () => {
                                                        try {
                                                            const res = await fetch('/api/user/folders/sort', {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({ order: foldersOrder })
                                                            });
                                                            const data = await res.json();
                                                            if (!res.ok) throw new Error(data.error || 'Couldn’t save folder order');

                                                            const newList = Array.isArray(data) ? data : data.folders || [];
                                                            setFolders(newList);
                                                            setFoldersOrder(newList.map(f => f._id));
                                                            setShowSortModal(false);
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert('Could not save folder order: ' + err.message);
                                                        }
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )
                    }
                </section>
            )}
        </AccountSection>
    );
}
