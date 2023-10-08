import { adminUrl } from "lib/config";
import { GNHSchema, Page } from "lib/models";

import { createDirectus, graphql } from "@directus/sdk";

export async function getPageById(id: string): Promise<Page> {
  const admin = createDirectus<GNHSchema>(adminUrl)
    .with(graphql())
  const { page } = await admin.query<{ page: Page }>(`query getPage($id: ID!) {
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
  }`, { id }, 'items')

  return page
}



export async function getPageBySlug(slug: string): Promise<Page> {
  const admin = createDirectus<GNHSchema>(adminUrl)
    .with(graphql())
  const { pages } = await admin.query<{ pages: Page[] }>(`query findPage($slug: String) {
    pages: page(filter: { slug: { _eq: $slug } }) {
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
  `, { slug }, 'items')

  return pages[0]
}


export async function listPages(parentId: string = null): Promise<Page[]> {
  const admin = createDirectus<GNHSchema>(adminUrl)
    .with(graphql())
  let { pages } = await admin.query<{ pages: Page[] }>(`query listPages
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
  `, {}, 'items')

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
