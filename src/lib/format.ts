import { CATEGORIES, type Category, type Exercise } from '../data/exercises'

export function formatWorkoutText(grouped: Partial<Record<Category, Exercise[]>>): string {
  const sections: string[] = []

  for (const category of CATEGORIES) {
    const items = grouped[category]
    if (!items || items.length === 0) continue

    const heading = category.toUpperCase()
    const lines = items.map((ex, i) => `${i + 1}. ${ex.name} - ${ex.measure}`)
    sections.push([heading, '-'.repeat(heading.length), ...lines].join('\n'))
  }

  return sections.join('\n\n')
}
