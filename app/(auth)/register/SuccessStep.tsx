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
    title: "Hãy là chính mình.",
    description:
      "Đảm bảo hình ảnh, tuổi tác và tiểu sử của bạn \nphản ánh đúng con người thật.",
  },
  {
    index: 2,
    title: "Giữ an toàn.",
    description:
      "Đừng vội vàng chia sẻ thông tin cá nhân. Hẹn hò an toàn.",
  },
  {
    index: 3,
    title: "Hãy điềm tĩnh.",
    description:
      "Tôn trọng người khác và đối xử với họ như cách \nbạn muốn được đối xử.",
  },
  {
    index: 4,
    title: "Chủ động.",
    description: "Luôn báo cáo hành vi không phù hợp.",
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
        <Text style={styles.title} children="Chào mừng đến với Tinder" />
        <Text
          style={styles.subTitle}
          children="Vui lòng tuân thủ những quy tắc sau"
        />
      </View>
      <FlatList
        data={HouseRules}
        renderItem={({ item }) => <RenderRuleItem item={item} />}
        contentContainerStyle={styles.ruleList}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Tiếp tục"
          onPress={() => router.push("/(auth)/login")}
          gradient
        />
      </View>
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
  buttonContainer: {
    flex: 1,
    marginBottom: 40,
    paddingHorizontal: 47,
  },
});

export default SuccessStep;
