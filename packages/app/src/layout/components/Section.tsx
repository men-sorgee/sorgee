import { Markdown } from "components";
import Blocks from "editorjs-blocks-react-renderer";
import { PageContent } from "lib/models";

import { Image, SimpleGrid } from "@chakra-ui/react";

export const Section = ({ content }: { content: PageContent }) => {
  const { columns, container_classes, type } = content
  switch (type) {
    case 'control':
      if (!content?.control?.version) return null
      return (
        <Blocks
          data={{
            blocks: content.control.blocks,
            time: content.control.time,
            version: content.control.version,
          }}
        />
      )
    case 'image':
      return (
        <Image
          w="full"
          src={`/api/asset/${content.image.id}`}
          alt={content.image.description}
          height={content.image.height}
          width={content.image.width}
          title={content.image.title}
        />
      )
    case 'html':
      return (
        <SimpleGrid
          as="section"
          spacing={4}
          columns={columns}
          className={container_classes}
          dangerouslySetInnerHTML={{ __html: content.html }}
        ></SimpleGrid>
      )
    case 'md':
      return (
        <SimpleGrid as="section" spacing={4} columns={columns} className={container_classes}>
          <Markdown content={content.markdown} />
        </SimpleGrid>
      )
  }
}
