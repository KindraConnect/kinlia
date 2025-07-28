// Displays a list of events for the signed in user
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Event } from '../types';
import { apiService } from '../services/api';

type EventFeedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventFeed'>;

interface Props {
  navigation: EventFeedScreenNavigationProp;
}

export default function EventFeedScreen({ navigation }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch the list of events from the backend
  const loadEvents = async () => {
    try {
      const eventsData = await apiService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      // For now, we'll show placeholder data since the backend might not be running
      setEvents([
        {
          id: '1',
          title: 'Sample Event 1',
          description: 'This is a sample event description',
          date: '2024-01-15',
          location: 'Sample Location',
          organizer_id: '1',
        },
        {
          id: '2',
          title: 'Sample Event 2',
          description: 'Another sample event description',
          date: '2024-01-20',
          location: 'Another Location',
          organizer_id: '1',
        },
      ]);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Log out the user and clear credentials
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await apiService.logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
      className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200"
    >
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        {item.title}
      </Text>
      <Text className="text-gray-600 mb-2">{item.description}</Text>
      <View className="flex-row justify-between">
        <Text className="text-gray-500 text-sm">{item.date}</Text>
        <Text className="text-gray-500 text-sm">{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">Events</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('OrganizerDashboard')}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Organizer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No events found</Text>
            <Text className="text-gray-400 text-center mt-2">
              Pull down to refresh or check back later
            </Text>
          </View>
        }
      />
    </View>
  );
} 