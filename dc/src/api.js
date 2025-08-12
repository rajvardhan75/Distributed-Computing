// Use CRA proxy in dev (package.json -> proxy) so BASE can be empty.
// For production, set REACT_APP_API_BASE_URL, e.g. https://yourdomain.com/api
const BASE = "http://localhost:8000/api";

export async function api(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    credentials: 'include', // send cookies
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}