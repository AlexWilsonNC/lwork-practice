import React from 'react';
import { Link } from 'react-router-dom';
import '../css/WorldsBooklets.css';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const WorldsBookletPageMain = styled.main`
    // .booklet-button {
    //     background-color: ${({ theme }) => theme.bookletButtons};
    // }
`;

const covers = import.meta.glob('../assets/worlds-booklets/*/cover.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
});

const bookletYears = Object.entries(covers)
    .map(([path, src]) => {
        const year = path.match(/worlds-booklets\/(\d{4})\/cover/)?.[1];

        return {
            year,
            src
        };
    })
    .filter(item => item.year)
    .sort((a, b) => Number(b.year) - Number(a.year));

export default function WorldsBookletsPage() {
    const { theme } = useTheme();

    return (
        <WorldsBookletPageMain className="booklets-page" theme={theme}>
            <section className="booklets-hero">
                {/* <h1>World Championship Booklets</h1> */}
                {/* <p>Browse official Worlds booklet scans from past Pokémon TCG World Championships.</p> */}
            </section>

            <section className="booklets-grid">
                {bookletYears.map(({ year, src }) => (
                    <Link
                        key={year}
                        to={`/worlds-booklets/${year}`}
                        className="booklet-card"
                    >
                        <div
                            className="booklet-card-bg"
                            style={{ backgroundImage: `url(${src})` }}
                        >
                            <div className="booklet-card-content">
                                <div className="booklet-button">
                                    {year} Worlds
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </WorldsBookletPageMain>
    );
}