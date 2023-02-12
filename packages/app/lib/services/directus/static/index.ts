import { DirectusTypes, Page } from 'lib/models'
import { adminBaseUrl } from 'lib/config'

const get_page = `query getPage($id: ID!) {
  page: page_by_id(id: $id) {
    id
    title
    description
    slug
    in_menu
    image {
      id
      height
      width
      title
      description
    }
    markdown
    content(filter: { status: { _eq: "published" } }) {
      id
      name
      columns
      container_classes
      type
      html
      image {
        id
        description
        height
        width
        title
      }
      control
      markdown
      status
    }
    next_page {
      id
      slug
      title
    }
    next_page_params
  }
}
` // require('./queries/get_page.gql');
export async function getPageContentById(id: string) {
  let page =
    cachedPages.size > 0 ? Array.from(cachedPages.values()).find((page) => page.id === id) : null
  if (page) return page
  return getPageContent(get_page, { id })
}

const cachedPages = new Map<string, Page>()

const find_page = `query findPage($slug: String) {
  page: page(filter: { slug: { _eq: $slug } }) {
    id
    title
    description
    slug
    in_menu
    image {
      id
      height
      width
      title
      description
    }
    markdown
    content(filter: { status: { _eq: "published" } }) {
      id
      name
      columns
      container_classes
      type
      html
      image {
        id
        description
        height
        width
        title
      }
      control
      markdown
      status
    }
    next_page {
      id
      slug
      title
    }
    next_page_params
  }
}
`
//const getPageContentByIdQuery = require('./queries/find_page.gql');
export async function getPageContentByUrl(slug: string) {
  let page = cachedPages.get(slug)
  if (page) return page
  page = await getPageContent(find_page, { slug })
  cachedPages.set(slug, page)
  return page
}

export async function getPageContent(query: string, variables: any): Promise<Page> {
  const { Directus } = await import('@directus/sdk')
  const directusDB = new Directus<DirectusTypes>(adminBaseUrl)
  const results = await directusDB.graphql.items<{ page: Page }>(query, variables)

  let { page } = results.data
  if (!page) return null

  if (Array.isArray(page)) page = page[0]

  return page
}

const all_pages = `
{
  pages: page(filter: { status: { _eq: "published" }, static: { _eq: false } }) {
    id
    title
    description
    slug
    in_menu
    image {
      id
      height
      width
      title
      description
    }

    markdown
    content(filter: { status: { _eq: "published" } }) {
      id
      name
      columns
      container_classes
      type
      html
      image {
        id
        description
        height
        width
        title
      }
      control
      markdown
      status
      
    }
    next_page {
      id
      slug
      title
    }
    next_page_params
    parent {
      id
      slug
    }
    children {
      id
      slug
    }
  }
}
`
// require('./queries/all_pages.gql');

export async function listActivePages(): Promise<Page[]> {
  if (cachedPages.size > 0) return Array.from(cachedPages.values())

  const { Directus } = await import('@directus/sdk')
  const directusDB = new Directus<DirectusTypes>(adminBaseUrl)
  const { data } = await directusDB.graphql.items<{ pages: Page[] }>(all_pages)
  const { pages } = data
  pages.map((p) => {
    const { parent } = p
    if (parent?.id) {
      let base = pages.find((page) => page.id === parent.id)
      p.slug = `${base.slug}/${p.slug}`
    }
    return p
  })
  pages.forEach((page) => {
    cachedPages.set(page.slug, page)
  })

  return data.pages
}
