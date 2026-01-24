import { prisma } from '../../utils/prisma'
import { WineArt, WineTaste } from '../../../app/generated/prisma/client.js'

export default defineEventHandler(async () => {
  // Get all wines with price and bottles
  const wines = await prisma.wine.findMany({
    select: {
      art: true,
      taste: true,
      land: true,
      price: true,
      bottlesAmount: true,
    },
  })

  // Initialize stats for each wine type
  const typeStats: Record<WineArt, { count: number; bottles: number; value: number }> = {
    RED: { count: 0, bottles: 0, value: 0 },
    WHITE: { count: 0, bottles: 0, value: 0 },
    ROSE: { count: 0, bottles: 0, value: 0 },
    ORANGE: { count: 0, bottles: 0, value: 0 },
    SPARKLING: { count: 0, bottles: 0, value: 0 },
    DESSERT: { count: 0, bottles: 0, value: 0 },
  }

  // Initialize stats for each wine taste
  const tasteStats: Record<WineTaste, { count: number; bottles: number; value: number }> = {
    DRY: { count: 0, bottles: 0, value: 0 },
    SEMI_DRY: { count: 0, bottles: 0, value: 0 },
    SEMI_SWEET: { count: 0, bottles: 0, value: 0 },
    SWEET: { count: 0, bottles: 0, value: 0 },
  }

  // Dynamic stats for countries
  const landStats: Record<string, { count: number; bottles: number; value: number }> = {}

  // Calculate stats per type, taste, and country
  for (const wine of wines) {
    const price = Number(wine.price)
    const bottles = wine.bottlesAmount

    typeStats[wine.art].count += 1
    typeStats[wine.art].bottles += bottles
    typeStats[wine.art].value += price * bottles

    tasteStats[wine.taste].count += 1
    tasteStats[wine.taste].bottles += bottles
    tasteStats[wine.taste].value += price * bottles

    // Country stats
    if (!landStats[wine.land]) {
      landStats[wine.land] = { count: 0, bottles: 0, value: 0 }
    }
    landStats[wine.land].count += 1
    landStats[wine.land].bottles += bottles
    landStats[wine.land].value += price * bottles
  }

  // Calculate totals
  const totals = {
    count: 0,
    bottles: 0,
    value: 0,
  }

  for (const art of Object.keys(typeStats) as WineArt[]) {
    totals.count += typeStats[art].count
    totals.bottles += typeStats[art].bottles
    totals.value += typeStats[art].value
  }

  // Sort countries by count (descending)
  const sortedLandStats = Object.entries(landStats)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([land, stats]) => ({ land, ...stats }))

  return {
    byType: typeStats,
    byTaste: tasteStats,
    byLand: sortedLandStats,
    totals,
  }
})
