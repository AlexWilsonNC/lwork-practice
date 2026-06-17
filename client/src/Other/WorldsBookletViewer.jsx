import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../css/WorldsBooklets.css';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const scanImports = import.meta.glob('../assets/worlds-booklets/*/scans/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
});

const WorldsBookletViewPage = styled.main`
    color: ${({ theme }) => theme.text};
    .scan-controls button {
        background-color: ${({ theme }) => theme.scanCtrlButtons};
    }
`;

export default function WorldsBookletViewer() {
    const { theme } = useTheme();
    const { year } = useParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const goFirst = () => setActiveIndex(0);
    // const goLast = () => setActiveIndex(scans.length - 1);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const scans = useMemo(() => {
        return Object.entries(scanImports)
            .filter(([path]) => path.includes(`/worlds-booklets/${year}/scans/`))
            .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
            .map(([, src]) => src);
    }, [year]);

    const goPrev = () => {
        setActiveIndex(prev => Math.max(prev - 1, 0));
    };

    const goNext = () => {
        setActiveIndex(prev => Math.min(prev + 1, scans.length - 1));
    };

    if (!scans.length) {
        return (
            <main className="booklet-viewer-page">
                <Link to="/worlds-booklets" className="booklet-back">
                    ← Back to Booklets
                </Link>

                <h1>{year} Worlds Booklet</h1>
                <p>No scans found for this booklet yet.</p>
            </main>
        );
    }

    return (
        <WorldsBookletViewPage className="booklet-viewer-page" theme={theme}>
            <Link to="/worlds-booklets" className="booklet-back">
                ← Back to Booklets
            </Link>

            <h1>{year} Worlds Booklet</h1>

            <br></br>
            <Link
                to={`/tournaments/${year}_WORLDS`}
                style={{ color: '#1290eb' }}
                className='link-to-worlds-event-page'
            >
                View {year} Worlds Event Page
            </Link>
            <br></br>

            <section className="scan-stage">
                {scans.map((src, index) => {
                    const offset = index - activeIndex;

                    return (
                        <img
                            key={src}
                            src={src}
                            alt={`${year} Worlds Booklet page ${index + 1}`}
                            className="scan-page"
                            onClick={() => {
                                if (index === activeIndex) setIsZoomOpen(true);
                            }}
                            style={{
                                transform: `
            translateX(${offset * 72}%)
            scale(${offset === 0 ? 1 : 0.82})
        `,
                                opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.35,
                                zIndex: offset === 0 ? 3 : 2,
                                pointerEvents: offset === 0 ? 'auto' : 'none',
                                cursor: offset === 0 ? 'zoom-in' : 'default'
                            }}
                        />
                    );
                })}
            </section>

            <div className="scan-controls">
                <button
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                >
                    ← Previous
                </button>

                <span>
                    Page {activeIndex + 1} / {scans.length}
                </span>

                <button
                    onClick={goNext}
                    disabled={activeIndex === scans.length - 1}
                >
                    Next →
                </button>

                {/* <button
                    onClick={goLast}
                    disabled={activeIndex === scans.length - 1}
                >
                    Last ⇥
                </button> */}
            </div>
            <br></br>
            <div className="scan-controls">
                <button
                    onClick={goFirst}
                    disabled={activeIndex === 0}
                >
                    ⇤ Reset
                </button>
            </div>
            {isZoomOpen && (
                <div className="scan-lightbox" onClick={() => setIsZoomOpen(false)}>
                    <button
                        className="scan-lightbox-close"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        ×
                    </button>

                    <div className="scan-lightbox-inner" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={scans[activeIndex]}
                            alt={`${year} Worlds Booklet page ${activeIndex + 1} enlarged`}
                            className="scan-lightbox-image"
                        />
                    </div>
                </div>
            )}
        </WorldsBookletViewPage>
    );
}