// Modal.js
import React from 'react';

const Modal = ({ show, handleClose, handleConfirm, externalLink }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Leaving PTCG Legends</h2>
        <br></br>
        <p>You are about to go the original PTCG Legends site. (While we continue to work on an improved version of 'Decks by Era', we've made the old site's decks accessible.)
            <br></br>
            <br></br>
           (To come back to the new site, click on the PTCG Legends logo at the top of the page.)
        </p>
        <br></br>
        <button className='interstitial-btn continue-btn' onClick={handleConfirm}>Continue</button>
        <button className='interstitial-btn cancel-btn' onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
