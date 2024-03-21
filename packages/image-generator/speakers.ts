

import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';

interface Event {
    banner: string;
    date: string;
    meetup: string;
    presentations: string[];
    title: string;
}

interface Presentation {
    date: string;
    slides: string;
    slidesSource: string;
    speaker: string;
    title: string;
}

interface Speaker {
    name: string;
    website?: string;
    githubUsername?: string;
    profileImage?: string
}

async function parseFrontMatter<T>(filePath: string): Promise<T> {
    const content = await readFile(filePath, 'utf8');
    const match = content.match(/---\s*?\n([\s\S]*?)\n---/);
    if (!match) throw new Error(`Front matter not found in ${filePath}`);
    return yaml.load(match[1]) as T;
}

async function getEventData(eventFilePath: string): Promise<Event> {
    return parseFrontMatter<Event>(eventFilePath);
}

async function getPresentationData(presentationFilePath: string): Promise<Presentation> {
    return parseFrontMatter<Presentation>(presentationFilePath);
}

async function getSpeakerData(speakerFilePath: string): Promise<Speaker> {
    return parseFrontMatter<Speaker>(speakerFilePath);
}

async function buildEventTree(directoryPath: string, eventFileName: string) {
    if (!eventFileName.endsWith('.md')) eventFileName = `${eventFileName}.md`
    const eventData = await getEventData(`${directoryPath}/events/${eventFileName}`);
    const presentations = await Promise.all(eventData.presentations.map(async (presentationFile) => {
        const presentationData = await getPresentationData(`${directoryPath}/presentations/${presentationFile}.md`);
        const speakerData = await getSpeakerData(`${directoryPath}/speakers/${presentationData.speaker}.md`);
        return { ...presentationData, speaker: speakerData };
    }));

    return { ...eventData, presentations };
}

export async function getSpeakerInfo (directoryPath: string, eventFileName: string) {
  const tree = await buildEventTree(directoryPath, eventFileName)
  return tree.presentations.map(v => v.speaker)
}
