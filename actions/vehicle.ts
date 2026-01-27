"use server"

import { prisma } from "@/lib/prisma"
import { revalidateTag } from "next/cache"
import type { VehicleCategoryWithTypes } from "@/lib/types"

export async function getVehicleCategories(): Promise<VehicleCategoryWithTypes[]> {
  try {
    const categories = await prisma.vehicleCategory.findMany({
      include: {
        vehicleTypes: {
          select: {
            id: true,
            name: true,
            kmPerLiter: true,
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    })
    return categories
  } catch (error) {
    console.error("Error fetching vehicle categories:", error)
    return []
  }
}

export async function getVehicleCategory(id: number) {
  try {
    return await prisma.vehicleCategory.findUnique({
      where: { id },
      include: { vehicleTypes: true },
    })
  } catch (error) {
    console.error("Error fetching vehicle category:", error)
    return null
  }
}

export async function getVehicleType(id: number) {
  try {
    return await prisma.vehicleType.findUnique({
      where: { id },
      include: { category: true },
    })
  } catch (error) {
    console.error("Error fetching vehicle type:", error)
    return null
  }
}

export async function createVehicleCategory(name: string, defaultKml: number) {
  try {
    const category = await prisma.vehicleCategory.create({
      data: { name, defaultKml },
    })
    revalidateTag("vehicles", "max")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error creating vehicle category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateVehicleCategory(id: number, name: string, defaultKml: number) {
  try {
    const category = await prisma.vehicleCategory.update({
      where: { id },
      data: { name, defaultKml },
    })
    revalidateTag("vehicles", "max")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error updating vehicle category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteVehicleCategory(id: number) {
  try {
    await prisma.vehicleCategory.delete({ where: { id } })
    revalidateTag("vehicles", "max")
    return { success: true }
  } catch (error) {
    console.error("Error deleting vehicle category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

export async function createVehicleType(name: string, kmPerLiter: number, categoryId: number) {
  try {
    const type = await prisma.vehicleType.create({
      data: { name, kmPerLiter, categoryId },
    })
    revalidateTag("vehicles", "max")
    return { success: true, data: type }
  } catch (error) {
    console.error("Error creating vehicle type:", error)
    return { success: false, error: "Failed to create vehicle type" }
  }
}

export async function updateVehicleType(id: number, name: string, kmPerLiter: number, categoryId: number) {
  try {
    const type = await prisma.vehicleType.update({
      where: { id },
      data: { name, kmPerLiter, categoryId },
    })
    revalidateTag("vehicles", "max")
    return { success: true, data: type }
  } catch (error) {
    console.error("Error updating vehicle type:", error)
    return { success: false, error: "Failed to update vehicle type" }
  }
}

export async function deleteVehicleType(id: number) {
  try {
    await prisma.vehicleType.delete({ where: { id } })
    revalidateTag("vehicles", "max")
    return { success: true }
  } catch (error) {
    console.error("Error deleting vehicle type:", error)
    return { success: false, error: "Failed to delete vehicle type" }
  }
}
