// Wrapper around the backend API with token handling helpers
import * as SecureStore from "expo-secure-store";
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  Event,
  SimpleSignupData,
} from "../types";

const API_BASE_URL = "http://localhost:8000";

class ApiService {
  private async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync("jwt_token");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync("jwt_token", token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync("jwt_token");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await this.removeToken();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Log in with email and password
    const response = await this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    await this.setToken(response.access_token);
    return response;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Create a new user account
    const response = await this.makeRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    await this.setToken(response.access_token);
    return response;
  }

  async logout(): Promise<void> {
    // Remove the saved token
    await this.removeToken();
  }

  async getEvents(): Promise<Event[]> {
    // Retrieve all events
    return this.makeRequest<Event[]>("/events");
  }

  async getEvent(id: string): Promise<Event> {
    // Retrieve a single event
    return this.makeRequest<Event>(`/events/${id}`);
  }

  async createEvent(event: Partial<Event>): Promise<Event> {
    // Create an event as the organizer
    return this.makeRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(event),
    });
  }

  async getOrganizerEvents(): Promise<(Event & { ticket_sales: number })[]> {
    // Get events for the current organizer including ticket sales
    return this.makeRequest<(Event & { ticket_sales: number })[]>(
      "/organizer/events",
    );
  }

  async getEventTickets(eventId: string) {
    // List ticket information for an event
    return this.makeRequest("/organizer/events/" + eventId + "/tickets");
  }

  async purchaseTicket(eventId: string) {
    // Buy a ticket for the given event
    return this.makeRequest(`/events/${eventId}/tickets`, { method: "POST" });
  }

  async simpleSignup(data: SimpleSignupData): Promise<void> {
    // Send a minimal signup request
    await this.makeRequest("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async isAuthenticated(): Promise<boolean> {
    // Check whether a JWT token is stored
    const token = await this.getToken();
    return !!token;
  }
}

export const apiService = new ApiService();
