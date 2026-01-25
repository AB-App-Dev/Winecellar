import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Wineries'],
    summary: 'Get all wineries',
    description: 'Returns all wineries with wine count',
    responses: {
      200: {
        description: 'Array of winery objects with wine count',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  address: { type: 'string' },
                  city: { type: 'string' },
                  land: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  website: { type: 'string' },
                  _count: { type: 'object', properties: { wines: { type: 'integer' } } }
                }
              }
            }
          }
        }
      }
    }
  }
})

export default defineEventHandler(async () => {
  const wineries = await prisma.winery.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: { wines: true },
      },
    },
  })

  return wineries
})
