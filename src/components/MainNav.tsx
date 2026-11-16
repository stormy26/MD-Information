// MainNav: the top-level navigation bar (Line-up | Workout).
//
// CONCEPTS USED
// - Props: this component receives data from its parent (App) as one object.
// - Lifting state up: MainNav owns NO state. App owns `section`, passes it in so MainNav knows which
//   button is active, and passes `onChange` so MainNav can report clicks. MainNav only displays and reports.
// - .map() builds the buttons from an array, each with a stable `key`.

// The two top-level sections. Exported so App.tsx can type its `section` state with it.
export type Section = 'workout' | 'lineup'

interface Props {
    section: Section                      // which section is currently active
    onChange: (section: Section) => void  // call this when a button is clicked
}

export function MainNav({ section, onChange }: Props) {

    return (
        // mx-auto   = centre the box horizontally (left/right margins automatic)
        // flex      = lay the buttons out in a row
        // max-w-4xl = never wider than 56rem (896px), so it matches the page content width
        // gap-2     = 0.5rem (8px) space between the buttons
        // px-6      = 1.5rem (24px) padding on the left and right
        // pt-4      = 1rem (16px) padding on the top
        <nav className="mx-auto flex max-w-4xl gap-2 px-6 pt-4">
        {(
          // [key, label] pairs. `as const` keeps the keys typed as 'lineup' | 'workout', not plain strings.
          [
            ['lineup', 'Line-up'],
            ['workout', 'Workout'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            // Always applied:
            //   rounded-t-lg = round only the top corners (folder-tab look)
            //   px-4 py-2    = padding 1rem left/right, 0.5rem top/bottom
            //   text-sm      = small text (0.875rem)
            //   font-bold    = bold text
            //   transition   = colour changes animate smoothly
            // Active button (section === key):
            //   bg-white text-dragon-navy shadow-sm = white background, navy text, soft shadow (looks raised)
            // Inactive button:
            //   text-dragon-navy/50       = navy text at 50% opacity (faded)
            //   hover:text-dragon-navy    = full navy text when the mouse is over it
            className={`rounded-t-lg px-4 py-2 text-sm font-bold transition ${
              section === key
                ? 'bg-white text-dragon-navy shadow-sm'
                : 'text-dragon-navy/50 hover:text-dragon-navy'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    )
}
