import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const wineries = await prisma.winery.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: { wines: true },
      },
    },
  })

  return wineries
})
