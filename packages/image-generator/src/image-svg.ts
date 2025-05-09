import { svg } from "./svg.js";

export type ImageSvgProps = {
  imageSize: number;
  lines: string[];
  image: string;
  fontSize: number;
  fontColor: string;
  lineHeight: number;
  xPadding?: number;
  bottomPadding?: number;
  imageBottomPadding?: number;
};

/** svg with rounded image and text under it */
export async function imageSvg(props: ImageSvgProps) {
  const {
    imageSize,
    fontColor,
    imageBottomPadding,
    xPadding: x,
    image,
    lines,
    fontSize,
    lineHeight,
    bottomPadding,
  } = {
    imageBottomPadding: 0,
    fontSize: 16,
    lineHeight: 20,
    xPadding: 0,
    ...props,
  };
  const y = 0; // Top position for the image
  const svgHeight = imageSize + y * 2 + lines.length * lineHeight; // Calculate SVG height based on image and text

  // Generate text elements based on lines array
  const textElements = lines
    .map(
      (line, index) =>
        `<tspan x="${imageSize / 2 + x}" y="${imageSize + y + lineHeight * (index + 1) + imageBottomPadding}">${line}</tspan>`,
    )
    .join("");

  return svg`
  <svg width="${imageSize + x * 2}" height="${svgHeight + bottomPadding + imageBottomPadding}" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="rounded-corners">
      <rect x="${x}" y="${y}" width="${imageSize}" height="${imageSize}" rx="${imageSize / 2}" ry="${imageSize / 2}" />
    </clipPath>
    <image href="${image}" x="${x}" y="${y}" width="${imageSize}" height="${imageSize}" clip-path="url(#rounded-corners)" />
    <text font-weight="bold" fill="${fontColor}" font-family="Helvetica" font-size="${fontSize}" text-anchor="middle">
      ${textElements}
    </text>
  </svg>`;
}
