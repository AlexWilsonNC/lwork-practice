import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import SidebarComponent from '../SideContent/SideContent'
import article1 from '../Articles/whenModernBecomesRetro';
import article2 from '../Articles/forgottenFormat';
import '../css/articles.css';

const ArticleContainer = styled.div`
    width: 100%;
    color: ${({ theme }) => theme.text};
    
    .top-article-image {
      width: 80%;height:300px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: cover;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }
`;

const ArticleComponent = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    console.log(`Fetching article with ID: ${articleId}`);
    
    const articles = {
      'modern-becomes-retro': article1,
      'forgotten-format': article2,
    };

    const selectedArticle = articles[articleId];
    console.log('Selected article:', selectedArticle);

    setArticle(selectedArticle);
  }, [articleId]);

  if (!article) {
    console.log('No article found, rendering loading state or error message.');
    return <div>Loading...</div>;
  }

  console.log('Article found, rendering article content:', article);

  const moveHeaderImgDown = article.imgMoveDown ? 'move-article-img-down' : '';

  return (
    <div className='new-homepage'>
      <ArticleContainer className='article-container'>
        <div className='article-title'>
          <h2>{article.title}</h2>
          <p>By: {article.author} | <a href={article.authorSocialLink} target='_blank'>{article.authorSocial}</a> | {article.date}</p>
        </div>

        <div
          className={`top-article-image ${moveHeaderImgDown}`}
          style={{ backgroundImage: `url(${article.headerImage})` }}
        ></div>

        <div className='table-of-contents'>
          <strong>Table of Contents:</strong>
          {article.tableOfContents.map((item) => (
            <p key={item.id} className="toc-item">
              • <a href={`#${item.id}`}>{item.text}</a>
            </p>
          ))}
          <hr class='title-hr'></hr>
        </div>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>

      </ArticleContainer>
      <SidebarComponent></SidebarComponent>
    </div>
  );
};

export default ArticleComponent;
