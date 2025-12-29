import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getNow } from '@/lib/time';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const now = getNow(req);

  try {
    const result = await sql`
      UPDATE pastes
      SET view_count = view_count + 1
      WHERE id = ${params.id}
        AND (expires_at IS NULL OR expires_at > ${now})
        AND (max_views IS NULL OR view_count < max_views)
      RETURNING content, expires_at, max_views, view_count
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'not_found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    let remainingViews: number | null = null;
    if (row.max_views !== null) {
      remainingViews = Math.max(
        row.max_views - row.view_count,
        0
      );
    }

    return NextResponse.json({
      content: row.content,
      remaining_views: remainingViews,
      expires_at: row.expires_at
        ? new Date(row.expires_at).toISOString()
        : null
    });
  } catch {
    return NextResponse.json(
      { error: 'not_found' },
      { status: 404 }
    );
  }
}
