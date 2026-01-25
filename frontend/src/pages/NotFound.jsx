export function NotFound() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>404 — Nie znaleziono strony</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          Ta ścieżka nie istnieje. Sprawdź adres lub wróć na stronę główną.
        </p>
        <a href="/" style={{ color: '#2563EB' }}>Wróć na start</a>
      </div>
    </div>
  );
}
