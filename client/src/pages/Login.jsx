import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import lugiaLogin from '../assets/homepage/lugia-login.png';
import styled from 'styled-components';

const LoginPage = styled.div`
    background-color: ${({ theme }) => theme.loginbg};
    .login-box {
        background: ${({ theme }) => theme.loginBoxbg};
        color: ${({ theme }) => theme.text};
    }
    .artwork-credit {
        background-color: ${({ theme }) => theme.loginbg};
    }
    .login-box input {
        background-color: ${({ theme }) => theme.loginInput};
        border: ${({ theme }) => theme.loginINPUTbORDER};
        color: ${({ theme }) => theme.text};
    }
`;

export default function Login() {
  const { login, signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isNew) await signup(email, password);
      else await login(email, password);
      nav('/account');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LoginPage className='whole-login-page'>
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <h2>{isNew ? <>Let's Create your<br/><span style={{color:'#1290eb'}}>Legendary</span> Account!</> : <>Welcome <span style={{color:'#1290eb'}}>Legend</span>,<br/>Login to your Account.</>}</h2>
                    <br/>
                    <form onSubmit={handleSubmit}>
                        {error && <p className="error">{error}</p>}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e=>setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                            required
                        />
                        <br/>
                        <button type="submit" className='login-btn-on-page'>{isNew ? 'Sign Up' : 'Log In'}</button>
                    </form>
                    <p className='already-have-account-question'>
                        {isNew ? 'Already have an account? ' : "Don't have one yet? "}
                        <button onClick={()=>{setIsNew(!isNew); setError('')}} className='create-acct-btn'>
                            {isNew ? 'sign in' : 'create account'}
                        </button>
                    </p>
                </div>
                <div className="login-image">
                    <img src={lugiaLogin} alt="login-background" />
                </div>
            </div>
        </div>
        <a className='artwork-credit' href='https://x.com/twinngo1' target='_blank'>artwork by: @twinngo1</a>
    </LoginPage>
  );
}
