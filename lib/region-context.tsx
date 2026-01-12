"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { regions,getRegion } from "./regions"
import type { Region } from "./types"
import { set } from "date-fns"
interface RegionContextType {
  region: Region
  setRegion: (regionId: string) => void
  regions: Region[]
  formatPrice: (amount: number) => string
}

const RegionContext = createContext<RegionContextType | null>(null)

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(regions[0])

  const setRegion = (regionId: string) => {
    const selected = getRegion(regionId);
    if(selected)setRegionState(selected);
  }

  const formatPrice = (amount: number) => {
    return `${region.currencySymbol}${amount.toFixed(2)}`
  }

  return <RegionContext.Provider value={{ region, setRegion, regions, formatPrice }}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider")
  }
  return context
}
