import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Swiper from "react-native-swiper";
import { Dimensions } from "react-native";
import Video from "react-native-video";

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
}

const Story = ({ name, stories }: IStoryProps) => {
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
                <Text style={styles.cardTitle}>{name}</Text>
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
    position: "absolute",
    bottom: 0,
    margin: 10,
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export { Story };
