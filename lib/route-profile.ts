export type VehicleProfile = "driving-car" | "driving-hgv" | "cycling-regular"

export function getRouteProfile(categoryName: string): VehicleProfile {
  switch (categoryName.toLowerCase()) {
    case "motor":
      return "cycling-regular" 
    case "bus besar":
      return "driving-hgv"
    default:
      return "driving-car"
  }
}