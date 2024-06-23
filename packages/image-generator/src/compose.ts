import fs from 'fs/promises'
import sharp from 'sharp'

export type LayerReturn = {
  input: Buffer
  top: number
  left: number
}

export type Layer = ({
  width,
  height,
}: {
  width: number
  height: number
}) => LayerReturn | Promise<LayerReturn> | undefined | Promise<undefined>

export type ComposeProps = {
  background: Buffer | string
  layers?: Layer[]
  outputPath?: string
}

export async function compose({background, layers, outputPath}: ComposeProps) {
  const bg = typeof background === 'string' ? await fs.readFile(background) : background
  const template = sharp(bg)
  const {width, height} = await template.metadata()
  if (!width || !height) {
    throw new Error('Template image dimensions are undefined')
  }
  const activeLayers = await Promise.all([...layers].flat().map(l => l({width, height})))
  const activeLayersClean = activeLayers.filter(v => v).flat()
  if (outputPath) {
    await template.composite(activeLayersClean).toFile(outputPath)
  } else {
    process.stdout.write(await template.composite(activeLayersClean).toBuffer())
  }
}
