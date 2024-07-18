import fs from 'fs/promises'
import sharp from 'sharp'
import {ImageSvgProps, imageSvg} from './image-svg.js'
import {relativeDirectory} from './event-data.js'

function isUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const BASE64PREFIX = 'data:image/png;base64,'

async function bufferToBase64(buffer: Buffer, width: number) {
  const resizedImageBuf = await sharp(buffer)
    .resize({
      width: width,
      height: width,
    })
    .toFormat('png')
    .toBuffer()

  return `${BASE64PREFIX}${resizedImageBuf.toString('base64')}`
}
async function processImage(input: Buffer | string | undefined, imageSize: number) {
  try {
    if (Buffer.isBuffer(input)) {
      // Input is a Buffer, convert to base64 string
      return await bufferToBase64(input, imageSize)
    } else if (isUrl(input)) {
      // Input is a URL, fetch the image and convert to base64
      const response = await fetch(input)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      return await bufferToBase64(buffer, imageSize)
    } else if (input.startsWith(BASE64PREFIX)) {
      // Input is already a base64 string, return as is
      return input
    } else if (typeof input === 'string') {
      // Assume input is a file path, read the file and convert to base64
      const buffer = await fs.readFile(input)
      return await bufferToBase64(buffer, imageSize)
    }
  } catch (e) {}
  const buffer = await fs.readFile(relativeDirectory('packages/image-generator/shared-assets/default.png'))
  return await bufferToBase64(buffer, imageSize)
}

/**
 * this exists to create the most optimal name
 * break for the image, because when the name is
 * too long, it will break everything
 */
const optimalName = (name: string) => {
  const names = name.split(' ')
  const partA = [names.shift()]
  const partB = [names.pop()]
  names.forEach((n, i) => {
    const aLength = partA.join('').length
    const bLength = partB.join('').length
    if (aLength > bLength) {
      partB.unshift(n)
    } else {
      partA.push(n)
    }
  })
  return [partA.join(' '), partB.join(' ')]
}

export type SpeakerSvgProps = Omit<ImageSvgProps, 'image' | 'lines'> & {
  image: string | Buffer
  lines: string | string[]
}

export async function speakerSvg(props: SpeakerSvgProps) {
  const {image: _image, lines: _lines, imageSize} = props
  const lines = Array.isArray(_lines) ? _lines : optimalName(_lines)
  const image = await processImage(_image, imageSize)
  return imageSvg({...props, image, lines})
}
