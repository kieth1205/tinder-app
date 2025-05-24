import React, { useRef } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

const PaypalCheckout = () => {
  const { url, amount } = useLocalSearchParams<{ url: string; amount: string }>();
  const router = useRouter();

  if (!url) {
    return null;
  }

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
