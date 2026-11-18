import { useState } from 'react'
import { ExerciseManager } from './components/ExerciseManager'
import { Header } from './components/Header'
import { WorkoutBuilder } from './components/WorkoutBuilder'
import { DEFAULT_EXERCISES, type Exercise } from './data/exercises'
import { useLocalStorage } from './hooks/useLocalStorage'
import { MainNav, type Section } from './components/MainNav'
import { LineupSection, type View} from './components/LineupSection'
import type { CrewMember } from './data/crew'
import type { Lineup } from './data/crew'
import { DEFAULT_LINEUP } from './data/crew'

// App: the root component. It owns the data and navigation state that several children share
// (lifting state up), and passes it down to them as props.
//
// STRUCTURE
//   Header
//   MainNav                -> chooses `section` (Line-up | Workout)
//   section === 'workout'  -> the original workout tabs (Randomizer | Manage Exercises)
//   section === 'lineup'   -> LineupSection -> chooses `view` (Crew List | Line-up | Summary)
//   footer

// Tabs inside the Workout section (existing feature).
type Tab = 'builder' | 'manage'

function App() {
  // Saved in the browser's localStorage under the key 'md-exercises'.
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(
    'md-exercises',
    DEFAULT_EXERCISES,
  )

  // Crew list, saved under 'md-crew'. The initial value (the dummy member) is used ONLY when nothing is
  // saved yet; after the first run the saved data wins. Reset it via DevTools > Application > Local Storage.
  // `setCrew` is not used yet; it will be, once the add form is wired in.
  // STEP 6 (wiring): once the form works, change the starting value below back to [] and clear
  //   'md-crew' in DevTools > Application > Local Storage, because saved data wins over the start value.
  const [crew, setCrew] = useLocalStorage<CrewMember[]>('md-crew', [])

  // STEP 6 (wiring): add a handler here:
  //   function addCrew(member: CrewMember) { setCrew([...crew, member]) }
  //   [...crew, member] builds a NEW array (old items + the new one). Never crew.push(member):
  //   React only re-renders when state is replaced, not mutated.

  function addCrew(member: CrewMember){
    setCrew([...crew, member])
  }

  // STEP 9B: when a crew member is removed, free their seat too. After setCrew, also call setLineup with a
  //   new `seats` object that drops every entry whose value is that id:
  //     Object.fromEntries(Object.entries(lineup.seats).filter(([, seatedId]) => seatedId !== id))
  //   (`[, seatedId]` = skip the key, take only the value. Same placeholder idea as `_` earlier.)
  //   NOTE: `lineup` and `setLineup` are declared further down in App(). A function body only runs when
  //   called, so it can use them, but check the order if TypeScript complains.
  function removeCrew(id: string){
    setCrew(crew.filter(member => member.id !== id))
    setLineup({...lineup, seats: Object.fromEntries(Object.entries(lineup.seats).filter(([, seatedId]) => seatedId !== id))})
  }

  function updateCrew(updated: CrewMember){
    setCrew(crew.map(member => member.id === updated.id ? updated : member))
  }

  // STEP 8 (boat): add the line-up state here, next to `crew`, in the same way:
  //   const [lineup, setLineup] = useLocalStorage<Lineup>('md-lineup', DEFAULT_LINEUP)
  //   (import Lineup and DEFAULT_LINEUP from './data/crew'). It lives in App, like `crew`, so it survives
  //   switching tabs and so the Summary view can read it later.
  //   Then pass both down:  <LineupSection ... lineup={lineup} onLineupChange={setLineup} />
  //   (setLineup can be passed directly: its type already matches (lineup: Lineup) => void.)

  // Navigation state. Kept here (not in the child components) so it survives switching sections:
  // a component loses its own state when it is removed from the screen.
  const [tab, setTab] = useState<Tab>('builder')       // sub-tab inside Workout
  const [section, setSection] = useState<Section>('lineup') // top-level section
  const [view, setView] = useState<View>('crew')       // sub-tab inside Line-up
  const [lineup, setLineup] = useLocalStorage<Lineup>('md-lineup', DEFAULT_LINEUP)

  return (
    // min-h-screen = at least as tall as the window | bg-dragon-cream = brand cream page background
    <div className="min-h-screen bg-dragon-cream">
      <Header />
      <MainNav section={section} onChange={setSection} />


        {/* Conditional rendering: show the Workout area or the Line-up area. The <> </> Fragment groups
            the workout nav and its content without adding an extra element to the page. */}
        {section === 'workout' ? (
          <>
          {/* Workout sub-tabs. mx-auto = centre | flex = row | max-w-4xl = max width 56rem
              gap-2 = 8px between buttons | px-6 = 24px side padding | pt-4 = 16px top padding */}
          <nav className="mx-auto flex max-w-4xl gap-2 px-6 pt-4">
            {(
              [
                ['builder', 'Randomizer'],
                ['manage', 'Manage Exercises'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                // Same classes as the MainNav tabs: rounded-t-lg (top corners rounded) | px-4 py-2 (padding)
                // text-sm | font-bold | transition (smooth colour change).
                // Active: bg-white text-dragon-navy shadow-sm. Inactive: faded navy (/50), full navy on hover.
                className={`rounded-t-lg px-4 py-2 text-sm font-bold transition ${tab === key
                  ? 'bg-white text-dragon-navy shadow-sm'
                  : 'text-dragon-navy/50 hover:text-dragon-navy'
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === 'builder' ? (
              <WorkoutBuilder exercises={exercises} />
            ) : (
              <ExerciseManager exercises={exercises} onChange={setExercises} />
            )
          }
        </>
        )
        : (
          <LineupSection
            view={view}
            onChange={setView}
            crew={crew}
            onAddCrew={addCrew}
            onRemoveCrew={removeCrew}
            onUpdateCrew={updateCrew}
            lineup={lineup}
            onLineupChange={setLineup}
          />
        )
      }

      {/* Footer: py-8 = 32px top/bottom padding | text-center = centred text | text-xs = extra small text
          font-semibold = semi-bold | uppercase = ALL CAPS | tracking-widest = very wide letter spacing
          text-dragon-navy/40 = navy at 40% opacity (faded) */}
      <footer className="py-8 text-center text-xs font-semibold uppercase tracking-widest text-dragon-navy/40">
        Manila Dragons
      </footer>
    </div>
  )
}

export default App
