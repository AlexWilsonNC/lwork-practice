import React from 'react';
import '../css/Spinner.css';
import ubImg from '../assets/logos/blue-ultra-ball.png';

export default function Spinner() {
  return (
    <div className="ultra-ball-spinner">
      <img src={ubImg} alt="Loading…" />
    </div>
  );
}