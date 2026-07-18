import React, {
    useEffect,
    useMemo,
    useState
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/upcoming-event-planner.css';
import styled from 'styled-components';

const PlannerPage = styled.div`
    color: ${({ theme }) => theme.text};
    .event-website-button {background: ${({ theme }) => theme.eventWebsiteBtn};}
    .event-planner-field-row select option {background-color: ${({ theme }) => theme.planFieldSelectColor};}
`;

const CHECKLIST_ITEMS = [
    {
        key: 'registered',
        label: 'Registered for Event',
        icon: 'confirmation_number',
        supportsCost: true
    },
    {
        key: 'travelBooked',
        label: 'Travel Booked',
        icon: 'flight_takeoff',
        supportsCost: true
    },
    {
        key: 'hotelBooked',
        label: 'Hotel Booked',
        icon: 'hotel',
        supportsCost: true
    },
    {
        key: 'decklistSubmitted',
        label: (
            <>
                Decklist Submitted{' '}
                <span style={{ fontSize: '10px' }}>
                    ( saving your decklist here is not officially submitting it )
                </span>
            </>
        ),
        icon: 'content_paste',
        supportsCost: false
    },
    {
        key: 'checkedIn',
        label: 'Checked In (Wristband Pickup)',
        icon: 'how_to_reg',
        supportsCost: false
    },
    {
        key: 'swagPickedUp',
        label: 'Swag Bag Picked Up',
        icon: 'shopping_bag',
        supportsCost: false
    }
];

const emptyChecklistItem = supportsCost => ({
    completed: false,
    ...(supportsCost ? { costCents: 0 } : {})
});

const normalizePlan = plan => ({
    ...plan,
    checklist: CHECKLIST_ITEMS.reduce(
        (result, item) => {
            result[item.key] = {
                ...emptyChecklistItem(item.supportsCost),
                ...(plan?.checklist?.[item.key] || {})
            };

            return result;
        },
        {}
    )
});

const centsToInput = cents => {
    if (!cents) return '';
    return (Number(cents) / 100).toFixed(2);
};

const dollarsToCents = value => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
        return 0;
    }

    return Math.round(parsed * 100);
};

const formatCurrency = cents =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format((Number(cents) || 0) / 100);

const formatEventDate = value => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function UpcomingEventPlanner({
    token,
    username,
    initialPlannedEventId = ''
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [decks, setDecks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [expandedId, setExpandedId] = useState(
        initialPlannedEventId ||
        location.state?.plannedEventId ||
        ''
    );
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState('');
    const [error, setError] = useState('');

    const loadPlanner = async () => {
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const [
                plansRes,
                decksRes,
                foldersRes
            ] = await Promise.all([
                fetch('/api/user/planned-events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),

                fetch('/api/user/decks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),

                fetch('/api/user/folders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            if (!plansRes.ok) {
                throw new Error('Could not load planned events');
            }

            if (!foldersRes.ok) {
                throw new Error('Could not load deck folders');
            }

            const [
                planData,
                deckData,
                folderData
            ] = await Promise.all([
                plansRes.json(),
                decksRes.json(),
                foldersRes.json()
            ]);

            setPlans(planData.map(normalizePlan));
            setDecks(Array.isArray(deckData) ? deckData : []);
            const folderList =
                folderData?.folders ||
                folderData ||
                [];

            setFolders(
                Array.isArray(folderList)
                    ? folderList
                        .slice()
                        .sort(
                            (a, b) =>
                                Number(a.order || 0) -
                                Number(b.order || 0)
                        )
                    : []
            );
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlanner();
    }, [token]);

    const updateLocalPlan = (planId, updater) => {
        setPlans(current =>
            current.map(plan =>
                plan._id === planId
                    ? updater(plan)
                    : plan
            )
        );
    };

    const savePlan = async plan => {
        setSavingId(plan._id);
        setError('');

        try {
            const res = await fetch(
                `/api/user/planned-events/${plan._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        attendanceStatus: plan.attendanceStatus,
                        checklist: plan.checklist,
                        notes: plan.notes || ''
                    })
                }
            );

            const payload = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    payload.error || 'Could not save event plan'
                );
            }

            setPlans(current =>
                current.map(item =>
                    item._id === plan._id
                        ? normalizePlan(payload.plan)
                        : item
                )
            );
            setExpandedId('');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSavingId('');
        }
    };

    const deletePlan = async plan => {
        const confirmed = window.confirm(
            `Remove ${plan.eventName} from your Event Planner?`
        );

        if (!confirmed) return;

        setSavingId(plan._id);
        setError('');

        try {
            const res = await fetch(
                `/api/user/planned-events/${plan._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const payload = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    payload.error || 'Could not remove event'
                );
            }

            setPlans(current =>
                current.filter(item => item._id !== plan._id)
            );
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSavingId('');
        }
    };

    const assignCollectionDeck = async (
        plan,
        deckId
    ) => {
        setSavingId(plan._id);
        setError('');

        try {
            const res = await fetch(
                `/api/user/planned-events/${plan._id}/deck/from-collection`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        deckId
                    })
                }
            );

            const payload = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    payload.error ||
                    'Could not add this deck to the event'
                );
            }

            setPlans(current =>
                current.map(item =>
                    item._id === plan._id
                        ? normalizePlan({
                            ...payload.plan,
                            showCollectionDeckPicker: false
                        })
                        : item
                )
            );
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSavingId('');
        }
    };

    const removeEventDeck = async plan => {
        const confirmed = window.confirm(
            `Remove the tournament deck from ${plan.eventName}?`
        );

        if (!confirmed) return;

        setSavingId(plan._id);
        setError('');

        try {
            const res = await fetch(
                `/api/user/planned-events/${plan._id}/deck`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const payload = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    payload.error ||
                    'Could not remove the event deck'
                );
            }

            setPlans(current =>
                current.map(item =>
                    item._id === plan._id
                        ? normalizePlan(payload.plan)
                        : item
                )
            );
            setExpandedId('');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSavingId('');
        }
    };

    const totalAcrossAllEvents = useMemo(
        () =>
            plans.reduce((grandTotal, plan) => {
                const eventTotal = CHECKLIST_ITEMS.reduce(
                    (subtotal, item) =>
                        subtotal +
                        Number(
                            plan.checklist?.[item.key]?.costCents || 0
                        ),
                    0
                );

                return grandTotal + eventTotal;
            }, 0),
        [plans]
    );

    if (loading) {
        return <div className="spinner" />;
    }

    return (
        <PlannerPage className="event-planner">
            <div className="event-planner-heading">
                <div>
                    <h2>Event Planner</h2>
                    <p>Track the events you are considering; registration, travel, decklist to submit, expenses, and checklist as you go.</p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/tournaments/upcoming')}
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>
                    Add events
                </button>
            </div>

            {error && (
                <div className="event-planner-error">
                    {error}
                </div>
            )}

            {plans.length > 0 && (
                <div className="event-planner-summary">
                    <div>
                        <strong>{plans.length}</strong>
                        <span>
                            Event{plans.length === 1 ? '' : 's'}
                        </span>
                    </div>

                    <div>
                        <strong>
                            {
                                plans.filter(
                                    plan =>
                                        plan.attendanceStatus === 'going'
                                ).length
                            }
                        </strong>
                        <span>Going</span>
                    </div>

                    <div>
                        <strong>
                            {formatCurrency(totalAcrossAllEvents)}
                        </strong>
                        <span>2027 Season Cost</span>
                    </div>
                </div>
            )}

            {plans.length === 0 ? (
                <div className="event-planner-empty">
                    <span className="material-symbols-outlined">
                        event_upcoming
                    </span>

                    <h3>No upcoming events added yet</h3>

                    <p>
                        Open the Upcoming Tournaments page and select the
                        plus button beside events you may attend.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/tournaments/upcoming')
                        }
                    >
                        Browse upcoming tournaments
                    </button>
                </div>
            ) : (
                <div className="event-planner-list">
                    {plans.map(plan => {
                        const expanded = expandedId === plan._id;

                        const eventTotal = CHECKLIST_ITEMS.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    plan.checklist?.[item.key]
                                        ?.costCents || 0
                                ),
                            0
                        );

                        const completedCount =
                            CHECKLIST_ITEMS.filter(
                                item =>
                                    plan.checklist?.[item.key]?.completed
                            ).length;

                        return (
                            <article
                                key={plan._id}
                                className={[
                                    'event-planner-card',
                                    plan.attendanceStatus
                                ].join(' ')}
                            >
                                <button
                                    type="button"
                                    className="event-planner-card-summary"
                                    onClick={() =>
                                        setExpandedId(
                                            expanded ? '' : plan._id
                                        )
                                    }
                                >
                                    {plan.eventLogo && (
                                        <img
                                            className="event-planner-logo"
                                            src={plan.eventLogo}
                                            alt=""
                                        />
                                    )}
                                    <div className="event-planner-date-container">
                                        <div className="event-planner-date">
                                            <span>
                                                {new Date(plan.eventDate).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        month: 'short'
                                                    }
                                                )}
                                            </span>

                                            <strong>
                                                {new Date(plan.eventDate).getDate()}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="event-planner-event-info">
                                        <div className="event-planner-title-row">
                                            <h3>{plan.eventName}</h3>

                                            <span
                                                className={`attendance-badge ${plan.attendanceStatus}`}
                                            >
                                                {plan.attendanceStatus === 'going'
                                                    ? 'Going'
                                                    : plan.attendanceStatus === 'cancelled'
                                                        ? 'Cancelled'
                                                        : 'Tentative'}
                                            </span>
                                        </div>

                                        <p>{formatEventDate(plan.eventDate)}</p>

                                        {plan.eventLocation && (
                                            <p>
                                                <span className="material-symbols-outlined">
                                                    location_on
                                                </span>
                                                {plan.eventLocation}
                                            </p>
                                        )}

                                        <div className="event-planner-progress">
                                            <span>
                                                Checklist: {completedCount}/{CHECKLIST_ITEMS.length}
                                            </span>

                                            <span>
                                                Expected Cost: {formatCurrency(eventTotal)}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="material-symbols-outlined">
                                        {expanded
                                            ? 'expand_less'
                                            : 'expand_more'}
                                    </span>
                                </button>

                                {expanded && (
                                    <div className="event-planner-details">
                                        <div className="event-planner-field-row">
                                            <label>
                                                Attendance status
                                                <select
                                                    value={plan.attendanceStatus}
                                                    onChange={event => {
                                                        const value = event.target.value;

                                                        updateLocalPlan(
                                                            plan._id,
                                                            current => ({
                                                                ...current,
                                                                attendanceStatus: value
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <option value="going">
                                                        Going
                                                    </option>
                                                    <option value="interested">
                                                        Tentative
                                                    </option>
                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>
                                                </select>
                                            </label>
                                        </div>

                                        <div className="planned-event-deck-section">
                                            <div className="planned-event-deck-heading">
                                                <div>
                                                    <h4>Tournament deck</h4>
                                                    {!plan.eventDeck?.decklist?.length && (
                                                        <p>
                                                            Create a deck for this event or copy one from your
                                                            existing deck collection.
                                                        </p>
                                                    )}
                                                    {plan.eventDeck?.decklist?.length && (
                                                        <br></br>
                                                    )}
                                                </div>

                                                {!plan.eventDeck?.decklist?.length && (
                                                    <div className="planned-event-deck-actions">
                                                        <button
                                                            type="button"
                                                            className="create-event-deck-btn"
                                                            onClick={() => {
                                                                navigate(
                                                                    `/deckbuilder?plannedEventId=${plan._id}`
                                                                );
                                                            }}
                                                        >
                                                            Create deck
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updateLocalPlan(
                                                                    plan._id,
                                                                    current => ({
                                                                        ...current,
                                                                        showCollectionDeckPicker: true,
                                                                        selectedCollectionFolderId: null
                                                                    })
                                                                );
                                                            }}
                                                        >
                                                            From collection
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {plan.eventDeck?.decklist?.length > 0 && (
                                                <div className="event-planner-selected-deck">
                                                    {plan.eventDeck.mascotImageUrl ? (
                                                        <img
                                                            className="planned-event-deck-mascot"
                                                            src={plan.eventDeck.mascotImageUrl}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <span className="material-symbols-outlined">
                                                            style
                                                        </span>
                                                    )}
                                                    <div>
                                                        <strong>{plan.eventDeck.name}</strong>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/deckbuilder?plannedEventId=${plan._id}`
                                                            )
                                                        }
                                                    >
                                                        Open deck
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="remove-event-deck-btn"
                                                        disabled={savingId === plan._id}
                                                        onClick={() => removeEventDeck(plan)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}

                                            {plan.showCollectionDeckPicker && (
                                                <div className="collection-deck-picker">
                                                    <div className="collection-deck-picker-top">
                                                        <div>
                                                            <h4>
                                                                {plan.selectedCollectionFolderId === null
                                                                    ? 'Select a folder'
                                                                    : 'Select a saved deck'}
                                                            </h4>

                                                            {plan.selectedCollectionFolderId !== null && (
                                                                <button
                                                                    type="button"
                                                                    className="collection-folder-back"
                                                                    onClick={() => {
                                                                        updateLocalPlan(
                                                                            plan._id,
                                                                            current => ({
                                                                                ...current,
                                                                                selectedCollectionFolderId: null
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    ← Back to folders
                                                                </button>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            aria-label="Close deck picker"
                                                            onClick={() => {
                                                                updateLocalPlan(
                                                                    plan._id,
                                                                    current => ({
                                                                        ...current,
                                                                        showCollectionDeckPicker: false,
                                                                        selectedCollectionFolderId: null
                                                                    })
                                                                );
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                close
                                                            </span>
                                                        </button>
                                                    </div>

                                                    {plan.selectedCollectionFolderId === null ? (
                                                        <div className="collection-folder-picker-list">
                                                            {folders.map(folder => {
                                                                const folderDeckCount = decks.filter(
                                                                    deck =>
                                                                        String(deck.folderId || '') ===
                                                                        String(folder._id)
                                                                ).length;

                                                                if (folderDeckCount === 0) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={folder._id}
                                                                        onClick={() => {
                                                                            updateLocalPlan(
                                                                                plan._id,
                                                                                current => ({
                                                                                    ...current,
                                                                                    selectedCollectionFolderId:
                                                                                        String(folder._id)
                                                                                })
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="collection-folder-color"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    folder.color || '#1290eb'
                                                                            }}
                                                                        />

                                                                        <span className="collection-folder-name">
                                                                            {folder.name}
                                                                        </span>

                                                                        <span className="collection-folder-count">
                                                                            {folderDeckCount}
                                                                        </span>

                                                                        <span className="material-symbols-outlined">
                                                                            chevron_right
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}

                                                            {decks.some(deck => !deck.folderId) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        updateLocalPlan(
                                                                            plan._id,
                                                                            current => ({
                                                                                ...current,
                                                                                selectedCollectionFolderId:
                                                                                    'unassigned'
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="collection-folder-color unassigned"
                                                                    />

                                                                    <span className="collection-folder-name">
                                                                        Unassigned
                                                                    </span>

                                                                    <span className="collection-folder-count">
                                                                        {
                                                                            decks.filter(
                                                                                deck => !deck.folderId
                                                                            ).length
                                                                        }
                                                                    </span>

                                                                    <span className="material-symbols-outlined">
                                                                        chevron_right
                                                                    </span>
                                                                </button>
                                                            )}

                                                            {folders.every(folder =>
                                                                decks.every(
                                                                    deck =>
                                                                        String(deck.folderId || '') !==
                                                                        String(folder._id)
                                                                )
                                                            ) &&
                                                                !decks.some(deck => !deck.folderId) && (
                                                                    <p>
                                                                        You do not have any saved decks.
                                                                    </p>
                                                                )}
                                                        </div>
                                                    ) : (
                                                        <div className="collection-deck-picker-list">
                                                            {decks
                                                                .filter(deck => {
                                                                    if (
                                                                        plan.selectedCollectionFolderId ===
                                                                        'unassigned'
                                                                    ) {
                                                                        return !deck.folderId;
                                                                    }

                                                                    return (
                                                                        String(deck.folderId || '') ===
                                                                        String(
                                                                            plan.selectedCollectionFolderId
                                                                        )
                                                                    );
                                                                })
                                                                .slice()
                                                                .sort((a, b) =>
                                                                    String(a.name || '').localeCompare(
                                                                        String(b.name || '')
                                                                    )
                                                                )
                                                                .map(deck => (
                                                                    <button
                                                                        type="button"
                                                                        key={deck._id}
                                                                        disabled={savingId === plan._id}
                                                                        onClick={() =>
                                                                            assignCollectionDeck(
                                                                                plan,
                                                                                deck._id
                                                                            )
                                                                        }
                                                                    >
                                                                        {deck.mascotImageUrl ? (
                                                                            <img
                                                                                src={deck.mascotImageUrl}
                                                                                alt=""
                                                                            />
                                                                        ) : (
                                                                            <span className="material-symbols-outlined">
                                                                                style
                                                                            </span>
                                                                        )}

                                                                        <span>{deck.name}</span>

                                                                        <span className="material-symbols-outlined">
                                                                            add
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="event-checklist">
                                            {CHECKLIST_ITEMS.map(item => {
                                                const checklistItem =
                                                    plan.checklist[item.key];

                                                return (
                                                    <div
                                                        key={item.key}
                                                        className={[
                                                            'event-checklist-item',
                                                            checklistItem.completed
                                                                ? 'completed'
                                                                : ''
                                                        ].filter(Boolean).join(' ')}
                                                    >
                                                        <label className="event-check-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    checklistItem.completed
                                                                }
                                                                onChange={event => {
                                                                    const checked =
                                                                        event.target.checked;

                                                                    updateLocalPlan(
                                                                        plan._id,
                                                                        current => ({
                                                                            ...current,
                                                                            checklist: {
                                                                                ...current.checklist,
                                                                                [item.key]: {
                                                                                    ...current.checklist[
                                                                                    item.key
                                                                                    ],
                                                                                    completed: checked
                                                                                }
                                                                            }
                                                                        })
                                                                    );
                                                                }}
                                                            />

                                                            <span className="material-symbols-outlined">
                                                                {item.icon}
                                                            </span>

                                                            <span>{item.label}</span>
                                                        </label>

                                                        {item.supportsCost && (
                                                            <label className="event-cost-input">
                                                                <span>$</span>

                                                                <input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    min="0"
                                                                    step="0.01"
                                                                    placeholder="0.00"
                                                                    defaultValue={
                                                                        checklistItem.costCents
                                                                            ? checklistItem.costCents / 100
                                                                            : ''
                                                                    }
                                                                    onBlur={event => {
                                                                        const costCents = dollarsToCents(
                                                                            event.target.value
                                                                        );

                                                                        updateLocalPlan(
                                                                            plan._id,
                                                                            current => ({
                                                                                ...current,
                                                                                checklist: {
                                                                                    ...current.checklist,
                                                                                    [item.key]: {
                                                                                        ...current.checklist[item.key],
                                                                                        costCents
                                                                                    }
                                                                                }
                                                                            })
                                                                        );
                                                                    }}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <label className="event-planner-notes">
                                            Private notes

                                            <textarea
                                                rows="4"
                                                maxLength="5000"
                                                placeholder="Travel details, testing notes, meta predictions, people traveling with you, people you plan to avoid..."
                                                value={plan.notes || ''}
                                                onChange={event => {
                                                    const value = event.target.value;

                                                    updateLocalPlan(
                                                        plan._id,
                                                        current => ({
                                                            ...current,
                                                            notes: value
                                                        })
                                                    );
                                                }}
                                            />
                                        </label>

                                        <div className="event-planner-card-footer">
                                            {/* <div>
                                                Event total:
                                                <strong>
                                                    {formatCurrency(eventTotal)}
                                                </strong>
                                            </div> */}
                                            <div>
                                                {plan.eventSite && (
                                                    <a
                                                        href={plan.eventSite}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="event-website-button"
                                                    >
                                                        Event website
                                                    </a>
                                                )}

                                                <button
                                                    type="button"
                                                    className="delete-event-plan"
                                                    disabled={savingId === plan._id}
                                                    onClick={() => deletePlan(plan)}
                                                >
                                                    Remove Plans
                                                </button>

                                                <button
                                                    type="button"
                                                    className="save-event-plan"
                                                    disabled={savingId === plan._id}
                                                    onClick={() => savePlan(plan)}
                                                >
                                                    {savingId === plan._id
                                                        ? 'Saving...'
                                                        : 'Save Plans'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </PlannerPage>
    );
}