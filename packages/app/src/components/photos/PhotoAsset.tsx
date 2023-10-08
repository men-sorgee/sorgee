import { DirectusFile } from "lib/models";
import { memo } from "react";

import { chakra, Image, ImageProps } from "@chakra-ui/react";

export type PhotoAssetProps = ImageProps & {
  fileId: string | DirectusFile
}

export const PhotoAsset = memo(chakra(
  ({ fileId, height, width = '150px', alt, ...props }: PhotoAssetProps) => {
    if (!fileId) return null
    return (
      <Image
        boxSize={width}
        objectFit="cover"
        src={`/api/asset/${fileId}`}
        height={height}
        width={width}
        alt={alt}
        {...props}
      />
    )
  }
))
