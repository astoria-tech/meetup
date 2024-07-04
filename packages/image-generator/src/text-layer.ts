import {LayerReturn} from './compose.js'
import {TextSvgProps, textSvg} from './text-svg.js'

export type TextLayerProps = TextSvgProps & Omit<LayerReturn, 'input'>

export function textLayer(props?: TextLayerProps) {
  return props.text
    ? () => ({
        input: textSvg(props),
        ...props,
      })
    : undefined
}
