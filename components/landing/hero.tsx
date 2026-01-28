"use client"

import { Fuel, ChevronDown } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Highway with vehicles"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-secondary/60 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Fuel className="h-4 w-4" />
            GAS Planning Online
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            GAS<span className="italic text-primary">POL</span>
          </h1>

          <p className="mt-6 text-pretty text-lg text-white/80 sm:text-xl">
            Rencanakan perjalanan Anda dengan cerdas. Hitung estimasi biaya dan kebutuhan BBM berdasarkan rute, kendaraan, dan jenis BBM sebelum Anda berangkat.
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <a
          href="#calculator"
          className="inline-flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-primary"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <span className="text-sm">Mulai Hitung</span>
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </section>
  )
}
