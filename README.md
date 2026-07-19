# Run Scotland – Meine Events 🏴🏃

Persönliche Übersicht von Laufevents in Schottland (Start: Cupar, Fife), mit
Campingplatz-Infos für Übernachtung im Van, Fahrzeit ab Cupar, Filtern,
Favoriten (⭐) und Karte. Läuft auf Desktop und Handy.

- **Daten:** Supabase (Tabelle `events`) — Favoriten synchronisieren automatisch zwischen allen Geräten.
- **Karte:** Leaflet + OpenStreetMap (kein API-Key nötig).
- **Routen:** „Route"-Buttons öffnen Google Maps.
- **Kein Backend nötig** — reine statische Seite (`index.html`).

## Auf Vercel veröffentlichen (via GitHub)

1. Neues **GitHub-Repo** anlegen (z.B. `run-scotland`), öffentlich oder privat.
2. Diese Dateien hochladen (`index.html` + `README.md`) — entweder per
   „Add file → Upload files" auf github.com (index.html reinziehen), oder per git:
   ```
   git init
   git add .
   git commit -m "Run Scotland event app"
   git branch -M main
   git remote add origin https://github.com/DEIN-NAME/run-scotland.git
   git push -u origin main
   ```
3. Auf **vercel.com** → „Add New… → Project" → das Repo importieren.
4. Ohne weitere Einstellungen auf **Deploy** klicken (Framework: „Other", es ist eine statische Seite).
5. Fertig — du bekommst eine URL wie `https://run-scotland.vercel.app`.
   Am Handy: Seite öffnen → „Zum Home-Bildschirm hinzufügen".

Updates: einfach neue `index.html` ins Repo pushen → Vercel deployt automatisch.

## Hinweis zum Schlüssel
Der Supabase-Schlüssel in `index.html` ist der öffentliche **anon**-Key. Seine
Rechte sind bewusst eng: **nur Events lesen und das Favoriten-Feld umschalten** —
sonst nichts. Das ist bei Supabase so vorgesehen und sicher.
