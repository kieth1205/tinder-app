import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { User } from '@/services/userService';

interface PhotosSectionProps {
  user: User;
  editMode: boolean;
  images: string[];
  removePhoto: (index: number) => void;
  pickImage: () => void;
}

export default function PhotosSection({
  user,
  editMode,
  images,
  removePhoto,
  pickImage
}: PhotosSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ảnh hồ sơ</Text>
      {editMode ? (
        <View style={styles.photosContainer}>
          {images.map((image, index) => (
            <View key={`existing-${index}`} style={styles.photoContainer}>
              <Image source={{ uri: image }} style={styles.photo} />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF4C6D" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 6 && (
            <View style={styles.photoPickerContainer}>
              <TouchableOpacity onPress={pickImage}>
                <MaterialIcons name="add-photo-alternate" size={40} color="#ccc" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.photosContainer}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Image 
                key={`image-${index}`}
                source={{ uri: image }} 
                style={styles.photo} 
              />
            ))
          ) : (
            <Text style={styles.noContentText}>Chưa có ảnh hồ sơ</Text>
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
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10
  },
  photoContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  photoPickerContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  noContentText: {
    color: '#888',
    fontStyle: 'italic',
  }
});
