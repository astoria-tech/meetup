import deepmerge from 'deepmerge'
import * as deepCleaner from 'deep-cleaner'
import fs from 'fs/promises'
import {createWriteStream} from 'fs'
import {parse, stringify} from 'yaml'
import {typeFlag} from 'type-flag'
import {load} from 'cheerio'

import {pipeline} from 'stream'
import {promisify} from 'util'
import path from 'path'
const streamPipeline = promisify(pipeline)

export const validateDate = date => {
  return /^\d{4}-\d{2}-\d{2}(-.*)?$/.test(date)
}

const isValidPresentation = (date, presentation) => {
  return validateDate(presentation) && presentation.startsWith(date)
}

export const parseMdLink = mdLink => {
  const value = mdLink.trim().match(/^\!?\[.+\]\((.+)\)$/)
  return value ? value[1] : undefined
}

export function parseHtmlTag(html) {
  try {
    const $ = load(html)
    const link = $('img').attr('src') || $('a').attr('href')
    return link || undefined // Return undefined if src attribute is not found
  } catch (error) {
    console.error('Error parsing HTML:', error)
    return undefined
  }
}

export function parseLink(content) {
  try {
    new URL(content)
    return content
  } catch (_e) {
    const value = parseMdLink(content) || parseHtmlTag(content) || undefined
    if (value) {
      new URL(value)
      return value
    }
    throw new Error('Invalid link format.')
  }
}

function deepSortObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.sort()
  }

  const sortedKeys = Object.keys(obj).sort()
  const sortedObj = {}

  for (const key of sortedKeys) {
    sortedObj[key] = deepSortObject(obj[key])
  }

  return sortedObj
}

export async function readContent(fileName) {
  try {
    const file = await fs.readFile(fileName, 'utf8')

    const lines = file.split('\n')
    let frontMatter = ''
    let content = ''
    let isFrontMatter = false

    for (const line of lines) {
      if (line.trim() === '---') {
        isFrontMatter = !isFrontMatter
        continue
      }

      if (isFrontMatter) {
        frontMatter += line + '\n'
      } else {
        content += line + '\n'
      }
    }

    content = content.trim()

    let frontMatterData = parse(frontMatter)

    return {frontMatter: frontMatterData, content}
  } catch (_e) {
    return {frontMatter: {}, content: ''}
  }
}

function fileContent(data, content = '') {
  const sorted = deepSortObject(data)
  const yaml = stringify(sorted, {singleQuote: true, lineWidth: 0}).trim()
  return [`---`, `${yaml}`, `---`, content].join('\n')
}

export async function writeContent(fileName, data, content = '') {
  await fs.writeFile(fileName, fileContent(data, content))
}

const flags = () => {
  const {flags} = typeFlag({
    banner: String,
    date: String,
    githubUsername: String,
    googleCal: String,
    ical: String,
    linkedin: String,
    meetup: String,
    name: String,
    presentations: [String],
    profileImage: String,
    slides: String,
    slidesSource: String,
    presentationTitle: String,
    eventTitle: String,
    website: String,
  })

  class Require {
    static get banner() {
      return flags.banner || `/banners/${Require.date}.png`
    }
    static get date() {
      if (!flags.date) {
        throw new Error('Date is required.')
      }
      if (!validateDate(flags.date)) {
        throw new Error('Invalid date format. Date must be in yyyy-mm-dd format.')
      }
      return flags.date
    }
    static get githubUsername() {
      if (!flags.githubUsername) {
        throw new Error('GitHub username is required.')
      }
      return flags.githubUsername && flags.githubUsername.replace('@', '')
    }
    static get googleCal() {
      try {
        return parseLink(flags.googleCal)
      } catch (_e) {
        throw new Error('Invalid googleCal URL.')
      }
    }
    static get ical() {
      try {
        return parseLink(flags.ical)
      } catch (_e) {
        throw new Error('Invalid ical URL.')
      }
    }
    static get linkedin() {
      try {
        return parseLink(flags.linkedin)
      } catch (_e) {
        throw new Error('Invalid LinkedIn URL.')
      }
    }
    static get meetup() {
      try {
        return parseLink(flags.meetup)
      } catch (_e) {
        throw new Error('Invalid meetup URL.')
      }
    }
    static get name() {
      if (!flags.name) {
        throw new Error('Name is required.')
      }
      return flags.name
    }
    static get nameSlug() {
      return Require.name
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
    }
    static get presentations() {
      flags.presentations = flags.presentations.filter(v => v)

      if (!flags.presentations.length) {
        return [`${Require.date}-${Require.nameSlug}`]
      }
      if (!flags.presentations.every(presi => isValidPresentation(flags.date, presi))) {
        throw new Error('Invalid presentation file format format. Date must be in yyyy-mm-dd format.')
      }
      return flags.presentations
    }
    static get profileImage() {
      try {
        return parseLink(flags.profileImage)
      } catch (_e) {
        throw new Error('Invalid profileImage URL.')
      }
    }
    static get slides() {
      try {
        const link = parseLink(flags.slides)
        const ext = path.extname(new URL(link).pathname)
        if (!['.pdf'].includes(ext)) {
          if (!flags.slidesSource) {
            // here we have a valid link, but
            // it's not a pdf, so if there's no
            // source then assume its source
            flags.slidesSource = flags.slides
          }
          throw new Error('Invalid slides format. Slides must be in PDF')
        }
        return link
      } catch (_e) {
        throw new Error('Slides is required.')
      }
    }
    static get slidesSource() {
      try {
        return parseLink(flags.slidesSource)
      } catch (_e) {
        throw new Error('slidesSource is required.')
      }
    }
    static get speaker() {
      if (!flags.speaker) {
        throw new Error('Speaker is required.')
      }
      return flags.speaker
    }
    static get presentationTitle() {
      if (!flags.presentationTitle) {
        throw new Error('presentationTitle is required.')
      }
      return flags.presentationTitle
    }
    static get eventTitle() {
      if (!flags.eventTitle) {
        throw new Error('eventTitle is required.')
      }
      return flags.eventTitle
    }
    static get website() {
      try {
        return parseLink(flags.website)
      } catch (_e) {
        throw new Error('Invalid website.')
      }
    }
  }

  const swallowError = handle => {
    try {
      return handle()
    } catch (_e) {
      // console.log(`invalid value swallowError and resolving undefined: ${_e.message}`)
      return undefined
    }
  }

  class Sanitize {
    static get banner() {
      return swallowError(() => Require.banner)
    }
    static get date() {
      return swallowError(() => Require.date)
    }
    static get githubUsername() {
      return swallowError(() => Require.githubUsername)
    }
    static get googleCal() {
      return swallowError(() => Require.googleCal)
    }
    static get ical() {
      return swallowError(() => Require.ical)
    }
    static get linkedin() {
      return swallowError(() => Require.linkedin)
    }
    static get meetup() {
      return swallowError(() => Require.meetup)
    }
    static get name() {
      return swallowError(() => Require.name)
    }
    static get nameSlug() {
      return swallowError(() => Require.nameSlug)
    }
    static get presentations() {
      try {
        return Require.presentations
      } catch (e) {
        return flags.presentations.filter(presi => isValidPresentation(flags.date, presi))
      }
    }
    static get profileImage() {
      return swallowError(() => Require.profileImage)
    }
    static get slides() {
      return swallowError(() => Require.slides)
    }
    static get slidesSource() {
      return swallowError(() => Require.slidesSource)
    }
    static get speaker() {
      return swallowError(() => Require.speaker)
    }
    static get presentationTitle() {
      return swallowError(() => Require.presentationTitle)
    }
    static get eventTitle() {
      return swallowError(() => Require.eventTitle)
    }
    static get website() {
      return swallowError(() => Require.website)
    }
  }

  return {flags, required: Require, sanitized: Sanitize}
}

async function updateFile(fileName, input) {
  const {frontMatter, content} = await readContent(fileName)
  const merge = deepmerge(frontMatter, deepCleaner.clean(input))
  await writeContent(fileName, merge, content)
}

async function mkspeaker() {
  const {required, sanitized} = flags()
  const {name, nameSlug} = required
  const {githubUsername, linkedin, profileImage, website} = sanitized
  const fileName = `./src/content/speakers/${nameSlug}.md`
  const input = {name, githubUsername, linkedin, profileImage, website}
  await updateFile(fileName, input)
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  await streamPipeline(response.body, createWriteStream(outputPath))
}

async function nextEventTitle() {
  const files = await fs.readdir('./src/content/events')
  const latest = files
    .filter(file => file.endsWith('.md'))
    .sort()
    .reverse()[0]
  const {frontMatter} = await readContent(`./src/content/events/${latest}`)
  const no = parseInt(frontMatter.title.replace('Astoria Tech Meetup #', '').trim())
  return `Astoria Tech Meetup #${no + 1}`
}

export async function mkpresentation() {
  const {required, sanitized} = flags()
  const {date, nameSlug} = required
  const {slides, slidesSource, presentationTitle: title} = sanitized
  const fileName = `./src/content/presentations/${date}-${nameSlug}.md`
  const input = {date, slides, slidesSource, speaker: nameSlug, title}
  const localSlides = `/presentations/${date}-${nameSlug}.pdf`

  try {
    await downloadFile(slides, `./public${localSlides}`)
  } catch (_e) {
    console.log(_e.message)
  }

  await updateFile(fileName, {...input, slides: localSlides})
}

export async function mkevent() {
  const {required, sanitized} = flags()
  const {date} = required
  const {eventTitle: title, meetup, presentations, ical, googleCal, banner} = sanitized
  const fileName = `./src/content/events/${date}-event.md`
  const input = {title, meetup, presentations, banner, date, ical, googleCal}
  const {frontMatter: fm, content} = await readContent(fileName)
  const defaultTitle = await nextEventTitle()
  const frontMatter = {title: defaultTitle, presentations: [], ...fm}

  const p = [...new Set([...frontMatter.presentations, ...presentations])]
  delete frontMatter.presentations
  const merge = deepmerge(frontMatter, deepCleaner.clean({...input, presentations: p}))
  await writeContent(fileName, merge, content)
}

export async function mkall() {
  const {flags} = typeFlag({
    updateSpeaker: Boolean,
    updatePresentation: Boolean,
    updateEvent: Boolean,
    updateAll: Boolean,
  })

  if (flags.updateAll || flags.updateSpeaker) {
    try {
      await mkspeaker()
    } catch (e) {
      console.log(e)
    }
  }

  if (flags.updateAll || flags.updatePresentation) {
    try {
      await mkpresentation()
    } catch (e) {
      console.log(e)
    }
  }

  if (flags.updateAll || flags.updateEvent) {
    try {
      await mkevent()
    } catch (e) {
      console.log(e)
    }
  }
}
