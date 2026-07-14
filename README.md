# m.o.d.u.l. - Fundus-Schema

Dieses Dokument definiert den Aufbau des gemeinsamen Materialfundus.
Jeder Datensatz (`item`) ist eine nummerierte Einheit mit optionalen Feldern je nach verfügbarem Material.
Die Module greifen auf die Felder zu, die sie benötigen; nicht jedes Item muss alle Felder haben.

---

## Feldübersicht

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | string | ja | eindeutige ID, z.B. `DS001` |
| `thema` | string | ja | Oberthema (z.B. "Klimawandel", "Migration", "KI") |
| `typ` | list | ja | Welche Felder vorhanden sind; Werte: `bild`, `ueberschrift`, `einleitung`, `artikel`, `meme`, `claim`, `video` |
| `echtheit` | enum | ja | `echt` / `ki-generiert` / `manipuliert` / `fake` |
| `freigabe` | bool | ja | Darf das Item mit Jugendlichen verwendet werden? |
| `achsen` | list | nein | Empfohlene Skalen-Achsen für "Checkst du?" (nur Name, kein Wert) |
| `quelle.name` | string | nein | Name der Quelle (z.B. "taz", "Bild", "AFP") |
| `quelle.url` | string | nein | URL zum Originalartikel |
| `quelle.datum` | date | nein | Erscheinungsdatum (ISO: YYYY-MM-DD) |
| `quelle.lizenz` | string | nein | z.B. "CC BY 4.0", "Pressebild", "Screenshot" |
| `kontext` | string | nein | Kurze Beschreibung des Inhalts / Hintergrunds (für Fachkraft) |
| `bild.datei` | string | nein | Dateiname im Fundus-Ordner, z.B. `DS001_titelbild.jpg` |
| `bild.beschreibung` | string | nein | Alt-Text / kurze Bildbeschreibung |
| `ueberschrift.text` | string | nein | Die echte Überschrift |
| `einleitung.text` | string | nein | Der echte Einleitungsabsatz |
| `artikel.text` | string | nein | Volltext oder Zusammenfassung des echten Artikels |
| `meme.datei` | string | nein | Dateiname des Meme-Bildes |
| `meme.ursprung` | string | nein | Wo das Meme zuerst auftauchte / Verbreitungskontext |
| `claim.text` | string | nein | Zu prüfende Aussage (für Source Hunter) |
| `claim.bewertung` | string | nein | Faktencheckergebnis + Quelle |

---

## Achsen (für "Checkst du?")

Nur Empfehlung welche Achsen zu diesem Item passen; Werte kommen ausschließlich aus dem Spiel.

Vordefinierte Achsen:

- `echt-fake` - Wie echt wirkt das Material?
- `harmlos-gefaehrlich` - Wie gefährlich ist die Fehlinformation?
- `meinung-fakt` - Handelt es sich um eine Meinung oder einen Fakt?
- `lokal-global` - Wie weit trägt das Thema?
- `alt-aktuell` - Wie zeitgebunden ist das Material?

---

## Beispieldaten

```yaml
- id: fundus001
  thema: Klimawandel
  typ: [bild, ueberschrift, einleitung, artikel]
  echtheit: echt
  freigabe: true
  achsen: [echt-fake, meinung-fakt]
  quelle:
    name: taz
    url: https://taz.de/beispielartikel
    datum: 2025-03-12
    lizenz: Pressebild
  kontext: >
    Luftaufnahme des Hambacher Forstes während einer Demonstration.
    Neutrales Bild, gut erkennbarer Kontext; geeignet als Einstieg.
  bild:
    datei: fundus001_titelbild.jpg
    beschreibung: Luftaufnahme eines Waldstücks mit Menschenmenge auf einer Lichtung
  ueberschrift:
    text: "Tausende demonstrieren im Hambacher Forst"
  einleitung:
    text: >
      Am Samstag versammelten sich rund 5.000 Menschen im Hambacher Forst,
      um gegen die geplante Rodung zu protestieren. Aktivist*innen und
      Anwohner*innen blockierten gemeinsam Zufahrtswege.
  artikel:
    text: >
      [Volltext oder Zusammenfassung des Originalartikels]

- id: fundus002
  thema: Migration
  typ: [bild, ueberschrift]
  echtheit: manipuliert
  freigabe: true
  achsen: [echt-fake, harmlos-gefaehrlich]
  quelle:
    name: unbekannt (Social Media)
    url: ~
    datum: 2024-11-03
    lizenz: Screenshot
  kontext: >
    Bild aus einem anderen Kontext (Konzert 2019), das 2024 als
    "Flüchtlingslager an der deutschen Grenze" viral ging.
    Geeignet für fortgeschrittene Gruppen; Thema ist aufgeladen.
  bild:
    datei: fundus002_titelbild.jpg
    beschreibung: Menschenmenge auf einem Feld bei Nacht
  ueberschrift:
    text: "Massenandrang an der Grenze - Behörden überfordert"

- id: fundus003
  thema: Gesundheit
  typ: [claim]
  echtheit: fake
  freigabe: true
  achsen: [meinung-fakt, harmlos-gefaehrlich]
  quelle:
    name: Telegram-Kanal (anonym)
    url: ~
    datum: 2024-08-17
    lizenz: Screenshot
  kontext: >
    Verbreitete Falschbehauptung über Impfstoffe; gut belegbar über
    RKI und WHO; geeignet für Recherche-Übungen mit Zeitlimit.
  claim:
    text: "mRNA-Impfstoffe verändern dauerhaft die menschliche DNA."
    bewertung: >
      Falsch. mRNA wird im Zellplasma abgebaut und erreicht den Zellkern
      nicht. Quelle: RKI FAQ, WHO Q&A (Stand 2024).

- id: fundus004
  thema: Politik
  typ: [meme]
  echtheit: ki-generiert
  freigabe: true
  achsen: [echt-fake, harmlos-gefaehrlich]
  quelle:
    name: eigene Erstellung (KI-Tool)
    url: ~
    datum: 2025-01-20
    lizenz: eigene Erstellung
  kontext: >
    KI-generiertes Meme mit fiktivem Zitat einer Politikerin.
    Gut erkennbar als Fake für geübte Augen; für Ersteinsteiger
    überzeugend. Geeignet für Deepfake-Sensibilisierung.
  meme:
    datei: fundus004_meme.jpg
    ursprung: >
      Erstellt mit [Tool] für Schulungszwecke; nie öffentlich verbreitet.
```

---

## Dateistruktur (Vorschlag)

```
fundus/
├── fundus.yaml          <- diese Datei (alle Metadaten)
├── bilder/
│   ├── fundus001_titelbild.jpg
│   ├── fundus002_titelbild.jpg
│   └── fundus004_meme.jpg
└── texte/
    ├── fundus001_artikel.txt
    └── fundus003_claim.txt
```

---

## Typ-Feldmatrix

Welches `typ`-Feld ermöglicht welche Module:

| typ-Wert | ermöglicht |
|---|---|
| `bild` | Deutungshoheit, Bild ohne Titel, Titel ohne Bild (Auflösung), Checkst du? |
| `ueberschrift` | Bild ohne Titel (Auflösung), Titel ohne Bild, Newsflash |
| `einleitung` | Newsflash |
| `artikel` | Newsflash (Auflösung) |
| `meme` | Memix, Checkst du? |
| `claim` | Source Hunter, Checkst du? |
| `video` | Checkst du?, Deutungshoheit |


