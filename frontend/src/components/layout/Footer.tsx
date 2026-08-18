export function Footer() {
  return (
    <footer className="bg-ink text-canvas-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-xl text-primary">EcoFinds</p>
        <p className="text-sm text-canvas-soft/70">
          A second-hand marketplace. Built for the Odoo hackathon.
        </p>
      </div>
    </footer>
  )
}
