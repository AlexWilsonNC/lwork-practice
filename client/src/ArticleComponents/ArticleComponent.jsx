import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import SidebarComponent from '../SideContent/SideContent'
import article1 from '../Articles/whenModernBecomesRetro';
import article2 from '../Articles/forgottenFormat';
import article3 from '../Articles/problemsof2010';
import '../css/articles.css';
import fluffychompImg from '../assets/article-images/fluffychomp.png';
import tinaimg from '../assets/article-images/13498118540092.jpg';
import sixprizesscreensho from '../assets/article-images/sixprizes-2.0-2012-04-19-crop.webp';
import pookahoohimg from '../assets/article-images/pumpupsmash.png';
import pokecatcher from '../assets/article-images/en_US-BW2-095-pokemon_catcher.jpg';
import darkraiHydreigon from '../assets/article-images/hydreigondarkrai.png';
import terrakionmewtwodar from '../assets/article-images/terrakionmewtwodar.png';
import rayeels from '../assets/article-images/rayeels.png';
import empogor from '../assets/article-images/empogor.png';
import hoohex from '../assets/article-images/hooh.png';
import tornadusterrak from '../assets/article-images/tornkion.png';
import sshEvsBanner from '../assets/article-images/sw-evs-banner.png';
import sshBrsBanner from '../assets/article-images/sw-brs-banner.png';
import swlorBanner from '../assets/article-images/sw-lor-banner.png';
import btspalBanner from '../assets/article-images/bts-pal-banner.png';
import btspafBanner from '../assets/article-images/bts-paf-banner.png';
import melbourne22Image from '../assets/article-images/melbourne22.png';

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
    .articles-toggle-top a {color: ${({ theme }) => theme.text};}
`;

const ArticleComponent = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    console.log(`Fetching article with ID: ${articleId}`);
    
    const articles = {
      'when-modern-becomes-retro': article1,
      'forgotten-format': article2,
      'problems-of-2010': article3,
    };

    const selectedArticle = articles[articleId];
    if (selectedArticle) {
      // Replace multiple placeholders with corresponding image tags
      let updatedContent = selectedArticle.content
        .replace(
          '{{fluffychompImage}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
            <img class='decklist-image' src='${fluffychompImg}' alt='FluffyChomp Deck Image' />
          </a><br>`
        )
        .replace(
          '{{tinasetImage}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${tinaimg}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{pookahooh}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${pookahoohimg}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{pokemoncatcher}}',
          `<img class='article-pokemon-card-med' src='${pokecatcher}' alt='article Image' />`
        )
        .replace(
          '{{darkraiHydreigonImg}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${darkraiHydreigon}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{empogor}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${empogor}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{hoohex}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${hoohex}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{tornadusterrak}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${tornadusterrak}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{terrakionmewtwodar}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${terrakionmewtwodar}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{rayeels}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${rayeels}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{sixprizesscreenshot}}',
          `<a href='https://alexwilsonnc.github.io/ptcg-legends-legacy/decks-by-era/2012/bw-drx' target='_blank'>
          <img class='decklist-image' src='${sixprizesscreensho}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{sshEvsBanner}}',
          `
          <img class='decklist-image' src='${sshEvsBanner}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{sshBrsBanner}}',
          `
          <img class='decklist-image' src='${sshBrsBanner}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{swlorBanner}}',
          `
          <img class='decklist-image' src='${swlorBanner}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{btspalBanner}}',
          `
          <img class='decklist-image' src='${btspalBanner}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{btspafBanner}}',
          `
          <img class='decklist-image' src='${btspafBanner}' alt='article Image' /></a>
          <br>`
        )
        .replace(
          '{{melbourne22Image}}',
          `
          <img class='decklist-image' src='${melbourne22Image}' alt='article Image' /></a>
          <br>`
        )
        ;

      setArticle({ ...selectedArticle, content: updatedContent });
    }
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
        <div className='articles-toggle-top'>
          <a href='/'>Home</a>&nbsp;/&nbsp;<a href='/articles/all'>Articles</a>&nbsp;/&nbsp;<a style={{color:'#1290eb'}}>...</a>
        </div>
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
