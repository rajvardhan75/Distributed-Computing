import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function People() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setUsers([]); }, []);

  const search = async (e) => {
    e?.preventDefault();
    if (!q.trim()) return setUsers([]);
    setLoading(true);
    try {
      const { users } = await api(`/users/search?q=${encodeURIComponent(q.trim())}`);
      setUsers(users);
    } catch (e) {
      setUsers([]);
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h2>Find people</h2>
      <form onSubmit={search} className="row" style={{ gap: 8, marginBottom: 12 }}>
        <input className="input" placeholder="Search by name or email" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn" style={{ width: 140 }}>Search</button>
      </form>
      {loading && <p>Searching…</p>}
      {!loading && users.length === 0 && q && <p>No matches.</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {users.map(u => (
          <li key={u._id} style={{ padding: '10px 0', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ color: '#64748b' }}>{u.email}</div>
              </div>
              <Link className="link" to={`/user/${u._id}`}>View & Review →</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}