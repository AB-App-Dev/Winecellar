import { useSession } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const session = useSession()

  await session.value.refetch()

  if (!session.value.data?.user) {
    return navigateTo('/admin/login')
  }
})
