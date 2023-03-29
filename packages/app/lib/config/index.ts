const config = {
  title: `Guys 'N Heat`,
  description: "Denver's social events for bi, married and discrete men.",
  baseUrl: process.env.BASE_URL || 'https://guysnheat.com',
  adminUrl: process.env.ADMIN_URL || 'https://admin.guysnheat.com',
  adminBaseUrl: process.env.ADMIN_URL || 'https://admin.guysnheat.com',
  memberCookie: 'gnh-id',
  homePage: 'ac330d1b-0340-4a61-9b42-996aa0936d2b',
  blogPage: 'e19c78ec-d804-4c77-af15-bb255f6aedac',
  rulesPage: '21adb349-b96c-4234-9044-a825736f22f5',
}
const {
  title,
  description,
  baseUrl,
  adminUrl,
  adminBaseUrl,
  memberCookie,
  blogPage,
  homePage,
  rulesPage,
} = config
export {
  title,
  description,
  baseUrl,
  adminUrl,
  adminBaseUrl,
  memberCookie,
  blogPage,
  homePage,
  rulesPage,
}
