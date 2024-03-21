import { generateEventImage as _generateEventImage, type Speaker as _Speaker, type Options as _Options } from './core'

interface Speaker extends _Speaker {
  githubUsername?: string;
}

export interface Options extends _Options {
  speakers: Speaker[]
}

async function fetchImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

export async function generateEventImage(options: Options) {
  const { speakers, ...rest } = options;

  for (const speaker of speakers) {
    if (speaker.githubUsername) {
      const buffer = await fetchImage(`https://github.com/${speaker.githubUsername}.png`);
      speaker.buffer = buffer;
    } else if (speaker.profileImage && speaker.profileImage.startsWith('http')) {
      const buffer = await fetchImage(speaker.profileImage);
      speaker.buffer = buffer;
    }
  }
  
  return _generateEventImage({
    speakers,
    ...rest
  });
}
