import { AuthHeader } from "@/components/AuthHeader";
import { Button } from "@/components/button/ContinueButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";

const HouseRules = [
  {
    index: 1,
    title: "Be yourself.",
    description:
      "Make sure your photos, age, and bio are \ntrue to who you are.",
  },
  {
    index: 2,
    title: "Stay safe.",
    description:
      "Don’t be too quick to give out personal information. Date Safely",
  },
  {
    index: 3,
    title: "Play it cool.",
    description:
      "Respect others and treat them as you \nwould like to be treated.",
  },
  {
    index: 4,
    title: "Be proactive.",
    description: "Always report bad behavior.",
  },
];

const RenderRuleItem = ({ item }: { item: (typeof HouseRules)[0] }) => {
  return (
    <View style={styles.ruleItem}>
      <View style={styles.ruleIndex}>
        <Ionicons name="checkmark" size={24} color="#EC5C54" />
        <Text style={styles.ruleTitle}>{item.title}</Text>
      </View>
      <Text style={styles.ruleDescription}>{item.description}</Text>
    </View>
  );
};

const SuccessStep = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.back()} />
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/color_tinder_icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title} children="Welcome to Tinder." />
        <Text
          style={styles.subTitle}
          children="Please follow these House Rules."
        />
      </View>
      <FlatList
        data={HouseRules}
        renderItem={({ item }) => <RenderRuleItem item={item} />}
        contentContainerStyle={styles.ruleList}
      />
      <Button
        title="Continue"
        onPress={() => router.push("/(tabs)")}
        gradient
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 47,
  },
  image: {
    width: 25,
    height: 29,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 14.4,
    lineHeight: 18,
    fontWeight: "600",
    color: "#757575",
    textAlign: "center",
    marginBottom: 40,
  },
  ruleList: {
    paddingHorizontal: 47,
  },
  ruleItem: {
    justifyContent: "flex-start",
    marginBottom: 23,
  },
  ruleIndex: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ruleTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#2B2B2B",
    fontWeight: "700",
  },
  ruleDescription: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "600",
    color: "#757575",
  },
});

export default SuccessStep;
