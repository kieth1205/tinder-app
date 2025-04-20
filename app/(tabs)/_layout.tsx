import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}) {
  return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="fire" color={color} activeIcon={null} inactiveIcon={null} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="comment" color={color} activeIcon={null} inactiveIcon={null} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} activeIcon={null} inactiveIcon={null} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="user-detail/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
