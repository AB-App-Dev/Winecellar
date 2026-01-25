import { prisma } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Suppliers'],
    summary: 'Create a new supplier',
    description: 'Creates a new supplier entry',
    responses: {
      200: { description: 'Created supplier object' },
      400: { description: 'Validation error - invalid name, email, or website' }
    }
  }
})

interface CreateSupplierBody {
  name: string
  address?: string
  post?: string
  city?: string
  land?: string
  phone?: string
  email?: string
  website?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateSupplierBody>(event)

  // Validation
  if (!body.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name ist erforderlich',
    })
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ungültige E-Mail-Adresse',
    })
  }

  if (body.website && !/^https?:\/\/.+/.test(body.website)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Website muss mit http:// oder https:// beginnen',
    })
  }

  const supplier = await prisma.supplier.create({
    data: {
      name: body.name.trim(),
      address: body.address?.trim() || null,
      post: body.post?.trim() || null,
      city: body.city?.trim() || null,
      land: body.land?.trim() || null,
      phone: body.phone?.trim() || null,
      email: body.email?.trim() || null,
      website: body.website?.trim() || null,
    },
  })

  return supplier
})
