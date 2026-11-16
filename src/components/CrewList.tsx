// CrewList: displays the whole crew as a card with one row per member (display only, no editing yet).
//
// CONCEPTS USED
// - Rendering a list: crew.map() turns each CrewMember into an <li>.
// - `key={member.id}`: React needs a stable, unique key per item to track list changes (never the index).
// - Empty state: a message is shown when the list is empty.
// - CSS grid (`grid grid-cols-5`): every row has five equal columns, so the values line up across rows.
import type {CrewMember} from '../data/crew'

interface Props {
    crew: CrewMember[]   // owned by App, passed down; this component only reads it
}

export function CrewList({crew}: Props){

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
                                // Row classes:
                                //   grid grid-cols-5 = a grid with 5 equal columns (one per <span>), so values line up
                                //   gap-2            = 8px space between columns
                                //   py-2             = 0.5rem padding top and bottom
                                //   text-sm          = small text (0.875rem)
                                //   text-dragon-navy = brand navy text colour
                                <li key={member.id} className="grid grid-cols-5 gap-2 py-2 text-sm text-dragon-navy">
                                    <span>{member.name}</span>
                                    <span>{member.gender}</span>
                                    <span>{member.side}</span>
                                    <span>{member.age}</span>
                                    <span>{member.weightCategory}</span>
                                </li>
                                )
                            )
                        }
                    </ul>
                )
            }
        </section>
    )
}
