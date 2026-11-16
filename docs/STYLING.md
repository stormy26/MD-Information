# Styling guide (Tailwind classes used in this project)

This project styles everything with **Tailwind CSS v4**. There are no `.css` files per component. Instead,
each element gets small single-purpose classes in its `className`, for example `px-6` = "padding left and
right 1.5rem". You read a `className` like a sentence made of small pieces.

```tsx
<div className="mx-auto max-w-4xl px-6 py-4">
//              centre   cap width  side padding  top/bottom padding
```

## How to read a class

| Pattern | Meaning | Example |
|---|---|---|
| `thing-value` | a property with a size from Tailwind's scale | `p-5`, `gap-2`, `text-sm` |
| `thing-[value]` | an exact custom value in square brackets | `min-w-[640px]`, `tracking-[0.2em]` |
| `color/NN` | the colour at NN% opacity | `text-dragon-navy/50` = 50% navy |
| `state:class` | applies only in that state | `hover:underline`, `focus:border-dragon-navy/40` |
| `breakpoint:class` | applies only at that screen width and up | `sm:text-5xl`, `lg:order-1` |

**Spacing scale:** the number x 0.25rem (4px). So `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px,
`5` = 20px, `6` = 24px, `8` = 32px, `10` = 40px.

**Breakpoints:** classes with no prefix apply to all sizes. `sm:` applies from 640px, `lg:` from 1024px.

**Conditional classes:** classes can be chosen by state with a template string and a ternary:

```tsx
className={`rounded-full px-3 py-1 text-xs ${
  view === key ? 'bg-dragon-navy text-white' : 'text-dragon-navy/50 hover:text-dragon-navy'
}`}
```

The fixed classes stay, and the part after `${` swaps depending on the active state.

---

## 1. Brand colours (defined in `src/index.css`)

Defined once in the `@theme` block, then usable in any colour class, such as `bg-dragon-navy`,
`text-dragon-red`, `border-dragon-navy/10`.

| Token | Hex | Used for |
|---|---|---|
| `dragon-red` | `#c8202f` | accents, important buttons, small headings |
| `dragon-red-dark` | `#9c1522` | hover state of red buttons |
| `dragon-navy` | `#163862` | main text, headings, active pills, primary buttons |
| `dragon-navy-dark` | `#0e2748` | hover state of navy buttons |
| `dragon-cream` | `#efe6cd` | page background, soft row backgrounds |
| `dragon-cream-dark` | `#e3d6ae` | defined, not used yet |
| `dragon-ink` | `#14213d` | body text colour, dark borders |

To change the look of the whole app, edit these values in `index.css`.

---

## 2. Class reference (grouped by purpose)

### Layout and positioning
| Class | What it does |
|---|---|
| `min-h-screen` | element is at least as tall as the window |
| `mx-auto` | left and right margins automatic = **centres** a width-limited box |
| `max-w-4xl` | maximum width 56rem (896px); narrower screens are unaffected |
| `relative` / `absolute` | positioning: `absolute` places an element relative to the nearest `relative` parent |
| `inset-0` | stretches an absolutely positioned element to fill its parent (top/right/bottom/left = 0) |
| `overflow-hidden` | clips anything that sticks out (used for rounded corners to cut contents) |
| `overflow-x-auto` | adds a horizontal scrollbar only if content is too wide |

### Flexbox (one row or column of items)
| Class | What it does |
|---|---|
| `flex` | children line up in a row |
| `flex-col` | children stack in a column |
| `flex-wrap` | items wrap to the next line when there is no room |
| `items-center` | centre items on the cross axis (vertically in a row) |
| `items-start` | align items to the top |
| `justify-between` | push first item to one end, last to the other, spread the rest |
| `gap-2`, `gap-3`, `gap-6` | space between children (8px, 12px, 24px) |
| `flex-1` | this item grows to fill free space |
| `shrink-0` | this item does not get squeezed smaller |

### Grid (rows and columns)
| Class | What it does |
|---|---|
| `grid` | children are placed on a grid |
| `grid-cols-5` | five equal-width columns. Each child fills one cell, so values **line up between rows** |
| `lg:grid-cols-[minmax(0,1fr)_360px]` | on large screens, two columns: flexible left, fixed 360px right (`_` = space) |
| `order-1`, `order-2`, `lg:order-1` | change which child appears first |

### Spacing between children
| Class | What it does |
|---|---|
| `space-y-1`, `space-y-2`, `space-y-4`, `space-y-6` | vertical space between a parent's direct children |

### Padding and margin
| Class | What it does |
|---|---|
| `p-5` | padding on all four sides |
| `px-N` / `py-N` | padding left+right / top+bottom |
| `pt-4` | padding top only; also `pr-2` (right) |
| `mb-1`, `mb-3` | margin below. Also `mt-4` (above), `mr-2` (right) |

### Sizing
| Class | What it does |
|---|---|
| `w-full` | full width of the parent |
| `w-16`, `w-24`, `w-28`, `w-32`, `w-40` | fixed width (4, 6, 7, 8, 10 rem) |
| `min-w-[10rem]`, `min-w-[640px]` | width never goes below this |

### Typography
| Class | What it does |
|---|---|
| `text-xs` / `text-sm` / `text-lg` | font size 0.75 / 0.875 / 1.125 rem |
| `text-4xl`, `sm:text-5xl` | large title; bigger from 640px up |
| `font-medium` / `font-semibold` / `font-bold` / `font-black` | increasing boldness |
| `uppercase` | ALL CAPS |
| `tracking-tight`, `tracking-wide`, `tracking-[0.2em]` | letter spacing |
| `text-left`, `text-center`, `text-right` | text alignment |
| `hover:underline` | underline on hover |

### Colour
| Class | What it does |
|---|---|
| `bg-white`, `text-white` | white background / text |
| `bg-dragon-navy`, `bg-dragon-red`, `bg-dragon-cream` | brand background |
| `text-dragon-navy`, `text-dragon-red`, `text-dragon-ink` | brand text |
| `text-dragon-navy/50` | navy at 50% opacity (faded). `/60`, `/70` the same idea |
| `bg-dragon-cream/60` | cream background at 60% opacity |
| `bg-gradient-to-b from-dragon-navy/5 to-transparent` | top-to-bottom gradient fading to nothing |

### Borders, corners, shadow
| Class | What it does |
|---|---|
| `border`, `border-2`, `border-4` | border thickness 1px / 2px / 4px |
| `border-b` | bottom border only |
| `border-dragon-navy/10` | faint navy border colour; `/20`, `/40` stronger |
| `border-transparent` | invisible border (keeps layout stable until hover/focus) |
| `rounded` / `rounded-lg` / `rounded-xl` / `rounded-full` | corner roundness, small to pill |
| `rounded-t-lg` | round only the top corners (used for the folder-style tabs) |
| `shadow-sm`, `shadow` | soft drop shadow |

### States and effects
| Class | What it does |
|---|---|
| `transition` | animates colour changes smoothly |
| `hover:...` | applies while the mouse is over the element |
| `focus:border-dragon-navy/40` | applies while an input is selected |
| `disabled:opacity-30` / `disabled:opacity-40` | faded look when a button is disabled |

---

## 3. Recurring "recipes" (combinations reused across the app)

**Card** (CrewList, CrewForm, WorkoutBuilder, ExerciseManager)
`rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm`
-> rounded white box, faint navy border, padding, soft shadow.

**Card heading**
`text-lg font-bold text-dragon-navy` (add `mb-3` for space below).

**Page content wrapper** (centred, side margins)
`mx-auto max-w-4xl px-6` (add `py-4` or `py-8` for top/bottom space).
Used on the navs and views so everything lines up. Without `mx-auto` the box sticks to the left.

**Top-level tab (MainNav) - folder-style**
Fixed: `rounded-t-lg px-4 py-2 text-sm font-bold transition`
Active: `bg-white text-dragon-navy shadow-sm`
Inactive: `text-dragon-navy/50 hover:text-dragon-navy`

**Sub-tab pill (LineupSection)**
Fixed: `rounded-full px-3 py-1 text-xs`
Active: `bg-dragon-navy text-white`
Inactive: `text-dragon-navy/50 hover:text-dragon-navy`

**Primary button (navy)**
`rounded-lg bg-dragon-navy px-4 py-2 text-sm font-bold text-white hover:bg-dragon-navy-dark`

**Accent button (red, full width)**
`rounded-lg bg-dragon-red px-5 py-2 font-bold text-white shadow transition hover:bg-dragon-red-dark disabled:opacity-40`

**Text input / select**
`rounded border border-dragon-navy/20 px-3 py-2 text-sm`
(CrewForm's inputs currently have no classes. This is the recipe to reuse for them.)

**Small red text action** (e.g. Remove)
`text-xs font-semibold text-dragon-red hover:underline`

**Crew row (CrewList)**
`grid grid-cols-5 gap-2 py-2 text-sm text-dragon-navy`
-> five equal columns; each `<span>` is one cell.

---

## 4. Per-file map of what you built

| File | Element | Classes | Why |
|---|---|---|---|
| `App.tsx` | outer `<div>` | `min-h-screen bg-dragon-cream` | cream background filling the window |
| `App.tsx` | footer | `py-8 text-center text-xs font-semibold uppercase tracking-widest text-dragon-navy/40` | small, faded, spaced-out caps |
| `MainNav.tsx` | `<nav>` | `mx-auto flex max-w-4xl gap-2 px-6 pt-4` | centred row of buttons with gaps |
| `MainNav.tsx` | buttons | see "Top-level tab" recipe | active tab looks raised |
| `LineupSection.tsx` | `<nav>` | `mx-auto flex max-w-4xl gap-2 px-6 pt-4` | same row layout as MainNav |
| `LineupSection.tsx` | buttons | see "Sub-tab pill" recipe | smaller and rounded, so the two nav levels differ |
| `LineupSection.tsx` | content `<div>` | `max-w-4xl px-6 py-4` | add `mx-auto` to centre it like the nav |
| `CrewList.tsx` | `<section>` | card recipe | the white box |
| `CrewList.tsx` | `<h2>` | `text-lg font-bold text-dragon-navy` | heading |
| `CrewList.tsx` | `<li>` | crew row recipe | aligned columns |
| `CrewForm.tsx` | `<form>` | card recipe | no other styling yet |

---

## 5. Tips for learning Tailwind

- **Search the official docs** at tailwindcss.com. Search the CSS property name (for example "justify-content") to find the class.
- **Change one class at a time** and watch the browser. For example, try `gap-2` -> `gap-6`.
- **VS Code helps:** hover over a class (with the Tailwind IntelliSense extension installed) to see the CSS it produces.
- **Use DevTools (F12)** to see which classes are applied and what each does.
- **Don't memorise.** Copy a recipe above, then adjust it.
