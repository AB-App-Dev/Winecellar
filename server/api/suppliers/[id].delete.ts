import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Suppliers'],
    summary: 'Delete a supplier',
    description: 'Deletes a supplier by ID',
    responses: {
      200: { description: 'Success confirmation { success: true }' },
      400: { description: 'Invalid supplier ID' },
      404: { description: 'Supplier not found' }
    }
  }
})

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
