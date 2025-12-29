export function getNow(req: Request): Date {
  if (process.env.TEST_MODE === '1') {
    const header = req.headers.get('x-test-now-ms');
    if (header) {
      const ms = Number(header);
      if (!Number.isNaN(ms)) {
        return new Date(ms);
      }
    }
  }
  return new Date();
}
