import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import RightNav from './RightNav';
import '../css/nav.css';

const StyledBurger = styled.div`
  width: 2rem;
  height: 2rem;
  position: ${({ open }) => open ? 'fixed' : 'relative'};
  right: 30px;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  flex-flow: column nowrap;

  .burger-line {
    background-color: ${({ theme, open }) => open ? theme.lightBurgerColor : theme.darkBurgerColor};

    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      transform: ${({ open }) => open ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${({ open }) => open ? 0 : 1};
    }

    &:nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const Burger = ({ darkMode }) => {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event) => {
    if (
      burgerRef.current && !burgerRef.current.contains(event.target) &&
      navRef.current && !navRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='push-right-nav-together'>
      <RightNav open={open} setOpen={setOpen} dark={darkMode} ref={navRef} />
      <StyledBurger ref={burgerRef} open={open} dark={darkMode} onClick={toggleMenu} className='burger'>
        <div className='burger-line' />
        <div className='burger-line' />
        <div className='burger-line' />
      </StyledBurger>
    </div>
  );
}

export default Burger