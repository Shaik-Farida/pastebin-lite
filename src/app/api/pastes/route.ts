import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { sql } from '@/lib/db';
import { validatePasteInput } from '@/lib/validate';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const error = validatePasteInput(body);
  if (error) {
    return NextResponse.json(
      { error },
      { status: 400 }
    );
  }

  const id = nanoid(10);

  let expiresAt: Date | null = null;
  if (body.ttl_seconds) {
    expiresAt = new Date(Date.now() + body.ttl_seconds * 1000);
  }

  await sql`
    INSERT INTO pastes (id, content, expires_at, max_views)
    VALUES (${id}, ${body.content}, ${expiresAt}, ${body.max_views ?? null})
  `;

  const origin = new URL(req.url).origin;

  return NextResponse.json(
    {
      id,
      url: `${origin}/p/${id}`
    },
    { status: 201 }
  );
}
