import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export async function renderMarkdown(md: string): Promise<string> {
  const html = await unified().use(remarkParse).use(remarkHtml).process(md);
  return html.toString();
}
