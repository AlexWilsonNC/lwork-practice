import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Account.css'
import styled from 'styled-components';
import Spinner from '../contexts/Spinner';
import DeckList from '../DeckBuilder/DeckList';

const AccountSection = styled.div`
    background-color: ${({ theme }) => theme.loginbg};

    .deck-card-info,
    .deck-list-item,
    .not-blue-p,
    .viewing-other-profile-h2,
    .you-havent,
    .profile-item,
    .profile-settings p,
    .active-folder-meta {
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
    .account-tabs {
        background-color: ${({ theme }) => theme.profileSliderBg};
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
    .modal-close-account {
        color: ${({ theme }) => theme.modalCloseAccountList};
        text-shadow: none;
    }
    .deck-modal-actions button {
        background: ${({ theme }) => theme.decklistOpenedBtnBg};
        color: #f5f5f5;
    }
    .profile-settings-display-edit {
        background-color: ${({ theme }) => theme.profilesettingsbg};
    }
`;

const cardCache = new Map();

async function fetchCardByKey(key) {
    if (!key) return null;
    if (cardCache.has(key)) return cardCache.get(key);

    const sep = key.lastIndexOf('-');
    const set = key.slice(0, sep);
    const num = key.slice(sep + 1);

    const res = await fetch(`/api/cards/${set}/${num}`).catch(() => null);
    const data = res && res.ok ? await res.json() : null;

    if (data) cardCache.set(key, data);
    return data;
}

function ArtCrop({ src, alt = '' }) {
    return (
        <div style={{ position: 'relative', width: 50, height: 30, overflow: 'hidden', borderRadius: 2 }}>
            <img
                src={src}
                alt={alt}
                className="secondary-mascot-img"
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
    );
}
function MascotPicker({ value, onChange, decklist, allowNone = false, noneLabel = 'None' }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    const options = (decklist || []).map(c => ({
        key: `${c.setAbbrev || c.set}-${c.number}`,
        name: c.name,
        img: c?.images?.small || c?.imageUrl || ''
    }));

    const selected = options.find(o => o.key === value);

    React.useEffect(() => {
        const onDocClick = e => {
            if (!ref.current || ref.current.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="mascot-select-trigger"
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {selected?.img ? <ArtCrop src={selected.img} /> : <span style={{ width: 24, height: 34 }} />}
                <span style={{ flex: 1, textAlign: 'left' }}>{selected ? selected.name : (value || 'Select a card')}</span>
                <span className="material-symbols-outlined">expand_more</span>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="mascot-select-menu"
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
                            className="mascot-select-item"
                            onClick={() => { onChange(''); setOpen(false); }}
                            onKeyDown={e => { if (e.key === 'Enter') { onChange(''); setOpen(false); } }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', cursor: 'pointer' }}
                        >
                            <span style={{ width: 24, height: 34 }} />
                            <span>{noneLabel}</span>
                        </div>
                    )}

                    {options.map(opt => (
                        <div
                            key={opt.key}
                            role="option"
                            aria-selected={opt.key === value}
                            tabIndex={0}
                            className="mascot-select-item"
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
                            {opt.img ? <ArtCrop src={opt.img} /> : <span style={{ width: 24, height: 34 }} />}
                            <span>{opt.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

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
    const [newFolderColor, setNewFolderColor] = useState('#1290eb');
    const colorOptions = ['#cd4036', '#e86914', '#FFEA00', '#23b809', '#1a740a', 'rgb(6, 174, 174)', '#1290eb', '#0251ac', '#663ac4', '#9d14dc', '#c814dc', '#e381ee', '#da0c8b', '#714228', '#b39813', '#181819', '#515151', '#ffffff'];
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
    const [showAllFolders, setShowAllFolders] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 850);
    const [isSmallViewport, setIsSmallViewport] = useState(window.innerWidth <= 515);
    const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [publicFolders, setPublicFolders] = useState([]);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignDeckId, setAssignDeckId] = useState('');
    const [assignSearch, setAssignSearch] = useState('');

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

    useEffect(() => {
        if (!isPublicView && error && /relogin/i.test(error)) {
            navigate('/pizza', { replace: true });
        }
    }, [error, isPublicView, navigate]);

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
                body: JSON.stringify({
                    name: renameFolderName.trim(),
                    color: newFolderColor
                }),
            });
            if (!res.ok) throw new Error('Failed to rename folder');
            setFolders(fs =>
                fs.map(f =>
                    f._id === activeFolder
                        ? { ...f, name: renameFolderName.trim(), color: newFolderColor }
                        : f
                )
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

    const openPrintDecklist = (deckObj) => {
        if (!deckObj) return;

        const raw = deckObj.decklist;
        const cards = Array.isArray(raw)
            ? raw
            : [
                ...(raw?.pokemon || []),
                ...(raw?.trainer || []),
                ...(raw?.energy || []),
            ];

        const minimal = cards.map(c => ({
            supertype: c.supertype,
            set: c.setAbbrev || c.set,
            name: c.name,
            number: c.number,
            count: c.count,
            regMark: c.regulationMark || ''
        }));

        const payload = encodeURIComponent(JSON.stringify(minimal));
        window.open(`/print?deck=${payload}`, '_blank', 'noopener,noreferrer');
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

        try {
            localStorage.setItem(
                'PTCGLegendsOriginalDeckMeta',
                JSON.stringify({
                    id: deck._id,
                    name: deck.name || '',
                    mascotCard: deck.mascotCard || '',
                    secondaryMascotCard: deck.secondaryMascotCard || '',
                    description: deck.description || '',
                    folderId: deck.folderId ? String(deck.folderId) : ''
                })
            );
        } catch { }

        const minimal = cards.map(c => ({
            set: c.setAbbrev || c.set,
            number: c.number,
            count: c.count,
        }));

        const fragment = encodeURIComponent(JSON.stringify(minimal));
        const url = `/bobthebuilder?deckId=${deck._id}#deck=${fragment}`;

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
                body: JSON.stringify({
                    name: name,
                    color: newFolderColor
                })
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
                    if (!res.ok) throw new Error("Failed to load public collection, refresh if you believe this is in error. Otherwise, the username in the URL possibly doesn't exist.");
                    return res.json();
                })
                .then(async ({ folders: pubFolders, decks: pubDecks }) => {
                    const sortedFolders = [...pubFolders].sort((a, b) => a.order - b.order);
                    setFolders(sortedFolders);
                    setFoldersOrder(sortedFolders.map(f => f._id));

                    setDecks(pubDecks || []);

                    (async () => {
                        const hydrated = await Promise.all(
                            (pubDecks || []).map(async deck => {
                                try {
                                    const needPrimary = !deck.mascotImageUrl;
                                    const needSecondary = deck.secondaryMascotCard && !deck.secondaryMascotImageUrl;

                                    const p1 = needPrimary ? fetchCardByKey(deck.mascotCard) : Promise.resolve(null);
                                    const p2 = needSecondary ? fetchCardByKey(deck.secondaryMascotCard) : Promise.resolve(null);

                                    const [card, card2] = await Promise.all([p1, p2]);

                                    return {
                                        ...deck,
                                        mascotImageUrl: deck.mascotImageUrl || card?.images?.large || card?.images?.small,
                                        hasAncientTrait: deck.hasAncientTrait ?? !!card?.ancientTrait,
                                        isTagTeam: deck.isTagTeam ?? !!card?.subtypes?.includes('TAG TEAM'),
                                        hasBreakTrait: deck.hasBreakTrait ?? !!card?.subtypes?.includes('BREAK'),
                                        isLegendCard: deck.isLegendCard ?? !!card?.subtypes?.includes('LEGEND'),
                                        specificallyLugiaLegend: deck.specificallyLugiaLegend ?? (card?.name === 'Lugia LEGEND'),
                                        specificallyZoroarkGX: deck.specificallyZoroarkGX ?? (card?.name === 'Zoroark-GX'),
                                        secondaryMascotImageUrl: deck.secondaryMascotImageUrl || card2?.images?.large || card2?.images?.small || null,
                                        secondaryHasAncientTrait: deck.secondaryHasAncientTrait ?? !!card2?.ancientTrait,
                                        secondaryIsTagTeam: deck.secondaryIsTagTeam ?? !!card2?.subtypes?.includes('TAG TEAM'),
                                        secondaryHasBreakTrait: deck.secondaryHasBreakTrait ?? !!card2?.subtypes?.includes('BREAK'),
                                        secondaryIsLegendCard: deck.secondaryIsLegendCard ?? !!card2?.subtypes?.includes('LEGEND'),
                                        secondarySpecificallyLugiaLegend: deck.secondarySpecificallyLugiaLegend ?? (card2?.name === 'Lugia LEGEND'),
                                        secondarySpecificallyZoroarkGX: deck.secondarySpecificallyZoroarkGX ?? (card2?.name === 'Zoroark-GX'),
                                    };
                                } catch {
                                    return deck;
                                }
                            })
                        );
                        setDecks(hydrated);
                    })();
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message || 'Error loading public collection');
                })
                .finally(() => setLoading(false));

        } else {
            if (!token) {
                setLoading(false);
                navigate('/pizza', { replace: true });
                return;
            }

            fetch('/api/user/decks', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load decks, please relogin.');
                    return res.json();
                })
                .then(async decks => {
                    const foldersReq = fetch('/api/user/folders', {
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
                    });

                    setFavorites(new Set(decks.filter(d => d.favorite).map(d => d._id)));
                    setDecks(decks);

                    (async () => {
                        const hydrated = await Promise.all(
                            decks.map(async deck => {
                                try {
                                    const needPrimary = !deck.mascotImageUrl;
                                    const needSecondary = deck.secondaryMascotCard && !deck.secondaryMascotImageUrl;

                                    const p1 = needPrimary ? fetchCardByKey(deck.mascotCard) : Promise.resolve(null);
                                    const p2 = needSecondary ? fetchCardByKey(deck.secondaryMascotCard) : Promise.resolve(null);

                                    const [card, card2] = await Promise.all([p1, p2]);

                                    return {
                                        ...deck,
                                        mascotImageUrl: deck.mascotImageUrl || card?.images?.large || card?.images?.small,
                                        hasAncientTrait: deck.hasAncientTrait ?? !!card?.ancientTrait,
                                        isTagTeam: deck.isTagTeam ?? !!card?.subtypes?.includes('TAG TEAM'),
                                        hasBreakTrait: deck.hasBreakTrait ?? !!card?.subtypes?.includes('BREAK'),
                                        isLegendCard: deck.isLegendCard ?? !!card?.subtypes?.includes('LEGEND'),
                                        specificallyLugiaLegend: deck.specificallyLugiaLegend ?? (card?.name === 'Lugia LEGEND'),
                                        specificallyZoroarkGX: deck.specificallyZoroarkGX ?? (card?.name === 'Zoroark-GX'),
                                        secondaryMascotImageUrl: deck.secondaryMascotImageUrl || card2?.images?.large || card2?.images?.small || null,
                                        secondaryHasAncientTrait: deck.secondaryHasAncientTrait ?? !!card2?.ancientTrait,
                                        secondaryIsTagTeam: deck.secondaryIsTagTeam ?? !!card2?.subtypes?.includes('TAG TEAM'),
                                        secondaryHasBreakTrait: deck.secondaryHasBreakTrait ?? !!card2?.subtypes?.includes('BREAK'),
                                        secondaryIsLegendCard: deck.secondaryIsLegendCard ?? !!card2?.subtypes?.includes('LEGEND'),
                                        secondarySpecificallyLugiaLegend: deck.secondarySpecificallyLugiaLegend ?? (card2?.name === 'Lugia LEGEND'),
                                        secondarySpecificallyZoroarkGX: deck.secondarySpecificallyZoroarkGX ?? (card2?.name === 'Zoroark-GX'),
                                    };
                                } catch {
                                    return deck;
                                }
                            })
                        );

                        setDecks(hydrated);
                    })();

                    return foldersReq;
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

    const toggleActiveFolderPublic = async (nextVal) => {
        const id = activeFolder;
        if (!id) return;

        setFolders(fs => fs.map(f => f._id === id ? { ...f, isPublic: nextVal } : f));
        setPublicFolders(pfs => pfs?.map(x => x.id === id ? { ...x, isPublic: nextVal } : x));

        try {
            const res = await fetch(`/api/user/folders/${id}/public`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isPublic: nextVal }),
            });

            if (!res.ok) {
                setFolders(fs => fs.map(f => f._id === id ? { ...f, isPublic: !nextVal } : f));
                setPublicFolders(pfs => pfs?.map(x => x.id === id ? { ...x, isPublic: !nextVal } : x));
                throw new Error(await res.text() || 'Failed to update folder privacy');
            }

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
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

    const [showFolderCounts, setShowFolderCounts] = useState(() => {
        const v = localStorage.getItem('showFolderCounts');
        return v == null ? true : v === 'true';
    });

    useEffect(() => {
        localStorage.setItem('showFolderCounts', String(showFolderCounts));
    }, [showFolderCounts]);

    const folderCounts = React.useMemo(() => {
        const m = new Map();
        (decks || []).forEach(d => {
            if (!d?.folderId) return;
            const id = String(d.folderId);
            m.set(id, (m.get(id) || 0) + 1);
        });
        return m;
    }, [decks]);

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

    const folderActionLabel = d => (d?.folderId ? 'Change Folder' : 'Add to Folder');

    async function handleAssignToActiveFolder(deckId) {
        if (!deckId || !activeFolder) return;
        const deck = decks.find(d => d._id === deckId);
        if (!deck) return;

        try {
            // If deck is unassigned → MOVE it into this folder (no surprises)
            if (!deck.folderId) {
                const res = await fetch(`/api/user/decks/${deck._id}/move`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ folderId: activeFolder }),
                });
                if (!res.ok) throw new Error('Move failed');
                const { deck: updatedDeck } = await res.json();
                setDecks(ds => ds.map(d => d._id === deck._id ? { ...d, ...updatedDeck, folderId: activeFolder } : d));
                return;
            }

            // If deck already belongs to a folder → DUPLICATE it, then assign the duplicate here
            const dupRes = await fetch(`/api/user/decks/${deck._id}/duplicate`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!dupRes.ok) throw new Error('Duplicate failed');
            const { deck: newDeck } = await dupRes.json();

            // Move the new duplicate into this folder
            let dup = {
                ...newDeck,
                // keep mascot images so UI shows instantly (you do this already in handleDuplicate)
                mascotImageUrl: deck.mascotImageUrl,
                secondaryMascotImageUrl: deck.secondaryMascotImageUrl,
            };

            const moveDup = await fetch(`/api/user/decks/${dup._id}/move`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ folderId: activeFolder }),
            });

            if (moveDup.ok) {
                const { deck: moved } = await moveDup.json();
                dup = { ...dup, ...moved, folderId: activeFolder };
            } else {
                dup = { ...dup, folderId: activeFolder }; // local fallback
            }

            setDecks(ds => [...ds, dup]);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Could not add deck to folder.');
        }
    }

    useEffect(() => {
        function handleGlobalClick(e) {
            if (!mobileActionsOpen) return;
            const modal = document.querySelector('.mobile-modal-box');
            if (modal && modal.contains(e.target)) return;
            setMobileActionsOpen(false);
        }
        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [mobileActionsOpen]);

    if (loading) return <Spinner />;
    if (error) {
        if (!isPublicView && /relogin/i.test(error)) return null;
        return <p className="error">{error}</p>;
    }

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
                        <br></br>
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
                        <br></br>
                        <br></br>
                        <hr></hr>
                        <br></br>
                        <br></br>
                        <p>
                            Your public deck collection link:&nbsp;
                            <a
                                href={`/${user.username}/deck-collection`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='public-link-spec'
                            >
                                ptcglegends.com/{user.username}/deck-collection
                            </a>
                        </p>
                        <br></br>
                        <p className='small-txt-info-act'>(All of your decks are private by default, to make them publicly viewable on the above page - open "Folder Privacy" and select each folder to make public)</p>
                        <br></br>
                        <p style={{ color: 'grey' }}>
                            Please keep in mind that all profile-visible text - including your username, deck names, and deck descriptions - must adhere to our community standards. Any use of profanity, slurs, hate speech, or other offensive language is strictly prohibited. Users who violate these rules risk having their content removed and may face account suspension or deletion. Thank you for helping us maintain a respectful and welcoming environment for everyone.
                        </p>

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
                    {decks.length === 0 ? (
                        isPublicView ? (
                            <p className='you-havent'>
                                <i><b>{username}</b></i> either doesn’t have any decks marked as public or this user doesn't exist.
                            </p>
                        ) : (
                            <p className='you-havent'>
                                You don't have any decks in your collection yet,&nbsp;
                                <a href='/bobthebuilder' style={{ color: '#1290eb' }}>open the deckbuilder</a> and start your journey!
                                <br></br>
                                <br></br>
                                <span style={{ opacity: 0.5 }}>(You can also save decks to your collection by selecting the heart icon from any tournament result)</span>
                            </p>
                        )
                    ) : (
                        <div className="account-decks">
                            {isPublicView && (
                                <h2 className='viewing-other-profile-h2'>{username}'s Deck Collection</h2>
                            )}
                            {!isPublicView && (
                                <div className="folders-bar">
                                    <button className='create-new-folder-btn' onClick={() => setShowFolderModal(true)}><span className="material-symbols-outlined">folder</span>New Folder</button>
                                    <button className='create-new-deck-link-btn' onClick={() => navigate('/bobthebuilder')}>Deck Builder</button>
                                </div>
                            )}
                            {/* {isPublicView && (
                                    <div className="folders-bar-right-only">
                                        <button className='create-new-deck-link-btn' style={{ backgroundColor: '#1290eb', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/account')}>
                                        <span class="material-symbols-outlined" style={{ marginRight: '5px' }}>
                                            article_person
                                        </span>View your Account</button>
                                    </div>
                                )} */}
                            {!isPublicView && (
                                <div className='organize-and-public-row'>
                                    <div>
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
                                    <label className="folder-counts-toggle folder-options-icon no-margin" title="Show folder counts">
                                        <input
                                            type="checkbox"
                                            role="switch"
                                            aria-label="Show folder counts"
                                            checked={showFolderCounts}
                                            onChange={e => setShowFolderCounts(e.target.checked)}
                                        />
                                        <span className="switch-track" aria-hidden="true"></span>
                                        <span className="toggle-text">Folder Counts</span>
                                    </label>
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
                                    folders.map(f => {
                                        const isActive = f._id === activeFolder;
                                        return (
                                            <button
                                                key={f._id}
                                                className={`folder-btn${isActive ? ' active' : ''}`}
                                                onClick={() => setActiveFolder(f._id)}
                                                style={{
                                                    borderLeft: `6px solid ${f.color}`
                                                }}
                                            >
                                                {f.name}{showFolderCounts ? ` (${folderCounts.get(f._id) || 0})` : ''}
                                            </button>
                                        );
                                    })
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
                            {!activeFolder && (
                                <div
                                    className="active-folder-meta"
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 2.5px' }}
                                >
                                    <h3 style={{ margin: 0 }}>
                                        All Decks&nbsp;
                                        <span className="active-folder-count" style={{ opacity: .8, fontWeight: 400 }}>
                                            ({decks.length} deck{decks.length === 1 ? '' : 's'})
                                        </span>
                                    </h3>
                                </div>
                            )}
                            {activeFolder && (() => {
                                const f = folders.find(ff => ff._id === activeFolder);
                                if (!f) return null;
                                const total = folderCounts.get(f._id) || 0;
                                return (
                                    <div className="active-folder-meta" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 2.5px' }}>
                                        <h3 style={{ margin: 0 }}>{f.name}
                                            &nbsp;<span className="active-folder-count" style={{ opacity: .8, fontWeight: 400 }}>({total} deck{total === 1 ? '' : 's'})</span>
                                        </h3>
                                    </div>
                                );
                            })()}
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
                                    {!isPublicView && (
                                        <button
                                            className="sort-favorites-btn"
                                            onClick={() => setShowFavorites(!showFavorites)}
                                        >
                                            {showFavorites ? (
                                                <>
                                                    <span className="material-symbols-outlined">all_inclusive</span>
                                                    <p>Show All</p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">favorite</span>
                                                    <p>Favorites</p>
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {isPublicView && (
                                        <button
                                            className="sort-favorites-btn"
                                            onClick={() => setShowFavorites(!showFavorites)}
                                        >
                                            {showFavorites ? (
                                                <>
                                                    <span className="material-symbols-outlined">all_inclusive</span>
                                                    <p>Show All</p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">favorite</span>
                                                    <p>{username}'s Favorites</p>
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {activeFolder && !isPublicView && (
                                        <div className="folder-controls">
                                            <button
                                                className="sort-favorites-btn"
                                                onClick={() => {
                                                    const f = folders.find(f => f._id === activeFolder) || {};
                                                    setRenameFolderName(f.name || '');
                                                    setNewFolderColor(f.color || '#1290eb');
                                                    setShowRenameFolderModal(true);
                                                }}
                                            >
                                                <span
                                                    className="color-circle"
                                                    style={{
                                                        backgroundColor: (folders.find(f => f._id === activeFolder) || {}).color
                                                    }}
                                                />
                                                <p>Edit Folder</p>
                                            </button>
                                            {(() => {
                                                const fol = folders.find(f => f._id === activeFolder);
                                                if (!fol) return null;
                                                return (
                                                    <label className="sort-favorites-btn" title="Make this folder public">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!fol.isPublic}
                                                            onChange={e => toggleActiveFolderPublic(e.target.checked)}
                                                        />
                                                        <p>Public</p>
                                                    </label>
                                                );
                                            })()}
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
                                {!activeFolder && (
                                    <button
                                        className="sort-favorites-btn no-margin-right"
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
                                    </button>
                                )}
                            </div>
                            {activeFolder && !isPublicView && (
                                <div className='adddecktothisfolder'>
                                    <button
                                        className='adddeck-to-fold-brtn'
                                        onClick={() => {
                                            setAssignDeckId('');
                                            setAssignSearch('');
                                            setShowAssignModal(true);
                                        }}
                                    >
                                        <p>Add Deck to Folder</p>
                                    </button>
                                    <button
                                        className="sort-favorites-btn no-margin-right"
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
                                    </button>
                                </div>
                            )}
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
                                                        <div className='test-the-img-hover'>
                                                            <div className="deck-card-img">
                                                                {!activeFolder && !isPublicView && d.folderId && (() => {
                                                                    const fol = folders.find(f => f._id === d.folderId);
                                                                    return fol?.isPublic ? (
                                                                        <span
                                                                            className="material-symbols-outlined public-globe-badge"
                                                                            aria-label="In a public folder"
                                                                        >
                                                                            public
                                                                        </span>
                                                                    ) : null;
                                                                })()}
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
                                                                    fetchpriority={i < 12 ? 'high' : 'auto'}
                                                                    loading={i < 12 ? 'eager' : 'lazy'}
                                                                    decoding="async"
                                                                />
                                                                {d.secondaryMascotImageUrl && (
                                                                    <div className='secondary-mascot-container'>
                                                                        <img
                                                                            src={d.secondaryMascotImageUrl}
                                                                            alt=""
                                                                            className={[
                                                                                "secondary-mascot-img",
                                                                                d.secondaryIsTagTeam && "tagteam",
                                                                                d.secondaryHasAncientTrait && "ancient",
                                                                                d.secondaryHasBreakTrait && "break",
                                                                                d.secondaryIsLegendCard && "legend",
                                                                                d.secondarySpecificallyLugiaLegend && "lugia",
                                                                                d.secondarySpecificallyZoroarkGX && "zoroark",
                                                                            ].filter(Boolean).join(" ")}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {!activeFolder && d.folderId && (() => {
                                                                    const folderObj = folders.find(f => f._id === d.folderId) || {};
                                                                    const bgColor = folderObj.color;
                                                                    const hex = String(bgColor || '').toLowerCase();
                                                                    const txtColor = ['#ffffff', '#ffea00'].includes(hex) ? 'black' : 'white';

                                                                    return (
                                                                        <span
                                                                            className="folder-label"
                                                                            style={{ backgroundColor: bgColor, color: txtColor }}
                                                                        >
                                                                            {folders.find(f => f._id === d.folderId)?.name || '—'}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                        <div className="deck-card-info">
                                                            <div className='favorite-heart-container'>
                                                                {!isPublicView && (
                                                                    <span
                                                                        className={`favorite-heart material-symbols-outlined ${d.favorite ? 'active' : ''}`}
                                                                        onClick={e => { e.stopPropagation(); toggleFavorite(d._id); }}

                                                                    >
                                                                        {favorites.has(id) ? 'favorite' : 'favorite_border'}
                                                                    </span>
                                                                )}
                                                                {isPublicView && (
                                                                    <span style={{ pointerEvents: 'none' }}
                                                                        className={`favorite-heart material-symbols-outlined ${d.favorite ? 'active' : ''}`}
                                                                        onClick={e => { e.stopPropagation(); toggleFavorite(d._id); }}

                                                                    >
                                                                        {favorites.has(id) ? 'favorite' : 'favorite_border'}
                                                                    </span>
                                                                )}
                                                                {!isPublicView && (
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
                                                                                    Edit Name
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
                                                                                }}>{folderActionLabel(d)}</button>
                                                                                <button className='redhover' onClick={e => { e.stopPropagation(); handleDelete(d); }}>
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
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
                                                        fetchpriority={i < 12 ? 'high' : 'auto'}
                                                        loading={i < 12 ? 'eager' : 'lazy'}
                                                        decoding="async"
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
                                                                <button onClick={() => goToDeckbuilder(d)}>Edit in Deckbuilder</button>
                                                                <button onClick={e => { e.stopPropagation(); handleDuplicate(d); }}>Duplicate</button>
                                                                <button onClick={e => { e.stopPropagation(); setMoveModalDeck(d); setSelectedFolderId(d.folderId || ''); setShowMoveModal(true); }}>{folderActionLabel(d)}</button>
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
                                            <MascotPicker
                                                value={primaryMascot}
                                                onChange={val => setPrimaryMascot(val)}
                                                decklist={modalDeck.decklist}
                                            />
                                        </label>
                                        <label>
                                            Secondary Mascot<br />
                                            <MascotPicker
                                                value={secondaryMascot}
                                                onChange={val => setSecondaryMascot(val)}
                                                decklist={modalDeck.decklist}
                                                allowNone
                                                noneLabel="None"
                                            />
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
                                                                secondaryMascotCard: secondaryMascot || null
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
                                                    let sAncient = false, sTag = false, sBreak = false, sLegend = false, sLugia = false, sZoroark = false;
                                                    if (secondaryMascot) {
                                                        const sep2 = secondaryMascot.lastIndexOf('-');
                                                        const set2 = secondaryMascot.slice(0, sep2);
                                                        const num2 = secondaryMascot.slice(sep2 + 1);
                                                        try {
                                                            const r2 = await fetch(`/api/cards/${set2}/${num2}`);
                                                            const c2 = await r2.json();
                                                            newSecondaryUrl = c2.images?.large || c2.images?.small;
                                                            sAncient = !!c2.ancientTrait;
                                                            sTag = c2.subtypes?.includes('TAG TEAM');
                                                            sBreak = c2.subtypes?.includes('BREAK');
                                                            sLegend = c2.subtypes?.includes('LEGEND');
                                                            sLugia = c2.name === 'Lugia LEGEND';
                                                            sZoroark = c2.name === 'Zoroark-GX';
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
                                                                    secondaryMascotImageUrl: newSecondaryUrl,
                                                                    secondaryHasAncientTrait: sAncient,
                                                                    secondaryIsTagTeam: sTag,
                                                                    secondaryHasBreakTrait: sBreak,
                                                                    secondaryIsLegendCard: sLegend,
                                                                    secondarySpecificallyLugiaLegend: sLugia,
                                                                    secondarySpecificallyZoroarkGX: sZoroark,
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
                                        <button className="modal-close-account" onClick={closeModal}>×</button>
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
                                                        onClick={() => {
                                                            const raw = selectedDeck.decklist;
                                                            const cards = Array.isArray(raw)
                                                                ? raw
                                                                : [
                                                                    ...(raw.pokemon || []),
                                                                    ...(raw.trainer || []),
                                                                    ...(raw.energy || []),
                                                                ];
                                                            const text = cards
                                                                .map(c => `${c.count} ${c.name} ${c.setAbbrev || c.set} ${c.number}`)
                                                                .join('\n');
                                                            navigator.clipboard.writeText(text);
                                                        }}
                                                        className="public-action-btn"
                                                    >
                                                        Copy as Text
                                                    </button>
                                                    <button onClick={() => openPrintDecklist(selectedDeck)}>
                                                        Print List
                                                    </button>
                                                    <button
                                                        onClick={() => goToDeckbuilder(selectedDeck, true)}
                                                        className="public-action-btn"
                                                    >
                                                        Edit in Deckbuilder
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    {!isSmallViewport ? (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    const raw = selectedDeck.decklist;
                                                                    const cards = Array.isArray(raw)
                                                                        ? raw
                                                                        : [
                                                                            ...(raw.pokemon || []),
                                                                            ...(raw.trainer || []),
                                                                            ...(raw.energy || []),
                                                                        ];
                                                                    const text = cards
                                                                        .map(c => `${c.count} ${c.name} ${c.setAbbrev || c.set} ${c.number}`)
                                                                        .join('\n');
                                                                    navigator.clipboard.writeText(text);
                                                                }}
                                                                className="public-action-btn"
                                                            >
                                                                Copy as Text
                                                            </button>
                                                            <button onClick={() => openPrintDecklist(selectedDeck)}>
                                                                Print List
                                                            </button>
                                                            <button onClick={() => goToDeckbuilder(selectedDeck)}>
                                                                Edit in Deckbuilder
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
                                                                        <button
                                                                            onClick={() => {
                                                                                const raw = selectedDeck.decklist;
                                                                                const cards = Array.isArray(raw)
                                                                                    ? raw
                                                                                    : [
                                                                                        ...(raw.pokemon || []),
                                                                                        ...(raw.trainer || []),
                                                                                        ...(raw.energy || []),
                                                                                    ];
                                                                                const text = cards
                                                                                    .map(c => `${c.count} ${c.name} ${c.setAbbrev || c.set} ${c.number}`)
                                                                                    .join('\n');
                                                                                navigator.clipboard.writeText(text);
                                                                            }}
                                                                            className="small-deck-modal-options-brn-list"
                                                                        >
                                                                            Copy as Text
                                                                        </button>
                                                                        <button className='small-deck-modal-options-brn-list' onClick={() => openPrintDecklist(selectedDeck)}>
                                                                            Print List
                                                                        </button>
                                                                        <button className='small-deck-modal-options-brn-list' onClick={() => goToDeckbuilder(selectedDeck)}>Edit in Deckbuilder</button>
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
                                        <div className="color-picker">
                                            {colorOptions.map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setNewFolderColor(c)}
                                                    className={`color-swatch ${c} ${newFolderColor === c ? 'selected' : ''}`}
                                                    title={c}
                                                    style={{
                                                        border: newFolderColor === c ? '2px solid white' : '1px solid #444',
                                                        backgroundColor: c,
                                                    }}
                                                />
                                            ))}
                                        </div>
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
                                                className='save-button'
                                                disabled={!newFolderName.trim()}
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch('/api/user/folders', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                Authorization: `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify({
                                                                name: newFolderName.trim(),
                                                                color: newFolderColor
                                                            })
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
                            {showAssignModal && (
                                <div className="deck-collection-modal-overlay" onClick={() => setShowAssignModal(false)}>
                                    <div className="deck-collection-modal-box" onClick={e => e.stopPropagation()}>
                                        <h4>Add Deck to “{folders.find(f => f._id === activeFolder)?.name || ''}”</h4>
                                        <p style={{ fontSize: '10px' }}>If a deck is already assigned to another folder,</p>
                                        <p style={{ fontSize: '10px' }}>it will be automatically duplicated and placed in this one.</p>
                                        <br></br>
                                        <input
                                            placeholder="Search decks…"
                                            value={assignSearch}
                                            onChange={e => setAssignSearch(e.target.value)}
                                            style={{ marginBottom: 8 }}
                                        />

                                        <select
                                            size={8}
                                            value={assignDeckId}
                                            onChange={e => setAssignDeckId(e.target.value)}
                                            style={{ width: '100%', height: '100px' }}
                                        >
                                            {decks
                                                .filter(d => String(d.folderId) !== String(activeFolder))
                                                .filter(d => !assignSearch || d.name.toLowerCase().includes(assignSearch.toLowerCase()))
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map(d => {
                                                    const labelFolder = d.folderId
                                                        ? (folders.find(f => f._id === d.folderId)?.name || 'Other folder')
                                                        : 'Unassigned';
                                                    return (
                                                        <option key={d._id} value={d._id}>
                                                            {d.name} — {labelFolder}
                                                        </option>
                                                    );
                                                })}
                                        </select>

                                        <div className="buttons-row-modal" style={{ marginTop: 10 }}>
                                            <button className="cancel-button" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                            <button
                                                className="save-button"
                                                disabled={!assignDeckId}
                                                onClick={async () => {
                                                    await handleAssignToActiveFolder(assignDeckId);
                                                    setShowAssignModal(false);
                                                }}
                                            >
                                                Add to Folder
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
                                            }}>{folderActionLabel(moveModalDeck)}</button>
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
                                            <h4>Edit Folder</h4>
                                            <div className="color-picker" style={{ display: 'flex', marginBottom: '12px' }}>
                                                {colorOptions.map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => setNewFolderColor(c)}
                                                        title={c}
                                                        className={`color-swatch ${newFolderColor === c ? 'selected' : ''}`}
                                                        style={{
                                                            border: newFolderColor === c ? '2px solid white' : '1px solid #444',
                                                            backgroundColor: c,
                                                            cursor: 'pointer'
                                                        }}
                                                        aria-pressed={newFolderColor === c}
                                                    />
                                                ))}
                                            </div>
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
                                    <div className="deck-collection-modal-box scrollable-90vh" onClick={e => e.stopPropagation()}>
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
                                                                onClick={() => { toggleLockFolder(id); setSortMenuOpenId(null); }}
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
                                                            <div className="sort-opts-wrapper">
                                                                <button
                                                                    className="sort-opts-btn"
                                                                    onClick={e => { e.stopPropagation(); setSortMenuOpenId(curr => (curr === id ? null : id)); }}
                                                                >
                                                                    <span class="material-symbols-outlined">
                                                                        more_vert
                                                                    </span>
                                                                </button>
                                                                {sortMenuOpenId === id && (
                                                                    <div className="deckcollection-menu-dropdown-folder-organize" onClick={e => e.stopPropagation()}>
                                                                        <button onClick={() => { moveFolderToTop(id); setSortMenuOpenId(null); }}>
                                                                            Move to Top
                                                                        </button>
                                                                        <button onClick={() => { moveFolderToBottom(id); setSortMenuOpenId(null); }}>
                                                                            Move to Bottom
                                                                        </button>
                                                                        <button onClick={() => { toggleLockFolder(id); setSortMenuOpenId(null); }}>
                                                                            {lockedFolders.has(id) ? 'Unlock Position' : 'Lock Position'}
                                                                        </button>
                                                                        <button onClick={() => { setSortMenuOpenId(false) }}>
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
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
                                    <div className="deck-collection-modal-box scrollable-90vh" onClick={e => e.stopPropagation()}>
                                        <h4>Folder Visibility</h4>
                                        <div className='folder-visi-info'>
                                            <p>
                                                <span class="material-symbols-outlined privacy-icon active">
                                                    public
                                                </span>
                                                Select which folders you would like others to see from your public deck collection.
                                            </p>
                                            <p>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your public collection is live at:&nbsp;
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
