export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // Verifica se o formato é YYYY/MM/DD ou YYYY-MM-DD
  const matchParts = dateStr.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (matchParts) {
    return `${matchParts[3]}/${matchParts[2]}/${matchParts[1]}`;
  }
  
  return dateStr;
}
