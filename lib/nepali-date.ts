// Nepali (Bikram Sambat) date conversion utility
// Based on the official Nepali calendar data

const NEPALI_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan",
  "Bhadra", "Ashwin", "Kartik", "Mangsir",
  "Poush", "Magh", "Falgun", "Chaitra"
]

const NEPALI_DAYS = [
  "Aaitabar", "Sombar", "Mangalbar", "Budhabar",
  "Bihibar", "Shukrabar", "Shanibar"
]

// Nepali calendar data: days in each month for years 2070-2090 BS
const BS_CALENDAR_DATA: Record<number, number[]> = {
  2070: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2073: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2074: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2075: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2077: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2078: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2079: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
}

// Reference date: BS 2070/01/01 = AD 2013/04/14
const BS_REF_YEAR = 2070
const BS_REF_MONTH = 0 // Baishakh (0-indexed)
const BS_REF_DAY = 1
const AD_REF = new Date(2013, 3, 14) // April 14, 2013

export function adToBS(adDate: Date): { year: number; month: number; day: number; dayOfWeek: number } {
  const dayOfWeek = adDate.getDay()

  // Calculate total days difference from reference date
  const diffTime = adDate.getTime() - AD_REF.getTime()
  let totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  let bsYear = BS_REF_YEAR
  let bsMonth = BS_REF_MONTH
  let bsDay = BS_REF_DAY

  // Add days one by one
  while (totalDays > 0) {
    const daysInMonth = BS_CALENDAR_DATA[bsYear]
    if (!daysInMonth) break

    const daysInCurrentMonth = daysInMonth[bsMonth]
    if (bsDay < daysInCurrentMonth) {
      bsDay++
      totalDays--
    } else {
      bsMonth++
      bsDay = 1
      totalDays--
      if (bsMonth >= 12) {
        bsMonth = 0
        bsYear++
      }
    }
  }

  return { year: bsYear, month: bsMonth, day: bsDay, dayOfWeek }
}

export function formatNepaliDate(adDate: Date): string {
  const bs = adToBS(adDate)
  return `${bs.day} ${NEPALI_MONTHS[bs.month]} ${bs.year}`
}

export function formatNepaliDateFull(adDate: Date): string {
  const bs = adToBS(adDate)
  return `${NEPALI_DAYS[bs.dayOfWeek]}, ${bs.day} ${NEPALI_MONTHS[bs.month]} ${bs.year} BS`
}

export { NEPALI_MONTHS, NEPALI_DAYS }
