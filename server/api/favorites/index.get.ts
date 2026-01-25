import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Favorites'],
    summary: 'Get guest favorites',
    description: 'Returns favorites for the guest identified by X-Guest-Key header',
    responses: {
      200: {
        description: 'Array of favorite objects with wine and winery data',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  guestKey: { type: 'string' },
                  wineId: { type: 'string' },
                  wine: { type: 'object', description: 'Wine object with winery relation' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      },
      400: { description: 'X-Guest-Key header is required' }
    }
  }
})

export default defineEventHandler(async (event) => {
  const guestKey = getHeader(event, 'X-Guest-Key')

  if (!guestKey) {
    throw createError({
      statusCode: 400,
      message: 'X-Guest-Key header is required',
    })
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      guestKey,
    },
    include: {
      wine: {
        include: {
          winery: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return favorites
})
