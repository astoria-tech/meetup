import {svg} from './svg.js'

export type TextSvgProps = {
  text: string
  width: string
  height: string
  fontColor: string
  fontSize: string
}

export function textSvg({text, width, height, fontColor, fontSize}: TextSvgProps): Buffer {
  return svg`
  <svg ${{width, height}}>
    <text ${{
      fontSize,
      x: '50%',
      y: '50%',
      alignmentBaseline: 'middle',
      textAnchor: 'middle',
      fontFamily: 'Helvetica',
      fill: fontColor,
      fontWeight: 'bold',
    }}>
      ${text}
    </text>
  </svg>`
}
