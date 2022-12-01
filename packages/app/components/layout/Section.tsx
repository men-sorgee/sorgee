import { useEffect, useState, createContext } from 'react';
import Image from 'next/image';
import { ContentSection } from 'lib/services/directus';
import { renderMarkdown } from 'lib/services/markdown';

const cache: Record<string, { html: string; hash: string }> = {};

async function getInnerHtml(content: ContentSection) {
  let html = content.html;
  if (content.type === 'md') {
    const { hash } = content;
    if (cache[content.id]?.hash === hash) {
      return cache[content.id].html;
    }
    html = await renderMarkdown(content.markdown);
    cache[content.id] = { html, hash };
  }

  return { __html: html };
}

export default function Section({ content }: { content: ContentSection }) {
  const { container, container_classes, type } = content;
  if (type === 'image') {
    return (
      <img
        className={`w-full ${container_classes} `}
        src={`/api/asset/${content.image.id}`}
        alt={content.image.description}
        height={content.image.height}
        width={content.image.width}
        title={content.image.title}
      />
    );
  }
  const [html, setHtml] = useState({ __html: '' });

  useEffect(() => {
    getInnerHtml(content).then((h) => setHtml(h as any));
  }, []);

  return (
    <section
      className={`grid grid-cols-1 md:${container} ${container_classes} justify-evenly gap-4`}
      dangerouslySetInnerHTML={html}
    ></section>
  );
}
