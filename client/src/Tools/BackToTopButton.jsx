import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 12px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 1000;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showButton && window.pageYOffset > 300) {
        setShowButton(true);
      } else if (showButton && window.pageYOffset <= 300) {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);

    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showButton]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <Button onClick={scrollToTop} show={showButton}><span className="material-symbols-outlined">arrow_upward</span></Button>;
};

export default BackToTopButton;
