import type { Region } from "./types"

export const regions: Region[] = [
  {
    id: "in",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    taxName: "GST",
    taxRates: [0, 5, 12, 18, 28],
    defaultTaxRate: 18,
  },
  {
    id: "us",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    taxName: "Sales Tax",
    taxRates: [0, 5, 7, 8.25, 10],
    defaultTaxRate: 8.25,
  },
  {
    id: "uk",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    taxName: "VAT",
    taxRates: [0, 5, 20],
    defaultTaxRate: 20,
  },
  {
    id: "eu",
    name: "European Union",
    currency: "EUR",
    currencySymbol: "€",
    taxName: "VAT",
    taxRates: [0, 5, 10, 20, 25],
    defaultTaxRate: 20,
  },
  {
    id: "ae",
    name: "UAE",
    currency: "AED",
    currencySymbol: "د.إ",
    taxName: "VAT",
    taxRates: [0, 5],
    defaultTaxRate: 5,
  },
  {
    id: "jp",
    name: "Japan",
    currency: "JPY",
    currencySymbol: "¥",
    taxName: "Consumption Tax",
    taxRates: [0, 8, 10],
    defaultTaxRate: 10,
  },
]

export function getRegion(id: string): Region {
  return regions.find((r) => r.id === id) || regions[0]
}

export function formatCurrency(amount: number, regionId: string): string {
  const region = getRegion(regionId)
  return `${region.currencySymbol}${amount.toFixed(2)}`
}
