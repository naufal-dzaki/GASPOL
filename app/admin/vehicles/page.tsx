import { redirect } from "next/navigation"
import { getSession } from "@/actions/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { VehicleManagement } from "@/components/admin/vehicle-management"
import { getVehicleCategories } from "@/actions/vehicle"

export default async function VehiclesAdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/admin/login")
  }

  const categories = await getVehicleCategories()

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          title="Manajemen Kendaraan"
          description="Kelola kategori dan tipe kendaraan"
        />
        <main className="flex-1 overflow-auto p-6">
          <VehicleManagement initialCategories={categories} />
        </main>
      </div>
    </div>
  )
}
