import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { User } from '@/services/userService';
import { interests as interestOptions } from '@/app/(auth)/register/InterestStep';
import { INTEREST } from '@/types';

const MAX_INTERESTS = 5;

interface InterestsSectionProps {
  user: User;
  editMode: boolean;
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
}

export default function InterestsSection({
  user,
  editMode,
  selectedInterests,
  setSelectedInterests,
}: InterestsSectionProps) {
  const toggleInterest = (interest: string): void => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= MAX_INTERESTS) {
        Alert.alert('Đã đạt giới hạn', 'Bạn chỉ có thể chọn tối đa 5 sở thích');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sở thích</Text>
      
      {editMode ? (
        <View style={styles.interestsEditContainer}>
            {interestOptions.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest.id) && styles.interestButtonSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text
                  style={[
                    styles.interestButtonText,
                    selectedInterests.includes(interest.id) && styles.interestButtonTextSelected,
                  ]}
                >
                  {interest.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      ) : (
        <View style={styles.interestTagsContainer}>
          {user?.interests && user.interests.length > 0 ? (
            <View style={styles.interestTags}>
              {user.interests.map((interest, index) => (
                <View key={`interest-${index}`} style={styles.interestTag}>
                  <Text style={styles.interestText}>
                    {interestOptions.find((i: { id: INTEREST; name: string }) => i.id === interest)?.name || interest}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noContentText}>Chưa có sở thích</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  interestsEditContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  interestButtonSelected: {
    backgroundColor: '#FF4C6D',
    borderColor: '#FF4C6D',
  },
  interestButtonText: {
    color: '#666',
  },
  interestButtonTextSelected: {
    color: 'white',
  },
  interestTagsContainer: {
    marginTop: 5,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  noContentText: {
    color: '#888',
    fontStyle: 'italic',
  },
});
