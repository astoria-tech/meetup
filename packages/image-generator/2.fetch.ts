import fs from 'fs/promises'
import mime from 'mime-types'
import {build as _build, type Speaker as _Speaker, type Options as _Options} from './1.core.js'
import path from 'path'

/**
 * @module
 * this is a layer that fetches iamges from the
 * internet the core doesn't care about the images
 * themselves, just recieves buffer
 */

interface Speaker extends _Speaker {
  githubUsername?: string
}

export interface Options extends _Options {
  speakers: Speaker[]
  clearCache?: boolean
}

async function fetchImage(url: string, speakerName: string | string[], clearCache: boolean): Promise<Buffer> {
  const slug = [speakerName].flat().join('').toLowerCase().replace(/\s/g, '')
  const speakerImagesDir = path.join(import.meta.dirname, '../..', 'public/speakers')
  const files = await fs.readdir(speakerImagesDir)
  const existingFile = files.find(file => file.startsWith(slug))
  if (existingFile && clearCache !== true) {
    return await fs.readFile(path.join(speakerImagesDir, existingFile))
  }
  const response = await fetch(url)
  const contentType = response.headers.get('content-type')
  const extensionFromMime = mime.extension(contentType)
  const extension = contentType ? extensionFromMime : url.split('.').pop()
  const fileName = `${slug}.${extension}`
  const location = path.join(speakerImagesDir, fileName)
  const buffer = await response.arrayBuffer()
  const nodeBuffer = Buffer.from(buffer)
  await fs.writeFile(location, nodeBuffer)
  return nodeBuffer
}

const safeUrl = (url: string) => {
  try {
    return new URL(url)
  } catch {
    return undefined
  }
}

export async function build(options: Options) {
  const {speakers, clearCache, ...rest} = options
  // prioritixe profileImage over githubUsername
  for (const speaker of speakers) {
    if (safeUrl(speaker.profileImage)) {
      try {
        const buffer = await fetchImage(speaker.profileImage, speaker.name, clearCache)
        speaker.buffer = buffer
      } catch {}
    }
    if (!speaker.buffer) {
      if (speaker.githubUsername) {
        const buffer = await fetchImage(`https://github.com/${speaker.githubUsername}.png`, speaker.name, clearCache)
        speaker.buffer = buffer
      }
    }
  }

  return _build({
    speakers,
    ...rest,
  })
}
