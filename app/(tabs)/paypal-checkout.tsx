import React, { useRef } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import vipService from '../../services/vipService';

const PaypalCheckout = () => {
  const { url, amount } = useLocalSearchParams<{ url: string; amount: string }>();
  const router = useRouter();
  const isHandledRef = useRef(false);

  if (!url) {
    return null;
  }

  const handleNavigationChange = async (navState: any) => {
    const { url: currentUrl } = navState;

    // PayPal will redirect to your success url containing token param
    if (!isHandledRef.current && currentUrl.includes('paypal-success')) {
      isHandledRef.current = true;
      const urlObj = new URL(currentUrl);
      const token = urlObj.searchParams.get('token');

      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token thanh toán');
        router.back();
        return;
      }

      const result = await vipService.capturePaypalOrder(token);
      if (result.success) {
        Alert.alert('Thành công', 'Nạp tiền thành công!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', result.error || 'Thanh toán thất bại');
        router.back();
      }
    }
  };

  return (
    <WebView
      source={{ uri: url as string }}
      // onNavigationStateChange={handleNavigationChange}
      startInLoadingState
      renderLoading={() => <ActivityIndicator style={{ flex: 1 }} />}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
        Alert.alert(
          'Lỗi kết nối',
          'Không thể kết nối đến dịch vụ thanh toán. Vui lòng thử lại sau.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(e) => {
        console.log(e.nativeEvent.data);

        let payment = JSON.parse(e.nativeEvent.data);
        console.log(payment);

        if (payment.status === 'COMPLETED') {
          Alert.alert('Thành công', 'Nạp tiền thành công!', [
            {
              text: 'OK',
              onPress: () => {
                router.back();
              },
            },
          ]);
        }
      }}
    />
  );
};

export default PaypalCheckout;
