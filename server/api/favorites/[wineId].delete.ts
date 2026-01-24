import { prisma } from '../../utils/prisma'

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
