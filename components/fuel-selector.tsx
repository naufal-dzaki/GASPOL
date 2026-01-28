"use client"

import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import type { FuelProviderWithPrices } from "@/lib/types"
import { Fuel } from "lucide-react"
import Select from "@/components/ui/client-select"
import type { SingleValue } from "react-select"

interface Option {
  value: number
  label: string
}

interface FuelSelectorProps {
  providers: FuelProviderWithPrices[]
  onFuelPriceChange: (fuelPriceId: number) => void
}

const selectClassNames = {
  control: () =>
    "min-h-[40px] rounded-md border border-input bg-background px-1 text-sm shadow-sm",
  menu: () => "rounded-md border bg-popover shadow-md",
  option: ({ isFocused }: any) =>
    `cursor-pointer px-3 py-2 text-sm ${
      isFocused ? "bg-accent" : ""
    }`,
  placeholder: () => "text-muted-foreground",
  singleValue: () => "text-foreground",
}

export function FuelSelector({
  providers,
  onFuelPriceChange,
}: FuelSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(null)
  const [selectedFuel, setSelectedFuel] = useState<Option | null>(null)

  const isProviderLoading = providers.length === 0
  const isFuelLoading = isProviderLoading || !selectedProvider

  const providerOptions: Option[] = useMemo(
    () =>
      providers.map((p) => ({
        value: p.id,
        label: p.name,
      })),
    [providers]
  )

  const fuelOptions: Option[] = useMemo(() => {
    if (!selectedProvider) return []

    const provider = providers.find(
      (p) => p.id === selectedProvider.value
    )

    if (!provider) return []

    return provider.fuelPrices.map((fuel) => ({
      value: fuel.id,
      label: `${fuel.fuelName} (${fuel.fuelType}) - ${new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }
      ).format(fuel.price)}/L`,
    }))
  }, [selectedProvider, providers])

  const handleProviderChange = (option: SingleValue<Option>) => {
    setSelectedProvider(option)
    setSelectedFuel(null)
  }

  const handleFuelChange = (option: SingleValue<Option>) => {
    setSelectedFuel(option)
    if (option) {
      onFuelPriceChange(option.value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Fuel className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">Bahan Bakar</Label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* PROVIDER */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Provider BBM *
          </Label>
          <Select
            value={selectedProvider}
            options={providerOptions}
            onChange={handleProviderChange}
            placeholder="Pilih Provider"
            classNames={selectClassNames}
            isLoading={isProviderLoading}
            isDisabled={isProviderLoading}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Jenis BBM *
          </Label>
          <Select
            value={selectedFuel}
            options={fuelOptions}
            onChange={handleFuelChange}
            placeholder="Pilih BBM"
            classNames={selectClassNames}
            isLoading={isFuelLoading}
            isDisabled={isFuelLoading || fuelOptions.length === 0}
          />
        </div>
      </div>
    </div>
  )
}
