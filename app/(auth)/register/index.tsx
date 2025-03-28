import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterIndex() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginTop: Platform.OS === "ios" ? 40 : 20,
          marginBottom: 20,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="gray" />
      </TouchableOpacity>
      <Image
        source={require("@/assets/images/color_tinder_icon.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.oops}>Oops!</Text>
        <Text style={styles.description}>
          We couldn’t find a Tinder account connected to that Facebook Account.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="CREATE NEW ACCOUNT"
          gradient
          onPress={() => router.push("/register/PhoneStep")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  logo: {
    position: "absolute",
    top: 72,
    width: 32.58205032348633,
    height: 38.79617691040039,
    alignSelf: "center",
    marginBottom: 20,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  oops: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 29.56,
    lineHeight: 29.56,
  },
  description: {
    fontSize: 19.48,
    lineHeight: 25.19,
    textAlign: "center",
    color: "#828693",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  buttonText: {
    color: "#000000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
