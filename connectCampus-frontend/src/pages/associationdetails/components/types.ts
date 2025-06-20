export interface Association {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  category: string;
  description: string;
  foundedYear: number;
  location: string;
  website: string;
  email: string;
  members: number;
  events: number;
  rating: number;
  followers: number;
  leadership: Leader[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  gallery: string[];
  announcements: Announcement[];
}

export interface Leader {
  name: string;
  role: string;
  avatar: string;
  year: string;
  major: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  attendees: number;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface SimilarAssociation {
  id: string;
  name: string;
  logo: string;
  category: string;
  members: number;
}
