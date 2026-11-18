// CrewForm: a form to add a new crew member.
//
// CONCEPTS USED
// - Controlled inputs: each input's value comes from state, and onChange writes back into state,
//   so React is the single source of truth for what the input shows.
// - Event handlers: onChange / onSubmit are functions React calls for you.
// - "Child asks parent to change data": this form does NOT touch the crew list itself. It receives
//   a function prop `onAdd(member)` and calls it; the parent (App) owns the crew state and updates it.
//   Same pattern as MainNav's `onChange`.
// - <label htmlFor> + input `id`: links a label to its input (click-to-focus, screen readers).
import {useState} from 'react'
import type {CrewMember, Gender, Side, WeightCategory} from '../data/crew'

// STEP 7B-1 (make the form reusable for editing). Do ALL of this in this file first, and check that
// Add still works exactly as before, before touching CrewList.
//   a) Props: rename `onAdd` to `onSubmit` (same type), and add an optional  initial?: CrewMember
//      The `?` means "may be missing". Add mode: no `initial`. Edit mode: `initial` is the member being edited.
//      Remember to rename the prop where <CrewForm> is used in LineupSection.tsx (onAdd={...} -> onSubmit={...}).
//   b) Pre-fill the state from `initial`, falling back to today's defaults:
//        useState(initial?.name ?? '')            <- `?.` = "if initial exists, read .name"; `??` = "otherwise use this"
//        useState<Gender>(initial?.gender ?? 'F')   ...and the same for side and weightCategory.
//        age is a STRING in state, so:  useState(initial ? String(initial.age) : '')
//   c) The id: replace crypto.randomUUID() with  initial?.id ?? crypto.randomUUID()
//        Editing keeps the SAME id (seats will link to it later); adding makes a new one.
//   d) Reset: only clear the fields after submit when ADDING (no `initial`). When editing, the form is
//      about to disappear anyway, and resetting would be pointless.
//   e) Button text: {initial ? 'Save' : 'Add'}
interface Props {
    initial?: CrewMember                     // optional: if present, the form is in "edit" mode and pre-fills the fields
    onSubmit: (member: CrewMember) => void   // called with the finished member when the form is submitted
}

export function CrewForm({initial, onSubmit}: Props){
    // One piece of state per field. `age` is a string because inputs always give text;
    // it is converted to a number on submit.
    const [name, setName] = useState(initial?.name ?? '')
    const [gender, setGender] = useState<Gender>(initial?.gender ?? 'F')
    const [side, setSide] = useState<Side>(initial?.side ?? 'either')
    const [age, setAge] = useState(initial ? String(initial.age) : '')
    const [weightCategory, setWeightCategory] = useState<WeightCategory>(initial?.weightCategory ?? 'medium')

    // Runs when the form is submitted (Add button or Enter key).
    function handleSubmit(e: React.FormEvent){
        e.preventDefault() // stop the browser from reloading the page
        // Validate: name must not be blank, age must be a positive number.
        if(name.trim() === '' || Number(age) <= 0){
            alert('Please enter a valid name and age')
            return
        }

        // `const`: built once and never reassigned. The id is generated here and never changes.
        const member: CrewMember = {
            id: initial?.id ?? crypto.randomUUID(),
            name: name.trim(),
            gender,
            side,
            age: Number(age),
            weightCategory
        }

        onSubmit(member)

        if(!initial){
            // Reset the form fields
            setName('')
            setGender('F')
            setSide('either')
            setAge('')
            setWeightCategory('medium')
        }
    }

    return(
        // Card classes: rounded-xl = large rounded corners | border-2 = 2px border
        //   border-dragon-navy/10 = faint navy border (10% opacity) | bg-white = white background
        //   p-5 = 20px padding | shadow-sm = small soft shadow
        // (see docs/STYLING.md for classes to arrange the fields: flex flex-wrap items-end gap-3, etc.)
        <form onSubmit={handleSubmit} className="rounded-xl border-2 border-dragon-navy/10 bg-white p-5 shadow-sm">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="age">Age</label>
            <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />

            <label htmlFor="gender">Gender</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="Other">Other</option>
            </select>

            <label htmlFor="side">Side</label>
            <select id="side" value={side} onChange={(e) => setSide(e.target.value as Side)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="either">Either</option>
            </select>

            <label htmlFor="weightCategory">Weight Category</label>
            <select id="weightCategory" value={weightCategory} onChange={(e) => setWeightCategory(e.target.value as WeightCategory)}>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
            </select>

            <button type="submit">{initial ? 'Save' : 'Add'}</button>
        </form>
    )
}