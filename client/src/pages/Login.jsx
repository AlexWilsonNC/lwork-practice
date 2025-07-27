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
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();
    const [forgotMsg, setForgotMsg] = useState('');
    const [forgotError, setForgotError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (isNew) {
                await signup(identifier /* here identifier is email for signup */, password, username);
            } else {
                await login(identifier, password);
            }
            nav('/account');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleForgot = async () => {
        setForgotMsg('');
        setForgotError('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier })
            });
            const data = await res.json();
            if (res.ok) setForgotMsg(data.message);
            else setForgotError(data.error);
        } catch (err) {
            setForgotError('Network error');
        }
    };

    return (
        <LoginPage className='whole-login-page'>
            <div className="login-page">
                <div className="login-container">
                    <div className="login-box">
                        <h2>{isNew ? <>Let's Create your<br /><span style={{ color: '#1290eb' }}>Legendary</span> Account!</> : <>Welcome <span style={{ color: '#1290eb' }}>Legend</span>,<br />Login to your Account.</>}</h2>
                        <br />
                        <form onSubmit={handleSubmit}>
                            {error && <p className="error">{error}</p>}
                            {isNew && (
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            )}
                            <input
                                type="text"
                                placeholder={isNew ? 'Email' : 'Username or Email'}
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <br />
                            <button type="submit" className='login-btn-on-page'>{isNew ? 'Sign Up' : 'Log In'}</button>
                        </form>
                        <p className='already-have-account-question'>
                            {isNew ? 'Already have an account? ' : "Don't have one yet? "}
                            <button onClick={() => { setIsNew(!isNew); setError('') }} className='create-acct-btn'>
                                {isNew ? 'sign in' : 'create account'}
                            </button>
                        </p>
                        {!isNew && (
                            <>
                                <div style={{ textAlign: 'left', margin: '0.5em 0' }}>
                                    <button
                                        type="button"
                                        className="forgot-btn"
                                        onClick={handleForgot}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                {forgotMsg && <p className="info">{forgotMsg}</p>}
                                {forgotError && <p className="error">{forgotError}</p>}
                            </>
                        )}
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
