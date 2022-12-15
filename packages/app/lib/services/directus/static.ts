import { Collections, Page, PageContent } from './types';
import { adminBaseUrl } from 'config/client';
import { Directus } from '@directus/sdk';

const directusDB = new Directus<Collections>(adminBaseUrl);

export type SectionContainerType =
  | 'grid-cols-1'
  | 'grid-cols-2'
  | 'grid-cols-3'
  | 'grid-cols-4';

export type ContentType = 'html' | 'md' | 'image' | 'control';

export type ContentSection = PageContent & {
  hash: string;
  image: {
    id: string;
    height: number;
    width: number;
    title: string;
    description: string;
  };
};

export type SectionPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  markdown: string;
  status: 'published' | 'draft';
  in_menu: boolean;
  image?: {
    id: string;
    height: number;
    width: number;
    description: string;
    title: string;
  };
  content: ContentSection[];
};

export type CMSPageProps = {
  title: string;
  description: string;
  content: ContentSection[];
};

export type MenuPage = {
  title: string;
  path: string;
};

const byId = `
  query getPage ($id: ID!) {
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
    content (
        filter: { status: { _eq: "published" } }
      ) {
      id,
      name,
      container,
      container_classes,
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
}`;
export async function getPageContentById(id: string) {
  return getPageContent(byId, { id });
}

const byUrl = `
  query findPage($slug: String) {
    page: page (
      filter: {
        slug: {
            _eq: $slug
        }
      }
    ) {
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
      content (
          filter: { status: { _eq: "published" } }
        ) {
        id,
        name,
        container,
        container_classes,
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

`;
export async function getPageContentByUrl(slug: string) {
  return getPageContent(byUrl, { slug });
}

export async function getPageContent(
  query: string,
  variables: any
): Promise<SectionPage> {
  const results = await directusDB.graphql.items<{ page: Page }>(
    query,
    variables
  );

  let { page } = results.data;
  if (!page) return null;

  if (Array.isArray(page)) page = page[0];

  const content = await Promise.all(
    page.content && page.content.length
      ? page.content.map(async (c: ContentSection) => {
          const hash = c.date_updated || c.date_created || null;
          return {
            ...c,
            hash
          };
        })
      : []
  );
  page.content = content;
  return page as SectionPage;
}

const all = `{
      pages: page (
        filter: {
          status: {
              _eq: "published"
          }
        }
      ) {
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
        content (
          filter: { status: { _eq: "published" } }
        ) {
          id,
          name,
          container,
          container_classes,
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
    }`;
export async function listActivePages(): Promise<SectionPage[]> {
  const results = await directusDB.graphql.items<{ pages: SectionPage[] }>(all);

  return results.data.pages;
}
