import { auth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Only protect OpenAPI routes
  if (!url.pathname.startsWith('/_swagger') && !url.pathname.startsWith('/_openapi')) {
    return
  }

  // Check session using better-auth's API
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Admin login required',
    })
  }
})
