import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Wines'],
    summary: 'Get all wines',
    description: 'Returns all wines with optional filtering and sorting',
    responses: {
      200: {
        description: 'Array of wine objects with winery relation',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  art: { type: 'string', enum: ['RED', 'WHITE', 'ROSE', 'SPARKLING', 'DESSERT'] },
                  taste: { type: 'string', enum: ['DRY', 'SEMI_DRY', 'SEMI_SWEET', 'SWEET'] },
                  year: { type: 'integer' },
                  land: { type: 'string' },
                  region: { type: 'string' },
                  price: { type: 'number' },
                  bottlesAmount: { type: 'integer' },
                  imageUrl: { type: 'string' },
                  winery: { type: 'object' }
                }
              }
            }
          }
        }
      }
    }
  }
})

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
