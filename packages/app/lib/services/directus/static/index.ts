import { DirectusTypes, Page } from 'lib/models'
import { adminBaseUrl } from 'lib/config'

const get_page = `query getPage($id: ID!) {
  page: page_by_id(id: $id) {
    id
    title
    description
    slug
    in_menu
    visibility
    static
    image {
      id
      height
      width
      title
      description
    }
    markdown
    status
    content (filter: { status: { _eq: "published" }}) {
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
      status
      parent {
        id
        slug
        title
        status
      }
    }
    next_page_params
    parent {
      id
      slug
      title
      status
    }
    children (filter: { status: { _eq: "published" }}) {
      id
      slug
      title
      status
    }
  }
}
` // require('./queries/get_page.gql');
export async function getPageById(id: string) {
  return getPageContent(get_page, { id })
}

const find_page = `query findPage($slug: String) {
  page: page(filter: { slug: { _eq: $slug } }) {
    id
    title
    description
    visibility
    static
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
    status
    content (filter: { status: { _eq: "published" }}) {
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
      description
      status
      published
      markdown
      parent {
        id
        slug
        title
        status
      }
      image {
        id
        title
      }
    }
    next_page_params
    parent {
      id
      slug
      title
      status
    }
    children (filter: { status: { _eq: "published" }}) {
      id
      slug
      title
      description
      markdown
      published
      status
      image {
        id
        title
      }
    }
  }
}
`
//const getPageContentByIdQuery = require('./queries/find_page.gql');
export async function getPageBySlug(slug: string) {
  return await getPageContent(find_page, { slug })
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
  pages: page (
      filter: { status: { _eq: "published" }}
      sort: ["sort"]
    ) {
    id
    title
    description
    slug
    in_menu
    static
    visibility
    image {
      id
      height
      width
      title
      description
    }
    status
    markdown
    published
    content {
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
      status
      image {
        id
        title
      }
      parent {
        id
        slug
        title
        status
      }
    }
    next_page_params
    parent {
      id
      slug
      title
      status
    }
    children (
      filter: { status: { _eq: "published" }}
      sort: ["sort"]
    ) {
      id
      slug
      title
      status
      parent {
        id
        slug
        title
        status
      }
    }
  }
}
`
// require('./queries/all_pages.gql');

export async function listPages(parentId: string = null): Promise<Page[]> {
  const { Directus } = await import('@directus/sdk')
  const directusDB = new Directus<DirectusTypes>(adminBaseUrl)
  let {
    data: { pages },
  } = await directusDB.graphql.items<{ pages: Page[] }>(all_pages)

  const mapParent = (page: Page): Page => {
    const { parent } = page
    let { slug } = page
    if (slug == 'index') slug = ''
    if (parent?.slug) {
      mapParent(parent)
      slug = parent.slug + '/' + slug
    }
    if (page.next_page?.slug) {
      page.next_page = mapParent(page.next_page)
    }
    if (page.children?.length) {
      page.children = page.children.map((c) => mapParent(c))
    }
    return {
      ...page,
      slug,
    }
  }
  // map slug with parent
  const fixedPages = pages.map((p) => mapParent(p))
  return parentId ? fixedPages.filter((p) => p.parent?.id === parentId) : fixedPages
}
