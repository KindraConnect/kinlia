export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer_id: string;
}

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  EventFeed: undefined;
  EventDetail: { eventId: string };
  OrganizerDashboard: undefined;
};