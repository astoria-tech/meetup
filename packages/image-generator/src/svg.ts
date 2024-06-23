export const svg = (strings: TemplateStringsArray, ...values: any[]) => {
  let result = strings[0]
  values.forEach((value, index) => {
    if (typeof value === 'object' && value !== null) {
      const attributes = Object.entries(value)
        .map(([key, val]) => `${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}="${val}"`)
        .join(' ')
      result += attributes
    } else {
      result += value
    }
    result += strings[index + 1]
  })
  result = result.trim().replace(/^\s+|\n/gm, '') // Trim the final result
  return Buffer.from(result) // Convert the trimmed string to a Buffer
}
