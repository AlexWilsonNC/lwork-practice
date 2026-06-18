import React from 'react';
import { Link } from 'react-router-dom';
import '../css/articles.css';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

import whenModernBecomesRetro from '../Articles/whenModernBecomesRetro';
import forgottenFormat from '../Articles/forgottenFormat';

const AllArticlesHomePage = styled.div`
  .article-card-content {color: ${({ theme }) => theme.text};}
  .article-card-content {background: ${({ theme }) => theme.articleContentBoxAllBg};}
`;

const articles = [
  forgottenFormat,
  whenModernBecomesRetro,
];

const AllArticlesPage = () => {
  const { theme } = useTheme();
  return (
    <AllArticlesHomePage theme={theme} className="all-articles-page">
      <section className="articles-hero">
        {/* <h1>Latest Articles</h1>
        <p>
          Browse strategy, retro format breakdowns, archive updates, and Pokémon TCG history.
        </p> */}
      </section>
      <section className="articles-grid">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="article-card"
            style={{ backgroundImage: `url(${article.headerImage})` }}
          >
            <div className="article-card-content">
              <p className="article-card-date">{article.date}</p>
              <h2>{article.title}</h2>
              <p className="article-card-preview">{article.sneakPeakText}</p>

              <div className="article-card-author">
                <img src={article.authorImage} alt={article.author} />
                <span>{article.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </AllArticlesHomePage>
  );
};

export default AllArticlesPage;