import { Fuel } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Fuel className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">FUELin</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Smart planning, smart driving.
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} FUELin
          </p>
        </div>
      </div>
    </footer>
  )
}
