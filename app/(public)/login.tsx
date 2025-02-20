import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from '@/components/inputs';
import { loginSchema, LoginSchema } from '@/components/features/auth';
import { useForm } from 'react-hook-form';

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate login - Replace with your actual login logic
    try {
      // Add your authentication logic here
      console.log('Logging in with:', { identifier, password });
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="Nhập email hoặc số điện thoại"
                  placeholderTextColor="#rgba(255,255,255,0.6)"
                  autoCapitalize="none"
                  keyboardType="email-address"
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
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#rgba(255,255,255,0.6)"
                  secureTextEntry
                />
              </View>

              {error ? (
                <Text style={{
                  color: '#FFE5E5',
                  fontSize: 14,
                  textAlign: 'center'
                }}>
                  {error}
                </Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                backgroundColor: 'white',
                paddingVertical: 16,
                borderRadius: 25,
                marginTop: 'auto',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                color: '#000'
              }}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}