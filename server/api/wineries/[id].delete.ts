import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID ist erforderlich',
    })
  }

  // Check if winery exists
  const existing = await prisma.winery.findUnique({
    where: { id },
    include: {
      _count: {
        select: { wines: true },
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Weingut nicht gefunden',
    })
  }

  // Check if winery has wines
  if (existing._count.wines > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Weingut kann nicht gelöscht werden, da es noch ${existing._count.wines} Wein(e) enthält`,
    })
  }

  await prisma.winery.delete({
    where: { id },
  })

  return { success: true }
})
