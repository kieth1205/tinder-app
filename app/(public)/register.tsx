import React from "react";
import { Text, View } from "@/components/Themed";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { InputTags, TextInput } from "@/components/inputs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-virtualized-view";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SliderComponent } from "@/components/inputs/Slider";
import { MediaUploader } from "@/components/inputs/MediaUploader";
import { LocationTracker } from "@/components/LocationTracker";
import {
  RegisterSchema,
  registerSchema,
} from "@/components/features/auth/schema";
import { DatePicker } from "@/components/date-pickers";

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log(data);
  };

  return (
    <LinearGradient colors={["#3B3B3B", "#4B4B4B"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ flex: 1, padding: 24, backgroundColor: "transparent" }}
          >
            {/* Header with back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginTop: Platform.OS === "ios" ? 40 : 20,
                marginBottom: 20,
              }}
            >
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                fontSize: 26,
                fontWeight: "bold",
                marginBottom: 30,
              }}
            >
              Đăng ký
            </Text>

            {/* Input Fields */}
            <View style={{ gap: 16, backgroundColor: "transparent" }}>
              <View style={{ backgroundColor: "transparent", gap: 12 }}>
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    Email hoặc số điện thoại
                  </Text>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Nhập email hoặc số điện thoại"
                        placeholderTextColor="white"
                      />
                    )}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    Tên của bạn là gì?
                  </Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Nhập tên"
                        placeholderTextColor="white"
                      />
                    )}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    Ngày sinh của bạn là gì?
                  </Text>
                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        placeholder="Nhập ngày sinh"
                      />
                    )}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    Giới tính của bạn là gì?
                  </Text>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                      <InputTags
                        selectType="single"
                        value={value}
                        onSelectedItemsChange={onChange}
                        placeholder="Chọn giới tính"
                        items={[
                          {
                            label: "Nam",
                            value: "male",
                          },
                          {
                            label: "Nữ",
                            value: "female",
                          },
                          {
                            label: "Khác",
                            value: "other",
                          },
                        ]}
                      />
                    )}
                  />
                </View>

                <InputTags
                  value={["test"]}
                  items={[
                    {
                      label: "test",
                      value: "test",
                    },
                    {
                      label: "test2",
                      value: "test2",
                    },
                    {
                      label: "test3",
                      value: "test3",
                    },
                    {
                      label: "test4",
                      value: "test4",
                    },
                    {
                      label: "test5",
                      value: "test5",
                    },
                    {
                      label: "test6",
                      value: "test6",
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <SliderComponent
            value={10}
            onChange={() => {
              console.log("test");
            }}
          />
          <MediaUploader />
          <LocationTracker />
        </ScrollView>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            backgroundColor: "transparent",
          }}
        >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={{
              backgroundColor: "white",
              paddingVertical: 14,
              borderRadius: 25,
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Tạo tài khoản
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
