# Kimak V1 — Daftar Komponen

Dokumen ini menetapkan cakupan komponen untuk rilis **V1**. Sumber referensi katalog:

- **S** — [shadcn/ui](https://ui.shadcn.com/docs/components) (Radix / Base UI, Tailwind)
- **A** — [Appica UI](https://appica.dev/ui/docs/react/installation) (Base UI primitives, Tailwind v4)

Kimak bukan salinan katalog di atas. Keduanya dipakai untuk menentukan *komponen apa yang wajib ada* agar Kimak layak dipakai membangun aplikasi nyata. Semua aturan di [`AGENTS.md`](../AGENTS.md) tetap berlaku: headless, behavior di `@kimak/core`, look hanya di `@kimak/tailwind`.

**V1 wajib paritas tiga framework.** Setiap komponen V1 dirilis untuk React, Vue, dan Svelte sekaligus. React tetap dikerjakan pertama di dalam satu komponen (API-nya jadi acuan), tapi komponen belum dianggap selesai sebelum Vue dan Svelte menyusul.

## Legenda

| Kolom | Arti |
| --- | --- |
| **Jenis** | `machine` = state machine + `connect()` di core. `look` = anatomy + recipe Tailwind saja, tanpa machine (seperti Spinner / Button Group). |
| **Family** | Kelompok dependensi dari `AGENTS.md`: form, disclosure, overlay, menu, selection. Family menentukan urutan pengerjaan. |
| **Src** | Ada di katalog mana: S, A, atau S+A. |
| **Status** | ✅ selesai di React, Vue, dan Svelte · 🟡 sebagian (misalnya baru React) · ⬜ belum |

## Definition of Done per komponen

Satu komponen dianggap selesai untuk V1 jika semua poin ini terpenuhi:

1. Spec + anatomy di `@kimak/spec` (`*.spec.ts`, `*.anatomy.ts`, `*.parts.ts`, `*.a11y.ts`).
2. Machine + `connect()` di `@kimak/core` dengan exhaustive event switch (`never` default). Komponen `look` melewati langkah ini.
3. Compound parts di `@kimak/headless-react`, `@kimak/headless-vue`, dan `@kimak/headless-svelte`. React memakai `render` + `mergeProps`; Vue/Svelte memakai `as`.
4. Test keyboard / ARIA / `data-state` dari spec di **ketiga** adapter. Tidak ada pixel snapshot.
5. Recipe di `@kimak/tailwind` yang hanya menarget `data-scope` / `data-slot` / `data-state`.
6. Product sugar di `@kimak/ui-react`, `@kimak/ui-vue`, dan `@kimak/ui-svelte` (satu folder per komponen, barrel `index.ts`).
7. Halaman docs di `apps/docs` dengan contoh dan snippet untuk ketiga framework, plus tabel API yang diturunkan dari spec.

---

## 0. Sudah ada (baseline v0.x)

| Komponen | Jenis | Family | Src | React | Vue | Svelte |
| --- | --- | --- | --- | :-: | :-: | :-: |
| Button | machine | — | S+A | ✅ | ✅ | ✅ |
| Button Group (root, separator, text) | look | — | S+A | ✅ | ✅ | ✅ |
| Spinner | look | — | S+A (A: Loader) | ✅ | ✅ | ✅ |
| Popover | machine | overlay | S+A | ✅ | ✅ | ✅ |

Platform di core yang sudah ada: `collection`, `direction`, `dismiss`, `focus`, `ids`, `live-region`, `position` (flip + shift), `presence`, `roving-focus`, `hidden`.

---

## 1. Fondasi core (prasyarat, bukan komponen publik)

Utility ini harus ada di `@kimak/core/platform` sebelum family terkait dimulai.

| Utility | Dipakai oleh | Status |
| --- | --- | --- |
| Controllable state (`value` / `defaultValue` / `onValueChange`) | semua form + selection | ⬜ |
| Form hidden input + `visuallyHiddenStyle` | Checkbox, Radio, Switch, Slider, Select, Combobox | 🟡 (`hidden.ts`) |
| Focus trap + return focus | Dialog, Alert Dialog, Sheet | 🟡 (`focus.ts`) |
| Scroll lock | Dialog, Alert Dialog, Sheet | ⬜ |
| Typeahead | Menu, Select, Combobox | ⬜ |
| Hover intent / delay group | Tooltip, Hover Card, submenu | ⬜ |
| Pointer drag (posisi → nilai) | Slider | ⬜ |
| Timer pausable | Toast | ⬜ |
| Interact outside / nested layer stack | semua overlay + menu | 🟡 (`dismiss.ts`) |

---

## 2. Look-only (tanpa machine)

Komponen murah: anatomy + recipe Tailwind + sugar. Bisa dikerjakan paralel dengan family mana pun.

| Komponen | Src | Catatan | Status |
| --- | --- | --- | --- |
| Badge | S+A | `data-variant` seperti Button | ⬜ |
| Card | S+A | Parts: header, title, description, content, footer, action | ⬜ |
| Kbd | S+A | Elemen `<kbd>` + group | ⬜ |
| Separator | S+A | `role="separator"` + `aria-orientation`; tanpa state | ⬜ |
| Skeleton | S+A | Animasi pulse via keyframes Tailwind | ⬜ |
| Alert | S+A | `role="alert"` opsional; parts: icon, title, description | ⬜ |
| Label | S | Standalone; versi terikat ada di Field | ⬜ |
| Input | S+A | Native `<input>`, terhubung ke Field | ⬜ |
| Textarea | S+A | Native `<textarea>`, terhubung ke Field | ⬜ |
| Native Select | S | Native `<select>` + chevron | ⬜ |
| Table | S+A | Elemen tabel native; tanpa sorting (sorting = Data Table, pasca V1) | ⬜ |
| Breadcrumb | S+A | `<nav aria-label>`, `aria-current="page"`, separator | ⬜ |
| Pagination | S+A | Link + `aria-current`; logika halaman di sugar, bukan machine | ⬜ |

---

## 3. Form family

| Komponen | Jenis | Src | Catatan | Status |
| --- | --- | --- | --- | --- |
| Field | machine | S+A | Hubungkan label / description / error lewat id + `aria-describedby`, `aria-invalid`, `data-invalid`, `data-disabled`. Fondasi semua kontrol form. | ⬜ |
| Checkbox | machine | S+A | `checked` / `indeterminate`, hidden input | ⬜ |
| Radio Group | machine | S+A (A: Radio) | Roving focus, panah, hidden input | ⬜ |
| Switch | machine | S+A | `role="switch"`, hidden input | ⬜ |
| Toggle | machine | S+A | `aria-pressed` | ⬜ |
| Toggle Group | machine | S+A | Single / multiple, roving focus | ⬜ |
| Slider | machine | S+A | Satu atau range thumb, pointer drag, keyboard (panah, PageUp/Down, Home/End) | ⬜ |

---

## 4. Disclosure family

| Komponen | Jenis | Src | Catatan | Status |
| --- | --- | --- | --- | --- |
| Collapsible | machine | S+A | `aria-expanded`, `aria-controls`, presence untuk animasi tinggi via CSS var | ⬜ |
| Accordion | machine | S+A | Dibangun di atas Collapsible; single / multiple, navigasi panah antar trigger | ⬜ |
| Tabs | machine | S+A | Roving focus, aktivasi otomatis / manual, orientasi | ⬜ |

---

## 5. Overlay family

Popover sudah ada. Semua overlay memakai `trackPopover()`-style effect dari core.

| Komponen | Jenis | Src | Catatan | Status |
| --- | --- | --- | --- | --- |
| Popover | machine | S+A | Baseline. Infrastruktur overlay (portal, presence, `trackPopover()`) terbukti di React, Vue, Svelte. | ✅ |
| Tooltip | machine | S+A | Hover intent + delay group, `aria-describedby`, tidak menerima fokus | ⬜ |
| Hover Card | machine | S (A: Preview Card) | Hover intent, konten interaktif | ⬜ |
| Dialog | machine | S+A | Modal: focus trap, scroll lock, `aria-modal`, Escape | ⬜ |
| Alert Dialog | machine | S+A | Dialog dengan `role="alertdialog"`, tidak bisa ditutup lewat klik luar | ⬜ |
| Sheet | look | S | Dialog + `data-side` (top/right/bottom/left). Tanpa swipe. | ⬜ |

---

## 6. Menu family

| Komponen | Jenis | Src | Catatan | Status |
| --- | --- | --- | --- | --- |
| Dropdown Menu | machine | S+A | Item, checkbox item, radio item, group, label, separator, submenu, typeahead | ⬜ |
| Context Menu | machine | S+A | Machine yang sama dengan Dropdown Menu, anchor = posisi pointer | ⬜ |

---

## 7. Selection family

| Komponen | Jenis | Src | Catatan | Status |
| --- | --- | --- | --- | --- |
| Select | machine | S+A | Listbox, typeahead, hidden input, item text di trigger | ⬜ |
| Combobox | machine | S+A | Input + listbox, filter di luar machine, single / multiple | ⬜ |

---

## 8. Feedback & media

| Komponen | Jenis | Src | Catatan | Status |
| --- | --- | --- | --- | --- |
| Progress | look | S+A | `role="progressbar"` + `aria-valuenow`; state `indeterminate` | ⬜ |
| Avatar | machine | S+A | Status load gambar (`loading` / `loaded` / `error`) → fallback | ⬜ |
| Toast | machine | S+A | Dikerjakan **terakhir**. Store global, timer pausable, live region, swipe opsional | ⬜ |

---

## Ringkasan cakupan V1

| Kelompok | Jumlah | Selesai |
| --- | :-: | :-: |
| Baseline | 4 | 4 |
| Look-only | 13 | 0 |
| Form | 7 | 0 |
| Disclosure | 3 | 0 |
| Overlay (di luar Popover) | 5 | 0 |
| Menu | 2 | 0 |
| Selection | 2 | 0 |
| Feedback & media | 3 | 0 |
| **Total** | **39** | **4** |

## Urutan milestone

Urutan mengikuti dependensi family, bukan popularitas. Setiap milestone menghasilkan React, Vue, dan Svelte sekaligus; tidak ada milestone porting terpisah.

1. **M1 — Fondasi + look-only + Field + port Popover.** Utility controllable state, hidden input. Field, Input, Textarea, Label, lalu komponen look-only lainnya. Port Popover ke Vue/Svelte ✅ (infrastruktur overlay terbukti di ketiga adapter sebelum M4).
2. **M2 — Form.** Checkbox, Switch, Toggle, Radio Group, Toggle Group, Slider.
3. **M3 — Disclosure.** Collapsible, Accordion, Tabs.
4. **M4 — Overlay.** Tooltip, Hover Card, Dialog, Alert Dialog, Sheet. Butuh focus trap + scroll lock.
5. **M5 — Menu.** Dropdown Menu, Context Menu. Butuh typeahead + layer stack.
6. **M6 — Selection.** Select, Combobox.
7. **M7 — Feedback.** Progress, Avatar, Toast.

---

## Pasca V1 (V1.x)

Ditunda karena bergantung pada family V1 atau terlalu kompleks untuk MVP.

| Komponen | Src | Alasan ditunda |
| --- | --- | --- |
| Command | S | Komposisi Combobox + Dialog; tunggu selection + overlay stabil |
| Calendar | S+A | Machine tanggal + grid navigation besar |
| Date Picker | S+A | Calendar + Popover |
| Date Field / Time Field | A | Segmented input; butuh lib tanggal |
| Input OTP | S (A: OTP Field) | Machine sendiri, tidak mendesak |
| Number Field | A | Machine sendiri (increment, format) |
| Input Group | S | Look-only, tapi tunggu Input + Button stabil |
| Drawer | S+A | Sheet + gesture swipe |
| Menubar | S+A | Menu family + roving antar menu |
| Navigation Menu | S+A | Machine viewport + hover intent |
| Scroll Area | S+A | Custom scrollbar, berat di platform |
| Resizable | S | Pointer drag + layout |
| Carousel | S+A | Scroll snap + kontrol |
| Meter | A | `role="meter"`; murah, tapi tidak mendesak |
| Toolbar | A | Roving focus lintas kontrol |
| Aspect Ratio, Empty, Item, Typography | S | Look-only, nilai kecil |
| Data Table | S+A | Komposisi Table + sorting/filter, di luar headless |
| Sidebar | S | Komposisi aplikasi, bukan primitif |
| Chip | A | Bagian dari Combobox multiple |

## Di luar cakupan

Tidak direncanakan karena bertentangan dengan arah Kimak (headless, tanpa motion library) atau bukan primitif UI umum.

- **Visual dekoratif** (A): Background Pattern, Border Beam, Gradient Glow, Text Animate, Sparkline, Compare Slider, Thumbnail.
- **Widget khusus** (A): Color Area, Color Picker, Color Slider, Color Swatch, Color Swatch Picker, Rating, Countdown, Copy Button, Table of Content.
- **Komponen AI / chat** (S): Attachment, Bubble, Message, Message Scroller, Questionnaire, Trace, Marker, Code Block.
- **Chart** (S): bergantung pada library chart pihak ketiga.
- **Direction** (S): sudah ada sebagai `DirectionProvider` di adapter, bukan komponen.
- **Form** (A): validasi form di luar cakupan; Field sudah menangani wiring a11y.

---

## Keputusan

**Sudah diputuskan**

- **Vue / Svelte di V1 (2026-11-17):** V1 wajib paritas React, Vue, dan Svelte untuk setiap komponen.

**Masih terbuka**

1. **Toast di V1 atau V1.1.** Toast adalah komponen paling sering diminta, tapi butuh store global di luar pola machine per-instance. Rekomendasi: tetap di V1 sebagai milestone terakhir; geser ke V1.1 jika M6 terlambat.
2. **Sheet tanpa swipe.** Sheet V1 hanya Dialog + `data-side`. Gesture swipe masuk ke Drawer (V1.x).
3. **Command.** Pindahkan ke V1 jika Combobox selesai lebih awal; machine-nya hampir seluruhnya reuse.
