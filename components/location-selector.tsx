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
import { getProvinces, getRegencies, getDistricts, getVillages } from "@/actions/location"
import type { Province, Regency, District, Village } from "@/lib/types"
import { MapPin, Loader2 } from "lucide-react"

interface LocationSelectorProps {
  label: string
  onLocationChange: (locationString: string) => void
}

export function LocationSelector({ label, onLocationChange }: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [regencies, setRegencies] = useState<Regency[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [villages, setVillages] = useState<Village[]>([])

  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedRegency, setSelectedRegency] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedVillage, setSelectedVillage] = useState<string>("")

  const [provinceName, setProvinceName] = useState<string>("")
  const [regencyName, setRegencyName] = useState<string>("")
  const [districtName, setDistrictName] = useState<string>("")
  const [villageName, setVillageName] = useState<string>("")

  const [loading, setLoading] = useState({
    provinces: true,
    regencies: false,
    districts: false,
    villages: false,
  })

  useEffect(() => {
    async function loadProvinces() {
      setLoading((prev) => ({ ...prev, provinces: true }))
      const data = await getProvinces()
      setProvinces(data)
      setLoading((prev) => ({ ...prev, provinces: false }))
    }
    loadProvinces()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      async function loadRegencies() {
        setLoading((prev) => ({ ...prev, regencies: true }))
        const data = await getRegencies(selectedProvince)
        setRegencies(data)
        setLoading((prev) => ({ ...prev, regencies: false }))
      }
      loadRegencies()
      setSelectedRegency("")
      setSelectedDistrict("")
      setSelectedVillage("")
      setRegencies([])
      setDistricts([])
      setVillages([])
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedRegency) {
      async function loadDistricts() {
        setLoading((prev) => ({ ...prev, districts: true }))
        const data = await getDistricts(selectedRegency)
        setDistricts(data)
        setLoading((prev) => ({ ...prev, districts: false }))
      }
      loadDistricts()
      setSelectedDistrict("")
      setSelectedVillage("")
      setDistricts([])
      setVillages([])
    }
  }, [selectedRegency])

  useEffect(() => {
    if (selectedDistrict) {
      async function loadVillages() {
        setLoading((prev) => ({ ...prev, villages: true }))
        const data = await getVillages(selectedDistrict)
        setVillages(data)
        setLoading((prev) => ({ ...prev, villages: false }))
      }
      loadVillages()
      setSelectedVillage("")
      setVillages([])
    }
  }, [selectedDistrict])

  useEffect(() => {
    const parts = [villageName, districtName, regencyName, provinceName].filter(Boolean)
    const locationString = parts.join(", ")
    onLocationChange(locationString)
  }, [provinceName, regencyName, districtName, villageName, onLocationChange])

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    const province = provinces.find((p) => p.code === value)
    setProvinceName(province?.name || "")
    setRegencyName("")
    setDistrictName("")
    setVillageName("")
  }

  const handleRegencyChange = (value: string) => {
    setSelectedRegency(value)
    const regency = regencies.find((r) => r.code === value)
    setRegencyName(regency?.name || "")
    setDistrictName("")
    setVillageName("")
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    const district = districts.find((d) => d.code === value)
    setDistrictName(district?.name || "")
    setVillageName("")
  }

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value)
    const village = villages.find((v) => v.code === value)
    setVillageName(village?.name || "")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">{label}</Label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Provinsi *</Label>
          <Select value={selectedProvince} onValueChange={handleProvinceChange}>
            <SelectTrigger className="w-full">
              {loading.provinces ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Pilih Provinsi" />
              )}
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Kota/Kabupaten *</Label>
          <Select
            value={selectedRegency}
            onValueChange={handleRegencyChange}
            disabled={!selectedProvince || loading.regencies}
          >
            <SelectTrigger className="w-full">
              {loading.regencies ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Pilih Kota/Kabupaten" />
              )}
            </SelectTrigger>
            <SelectContent>
              {regencies.map((regency) => (
                <SelectItem key={regency.code} value={regency.code}>
                  {regency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Kecamatan (opsional)</Label>
          <Select
            value={selectedDistrict}
            onValueChange={handleDistrictChange}
            disabled={!selectedRegency || loading.districts}
          >
            <SelectTrigger className="w-full">
              {loading.districts ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Pilih Kecamatan" />
              )}
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Kelurahan/Desa (opsional)</Label>
          <Select
            value={selectedVillage}
            onValueChange={handleVillageChange}
            disabled={!selectedDistrict || loading.villages}
          >
            <SelectTrigger className="w-full">
              {loading.villages ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Pilih Kelurahan" />
              )}
            </SelectTrigger>
            <SelectContent>
              {villages.map((village) => (
                <SelectItem key={village.code} value={village.code}>
                  {village.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
