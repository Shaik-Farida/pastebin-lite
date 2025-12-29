import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';

type Props = {
  params: { id: string };
};

export default async function PastePage({ params }: Props) {
  const result = await sql`
    SELECT content
    FROM pastes
    WHERE id = ${params.id}
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_views IS NULL OR view_count < max_views)
  `;

  if (result.rowCount === 0) {
    notFound();
  }

  const content = result.rows[0].content;

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: '#f4f4f4',
          padding: '1rem',
          borderRadius: '6px'
        }}
      >
        {content}
      </pre>
    </main>
  );
}
