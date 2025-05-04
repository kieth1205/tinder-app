import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import Swiper from "react-native-swiper";
import { Dimensions } from "react-native";
import Video from "react-native-video";
import { EDUCATION, GENDER, INTEREST, MappingEducation, MappingGender, MappingInterest, MappingZodiacSign, UserSuggestion, ZODIAC_SIGN } from "@/types";
import { Ionicons } from "@expo/vector-icons";

const deviceWidth = Dimensions.get("window").width;

export interface IStory {
  id: string;
  uri: any;
  title: string;
  type: "image" | "video";
}

interface IStoryProps {
  name: string;
  stories: IStory[];
  user?: UserSuggestion;
}

const Story = ({ name, stories, user }: IStoryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = (deviceWidth - 8 * stories.length) / stories.length;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        index={currentIndex}
        style={styles.wrapper}
        loop={false}
        onIndexChanged={(index) => setCurrentIndex(index)}
        paginationStyle={styles.paginationStyle}
        dot={
          <View
            style={{
              backgroundColor: "rgba(255,255,255,.3)",
              width: width,
              height: 3,
              borderRadius: 7,
              marginLeft: 4,
              marginRight: 4,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: "#fff",
              width: width,
              height: 3,
              borderRadius: 7,
              marginLeft: 4,
              marginRight: 4,
            }}
          />
        }
      >
        {stories.map((story) => (
          <View key={story.id} style={styles.slide}>
            {story.type === "video" ? (
              <Video
                source={{ uri: story.uri }}
                style={styles.cardImage}
                resizeMode="cover"
                repeat
                paused={false}
              />
            ) : (
              // Completely restructured approach for images
              <View style={styles.slideContent}>
                {/* Image as a background */}
                <Image 
                  source={{ uri: story.uri }}
                  style={styles.cardImage}
                />
                
                {/* Gradient overlay for better text visibility */}
                <View style={styles.gradientOverlay} />
                
                {/* User information container */}
                <View style={styles.infoContainer}>
                  <Text style={styles.cardTitle}>
                    {name}{user?.gender ? ` • ${MappingGender[user.gender as GENDER]}` : ""}
                  </Text>
                  
                  {user?.additionalInfo && (
                    <View style={styles.infoDetails}>
                      {user.additionalInfo.education && (
                        <View style={styles.infoItem}>
                          <Ionicons name="school-outline" size={16} color="#fff" />
                          <Text style={styles.infoText}>
                            {MappingEducation[user.additionalInfo.education as EDUCATION]}
                          </Text>
                        </View>
                      )}
                      
                      {user.additionalInfo.zodiac && (
                        <View style={styles.infoItem}>
                          <Ionicons name="star-outline" size={16} color="#fff" />
                          <Text style={styles.infoText}>
                            {MappingZodiacSign[user.additionalInfo.zodiac as ZODIAC_SIGN]}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  {user?.interests && user.interests.length > 0 && (
                    <View style={styles.interestContainer}>
                      {user.interests.slice(0, 3).map((interest, index) => (
                        <View key={index} style={styles.interestTag}>
                          <Text style={styles.interestText}>
                            {MappingInterest[interest as INTEREST]}
                          </Text>
                        </View>
                      ))}
                      {user.interests.length > 3 && (
                        <View style={styles.interestTag}>
                          <Text style={styles.interestText}>+{user.interests.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={handlePrev}
        disabled={currentIndex === 0}
      >
        <View style={styles.buttonArea} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rightButton}
        onPress={handleNext}
        disabled={currentIndex === stories.length - 1}
      >
        <View style={styles.buttonArea} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  wrapper: {
    backgroundColor: "#000",
    height: 300,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  slideContent: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    ...Platform.select({
      android: {
        backgroundColor: "rgba(0,0,0,0.5)",
      }
    })
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === "android" ? 20 : 16,
    zIndex: 10, // Ensure this is on top of other elements
  },
  cardTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoDetails: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  interestTag: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  paginationStyle: {
    position: "absolute",
    top: -450,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftButton: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "50%",
    zIndex: 1,
  },
  rightButton: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "50%",
    zIndex: 1,
  },
  buttonArea: {
    flex: 1,
  },
});

export { Story };