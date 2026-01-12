"use client"

import { useRegion } from "@/lib/region-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function RegionSelector() {
  const { region, setRegion, regions } = useRegion()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glass neon-border-cyan gap-2 bg-transparent">
          <Globe className="h-4 w-4 text-primary" />
          <span>{region.name}</span>
          <span className="text-muted-foreground">({region.currencySymbol})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass">
        {regions.map((r) => (
          <DropdownMenuItem
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={region.id === r.id ? "bg-primary/20" : ""}
          >
            <span className="flex-1">{r.name}</span>
            <span className="text-muted-foreground ml-2">{r.currencySymbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
