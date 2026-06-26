# Markdown Parser Demo

[Home](#)

Ein vollständiger **Markdown → HTML** Parser in *TypeScript*.

## Features

- Überschriften (H1-H6)

- **Fett**, *Kursiv*, ~~Durchgestrichen~~, \`Inline-Code\`

- ==Markiert==, ^Hochgestellt^, ~Tiefgestellt~

- [Links](https://example.com "Beispiel") und ![Bilder](https://via.placeholder.com/100 "Platzhalter")

- Aufgabenlisten:
  - [x] Inline-Parser
  - [x] Block-Parser
  - [ ] CLI-Tool

## Code

```typescript
const html = parse("# Hallo");

console.log(html);

```

## Tabelle

| Spalte | Typ    | Pflicht |
|:-------|:------:|--------:|
| text   | string | ja      |
| id     | number | nein    |

> Blockquotes werden auch unterstützt.

> > Sogar verschachtelt!

---

Fußnoten[^1] funktionieren ebenfalls.

[^1]: Das ist eine Fußnote.
