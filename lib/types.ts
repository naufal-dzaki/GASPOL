export interface Province {
  code: string
  name: string
}

export interface Regency {
  code: string
  name: string
  province_code: string
}

export interface District {
  code: string
  name: string
  regency_code: string
}

export interface Village {
  code: string
  name: string
  district_code: string
}

export interface LocationCoordinates {
  lat: number
  lon: number
  displayName: string
}

export interface RouteResult {
  distanceKm: number
  durationMin: number
}

export interface EstimateInput {
  startLocationName: string
  endLocationName: string
  vehicleCategoryId: number
  vehicleTypeId: number | null
  fuelPriceId: number
}

export interface EstimateResult {
  startLocation: string
  endLocation: string
  distanceKm: number
  durationMin: number
  vehicleName: string
  fuelProvider: string
  fuelName: string
  fuelType: string
  fuelPrice: number
  kmPerLiter: number
  litersUsed: number
  totalCost: number
}

export interface VehicleCategoryWithTypes {
  id: number
  name: string
  defaultKml: number
  vehicleTypes: {
    id: number
    name: string
    kmPerLiter: number
  }[]
}

export interface FuelProviderWithPrices {
  id: number
  name: string
  fuelPrices: {
    id: number
    fuelName: string
    fuelType: string
    price: number
    updatedAt: Date
  }[]
}
