import fs from 'fs/promises'
import mime from 'mime-types'
import { generateEventImage as _generateEventImage, type Speaker as _Speaker, type Options as _Options } from './core'
import path from 'path'

interface Speaker extends _Speaker {
  githubUsername?: string;
}

export interface Options extends _Options {
  speakers: Speaker[],
  clearCache?: boolean;
}

async function fetchImage(url: string, speakerName: string, clearCache: boolean): Promise<Buffer> {
  const slug = speakerName.toLowerCase().replace(/\s/g, '');
  const speakerImagesDir = path.join(__dirname, '../..', 'public/speakers');
  const files = await fs.readdir(speakerImagesDir);
  const existingFile = files.find(file => file.startsWith(slug));
  if (existingFile && clearCache !== true) {
    return await fs.readFile(path.join(speakerImagesDir, existingFile));
  }
  const response = await fetch(url);
  const contentType = response.headers.get('content-type');
  const extensionFromMime = mime.extension(contentType)
  const extension = contentType ? extensionFromMime : url.split('.').pop();
  const fileName = `${slug}.${extension}`;
  const location = path.join(speakerImagesDir, fileName);
  const buffer = await response.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);
  await fs.writeFile(location, nodeBuffer)
  return nodeBuffer;
}

export async function generateEventImage(options: Options) {
  const { speakers, clearCache, ...rest } = options;

  for (const speaker of speakers) {
    if (speaker.githubUsername) {
      const buffer = await fetchImage(`https://github.com/${speaker.githubUsername}.png`, speaker.name, clearCache);
      speaker.buffer = buffer;
    } else if (speaker.profileImage && speaker.profileImage.startsWith('http')) {
      const buffer = await fetchImage(speaker.profileImage, speaker.name, clearCache);
      speaker.buffer = buffer;
    }
  }
  
  return _generateEventImage({
    speakers,
    ...rest
  });
}
