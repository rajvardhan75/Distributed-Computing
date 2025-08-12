import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api('/auth/login', { method: 'POST', body: { email, password } });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Welcome back</h2>
      <form onSubmit={onSubmit}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="btn" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
        <div className="row" style={{ marginTop: 8 }}>
          <span>New here?</span>
          <Link to="/register">Create an account</Link>
        </div>
        <div className="error">{error}</div>
      </form>
    </div>
  );
}