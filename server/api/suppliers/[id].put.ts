import { prisma } from '../../utils/prisma'

interface UpdateSupplierBody {
  name?: string
  address?: string
  post?: string
  city?: string
  land?: string
  phone?: string
  email?: string
  website?: string
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID ist erforderlich',
    })
  }

  const body = await readBody<UpdateSupplierBody>(event)

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

  // Validation
  if (body.name !== undefined && !body.name?.trim()) {
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

  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name: body.name?.trim(),
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
