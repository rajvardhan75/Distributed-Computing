import { useEffect, useState } from 'react';
import { api } from '../api';
import StarRating from '../components/StarRating';

export default function MyReviews() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/feedback/given')
      .then((data) => setItems(data.reviews || []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container">
      <h2>My Reviews</h2>
      {error && <div className="error">{error}</div>}
      {items.length === 0 ? <p>You haven't written any reviews yet.</p> : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map(r => (
            <li key={r._id} style={{ padding: '12px 0', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.reviewee?.name}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{new Date(r.updatedAt).toLocaleString()}</div>
                </div>
                <StarRating value={r.rating} readOnly />
              </div>
              {r.comment && <div style={{ marginTop: 6 }}>{r.comment}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}