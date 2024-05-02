import path from 'path'
import fs from 'fs/promises'
import {build as _build, type Options} from './2.fetch.js'
import {getSpeakerInfo} from './utils/speakers.js'
import {convertDateToObject} from './utils/date.js'

/**
 * @module
 * this is a layer that gets configuration
 * settigns for an image from the image settings
 * type file
 */

const getImageJSONSettings = async (image: string) => {
  const file = await fs.readFile(path.join(import.meta.dirname, `./types/${image}/index.json`), 'utf8')
  return JSON.parse(file)
}

type BuildOptions = {
  image: string
  date: string
  contentPath: string
} & Pick<Options, 'outputPath'>

async function buildAbsolute(options: BuildOptions) {
  const {image, date, contentPath, ...rest} = options
  const settings = await getImageJSONSettings(image)
  settings.templatePath = path.join(import.meta.dirname, './types', image, settings.templatePath)
  settings.defaultProfilePath = path.join(import.meta.dirname, './types', image, settings.defaultProfilePath)
  const dateObj = convertDateToObject(date)
  const speakers = await getSpeakerInfo(contentPath, date)
  const data = {
    ...settings,
    ...dateObj,
    speakers,
    ...rest,
  }
  return _build(data)
}

type BuildRelativeOptions = Omit<BuildOptions, 'contentPath'>

export function build(options: BuildRelativeOptions) {
  return buildAbsolute({
    ...options,
    contentPath: path.join(import.meta.dirname, '../../', './src/content'),
  })
}
