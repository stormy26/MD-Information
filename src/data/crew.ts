// Crew data model: the shared TypeScript types for people in the team.
// Only types and constants live here (no React), so any component can import them.
//
// CONCEPTS USED
// - Union type (`'a' | 'b'`): a value may only be one of the listed options. TypeScript flags typos.
// - Interface: describes the shape (fields and their types) of an object.
// - Record<K, V>: an object whose keys are K and whose values are V.

// Fixed lists of allowed choices.
export type Gender = 'F' | 'M' | 'Other'
export type Side = 'left' | 'right' | 'either' // the side the paddler prefers
export type BoatSize = 'standard' | 'small'
export type WeightCategory = 'light' | 'medium' | 'heavy' // a band instead of exact kg

// One person in the crew.
export interface CrewMember {
  // Unique and never changes, even if the name is edited. Used as the React `key`
  // and (later) to link a boat seat to a person.
  id: string
  name: string
  gender: Gender
  side: Side
  age: number
  weightCategory: WeightCategory
}

export const BOATS: Record<BoatSize, {label: string; rows: number}> = {
    standard: {label: 'Standard', rows: 10},
    small: {label: 'Small', rows: 5}
}

// STEP 8c (masters is a MODIFIER, not a category). Masters combines with any category, so a line-up is now
// three independent choices: boat size x category x masters on/off. Change the model like this:
//   a) Category loses 'masters':  'mens' | 'womens' | 'mixed'
//   b) Remove the `masters: 'Masters'` line from CATEGORIES below (Record<Category, string> will force
//      the two to stay in sync: TypeScript errors if CATEGORIES has a key that Category doesn't).
//   c) Add  masters: boolean  to the Lineup interface and  masters: false  to DEFAULT_LINEUP.
//   d) In LineupBuilder: replace the 4th category button with a checkbox:
//        <input type="checkbox" checked={lineup.masters} onChange={(e) => onChange({...lineup, masters: e.target.checked})} />
//      (a controlled input, like CrewForm, but `checked` + e.target.checked instead of `value` + e.target.value.)
//   e) Clear 'md-lineup' in DevTools > Application > Local Storage: the saved object has no `masters` field
//      (and may still hold category 'masters').
//
// RULES, decided (coded in step 9, NOT now). They only WARN, they never block seating:
//   - mens:    every paddler has gender 'M'
//   - womens:  every paddler has gender 'F'
//   - mixed:   equal numbers of men and women (standard 10 + 10, small 5 + 5)
//   - masters: every paddler is age >= 45 (on top of the category rule)
//   - "paddler" = a seat in a row. Signal and steers are not counted for these checks.
//   - gender 'Other' counts toward no group in mixed, so it is simply not matched (open question for later).
export type Category = 'mens' | 'womens' | 'mixed' | 'masters'

export const CATEGORIES: Record<Category, string> = {
    mens: "Men's",
    womens: "Women's",
    mixed: 'Mixed',
    masters: 'Masters'
}
export interface Lineup{
  boat: BoatSize
  seats: Record<string, string | null> // maps a seat key (like 'r3-left') to the id of the crew member sitting there, or null if empty
  category: Category
}

export const DEFAULT_LINEUP: Lineup = {
  boat: 'standard',
  seats: {},
  category: 'mixed'
}

export function buildSeatKeys(boat: BoatSize): string[]{
  const seatKeys: string[] = ['signal'];
  const {rows} = BOATS[boat];
  for(let n = 1; n <= rows; n++){
    seatKeys.push(`row${n}L`, `row${n}R`);
  }
  seatKeys.push('steers');
  return seatKeys;
}

// checkLineup: checks the boat against the rules of its category and returns a list of warnings.
// [] means no rule is broken. It only REPORTS problems; it never stops you from seating someone.
//
// CONCEPTS USED
// - Pure function: the result depends only on the arguments (lineup, crew). No React, no state, so the
//   Summary view can call the very same function.
// - Chained array methods: keys -> filter -> map -> filter turns seat names into the people sitting in them.
// - Type guard (`m is CrewMember`): tells TypeScript that the array no longer contains undefined.
// - reduce: walks over the paddlers carrying the `messages` array along and returns it at the end.
// - switch on the category: each category has its own rule.
//
// RULES (warn only; "paddler" = a seat in a row, signal and steers are not checked)
//   mens: all 'M' | womens: all 'F' | mixed: no more than half the paddler seats of one gender
//   masters: the mixed rule, plus every paddler is age >= 45
export function checkLineup(lineup: Lineup, crew: CrewMember[]) : string[]{
  // Only the paddler seats: every seat of this boat except the signal and the steers.
  const paddlerKeys = buildSeatKeys(lineup.boat).filter(k => k !== 'signal' && k !== 'steers')
  // The people sitting in those seats. find() gives undefined for an empty seat (or an id of someone who
  // was removed), and the filter drops those, so only real crew members are left.
  const paddlers = paddlerKeys
  .map(k => crew.find(m => m.id === lineup.seats[k]))
  .filter((m):m is CrewMember => m !== undefined)

  const messages: string[] = []

  for(const m of paddlers){
     if(lineup.category === 'mens' && m.gender !== 'M')
      messages.push(`${m.name} is not a male paddler.`)
     if(lineup.category === 'womens' && m.gender !== 'F')
      messages.push(`${m.name} is not a female paddler.`)
     if(lineup.category === 'masters' && m.age < 45)
      messages.push(`${m.name} is not old enough for Masters (age ${m.age}).`)
  }

  if(lineup.category === 'mixed' || lineup.category === 'masters'){
    const men = paddlers.filter(m => m.gender === 'M').length
    const women = paddlers.filter(m => m.gender === 'F').length
    if(men > Math.floor(paddlerKeys.length / 2))
      messages.push(`Too many men (${men}) for a mixed boat of ${paddlerKeys.length} paddlers.`)
    if(women > Math.floor(paddlerKeys.length / 2))
      messages.push(`Too many women (${women}) for a mixed boat of ${paddlerKeys.length} paddlers.`)
  }

  return messages;
}
// STEP 9C (category warnings) - add a function here. It only REPORTS problems; it never blocks seating.
