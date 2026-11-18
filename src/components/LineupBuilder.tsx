// LineupBuilder: the boat. Step 8 shows the boat-size toggle and the EMPTY seat grid.
// (Assigning crew to seats is step 9, so don't worry about that yet.)
//
// CONCEPTS (new in this step)
// - Derived data: the list of seats is calculated from the boat size every render (buildSeatKeys),
//   not stored in state. Less state = fewer ways for things to get out of sync.
// - Controlled by the parent: this component owns NO state. It receives `lineup` and calls
//   `onChange(newLineup)`, exactly like CrewForm and onSubmit.
// - Object spread for updates:  { ...lineup, boat: 'small' }  = a NEW object, same fields, one changed.
//   (Same idea as [...crew, member], but for objects.)
// - Iterating over a constant: Object.entries(BOATS) gives [['standard', {...}], ['small', {...}]],
//   handy for making one toggle button per boat size (like the nav buttons you wrote before).
//
// TODO, in order. Make each part work before the next one:

import type { Lineup, BoatSize } from '../data/crew'
import { BOATS, buildSeatKeys } from '../data/crew' 
import type { Category } from '../data/crew'
import { CATEGORIES } from '../data/crew'
import { Seat } from './Seat'
import type { CrewMember } from '../data/crew'
import { checkLineup } from '../data/crew'

// 1. Props and export (follow CrewList for the pattern):
interface Props{
    lineup: Lineup
    onChange: (lineup: Lineup) => void
    crew: CrewMember[] 
}

// STEP 9A (assign seats). Do it in this order, and check each part before the next:
//   1. Props: add  crew: CrewMember[]  (import the type). Pass it from LineupSection (see the comment there).
//   2. Helper, inside LineupBuilder before the return: a function that changes ONE seat.
//        function assign(seatKey: string, crewId: string | null) {
//          onChange({ ...lineup, seats: { ...lineup.seats, [seatKey]: crewId } })
//        }
//      Two spreads: the outer one copies the line-up, the inner one copies the seats object, and
//      `[seatKey]: crewId` sets ONE key. `[seatKey]` in square brackets = "use the VALUE of seatKey as the
//      key name" (without brackets the key would literally be the word seatKey).
//   3. Who can be chosen in a seat: every crew member that is NOT already in another seat, plus whoever
//      already sits in THIS seat (otherwise the dropdown could not show its own current value).
//        const seatedIds = Object.values(lineup.seats)         // ids and nulls
//        crew.filter(m => !seatedIds.includes(m.id) || m.id === lineup.seats[seatKey])
//      Derived data again: compute it during render, never store it.
//   4. Give every <Seat> its key and the new props (see the comment in Seat.tsx):
//        'signal'  /  `r${i + 1}-left`  /  `r${i + 1}-right`  /  'steers'
//
// STEP 9B (keep the data consistent). Two places can leave a seat pointing at nothing:
//   - Changing the boat to a smaller one: seats like 'r8-left' no longer exist. In the boat toggle's onClick,
//     build the new seats object keeping only keys that exist in buildSeatKeys(key):
//       const valid = buildSeatKeys(key)
//       Object.fromEntries(Object.entries(lineup.seats).filter(([seatKey]) => valid.includes(seatKey)))
//     (Object.entries -> [key, value] pairs, filter them, Object.fromEntries -> back to an object.)
//     This also gives your unused `seatKeys` line a purpose; you can move/rename it as you see fit.
//   - Removing a crew member who is seated: see the comment in App.tsx (removeCrew).
export function LineupBuilder({lineup, onChange, crew}: Props){

    function assign(seatKey: string, crewId: string | null){
        onChange({...lineup, seats: {...lineup.seats, [seatKey]: crewId}})
    }

    // STEP 9C (show the warnings), after you have written checkLineup in crew.ts:
    //   const warnings = checkLineup(lineup, crew)       // derived data again: compute it during render, no useState
    //   Then render them above or below the boat, only when there are some:
    //     {warnings.length > 0 && (
    //       <ul className="mx-auto max-w-xs px-2 text-xs text-red-600">
    //         {warnings.map(w => <li key={w}>{w}</li>)}
    //       </ul>
    //     )}
    //   `key={w}` is fine here because every message is a different string. (If two could be identical,
    //   you would need another key.) Import checkLineup from '../data/crew'.
    //   Check: Men's category + seat a woman -> a red message appears; remove her -> it disappears.

    const warnings = checkLineup(lineup, crew)



    const seatedIds = Object.values(lineup.seats)
    const availableCrew = (seatKey: string) => crew.filter(m => !seatedIds.includes(m.id) || m.id === lineup.seats[seatKey])

    function changeBoat(boat: BoatSize){
        const valid = buildSeatKeys(boat);
        const newSeats = Object.fromEntries(Object.entries(lineup.seats).filter(([seatKey]) => valid.includes(seatKey)))
        onChange({...lineup, boat, seats: newSeats})
    }

    return(
        <>
            <div className="mx-auto max-w-4xl px-6 py-4">
                {(Object.keys(BOATS) as BoatSize[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => changeBoat(key)}
                        className={`rounded-t-lg px-4 py-2 text-sm font-bold transition ${lineup.boat === key
                            ? 'bg-white text-dragon-navy shadow-sm'
                            : 'text-dragon-navy/50 hover:text-dragon-navy'
                        }`}
                    >
                        {BOATS[key].label}
                    </button>
                ))}

                {(Object.keys(CATEGORIES) as Category[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onChange({...lineup, category: key})}
                        className={`rounded-t-lg px-4 py-2 text-sm font-bold transition ${lineup.category === key
                            ? 'bg-white text-dragon-navy shadow-sm'
                            : 'text-dragon-navy/50 hover:text-dragon-navy'
                        }`}
                    >
                        {CATEGORIES[key]}
                    </button>
                ))}
            </div>  

            <div className='mx-auto max-w-xs'>
                {warnings.length > 0 && (
                    <ul className="mx-auto max-w-xs px-2 text-xs text-red-600">
                        {warnings.map(w => <li key={w}>{w}</li>)}
                    </ul>
                )}
            </div>

            <div className="mx-auto max-w-xs">
                <Seat label="Signal" value={lineup.seats.signal} options={availableCrew('signal')} onChange={(crewId) => assign('signal', crewId)} />
                <ul>
                    {Array.from({ length: BOATS[lineup.boat].rows }, (_, i) => (

                        <li key={i} className="grid grid-cols-2 gap-2 py-2 text-sm text-dragon-navy">
                            <Seat label={`Row ${i + 1} L`} value={lineup.seats[`row${i + 1}L`]} options={availableCrew(`row${i + 1}L`)} onChange={(crewId) => assign(`row${i + 1}L`, crewId)} />
                            <Seat label={`Row ${i + 1} R`} value={lineup.seats[`row${i + 1}R`]} options={availableCrew(`row${i + 1}R`)} onChange={(crewId) => assign(`row${i + 1}R`, crewId)} />
                        </li>

                    ))}
                </ul>
                <Seat label="Steers" value={lineup.seats.steers} options={availableCrew('steers')} onChange={(crewId) => assign('steers', crewId)} />
            </div>
        </>
  
    )
}