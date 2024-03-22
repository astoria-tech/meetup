export function convertDateToObject(date: string) {
  // validate date is YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    throw new Error('Invalid date format')
  }
  // parse date
  const [_year, month, day] = date.split('-')

  // convert month to three letter month capitalised
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateMonth = months[parseInt(month) - 1].toUpperCase()

  return {
    dateDay: day,
    dateMonth,
  }
}
