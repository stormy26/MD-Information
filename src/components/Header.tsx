export function Header() {
  return (
    <header className="relative overflow-hidden bg-dragon-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-dragon-navy/5 to-transparent" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 py-10 text-center">
        <div className="flex overflow-hidden rounded-full border-4 border-dragon-ink shadow-sm">
          <span className="bg-dragon-navy px-3 py-1" />
          <span className="bg-dragon-red px-3 py-1" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-dragon-navy sm:text-5xl">
          MANILA <span className="text-dragon-red">DRAGONS</span>
        </h1>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dragon-navy/70">
          Team Workout Builder
        </p>
      </div>
    </header>
  )
}
