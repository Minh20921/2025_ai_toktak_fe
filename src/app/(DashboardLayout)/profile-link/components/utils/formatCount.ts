export function formatCount(count?: number): string {
  if (!count) return '0';
  if (count > 9999) {
    return '9999+';
  }
  return count.toString();
}
