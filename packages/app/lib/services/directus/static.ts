import { ContentSection, SectionPage } from '.';
import { getAdminClient } from './client';
import { Page } from './types';

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
  const adminClient = await getAdminClient();
  const results = await adminClient.graphql.items<{ page: Page }>(
    query,
    variables
  );

  let { page } = results.data;
  if (!page) return null;

  if (Array.isArray(page)) page = page[0];

  const content = page.content
    ? await Promise.all(
        page.content?.map(async (c: ContentSection) => {
          const hash = c.date_updated || c.date_created || null;
          return {
            ...c,
            hash
          };
        })
      )
    : [];
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
      }
    }`;
export async function getActivePages(): Promise<Page[]> {
  const adminClient = await getAdminClient();
  const results = await adminClient.graphql.items<{ pages: Page[] }>(all);

  return results.data.pages;
}
