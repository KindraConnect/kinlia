// Root application component that sets up navigation and auth state
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "./src/types";
import { apiService } from "./src/services/api";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import SimpleSignupScreen from "./src/screens/SimpleSignupScreen";
import EventFeedScreen from "./src/screens/EventFeedScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen";
import OrganizerDashboardScreen from "./src/screens/OrganizerDashboardScreen";
import LoadingSpinner from "./src/components/LoadingSpinner";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Determine whether a token is present and update auth state
  const checkAuthStatus = async () => {
    try {
      const authenticated = await apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    // Show loading screen while checking authentication
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "EventFeed" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="SimpleSignup" component={SimpleSignupScreen} />
        <Stack.Screen name="EventFeed" component={EventFeedScreen} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen
          name="OrganizerDashboard"
          component={OrganizerDashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
