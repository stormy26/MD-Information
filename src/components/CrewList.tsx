// CrewList: displays the whole crew as a card with one row per member (display only, no editing yet).
//
// CONCEPTS USED
// - Rendering a list: crew.map() turns each CrewMember into an <li>.
// - `key={member.id}`: React needs a stable, unique key per item to track list changes (never the index).
// - Empty state: a message is shown when the list is empty.
// - CSS grid (`grid grid-cols-5`): every row has five equal columns, so the values line up across rows.
import {useState} from 'react'
import type {CrewMember} from '../data/crew'
import {CrewForm} from './CrewForm'

interface Props {
    crew: CrewMember[]   // owned by App, passed down; this component only reads it
    onRemove: (id: string) => void
    onUpdate: (member: CrewMember) => void
}

// STEP 7A (remove) - in the <li> of each row:
//   - Add a sixth element: <button type="button" onClick={() => onRemove(member.id)}>Remove</button>
//     Why `() => onRemove(member.id)` and not `onClick={onRemove(member.id)}`? The second CALLS the function
//     while rendering. The arrow function waits until the click.
//   - The row grid now has 6 columns: change grid-cols-5 to grid-cols-6 (see docs/STYLING.md).
//   - Optional: confirm first with  if (!confirm(`Remove ${member.name}?`)) return
//
// STEP 7B-2 (edit, AFTER CrewForm is made reusable - see the STEP 7B-1 comment in CrewForm.tsx):
//   a) State, inside CrewList(): const [editingId, setEditingId] = useState<string | null>(null)
//      null = nobody is being edited. It is UI state, so it lives here, not in App.
//   b) The Edit button (currently a placeholder that calls onUpdate): make it call setEditingId(member.id).
//   c) In the .map(), branch per row:
//        member.id === editingId
//          ? ( <li key={member.id}> <CrewForm initial={member} onSubmit={...} /> <button>Cancel</button> </li> )
//          : ( the normal row you already have )
//      NOTE: `key={member.id}` must be on the OUTERMOST element returned in BOTH branches.
//   d) onSubmit for the edit form is a small function:  (updated) => { onUpdate(updated); setEditingId(null) }
//      Cancel: onClick={() => setEditingId(null)}  with type="button" so it doesn't submit anything.
//   Why this works: the form is created fresh each time you click Edit (the row switches from text to form),
//   so useState(initial?.name ...) picks up that member's values.
//   Check: edit a name -> it updates in the list AND survives a page reload (localStorage); id is unchanged.
export function CrewList({crew, onRemove, onUpdate}: Props){

    const [editingId, setEditingId] = useState<string | null>(null)       // sub-tab inside Line-up
    return(
        // Card classes:
        //   rounded-xl                = large rounded corners
        //   border-2                  = 2px border
        //   border-dragon-navy/10     = navy border colour at 10% opacity (very faint)
        //   bg-white                  = white background
        //   p-5                       = 1.25rem (20px) padding on all sides
        //   shadow-sm                 = small soft shadow
        <section className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
            {/* Heading with the number of crew members.
                text-lg = large text (1.125rem) | font-bold = bold | text-dragon-navy = brand navy colour */}
            <h2 className="text-lg font-bold text-dragon-navy">Crew ({crew.length})</h2>
            {
                // No members -> friendly message; otherwise the list.
                crew.length === 0 ?
                (
                    <p>No crew yet</p>
                ):
                (
                    <ul>
                        {crew.map((member) => (
                            (member.id === editingId) ?
                                    (
                                        <li key={member.id}>
                                            <CrewForm initial={member} onSubmit={(updated) => {onUpdate(updated); setEditingId(null);}} />
                                            <button  type="button" onClick={() => setEditingId(null)}>Cancel</button>
                                        </li>
                                    )
                                    :
                                    (
                                    // Row classes:
                                    //   grid grid-cols-5 = a grid with 5 equal columns (one per <span>), so values line up
                                    //   gap-2            = 8px space between columns
                                    //   py-2             = 0.5rem padding top and bottom
                                    //   text-sm          = small text (0.875rem)
                                    //   text-dragon-navy = brand navy text colour
                                    <li key={member.id} className="grid grid-cols-6 gap-2 py-2 text-sm text-dragon-navy">
                                        <span>{member.name}</span>
                                        <span>{member.gender}</span>
                                        <span>{member.side}</span>
                                        <span>{member.age}</span>
                                        <span>{member.weightCategory}</span>
                                        <button type="button" onClick={() => setEditingId(member.id)}>Edit</button>
                                        <button type="button" onClick={() => {
                                            // if the user clicks Cancel, return early and do nothing. Otherwise call onRemove.                                           
                                            if(!confirm(`Remove ${member.name}?`)) return
                                            onRemove(member.id)
                                        }}>Remove</button>
                                    </li>
                                    )
                                )
                            )
                        }
                    </ul>
                )
            }
        </section>
    )
}
