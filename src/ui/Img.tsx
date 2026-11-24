import { Image, type ImageProps } from 'expo-image'

/**
 * Shared data stores images as `string` (URL on the web). In the app they are bundled asset ids
 * (numbers — see src/assets/images). `toSource` accepts both, so any `IMG.*` / `listing.images[i]` works.
 */
export function toSource(src: string | number | undefined | null): ImageProps['source'] {
  if (src === undefined || src === null) return undefined
  if (typeof src === 'number') return src
  return /^(https?:|file:|data:)/.test(src) ? { uri: src } : (src as unknown as number)
}

type Props = Omit<ImageProps, 'source'> & { src: string | number | undefined | null }

/** expo-image with a soft fade and cover fit by default. */
export function Img({ src, contentFit = 'cover', transition = 200, ...rest }: Props) {
  return <Image source={toSource(src)} contentFit={contentFit} transition={transition} {...rest} />
}
