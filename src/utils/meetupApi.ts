const MEETUP_API_BASE = "https://meetup-api.astoria.app";

export interface MeetupEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  eventUrl: string;
  going: number;
  status: "ACTIVE" | "PAST";
}

export interface MeetupApiResponse {
  count: number;
  events: MeetupEvent[];
  lastUpdated: string;
  pagination?: {
    count: number;
    limit: number;
    page: number;
    totalEvents: number;
    totalPages: number;
  };
  links?: {
    self: string;
    next?: string;
    last?: string;
  };
}

export type EventType = "mornings" | "evenings" | "hackathons";

export interface CategorizedEvent extends MeetupEvent {
  eventType: EventType;
}

/**
 * Categorize event based on title
 */
export function categorizeEvent(event: MeetupEvent): EventType {
  const title = event.title.toLowerCase();

  if (title.includes("morning tech")) {
    return "mornings";
  }

  if (title.includes("astoria tech meetup #")) {
    return "evenings";
  }

  if (title.includes("hackathon") || title.includes("hack")) {
    return "hackathons";
  }

  // Default to evenings for now
  return "evenings";
}

/**
 * Fetch all past events with pagination
 */
async function fetchAllPastEvents(): Promise<MeetupEvent[]> {
  const allPastEvents: MeetupEvent[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `${MEETUP_API_BASE}/api/past?page=${page}&limit=25`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch past events page ${page}`);
    }

    const data: MeetupApiResponse = await res.json();
    allPastEvents.push(...data.events);

    // Check if there are more pages
    if (data.pagination && data.pagination.page < data.pagination.totalPages) {
      page++;
    } else {
      hasMore = false;
    }
  }

  return allPastEvents;
}

/**
 * Fetch events from Meetup API
 */
export async function fetchMeetupEvents(): Promise<CategorizedEvent[]> {
  try {
    // Fetch upcoming events and all paginated past events
    const [upcomingRes, allPastEvents] = await Promise.all([
      fetch(`${MEETUP_API_BASE}/api/upcoming`),
      fetchAllPastEvents(),
    ]);

    if (!upcomingRes.ok) {
      throw new Error("Failed to fetch upcoming events from Meetup API");
    }

    const upcomingData: MeetupApiResponse = await upcomingRes.json();

    const allEvents = [...upcomingData.events, ...allPastEvents];

    // Add event type to each event
    const categorizedEvents: CategorizedEvent[] = allEvents.map((event) => ({
      ...event,
      eventType: categorizeEvent(event),
    }));

    // Sort by date (newest first)
    categorizedEvents.sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
    );

    return categorizedEvents;
  } catch (error) {
    console.error("Error fetching meetup events:", error);
    return [];
  }
}

/**
 * Get events by type
 */
export async function getEventsByType(
  type: EventType,
): Promise<CategorizedEvent[]> {
  const allEvents = await fetchMeetupEvents();
  return allEvents.filter((event) => event.eventType === type);
}

/**
 * Get upcoming events (across all types)
 */
export async function getUpcomingEvents(): Promise<CategorizedEvent[]> {
  const allEvents = await fetchMeetupEvents();
  return allEvents
    .filter((event) => event.status === "ACTIVE")
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
}

/**
 * Get event type display name
 */
export function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case "mornings":
      return "☀️ Morning Coffee";
    case "evenings":
      return "🌙 Monthly Meetup";
    case "hackathons":
      return "🚀 Hackathons";
  }
}

/**
 * Get event type description
 */
export function getEventTypeDescription(type: EventType): string {
  switch (type) {
    case "mornings":
      return "Weekly Thursday morning coffee chats.\nDiscuss careers, tech topics, local events, and side projects over breakfast.";
    case "evenings":
      return "Monthly technical presentations, live demos, and open discussion.\nUsually on the last or second-to-last Wednesday of each month.";
    case "hackathons":
      return "Focused 5-hour building sessions at local Astoria venues.\nBring an idea or join a team on the spot.";
  }
}
