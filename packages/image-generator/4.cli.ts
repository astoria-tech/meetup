#!/usr/bin/env -S npx tsx

import {Command} from 'commander'
import {build} from './3.settings.js'
import fs from 'fs/promises'
import path from 'path'

const latestDateViaEvents = async (eventsPath: string) => {
  const files = await fs.readdir(eventsPath)
  const latestFile = files.sort().pop()
  return latestFile.substring(0, 10)
}

const program = new Command()

program
  .option('-i, --images <string>', 'Image type or comma seperated list')
  .option('-d, --date <string>', 'Date string')

program.parse(process.argv)

const options = program.opts()

const rawImagesOption = options.images && typeof options.images === 'string' ? options.images : undefined
let date = options.date && typeof options.date === 'string' ? options.date : undefined

let images = rawImagesOption ? rawImagesOption.split(',').map(v => v.trim()) : []

if (images.length === 0) {
  images = await fs.readdir(path.join(import.meta.dirname, './types'))
}

if (!date) {
  date = await latestDateViaEvents(path.join(import.meta.dirname, '../../', 'src/content/events'))
}

const outDir = path.join(import.meta.dirname, '../../', 'public')

images.forEach(image => {
  if (image && date) {
    const outputPath = `${outDir}/${image}s/${date}.png`
    build({image, date, outputPath})
  } else {
    console.error('Both image and date flags are required.')
  }
})
