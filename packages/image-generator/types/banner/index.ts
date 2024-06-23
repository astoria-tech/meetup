import {compose} from '../../src/compose.js'
import {SpeakersImageData, relativeDirectory, speakersImage} from '../../src/event-data.js'
import {speakersSvg} from '../../src/speakers-svg.js'
import {textSvg} from '../../src/text-svg+.js'

export const type = speakersImage

export default ({date, speakers, day, month, time}: SpeakersImageData) =>
  compose({
    outputPath: relativeDirectory(`./public/banners/${date}.png`),
    background: relativeDirectory(`./packages/image-generator/types/banner/template.png`),
    layers: [
      textSvg({
        text: day,
        width: '250px',
        height: '300px',
        fontColor: 'white',
        fontSize: '80px',
        top: 110,
        left: 806,
      }),
      textSvg({
        text: month,
        width: '250px',
        height: '300px',
        fontColor: 'white',
        fontSize: '60px',
        top: 175,
        left: 806,
      }),
      textSvg({
        text: time,
        width: '250px',
        height: '300px',
        fontColor: 'black',
        fontSize: '60px',
        top: 300,
        left: 896,
      }),
      ...speakersSvg({
        speakers,
        imageSize: 275,
        fontSize: 31,
        fontColor: 'white',
        lineHeight: 29,
        xPadding: 100,
        bottomPadding: 10,
        imageBottomPadding: 10,
        offsetYPct: 52,
        gapWidthPct: 15,
      }),
    ],
  })
