import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OTPInput: React.FC<{ length: number }> = ({ length }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>(new Array(length).fill(null));

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to the next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <View key={index} style={{ alignItems: "center" }}>
          <TextInput
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
          />
          <View style={styles.separator} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    width: 40,
    height: 40,
    borderRadius: 2,
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    fontWeight: "600",
  },
  separator: {
    width: 40,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#828693",
  },
});

export default OTPInput;
