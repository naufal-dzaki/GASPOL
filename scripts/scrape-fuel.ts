import { chromium, type Browser, type Page } from "playwright"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface FuelPriceData {
  provider: string
  fuelName: string
  fuelType: string
  price: number
}

async function logScraping(provider: string, status: string, message?: string) {
  try {
    await prisma.scrapingLog.create({
      data: {
        provider,
        status,
        message,
      },
    })
  } catch (error) {
    console.error(`Failed to log scraping for ${provider}:`, error)
  }
}

async function scrapePertamina(page: Page): Promise<FuelPriceData[]> {
  const prices: FuelPriceData[] = []
  
  try {
    console.log("Scraping Pertamina...")
    await page.goto("https://mypertamina.id/about/product-price", {
      waitUntil: "networkidle",
      timeout: 30000,
    })
    
    await page.waitForTimeout(3000)
    
    const priceElements = await page.$$eval(".price-item", (elements) => {
      return elements.map((el) => ({
        name: el.querySelector(".fuel-name")?.textContent?.trim() || "",
        price: el.querySelector(".fuel-price")?.textContent?.trim() || "",
      }))
    })
    
    for (const item of priceElements) {
      const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""))
      if (item.name && !isNaN(priceNum)) {
        prices.push({
          provider: "Pertamina",
          fuelName: item.name,
          fuelType: determineFuelType(item.name),
          price: priceNum,
        })
      }
    }
    
    await logScraping("Pertamina", "success", `Scraped ${prices.length} prices`)
  } catch (error) {
    console.error("Error scraping Pertamina:", error)
    await logScraping("Pertamina", "error", String(error))
  }
  
  return prices
}

async function scrapeShell(page: Page): Promise<FuelPriceData[]> {
  const prices: FuelPriceData[] = []
  
  try {
    console.log("Scraping Shell...")
    await page.goto(
      "https://www.shell.co.id/in_id/pengendara-bermotor/bahan-bakar-shell/how-shell-price-fuel.html",
      {
        waitUntil: "networkidle",
        timeout: 30000,
      }
    )
    
    await page.waitForTimeout(3000)
    
    const priceElements = await page.$$eval("table tr", (rows) => {
      return rows.slice(1).map((row) => {
        const cells = row.querySelectorAll("td")
        return {
          name: cells[0]?.textContent?.trim() || "",
          price: cells[1]?.textContent?.trim() || "",
        }
      })
    })
    
    for (const item of priceElements) {
      const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""))
      if (item.name && !isNaN(priceNum)) {
        prices.push({
          provider: "Shell",
          fuelName: item.name,
          fuelType: determineFuelType(item.name),
          price: priceNum,
        })
      }
    }
    
    await logScraping("Shell", "success", `Scraped ${prices.length} prices`)
  } catch (error) {
    console.error("Error scraping Shell:", error)
    await logScraping("Shell", "error", String(error))
  }
  
  return prices
}

async function scrapeBP(page: Page): Promise<FuelPriceData[]> {
  const prices: FuelPriceData[] = []
  
  try {
    console.log("Scraping BP...")
    await page.goto(
      "https://www.bp.com/id_id/indonesia/home/produk-dan-layanan/spbu/harga.html",
      {
        waitUntil: "networkidle",
        timeout: 30000,
      }
    )
    
    await page.waitForTimeout(3000)
    
    const priceElements = await page.$$eval(".price-table tr", (rows) => {
      return rows.slice(1).map((row) => {
        const cells = row.querySelectorAll("td")
        return {
          name: cells[0]?.textContent?.trim() || "",
          price: cells[1]?.textContent?.trim() || "",
        }
      })
    })
    
    for (const item of priceElements) {
      const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""))
      if (item.name && !isNaN(priceNum)) {
        prices.push({
          provider: "BP",
          fuelName: item.name,
          fuelType: determineFuelType(item.name),
          price: priceNum,
        })
      }
    }
    
    await logScraping("BP", "success", `Scraped ${prices.length} prices`)
  } catch (error) {
    console.error("Error scraping BP:", error)
    await logScraping("BP", "error", String(error))
  }
  
  return prices
}

function determineFuelType(fuelName: string): string {
  const name = fuelName.toLowerCase()
  
  if (name.includes("diesel") || name.includes("dex") || name.includes("solar")) {
    return "Diesel"
  }
  if (name.includes("98") || name.includes("turbo") || name.includes("nitro")) {
    return "RON 98"
  }
  if (name.includes("95") || name.includes("v-power") || name.includes("ultimate")) {
    return "RON 95"
  }
  if (name.includes("92") || name.includes("pertamax") || name.includes("super")) {
    return "RON 92"
  }
  if (name.includes("90") || name.includes("pertalite")) {
    return "RON 90"
  }
  
  return "RON 92" 
}

async function updateDatabase(prices: FuelPriceData[]) {
  console.log(`Updating database with ${prices.length} prices...`)
  
  for (const price of prices) {
    try {
      const provider = await prisma.fuelProvider.upsert({
        where: { name: price.provider },
        update: {},
        create: { name: price.provider },
      })
      
      await prisma.fuelPrice.upsert({
        where: {
          providerId_fuelName_fuelType: {
            providerId: provider.id,
            fuelName: price.fuelName,
            fuelType: price.fuelType,
          },
        },
        update: {
          price: price.price,
        },
        create: {
          providerId: provider.id,
          fuelName: price.fuelName,
          fuelType: price.fuelType,
          price: price.price,
        },
      })
      
      console.log(`Updated: ${price.provider} - ${price.fuelName} @ Rp ${price.price}`)
    } catch (error) {
      console.error(`Failed to update ${price.provider} - ${price.fuelName}:`, error)
    }
  }
}

async function main() {
  console.log("Starting fuel price scraping...")
  console.log("=".repeat(50))
  
  let browser: Browser | null = null
  
  try {
    browser = await chromium.launch({
      headless: true,
    })
    
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })
    
    const page = await context.newPage()
    
    const allPrices: FuelPriceData[] = []
    
    const pertaminaPrices = await scrapePertamina(page)
    allPrices.push(...pertaminaPrices)
    
    const shellPrices = await scrapeShell(page)
    allPrices.push(...shellPrices)
    
    const bpPrices = await scrapeBP(page)
    allPrices.push(...bpPrices)
    
    console.log("=".repeat(50))
    console.log(`Total prices scraped: ${allPrices.length}`)
    
    if (allPrices.length > 0) {
      await updateDatabase(allPrices)
    }
    
    console.log("=".repeat(50))
    console.log("Scraping completed!")
  } catch (error) {
    console.error("Fatal error during scraping:", error)
  } finally {
    if (browser) {
      await browser.close()
    }
    await prisma.$disconnect()
  }
}

main()
