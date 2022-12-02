import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const parser = unified().use(remarkParse).use(remarkHtml);

export async function renderMarkdown(md: string): Promise<string> {
  if (!md) return '';
  const html = await parser.process(md);
  return html.toString();
}
