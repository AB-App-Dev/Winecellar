import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Guest'],
    summary: 'Get wines for guests',
    description: 'Returns wines visible to guests (hiddenForGuests=false), sorted by price ascending',
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
                  art: { type: 'string' },
                  taste: { type: 'string' },
                  year: { type: 'integer' },
                  land: { type: 'string' },
                  region: { type: 'string' },
                  price: { type: 'number' },
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
