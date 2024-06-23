#!/usr/bin/env -S npx tsx
import {Command} from 'commander'
import fs from 'fs/promises'
import path from 'path'
import {relativeDirectory} from './event-data.js'
import * as banner from '../types/banner/index.js'
import * as meetupImage from '../types/meetup-image/index.js'

const latestDateViaEvents = async (eventsPath: string) => {
  const files = await fs.readdir(eventsPath)
  const latestFile = files.sort().pop()
  return latestFile.substring(0, 10)
}

async function cliOptions() {
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
    images = await fs.readdir(path.join(import.meta.dirname, '../types'))
  }
  if (!date) {
    date = await latestDateViaEvents(relativeDirectory('src/content/events'))
  }
  return {date, types: images}
}

const engineTypes = {
  banner,
  'meetup-image': meetupImage,
}

async function engine() {
  const {date, types} = await cliOptions()
  const cache = {}
  for (const type of types) {
    const t = engineTypes[type]
    if (!cache[t.type]) {
      cache[t.type] = await t.type(date)
    }
    await t.default(cache[t.type])
  }
}

await engine()
