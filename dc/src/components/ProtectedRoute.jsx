import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading'); // loading | authed | guest

  useEffect(() => {
    api('/auth/me')
      .then((data) => setStatus(data?.user ? 'authed' : 'guest'))
      .catch(() => setStatus('guest'));
  }, []);

  if (status === 'loading') return <div className="container">Checking session…</div>;
  if (status === 'guest') return <Navigate to="/login" replace />;
  return children;
}