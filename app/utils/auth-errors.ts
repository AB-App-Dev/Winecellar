import { authClient } from './auth-client'

type ErrorCode = keyof typeof authClient.$ERROR_CODES

// German translations for Better Auth error codes
const errorTranslations: Record<string, string> = {
  // Authentication errors
  INVALID_EMAIL: 'Ungültige E-Mail-Adresse',
  INVALID_EMAIL_OR_PASSWORD: 'Ungültige E-Mail-Adresse oder Passwort',
  INVALID_PASSWORD: 'Ungültiges Passwort',
  INVALID_CREDENTIALS: 'Ungültige Anmeldedaten',
  USER_NOT_FOUND: 'Benutzer nicht gefunden',
  USER_ALREADY_EXISTS: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits',
  EMAIL_NOT_VERIFIED: 'E-Mail-Adresse wurde noch nicht bestätigt',
  ACCOUNT_NOT_FOUND: 'Konto nicht gefunden',

  // Password errors
  PASSWORD_TOO_SHORT: 'Das Passwort ist zu kurz',
  PASSWORD_TOO_LONG: 'Das Passwort ist zu lang',
  PASSWORD_MISMATCH: 'Die Passwörter stimmen nicht überein',
  PASSWORD_COMPROMISED: 'Dieses Passwort ist unsicher. Bitte wählen Sie ein anderes',

  // Token/Session errors
  INVALID_TOKEN: 'Ungültiger oder abgelaufener Link',
  TOKEN_EXPIRED: 'Der Link ist abgelaufen',
  SESSION_EXPIRED: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
  INVALID_SESSION: 'Ungültige Sitzung',

  // Rate limiting
  TOO_MANY_REQUESTS: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut',
  RATE_LIMIT_EXCEEDED: 'Anfragelimit überschritten. Bitte warten Sie einen Moment',

  // General errors
  BAD_REQUEST: 'Ungültige Anfrage',
  UNAUTHORIZED: 'Nicht autorisiert',
  FORBIDDEN: 'Zugriff verweigert',
  NOT_FOUND: 'Nicht gefunden',
  INTERNAL_SERVER_ERROR: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut',
  FAILED_TO_CREATE_USER: 'Benutzer konnte nicht erstellt werden',
  FAILED_TO_CREATE_SESSION: 'Sitzung konnte nicht erstellt werden',
  FAILED_TO_UPDATE_USER: 'Benutzer konnte nicht aktualisiert werden',
  FAILED_TO_GET_SESSION: 'Sitzung konnte nicht abgerufen werden',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Dieses Konto ist bereits mit einem anderen Benutzer verknüpft',
  PROVIDER_NOT_FOUND: 'Anbieter nicht gefunden',
  CALLBACK_URL_NOT_ALLOWED: 'Die Weiterleitungs-URL ist nicht erlaubt',
  ORIGIN_CHECK_FAILED: 'Herkunftsprüfung fehlgeschlagen',
  UNABLE_TO_CREATE_USER: 'Benutzer konnte nicht erstellt werden',
}

// Default fallback message
const defaultErrorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut'

/**
 * Translates a Better Auth error code to German
 */
export function getAuthErrorMessage(code: string | undefined | null): string {
  if (!code) return defaultErrorMessage
  return errorTranslations[code] ?? defaultErrorMessage
}

/**
 * Translates error from Better Auth response
 */
export function translateAuthError(error: { code?: string; message?: string } | null): string {
  if (!error) return defaultErrorMessage
  if (error.code && errorTranslations[error.code]) {
    return errorTranslations[error.code]
  }
  return error.message ?? defaultErrorMessage
}
