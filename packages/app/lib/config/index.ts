const config = {
  title: 'Guys in Heat',
  description: "Denver's social events for bi, married and discrete men.",
  baseUrl: process.env.BASE_URL || 'https://guysnheat.com',
  adminUrl: 'https://admin.guysnheat.com',
  adminBaseUrl: process.env.ADMIN_URL || 'https://admin.guysnheat.com',
  memberCookie: 'gnh-id',
}
const { title, description, baseUrl, adminUrl, adminBaseUrl, memberCookie } = config
export { title, description, baseUrl, adminUrl, adminBaseUrl, memberCookie }
