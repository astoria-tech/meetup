import { Layer } from "./compose.js";
import { speakerLayer, SpeakerLayerProps } from "./speaker-layer.js";

export interface Speaker {
  image: string | Buffer;
  name: string | string[];
}

type Core = Omit<
  SpeakerLayerProps,
  "total" | "height" | "width" | "index" | "lines" | "image"
>;

export type SpeakerLayersProps = { speakers: Speaker[] } & Core;

export const speakerLayers = ({
  speakers,
  ...core
}: SpeakerLayersProps): Layer[] =>
  speakers.map(
    (speaker, index, total) =>
      ({ height, width }) =>
        speakerLayer({
          total: total.length,
          height,
          width,
          index,
          lines: speaker.name,
          image: speaker.image,
          ...core,
        }),
  );
