import { prisma, WineArt, WineTaste } from '../../utils/prisma'

defineRouteMeta({
  openAPI: {
    tags: ['Wines'],
    summary: 'Create a new wine',
    description: 'Creates a new wine entry (Admin only)',
    responses: {
      200: {
        description: 'Created wine object with winery relation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                art: { type: 'string' },
                taste: { type: 'string' },
                year: { type: 'integer' },
                land: { type: 'string' },
                price: { type: 'number' },
                winery: { type: 'object' }
              }
            }
          }
        }
      },
      400: { description: 'Validation error - missing or invalid fields' }
    }
  }
})

interface CreateWineBody {
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
  const body = await readBody<CreateWineBody>(event)

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

  const wine = await prisma.wine.create({
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
