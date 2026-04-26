import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Spinner from '../contexts/Spinner';
import '../css/decklist.css';

const CollectionDeckCenter = styled.div`
    background: ${({ theme }) => theme.body};
    min-height: 100vh;

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
`;

const slugifyDeckName = name =>
    String(name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

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

export default function CollectionDeckPage() {
    const { username, deckId, deckSlug } = useParams();
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
                    : await fetch(`/api/public/${username}/deck-collection`);

                if (!res.ok) {
                    throw new Error('Deck collection not found.');
                }

                const data = await res.json();

                const publicDecks = isViewingOwnDeck
                    ? data
                    : data.decks || [];

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
                    publicFolders = data.folders || [];
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
    }, [username, deckId, deckSlug, isViewingOwnDeck]);

    const cards = useMemo(() => flattenDecklist(deck?.decklist), [deck]);

    const folderName = useMemo(() => {
        if (!deck?.folderId) return '';
        return folders.find(f =>
            String(getIdValue(f._id)) === String(getIdValue(deck.folderId))
        )?.name || '';
    }, [deck, folders]);

    const copyAsText = () => {
        const text = cards
            .map(c => `${c.count} ${c.name} ${c.setAbbrev || c.set} ${c.number}`)
            .join('\n');

        navigator.clipboard.writeText(text);
    };

    const openPrintDecklist = () => {
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
        navigate(`/deckbuilder#deck=${fragment}`);
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
            <CollectionDeckCenter className="center">
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
                                <p>This deck either does not exist or is not public.</p>
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
                            </p>

                            {folderName && (
                                <p>
                                    <span className="bold hide-on-600">Folder:</span> {folderName}
                                </p>
                            )}
                        </div>

                        <div className="deck-top-right-options">
                            <Link to={collectionLink} className='link-to-playerprofile-btn'>
                                <button className="decklist-modal-button-deckprofile">
                                    {username}'s Collection
                                </button>
                            </Link>
                            <div className='user-deck-options'>
                                <button className="copy-decklist-btn" onClick={copyAsText}>
                                    Copy as Text
                                </button>

                                <button className="copy-decklist-btn" onClick={openPrintDecklist}>
                                    Print List
                                </button>

                                <button className="open-in-deckbuilder-btn" onClick={goToDeckbuilder}>
                                    Open in Deckbuilder
                                </button>
                            </div>
                        </div>
                    </div>

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