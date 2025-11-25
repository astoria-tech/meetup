import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, breaks: true });

// Format date in compact style: "Wed 9/28/25"
export function formatCompactDate(dateTime: string): string {
  const date = new Date(dateTime);
  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "America/New_York",
  });
  const month = date.toLocaleDateString("en-US", {
    month: "numeric",
    timeZone: "America/New_York",
  });
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: "America/New_York",
  });
  const year = date.toLocaleDateString("en-US", {
    year: "2-digit",
    timeZone: "America/New_York",
  });
  return `${weekday} ${month}/${day}/${year}`;
}

// Format time: "6:30 PM"
export function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

// Generate Google Calendar link
export function getGoogleCalendarLink(event: any): string {
  const startDate = new Date(event.dateTime);
  const endDate = new Date(event.endTime);

  // Format dates for Google Calendar in Eastern Time (YYYYMMDDTHHmmss)
  const formatForGoogle = (date: Date) => {
    // Get the date/time components in Eastern Time
    const year = date.toLocaleString("en-US", {
      year: "numeric",
      timeZone: "America/New_York",
    });
    const month = date
      .toLocaleString("en-US", {
        month: "2-digit",
        timeZone: "America/New_York",
      })
      .padStart(2, "0");
    const day = date
      .toLocaleString("en-US", {
        day: "2-digit",
        timeZone: "America/New_York",
      })
      .padStart(2, "0");
    const hours = date
      .toLocaleString("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      })
      .padStart(2, "0");
    const minutes = date
      .toLocaleString("en-US", {
        minute: "2-digit",
        timeZone: "America/New_York",
      })
      .padStart(2, "0");
    const seconds = date
      .toLocaleString("en-US", {
        second: "2-digit",
        timeZone: "America/New_York",
      })
      .padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const start = formatForGoogle(startDate);
  const end = formatForGoogle(endDate);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: `${event.location.name}, ${event.location.address}, ${event.location.city}, ${event.location.state}`,
    ctz: "America/New_York",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Render markdown description
export function renderMarkdown(text: string): string {
  return md.render(text);
}

// Get preview text (first paragraph)
export function getPreviewText(text: string): string {
  const firstPara = text.split("\n\n")[0];
  return md.renderInline(firstPara);
}

// Get emoji for event type
export function getEventEmoji(eventType: string): string {
  switch (eventType) {
    case "mornings":
      return "☀️";
    case "evenings":
      return "🌙";
    case "hackathons":
      return "🚀";
    default:
      return "💡";
  }
}

// Get color scheme based on event type - warm, cohesive palette
export function getEventColors(eventType: string) {
  switch (eventType) {
    case "mornings":
      return {
        border: "border-orange-200",
        badge: "bg-gradient-to-br from-orange-200 to-orange-300",
        badgeText: "text-orange-900",
        typeLabel: "bg-orange-500 text-white",
        buttonPrimary: "bg-orange-600 hover:bg-orange-700 text-white",
        buttonSecondary:
          "bg-orange-200 hover:bg-orange-300 text-orange-900 border border-orange-300",
      };
    case "evenings":
      return {
        border: "border-slate-300",
        badge: "bg-gradient-to-br from-slate-500 to-slate-600",
        badgeText: "text-white",
        typeLabel: "bg-slate-700 text-white",
        buttonPrimary: "bg-slate-700 hover:bg-slate-800 text-white",
        buttonSecondary:
          "bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300",
      };
    case "hackathons":
      return {
        border: "border-purple-200",
        badge: "bg-gradient-to-br from-purple-50 to-pink-50",
        badgeText: "text-purple-900",
        typeLabel: "bg-purple-600 text-white",
        buttonPrimary: "bg-purple-700 hover:bg-purple-800 text-white",
        buttonSecondary:
          "bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300",
      };
    default:
      return {
        border: "border-slate-200",
        badge: "bg-gradient-to-br from-slate-50 to-gray-50",
        badgeText: "text-slate-900",
        typeLabel: "bg-slate-600 text-white",
        buttonPrimary: "bg-slate-700 hover:bg-slate-800 text-white",
        buttonSecondary:
          "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300",
      };
  }
}
