import { Fuel, MapPin, Gauge, Wallet } from "lucide-react"

export function Features() {
    return (
        <section id="features" className="relative bg-muted py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                Fitur Unggulan
              </span>
              <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
                Semua yang Anda butuhkan untuk perencanaan BBM perjalanan
              </h2>
              <p className="mt-4 text-muted-foreground">
                Didukung data rute, lokasi, dan harga BBM terkini untuk membantu Anda merencanakan perjalanan dengan lebih akurat
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-xl bg-secondary p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-secondary">Lokasi Lengkap</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pilih lokasi dari tingkat provinsi hingga kelurahan di seluruh Indonesia
                </p>
              </div>
              
              <div className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-xl bg-secondary p-3">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-secondary">Jarak Akurat</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Kalkulasi jarak perjalanan yang presisi menggunakan OpenRouteService API
                </p>
              </div>
              
              <div className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-xl bg-secondary p-3">
                  <Fuel className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-secondary">Multi Provider</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Dukungan berbagai provider BBM seperti Pertamina, Shell, dan BP
                </p>
              </div>
              
              <div className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-xl bg-secondary p-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-secondary">Harga Terkini</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Update harga BBM secara berkala untuk estimasi biaya yang akurat
                </p>
              </div>
            </div>
          </div>
        </section>  
    )
}