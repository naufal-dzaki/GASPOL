"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  createVehicleCategory,
  updateVehicleCategory,
  deleteVehicleCategory,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
} from "@/actions/vehicle"
import type { VehicleCategoryWithTypes } from "@/lib/types"
import { Plus, Pencil, Trash2, Loader2, Car } from "lucide-react"
import { toast } from "sonner"

interface VehicleManagementProps {
  initialCategories: VehicleCategoryWithTypes[]
}

export function VehicleManagement({ initialCategories }: VehicleManagementProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(false)

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<VehicleCategoryWithTypes | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [categoryKml, setCategoryKml] = useState("")

  const [typeDialogOpen, setTypeDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<{ id: number; name: string; kmPerLiter: number; categoryId: number } | null>(null)
  const [typeName, setTypeName] = useState("")
  const [typeKml, setTypeKml] = useState("")
  const [typeCategory, setTypeCategory] = useState("")

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryName("")
    setCategoryKml("")
  }

  const resetTypeForm = () => {
    setEditingType(null)
    setTypeName("")
    setTypeKml("")
    setTypeCategory("")
  }

  const handleSaveCategory = async () => {
    if (!categoryName || !categoryKml) {
      toast.error("Mohon lengkapi semua field")
      return
    }

    setLoading(true)
    try {
      if (editingCategory) {
        const result = await updateVehicleCategory(editingCategory.id, categoryName, parseFloat(categoryKml))
        if (result.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? { ...c, name: categoryName, defaultKml: parseFloat(categoryKml) }
                : c
            )
          )
          toast.success("Kategori berhasil diupdate")
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createVehicleCategory(categoryName, parseFloat(categoryKml))
        if (result.success && result.data) {
          setCategories((prev) => [...prev, { ...result.data, vehicleTypes: [] }])
          toast.success("Kategori berhasil ditambahkan")
        } else {
          toast.error(result.error)
        }
      }
      setCategoryDialogOpen(false)
      resetCategoryForm()
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini? Semua tipe kendaraan dalam kategori ini juga akan dihapus.")) return

    setLoading(true)
    try {
      const result = await deleteVehicleCategory(id)
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        toast.success("Kategori berhasil dihapus")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveType = async () => {
    if (!typeName || !typeKml || !typeCategory) {
      toast.error("Mohon lengkapi semua field")
      return
    }

    setLoading(true)
    try {
      if (editingType) {
        const result = await updateVehicleType(editingType.id, typeName, parseFloat(typeKml), parseInt(typeCategory))
        if (result.success) {
          setCategories((prev) =>
            prev.map((c) => ({
              ...c,
              vehicleTypes: c.vehicleTypes.map((t) =>
                t.id === editingType.id
                  ? { ...t, name: typeName, kmPerLiter: parseFloat(typeKml) }
                  : t
              ),
            }))
          )
          toast.success("Tipe kendaraan berhasil diupdate")
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createVehicleType(typeName, parseFloat(typeKml), parseInt(typeCategory))
        if (result.success && result.data) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === parseInt(typeCategory)
                ? { ...c, vehicleTypes: [...c.vehicleTypes, result.data] }
                : c
            )
          )
          toast.success("Tipe kendaraan berhasil ditambahkan")
        } else {
          toast.error(result.error)
        }
      }
      setTypeDialogOpen(false)
      resetTypeForm()
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteType = async (id: number) => {
    if (!confirm("Yakin ingin menghapus tipe kendaraan ini?")) return

    setLoading(true)
    try {
      const result = await deleteVehicleType(id)
      if (result.success) {
        setCategories((prev) =>
          prev.map((c) => ({
            ...c,
            vehicleTypes: c.vehicleTypes.filter((t) => t.id !== id),
          }))
        )
        toast.success("Tipe kendaraan berhasil dihapus")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Kategori Kendaraan</CardTitle>
            <CardDescription>Kelola kategori kendaraan dan efisiensi default</CardDescription>
          </div>
          <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
            setCategoryDialogOpen(open)
            if (!open) resetCategoryForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? "Update informasi kategori kendaraan" : "Tambahkan kategori kendaraan baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Nama Kategori</Label>
                  <Input
                    id="categoryName"
                    placeholder="Contoh: Motor"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryKml">Efisiensi Default (km/liter)</Label>
                  <Input
                    id="categoryKml"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 35"
                    value={categoryKml}
                    onChange={(e) => setCategoryKml(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSaveCategory} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCategory ? "Update" : "Tambah"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Efisiensi Default</TableHead>
                <TableHead>Jumlah Tipe</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>{category.defaultKml} km/L</TableCell>
                  <TableCell>{category.vehicleTypes.length} tipe</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCategory(category)
                          setCategoryName(category.name)
                          setCategoryKml(category.defaultKml.toString())
                          setCategoryDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Belum ada kategori
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tipe Kendaraan</CardTitle>
            <CardDescription>Kelola tipe kendaraan spesifik dan efisiensinya</CardDescription>
          </div>
          <Dialog open={typeDialogOpen} onOpenChange={(open) => {
            setTypeDialogOpen(open)
            if (!open) resetTypeForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingType ? "Edit Tipe Kendaraan" : "Tambah Tipe Kendaraan"}</DialogTitle>
                <DialogDescription>
                  {editingType ? "Update informasi tipe kendaraan" : "Tambahkan tipe kendaraan baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="typeCategory">Kategori</Label>
                  <Select value={typeCategory} onValueChange={setTypeCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeName">Nama Tipe</Label>
                  <Input
                    id="typeName"
                    placeholder="Contoh: Beat, Avanza"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeKml">Efisiensi (km/liter)</Label>
                  <Input
                    id="typeKml"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 45"
                    value={typeKml}
                    onChange={(e) => setTypeKml(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTypeDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSaveType} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingType ? "Update" : "Tambah"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Efisiensi</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.flatMap((category) =>
                category.vehicleTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{type.kmPerLiter} km/L</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingType({ ...type, categoryId: category.id })
                            setTypeName(type.name)
                            setTypeKml(type.kmPerLiter.toString())
                            setTypeCategory(category.id.toString())
                            setTypeDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteType(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {categories.every((c) => c.vehicleTypes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Belum ada tipe kendaraan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
