import React from 'react';
import { Link } from 'react-router-dom';

const AllArticlesPage = () => {
  // Example list of articles, replace with real data
  const articles = [
    { id: 1, title: 'When Modern Becomes Retro' },
    { id: 2, title: 'Exploring the 2021 Meta' },
    // Add more articles here
  ];

  return (
    <div>
      <h1>All Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link to={`/articles/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllArticlesPage;
