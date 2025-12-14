import React from 'react';
import styled from 'styled-components';
import Burger from './Burger';
import '../css/nav.css';

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-bottom: ${({ theme }) => theme.navBtmBorder};
    background: ${({ theme }) => theme.navBg};
    h1 {color: ${({ theme }) => theme.text};}
    a {color: ${({ theme }) => theme.text};}
`;

const isJune = new Date().getMonth() === 5; // june = month 5 in an array

const Navbar = () => {
  return (
    <Nav>
      <div className="nav">
        <a className='left-nav' href="/">
          <img src='' className="nav-logo" alt="logo" />
          <h1>
            PTCG{' '}
            {isJune ? (
              <span className="legends-font">
                <span className="r-red">L</span>
                <span className="r-orange">e</span>
                <span className="r-yellow">g</span>
                <span className="r-green">e</span>
                <span className="r-blue">n</span>
                <span className="r-indigo">d</span>
                <span className="r-violet">s</span>
              </span>
            ) : (
              <span className="legends-font">Legends</span>
            )}
          </h1>
        </a>
      </div>
      <Burger />
    </Nav>
  )
}

export default Navbar