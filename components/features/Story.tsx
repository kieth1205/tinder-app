import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image
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
        onIndexChanged={(index) => setCurrentIndex(index)} // Cập nhật index khi story thay đổi
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
              <ImageBackground style={styles.cardImage} source={{ uri: story.uri }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.cardTitle}>{name}{user?.gender ? ` • ${MappingGender[user.gender as GENDER]}` : ""}</Text>
                  {user?.additionalInfo && (
                    <View style={styles.infoDetails}>
                      {user.additionalInfo.education && (
                        <View style={styles.infoItem}>
                          <Ionicons name="school-outline" size={16} color="#fff" />
                          <Text style={styles.infoText}>{MappingEducation[user.additionalInfo.education as EDUCATION]}</Text>
                        </View>
                      )}
                      {user.additionalInfo.zodiac && (
                        <View style={styles.infoItem}>
                          <Ionicons name="star-outline" size={16} color="#fff" />
                          <Text style={styles.infoText}>{MappingZodiacSign[user.additionalInfo.zodiac as ZODIAC_SIGN]}</Text>
                        </View>
                      )}
                      {user.interests && user.interests.length > 0 && (
                        <View style={styles.interestContainer}>
                          {user.interests.slice(0, 3).map((interest, index) => (
                            <View key={index} style={styles.interestTag}>
                              <Text style={styles.interestText}>{MappingInterest[interest as INTEREST]}</Text>
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
                  )}
                </View>
              </ImageBackground>
            )}
          </View>
        ))}
      </Swiper>

      {/* Nút bên trái để chuyển đến story trước đó */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={handlePrev}
        disabled={currentIndex === 0} // Vô hiệu hóa nút nếu ở story đầu tiên
      >
        <View style={styles.buttonArea} />
      </TouchableOpacity>

      {/* Nút bên phải để chuyển đến story tiếp theo */}
      <TouchableOpacity
        style={styles.rightButton}
        onPress={handleNext}
        disabled={currentIndex === stories.length - 1} // Vô hiệu hóa nút nếu ở story cuối cùng
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
    backgroundColor: "#fff",
    height: 300,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    position: "absolute",
    top: 30,
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
    width: "50%", // Chiếm nửa bên trái màn hình
    zIndex: 1,
    opacity: 0.5, // Làm mờ nút khi bị vô hiệu hóa
  },
  rightButton: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "50%", // Chiếm nửa bên phải màn hình
    zIndex: 1,
    opacity: 0.5, // Làm mờ nút khi bị vô hiệu hóa,
  },
  buttonArea: {
    flex: 1,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoDetails: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  interestTag: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  interestText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export { Story };
