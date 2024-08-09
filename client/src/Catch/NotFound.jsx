import React from 'react';
import '../css/NotFound.css';
import feraligartrr from '../assets/article-thumbnails/ferr.png'

const NotFound = () => {
  return (
    <div className="notfoundtxt">
      <p>This page doesn't seem to exist...</p>
      <img src={feraligartrr} alt='feraligatr' />
    </div>
  );
};

export default NotFound;
