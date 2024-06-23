import {LayerReturn} from './compose.js'
import {TextSvgProps as _TextSvgProps, textSvg as _textSvg} from './text-svg.js'

export type TextSvgProps = _TextSvgProps & Omit<LayerReturn, 'input'>

export function textSvg(props?: TextSvgProps) {
  return props.text
    ? () => ({
        input: _textSvg(props),
        ...props,
      })
    : undefined
}
