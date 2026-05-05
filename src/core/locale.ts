export function daysForLocale(localeName = 'en-GB', weekday: 'long' | 'short' | 'narrow' = 'long') {
  const { format } = new Intl.DateTimeFormat(localeName, { weekday })
  return Array.from(new Array(7).keys()).map((day) => format(new Date(Date.UTC(2021, 5, day))))
}

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export function translateDay(day: Day, locale: string): string {
  const index = daysForLocale('en-GB').indexOf(day)

  const translatedDay = daysForLocale(locale)[index]
  if (translatedDay) return translatedDay

  console.warn(`No translation found for day ${day} in locale ${locale}`)
  return day
}
