import auth from 'next-auth/middleware'
export default auth
export const config = { matcher: ['/member/:path', '/apply/:path'] }
