import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import StarRating from '../components/StarRating';

export default function UserPage() {
  const { id } = useParams();
  const [meta, setMeta] = useState({ avgRating: 0, count: 0, page: 1, pages: 1 });
  const [reviews, setReviews] = useState([]);
  const [mine, setMine] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (page = 1) => {
    setLoading(true); setError('');
    try {
      const r = await api(`/feedback/received/${id}?page=${page}&limit=10`);
      setReviews(r.reviews); setMeta(r.meta);
      const m = await api(`/feedback/mine/${id}`);
      setMine(m.feedback); setRating(m.feedback?.rating || 0); setComment(m.feedback?.comment || '');
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(1); /* eslint-disable-next-line */ }, [id]);

  const submit = async (e) => {
    e.preventDefault(); if (!rating) return setError('Please select a rating');
    setSaving(true); setError('');
    try {
      await api('/feedback', { method: 'POST', body: { revieweeId: id, rating, comment } });
      await load(meta.page);
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="container">
      <h2>User</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="row" style={{ gap: 12 }}>
              <StarRating value={meta.avgRating} readOnly />
              <span>Avg: <b>{meta.avgRating}</b> ({meta.count} reviews)</span>
            </div>
          </div>

          <form onSubmit={submit} style={{ marginBottom: 18 }}>
            <label className="subtitle">Your review</label>
            <div style={{ marginBottom: 8 }}>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <textarea className="input" rows={3} placeholder="Say something helpful…"
              value={comment} onChange={(e)=>setComment(e.target.value)} />
            <button className="btn" disabled={saving}>{saving ? 'Saving…' : mine ? 'Update review' : 'Post review'}</button>
            <div className="error">{error}</div>
          </form>

          <h3 style={{ margin: '12px 0' }}>Recent reviews</h3>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {reviews.map((r) => (
              <li key={r._id} style={{ padding: '12px 0', borderTop: '1px solid #e5e7eb' }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.reviewer?.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <StarRating value={r.rating} readOnly />
                </div>
                {r.comment && <div style={{ marginTop: 6 }}>{r.comment}</div>}
              </li>
            ))}
          </ul>

          {meta.pages > 1 && (
            <div className="row" style={{ marginTop: 12, justifyContent: 'space-between' }}>
              <button className="btn btn-outline" disabled={meta.page <= 1} onClick={()=>load(meta.page - 1)}>Prev</button>
              <div className="helper">Page {meta.page} of {meta.pages}</div>
              <button className="btn btn-outline" disabled={meta.page >= meta.pages} onClick={()=>load(meta.page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}