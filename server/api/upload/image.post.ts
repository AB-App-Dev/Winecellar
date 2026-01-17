import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded',
    })
  }

  const file = formData.find((item) => item.name === 'file')

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file found in request',
    })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
    })
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File too large. Maximum size is 5MB.',
    })
  }

  // Generate unique filename
  const ext = file.filename?.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'wines')
  await mkdir(uploadDir, { recursive: true })

  // Write file to public directory
  const filePath = join(uploadDir, filename)
  await writeFile(filePath, file.data)

  return {
    url: `/uploads/wines/${filename}`,
    filename,
  }
})
