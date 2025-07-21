import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, signup } = useContext(AuthContext);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNew]       = useState(false);
  const [error, setError]       = useState('');
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isNew) await signup(email, password);
      else       await login(email, password);
      nav('/account');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <h2>{isNew ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)} required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)} required
        />
        <button type="submit">{isNew ? 'Sign Up' : 'Log In'}</button>
      </form>
      <p>
        {isNew
          ? 'Already have an account?'
          : "Don't have one yet?"
        }
        <button onClick={()=>{setIsNew(!isNew); setError('')}}>
          {isNew ? 'Log In' : 'Create one'}
        </button>
      </p>
      {/* TODO: add “Forgot password?” link */}
    </div>
  );
}
