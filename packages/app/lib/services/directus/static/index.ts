import { DirectusTypes, Page } from 'lib/models'
import { adminBaseUrl } from 'lib/config'
import { Directus } from '@directus/sdk'

const directusDB = new Directus<DirectusTypes>(adminBaseUrl)

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
      container
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
  }
}
` // require('./queries/get_page.gql');
export async function getPageContentById(id: string) {
  return getPageContent(get_page, { id })
}

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
      container
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
  }
}
`
//const getPageContentByIdQuery = require('./queries/find_page.gql');
export async function getPageContentByUrl(slug: string) {
  return getPageContent(find_page, { slug })
}

export async function getPageContent(query: string, variables: any): Promise<Page> {
  const results = await directusDB.graphql.items<{ page: Page }>(query, variables)

  let { page } = results.data
  if (!page) return null

  if (Array.isArray(page)) page = page[0]

  return page
}

const all_pages = `
{
  pages: page(filter: { status: { _eq: "published" } }) {
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
      container
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
  }
}
`
// require('./queries/all_pages.gql');
export async function listActivePages(): Promise<Page[]> {
  const results = await directusDB.graphql.items<{ pages: Page[] }>(all_pages)

  return results.data.pages
}
