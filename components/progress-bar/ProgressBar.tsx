import React from "react";
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from "react-native";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar = ({ step, totalSteps, style }: ProgressBarProps) => {
  const progress = React.useMemo(() => {
    return (step / totalSteps) * 100;
  }, [step, totalSteps]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  track: {
    height: 4,
    backgroundColor: "#E8E6EA",
    borderRadius: 2,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#FE3C72", // Tinder primary color
    borderRadius: 2,
  },
});
