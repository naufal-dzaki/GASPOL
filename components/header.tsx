"use client"

import React from "react"

import Link from "next/link"
import { Fuel } from "lucide-react"
import { useEffect, useState } from "react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "border-b border-border/30 bg-white/50 shadow-sm backdrop-blur-md" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors bg-secondary`}>
            <Fuel className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className={`transition-colors ${isScrolled ? "text-secondary" : "text-white"}`}>GAS</span>
            <span className="italic text-primary">POL</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, "features")}
            className={`text-sm font-medium transition-colors ${
              isScrolled 
                ? "text-muted-foreground hover:text-foreground" 
                : "text-white/80 hover:text-white"
            }`}
          >
            Fitur
          </a>
          <a
            href="#calculator"
            onClick={(e) => scrollToSection(e, "calculator")}
            className={`text-sm font-medium transition-colors ${
              isScrolled 
                ? "text-muted-foreground hover:text-foreground" 
                : "text-white/80 hover:text-white"
            }`}
          >
            Kalkulator
          </a>
          <a
            href="#calculator"
            onClick={(e) => scrollToSection(e, "calculator")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Hitung Sekarang
          </a>
        </nav>
      </div>
    </header>
  )
}
