
// STEP 9A: a Seat becomes a dropdown. New props (replace the inline `{label: string}` type with an interface):
//   label: string                        (as now)
//   value: string | null                 the id of the crew member in this seat, or null
//   options: CrewMember[]                who may be chosen (LineupBuilder works this out)
//   onChange: (crewId: string | null) => void
// Replace the <span> with a <select>, same idea as the selects in CrewForm:
//   <select value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}>
//     <option value="">(empty)</option>
//     {options.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
//   </select>
// Why value ?? '': a <select> value must be a string, so null (empty seat) is shown as the "" option.
// Why the ternary in onChange: choosing "(empty)" gives '' and you store null for an empty seat, not ''.
import type { CrewMember } from '../data/crew'

interface Props{
    label: string
    value: string | null
    options: CrewMember[]
    onChange: (crewId: string | null) => void
}

export function Seat({label, value, options, onChange}: Props){
    return(
        <div className="rounded-lg border-2 border-dragon-navy/10 bg-white p-2 text-center text-xs">
            <p className="mb-1 font-semibold text-dragon-navy/60">{label}</p>
            <select 
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value === '' ? null :e.target.value)}
            >
                <option value="">(empty)</option>
                {options.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
        </div>
    )
}