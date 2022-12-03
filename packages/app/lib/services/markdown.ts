import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
const parser = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw) // *Parse* the raw HTML strings embedded in the tree
  .use(rehypeStringify);

export async function renderMarkdown(md: string): Promise<string> {
  if (!md) return '';
  const html = await parser.process(md);
  return html.toString();
}
