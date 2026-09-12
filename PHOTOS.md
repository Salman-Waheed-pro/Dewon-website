# Photographs

Every image in the hero is a real photograph. Nothing on this site is
illustrated or AI-generated, and the placeholders visible in the hero stay
there until real files are supplied.

## How to use this

1. Put the files in `photos-raw/`, named exactly as listed below.
2. `npm install sharp` (once)
3. `node tools/photos.mjs`

The script removes the backgrounds, trims, resizes, crops the portrait and
builds the falling-herb layer. Output lands in `assets/images/` under the
names the pages already reference, so no code changes are needed.

---

## What each file has to be

| File in `photos-raw/` | What it is | What matters |
|---|---|---|
| `hero-boneless` | The centre shot: sauce-covered boneless fried chicken | Plain white or plain light-grey background. Shot from slightly above, whole portion in frame with room around it. Glossy sauce, visible sesame or herb flecks. |
| `piece-wing-1`, `piece-wing-2` | One wing each, two different angles | Single piece, plain background, sharp edges. These float at roughly 90–130 px so silhouette matters more than detail. |
| `piece-drumstick-1`, `piece-drumstick-2` | One drumstick each, two different angles | As above. A visible bone end reads as chicken instantly and is worth choosing for. |
| `taster` | A person in black gloves eating fried chicken | Portrait or square. Face and gloved hand both in frame. It is cropped to a circle, so keep the subject centred and leave margin. Black nitrile or food-service gloves, not latex-coloured. |
| `herbs` | Loose green herbs on a plain background | Coriander, parsley or dried herb flakes, scattered and in focus. The script cuts ~190 small flecks out of this one photo and throws them across the hero, so it needs plenty of separated pieces rather than one dense clump. |

**Background removal only works on plain backgrounds.** It flood-fills
inward from the edges. A busy or textured background will not cut cleanly —
either pick a different photo or cut the subject out first and save a PNG
with transparency, which the script passes straight through.

---

## Where to get them

All three of these are free for commercial use with no attribution
required. Check the licence line on the page before downloading — the terms
are per-photo, not per-site.

- **Pexels** — https://www.pexels.com
- **Unsplash** — https://unsplash.com
- **Pixabay** — https://pixabay.com

### Search terms that actually return the right thing

| For | Search |
|---|---|
| `hero-boneless` | `korean fried chicken sauce`, `boneless fried chicken white background`, `glazed fried chicken isolated`, `yangnyeom chicken` |
| wings | `fried chicken wing isolated`, `chicken wing white background`, `crispy wing single` |
| drumsticks | `fried chicken drumstick isolated`, `chicken leg white background` |
| `taster` | `person eating fried chicken gloves`, `black gloves eating chicken`, `man eating fried chicken`, `woman eating fried chicken` |
| `herbs` | `dried herbs isolated`, `chopped parsley white background`, `coriander leaves scattered`, `herbs falling` |

### Specific starting points

Found by searching those sites — open them, check they still suit, and
check the licence:

- Man eating roasted chicken while wearing a plastic glove — https://www.pexels.com/photo/man-eating-roasted-chicken-while-wearing-a-plastic-glove-13795356/
- Person wearing black gloves holding a burger — https://www.pexels.com/photo/person-wearing-black-gloves-holding-a-burger-4628465/
- Unrecognizable person with fried chicken in fingers — https://www.pexels.com/photo/unrecognizable-person-with-fried-chicken-in-fingers-6941022/
- Fried chicken texture — https://www.pexels.com/photo/fried-chicken-texture-4144648/
- Korean fried chicken, whole collection — https://www.pexels.com/search/korean%20fried%20chicken/
- Fried chicken, whole collection — https://unsplash.com/s/photos/fried-chicken

---

## Shoot it yourself instead

Stock is a stopgap. The chicken on the site should be Dewon's chicken, and
a phone in daylight beats stock for exactly the shots that matter.

**Setup.** A sheet of white A2 card, bent so the back curves up into a wall
with no crease line. Put it beside a window, not facing it. Phone on a
stack of books so the camera stays put between shots. No flash — it flattens
the crust and kills the gloss.

**The centre shot.** Portion plated as a customer gets it. Camera about 30°
above horizontal, not straight down. Sauce brushed on just before shooting
so it is still wet. Shoot ten frames and keep one.

**The floating pieces.** Single wing, single drumstick, on the same white
card, from four angles each. These end up small, so pick the ones with the
clearest outline.

**The person.** Someone eating in the restaurant, black gloves on, mid-bite,
looking at the food rather than the camera. Get a signed model release if
they are recognisable and it is going on a public site — one line on paper
is enough, and it matters.

**The herbs.** A pinch of the actual marinade herbs dropped onto white card.
Photograph them where they land. That single frame is what the script throws
across the hero.

---

## Licensing note

Whatever you use, keep a record of where each file came from and under what
licence. If a photo is later found to be misused it is the restaurant that
carries it, not the photographer. A plain text file in `photos-raw/` listing
file name, source URL and licence is enough.
