export function encodeUserId(userId: number): string {
  const base64 = Buffer.from(userId.toString()).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}