import {Layer} from './compose.js'
import {speakerSvg, SpeakerSvgProps} from './speaker-svg++.js'

export interface Speaker {
  image: string | Buffer
  name: string | string[]
}

type Core = Omit<SpeakerSvgProps, 'total' | 'height' | 'width' | 'index' | 'lines' | 'image'>

export type SpeakersSvgProps = {speakers: Speaker[]} & Core

export const speakersSvg = ({speakers, ...core}: SpeakersSvgProps): Layer[] =>
  speakers.map(
    (speaker, index, total) =>
      ({height, width}) =>
        speakerSvg({
          total: total.length,
          height,
          width,
          index,
          lines: speaker.name,
          image: speaker.image,
          ...core,
        }),
  )
