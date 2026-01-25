import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Favorites'],
    summary: 'Remove wine from favorites',
    description: 'Removes a wine from guest favorites using X-Guest-Key header',
    responses: {
      200: { description: 'Success confirmation { success: true }' },
      400: { description: 'X-Guest-Key header or wineId is required' }
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

  const wineId = getRouterParam(event, 'wineId')

  if (!wineId) {
    throw createError({
      statusCode: 400,
      message: 'wineId is required',
    })
  }

  await prisma.favorite.deleteMany({
    where: {
      guestKey,
      wineId,
    },
  })

  return { success: true }
})
