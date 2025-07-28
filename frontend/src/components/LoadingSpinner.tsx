// Simple centered loading indicator with optional message
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
}

// Render a full-screen spinner with optional message
export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-600 mt-4 text-lg">{message}</Text>
    </View>
  );
} 