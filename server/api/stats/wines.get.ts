import { prisma } from '../../utils/prisma'
import { WineArt } from '../../../app/generated/prisma/client.js'

export default defineEventHandler(async () => {
  // Get all wines with price and bottles
  const wines = await prisma.wine.findMany({
    select: {
      art: true,
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

  // Calculate stats per type
  for (const wine of wines) {
    const price = Number(wine.price)
    const bottles = wine.bottlesAmount

    typeStats[wine.art].count += 1
    typeStats[wine.art].bottles += bottles
    typeStats[wine.art].value += price * bottles
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

  return {
    byType: typeStats,
    totals,
  }
})
