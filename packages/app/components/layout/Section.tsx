import Blocks from 'editorjs-blocks-react-renderer';
import { PageContent } from 'directus';
import Markdown from '../ui/Markdown';

export default function Section({ content }: { content: PageContent }) {
  const { container, container_classes, type } = content;
  switch (type) {
    case 'control':
      return <Blocks data={(content.control as any) || {}} />;
    case 'image':
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
    case 'html':
      return (
        <section
          className={`grid grid-cols-1 md:${container} ${container_classes} justify-evenly gap-4`}
          dangerouslySetInnerHTML={{ __html: content.html }}
        ></section>
      );
    case 'md':
      return (
        <section
          className={`grid grid-cols-1 md:${container} ${container_classes} justify-evenly gap-4`}
        >
          <Markdown content={content.markdown} />
        </section>
      );
  }
}
