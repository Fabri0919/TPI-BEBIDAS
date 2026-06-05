/**
 * Format integer centavos to ARS currency string
 * @param {number} centavos
 * @returns {string} e.g. "$1.250"
 */
export function formatARS(centavos) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(centavos / 100)
}

/**
 * Format ISO date string to local Argentine date
 * @param {string} isoString
 * @returns {string} e.g. "28/04/2026"
 */
export function formatDate(isoString) {
  return new Intl.DateTimeFormat('es-AR').format(new Date(isoString))
}
