"use server"

import type { Province, Regency, District, Village, LocationCoordinates } from "@/lib/types"

const WILAYAH_BASE_URL = "https://wilayah.id/api"
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

export async function getProvinces(): Promise<Province[]> {
  try {
    const response = await fetch(`${WILAYAH_BASE_URL}/provinces.json`, {
      next: { revalidate: 86400 },
    })
    if (!response.ok) throw new Error("Failed to fetch provinces")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching provinces:", error)
    return []
  }
}

export async function getRegencies(provinceCode: string): Promise<Regency[]> {
  try {
    const response = await fetch(`${WILAYAH_BASE_URL}/regencies/${provinceCode}.json`, {
      next: { revalidate: 86400 },
    })
    if (!response.ok) throw new Error("Failed to fetch regencies")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching regencies:", error)
    return []
  }
}

export async function getDistricts(regencyCode: string): Promise<District[]> {
  try {
    const response = await fetch(`${WILAYAH_BASE_URL}/districts/${regencyCode}.json`, {
      next: { revalidate: 86400 },
    })
    if (!response.ok) throw new Error("Failed to fetch districts")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching districts:", error)
    return []
  }
}

export async function getVillages(districtCode: string): Promise<Village[]> {
  try {
    const response = await fetch(`${WILAYAH_BASE_URL}/villages/${districtCode}.json`, {
      next: { revalidate: 86400 },
    })
    if (!response.ok) throw new Error("Failed to fetch villages")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching villages:", error)
    return []
  }
}

export async function getCoordinates(locationQuery: string): Promise<LocationCoordinates | null> {
  try {
    const params = new URLSearchParams({
      q: locationQuery,
      format: "json",
      limit: "1",
      countrycodes: "id",
    })
    
    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        "User-Agent": "FUELin/1.0",
      },
    })
    
    if (!response.ok) throw new Error("Failed to fetch coordinates")
    
    const data = await response.json()
    
    if (data.length === 0) return null
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error)
    return null
  }
}
