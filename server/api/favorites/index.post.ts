import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Favorites'],
    summary: 'Add wine to favorites',
    description: 'Adds a wine to guest favorites using X-Guest-Key header',
    responses: {
      200: { description: 'Created favorite object with wine and winery data' },
      400: { description: 'X-Guest-Key header or wineId is required' },
      403: { description: 'Wine cannot be favorited (hidden or coming soon)' },
      404: { description: 'Wine not found' }
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

  const body = await readBody(event)
  const { wineId } = body

  if (!wineId) {
    throw createError({
      statusCode: 400,
      message: 'wineId is required',
    })
  }

  // Validate wine exists and can be favorited
  const wine = await prisma.wine.findUnique({
    where: { id: wineId },
  })

  if (!wine) {
    throw createError({
      statusCode: 404,
      message: 'Wine not found',
    })
  }

  if (wine.hiddenForGuests) {
    throw createError({
      statusCode: 403,
      message: 'This wine cannot be favorited',
    })
  }

  // Check if wine is "coming soon"
  const currentYear = new Date().getFullYear()
  if (wine.availableAtYear && wine.availableAtYear > currentYear) {
    throw createError({
      statusCode: 403,
      message: 'Coming soon wines cannot be favorited',
    })
  }

  // Upsert to handle duplicates gracefully
  const favorite = await prisma.favorite.upsert({
    where: {
      guestKey_wineId: {
        guestKey,
        wineId,
      },
    },
    update: {},
    create: {
      guestKey,
      wineId,
    },
    include: {
      wine: {
        include: {
          winery: true,
        },
      },
    },
  })

  return favorite
})
