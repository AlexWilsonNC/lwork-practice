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

const Navbar = () => {
  return (
    <Nav>
      <div className="nav">
        <a className='left-nav' href="/">
          <img src='' className="nav-logo" alt="logo" />
          <h1>PTCG <span className='legends-font'>Legends</span></h1>
        </a>
      </div>
      <Burger />
    </Nav>
  )
}

export default Navbar