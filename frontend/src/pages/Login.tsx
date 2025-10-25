import React, { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, setToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('auth/login/', { username, password });
      setToken(res.data.access);
      login(res.data.access);
    } catch (err) {
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
