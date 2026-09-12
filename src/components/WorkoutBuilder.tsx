import { useMemo, useState } from 'react'
import { CATEGORIES, type Category, type Exercise } from '../data/exercises'
import { formatWorkoutText } from '../lib/format'
import { sampleWithoutReplacement } from '../lib/randomize'

interface Props {
  exercises: Exercise[]
}

const emptyCounts = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>

export function WorkoutBuilder({ exercises }: Props) {
  const equipmentOptions = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.equipment))).sort(),
    [exercises],
  )

  const [activeEquipment, setActiveEquipment] = useState<Set<string>>(
    () => new Set(equipmentOptions),
  )
  const [counts, setCounts] = useState<Record<Category, number>>(emptyCounts)
  const [result, setResult] = useState<Partial<Record<Category, Exercise[]>>>({})
  const [copied, setCopied] = useState(false)

  const poolByCategory = useMemo(() => {
    const map = {} as Record<Category, Exercise[]>
    for (const category of CATEGORIES) {
      map[category] = exercises.filter(
        (ex) => ex.category === category && activeEquipment.has(ex.equipment),
      )
    }
    return map
  }, [exercises, activeEquipment])

  const toggleEquipment = (value: string) => {
    const next = new Set(activeEquipment)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setActiveEquipment(next)
  }

  const setCount = (category: Category, value: number) => {
    const max = poolByCategory[category].length
    const clamped = Math.max(0, Math.min(value, max))
    setCounts({ ...counts, [category]: clamped })
  }

  const generate = () => {
    const grouped: Partial<Record<Category, Exercise[]>> = {}
    for (const category of CATEGORIES) {
      const count = counts[category]
      if (count > 0) {
        grouped[category] = sampleWithoutReplacement(poolByCategory[category], count)
      }
    }
    setResult(grouped)
    setCopied(false)
  }

  const totalPicked = Object.values(result).reduce((sum, items) => sum + (items?.length ?? 0), 0)

  const copyText = async () => {
    const text = formatWorkoutText(result)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable; user can still read the result on screen
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="order-2 space-y-6 lg:order-1">
        <section className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-dragon-navy">Equipment</h2>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => toggleEquipment(eq)}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                  activeEquipment.has(eq)
                    ? 'border-dragon-navy bg-dragon-navy text-white'
                    : 'border-dragon-navy/20 text-dragon-navy/60'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-dragon-navy">Exercises per category</h2>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const max = poolByCategory[cat].length
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-sm text-dragon-navy">{cat}</span>
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={counts[cat]}
                    onChange={(e) => setCount(cat, Number(e.target.value))}
                    className="w-16 rounded border border-dragon-navy/20 px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setCount(cat, max)}
                    disabled={max === 0}
                    className="text-xs font-semibold text-dragon-red hover:underline disabled:opacity-30"
                  >
                    use all ({max})
                  </button>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={Object.values(counts).every((c) => c === 0)}
            className="mt-4 w-full rounded-lg bg-dragon-red px-5 py-2 font-bold text-white shadow transition hover:bg-dragon-red-dark disabled:opacity-40"
          >
            Build Workout
          </button>
        </section>
      </div>

      <div className="order-1 lg:order-2">
        <section className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-dragon-navy">Your Workout</h2>
            {totalPicked > 0 && (
              <button
                type="button"
                onClick={copyText}
                className="rounded-lg border border-dragon-navy/20 px-3 py-1 text-xs font-bold text-dragon-navy hover:bg-dragon-cream/60"
              >
                {copied ? 'Copied!' : 'Copy as Text'}
              </button>
            )}
          </div>

          {totalPicked === 0 ? (
            <p className="text-sm text-dragon-navy/50">
              Set a count for each category you want (e.g. Static Stretch, Dynamic Stretch,
              Warm-up Movement) and hit Build Workout.
            </p>
          ) : (
            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const items = result[cat]
                if (!items || items.length === 0) return null
                return (
                  <div key={cat}>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-dragon-red">
                      {cat}
                    </p>
                    <ol className="space-y-1">
                      {items.map((ex, i) => (
                        <li
                          key={ex.id}
                          className="flex items-start justify-between gap-2 rounded-lg bg-dragon-cream/60 px-3 py-2"
                        >
                          <span className="text-sm font-medium text-dragon-ink">
                            <span className="mr-2 text-dragon-navy/50">{i + 1}.</span>
                            {ex.name}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-dragon-navy/60">
                            {ex.measure}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
