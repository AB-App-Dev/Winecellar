import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID ist erforderlich',
    })
  }

  // Check if supplier exists
  const existing = await prisma.supplier.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lieferant nicht gefunden',
    })
  }

  await prisma.supplier.delete({
    where: { id },
  })

  return { success: true }
})
