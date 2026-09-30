# Architektur-Dokument: Tilty App (`docs/architecture.md`)

Dieses Dokument beschreibt die technische Grundstruktur, die UI-Komponenten, die Navigation, das Datenmodell sowie das State-Management für die **Tilty** Mobile App[cite: 1].

## 1. Wiederverwendbare UI-Komponenten
* **Header / Top Bar**: Enthält das Shop-Icon[cite: 2], die visuelle Anzeige der verbleibenden Leben (Herzen)[cite: 1, 2] sowie Navigations- und Zurück-Buttons[cite: 2].
* **Level-Button & Karten**: Wiederverwendbare Schaltflächen für die Level-Auswahl (z. B. Lvl 1, Lvl 2, Lvl 3) mit integrierter Statusanzeige[cite: 2].
* **Spiel-Canvas / Labyrinth-View**: Die zentrale grafische Render-Fläche für das Labyrinth, die Kollisionsabfrage und die Bewegung der Kugel[cite: 1].
* **Modal / Overlay**: Pop-up-Overlays für den Gewinn-Bildschirm (mit Konfetti-Effekt)[cite: 2] sowie Kauf-Dialoge für den In-App-Shop[cite: 1].

## 2. Navigation & Hierarchie
* **Primäres Schema**: Ein kombiniertes **Stack-Navigationsmuster** für den reibungslosen Übergang zwischen Menüs und Game-Screens[cite: 2].
* **Navigationshierarchie**:
  * `HomeScreen` (Hauptmenü mit Start-Button, Leben-Anzeige und Shop-Zugang)[cite: 2].
  * ➔ `LevelSelectScreen` (Übersicht aller verfügbaren Level)[cite: 2].
  * ➔ `GameScreen` (Aktives Gameplay mit Sensorsteuerung)[cite: 1].
  * ➔ `WinScreen` (Erfolgsanzeige bei gelöstem Labyrinth)[cite: 2].
  * ➔ `ShopScreen` (Kaufoptionen für zusätzliche Leben und Power-Ups)[cite: 1].

## 3. Datenmodell
* **Player / User State**: `{ id: string, lives: number, unlockedLevel: number, coins: number }`[cite: 1] zur Verwaltung des Spielerfortschritts.
* **Level Object**: `{ id: number, title: string, isUnlocked: boolean, highscore: number, mazeLayout: object }`[cite: 1] für die Level-Konfigurationen.
* **Product Object**: `{ id: string, type: 'LIVES' | 'LEVEL_PACK' | 'POWERUP', price: number }`[cite: 1] für den In-App-Store.

## 4. Zustand & Side-Effekte
* **Lokaler Screen-Zustand**: Koordinaten der Kugel ($x, y$), aktuelle Neigungsgeschwindigkeit, Timer und Partikeleffekte auf dem `GameScreen`[cite: 1].
* **Globaler Store (Context / Global State)**: Zentraler Store für verbleibende Leben (Herzen), freigeschaltete Level und Guthaben[cite: 1, 2].
* **Side-Effekte & Storage**: 
  * Abfrage der Hardware-Sensoren (Accelerometer und Gyroskop) für die präzise Bewegungssteuerung[cite: 1].