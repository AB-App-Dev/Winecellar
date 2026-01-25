import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Wines'],
    summary: 'Delete a wine',
    description: 'Deletes a wine by ID',
    responses: {
      200: {
        description: 'Success confirmation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true }
              }
            }
          }
        }
      },
      400: { description: 'Invalid wine ID' }
    }
  }
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid wine ID',
    })
  }

  await prisma.wine.delete({
    where: { id },
  })

  return { success: true }
})
