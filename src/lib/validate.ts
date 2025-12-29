export type PasteInput = {
  content: unknown;
  ttl_seconds?: unknown;
  max_views?: unknown;
};

export function validatePasteInput(body: PasteInput) {
  if (typeof body.content !== 'string' || body.content.trim() === '') {
    return 'content must be a non-empty string';
  }

  if (body.ttl_seconds !== undefined) {
    if (
      typeof body.ttl_seconds !== 'number' ||
      !Number.isInteger(body.ttl_seconds) ||
      body.ttl_seconds < 1
    ) {
      return 'ttl_seconds must be an integer >= 1';
    }
  }

  if (body.max_views !== undefined) {
    if (
      typeof body.max_views !== 'number' ||
      !Number.isInteger(body.max_views) ||
      body.max_views < 1
    ) {
      return 'max_views must be an integer >= 1';
    }
  }

  return null;
}
