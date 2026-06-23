export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppInquiry(watch) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const message = `Hello MANCRO Atelier, I would like to inquire about the ${watch.name} (${watch.caliber_id}). Reference URL: ${baseUrl}/collection/${watch.caliber_id}/${watch.slug}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppShare(watch) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const message = `Check out this incredible timepiece: ${watch.name} by MANCRO. Reference URL: ${baseUrl}/collection/${watch.caliber_id}/${watch.slug}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
