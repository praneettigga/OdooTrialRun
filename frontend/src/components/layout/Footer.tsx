export function Footer() {
  return (
    <footer className="bg-ink text-canvas-soft">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-2xl text-primary">EcoFinds</p>
            <p className="mt-3 text-sm text-canvas-soft/70">
              A second-hand marketplace. Furniture, books, bikes and electronics — listed by the
              people who already own them.
            </p>
          </div>

          <nav className="flex gap-6" aria-label="Footer">
            <a
              href="#listings"
              className="text-sm font-semibold text-canvas-soft/90 underline-offset-4 hover:text-primary hover:underline"
            >
              Browse
            </a>
            <a
              href="#how"
              className="text-sm font-semibold text-canvas-soft/90 underline-offset-4 hover:text-primary hover:underline"
            >
              How it works
            </a>
          </nav>
        </div>

        <div className="mt-10 border-t border-canvas-soft/10 pt-6">
          <p className="text-sm text-canvas-soft/50">Built for the Odoo hackathon.</p>
        </div>
      </div>
    </footer>
  )
}
