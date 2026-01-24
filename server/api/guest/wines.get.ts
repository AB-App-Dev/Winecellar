import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const art = query.art as string | undefined
  const taste = query.taste as string | undefined
  const country = query.country as string | undefined

  const where: Record<string, unknown> = {
    hiddenForGuests: false,
  }

  if (art) {
    where.art = art
  }

  if (taste) {
    where.taste = taste
  }

  if (country) {
    where.land = country
  }

  const wines = await prisma.wine.findMany({
    where,
    orderBy: {
      price: 'asc',
    },
    include: {
      winery: true,
    },
  })

  return wines
})
