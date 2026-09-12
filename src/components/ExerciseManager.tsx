import { useState } from 'react'
import { CATEGORIES, DEFAULT_EXERCISES, type Category, type Exercise } from '../data/exercises'

interface Props {
  exercises: Exercise[]
  onChange: (exercises: Exercise[]) => void
}

const emptyDraft = { name: '', category: CATEGORIES[0], equipment: 'Bodyweight', measure: '' }

export function ExerciseManager({ exercises, onChange }: Props) {
  const [draft, setDraft] = useState<{
    name: string
    category: Category
    equipment: string
    measure: string
  }>(emptyDraft)

  const addExercise = () => {
    if (!draft.name.trim()) return
    onChange([
      ...exercises,
      {
        id: `ex-custom-${Date.now()}`,
        name: draft.name.trim(),
        category: draft.category,
        equipment: draft.equipment.trim() || 'Bodyweight',
        measure: draft.measure.trim() || '—',
      },
    ])
    setDraft(emptyDraft)
  }

  const removeExercise = (id: string) => {
    onChange(exercises.filter((ex) => ex.id !== id))
  }

  const updateExercise = (id: string, patch: Partial<Exercise>) => {
    onChange(exercises.map((ex) => (ex.id === id ? { ...ex, ...patch } : ex)))
  }

  const resetToDefaults = () => {
    if (confirm('Reset the exercise list back to the built-in defaults?')) {
      onChange(DEFAULT_EXERCISES)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <section className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dragon-navy">Add an exercise</h2>
          <button
            type="button"
            onClick={resetToDefaults}
            className="text-xs font-semibold text-dragon-red hover:underline"
          >
            Reset to defaults
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Exercise name"
            className="min-w-[10rem] flex-1 rounded border border-dragon-navy/20 px-3 py-2 text-sm"
          />
          <select
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
            className="rounded border border-dragon-navy/20 px-3 py-2 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            value={draft.equipment}
            onChange={(e) => setDraft({ ...draft, equipment: e.target.value })}
            placeholder="Equipment"
            className="w-32 rounded border border-dragon-navy/20 px-3 py-2 text-sm"
          />
          <input
            value={draft.measure}
            onChange={(e) => setDraft({ ...draft, measure: e.target.value })}
            placeholder="e.g. 10 reps"
            className="w-32 rounded border border-dragon-navy/20 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addExercise}
            className="rounded-lg bg-dragon-navy px-4 py-2 text-sm font-bold text-white hover:bg-dragon-navy-dark"
          >
            Add
          </button>
        </div>
      </section>

      <section className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-dragon-navy">
          Exercise pool ({exercises.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-dragon-navy/10 text-xs uppercase tracking-wide text-dragon-navy/60">
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Equipment</th>
                <th className="py-2 pr-2">Measure</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id} className="border-b border-dragon-navy/5">
                  <td className="py-2 pr-2">
                    <input
                      value={ex.name}
                      onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                      className="w-full rounded border border-transparent px-2 py-1 hover:border-dragon-navy/20 focus:border-dragon-navy/40"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <select
                      value={ex.category}
                      onChange={(e) =>
                        updateExercise(ex.id, { category: e.target.value as Category })
                      }
                      className="rounded border border-transparent px-2 py-1 hover:border-dragon-navy/20 focus:border-dragon-navy/40"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      value={ex.equipment}
                      onChange={(e) => updateExercise(ex.id, { equipment: e.target.value })}
                      className="w-24 rounded border border-transparent px-2 py-1 hover:border-dragon-navy/20 focus:border-dragon-navy/40"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      value={ex.measure}
                      onChange={(e) => updateExercise(ex.id, { measure: e.target.value })}
                      className="w-28 rounded border border-transparent px-2 py-1 hover:border-dragon-navy/20 focus:border-dragon-navy/40"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeExercise(ex.id)}
                      className="text-dragon-red hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
