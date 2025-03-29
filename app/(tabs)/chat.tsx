import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export const DARK_GRAY = "#363636";

import { Text, View } from "@/components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.containerMessages}>
      <View style={styles.top}>
        <Text style={styles.title}>Messages</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  containerMessages: {
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 10,
  },
  top: {
    paddingTop: 50,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { paddingBottom: 10, fontSize: 22, color: DARK_GRAY },
});
