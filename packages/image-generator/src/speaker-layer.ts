import { SpeakerSvgProps, speakerSvg } from "./speaker-svg.js";

type CalculateSpeakerOffsetProps = {
  height: number;
  width: number;
  total: number;
  index: number;
  xPadding: number;
  offsetYPct: number;
  gapWidthPct: number;
  imageSize: number;
};

function calculateSpeakerOffset(props: CalculateSpeakerOffsetProps) {
  const {
    index,
    height,
    width,
    xPadding,
    offsetYPct,
    gapWidthPct,
    total,
    imageSize,
  } = props;
  const speakerWidth = imageSize;
  const top = Math.floor((height * offsetYPct) / 100);
  const gapWidthPx = Math.floor((width * gapWidthPct) / 100 / (total - 1));
  const totalSpeakersWidth = speakerWidth * total + gapWidthPx * (total - 1);
  const startLeft = Math.floor((width - totalSpeakersWidth) / 2);
  const left = startLeft + ((speakerWidth + gapWidthPx) * index - xPadding);
  return { left, top };
}

export type SpeakerLayerProps = SpeakerSvgProps & CalculateSpeakerOffsetProps;

export const speakerLayer = async (props: SpeakerLayerProps) => {
  const input = await speakerSvg(props);
  const offset = calculateSpeakerOffset(props);
  return { input, ...offset };
};
