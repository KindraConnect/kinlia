// Dashboard for organizers to manage their events
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Event } from '../types';
import { apiService } from '../services/api';

export default function OrganizerDashboardScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'OrganizerDashboard'>) {
  const [events, setEvents] = useState<(Event & { ticket_sales: number })[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Load the organizer's existing events
  const load = async () => {
    try {
      const data = await apiService.getOrganizerEvents();
      setEvents(data);
    } catch (e) {
      console.error('failed to load organizer events', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create a new event using the form values
  const create = async () => {
    if (!title || !description || !date || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await apiService.createEvent({ title, description, date, location });
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      await load();
    } catch (e) {
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Event & { ticket_sales: number } }) => (
    <View className="bg-white rounded-lg p-4 mb-2 border border-gray-200">
      <Text className="font-semibold text-gray-800">{item.title}</Text>
      <Text className="text-gray-500 text-sm">Tickets sold: {item.ticket_sales}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold mb-4">Create Event</Text>
      <View className="space-y-3 mb-6">
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity
          className={`rounded-lg py-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
          onPress={create}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? 'Creating...' : 'Create Event'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold mb-4">Your Events</Text>
      <FlatList data={events} keyExtractor={(e) => e.id} renderItem={renderItem} />
    </View>
  );
}
