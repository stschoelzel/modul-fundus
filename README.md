# m.o.d.u.l. - Fundus-Schema

Dieses Dokument definiert den Aufbau des gemeinsamen Materialfundus.Die Trennung erfolgt nach **Medientyp** (Ordner), nicht nach inhaltlicher Rolle; welche Rolle eine Datei innerhalb ihres Medientyps hat (`titelbild` vs. `meme`, `artikel` vs. `claim`), steht bereits im `bezeichner`-Teil des Dateinamens (siehe Dateinamen-Syntax oben). Ein Ordner pro Rolle wäre doppelt gemoppelt - bei kleinen Materialmengen macht das die Suche eher umständlicher als klarer.

Jeder Datensatz (`item`) ist eine nummerierte Einheit mit optionalen Feldern je nach verfügbarem Material.
Die Module greifen auf die Felder zu, die sie benötigen; nicht jedes Item muss alle Felder haben.

---

## Nutzung

Für alle, die den Fundus nur ansehen wollen:

1. Repo klonen (oder als ZIP herunterladen).
2. `index.html` per Doppelklick öffnen.

Fertig - kein Server, kein Node, kein npm nötig. `fundus-data.js` liegt bereits fertig gebaut im Repo und wird von `index.html` direkt eingebunden.

## Daten pflegen / lokale Entwicklung

Neues Item anlegen? `yaml-helper.html` (per Doppelklick öffnen, kein Server nötig) fragt die Felder per Formular ab, schlägt die nächste freie `id` vor und generiert daraus den fertigen YAML-Block samt Angabe, wo die Mediendatei abgelegt werden muss - manuelles Tippen in `fundus.yaml` bleibt trotzdem nötig, das Tool erzeugt nur den Block zum Einfügen.

Nur relevant, wenn du `fundus.yaml` oder die Export-Vorlagen in `export-templates/` bearbeitest (siehe [Export-Vorlagen](#export-vorlagen)):

- Ändern, committen, pushen (auf `main`) reicht. Eine GitHub Action baut `fundus-data.js` bzw. `export-templates-data.js` automatisch auf GitHubs Servern und committed sie zurück - lokal ist nichts zu installieren.
- Falls du vor dem Push schon lokal das Ergebnis sehen willst, ist das ein optionaler Zwischenschritt:
  ```
  cd build
  npm install
  npm run build:all
  ```
  Das schreibt `fundus-data.js` und `export-templates-data.js` im Repo-Root neu (einzeln auch per `npm run build` bzw. `npm run build:templates`). Kein Muss - die GitHub Action holt das nach dem Push ohnehin nach.

---

## Feldübersicht

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | string | ja | eindeutige ID, z.B. `fundus001` |
| `thema` | string | ja | Oberthema (z.B. "Klimawandel", "Migration", "KI") |
| `typ` | list | ja | Welche Felder vorhanden sind; Werte: `bild`, `ueberschrift`, `einleitung`, `artikel`, `meme`, `claim`, `video` |
| `echtheit` | enum | ja | `echt` / `ki-generiert` / `manipuliert` / `fake` |
| `freigabe` | bool | ja | Darf das Item mit Jugendlichen verwendet werden? |
| `status` | enum | ja | Herkunft/Stand des Items, siehe [Status](#status) |
| `achsen` | list | nein | Empfohlene Skalen-Achsen für "Checkst du?" (nur Slug, kein Wert) |
| `quelle.name` | string | nein | Name der Quelle (z.B. "taz", "Bild", "AFP") |
| `quelle.url` | string | nein | URL zum Originalartikel |
| `quelle.datum` | date | nein | Erscheinungsdatum (ISO: YYYY-MM-DD) |
| `quelle.lizenz` | string | nein | z.B. "CC BY 4.0", "Pressebild", "Screenshot" |
| `quelle2.name` | string | nein | Name einer zweiten Referenz (Faktencheck, Gegendarstellung, Hintergrundartikel) |
| `quelle2.url` | string | nein | URL zur zweiten Referenz |
| `kontext` | string | nein | Kurze Beschreibung des Inhalts / Hintergrunds (für Fachkraft) |
| `bild.datei` | string | nein | Dateiname im Fundus-Ordner, z.B. `DS001_titelbild.jpg`. Kann ein relativer Pfad im Fundus-Ordner ODER eine absolute URL sein, falls das Bild nur verlinkt werden darf. |
| `bild.beschreibung` | string | nein | Alt-Text / kurze Bildbeschreibung |
| `ueberschrift.text` | string | nein | Die echte Überschrift |
| `einleitung.text` | string | nein | Der echte Einleitungsabsatz |
| `artikel.text` | string | nein | Volltext oder Zusammenfassung des echten Artikels |
| `meme.datei` | string | nein | Dateiname des Meme-Bildes. Kann ein relativer Pfad im Fundus-Ordner ODER eine absolute URL sein, falls das Bild nur verlinkt werden darf. |
| `meme.ursprung` | string | nein | Wo das Meme zuerst auftauchte / Verbreitungskontext |
| `video.datei` | string | nein | Dateiname im Video-Ordner, z.B. `video/fundus063.mp4`. Kann ein relativer Pfad im Fundus-Ordner ODER eine absolute URL sein, falls das Video nur verlinkt werden darf. |
| `video.beschreibung` | string | nein | Kurze Beschreibung des Videoinhalts |
| `claim.text` | string | nein | Zu prüfende Aussage (für Source Hunter) |
| `claim.bewertung` | string | nein | Faktencheckergebnis + Quelle |
| `ki.model` | string | nein* | Verwendetes KI-Tool, z.B. `Midjourney v6`, `ChatGPT-4o`, `Sora` |
| `ki.prompt` | string | nein* | Der verwendete Prompt, falls bekannt/rekonstruierbar |


\* `ki.model`/`ki.prompt` sind generell optional, aber empfohlen (quasi-Pflicht), sobald `echtheit: ki-generiert` gesetzt ist.

---

## Status

Interner Wert, taucht **nicht** in der `index.html`-Übersicht auf (kein Tabellenfeld). Gibt an, woher ein Item stammt.

| Wert | Bedeutung |
|---|---|
| `deprecated` | nicht mehr relevant, z.B. Testdaten (aktuell `fundus001`-`fundus005`) - einziger Wert mit aktueller Auswirkung: Items damit werden in der Übersicht ausgeblendet |
| `methodensprint` | beim Setup/im Methodensprint angelegt - Default für alle neuen Items |
| `gmk` | von der GMK angelegt |
| `random` | der Rest |

`methodensprint`, `gmk` und `random` sind aktuell nur hinterlegt, ohne Effekt in der Anwendung - für spätere Auswertung/Filterung vorgesehen.

---

## Achsen (für "Checkst du?")

Nur Empfehlung welche Achsen zu diesem Item passen; Werte kommen ausschließlich aus dem Spiel.

Die Achsen sind Skalen mit zwei Polen. **Der zuerst genannte Pol steht links**, der zweite rechts.

Als Slug wird eine feste Kurzform notiert: kleingeschrieben, ohne Umlaute, mit Bindestrich. Nur diese Slugs gehören ins `achsen`-Feld - die ausgeschriebene Bezeichnung steht nur hier in der Tabelle.

Vordefinierte Achsen:

| Slug | linker Pol | rechter Pol | Gruppe |
|---|---|---|---|
| `echt-fake` | echt | fake | Echtheit & Herkunft |
| `echt-ki` | echt | KI | Echtheit & Herkunft |
| `bearbeitung` | unbearbeitet | stark bearbeitet | Echtheit & Herkunft |
| `informieren-manipulieren` | informieren | manipulieren | Absicht |
| `satire-ernst` | Satire | ernst gemeint | Absicht |
| `journalismus-werbung` | Journalismus | Werbung | Absicht |
| `sachlich-emotionalisierend` | sachlich | emotionalisierend | Wirkung |
| `nobait-clickbait` | No-bait | Clickbait | Wirkung |
| `harmlos-gefaehrlich` | harmlos | gefährlich | Wirkung |
| `aufklaerend-irrefuehrend` | aufklärend | irreführend | Wirkung |
| `kritisch-hetzerisch` | kritisch | hetzerisch | Wirkung |
| `wuerde-ich-sofort-teilen-wuerde-ich-nie-teilen` | würde ich sofort teilen | würde ich nie teilen | Handlungsebene |
| `glaube-ich-sofort-glaube-ich-nie` | glaub ich sofort | glaub ich nie | Handlungsebene |
| `quelle-vertrauen` | vertrauenswürdige Quelle | zweifelhafte Quelle | Quelle & Einordnung |
| `meinung-fakt` | Meinung | Fakt | Quelle & Einordnung |
| `lokal-global` | lokal | global | Quelle & Einordnung |
| `alt-aktuell` | alt | aktuell | Quelle & Einordnung |

`bearbeitung`, `kritisch-hetzerisch` und `alt-aktuell` sind vorgesehen, haben aber noch kein Material.

Ein Item kann mehrere Achsen tragen - je nach Modul und Gruppe ist eine andere davon die interessante.

---

### Was ist YAML, kurz erklärt

YAML ist ein Textformat für strukturierte Daten; nach der Idee: **Schlüssel: Wert**.

**Grundprinzip - Einrückung statt Klammern**

Es keine geschweiften Klammern; die Struktur ergibt sich rein aus der Einrückung (Leerzeichen, keine Tabs(!)). Was weiter eingerückt ist, gehört zum darüberliegenden Schlüssel:

```yaml
quelle:
  name: taz
  url: https://taz.de/beispielartikel
```

Hier ist `quelle` ein Objekt mit den Unterfeldern `name` und `url`.

**Listen: zwei Schreibweisen**

Beide Varianten sind gleichwertig, nur unterschiedlich kompakt:

```yaml
# mehrzeilig, mit Bindestrich pro Eintrag
typ:
  - bild
  - claim

# einzeilig, in eckigen Klammern
typ: [bild, claim]
```

In unserer fundus.yaml wird meist die kompakte `[...]`-Form für `typ` und `achsen` genutzt, weil das bei kurzen Listen übersichtlicher ist.

**Der ganze Datensatz ist selbst eine Liste**

Das führende `- id: fundus001` am Zeilenanfang bedeutet: jeder Datensatz ist ein Eintrag in einer Liste von Items. Deshalb beginnt jeder Block in fundus.yaml mit `- id: ...`.
Die Bezeichung der id ist tatsächlich egal, sie muss nur einzigartig sein.

**Mehrzeiliger Text: `>` und `|`**

Für längere Texte (`kontext`, `einleitung.text` usw.) reicht eine einzelne Zeile oft nicht. Zwei Varianten dafür:

- `>` (folded) - Zeilenumbrüche im Quelltext werden beim Einlesen zu Leerzeichen; es entsteht ein normaler Fließtext-Absatz. Das ist der Normalfall in unserer YAML.
- `|` (literal) - Zeilenumbrüche bleiben exakt erhalten, für Fälle wo Umbrüche wichtig sind (z.B. Gedichte, Code).

```yaml
kontext: >
  Luftaufnahme des Hambacher Forstes während einer Demonstration.
  Neutrales Bild, gut erkennbarer Kontext; geeignet als Einstieg.
```

wird beim Einlesen zu einem durchgehenden Satz, nicht zu zwei Zeilen.

**Sonstiges**

- `freigabe: true` - Wahrheitswerte ohne Anführungszeichen (`true`/`false`)
- `url: ~` - die Tilde steht für "kein Wert" (null)
- Anführungszeichen bei Text (`"Tausende demonstrieren..."`) sind nur nötig, wenn der Text Doppelpunkte, Sonderzeichen oder führende/folgende Leerzeichen enthält; sonst reicht Text ohne Anführungszeichen

---

## Beispieldaten

```yaml
- id: fundus001
  thema: Klimawandel
  typ: [bild, ueberschrift, einleitung, artikel]
  echtheit: echt
  freigabe: true
  status: deprecated
  achsen: [echt-fake, meinung-fakt, sachlich-emotionalisierend, quelle-vertrauen, informieren-manipulieren, journalismus-werbung]
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
  status: deprecated
  achsen: [echt-fake, harmlos-gefaehrlich, informieren-manipulieren, aufklaerend-irrefuehrend, quelle-vertrauen, nobait-clickbait, wuerde-ich-sofort-teilen-wuerde-ich-nie-teilen]
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
  status: deprecated
  achsen: [meinung-fakt, harmlos-gefaehrlich, glaube-ich-sofort-glaube-ich-nie, informieren-manipulieren, quelle-vertrauen, aufklaerend-irrefuehrend, wuerde-ich-sofort-teilen-wuerde-ich-nie-teilen]
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
  status: deprecated
  achsen: [echt-fake, harmlos-gefaehrlich, satire-ernst, wuerde-ich-sofort-teilen-wuerde-ich-nie-teilen, informieren-manipulieren]
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
  ki:
    model: Midjourney v6
    prompt: >
      photorealistic press photo of a german politician holding a sign with
      a fake quote, studio lighting, 35mm

- id: fundus005
  thema: Umweltverschmutzung
  typ: [ueberschrift, artikel]
  echtheit: echt
  freigabe: true
  status: deprecated
  achsen: [meinung-fakt, harmlos-gefaehrlich, nobait-clickbait, sachlich-emotionalisierend, quelle-vertrauen, aufklaerend-irrefuehrend]
  quelle:
    name: heute.de
    url: https://www.heute.de/beispiel/loeffelweise-plastik-im-hirn
    datum: 2024-09-05
    lizenz: Pressebild
  quelle2:
    name: Correctiv Faktencheck
    url: https://correctiv.org/faktencheck/beispiel-plastik-im-hirn
  kontext: >
    Meldung über Mikroplastik im menschlichen Gehirn, dazu ein Faktencheck,
    der die Studienlage einordnet. Gut geeignet, um zu zeigen, dass auch bei
    seriösen Quellen eine zweite Einordnung sinnvoll ist.
  ueberschrift:
    text: "Löffelweise - so viel Plastik haben wir schon im Hirn"
  artikel:
    text: >
      [Volltext oder Zusammenfassung des Originalartikels]
```

---

## Dateistruktur (Vorschlag)

```
fundus/
├── readme.md            <- diese Datei
├── fundus.yaml          <- alle Metadaten
├── index.html           <- die Übersicht
├── bilder/               <- alle Bilddateien (jpg, png): titelbild, meme
│   ├── fundus001_titelbild.jpg
│   ├── fundus002_titelbild.jpg
│   └── fundus004_meme.jpg
├── texte/                <- alle Textdateien (txt): artikel, claim
│   ├── fundus001_artikel.txt
│   └── fundus003_claim.txt
├── export-templates/
│   ├── indextkarte.html
│   └── ...
├── audio/                <- alle Audiodateien (mp3, wav), falls vorhanden
└── video/                <- alle Videodateien (mp4), falls vorhanden
```
Die Trennung erfolgt nach **Medientyp** (Ordner), nicht nach inhaltlicher Rolle; welche Rolle eine Datei innerhalb ihres Medientyps hat (`titelbild` vs. `meme`, `artikel` vs. `claim`), steht bereits 
im `bezeichner`-Teil des Dateinamens (siehe Dateinamen-Syntax oben). Ein Ordner pro Rolle wäre doppelt gemoppelt - bei kleinen Materialmengen macht das die Suche eher umständlicher als klarer.

---

### Dateinamen-Syntax

Alle Dateien in `bilder/` und `texte/` folgen dem Muster:

    <id>_<bezeichner>.<endung>

- **id** - die id des Datensatzes aus fundus.yaml, z.B. `fundus001`
- **bezeichner** - fester Begriff, der die Rolle der Datei beschreibt; entspricht jeweils dem Feld `<bezeichner>.datei` in der fundus.yaml:
  - `titelbild` -> `bild.datei`
  - `meme` -> `meme.datei`
  - `artikel` -> `artikel.datei` (falls Volltext ausgelagert statt inline in `artikel.text`)
  - `claim` -> `claim.datei` (falls Zusatzmaterial/Beleg vorhanden)
- **endung** - Dateityp, je nach Material:
  - Bilder: `jpg`, `png`
  - Texte: `txt`
  - Videos: `mp4`

Beispiele:

    fundus001_titelbild.jpg
    fundus003_claim.txt
    fundus004_meme.jpg

Der Dateiname taucht immer 1:1 im entsprechenden `<bezeichner>.datei`-Feld der fundus.yaml wieder auf; das Tool selbst löst keine Pfade automatisch auf.

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

---

## Export-Vorlagen

In `index.html` gibt es pro Item einen Export-Dialog (Klick auf die Zeile, dann "Export als..."). Oben zeigt er Vorlagen (aktuell zwei Test-Vorlagen "Indexkarte 1"/"Indexkarte 2") mit je einem JPG- und PDF-Button, die sofort exportieren. Darunter, eingeklappt unter "Weitere Optionen (Freestyle)", lässt sich die Feldauswahl/Größe/Format frei wählen - das deckt alles ab, was keine eigene Vorlage hat.

**Wo Vorlagen liegen:** im Ordner `export-templates/`.

- `templates.yaml` - Liste der Vorlagen (`id`, `label`, `size`: `auto`/`a4`/`a5`, `html`: Dateiname).
- `<id>.html` - das Layout der Vorlage, reines HTML mit Platzhaltern.
- `export-templates.css` - Styles, für alle Vorlagen gemeinsam.
- `<id>-preview.png` (oder `.jpg`/`.jpeg`/`.svg`) - optionales Vorschaubild, erscheint beim Hover auf "Vorschau" im Export-Dialog. Fehlt es, zeigt der Dialog "kein Vorschaubild" statt des Hover-Links.

**Platzhalter in den HTML-Dateien:** `{{id}}` sowie ein `{{key}}` pro Feld aus der [Feldübersicht](#feldübersicht) - `kontext`, `ueberschrift`, `einleitung`, `claim`, `faktcheck`, `bild`, `memeUrsprung`, `datum`, `lizenz`, `quelle2`, `kiModel`, `kiPrompt`, `achsen`. Für `bild` und `memeUrsprung` gibt es zusätzlich `{{bild_img}}`/`{{memeUrsprung_img}}` - wird zu einem `<img>`-Tag, falls eine Datei hinterlegt ist.

Ein Feld, das ein Item nicht hat, muss die Vorlage nicht selbst abfangen: ein umschließendes Element mit `data-field="<key>"` wird beim Export automatisch entfernt, wenn sein `<p>` leer bleibt und kein `<img>` enthält. Beispiel aus `indexkarte1.html`:

```html
<div class="tpl-field" data-field="kontext">
  <h4>Kontext</h4>
  <p>{{kontext}}</p>
</div>
```

Nach dem Bearbeiten: `npm run build:templates` in `build/` (oder committen/pushen, die GitHub Action holt das nach) - siehe [Daten pflegen](#daten-pflegen--lokale-entwicklung).


