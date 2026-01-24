import { prisma } from '../../utils/prisma'

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
