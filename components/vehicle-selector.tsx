"use client"

import { useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import type { VehicleCategoryWithTypes } from "@/lib/types"
import { Car } from "lucide-react"
import Select from "@/components/ui/client-select"
import type { SingleValue } from "react-select"

interface Option {
  value: number | "default"
  label: string
}

interface VehicleSelectorProps {
  categories: VehicleCategoryWithTypes[]
  onCategoryChange: (categoryId: number) => void
  onTypeChange: (typeId: number | null) => void
}

export function VehicleSelector({
  categories,
  onCategoryChange,
  onTypeChange,
}: VehicleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null)
  const [selectedType, setSelectedType] = useState<Option | null>(null)
  const isCategoryLoading = categories.length === 0
  const isTypeLoading = isCategoryLoading || !selectedCategory


  const categoryOptions: Option[] = useMemo(
    () =>
      categories.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.defaultKml} km/l)`,
      })),
    [categories]
  )

  const typeOptions: Option[] = useMemo(() => {
    if (!selectedCategory) return []

    const category = categories.find(
      (c) => c.id === selectedCategory.value
    )

    if (!category) return []

    return [
      {
        value: "default",
        label: `Default (${category.defaultKml} km/l)`,
      },
      ...category.vehicleTypes.map((t) => ({
        value: t.id,
        label: `${t.name} (${t.kmPerLiter} km/l)`,
      })),
    ]
  }, [selectedCategory, categories])

  const handleCategoryChange = (option: SingleValue<Option>) => {
    setSelectedCategory(option)
    setSelectedType(null)

    if (option && typeof option.value === "number") {
      onCategoryChange(option.value)
      onTypeChange(null)
    }
  }

  const handleTypeChange = (option: SingleValue<Option>) => {
    setSelectedType(option)

    if (!option || option.value === "default") {
      onTypeChange(null)
    } else {
      onTypeChange(option.value)
    }
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Car className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">Kendaraan</Label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Kategori Kendaraan *
          </Label>
          <Select
            value={selectedCategory}
            options={categoryOptions}
            onChange={handleCategoryChange}
            placeholder="Pilih Kategori"
            classNames={selectClassNames}
            isLoading={isCategoryLoading}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Tipe Kendaraan (opsional)
          </Label>
          <Select
            value={selectedType}
            options={typeOptions}
            onChange={handleTypeChange}
            placeholder="Pilih Tipe (opsional)"
            isDisabled={!selectedCategory || typeOptions.length === 0}
            classNames={selectClassNames}
            isLoading={isTypeLoading}
          />
        </div>
      </div>
    </div>
  )
}
