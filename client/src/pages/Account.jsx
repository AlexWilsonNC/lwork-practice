import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Account.css'
import styled from 'styled-components';
import Spinner from '../contexts/Spinner';
import DeckList from '../DeckBuilder/DeckList';

const AccountSection = styled.div`
    background-color: ${({ theme }) => theme.loginbg};
    .deck-card-info {
        color: ${({ theme }) => theme.text};
    }
    .deck-list-item {
        color: ${({ theme }) => theme.text};
    }
    .deck-card {
        background-color: ${({ theme }) => theme.savedDeckBg};
    }
    .deck-list-item {
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
    .not-blue-p {
        color: ${({ theme }) => theme.text};
    }
    .folder-label-list-version {
        background-color: ${({ theme }) => theme.listVersionedFolderLabel};
    }
    .deck-box {
        background-image: ${({ theme }) => theme.deckModalAccountList};
        border: 3px solid rgba(94, 94, 94, 0.5);
        border-radius: 5px;
        margin-top: 5px;
    }
    .card-modal-content-account {
        color: ${({ theme }) => theme.text};
        background-image: ${({ theme }) => theme.decklistModalAccountPopupView};
    }
    .modal-close {
        color: ${({ theme }) => theme.modalCloseAccountList};
        text-shadow: none;
    }
    .deck-modal-actions button {
        background: ${({ theme }) => theme.decklistOpenedBtnBg};
        color: #f5f5f5;
    }
    .profile-item {
        color: ${({ theme }) => theme.text};
    }
    .profile-settings-display-edit {
        background-color: ${({ theme }) => theme.profilesettingsbg};
    }
`;

export default function Account() {
    const { user, logout, updateUserProfile, changePassword } = useContext(AuthContext);
    const token = user?.token;
    const { username } = useParams();
    const isPublicView = Boolean(username);
    const navigate = useNavigate();

    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPwModal, setShowPwModal] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [profileError, setProfileError] = useState('');

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
    const [lockedFolders, setLockedFolders] = useState(new Set());
    const [sortMenuOpenId, setSortMenuOpenId] = useState(null);
    const [sortMode, setSortMode] = useState(() => {
        const saved = localStorage.getItem('sortMode')
        return saved !== null ? parseInt(saved, 10) : 0
    })
    const [viewMode, setViewMode] = useState(
        () => localStorage.getItem('viewMode') || 'grid'
    );
    const [showMascotModal, setShowMascotModal] = useState(false);
    const [primaryMascot, setPrimaryMascot] = useState('');
    const [secondaryMascot, setSecondaryMascot] = useState('');
    // const [compactMode, setCompactMode] = useState(false);
    const [showAllFolders, setShowAllFolders] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 850);
    const [isSmallViewport, setIsSmallViewport] = useState(window.innerWidth <= 515);
    const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [publicFolders, setPublicFolders] = useState([]);

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
        const res = await fetch(
            `/api/user/decks/${modalDeck._id}/rename`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newValue.trim() }),
            }
        );
        if (!res.ok) {
            console.error(await res.text());
            throw new Error('Rename failed');
        }
        const payload = await res.json();
        // if your API returned { deck: {...} } use it, else fallback to modalDeck+newValue
        const returned = payload.deck || payload;
        const id = returned._id || modalDeck._id;
        const name = returned.name || newValue.trim();

        setDecks(ds =>
            ds.map(d =>
                d._id === id
                    ? { ...d, name }
                    : d
            )
        );
        setShowRenameModal(false);
        setMenuOpenId(null);
    };

    const handleDescr = async () => {
        const res = await fetch(
            `/api/user/decks/${modalDeck._id}/description`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ description: newValue.trim() }),
            }
        );
        if (!res.ok) {
            console.error(await res.text());
            throw new Error('Update description failed');
        }
        const payload = await res.json();
        const returned = payload.deck || payload;
        const id = returned._id || modalDeck._id;
        const desc = returned.description || newValue.trim();

        setDecks(ds =>
            ds.map(d =>
                d._id === id
                    ? { ...d, description: desc }
                    : d
            )
        );
        setShowDescModal(false);
        setMenuOpenId(null);
    };

    const handleDuplicate = async deck => {
        const res = await fetch(`/api/user/decks/${deck._id}/duplicate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        const { deck: newDeck } = await res.json();

        const duplicateWithFolder = {
            ...newDeck,
            mascotImageUrl: deck.mascotImageUrl,
            folderId: deck.folderId
        };

        setDecks(ds => [...ds, duplicateWithFolder]);
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

    function goToDeckbuilder(deck, newTab = false) {
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
        const url = `/ljhksdgbnksgkjsiodsfi?deckId=${deck._id}#deck=${fragment}`;

        if (newTab) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = url;
        }
    }

    const handleCreateFolder = async () => {
        const name = newFolderName.trim();
        if (!name) return;

        try {
            const res = await fetch('/api/user/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });
            if (!res.ok) throw new Error('Failed to create folder');

            const payload = await res.json();
            const list = payload.folders || payload;
            const created = Array.isArray(list) ? list[list.length - 1] : list;

            setFolders(fs => [...fs, created]);
            setFoldersOrder(o => [...o, created._id]);
            setNewFolderName('');
            setShowFolderModal(false);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    useEffect(() => {
        setLoading(true);

        if (isPublicView) {
            fetch(`/api/public/${username}/deck-collection`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load public collection');
                    return res.json();
                })
                .then(async ({ folders: pubFolders, decks: pubDecks }) => {
                    const sortedFolders = [...pubFolders].sort((a, b) => a.order - b.order);
                    setFolders(sortedFolders);
                    // 2) capture that order for the "Folder Order" sortMode
                    setFoldersOrder(sortedFolders.map(f => f._id));

                    const withImages = await Promise.all(
                        pubDecks.map(async deck => {
                            const sep = deck.mascotCard.lastIndexOf('-');
                            const set = deck.mascotCard.slice(0, sep);
                            const num = deck.mascotCard.slice(sep + 1);

                            let secondaryMascotImageUrl = null;
                            if (deck.secondaryMascotCard) {
                                const sep2 = deck.secondaryMascotCard.lastIndexOf('-');
                                const set2 = deck.secondaryMascotCard.slice(0, sep2);
                                const num2 = deck.secondaryMascotCard.slice(sep2 + 1);
                                try {
                                    const r2 = await fetch(`/api/cards/${set2}/${num2}`);
                                    const card2 = await r2.json();
                                    secondaryMascotImageUrl =
                                        card2.images?.large || card2.images?.small;
                                } catch { /* ignore */ }
                            }

                            try {
                                const r = await fetch(`/api/cards/${set}/${num}`);
                                const card = await r.json();
                                return {
                                    ...deck,
                                    mascotImageUrl: card.images?.large || card.images?.small,
                                    secondaryMascotImageUrl,
                                    hasAncientTrait: !!card.ancientTrait,
                                    isTagTeam: card.subtypes?.includes('TAG TEAM'),
                                    hasBreakTrait: card.subtypes?.includes('BREAK'),
                                    isLegendCard: card.subtypes?.includes('LEGEND'),
                                    specificallyLugiaLegend: card.name === 'Lugia LEGEND',
                                    specificallyZoroarkGX: card.name === 'Zoroark-GX'
                                };
                            } catch {
                                return { ...deck, secondaryMascotImageUrl };
                            }
                        })
                    );
                    setDecks(withImages);
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message || 'Error loading public collection');
                })
                .finally(() => setLoading(false));

        } else {
            // — Private view: creating folders and decks
            if (!token) {
                setLoading(false);
                return;
            }

            fetch('/api/user/decks', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load decks');
                    return res.json();
                })
                .then(async decks => {
                    const withImages = await Promise.all(
                        decks.map(async deck => {
                            const sep = deck.mascotCard.lastIndexOf('-');
                            const set = deck.mascotCard.slice(0, sep);
                            const num = deck.mascotCard.slice(sep + 1);

                            let secondaryMascotImageUrl = null;
                            if (deck.secondaryMascotCard) {
                                const sep2 = deck.secondaryMascotCard.lastIndexOf('-');
                                const set2 = deck.secondaryMascotCard.slice(0, sep2);
                                const num2 = deck.secondaryMascotCard.slice(sep2 + 1);
                                try {
                                    const r2 = await fetch(`/api/cards/${set2}/${num2}`);
                                    const card2 = await r2.json();
                                    secondaryMascotImageUrl =
                                        card2.images?.large || card2.images?.small;
                                } catch { /* ignore */ }
                            }

                            try {
                                const r = await fetch(`/api/cards/${set}/${num}`);
                                const card = await r.json();
                                return {
                                    ...deck,
                                    mascotImageUrl: card.images?.large || card.images?.small,
                                    secondaryMascotImageUrl,
                                    hasAncientTrait: !!card.ancientTrait,
                                    isTagTeam: card.subtypes?.includes('TAG TEAM'),
                                    hasBreakTrait: card.subtypes?.includes('BREAK'),
                                    isLegendCard: card.subtypes?.includes('LEGEND'),
                                    specificallyLugiaLegend: card.name === 'Lugia LEGEND',
                                    specificallyZoroarkGX: card.name === 'Zoroark-GX'
                                };
                            } catch {
                                return { ...deck, secondaryMascotImageUrl };
                            }
                        })
                    );
                    const favs = new Set(
                        withImages.filter(d => d.favorite).map(d => d._id)
                    );
                    setFavorites(favs);
                    setDecks(withImages);

                    return fetch('/api/user/folders', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });
                })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load folders');
                    return res.json();
                })
                .then(data => {
                    const list = data.folders || data;
                    list.sort((a, b) => a.order - b.order);
                    setFolders(list);
                    setFoldersOrder(list.map(f => f._id));
                    setLockedFolders(
                        new Set(list.filter(f => f.locked).map(f => f._id))
                    );
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [token, isPublicView, username]);

    const openModal = deck => setSelectedDeck(deck);
    const closeModal = () => setSelectedDeck(null);

    const filteredDecks = (showFavorites ? decks.filter(d => d.favorite) : decks)
        .filter(d => activeFolder ? String(d.folderId) === activeFolder : true);

    const displayedDecks = React.useMemo(() => {
        const arr = [...filteredDecks];
        switch (sortMode) {
            case 0:
                // newest first
                return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 2:
                // A → Z
                return arr.sort((a, b) => a.name.localeCompare(b.name));
            case 3:
                // by your folder order
                return arr.sort((a, b) => {
                    const ai = foldersOrder.indexOf(a.folderId);
                    const bi = foldersOrder.indexOf(b.folderId);
                    // decks with no folder go last
                    const aidx = ai === -1 ? foldersOrder.length : ai;
                    const bidx = bi === -1 ? foldersOrder.length : bi;
                    if (aidx !== bidx) return aidx - bidx;
                    // fall back to newest
                    return a.name.localeCompare(b.name);
                });
            case 1:
                // oldest first
                return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            default:
                return arr;
        }
    }, [filteredDecks, sortMode, foldersOrder]);

    useEffect(() => {
        localStorage.setItem('sortMode', sortMode)
    }, [sortMode])
    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    const moveFolderToTop = id => {
        setFoldersOrder(o => {
            const rest = o.filter(x => x !== id);

            let prefixLen = 0;
            while (prefixLen < rest.length && lockedFolders.has(rest[prefixLen])) {
                prefixLen++;
            }

            return [
                ...rest.slice(0, prefixLen),
                id,
                ...rest.slice(prefixLen),
            ];
        });
    };

    const moveFolderToBottom = id => {
        setFoldersOrder(o => {
            const rest = o.filter(x => x !== id);

            let idx = rest.length - 1;
            while (idx >= 0 && lockedFolders.has(rest[idx])) {
                idx--;
            }
            const insertAt = idx + 1;

            return [
                ...rest.slice(0, insertAt),
                id,
                ...rest.slice(insertAt),
            ];
        });
    };

    const toggleLockFolder = id => {
        setLockedFolders(s => {
            const next = new Set(s);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const openPrivacyModal = () => {
        setPublicFolders(
            folders.map(f => ({ id: f._id, name: f.name, isPublic: f.isPublic }))
        );
        setShowPrivacyModal(true);
    };

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 850);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        if (!isMobileView) setShowAllFolders(false);
    }, [isMobileView]);
    useEffect(() => {
        const handleResize = () => setIsSmallViewport(window.innerWidth <= 515);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        if (!isSmallViewport) setMobileActionsOpen(false);
    }, [isSmallViewport]);

    const doPreset = sortedIds => {
        setFoldersOrder(oldOrder => {
            const locks = new Set(lockedFolders);
            const lockedPos = oldOrder
                .map((id, i) => locks.has(id) ? [i, id] : null)
                .filter(Boolean);

            const unlocked = sortedIds.filter(id => !locks.has(id));

            const out = [];
            let ui = 0;
            for (let i = 0; i < oldOrder.length; i++) {
                const lp = lockedPos.find(p => p[0] === i);
                if (lp) out[i] = lp[1];
                else out[i] = unlocked[ui++];
            }
            return out;
        });
    };
    const selectedFolder = folders.find(f => f._id === selectedDeck?.folderId);

    useEffect(() => {
        function handleGlobalClick() {
            if (mobileActionsOpen) {
                setMobileActionsOpen(false);
            }
        }
        document.addEventListener('click', handleGlobalClick, true);
        return () => {
            document.removeEventListener('click', handleGlobalClick, true);
        };
    }, [mobileActionsOpen]);

    if (loading) return <Spinner />;
    if (error) return <p className="error">{error}</p>;

    return (
        <AccountSection className="account-page">
            {!isPublicView && (
                <div className="account-tabs">
                    <button onClick={() => setTab('decks')} className={`decks-account-btn ${tab === 'decks' ? 'active' : ''}`}>
                        Deck Collection
                    </button>
                    <button onClick={() => setTab('profile')} className={`profile-account-btn ${tab === 'profile' ? 'active' : ''}`}>
                        Profile
                    </button>
                </div>
            )}

            {tab === 'profile' ? (
                <section className='profile-settings-display-edit'>
                    <div className='profile-settings'>
                        <div className='profile-item'>
                            <strong>Username: </strong>
                            {editingField === 'username' ? (
                                <>
                                    <input
                                        type="text"
                                        value={tempValue}
                                        onChange={e => setTempValue(e.target.value)}
                                    />
                                    <button className='edit-user-prof-btn-cancel' onClick={() => setEditingField(null)}>Cancel</button>
                                    <button
                                        className='edit-user-prof-btn-save'
                                        onClick={async () => {
                                            try {
                                                await updateUserProfile({ username: tempValue });
                                                setEditingField(null);
                                            } catch (e) {
                                                setProfileError(e.message);
                                            }
                                        }}
                                    >Save</button>
                                </>
                            ) : (
                                <div className='username-container'>
                                    <span>{user?.username}</span>
                                    <button className='edit-prof-btn'
                                        onClick={() => {
                                            setTempValue(user?.username || '');
                                            setEditingField('username');
                                        }}>
                                        change
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className='profile-item'>
                            <strong>Email: </strong>
                            {editingField === 'email' ? (
                                <>
                                    <input
                                        type="email"
                                        value={tempValue}
                                        onChange={e => setTempValue(e.target.value)}
                                    />
                                    <button className='edit-user-prof-btn-cancel' onClick={() => setEditingField(null)}>Cancel</button>
                                    <button
                                        className='edit-user-prof-btn-save'
                                        onClick={async () => {
                                            try {
                                                await updateUserProfile({ email: tempValue });
                                                setEditingField(null);
                                            } catch (e) {
                                                setProfileError(e.message);
                                            }
                                        }}
                                    >Save</button>
                                </>
                            ) : (
                                <div className='username-container'>
                                    <span>{user?.email}</span>
                                    <button className='edit-prof-btn'
                                        onClick={() => {
                                            setTempValue(user?.email || '');
                                            setEditingField('email');
                                        }}>
                                        change
                                    </button>
                                </div>
                            )}
                        </div>
                        <br></br>
                        <button className='change-password-btn' onClick={() => setShowPwModal(true)}>
                            Change Password
                        </button>

                        {profileError && <p className="error">{profileError}</p>}

                        <button className='logout-btn' onClick={handleLogout}>Logout</button>
                    </div>
                    {showPwModal && (
                        <div className="deck-collection-modal-overlay" onClick={() => setShowPwModal(false)}>
                            <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                <h4>Change Password</h4>
                                <label>
                                    Current Password<br />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={currentPw}
                                        onChange={e => setCurrentPw(e.target.value)}
                                    />
                                </label>
                                <label>
                                    New Password<br />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPw}
                                        onChange={e => setNewPw(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Confirm New Password<br />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPw}
                                        onChange={e => setConfirmPw(e.target.value)}
                                    />
                                </label>
                                <p className='cant-rem-pw-hint'>* If you can't remember your current password, logout and select "Forgot password?" after typing your account's email address in the email field.</p>
                                <div className="buttons-row-modal">
                                    <button className='cancel-button' onClick={() => setShowPwModal(false)}>Cancel</button>
                                    <button
                                        onClick={async () => {
                                            if (newPw !== confirmPw) {
                                                setProfileError('Passwords do not match');
                                                return;
                                            }
                                            try {
                                                await changePassword(currentPw, newPw);
                                                setShowPwModal(false);
                                            } catch (e) {
                                                setProfileError(e.message);
                                            }
                                        }}
                                        className='save-button'
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                <section>
                    {decks.length === 0
                        ? <p>You haven’t saved any decks yet.</p>
                        : (
                            <div className="account-decks">
                                {isPublicView && (
                                    <h2>{username}&apos;s Deck Collection</h2>
                                )}
                                <div className="folders-bar">
                                    {isPublicView && (
                                        <button onClick={() => navigate('/account')}>← Back to My Account</button>
                                    )}
                                    {!isPublicView && (
                                        <button className='create-new-folder-btn' onClick={() => setShowFolderModal(true)}><span className="material-symbols-outlined">folder</span>New Folder</button>
                                    )}
                                    <button className='create-new-deck-link-btn' onClick={() => navigate('/ljhksdgbnksgkjsiodsfi')}>+ New Deck</button>
                                </div>
                                {!isPublicView && (
                                    <div className='organize-and-public-row'>
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
                                        <button
                                            className="folder-options-icon"
                                            onClick={openPrivacyModal}
                                        >
                                            <span className="material-symbols-outlined">public</span>
                                            <p>Folder Privacy</p>
                                        </button>
                                    </div>
                                )}
                                <div className="folders-list">
                                    <button
                                        className={!activeFolder ? 'active' : ''}
                                        onClick={() => setActiveFolder(null)}
                                    >
                                        All Decks
                                    </button>
                                    {(!isMobileView || showAllFolders) &&
                                        folders.map(f => (
                                            <button
                                                key={f._id}
                                                className={f._id === activeFolder ? 'active' : ''}
                                                onClick={() => setActiveFolder(f._id)}
                                            >
                                                {f.name}
                                            </button>
                                        ))
                                    }
                                    {isMobileView && folders.length > 0 && (
                                        <button
                                            className="show-more-btn"
                                            onClick={() => setShowAllFolders(v => !v)}
                                        >
                                            <span className="material-symbols-outlined">
                                                {showAllFolders ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                            </span>
                                            {showAllFolders ? ' Collapse Folders' : ' Expand Folders'}
                                        </button>
                                    )}
                                </div>
                                <div className='decks-in-folder-options-sort-list-views'>
                                    <div className='folder-options'>
                                        {/* ADD BACK one day */}
                                        {/* <div className='decks-in-folder-options-sort-list-views'>
                                            <button
                                                className="sort-favorites-btn"
                                                onClick={() => setViewMode(vm => vm === 'grid' ? 'list' : 'grid')}
                                            >
                                                <span className="material-symbols-outlined">
                                                    {viewMode === 'grid' ? 'format_list_bulleted' : 'grid_view'}
                                                </span>
                                                <p>{viewMode === 'grid' ? 'List View' : 'Tile View'}</p>
                                            </button>
                                        </div> */}
                                        {/* <button
                                            className="sort-favorites-btn"
                                            onClick={() => setCompactMode(c => !c)}
                                        >
                                            <span className="material-symbols-outlined">
                                                {compactMode ? 'zoom_in' : 'zoom_out'}
                                            </span>
                                            <p>{compactMode ? 'Normal Size' : 'Compact Size'}</p>
                                        </button> */}
                                        <button
                                            className="sort-favorites-btn"
                                            onClick={() => setShowFavorites(!showFavorites)}
                                        >
                                            {showFavorites ? (
                                                <>
                                                    <span className="material-symbols-outlined">all_inclusive</span>
                                                    <p>Show All Decks</p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">favorite</span>
                                                    <p>Favorites Only</p>
                                                </>
                                            )}
                                        </button>
                                        {activeFolder && !isPublicView && (
                                            <div className="folder-controls">
                                                <button
                                                    className="sort-favorites-btn"
                                                    onClick={() => {
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
                                    <button
                                        className="sort-favorites-btn hide-on-mobile550"
                                        onClick={() => setSortMode(m => (m + 1) % 4)}
                                    >
                                        <span className='not-blue-p'>Sorted:&nbsp;</span>
                                        <p>
                                            {{
                                                0: "Most Recent",
                                                1: "Least Recent",
                                                2: "Alphabetically",
                                                3: "Folder Order"
                                            }[sortMode]}
                                        </p>
                                        {/* <span className="material-symbols-outlined">sort</span> */}
                                    </button>
                                </div>
                                {viewMode === 'grid' ? (
                                    <div className='decks-grid-wrapper'>
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
                                                                    className={[
                                                                        "cropped-mascot-card",
                                                                        d.isTagTeam && "tagteam",
                                                                        d.hasAncientTrait && "ancient",
                                                                        d.hasBreakTrait && "break",
                                                                        d.isLegendCard && "legend",
                                                                        d.specificallyLugiaLegend && "lugia",
                                                                        d.specificallyZoroarkGX && "zoroark"
                                                                    ].filter(Boolean).join(" ")}
                                                                />
                                                                {d.secondaryMascotImageUrl && (
                                                                    <div className='secondary-mascot-container'>
                                                                        <img
                                                                            src={d.secondaryMascotImageUrl}
                                                                            alt=""
                                                                            className="secondary-mascot-img"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {!activeFolder && d.folderId && (
                                                                    <span className="folder-label">
                                                                        {folders.find(f => f._id === d.folderId)?.name || '—'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="deck-card-info">
                                                                <div className='favorite-heart-container'>
                                                                    <span
                                                                        className={`favorite-heart material-symbols-outlined ${d.favorite ? 'active' : ''}`}
                                                                        onClick={e => { e.stopPropagation(); toggleFavorite(d._id); }}

                                                                    >
                                                                        {favorites.has(id) ? 'favorite' : 'favorite_border'}
                                                                    </span>
                                                                    <div className="menu-icon-wrapper"
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
                                                                                <button onClick={e => {
                                                                                    e.stopPropagation();
                                                                                    setModalDeck(d);
                                                                                    setPrimaryMascot(d.mascotCard);
                                                                                    setSecondaryMascot(d.secondaryMascotCard || '');
                                                                                    setShowMascotModal(true);
                                                                                }}>
                                                                                    Edit Mascots
                                                                                </button>
                                                                                <button onClick={() => goToDeckbuilder(d)}>
                                                                                    Open in Deckbuilder
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
                                                                <h3>{d.name}</h3>
                                                                <hr className='saved-deck-hr'></hr>
                                                                <p className='deck-card-description'>{d.description || '\u00A0'}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="decks-list">
                                        {displayedDecks.map((d, i) => {
                                            const id = d._id || i;
                                            return (
                                                <div
                                                    key={id}
                                                    className="deck-list-item"
                                                    onClick={() => openModal(d)}
                                                    style={{ position: 'relative' }}
                                                >
                                                    <div className='list-thumb-container'>
                                                        <img
                                                            src={d.mascotImageUrl}
                                                            alt={d.name}
                                                            className={[
                                                                "list-thumb",
                                                                d.hasAncientTrait && "ancient",
                                                                d.hasBreakTrait && "break",
                                                                d.isLegendCard && "legend",
                                                                d.specificallyLugiaLegend && "lugia"
                                                            ].filter(Boolean).join(" ")}
                                                        />
                                                    </div>
                                                    <div className="list-info">
                                                        <h3>{d.name}</h3>
                                                        <p className='deck-card-description'>{d.description || '\u00A0'}</p>
                                                    </div>
                                                    <div className='favorite-heart-container' style={{ margin: 0 }}>
                                                        <span
                                                            className={`favorite-heart material-symbols-outlined ${d.favorite ? 'active' : ''}`}
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                toggleFavorite(d._id);
                                                            }}
                                                        >
                                                            {favorites.has(id) ? 'favorite' : 'favorite_border'}
                                                        </span>
                                                        <div
                                                            ref={el => {
                                                                if (menuOpenId === d._id) menuContainerRef.current = el;
                                                            }}
                                                            style={{ position: 'relative' }}
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
                                                                <div className="deckcollection-menu-dropdown" onClick={e => e.stopPropagation()}>
                                                                    <button onClick={e => { e.stopPropagation(); setModalDeck(d); setNewValue(d.name); setShowRenameModal(true); }}>Rename</button>
                                                                    <button onClick={e => { e.stopPropagation(); setModalDeck(d); setNewValue(d.description || ''); setShowDescModal(true); }}>Edit Description</button>
                                                                    <button onClick={e => {
                                                                        e.stopPropagation();
                                                                        setModalDeck(d);
                                                                        setPrimaryMascot(d.mascotCard);
                                                                        setSecondaryMascot(d.secondaryMascotCard || '');
                                                                        setShowMascotModal(true);
                                                                    }}>
                                                                        Edit Mascots
                                                                    </button>
                                                                    <button onClick={() => goToDeckbuilder(d)}>Open in Deckbuilder</button>
                                                                    <button onClick={e => { e.stopPropagation(); handleDuplicate(d); }}>Duplicate</button>
                                                                    <button onClick={e => { e.stopPropagation(); setMoveModalDeck(d); setSelectedFolderId(d.folderId || ''); setShowMoveModal(true); }}>Move</button>
                                                                    <button onClick={e => { e.stopPropagation(); handleDelete(d); }}>Delete</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!activeFolder && d.folderId && (
                                                        <span className="folder-label-list-version">
                                                            {folders.find(f => f._id === d.folderId)?.name || '—'}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {showRenameModal && (
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box">
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    handleRename();
                                                }}
                                            >
                                                <h4>Rename Deck</h4>
                                                <input
                                                    autoFocus
                                                    value={newValue}
                                                    onChange={e => setNewValue(e.target.value)}
                                                />
                                                <div className="buttons-row-modal">
                                                    <button
                                                        type="button"
                                                        className="cancel-button"
                                                        onClick={() => setShowRenameModal(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="save-button"
                                                        disabled={!newValue.trim()}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {showDescModal && (
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box">
                                            <h4>Edit Description</h4>
                                            <textarea
                                                value={newValue}
                                                onChange={e => setNewValue(e.target.value)}
                                            />
                                            <div className="buttons-row-modal">
                                                <button class='cancel-button' onClick={() => setShowDescModal(false)}>Cancel</button>
                                                <button class='save-button' onClick={handleDescr}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showMascotModal && (
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>Edit Mascots</h4>
                                            <label>
                                                Primary Mascot*<br />
                                                <select
                                                    value={primaryMascot}
                                                    onChange={e => setPrimaryMascot(e.target.value)}
                                                >
                                                    {modalDeck.decklist.map(c => (
                                                        <option
                                                            key={`${c.setAbbrev || c.set}-${c.number}`}
                                                            value={`${c.setAbbrev || c.set}-${c.number}`}
                                                        >
                                                            {c.count}× {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Secondary Mascot<br />
                                                <select
                                                    value={secondaryMascot}
                                                    onChange={e => setSecondaryMascot(e.target.value)}
                                                >
                                                    <option value="">None</option>
                                                    {modalDeck.decklist.map(c => (
                                                        <option
                                                            key={`${c.setAbbrev || c.set}-${c.number}`}
                                                            value={`${c.setAbbrev || c.set}-${c.number}`}
                                                        >
                                                            {c.count}× {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <div className="buttons-row-modal">
                                                <button className="cancel-button" onClick={() => setShowMascotModal(false)}>
                                                    Cancel
                                                </button>
                                                <button
                                                    className="save-button"
                                                    onClick={async () => {
                                                        const token = localStorage.getItem('PTCGLegendsToken');
                                                        const res = await fetch(
                                                            `/api/user/decks/${modalDeck._id}/mascots`,
                                                            {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                    mascotCard: primaryMascot,
                                                                    secondaryMascotCard: secondaryMascot
                                                                })
                                                            }
                                                        );
                                                        if (!res.ok) {
                                                            console.error('Failed to update mascots');
                                                            return;
                                                        }

                                                        const sep1 = primaryMascot.lastIndexOf('-');
                                                        const set1 = primaryMascot.slice(0, sep1);
                                                        const num1 = primaryMascot.slice(sep1 + 1);
                                                        const r1 = await fetch(`/api/cards/${set1}/${num1}`);
                                                        const c1 = await r1.json();
                                                        const newPrimaryUrl = c1.images?.large || c1.images?.small;

                                                        let newSecondaryUrl = null;
                                                        if (secondaryMascot) {
                                                            const sep2 = secondaryMascot.lastIndexOf('-');
                                                            const set2 = secondaryMascot.slice(0, sep2);
                                                            const num2 = secondaryMascot.slice(sep2 + 1);
                                                            try {
                                                                const r2 = await fetch(`/api/cards/${set2}/${num2}`);
                                                                const c2 = await r2.json();
                                                                newSecondaryUrl = c2.images?.large || c2.images?.small;
                                                            } catch { }
                                                        }

                                                        setDecks(ds =>
                                                            ds.map(d =>
                                                                d._id === modalDeck._id
                                                                    ? {
                                                                        ...d,
                                                                        mascotCard: primaryMascot,
                                                                        secondaryMascotCard: secondaryMascot,
                                                                        mascotImageUrl: newPrimaryUrl,
                                                                        secondaryMascotImageUrl: newSecondaryUrl
                                                                    }
                                                                    : d
                                                            )
                                                        )
                                                        setShowMascotModal(false);
                                                        setMenuOpenId(null);
                                                    }}
                                                    disabled={!primaryMascot}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedDeck && (
                                    <div className="card-modal-overlay-account" onClick={closeModal}>
                                        <div className="card-modal-content-account" onClick={e => e.stopPropagation()}>
                                            <button className="modal-close" onClick={closeModal}>×</button>
                                            <h3 style={{ margin: 0 }}>{selectedDeck.name}</h3>
                                            <p>{selectedFolder?.name ?? ''}</p>
                                            <p>{selectedDeck.description || '\u00A0'}</p>

                                            <div className="deck-modal-actions">
                                                <div>
                                                    <span
                                                        className={`favorite-heart hide-on515 material-symbols-outlined nodisplay ${favorites.has(selectedDeck._id) ? 'active' : ''
                                                            }`}
                                                        onClick={() => toggleFavorite(selectedDeck._id)}
                                                    >
                                                        {favorites.has(selectedDeck._id) ? 'favorite' : 'favorite_border'}
                                                    </span>
                                                </div>
                                                {isPublicView ? (
                                                    <div className="public-actions">
                                                        <button
                                                            onClick={() => goToDeckbuilder(selectedDeck, true)}
                                                            className="public-action-btn"
                                                        >
                                                            Open in Deckbuilder
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                // flatten old vs new decklist
                                                                const raw = selectedDeck.decklist;
                                                                const cards = Array.isArray(raw)
                                                                    ? raw
                                                                    : [
                                                                        ...(raw.pokemon || []),
                                                                        ...(raw.trainer || []),
                                                                        ...(raw.energy || []),
                                                                    ];
                                                                // copy as text
                                                                const text = cards
                                                                    .map(c => `${c.count} ${c.name} ${c.setAbbrev || c.set} ${c.number}`)
                                                                    .join('\n');
                                                                navigator.clipboard.writeText(text);
                                                            }}
                                                            className="public-action-btn"
                                                        >
                                                            Copy as Text
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {!isSmallViewport ? (
                                                            <>
                                                                <button onClick={() => {
                                                                    setModalDeck(selectedDeck);
                                                                    setNewValue(selectedDeck.name);
                                                                    setShowRenameModal(true);
                                                                }}>
                                                                    Rename
                                                                </button>
                                                                <button onClick={() => {
                                                                    setModalDeck(selectedDeck);
                                                                    setNewValue(selectedDeck.description || '');
                                                                    setShowDescModal(true);
                                                                }}>
                                                                    Edit Description
                                                                </button>
                                                                <button onClick={e => {
                                                                    setModalDeck(selectedDeck);
                                                                    setPrimaryMascot(selectedDeck.mascotCard);
                                                                    setSecondaryMascot(selectedDeck.secondaryMascotCard || '');
                                                                    setShowMascotModal(true);
                                                                }}>
                                                                    Edit Mascots
                                                                </button>
                                                                <button onClick={() => goToDeckbuilder(selectedDeck)}>
                                                                    Open in Deckbuilder
                                                                </button>
                                                                <button onClick={() => {
                                                                    handleDuplicate(selectedDeck)
                                                                    closeModal()
                                                                }}>
                                                                    Duplicate
                                                                </button>
                                                                <button onClick={() => {
                                                                    setMoveModalDeck(selectedDeck);
                                                                    setSelectedFolderId(selectedDeck.folderId || '');
                                                                    setShowMoveModal(true);
                                                                }}>
                                                                    Move
                                                                </button>
                                                                <button
                                                                    className="danger"
                                                                    onClick={() => handleDelete(selectedDeck)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className='move-small-deck-options-up515'>
                                                                <span
                                                                    className={`favorite-heart material-symbols-outlined ${favorites.has(selectedDeck._id) ? 'active' : ''
                                                                        }`}
                                                                    onClick={() => toggleFavorite(selectedDeck._id)}
                                                                >
                                                                    {favorites.has(selectedDeck._id) ? 'favorite' : 'favorite_border'}
                                                                </span>
                                                                <span
                                                                    className="material-symbols-outlined menu-icon"
                                                                    onClick={e => { e.stopPropagation(); setMobileActionsOpen(v => !v); }}
                                                                >more_vert</span>
                                                                {mobileActionsOpen && (
                                                                    <div
                                                                        className="deck-collection-modal-overlay-again"
                                                                        onClick={() => setMobileActionsOpen(false)}
                                                                    >
                                                                        <div
                                                                            className="deck-collection-modal-box mobile-modal-box"
                                                                            onClick={e => e.stopPropagation()}
                                                                        >
                                                                            <button className='small-deck-modal-options-brn-list' onClick={() => { setShowRenameModal(true); setModalDeck(selectedDeck); }}>Rename</button>
                                                                            <button className='small-deck-modal-options-brn-list' onClick={() => { setShowDescModal(true); setModalDeck(selectedDeck); }}>Edit Description</button>
                                                                            <button className='small-deck-modal-options-brn-list' onClick={() => { setShowMascotModal(true); setModalDeck(selectedDeck); }}>Edit Mascots</button>
                                                                            <button className='small-deck-modal-options-brn-list' onClick={() => goToDeckbuilder(selectedDeck)}>Open in Deckbuilder</button>
                                                                            <button className='small-deck-modal-options-brn-list' onClick={() => { handleDuplicate(selectedDeck); closeModal(); }}>Duplicate</button>
                                                                            <button className='small-deck-modal-options-brn-list' onClick={() => { setShowMoveModal(true); setMoveModalDeck(selectedDeck); }}>Move</button>
                                                                            <button className='small-deck-modal-options-brn-list danger' onClick={() => handleDelete(selectedDeck)}>Delete</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <DeckList
                                                deck={
                                                    (() => {
                                                        const raw = selectedDeck.decklist;
                                                        return Array.isArray(raw)
                                                            ? raw
                                                            : [
                                                                ...(raw.pokemon || []),
                                                                ...(raw.trainer || []),
                                                                ...(raw.energy || []),
                                                            ];
                                                    })()
                                                }
                                                loading={false}
                                                onUpdateCount={() => { }}
                                                onCardClick={card => { window.open(`/card/${card.setAbbrev}/${card.number}`, '_blank'); }}
                                                viewMode="image"
                                            />
                                        </div>
                                    </div>
                                )}
                                {showFolderModal && (
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>New Folder</h4>
                                            <input
                                                placeholder="Folder name"
                                                value={newFolderName}
                                                onChange={e => setNewFolderName(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && newFolderName.trim()) {
                                                        e.preventDefault();
                                                        handleCreateFolder();
                                                    }
                                                }}
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
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
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
                                            <div className="buttons-row-modal">
                                                <button className='cancel-button' onClick={() => setShowMoveModal(false)}>Cancel</button>
                                                <button className='save-button' onClick={async () => {
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
                                    </div>
                                )}
                                {showRenameFolderModal && (
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    handleRenameFolder();
                                                }}
                                            >
                                                <h4>Rename Folder</h4>
                                                <input
                                                    autoFocus
                                                    value={renameFolderName}
                                                    onChange={e => setRenameFolderName(e.target.value)}
                                                />
                                                <div className="buttons-row-modal">
                                                    <button type="button" className='cancel-button' onClick={() => setShowRenameFolderModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className='save-button' disabled={!renameFolderName.trim()}>
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {showSortModal && (
                                    <div className="deck-collection-modal-overlay">
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>Sort Folders</h4>
                                            <div className="preset-sort-folders-buttons" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                                <button onClick={() => {
                                                    const sortedIds = [...folders]
                                                        .sort((a, b) => {
                                                            const aMatch = a.name.match(/^(\d+)/);
                                                            const bMatch = b.name.match(/^(\d+)/);

                                                            if (aMatch && bMatch) {
                                                                return parseInt(bMatch[1], 10) - parseInt(aMatch[1], 10);
                                                            }
                                                            if (aMatch) return -1;
                                                            if (bMatch) return 1;
                                                            return a.name.localeCompare(b.name);
                                                        })
                                                        .map(f => f._id);

                                                    doPreset(sortedIds);
                                                }}>
                                                    A&nbsp;<span className="material-symbols-outlined">chevron_right</span>&nbsp;Z
                                                </button>
                                                <button onClick={() => {
                                                    const sortedIds = [...folders]
                                                        .sort((a, b) => {
                                                            const aNum = /^\d+/.exec(a.name);
                                                            const bNum = /^\d+/.exec(b.name);
                                                            if (!aNum && !bNum) {
                                                                return b.name.localeCompare(a.name);
                                                            }
                                                            if (aNum && !bNum) {
                                                                return 1;
                                                            }
                                                            if (!aNum && bNum) {
                                                                return -1;
                                                            }
                                                            return parseInt(aNum[0], 10) - parseInt(bNum[0], 10);
                                                        })
                                                        .map(f => f._id);
                                                    doPreset(sortedIds);
                                                }}>
                                                    Z&nbsp;<span className="material-symbols-outlined">chevron_left</span>&nbsp;A
                                                </button>
                                                <button onClick={() => {
                                                    // Most decks first
                                                    const counts = decks.reduce((acc, d) => {
                                                        if (d.folderId) acc[d.folderId] = (acc[d.folderId] || 0) + 1;
                                                        return acc;
                                                    }, {});
                                                    const sortedIds = [...folders]
                                                        .sort((a, b) => (counts[b._id] || 0) - (counts[a._id] || 0))
                                                        .map(f => f._id);
                                                    doPreset(sortedIds);
                                                }}>
                                                    Most Decks
                                                </button>
                                                <button onClick={() => {
                                                    // Fewest decks first
                                                    const counts = decks.reduce((acc, d) => {
                                                        if (d.folderId) acc[d.folderId] = (acc[d.folderId] || 0) + 1;
                                                        return acc;
                                                    }, {});
                                                    const sortedIds = [...folders]
                                                        .sort((a, b) => (counts[a._id] || 0) - (counts[b._id] || 0))
                                                        .map(f => f._id);
                                                    doPreset(sortedIds);
                                                }}>
                                                    Fewest Decks
                                                </button>
                                            </div>
                                            <ul className="sort-folders-list">
                                                {(foldersOrder || []).map((id, idx) => {
                                                    const folder = (folders || []).find(f => f._id === id)
                                                    if (!folder) return null

                                                    return (
                                                        <li key={id}>
                                                            <div>
                                                                <span className='order-folder-name'>{folder.name}</span>
                                                            </div>
                                                            <div className='buttons-row-lineup'>
                                                                <span
                                                                    className="material-symbols-outlined"
                                                                    title={lockedFolders.has(id) ? 'Locked' : 'Unlocked'}
                                                                    style={{
                                                                        margin: '0 4px',
                                                                        color: lockedFolders.has(id)
                                                                            ? 'rgb(220, 93, 93)'
                                                                            : 'rgba(151, 151, 151, 0.35)'
                                                                    }}
                                                                >
                                                                    {lockedFolders.has(id) ? 'lock' : 'lock_open'}
                                                                </span>
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
                                                                <button
                                                                    className="sort-opts-btn"
                                                                    onClick={e => { e.stopPropagation(); setSortMenuOpenId(sortMenuOpenId === id ? null : id); }}
                                                                >
                                                                    <span class="material-symbols-outlined">
                                                                        more_vert
                                                                    </span>
                                                                </button>
                                                                {sortMenuOpenId === id && (
                                                                    <div className="deckcollection-menu-dropdown" onClick={e => e.stopPropagation()}>
                                                                        <button onClick={() => { moveFolderToTop(id); setSortMenuOpenId(null); }}>
                                                                            Move to Top
                                                                        </button>
                                                                        <button onClick={() => { moveFolderToBottom(id); setSortMenuOpenId(null); }}>
                                                                            Move to Bottom
                                                                        </button>
                                                                        <button onClick={() => { toggleLockFolder(id); setSortMenuOpenId(null); }}>
                                                                            {lockedFolders.has(id) ? 'Unlock Position' : 'Lock Position'}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
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
                                                                body: JSON.stringify({ order: foldersOrder, locked: Array.from(lockedFolders) })
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
                                {showPrivacyModal && (
                                    <div className="deck-collection-modal-overlay" onClick={() => setShowPrivacyModal(false)}>
                                        <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                            <h4>Folder Visibility</h4>
                                            <div className='folder-visi-info'>
                                                <p>
                                                    <span class="material-symbols-outlined privacy-icon active">
                                                        public
                                                    </span>
                                                    Select which folders you would like others to see from your public collection page.
                                                </p>
                                                <p>
                                                    Your public collection is live at:&nbsp;
                                                    <a
                                                        href={`/${user.username}/deck-collection`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className='public-link-spec'
                                                    >
                                                        ptcglegends.com/{user.username}/deck-collection
                                                    </a>
                                                </p>
                                            </div>
                                            <ul className="privacy-folder-list">
                                                {publicFolders.map(f => (
                                                    <li key={f.id} className="privacy-folder-item"
                                                        onClick={() =>
                                                            setPublicFolders(pfs =>
                                                                pfs.map(x =>
                                                                    x.id === f.id ? { ...x, isPublic: !x.isPublic } : x
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            className={`material-symbols-outlined privacy-icon ${f.isPublic ? 'active' : ''}`}

                                                        >
                                                            {f.isPublic ? 'public' : 'public_off'}
                                                        </span>
                                                        <span className="folder-name">{f.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="buttons-row-modal">
                                                <button className="cancel-button" onClick={() => setShowPrivacyModal(false)}>Cancel</button>
                                                <button
                                                    className="save-button"
                                                    onClick={async () => {
                                                        try {
                                                            // send patch for each
                                                            await Promise.all(
                                                                publicFolders.map(f =>
                                                                    fetch(`/api/user/folders/${f.id}/public`, {
                                                                        method: 'PATCH',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            Authorization: `Bearer ${token}`
                                                                        },
                                                                        body: JSON.stringify({ isPublic: f.isPublic })
                                                                    })
                                                                )
                                                            );
                                                            // refresh local folder state
                                                            setFolders(fs =>
                                                                fs.map(f => ({ ...f, isPublic: publicFolders.find(x => x.id === f._id)?.isPublic || false }))
                                                            );
                                                            setShowPrivacyModal(false);
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert('Could not update folder visibility');
                                                        }
                                                    }}
                                                >Save</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </section>
            )
            }
        </AccountSection >
    );
}
