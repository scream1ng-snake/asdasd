export const frontRoutes = {
  '/': '/',
  '/catalog': '/catalog',
  '/booking': '/booking',
  '/admin': '/admin',
} as const
export type frontRoute = typeof frontRoutes[keyof typeof frontRoutes]

export const frontendRoutes = Object.keys(frontRoutes) as frontRoute[]

