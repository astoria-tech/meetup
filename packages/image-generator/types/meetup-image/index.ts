import { compose } from "../../src/compose.js";
import {
  SpeakersImageData,
  relativeDirectory,
  speakersImage,
} from "../../src/event-data.js";
import { speakerLayers } from "../../src/speaker-layers.js";
import { textLayer } from "../../src/text-layer.js";

export const type = speakersImage;

export default ({ date, speakers, day, month, time }: SpeakersImageData) =>
  compose({
    outputPath: relativeDirectory(`./public/meetup-images/${date}.png`),
    background: relativeDirectory(
      `./packages/image-generator/types/meetup-image/template.png`,
    ),
    layers: [
      textLayer({
        text: day,
        width: "250px",
        height: "300px",
        fontColor: "white",
        fontSize: "80px",
        top: 40,
        left: 806,
      }),
      textLayer({
        text: month,
        width: "250px",
        height: "300px",
        fontColor: "white",
        fontSize: "60px",
        top: 105,
        left: 806,
      }),
      textLayer({
        text: time,
        width: "250px",
        height: "300px",
        fontColor: "black",
        fontSize: "60px",
        top: 230,
        left: 896,
      }),
      ...speakerLayers({
        speakers,
        fontSize: 31,
        fontColor: "white",
        offsetYPct: 58,
        imageSize: 190,
        lineHeight: 29,
        xPadding: 100,
        bottomPadding: 10,
        imageBottomPadding: 10,
        gapWidthPct: 10,
      }),
    ],
  });
