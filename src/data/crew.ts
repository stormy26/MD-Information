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

// Boat sizes and how many rows each has (a row = one left + one right seat).
// Record<BoatSize, ...> forces an entry for EVERY BoatSize, so none can be forgotten.
export const BOATS: Record<BoatSize, {label: string; rows: number}> = {
    standard: {label: 'Standard', rows: 10},
    small: {label: 'Small', rows: 5}
}
