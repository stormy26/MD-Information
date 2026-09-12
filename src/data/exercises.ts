export type Category =
  | 'Static Stretch'
  | 'Dynamic Stretch'
  | 'Warm-up Movement'
  | 'EMOM / AMRAP Warm-up'
  | 'Cardio / Plyo'
  | 'Strength'
  | 'Core'

export const CATEGORIES: Category[] = [
  'Static Stretch',
  'Dynamic Stretch',
  'Warm-up Movement',
  'EMOM / AMRAP Warm-up',
  'Cardio / Plyo',
  'Strength',
  'Core',
]

export interface Exercise {
  id: string
  name: string
  category: Category
  equipment: string
  measure: string
}

let nextId = 0
const id = () => `ex-${nextId++}`

const make = (
  category: Category,
  equipment: string,
  entries: [string, string][],
): Exercise[] =>
  entries.map(([name, measure]) => ({ id: id(), name, category, equipment, measure }))

export const DEFAULT_EQUIPMENT = ['Bodyweight'] as const

export const DEFAULT_EXERCISES: Exercise[] = [
  ...make('Static Stretch', 'Bodyweight', [
    ['Head stretch (L/R)', '10 counts'],
    ['Hands up', '10 counts'],
    ['Biceps stretch (L/R)', '10 counts'],
    ['Triceps stretch (L/R)', '10 counts'],
    ['Body twist (L/R)', '10 counts'],
    ['Bend forward, toe touch', '10 counts'],
    ['Sumo hold', '10 counts'],
    ["Runner's stretch (L/R)", '10 counts'],
  ]),
  ...make('Dynamic Stretch', 'Bodyweight', [
    ['Head twist (L/R)', '10 counts'],
    ['Head rotation / reverse', '10 counts'],
    ['Wrist rotation / reverse', '10 counts'],
    ['Arm rotation / reverse', '10 counts'],
    ['Shoulder rotation / reverse', '10 counts'],
    ['Side snapper', '10 counts'],
    ['Chest press', '10 counts'],
    ['Windmill', '10 counts'],
    ['Body twist', '10 counts'],
    ['Knee rotation / reverse', '10 counts'],
    ['Hip rotation / reverse', '10 counts'],
    ['Hip opener', '10 counts'],
  ]),
  ...make('Warm-up Movement', 'Bodyweight', [
    ['Calf raises', '10 reps'],
    ['Alternate forward lunges', '10 reps'],
    ['Alternate side lunges', '10 reps'],
    ['Alternate leg raises', '10 reps'],
    ['Body squats', '10 reps'],
    ['Burpees (no push-up)', '5 reps'],
    ['High knees', '10 reps'],
    ['Jumping jacks', '20 reps'],
    ['Jogging', '2 rounds'],
  ]),
  ...make('EMOM / AMRAP Warm-up', 'Bodyweight', [
    ['Toe touch to squats', '30 sec'],
    ['Toe touch to squats w/ overhead reach', '30 sec'],
    ['Inchworms', '30 sec'],
    ['90/90', '30 sec'],
    ['Quadruped shoulder rotation', '30 sec'],
  ]),
  ...make('Cardio / Plyo', 'Bodyweight', [
    ['Burpees', '10 reps'],
    ['Sprawl', '1 rep'],
    ['Mountain climbers', '30 sec'],
    ['Alternating jumping lunges', '20 reps'],
    ['Broad jump', '10 reps'],
    ['Squat jumps', '20 reps'],
    ['Jump squats', '10 reps'],
    ['Lateral high knees', '20 reps'],
    ['Alternating lunges with twist', '20 reps'],
  ]),
  ...make('Strength', 'Bodyweight', [
    ['Air squats', '25 reps'],
    ['Squats with calf raise', '20 reps'],
    ['Cossack squats, side to side', '10 reps per side'],
    ['Wall squats', '30 sec'],
    ['Reverse bear crawl', '10 reps'],
    ['Fire hydrant (alternate sides)', '20 reps'],
    ['Superman', '25 reps'],
  ]),
  ...make('Core', 'Bodyweight', [
    ['High plank', '30 sec'],
    ['High plank, bent knees', '30 sec'],
    ['High plank with toe touch', '20 pairs'],
    ['High plank with shoulder tap', '30 reps total'],
    ['Side plank (L then R)', '30 sec'],
    ['Bicycle crunches', '30 reps total'],
    ['Butterfly crunches', '15 reps'],
    ['Butterfly sit-ups', '10 reps'],
    ['Russian twist', '20 pairs'],
    ['Leg raises', '15 reps'],
    ['Flutter kicks', '30 reps'],
  ]),
]
