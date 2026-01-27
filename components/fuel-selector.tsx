"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FuelProviderWithPrices } from "@/lib/types"
import { Fuel } from "lucide-react"

interface FuelSelectorProps {
  providers: FuelProviderWithPrices[]
  onFuelPriceChange: (fuelPriceId: number) => void
}

export function FuelSelector({ providers, onFuelPriceChange }: FuelSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedFuel, setSelectedFuel] = useState<string>("")
  const [fuels, setFuels] = useState<FuelProviderWithPrices["fuelPrices"]>([])

  useEffect(() => {
    if (selectedProvider) {
      const provider = providers.find((p) => p.id.toString() === selectedProvider)
      setFuels(provider?.fuelPrices || [])
      setSelectedFuel("")
    }
  }, [selectedProvider, providers])

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value)
  }

  const handleFuelChange = (value: string) => {
    setSelectedFuel(value)
    onFuelPriceChange(parseInt(value))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Fuel className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">Bahan Bakar</Label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Provider BBM *</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id.toString()}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Jenis BBM *</Label>
          <Select
            value={selectedFuel}
            onValueChange={handleFuelChange}
            disabled={!selectedProvider || fuels.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih BBM" />
            </SelectTrigger>
            <SelectContent>
              {fuels.map((fuel) => (
                <SelectItem key={fuel.id} value={fuel.id.toString()}>
                  {fuel.fuelName} ({fuel.fuelType}) - {formatPrice(fuel.price)}/L
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
