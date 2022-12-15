import { remark } from 'remark';
import html from 'remark-html';

export function convertMarkdownToHtml(markdown: string): string {
  return remark().use(html).processSync(markdown).toString();
}
