# Design

EcoFinds' visual system. Provided by the team in Stage 2 (plan §8) and derived
from the DesignMD catalog entry **`wise`** (reference: <https://wise.com>).

These tokens are **live in the app** in `frontend/src/index.css` under `@theme`.
That file and this document are the same values in two places, so they can drift.
`npm run check:tokens` (in `frontend/`) fails if they do — run it with lint and
build. See plan §12: "a doc that describes the app is not the app."

---

## Colour

Lime on ink is the whole identity. One accent, no second.

### Brand

| Token | Hex | Use |
|---|---|---|
| `primary` | `#9fe870` | Brand lime. Primary CTA fill on neutral surfaces; hero band fill. |
| `primary-active` | `#cdffad` | Hover/active lift on lime fills. |
| `primary-neutral` | `#c5edab` | Mid-saturation lime for neutral active fills. |
| `primary-pale` | `#e2f6d5` | Softest lime. Badge and callout backgrounds. |

### Surface

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#ffffff` | Card interiors, default page. |
| `canvas-soft` | `#e8ebe6` | Sage page band. Section separation. |

### Text

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0e0f0c` | Headings, display type, body default. |
| `ink-deep` | `#163300` | Forest ink. Sub-copy **on lime surfaces**. |
| `body` | `#454745` | Secondary body text on white/sage only. |
| `mute` | `#868685` | Captions, placeholders, fine print. |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `positive` | `#2ead4b` | Success. Never reuse brand lime for this. |
| `positive-deep` | `#054d28` | Pressed positive. |
| `warning` | `#ffd11a` | Caution. |
| `warning-deep` | `#b86700` | Pressed warning. |
| `negative` | `#d03238` | Error, destructive. |
| `negative-deep` | `#a72027` | Pressed destructive. |

### Contrast rules — not optional

- **Lime is a background, never a foreground.** `#9fe870` on white is ~1.7:1.
  Text is never lime except on `ink`.
- On the lime band, sub-copy is `ink` or `ink-deep`. Never `body` — it dulls out.
- On `ink` surfaces, `primary` is the accent text colour.

---

## Type

Two faces, strict roles. Wise Sans is proprietary; the catalog entry names
Manrope 800/900 and Inter 900 as the sanctioned substitutes. We use Manrope so
the display/body contrast is a real face change, not a weight change.

| Role | Family | Use |
|---|---|---|
| Display | **Manrope** 800 | Hero and section headlines. Uppercase at hero scale. |
| Body / UI | **Inter** 400/600 | Everything else — body, labels, buttons, nav. |

| Token | Size | Weight | Leading | Tracking |
|---|---|---|---|---|
| `text-display-xl` | `clamp(2.5rem, 5.2vw, 4rem)` | 800 | 0.92 | -0.01em |
| `text-display-md` | `clamp(2rem, 4vw, 2.75rem)` | 800 | 1.02 | -0.01em |
| `text-display-sm` | `1.5rem` | 800 | 1.15 | -0.01em |
| body / small | Tailwind defaults (`text-base`, `text-sm`) | 400 / 600 | default | default |

**Heavy uppercase Manrope wants tracking near `0` to `-0.01em`.** The `-0.96px`
in the source table is for sentence-case Inter headings — applying it to the
uppercase hero crowds the letterforms.

Never set the hero below weight 800. The display ceiling being full-black weight
is the brand's typographic signature.

---

## Space and shape

**Spacing** — the source system is a 4 px base (`4 / 8 / 12 / 16 / 24 / 32 / 48`).
That is exactly Tailwind's default scale (`1 / 2 / 3 / 4 / 6 / 8 / 12`), so we add
no spacing tokens and use Tailwind's directly.

**Radius** — generous and friendly. `xl` is the signature.

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 8px | Chips, small controls. |
| `rounded-md` | 12px | Inputs. |
| `rounded-lg` | 16px | Inner surfaces. |
| `rounded-xl` | 24px | **Cards and buttons. The brand shape.** |
| `rounded-full` | pill | Icon buttons, badges, category pills. |

**Elevation is surface contrast, not shadow.** A white card on the sage band is
the elevation. Shadows are reserved for genuinely floating things (dropdowns).

---

## Do

- Reserve lime for the primary action on a neutral surface. It is the conversion signature.
- Set hero headlines in Manrope 800. Never lighter.
- Use 24px radius for buttons and cards.
- Cycle surfaces: sage band → white cards. Let contrast carry depth.
- Give every interactive element a visible `:focus-visible` ring.
- Respect `prefers-reduced-motion` on every transition and reveal.

## Don't

- **Don't put a lime CTA on a lime background.** On the lime band the primary
  button is `ink`. The primary action is always the highest-contrast pill against
  its own surface.
- Don't introduce a second brand accent.
- Don't render CTAs as sharp rectangles — the 24px pill geometry is the brand.
- Don't repurpose brand lime as a success indicator; that is `positive`.
- Don't ship a dead control. If there is no page behind it, leave it out.

---

## Source

The upstream style reference this system is derived from is committed alongside
this file as `docs/DESIGN.source.md`. Where the two differ, see the open items
in `docs/TASKS.md`.
