import 'server-only'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const ENV = {
  MONGODB_URI: requireEnv('MONGODB_URI'),
  NEXTAUTH_SECRET: requireEnv('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: requireEnv('NEXTAUTH_URL'),
}
