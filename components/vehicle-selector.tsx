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
import type { VehicleCategoryWithTypes } from "@/lib/types"
import { Car } from "lucide-react"

interface VehicleSelectorProps {
  categories: VehicleCategoryWithTypes[]
  onCategoryChange: (categoryId: number) => void
  onTypeChange: (typeId: number | null) => void
}

export function VehicleSelector({ categories, onCategoryChange, onTypeChange }: VehicleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [vehicleTypes, setVehicleTypes] = useState<VehicleCategoryWithTypes["vehicleTypes"]>([])

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((c) => c.id.toString() === selectedCategory)
      setVehicleTypes(category?.vehicleTypes || [])
      setSelectedType("")
      onTypeChange(null)
    }
  }, [selectedCategory, categories, onTypeChange])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onCategoryChange(parseInt(value))
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    if (value === "default") {
      onTypeChange(null)
    } else {
      onTypeChange(parseInt(value))
    }
  }

  const selectedCategoryData = categories.find((c) => c.id.toString() === selectedCategory)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Car className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">Kendaraan</Label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Kategori Kendaraan *</Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name} ({category.defaultKml} km/l)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tipe Kendaraan (opsional)</Label>
          <Select
            value={selectedType}
            onValueChange={handleTypeChange}
            disabled={!selectedCategory || vehicleTypes.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Tipe (opsional)" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategoryData && (
                <SelectItem value="default">
                  Default ({selectedCategoryData.defaultKml} km/l)
                </SelectItem>
              )}
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name} ({type.kmPerLiter} km/l)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
