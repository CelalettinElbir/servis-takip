import React, { useState } from 'react';
import API from '../api';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('auth/register/', form);
      alert('Kayıt başarılı!');
    } catch (err) {
      alert('Kayıt başarısız!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
