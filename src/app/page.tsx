'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createPaste() {
    setError(null);
    setResult(null);

    const body: any = { content };

    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    const res = await fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Error creating paste');
      return;
    }

    setResult(data.url);
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows={8}
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Enter your paste..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={e => setTtl(e.target.value)}
        />{' '}
        <input
          placeholder="Max views"
          value={maxViews}
          onChange={e => setMaxViews(e.target.value)}
        />
      </div>

      <button onClick={createPaste}>Create Paste</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <p>
          Share URL:{' '}
          <a href={result} target="_blank">
            {result}
          </a>
        </p>
      )}
    </main>
  );
}
