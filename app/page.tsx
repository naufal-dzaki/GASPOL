import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getVehicleCategories } from "@/actions/vehicle"
import { getFuelProviders } from "@/actions/fuel"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Calculator } from "@/components/landing/calculator"

export default async function HomePage() {
  const [categories, providers] = await Promise.all([
    getVehicleCategories(),
    getFuelProviders(),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-muted scroll-smooth">
      <Header />
      
      <main className="flex-1">
        <Hero />

        <Features />

        <Calculator categories={categories} providers={providers} />
      </main>

      <Footer />
    </div>
  )
}
