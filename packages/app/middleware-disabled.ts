export { default } from 'next-auth/middleware'

export const config = { matcher: ['/member/:path', '/apply/:path'] }
