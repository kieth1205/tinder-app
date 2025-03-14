
import React from "react";
import { Text, View } from "@/components/Themed";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { InputTags } from "@/components/inputs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from 'react-native-virtualized-view'
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "@/components/features/auth/schema";
import { SliderComponent } from "@/components/inputs/Slider";
import { MediaUploader } from "@/components/inputs/MediaUploader";
import { LocationTracker } from "@/components/LocationTracker";

export default function Register() {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log(data)
  }

  return (
    <LinearGradient
      colors={['#3B3B3B', '#4B4B4B']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, padding: 24, backgroundColor: "transparent" }}>
            {/* Header with back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginTop: Platform.OS === 'ios' ? 40 : 20,
                marginBottom: 20,
              }}
            >
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text style={{
              color: 'white',
              fontSize: 26,
              fontWeight: 'bold',
              marginBottom: 30
            }}>
              Đăng ký
            </Text>

            {/* Input Fields */}
            <View style={{ gap: 16, backgroundColor: "transparent" }}>
              <View style={{ backgroundColor: "transparent" }}>
                <Text style={{
                  color: 'white',
                  marginBottom: 8,
                  fontSize: 16
                }}>
                  Email hoặc số điện thoại
                </Text>
                <Controller
                  control={control}
                  name="tag"
                  render={({ field: { onChange, value } }) => (
                    <InputTags
                      value={value}
                      onSelectedItemsChange={onChange}
                      selectType="single"
                      items={[{
                        label: 'test',
                        value: 'test'
                      },
                      {
                        label: 'test2',
                        value: 'test2'
                      },
                      {
                        label: 'test3',
                        value: 'test3'
                      },
                      {
                        label: 'test4',
                        value: 'test4'
                      },
                      {
                        label: 'test5',
                        value: 'test5'
                      },
                      {
                        label: 'test6',
                        value: 'test6'
                      }]} />
                  )}
                />
                <InputTags
                  value={['test']}
                  items={[{
                    label: 'test',
                    value: 'test'
                  },
                  {
                    label: 'test2',
                    value: 'test2'
                  },
                  {
                    label: 'test3',
                    value: 'test3'
                  },
                  {
                    label: 'test4',
                    value: 'test4'
                  },
                  {
                    label: 'test5',
                    value: 'test5'
                  },
                  {
                    label: 'test6',
                    value: 'test6'
                  }]} />
              </View>
            </View>
          </View>
          <SliderComponent value={10} onChange={() => { console.log('test') }} />
          <MediaUploader />
          <LocationTracker />
        </ScrollView>
        <TouchableOpacity style={{ backgroundColor: "red", padding: 12, alignItems: "center", justifyContent: "center", margin: 24 }} onPress={handleSubmit(onSubmit)}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Submit</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
