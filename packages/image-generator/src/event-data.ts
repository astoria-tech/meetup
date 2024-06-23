import fs from 'fs/promises'
import {readFile} from 'fs/promises'
import * as yaml from 'js-yaml'
import path from 'path'
import mime from 'mime-types'

interface Event {
  banner: string
  date: string
  meetup: string
  presentations: string[]
  title: string
}

interface Presentation {
  date: string
  slides: string
  slidesSource: string
  speaker: string
  title: string
}

interface Speaker {
  name: string
  website?: string
  githubUsername?: string
  profileImage?: string
  buffer?: Buffer
}

async function parseFrontMatter<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, 'utf8')
  const match = content.match(/---\s*?\n([\s\S]*?)\n---/)
  if (!match) throw new Error(`Front matter not found in ${filePath}`)
  return yaml.load(match[1]) as T
}

async function getEventData(eventFilePath: string): Promise<Event> {
  return parseFrontMatter<Event>(eventFilePath)
}

async function getPresentationData(presentationFilePath: string): Promise<Presentation> {
  return parseFrontMatter<Presentation>(presentationFilePath)
}

async function getSpeakerData(speakerFilePath: string): Promise<Speaker> {
  return parseFrontMatter<Speaker>(speakerFilePath)
}

export function relativeDirectory(root: string) {
  return path.join(import.meta.dirname, '../../..', root)
}

async function fetchImage(url: string, speakerName: string | string[], clearCache: boolean): Promise<Buffer> {
  const slug = [speakerName].flat().join('').toLowerCase().replace(/\s/g, '')
  const speakerImagesDir = relativeDirectory('public/speakers')
  const files = await fs.readdir(speakerImagesDir)
  const existingFile = files.find(file => file.startsWith(slug))
  if (existingFile && clearCache !== true) {
    return await fs.readFile(path.join(speakerImagesDir, existingFile))
  }
  const response = await fetch(url)
  const contentType = response.headers.get('content-type')
  const extensionFromMime = mime.extension(contentType)
  const extension = contentType ? extensionFromMime : url.split('.').pop()
  const fileName = `${slug}.${extension}`
  const location = path.join(speakerImagesDir, fileName)
  const buffer = await response.arrayBuffer()
  const nodeBuffer = Buffer.from(buffer)
  await fs.writeFile(location, nodeBuffer)
  return nodeBuffer
}

const safeUrl = (url: string) => {
  try {
    return new URL(url)
  } catch {
    return undefined
  }
}

async function resolveImage(props: Speaker & {clearCache?: boolean}): Promise<Buffer | undefined> {
  const {profileImage, githubUsername, name, clearCache} = props
  if (safeUrl(profileImage)) {
    try {
      return await fetchImage(profileImage, name, clearCache)
    } catch {}
  }
  if (githubUsername) {
    return await fetchImage(`https://github.com/${githubUsername}.png`, name, clearCache)
  }
}

export async function getEventWithSpeakers(eventFileName: string, directoryPath: string = 'src/content') {
  if (!eventFileName.endsWith('.md')) eventFileName = `${eventFileName}-event.md`
  const eventData = await getEventData(relativeDirectory(`${directoryPath}/events/${eventFileName}`))
  const presentations = await Promise.all(
    eventData.presentations.map(async presentationFile => {
      const presentationData = await getPresentationData(
        relativeDirectory(`${directoryPath}/presentations/${presentationFile}.md`),
      )
      const speakerData = await getSpeakerData(
        relativeDirectory(`${directoryPath}/speakers/${presentationData.speaker}.md`),
      )
      return {...presentationData, speaker: speakerData}
    }),
  )
  const speakers = await Promise.all(
    presentations.map(async ({speaker}) => ({...speaker, buffer: await resolveImage(speaker)})),
  )
  return {...eventData, presentations, speakers}
}

function parseDate(dateString) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const date = new Date(dateString)

  // Format the date as yyyy-mm-dd
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based, so add 1
  const day = date.getDate().toString().padStart(2, '0')

  return {
    id: `${year}-${month}-${day}`,
    month: months[date.getMonth()], // Get the month name from the array.
    day: day,
    time: date.getHours() >= 12 ? `${date.getHours() % 12 || 12}pm` : `${date.getHours()}am`, // Format hours for AM/PM.
  }
}

export type SpeakersImageData = {
  speakers: {
    image: Buffer
    name: string
  }[]
  date: string
  month: string
  day: string
  time: string
}

export async function speakersImage(date: string): Promise<SpeakersImageData> {
  const event = await getEventWithSpeakers(date)
  const speakers = event.speakers.map(({buffer, name}) => ({image: buffer, name}))
  return {
    date,
    ...parseDate(event.date),
    speakers,
  }
}
