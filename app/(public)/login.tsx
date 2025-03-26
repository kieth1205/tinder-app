import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from '@/components/inputs';
import { loginSchema, LoginSchema } from '@/components/features/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthProvider';

export default function LoginScreen() {
  const { login } = useAuth();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      login(data.username, data.password);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: 'Vui lòng thử lại.'
      });
    }
  };

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
          <View style={{ flex: 1, padding: 24 }}>
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
              Đăng nhập
            </Text>

            {/* Input Fields */}
            <View style={{ gap: 16 }}>
              <View>
                <Text style={{
                  color: 'white',
                  marginBottom: 8,
                  fontSize: 16
                }}>
                  Email hoặc số điện thoại
                </Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Nhập email hoặc số điện thoại"
                      placeholderTextColor="#rgba(255,255,255,0.6)"
                      error={errors.username?.message}
                    />
                  )}
                />
              </View>

              <View>
                <Text style={{
                  color: 'white',
                  marginBottom: 8,
                  fontSize: 16
                }}>
                  Mật khẩu
                </Text>

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor="#rgba(255,255,255,0.6)"
                      secureTextEntry
                      error={errors.password?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={{
                backgroundColor: 'white',
                paddingVertical: 16,
                borderRadius: 25,
                marginTop: 'auto',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                color: '#000'
              }}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}