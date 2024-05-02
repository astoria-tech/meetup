import path from 'path'
import fs from 'fs/promises'
import {generateEventImage, type Options} from './fetch'
import {getSpeakerInfo} from './speakers'
import {convertDateToObject} from './date'

const getImageJSONSettings = async (image: string) => {
  const file = await fs.readFile(path.join(import.meta.dirname, `./${image}/index.json`), 'utf8')
  return JSON.parse(file)
}

type BuildOptions = {
  image: string
  date: string
  contentPath: string
} & Pick<Options, 'outputPath'>

export async function build(options: BuildOptions) {
  const {image, date, contentPath, ...rest} = options
  const settings = await getImageJSONSettings(image)
  settings.templatePath = path.join(import.meta.dirname, image, settings.templatePath)
  settings.defaultProfilePath = path.join(import.meta.dirname, image, settings.defaultProfilePath)
  const dateObj = convertDateToObject(date)
  const speakers = await getSpeakerInfo(contentPath, date)
  const data = {
    ...settings,
    ...dateObj,
    speakers,
    ...rest,
  }
  return generateEventImage(data)
}

type BuildRelativeOptions = Omit<BuildOptions, 'contentPath'>

export function buildRelative(options: BuildRelativeOptions) {
  return build({
    ...options,
    contentPath: path.join(import.meta.dirname, '../../', './src/content'),
  })
}
