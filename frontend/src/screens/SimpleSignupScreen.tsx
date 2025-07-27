import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { apiService } from "../services/api";

type ScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "SimpleSignup"
>;
interface Props {
  navigation: ScreenNavProp;
}

export default function SimpleSignupScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await apiService.simpleSignup({
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      Alert.alert("Success", "Thank you for signing up!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to submit signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
            Sign Up
          </Text>
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">First Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Last Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Phone</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity
              className={`rounded-lg py-3 mt-6 ${loading ? "bg-gray-400" : "bg-blue-600"}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
