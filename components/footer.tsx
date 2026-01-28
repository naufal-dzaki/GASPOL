import { Fuel } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Fuel className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold tracking-tight">
              <span className="text-secondary-foreground">GAS</span>
              <span className="italic text-primary">POL</span>
            </span>
          </div>
          <p className="text-sm text-secondary-foreground/70">
            &copy; {new Date().getFullYear()} GASPOL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
