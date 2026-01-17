import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const art = query.art as string | undefined
  const taste = query.taste as string | undefined
  const country = query.country as string | undefined
  const sortField = (query.sortField as string) || 'year'
  const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc'

  const where: Record<string, unknown> = {}

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
      [sortField]: sortOrder,
    },
    include: {
      winery: true,
    },
  })

  return wines
})
