import sharp from 'sharp';
import fs from 'fs';

export interface Speaker {
  profileImage?: string;
  buffer?: Buffer
  name: string;
}

// Reads and verifies the template file exists, then returns its buffer
function readTemplateFile(templatePath: string): Buffer {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file does not exist at path: ${templatePath}`);
  }
  return fs.readFileSync(templatePath);
}

// Generates SVG for speaker names
function generateSpeakerNameSvg(name: string, width: number, yOffset: number, fontSize: string): string {
  const fontColor = 'white';
  const nameParts = name.split(' '); // Split the name into parts based on spaces
  const lineHeight = parseInt(fontSize) + 5; // Adjust the line height based on the font size

  // Generate the SVG for each name part on a new line
  const nameSvg = nameParts.map((part, index) => {
    const y = yOffset + (lineHeight * index); // Calculate the y position for each line
    return `<text x="50%" y="${y}" alignment-baseline="middle" text-anchor="middle" font-size="${fontSize}" font-family="Helvetica" fill="${fontColor}" font-weight="bold">${part}</text>`;
  }).join('');

  return `<svg width="${width}" height="${lineHeight * nameParts.length + 10}">${nameSvg}</svg>`;
}

// Resizes and masks speaker images into circles
async function processSpeakerImage(defaultSpeakerImageBuffer: Buffer, speaker: Speaker, width: number, yOffset: number, gapWidth: number, startLeft: number, index: number): Promise<sharp.OverlayOptions> {
  let speakerImageBuffer: Buffer;
  if (speaker.buffer) {
    speakerImageBuffer = speaker.buffer;
  } else if (speaker.profileImage) {
    if (!fs.existsSync(speaker.profileImage)) {
      throw new Error(`Speaker image file does not exist at path: ${speaker.profileImage}`);
    }
    speakerImageBuffer = fs.readFileSync(speaker.profileImage);
  } else {
    speakerImageBuffer = defaultSpeakerImageBuffer
  }

  const resizedImage = sharp(speakerImageBuffer)
    .resize({
      width: width,
      height: width,
    })
    .toFormat('png');

  const circleSvg = `<svg width="${width}" height="${width}"><circle cx="${width / 2}" cy="${width / 2}" r="${width / 2}" fill="white"/></svg>`;
  const circleBuffer = Buffer.from(circleSvg);

  const left = startLeft + (width * index) + (gapWidth * index)

  return {
    input: await resizedImage.composite([{ input: circleBuffer, blend: 'dest-in' }]).toBuffer(),
    top: yOffset,
    left: left,
  };
}

// Creates the date SVG
function createDateSvg(date: string, width: string, height: string, fontColor: string, fontSize: string): Buffer {
  const dateSvg = `<svg width="${width}" height="${height}"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="${fontSize}" font-family="Helvetica" fill="${fontColor}" font-weight="bold">${date}</text></svg>`;
  return Buffer.from(dateSvg);
}

export type Options = {
  templatePath: string,
  defaultProfilePath: string,
  speakers: Speaker[],
  outputPath?: string,
  speakerImageYPctOffset: number,
  speakerImagePctGapWidth: number,
  speakerImagePctMaxWidth: number,
  dateDay: string,
  dateMonth: string,
  dateDayTop: number,
  dateDayLeft: number,
  dateMonthTop: number,
  dateMonthLeft: number,
  timeTop: number,
  timeLeft: number,
}

export async function generateEventImage(options: Options) {
  const {
    templatePath,
    defaultProfilePath,
    speakers,
    outputPath,
    speakerImageYPctOffset,
    speakerImagePctGapWidth,
    speakerImagePctMaxWidth,
    dateDay,
    dateMonth,
    dateDayTop,
    dateDayLeft,
    dateMonthTop,
    dateMonthLeft,
    timeTop,
    timeLeft,
  } = options;
  try {
    const templateBuffer = readTemplateFile(templatePath);
    let template = sharp(templateBuffer);
    const { width: templateWidth, height: templateHeight } = await template.metadata();

    if (!templateWidth || !templateHeight) {
      throw new Error('Template image dimensions are undefined');
    }

    const speakerImageYOffset = Math.floor(templateHeight * speakerImageYPctOffset / 100);
    const speakerImageGapWidth = Math.floor((templateWidth * speakerImagePctGapWidth / 100) / (speakers.length + 1)) 
    const speakerImageMaxWidth = Math.floor(templateWidth * speakerImagePctMaxWidth / 100);

    const availableWidth = templateWidth - speakerImageGapWidth * (speakers.length + 1);
    const initalSpeakerWidth = Math.floor(availableWidth / speakers.length);
    const speakerWidth = Math.min(initalSpeakerWidth, speakerImageMaxWidth);

    // Calculate the total width of all speakers and gaps
    const totalSpeakersWidth = speakerWidth * speakers.length + speakerImageGapWidth * (speakers.length - 1);
    // Calculate the starting left position to center the block
    const startLeft = Math.floor((templateWidth - totalSpeakersWidth) / 2)
    
    const defaultSpeakerImageBuffer = fs.readFileSync(defaultProfilePath);

    const speakerImages = await Promise.all(speakers.map((speaker, index) =>
      processSpeakerImage(defaultSpeakerImageBuffer, speaker, speakerWidth, speakerImageYOffset, speakerImageGapWidth,  startLeft, index)));

    const nameOverlays = speakers.map((speaker, index) => ({
      input: Buffer.from(generateSpeakerNameSvg(speaker.name, speakerWidth, 25, `30px`)),
      top: speakerImageYOffset + speakerWidth + 5,
      left: startLeft + (index * (speakerWidth + speakerImageGapWidth)),
    }));

    const dateOverlay = {
      input: createDateSvg(dateDay, "250px", "300px", 'white', '80px'),
      top: dateDayTop,
      left: dateDayLeft,
    };

    const dateMonthOverlay = {
      input: createDateSvg(dateMonth, "250px", "300px", 'white', '60px'),
      top: dateMonthTop,
      left: dateMonthLeft,
    };

    const time = {
      input: createDateSvg('7pm', "250px", "300px", 'black', '60px'),
      top: timeTop,
      left: timeLeft,
    };

    if (outputPath) {
      await template.composite([...speakerImages, ...nameOverlays, dateOverlay, dateMonthOverlay, time]).toFile(outputPath);
    } else {
      const imageBuffer = await template.composite([...speakerImages, ...nameOverlays, dateOverlay, dateMonthOverlay, time]).toBuffer();
      process.stdout.write(imageBuffer);
    }

  } catch (error) {
    console.error('Error generating event image:', error.message);
  }
}
