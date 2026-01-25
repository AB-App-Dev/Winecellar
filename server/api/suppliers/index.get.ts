import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Suppliers'],
    summary: 'Get all suppliers',
    description: 'Returns all suppliers',
    responses: {
      200: {
        description: 'Array of supplier objects',
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
                  website: { type: 'string' }
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
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return suppliers
})
