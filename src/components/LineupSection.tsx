// LineupSection: the Line-up area, with its own sub-navigation (Crew List | Line-up | Summary).
//
// CONCEPTS USED
// - Composition: App -> LineupSection -> CrewList (and later the line-up and summary views).
// - State lifted up: `view` lives in App (not here), so the chosen sub-tab survives switching to
//   Workout and back. If it lived here, this component would be unmounted and the state lost.
// - Conditional rendering with `&&`: `{view === 'crew' && <X />}` shows X only when the condition is true.
// - Prop forwarding: `crew` comes from App and is passed on to CrewList.
import { CrewList } from './CrewList'
import type { CrewMember } from '../data/crew'
import {CrewForm} from './CrewForm'
import {LineupBuilder} from './LineupBuilder'
import type {Lineup} from '../data/crew'
import { Summary } from './Summary'

// The three sub-tabs. Exported so App.tsx can type its `view` state with it.
export type  View = 'crew' | 'lineup'| 'summary'

interface Props {
    view: View                           // which sub-tab is active
    onChange: (view: View) => void       // call to switch sub-tab
    crew: CrewMember[]                   // the whole crew list, owned by App
    onAddCrew: (member: CrewMember) => void
    onRemoveCrew: (id: string) => void
    onUpdateCrew: (member: CrewMember) => void
    lineup: Lineup
    onLineupChange: (lineup: Lineup) => void
}

export function LineupSection({view, onChange, crew, onAddCrew, onRemoveCrew, onUpdateCrew, lineup, onLineupChange}: Props) {
    return (
        <>
            {/* Sub-nav: small pill buttons, styled differently from the top-level MainNav. */}
            {/* nav classes (same as MainNav):
                mx-auto = centre horizontally | flex = buttons in a row | max-w-4xl = max width 56rem
                gap-2 = 8px between buttons | px-6 = 24px left/right padding | pt-4 = 16px top padding */}
            <nav className="mx-auto flex max-w-4xl gap-2 px-6 pt-4">
                {(
                    [
                        ['crew', 'Crew List'],
                        ['lineup', 'Line-up'],
                        ['summary', 'Summary'],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onChange(key)}
                        // Always applied:
                        //   rounded-full = fully rounded "pill" shape
                        //   px-3 py-1    = padding 0.75rem left/right, 0.25rem top/bottom
                        //   text-xs      = extra small text (0.75rem)
                        // Active (view === key):  bg-dragon-navy text-white = navy pill with white text
                        // Inactive:               text-dragon-navy/50 = faded navy text
                        //                         hover:text-dragon-navy = full navy on mouse over
                        className={`rounded-full px-3 py-1 text-xs ${
                            view === key
                                ? 'bg-dragon-navy text-white'
                                : 'text-dragon-navy/50 hover:text-dragon-navy'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {/* Only one view is shown at a time. Line-up and Summary are placeholders for now. */}

            {/* mx-auto = centre horizontally (lines up with the nav) | max-w-4xl = max width 56rem
                px-6 = 24px left/right padding | py-4 = 16px top/bottom padding */}
            <div className="mx-auto max-w-4xl px-6 py-4">
                {view === 'crew' && 
                    <>
                        <CrewForm onSubmit={onAddCrew} />
                        <CrewList crew={crew} onRemove={onRemoveCrew} onUpdate={onUpdateCrew} />
                    </>
                }
                {/* STEP 9A (seats): LineupBuilder now also needs the crew, to fill the seat dropdowns.
                    Pass it:  crew={crew}  (and add  crew: CrewMember[]  to LineupBuilder's Props). */}
                {view === 'lineup' &&
                    <>
                        <LineupBuilder lineup={lineup} onChange={onLineupChange} crew={crew} />
                    </>
                }
                {/* STEP 10 (summary): import { Summary } from './Summary' and replace the placeholder below with
                    <Summary lineup={lineup} crew={crew} />.  No new props are needed on LineupSection: it already
                    has both. (The Summary has no onChange, because it only reads.) */}
                {view === 'summary' &&
                    <>
                        <Summary lineup={lineup} crew={crew} />
                    </>
                }
            </div>
        </>
    )
}
