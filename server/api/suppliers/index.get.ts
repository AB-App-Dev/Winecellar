import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return suppliers
})
