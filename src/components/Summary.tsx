// Summary: a read-only overview of the line-up. Step 10.
//
// CONCEPTS (new in this step)
// - Everything here is DERIVED data: counts, lists and averages calculated from `lineup` and `crew` during
//   render. There is NO useState in this component, and no onChange prop (it never changes anything).
//   Less state = nothing that can get out of sync with the boat.
// - Reusing code: checkLineup (step 9C) already gives the warnings, so call it, don't rewrite it.
// - Counting with filter(...).length, and deriving the total from the boat size (see 3 to 5).
//
// TODO, in order. Make each part show up on the page before the next one:
//
// 1. Props and export (same pattern as LineupBuilder, but without onChange):
//      interface Props { lineup: Lineup; crew: CrewMember[] }
//      export function Summary({lineup, crew}: Props) { ... }
//    Return a <p>{crew.length} crew</p> first and check it shows on the Summary tab.

import type { CrewMember, Lineup } from "../data/crew";

//
interface Props{
    lineup: Lineup
    crew: CrewMember[]
}

// WIP: `lineup` is left out of the destructuring for now (unused = build error). Put it back ({lineup, crew})
// when you uncomment the lines below that use it. The Props interface still lists it.
export function Summary({crew}: Props){
    // const seatedIds = Object.values(lineup.seats)
    // const riding = crew.filter(m => seatedIds.includes(m.id))
    // WIP (commented out so the Netlify build passes: unused variables fail `tsc`). Uncomment each one when
    // you show it in the return below.
    // const notRiding = crew.filter(m => !seatedIds.includes(m.id))
    // const entries = Object.entries(lineup.seats)
    // const left = entries.filter(([seatKey, id]) => id !== null && seatKey.endsWith('L')).length

    // These two lines compute a number but do not store it anywhere. Assign them to a const (and use ===):
    // riding.filter(m => m.gender == "F").length
    // riding.filter(m => m.gender == "M").length

    // const paddlersRiding = entries.filter(([seatKey, id]) => id != null && seatKey !== 'signal' && seatKey !== 'steers').length

    return(
        <>
            <section>
                <h2>
                    {/* WIP: was a half-typed `{of {crew.length}` (syntax error). The riding count comes back
                        when `riding` / `paddlersRiding` above are uncommented. */}
                    Riding of {crew.length}
                </h2>
            </section>
        </>
    )
}
// 2. Who is riding?  A crew member is riding when their id appears in the seats:
//      const seatedIds = Object.values(lineup.seats)            // ids and nulls
//      const riding = crew.filter(m => seatedIds.includes(m.id))
//      const notRiding = crew.filter(m => !seatedIds.includes(m.id))
//    Start from `crew`, not from the seats, so an id left behind by a removed crew member can never count.
//    Show: "Riding: X of Y", then two lists of names (riding / not riding). Use .map with key={m.id}, and an
//    empty-state message ("Nobody is seated yet") like CrewList has.
//
// 3. Left and right counts: the SEAT decides the side, not the person's preference. Count the seats that
//    are filled and whose key ends in 'L' or 'R':
//      const entries = Object.entries(lineup.seats)              // [seatKey, crewId | null] pairs
//      const left  = entries.filter(([seatKey, id]) => id !== null && seatKey.endsWith('L')).length
//    Same for 'R'. 'signal' and 'steers' end in neither, so they are not counted. (`endsWith` is a string
//    method: 'row3L'.endsWith('L') is true.)
//

// 4. Gender split: count how many of the riding members are in each group.
//      riding.filter(m => m.gender === 'F').length
//    (Weight split and average age are NOT needed, skip them.)
//
// 5. Paddlers riding: how many of the PADDLER seats are filled. Paddler seats are the row seats, so signal and
//    steers are left out. Reuse the entries from step 3:
//      const paddlersRiding = entries.filter(([seatKey, id]) => id !== null && seatKey !== 'signal' && seatKey !== 'steers').length
//    Show it against the total number of paddler seats of this boat:  "Paddlers: X of Y".
//    Y comes from the boat size, not from a number you type in:
//      BOATS[lineup.boat].rows * 2        (10 rows -> 20 paddler seats, 5 rows -> 10)
//    (Import BOATS from '../data/crew'.) Optionally also show 'Signal' and 'Steers' as filled / empty, using
//    lineup.seats.signal and lineup.seats.steers.
//
// 6. Warnings: const warnings = checkLineup(lineup, crew) and show them in the same red list as
//    LineupBuilder. If you end up with the same JSX twice, that is a sign to pull it out into a small
//    <Warnings warnings={...} /> component (optional, can wait for step 11).
//
// 7. Layout: a card in the same style as CrewList (rounded-xl border-2 border-dragon-navy/10 bg-white p-5
//    shadow-sm), with the numbers in a grid of small boxes: grid grid-cols-2 gap-3 (see docs/STYLING.md).
//
// OPTIONAL, only if time allows: a "side mismatch" count: riding members whose preference is 'left' but who sit
// in a right seat (or the other way round). 'either' never mismatches.
//
// Check: seat a few people, then compare every number with the Line-up tab by eye. Remove someone from the crew
// list and make sure the Summary updates. Reload: it should still be correct (it is all computed from saved data).
