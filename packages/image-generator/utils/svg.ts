export function speakerSvg(img: {
  imageSize: number
  lines: string[]
  image: string
  fontSize: number
  fontColor: string
  lineHeight: number
  xPadding?: number
  bottomPadding?: number
  imageBottomPadding?: number
}): string {
  const {imageSize, fontColor, imageBottomPadding, xPadding, lines, image, fontSize, lineHeight, bottomPadding} = {
    imageBottomPadding: 0,
    fontSize: 16,
    lineHeight: 20,
    ...img,
  }

  const x = xPadding || 0 // Adjust x position by xOffset
  const y = 0 // Top position for the image
  const svgHeight = imageSize + y * 2 + lines.length * lineHeight // Calculate SVG height based on image and text

  // Generate text elements based on lines array
  const textElements = lines
    .map(
      (line, index) =>
        `<tspan x="${imageSize / 2 + x}" y="${imageSize + y + lineHeight * (index + 1) + imageBottomPadding}">${line}</tspan>`,
    )
    .join('')

  return `
<svg width="${imageSize + x * 2}" height="${svgHeight + bottomPadding + imageBottomPadding}" xmlns="http://www.w3.org/2000/svg">
  <!-- Clip path to create a circular clip for the image -->
  <clipPath id="rounded-corners">
    <rect x="${x}" y="${y}" width="${imageSize}" height="${imageSize}" rx="${imageSize / 2}" ry="${imageSize / 2}" />
  </clipPath>

  <!-- Image insertion -->
  <image href="${image}" x="${x}" y="${y}" width="${imageSize}" height="${imageSize}" clip-path="url(#rounded-corners)" />

  <!-- Text element dynamically generated from lines array -->
  <text font-weight="bold" fill="${fontColor}" font-family="Helvetica" font-size="${fontSize}" text-anchor="middle">
    ${textElements}
  </text>
</svg>
`
}

// createSvg({
//   imageSize: 100,
//   xPadding : 100,
//   lines: ["Nicolas Prado", "Software"],
//   image,
//   fontSize: 16,
//   fontColor: 'white',
//   lineHeight: 20,
//   bottomPadding: 10,
// })
