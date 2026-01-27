"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LocationSelector } from "@/components/location-selector"
import { VehicleSelector } from "@/components/vehicle-selector"
import { FuelSelector } from "@/components/fuel-selector"
import { EstimateResultDisplay } from "@/components/estimate-result"
import { calculateEstimate } from "@/actions/estimate"
import type { VehicleCategoryWithTypes, FuelProviderWithPrices, EstimateResult } from "@/lib/types"
import { Calculator, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EstimatorFormProps {
  categories: VehicleCategoryWithTypes[]
  providers: FuelProviderWithPrices[]
}

export function EstimatorForm({ categories, providers }: EstimatorFormProps) {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [typeId, setTypeId] = useState<number | null>(null)
  const [fuelPriceId, setFuelPriceId] = useState<number | null>(null)
  const [result, setResult] = useState<EstimateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartLocationChange = useCallback((location: string) => {
    setStartLocation(location)
  }, [])

  const handleEndLocationChange = useCallback((location: string) => {
    setEndLocation(location)
  }, [])

  const handleCategoryChange = useCallback((id: number) => {
    setCategoryId(id)
  }, [])

  const handleTypeChange = useCallback((id: number | null) => {
    setTypeId(id)
  }, [])

  const handleFuelPriceChange = useCallback((id: number) => {
    setFuelPriceId(id)
  }, [])

  const isFormValid = startLocation && endLocation && categoryId && fuelPriceId

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Mohon lengkapi semua field yang diperlukan")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await calculateEstimate({
        startLocationName: startLocation,
        endLocationName: endLocation,
        vehicleCategoryId: categoryId,
        vehicleTypeId: typeId,
        fuelPriceId: fuelPriceId,
      })

      if (response.success && response.data) {
        setResult(response.data)
        toast.success("Estimasi berhasil dihitung!")
      } else {
        setError(response.error || "Terjadi kesalahan saat menghitung estimasi")
        toast.error(response.error || "Terjadi kesalahan")
      }
    } catch (err) {
      console.error("Estimate error:", err)
      setError("Terjadi kesalahan saat menghubungi server")
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Kalkulator Estimasi BBM
          </CardTitle>
          <CardDescription>
            Hitung estimasi biaya bahan bakar untuk perjalanan Anda di Indonesia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6 rounded-lg border border-border/50 bg-muted/30 p-4">
            <LocationSelector label="Lokasi Awal" onLocationChange={handleStartLocationChange} />
          </div>

          <div className="space-y-6 rounded-lg border border-border/50 bg-muted/30 p-4">
            <LocationSelector label="Lokasi Tujuan" onLocationChange={handleEndLocationChange} />
          </div>

          <div className="space-y-6 rounded-lg border border-border/50 bg-muted/30 p-4">
            <VehicleSelector
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
            />
          </div>

          <div className="space-y-6 rounded-lg border border-border/50 bg-muted/30 p-4">
            <FuelSelector providers={providers} onFuelPriceChange={handleFuelPriceChange} />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghitung Estimasi...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Hitung Estimasi Biaya
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && <EstimateResultDisplay result={result} />}
    </div>
  )
}
