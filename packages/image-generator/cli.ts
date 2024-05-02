import {Command} from 'commander'
import {buildRelative} from './index'

const program = new Command()

program
  .option('-i, --images <string>', 'Image type or comma seperated list')
  .option('-d, --date <string>', 'Date string')
  .option('-o, --outDir <string>', 'Dir for saving string')

program.parse(process.argv)

const options = program.opts()

let images = options.images && typeof options.images === 'string' ? options.images : null
const date = options.date && typeof options.date === 'string' ? options.date : null
const outDir = options.outDir && typeof options.outDir === 'string' ? options.outDir : null

const i = images.split(',').map(v => v.trim())

if (i.length === 0) {
  throw new Error('No images provided')
}

if (!date) {
  throw new Error('No date provided')
}

if (!outDir) {
  throw new Error('No outputDir provided')
}

i.forEach(image => {
  if (image && date) {
    const outputPath = `${outDir}/${image}s/${date}.png`
    buildRelative({image, date, outputPath})
  } else {
    console.error('Both image and date flags are required.')
  }
})
