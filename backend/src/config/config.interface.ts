export interface AppConfig {
  PORT: string
  DB_NAME: string
  DB_HOST: string
  DB_PORT: string
  DB_USER: string
  DB_PASSWORD: string
  CORS_ORIGINS: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  MAX_REQUEST_BODY_SIZE: string
  ZOOM_ACCOUNT_ID: string
  ZOOM_CLIENT_ID: string
  ZOOM_CLIENT_SECRET: string
  ZOOM_HOST_USER_ID?: string
}
