import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/auth/me')
      .then((data) => setMe(data.user))
      .catch((err) => setError(err.message));
  }, []);

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {me ? (
        <>
          <p>Signed in as: <b>{me.name}</b> ({me.email})</p>
          <pre style={{ background: '#f3f4f6', padding: 12, borderRadius: 8 }}>{JSON.stringify(me, null, 2)}</pre>
          <button className="btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading…</p>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}