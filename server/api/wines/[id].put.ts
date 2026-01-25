import { prisma } from '../../utils/prisma'
import { WineArt, WineTaste } from '../../../app/generated/prisma/client.js'

defineRouteMeta({
  openAPI: {
    tags: ['Wines'],
    summary: 'Update a wine',
    description: 'Updates an existing wine by ID',
    responses: {
      200: { description: 'Updated wine object with winery relation' },
      400: { description: 'Validation error - missing or invalid fields' },
      404: { description: 'Wine not found' }
    }
  }
})

interface UpdateWineBody {
  name: string
  wineryId?: string
  art: string
  taste: string
  year: number
  barrelType?: string
  alcoholPercentage?: number
  amount?: string
  wineVariety?: string
  varieties?: string
  land: string
  region?: string
  price: number
  bottlesAmount: number
  availableAtYear?: number
  imageUrl?: string
  description?: string
  hiddenForGuests?: boolean
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID ist erforderlich',
    })
  }

  const body = await readBody<UpdateWineBody>(event)

  // Validation
  if (!body.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name ist erforderlich',
    })
  }

  if (!body.art || !Object.values(WineArt).includes(body.art as WineArt)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gültige Art ist erforderlich',
    })
  }

  if (!body.taste || !Object.values(WineTaste).includes(body.taste as WineTaste)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gültiger Geschmack ist erforderlich',
    })
  }

  if (!body.year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Jahrgang ist erforderlich',
    })
  }

  if (!body.land?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Land ist erforderlich',
    })
  }

  if (body.price === undefined || body.price === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Preis ist erforderlich',
    })
  }

  if (body.bottlesAmount === undefined || body.bottlesAmount === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Stück ist erforderlich',
    })
  }

  // Check if wine exists
  const existingWine = await prisma.wine.findUnique({
    where: { id },
  })

  if (!existingWine) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Wein nicht gefunden',
    })
  }

  const wine = await prisma.wine.update({
    where: { id },
    data: {
      name: body.name.trim(),
      wineryId: body.wineryId || null,
      art: body.art as WineArt,
      taste: body.taste as WineTaste,
      year: body.year,
      barrelType: body.barrelType?.trim() || null,
      alcoholPercentage: body.alcoholPercentage ?? null,
      amount: body.amount?.trim() || null,
      wineVariety: body.wineVariety?.trim() || null,
      varieties: body.varieties?.trim() || null,
      land: body.land.trim(),
      region: body.region?.trim() || null,
      price: body.price,
      bottlesAmount: body.bottlesAmount,
      availableAtYear: body.availableAtYear ?? null,
      imageUrl: body.imageUrl?.trim() || null,
      description: body.description?.trim() || null,
      hiddenForGuests: body.hiddenForGuests ?? false,
    },
    include: {
      winery: true,
    },
  })

  return wine
})
