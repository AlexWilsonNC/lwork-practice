import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile');

  const handleLogout = () => {
    logout()             // clear tokens, user state, etc.
    navigate('/', { replace: true })
  }

  return (
    <div className="account-page">
      <h2>My Account</h2>
      <nav className="account-tabs">
        <button onClick={()=>setTab('profile')} className={tab==='profile'?'active':''}>
          Profile
        </button>
        <button onClick={()=>setTab('decks')} className={tab==='decks'?'active':''}>
          My Retro Decks
        </button>
      </nav>
      {tab === 'profile' ? (
        <section>
          <p><strong>Email:</strong> {user.email}</p>
          {/* TODO: real‑name input, change password form */}
          <button onClick={handleLogout}>Logout</button>
        </section>
      ) : (
        <section>
          {/* TODO: fetch & render /api/saved‑decks for this user */}
          <p>Your saved decks will appear here.</p>
        </section>
      )}
    </div>
  );
}
