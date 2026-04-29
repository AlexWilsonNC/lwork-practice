import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Spinner from '../contexts/Spinner';
import '../css/decklist.css';

const CollectionDeckCenter = styled.div`
    background: ${({ theme }) => theme.body};
    min-height: ${({ hasError }) => (hasError ? '100vh' : 'auto')};
    .player-deck {
        background: ${({ theme }) => theme.deckBg};
        color: ${({ theme }) => theme.text};
    }
    .deck-cards,
    .deck-box {
        background-image: ${({ theme }) => theme.deckModalAccountList};
        border: ${({ theme }) => theme.deckBorder};
    }
    .user-deck-options button {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }
    .list-item {
        background: ${({ theme }) => theme.listCardBg};
        color: ${({ theme }) => theme.listCardText};
    }
    .deckview-switcher div {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }
`;

const getDeckId = deck =>
    deck?._id?.$oid || deck?._id || deck?.id;

const getIdValue = value =>
    value?.$oid || value;

const flattenDecklist = raw => {
    if (Array.isArray(raw)) return raw;

    return [
        ...(raw?.pokemon || []),
        ...(raw?.trainer || []),
        ...(raw?.energy || []),
    ];
};

const groupDecklist = raw => {
    if (!raw) {
        return { pokemon: [], trainer: [], energy: [] };
    }

    if (!Array.isArray(raw)) {
        return {
            pokemon: raw.pokemon || [],
            trainer: raw.trainer || [],
            energy: raw.energy || [],
        };
    }

    return {
        pokemon: raw.filter(c => c.supertype === 'Pokémon' || c.supertype === 'Pokemon'),
        trainer: raw.filter(c => c.supertype === 'Trainer'),
        energy: raw.filter(c => c.supertype === 'Energy'),
    };
};

export default function CollectionDeckPage() {
    const { username, deckId } = useParams();
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const isViewingOwnDeck =
        user?.username &&
        username &&
        user.username.toLowerCase() === username.toLowerCase();

    const collectionLink = isViewingOwnDeck
        ? '/account'
        : `/${username}/deck-collection`;

    const [deck, setDeck] = useState(null);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [editingDescription, setEditingDescription] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState(localStorage.getItem('viewMode') || 'grid');

    useEffect(() => {
        let cancelled = false;

        async function loadDeck() {
            try {
                setLoading(true);
                setPageError('');

                const token = localStorage.getItem('PTCGLegendsToken');

                const res = isViewingOwnDeck
                    ? await fetch('/api/user/decks', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    : await fetch(`/api/users/${username}/decks/${deckId}`);

                if (!res.ok) {
                    throw new Error('Deck collection not found.');
                }

                const data = await res.json();

                const publicDecks = isViewingOwnDeck
                    ? data
                    : data.deck
                        ? [data.deck]
                        : [];

                let publicFolders = [];

                if (isViewingOwnDeck) {
                    const foldersRes = await fetch('/api/user/folders', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (foldersRes.ok) {
                        const folderData = await foldersRes.json();
                        publicFolders = folderData.folders || folderData || [];
                    }
                } else {
                    publicFolders = data.folder ? [data.folder] : [];
                }

                const found = publicDecks.find(d => String(getDeckId(d)) === String(deckId));

                if (!found) {
                    throw new Error('Deck not found.');
                }

                if (!cancelled) {
                    setDeck(found);
                    setFolders(publicFolders);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error(err);
                    setPageError(err.message || 'Deck not found.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDeck();

        return () => {
            cancelled = true;
        };
    }, [username, deckId, isViewingOwnDeck]);

    const cards = useMemo(() => flattenDecklist(deck?.decklist), [deck]);
    const groupedDecklist = useMemo(() => groupDecklist(deck?.decklist), [deck]);

    const folderName = useMemo(() => {
        if (!deck?.folderId) return '';
        return folders.find(f =>
            String(getIdValue(f._id)) === String(getIdValue(deck.folderId))
        )?.name || '';
    }, [deck, folders]);

    const copyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const copyAsText = () => {
        const text = cards
            .map(c => `${c.count} ${c.name} ${c.setAbbrev || c.set} ${c.number}`)
            .join('\n');

        navigator.clipboard.writeText(text);
    };

    // const openPrintDecklist = () => {
    //     const minimal = cards.map(c => ({
    //         supertype: c.supertype,
    //         set: c.setAbbrev || c.set,
    //         name: c.name,
    //         number: c.number,
    //         count: c.count,
    //         regMark: c.regulationMark || ''
    //     }));

    //     const payload = encodeURIComponent(JSON.stringify(minimal));
    //     window.open(`/print?deck=${payload}`, '_blank', 'noopener,noreferrer');
    // };

    const goToDeckbuilder = () => {
        const minimal = cards.map(c => {
            const setCode = c.setAbbrev || c.set;

            if (c.isUploadedImageCard || setCode === 'UPL') {
                return {
                    set: setCode,
                    number: c.number,
                    count: c.count,
                    name: c.name,
                    supertype: c.supertype,
                    subtypes: c.subtypes || [],
                    isUploadedImageCard: true,
                    imageUrl: c.imageUrl || '',
                    images: c.images
                        ? { small: c.images.small, large: c.images.large }
                        : undefined,
                    uploadedPublicId: c.uploadedPublicId || '',
                    uploadedAssetId: c.uploadedAssetId || '',
                    uploadedFileName: c.uploadedFileName || ''
                };
            }

            return {
                set: setCode,
                number: c.number,
                count: c.count
            };
        });

        const fragment = encodeURIComponent(JSON.stringify(minimal));
        const currentDeckId = getDeckId(deck);

        if (isViewingOwnDeck) {
            localStorage.setItem('PTCGLegendsOriginalDeckMeta', JSON.stringify({
                id: currentDeckId,
                name: deck.name || '',
                mascotCard: deck.mascotCard || '',
                secondaryMascotCard: deck.secondaryMascotCard || '',
                description: deck.description || ''
            }));

            navigate(`/deckbuilder?deckId=${currentDeckId}#deck=${fragment}`);
        } else {
            localStorage.removeItem('PTCGLegendsOriginalDeckMeta');
            navigate(`/deckbuilder#deck=${fragment}`);
        }
    };

    const switchToGridView = () => {
        setViewMode('grid');
        localStorage.setItem('viewMode', 'grid');
    };
    const switchToListView = () => {
        setViewMode('list');
        localStorage.setItem('viewMode', 'list');
    };

    const handleSaveDescription = async () => {
        const token = localStorage.getItem('PTCGLegendsToken');
        if (!deck?._id) return;

        try {
            const res = await fetch(`/api/user/decks/${getDeckId(deck)}/description`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ description: newDescription.trim() })
            });

            if (!res.ok) throw new Error('Failed to update description');

            const updated = await res.json();

            setDeck(d => ({
                ...d,
                description: updated.deck?.description || newDescription
            }));

            setEditingDescription(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update description');
        }
    };

    const handleDeleteDeck = async () => {
        if (!window.confirm('Permanently delete this deck from your collection?')) return;

        const token = localStorage.getItem('PTCGLegendsToken');

        try {
            const res = await fetch(`/api/user/decks/${getDeckId(deck)}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Delete failed');

            navigate('/account');
        } catch (err) {
            console.error(err);
            alert('Failed to delete deck');
        }
    };

    if (loading) return <Spinner />;

    if (pageError || !deck) {
        return (
            <CollectionDeckCenter className="center" hasError={!!pageError || !deck}>
                <Helmet>
                    <title>Deck Not Found</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>

                <div className="playerlistnewcolumn">
                    <div className="player-deck">
                        <div className="player-deck-top">
                            <div>
                                <h2>Deck Not Found</h2>
                                <hr className="playerdeck-hr" />
                                <p>This deck either does not exist or the link is invalid.</p>
                                <p>
                                    <Link className="blue-link bold" to={collectionLink}>
                                        Back to {username}'s deck collection
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CollectionDeckCenter>
        );
    }

    return (
        <CollectionDeckCenter className="center">
            <Helmet>
                <title>{deck.name} by {username}</title>
                <meta name="description" content={`${deck.name} from ${username}'s PTCG Legends deck collection.`} />
                <meta property="og:title" content={`${deck.name} by ${username}`} />
                <meta property="og:description" content={deck.description || `${username}'s PTCG Legends deck.`} />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="playerlistnewcolumn">
                <div className="player-deck">
                    <div className="player-deck-top">
                        <div>
                            <h2>{deck.name}</h2>
                            <hr className="playerdeck-hr" />

                            <p>
                                <span className="bold">User:</span>{' '}
                                <Link className="blue-link bold" to={collectionLink}>
                                    {username}
                                </Link>
                                {/* <Link to={collectionLink} className='link-to-playerprofile-btn'>
                                    <button className="decklist-modal-button-deckprofile">
                                        {username}'s Collection
                                    </button>
                                </Link> */}
                            </p>
                            <p>Folder: {folderName || 'Unassigned'}</p>
                        </div>

                        <div className="deck-top-right-options">
                            <div className='user-deck-options'>
                                <button className="copy-decklist-btn" onClick={copyShareLink}>
                                    {copied ? (
                                        <span className="material-symbols-outlined">check</span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">ios_share</span>
                                            <span className="tooltip-text">Share URL</span>
                                        </>
                                    )}
                                </button>
                                <button className="copy-decklist-btn" onClick={copyAsText}>
                                    <span className="material-symbols-outlined">content_copy</span>
                                    <span className="tooltip-text">Copy to Clipboard</span>
                                </button>
                                {/* <button className="copy-decklist-btn" onClick={openPrintDecklist}>
                                    <span className="material-symbols-outlined">print</span>
                                    <span className="tooltip-text">Print Decklist</span>
                                </button> */}
                                <button className="open-in-deckbuilder-btn" onClick={goToDeckbuilder}>
                                    <span className="material-symbols-outlined">construction</span>
                                    <span className="tooltip-text">Open in Deck&nbsp;Builder</span>
                                </button>
                                <div className='deckview-switcher'>
                                    <div className={`list-form ${viewMode === 'list' ? 'active-grid-option' : ''}`} onClick={switchToListView}>
                                        <span className="material-symbols-outlined">reorder</span>
                                    </div>
                                    <div className={`playmat-form ${viewMode === 'grid' ? 'active-grid-option' : ''}`} onClick={switchToGridView}>
                                        <span className="material-symbols-outlined">grid_view</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="deck-cards">
                            {cards.map((card, index) => {
                                const setCode = card.setAbbrev || card.set;
                                const imgSrc = card?.images?.small || card?.imageUrl;

                                return (
                                    <div
                                        key={`${setCode}-${card.number}-${index}`}
                                        className="card-container"
                                        onClick={() => {
                                            if (card.isUploadedImageCard || setCode === 'UPL') {
                                                alert('This is a custom uploaded image, not found in the database.');
                                                return;
                                            }

                                            window.open(`/card/${setCode}/${card.number}`, '_blank', 'noopener,noreferrer');
                                        }}
                                    >
                                        <img src={imgSrc} alt={card.name} />
                                        <div className="card-count">{card.count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="deck-list">
                            <div className="column-section">
                                <div className="list-category">
                                    <h3>Pokémon ({groupedDecklist.pokemon?.reduce((sum, c) => sum + Number(c.count), 0) || 0})</h3>
                                </div>
                                <div className="list-of-cards">
                                    {(groupedDecklist.pokemon || []).map((card, index) => {
                                        const setCode = card.setAbbrev || card.set;
                                        const imgSrc = card?.images?.small || card?.imageUrl;

                                        return (
                                            <div
                                                key={`${setCode}-${card.number}-${index}`}
                                                className="list-item"
                                                onClick={() => window.open(`/card/${setCode}/${card.number}`, '_blank', 'noopener,noreferrer')}
                                            >
                                                <p className="list-card-count">{card.count}</p>
                                                <p className="bold-name">{card.name}</p>
                                                <img className="pokemon-list-img" src={imgSrc} alt={card.name} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="column-section">
                                <div className="list-category">
                                    <h3>Trainer ({groupedDecklist.trainer?.reduce((sum, c) => sum + Number(c.count), 0) || 0})</h3>
                                </div>
                                <div className="list-of-cards">
                                    {(groupedDecklist.trainer || []).map((card, index) => {
                                        const setCode = card.setAbbrev || card.set;
                                        const imgSrc = card?.images?.small || card?.imageUrl;

                                        return (
                                            <div
                                                key={`${setCode}-${card.number}-${index}`}
                                                className="list-item"
                                                onClick={() => window.open(`/card/${setCode}/${card.number}`, '_blank', 'noopener,noreferrer')}
                                            >
                                                <p className="list-card-count">{card.count}</p>
                                                <p className="bold-name">{card.name}</p>
                                                <img className="trainer-list-img" src={imgSrc} alt={card.name} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="column-section">
                                <div className="list-category">
                                    <h3>Energy ({groupedDecklist.energy?.reduce((sum, c) => sum + Number(c.count), 0) || 0})</h3>
                                </div>
                                <div className="list-of-cards">
                                    {(groupedDecklist.energy || []).map((card, index) => {
                                        const setCode = card.setAbbrev || card.set;
                                        const imgSrc = card?.images?.small || card?.imageUrl;

                                        return (
                                            <div
                                                key={`${setCode}-${card.number}-${index}`}
                                                className="list-item"
                                                onClick={() => window.open(`/card/${setCode}/${card.number}`, '_blank', 'noopener,noreferrer')}
                                            >
                                                <p className="list-card-count">{card.count}</p>
                                                <p className="bold-name">{card.name}</p>
                                                <img className="energy-list-img" src={imgSrc} alt={card.name} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='user-deck-description-container'>
                        <strong>Description:</strong>

                        {!editingDescription ? (
                            <>
                                {deck.description && (
                                    <p style={{ whiteSpace: 'pre-line' }}>
                                        {deck.description}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <textarea
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                />
                                <div className="desc-edit-actions">
                                    <button onClick={() => setEditingDescription(false)}>Cancel</button>
                                    <button className='desc-edit-actions-save' onClick={handleSaveDescription}>Save</button>
                                </div>
                            </>
                        )}

                        {isViewingOwnDeck && (
                            <div className="owner-deck-actions user-deck-options">
                                <button
                                    onClick={() => {
                                        setEditingDescription(true);
                                        setNewDescription(deck.description || '');
                                    }}
                                    className='copy-decklist-btn edt-dklist-btn-dck'
                                >
                                    Edit Description
                                </button>

                                <button
                                    className="copy-decklist-btn delete-deck-btn"
                                    onClick={handleDeleteDeck}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CollectionDeckCenter>
    );
}