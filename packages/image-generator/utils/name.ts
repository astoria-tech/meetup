/**
 * this exists to create the most optimal name
 * break for the image, because when the name is
 * too long, it will break everything
 */
export const optimalName = (name: string) => {
  const names = name.split(' ')
  const partA = [names.shift()]
  const partB = [names.pop()]
  names.forEach((n, i) => {
    const aLength = partA.join('').length
    const bLength = partB.join('').length
    if (aLength > bLength) {
      partB.unshift(n)
    } else {
      partA.push(n)
    }
  })
  return [partA.join(' '), partB.join(' ')]
}

// console.log(optimalName('Nicolas Christoher Prado'))
// console.log(optimalName('Ash Ryan Arwine'))
// console.log(optimalName('John C Reilly'))
// console.log(optimalName('Michael B Jordan'))
// console.log(optimalName('Zendaya Maree Stoermer Coleman'))
// console.log(optimalName('Julia Mimi Bella Nehdar'))
// console.log(optimalName('Christopher Robert Evans'))
// console.log(optimalName('Robert John Downey Jr'))
// console.log(optimalName('Abe B C Dolphin'))
