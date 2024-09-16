// Modal.js
import React from 'react';

const Modal = ({ show, handleClose, handleConfirm, externalLink }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Leaving PTCG Legends</h2>
        <br></br>
        <p>You are about to go to a snapshot of the old site. (While we continue to work on an improved version of 'Decks by Era', we've made the old site's page accessible - javascript logic doesn't work there and the font is different.)
            <br></br>
            <br></br>
           (To get back, click on the PTCG Legends logo at the top of the page to return to this site.)
        </p>
        <br></br>
        <button className='interstitial-btn' onClick={handleConfirm}>Continue</button>
        <button className='interstitial-btn' onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
