import React, { useState, useContext} from 'react';
import axios from 'axios';
import '../App.css';

import {useNavigate} from 'react-router-dom'

import {AuthContext} from '../helpers/AuthContext.js'

function TemplatePage(){

const navigate = useNavigate('/goals');

const {setAuthState} = useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const emptyAccount = {
  name: '',
  password: '',
  is_male: true,
  age: 22,
  weight: 170,
  height: 170,
};

const [mode, setMode] = useState('login');
  const [account, setAccount] = useState(emptyAccount);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const clearMessages = () => {
    setNotice('');
    setError('');
  };

  const submitAccount = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      const endpoint = mode === 'login' ? '/users/login' : '/users/register';
      const payload = mode === 'login'
        ? { name: account.name, password: account.password }
        : account;
        
      axios.post(`${API_URL}${endpoint}`, payload).then((response) => {
        setNotice(mode === 'login' ? 'Logged in successfully.' : 'Account created successfully.');

        if(mode==='login'){
          setAuthState({user_id: response.data.id, username: response.data.name});
          localStorage.setItem("fitness-user", JSON.stringify({user_id: response.data.id, username: response.data.name}));

          navigate('/goals');
        }
      })    
    } catch (err) {
      setError(err.response?.data?.error || 'Account request failed.');
    }
  };


    return <>
    <main className="app-shell">
      <section className="masthead">
        <div>
          <p className="eyebrow">CSE 412 Phase 03</p>
          <h1>Fitness Tracker</h1>
          <p className="subhead">Track nutrition goals, daily activity, and progress from a PostgreSQL database.</p>
        </div>
      </section>

      {notice && <p className="notice">{notice}</p>}
      {error && <p className="error">{error}</p>}

        <section className="auth-panel">
          <div className="mode-switch">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create Account</button>
          </div>

          <form onSubmit={submitAccount} className="form-grid">
            <label>
              Username
              <input value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} required />
            </label>
            <label>
              Password
              <input type="password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} required />
            </label>

            {mode === 'register' && (
              <>
                <label>
                  Sex
                  <select value={String(account.is_male)} onChange={(e) => setAccount({ ...account, is_male: e.target.value === 'true' })}>
                    <option value="true">Male</option>
                    <option value="false">Female</option>
                  </select>
                </label>
                <label>
                  Age
                  <input type="number" min="1" value={account.age} onChange={(e) => setAccount({ ...account, age: Number(e.target.value) })} required />
                </label>
                <label>
                  Weight
                  <input type="number" min="1" value={account.weight} onChange={(e) => setAccount({ ...account, weight: Number(e.target.value) })} required />
                </label>
                <label>
                  Height
                  <input type="number" min="1" value={account.height} onChange={(e) => setAccount({ ...account, height: Number(e.target.value) })} required />
                </label>
              </>
            )}

            <button className="primary-button" type="submit">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </section>
    </main>
    </>
};

export default TemplatePage;