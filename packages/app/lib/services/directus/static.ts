import { ContentSection, SectionPage } from '.';
import { getAdminClient } from './client';
import { Page, PageContent } from './types';

const CONTENT_QUERY = `query getPage ($id: ID!) {
    page: page_by_id(id: $id) {
      title
      description
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

const cache = new Map<string, SectionPage>();
export function clearPageContentCache() {
  cache.clear();
}
export async function getPageContent(id: string): Promise<SectionPage> {
  if (cache.has(id)) return cache.get(id)!;

  const adminClient = await getAdminClient();
  const results = await adminClient.graphql.items<{ page: Page }>(
    CONTENT_QUERY,
    {
      id
    }
  );

  const { page } = results.data;

  const content = await Promise.all(
    page.content.map(async (c: ContentSection) => {
      const hash = c.date_updated || c.date_created || null;
      return {
        ...c,
        hash
      };
    })
  );
  return (cache[id] = {
    ...page,
    content
  });
}

export async function listActivePages(): Promise<Page[]> {
  const adminClient = await getAdminClient();
  const results = await adminClient.graphql.items<{ pages: Page[] }>(
    `query getPages {
      pages: pages {
        id
        title
        description
        status
      }
    }`
  );

  return results.data.pages;
}
