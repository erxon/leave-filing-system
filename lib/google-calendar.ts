import { google, calendar_v3 } from "googleapis"

/**
 * Interface for the processed holiday data
 */
export interface NationalHoliday {
  name: string
  date: string
  description?: string
}

/**
 * Fetches national holidays from Google Calendar API
 * @param apiKey - Your Google Cloud API Key
 * @param year - The year to fetch holidays for
 * @returns A promise resolving to an array of holidays
 */
export async function getNationalHolidays(
  apiKey: string,
  year: number = 2026
): Promise<NationalHoliday[]> {
  const calendar = google.calendar({ version: "v3", auth: apiKey })

  // Common Public Holiday Calendar ID for the Philippines
  const calendarId = "en.philippines#holiday@group.v.calendar.google.com"

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: `${year}-01-01T00:00:00Z`,
      timeMax: `${year}-12-31T23:59:59Z`,
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = response.data.items || []

    return events.map((event: calendar_v3.Schema$Event) => ({
      name: event.summary ?? "Unnamed Holiday",
      date: event.start?.date ?? event.start?.dateTime ?? "",
      description: event.description ?? "",
    }))
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error)
    throw new Error("Failed to fetch holiday data")
  }
}
