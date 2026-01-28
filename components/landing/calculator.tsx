import { EstimatorForm } from "../estimator-form"

export function Calculator({categories, providers}: {categories: any[], providers: any[]}) {
    return (
        <section id="calculator" className="relative bg-card py-20 sm:py-28">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                Kalkulator GASPOL
              </span>
              <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
                Rencanakan kebutuhan dan biaya BBM perjalanan Anda
              </h2>
              <p className="mt-4 text-muted-foreground">
                Masukkan detail perjalanan untuk membantu Anda merencanakan kebutuhan dan estimasi biaya BBM secara akurat
              </p>
            </div>
            
            <div className="mx-auto max-w-3xl">
              <EstimatorForm categories={categories} providers={providers} />
            </div>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>
    )
}