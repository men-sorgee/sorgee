import { ContentSection, SectionPage } from '.';
import { getAdminClient } from './client';
import { Page } from './types';

const cache = new Map<string, SectionPage>();
export function clearPageContentCache() {
  cache.clear();
}

const byId = `query getPage ($id: ID!) {
        page: page_by_id(id: $id) {
          id
          status
          date_created
          date_updated
          title
          description
          url
          status
          content {
            id
            name
            type
            container
            container_classes
            control
            html
            markdown
            image {
              id
              height
              width
              title
              description
            }
          }
        }
      }`;

const byUrl = `query findPage($url: String){
  page: page (
    filter: {
      url: {
          _eq: $url
      }
    }
  ) {
    id
    status
    date_created
    date_updated
    title
    description
    url
    status
    content {
      id
      name
      type
      container
      container_classes
      control
      html
      markdown
      image {
        id
        height
        width
        title
        description
      }
    }
  }
}

`;

export async function getPageContentById(id: string) {
  if (cache.has(id)) return cache.get(id)!;
  return getPageContent(byId, { id });
}
export async function getPageContentByUrl(url: string) {
  return getPageContent(byUrl, { url });
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
  return (cache[page.id] = page as SectionPage);
}

export async function listActivePages(): Promise<Page[]> {
  const adminClient = await getAdminClient();
  const results = await adminClient.graphql.items<{ pages: Page[] }>(
    `{
      pages: page (
        filter: {
          status: {
              _eq: "published"
          }
        }
      ) {
        id
        status
        date_created
        date_updated
        title
        description
        url
      }
    }`
  );

  return results.data.pages;
}
