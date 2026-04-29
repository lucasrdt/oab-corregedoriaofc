export function generateBaseSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export function getCompanySlug(company: { id: number; name: string }, allCompanies: { id: number; name: string }[]): string {
  const baseSlug = generateBaseSlug(company.name);
  
  // Find all companies with the exact same base slug
  const companiesWithSameBaseSlug = allCompanies.filter(c => generateBaseSlug(c.name) === baseSlug);
  
  // If there's only one, or this company is the first one (by ID) in the list of identical names
  if (companiesWithSameBaseSlug.length <= 1) {
    return baseSlug;
  }
  
  // Sort identical companies by ID to ensure deterministic numbering
  const sortedCompanies = [...companiesWithSameBaseSlug].sort((a, b) => a.id - b.id);
  
  // Find the index of the current company
  const index = sortedCompanies.findIndex(c => c.id === company.id);
  
  if (index === 0) {
    return baseSlug;
  }
  
  return `${baseSlug}-${index + 1}`;
}
