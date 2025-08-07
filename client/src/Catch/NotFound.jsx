import React from 'react';
import '../css/NotFound.css';
import feraligartrr from '../assets/article-thumbnails/ferr.png'
import styled from 'styled-components';

const NotFoundCon = styled.div`
    color: ${({ theme }) => theme.text};
`;

const NotFound = () => {
  return (
    <NotFoundCon className="notfoundtxt">
      <p>Uh oh! This page doesn't seem to exist...</p>
      <img src={feraligartrr} alt='feraligatr' />
    </NotFoundCon>
  );
};

export default NotFound;
