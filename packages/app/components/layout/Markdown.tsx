import { renderMarkdown } from 'lib/services/markdown';
import { useEffect, useState } from 'react';

export default function Markdown({ content }: { content: string }) {
  const [html, setHtml] = useState<string>();
  useEffect(() => {
    if (!html) {
      renderMarkdown(content)
        .then((h) => setHtml(h))
        .catch(console.error);
    }
    return () => {};
  }, [html, setHtml, content]);
  if (!html) return null;
  return (
    <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
