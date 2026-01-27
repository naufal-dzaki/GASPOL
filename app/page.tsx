import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EstimatorForm } from "@/components/estimator-form"
import { getVehicleCategories } from "@/actions/vehicle"
import { getFuelProviders } from "@/actions/fuel"
import { Fuel, MapPin, Gauge, Wallet } from "lucide-react"

export default async function HomePage() {
  const [categories, providers] = await Promise.all([
    getVehicleCategories(),
    getFuelProviders(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-secondary/50 to-background py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0%,transparent_100%)] opacity-10" />
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Fuel className="h-4 w-4" />
                Smart Fuel Cost Estimator
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Smart planning,
                <br />
                <span className="text-primary">smart driving</span>
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                Estimasi biaya bahan bakar perjalanan Anda di seluruh Indonesia dengan akurat. 
                Pilih lokasi, kendaraan, dan jenis BBM untuk mendapatkan perhitungan yang tepat.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Lokasi Lengkap</h3>
                  <p className="text-sm text-muted-foreground">
                    Pilih dari provinsi hingga kelurahan
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Jarak Akurat</h3>
                  <p className="text-sm text-muted-foreground">
                    Kalkulasi jarak via OpenRouteService
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Fuel className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Multi Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Pertamina, Shell, dan BP
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Harga Terkini</h3>
                  <p className="text-sm text-muted-foreground">
                    Update harga BBM berkala
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <EstimatorForm categories={categories} providers={providers} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
