import { useState } from 'react'
import { ExerciseManager } from './components/ExerciseManager'
import { Header } from './components/Header'
import { WorkoutBuilder } from './components/WorkoutBuilder'
import { DEFAULT_EXERCISES, type Exercise } from './data/exercises'
import { useLocalStorage } from './hooks/useLocalStorage'

type Tab = 'builder' | 'manage'

function App() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(
    'md-exercises',
    DEFAULT_EXERCISES,
  )
  const [tab, setTab] = useState<Tab>('builder')

  return (
    <div className="min-h-screen bg-dragon-cream">
      <Header />

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
            className={`rounded-t-lg px-4 py-2 text-sm font-bold transition ${
              tab === key
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
      )}

      <footer className="py-8 text-center text-xs font-semibold uppercase tracking-widest text-dragon-navy/40">
        Manila Dragons
      </footer>
    </div>
  )
}

export default App
