---
target: the whole site
total_score: 15
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: 'file:/home/webber/Repositories/lomanpsychologie-nl/src/pages/[[...slug]].tsx'
target_fingerprint: 'sha256:5db344800ddcdd23b8d8ab439812e3b2c95f63fb3007321ba00dad2a2e7b9a93'
target_path: /home/webber/Repositories/lomanpsychologie-nl/src/pages/[[...slug]].tsx
timestamp: 2026-11-03T23-14-18Z
slug: src-pages-slug-tsx
---

Method: A in-thread (written before B's evidence) · B: delegated session "Design Critique: Loman Psychologiepraktijk". Target: the live site as rendered from main (/, /tarieven, /de-praktijk, /behandelingen, /behandelingen/emdr, /contact, /404).

| #     | Heuristic                       | Score       | Key issue                                                           |
| ----- | ------------------------------- | ----------- | ------------------------------------------------------------------- |
| 1     | Visibility of system status     | 2           | Aanmeldstop buried in the fifth home section                        |
| 2     | Match with the real world       | 2           | "Meer info", "in het kort", unexplained GGZ jargon, English 404     |
| 3     | User control and freedom        | 2           | Mobile drawer: no Escape, no focus trap; 404 auto-redirects         |
| 4     | Consistency and standards       | 1           | Three heading systems, emerald/indigo accents unrelated to the logo |
| 5     | Error prevention                | 2           | Phone and e-mail not tappable; unknown paths silently show home     |
| 6     | Recognition rather than recall  | 2           | Contact and crisis info only at the end of a 10,000px page          |
| 7     | Flexibility and efficiency      | n/a         | Persuade/Read surface                                               |
| 8     | Aesthetic and minimalist design | 1           | Wall of equal-weight bands; insurer lists as one long stack         |
| 9     | Error recovery                  | 1           | 404 in English, then auto-redirect                                  |
| 10    | Help and documentation          | 2           | FAQ page is "In aanbouw" yet in the footer                          |
| Total |                                 | 15/36 (42%) | Poor                                                                |

Priority issues: [P1] gloomy generic first viewport, no route to registration; [P1] unscannable wall of text; [P1] type/colour incoherent with logo; [P2] broken edges (404, mobile drawer focus, hover-only submenu, English aria labels, FAQ placeholder); [P2] treatment pages with text boxes over 100vh photos.
Detector: 0 findings in source; axe: 0 violations; CLS 0.
