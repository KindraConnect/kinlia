// Shows details for a single event
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Event } from '../types';
import { apiService } from '../services/api';

export default function EventDetailScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'EventDetail'>) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  // Load event details from the backend
  const load = async () => {
    try {
      const data = await apiService.getEvent(eventId);
      setEvent(data);
    } catch (e) {
      console.error('Failed to load event', e);
    }
  };

  // Purchase a ticket for this event
  const purchase = async () => {
    setLoading(true);
    try {
      await apiService.purchaseTicket(eventId);
      Alert.alert('Success', 'Ticket purchased!');
    } catch (e) {
      Alert.alert('Error', 'Could not purchase ticket');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold text-gray-800 mb-4">{event.title}</Text>
      <Text className="text-gray-700 mb-2">{event.description}</Text>
      <Text className="text-gray-600">{event.date}</Text>
      <Text className="text-gray-600 mb-4">{event.location}</Text>
      <TouchableOpacity
        className={`rounded-lg py-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
        disabled={loading}
        onPress={purchase}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? 'Processing...' : 'Purchase Ticket'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
