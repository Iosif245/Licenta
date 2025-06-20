export interface FavoriteEvent {
  id: number;
  title: string;
  association: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  status: 'upcoming' | 'past';
  attendees: number;
}
