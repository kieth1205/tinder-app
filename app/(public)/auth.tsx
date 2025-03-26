import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function AuthScreen() {
  return (
    <LinearGradient
      colors={['#FE3C72', '#FF2D55']}
      style={{ flex: 1, paddingHorizontal: 24 }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{
          alignItems: 'center',
          paddingHorizontal: 24,
          marginBottom: 100
        }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 180, height: 44 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>tinder</Text>
        </View>

        <Text style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: 40,
          fontSize: 13,
          lineHeight: 18
        }}>
          Khi nhấn 'Tạo tài khoản' hoặc 'Đăng nhập', bạn đồng ý với các Điều khoản của chúng tôi. Tìm hiểu cách chúng tôi xử lý dữ liệu của bạn trong Chính sách Quyền riêng tư và Chính sách Cookie của chúng tôi.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={{
            backgroundColor: 'white',
            paddingVertical: 14,
            borderRadius: 25,
            width: '100%',
            marginBottom: 8
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
            Tạo tài khoản
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{
            backgroundColor: 'white',
            paddingVertical: 14,
            borderRadius: 25,
            width: '100%',
            marginBottom: 24
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}