// components/inputs/BirthdayInput.tsx
import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface BirthdayInputProps {
  value: string;
  onChange: (text: string) => void;
  invalid?: boolean;
  errorText?: string;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({
  value,
  onChange,
  invalid,
  errorText,
}) => {
  const [inputs, setInputs] = useState(Array(8).fill("")); // Changed to 8 inputs
  const inputRefs = useRef<(TextInput | null)[]>(Array(8).fill(null));
  const placeholder = "YYYYMMDD";

  const handleChange = (text: string, index: number) => {
    const newInputs = [...inputs];

    if (text === "") {
      newInputs[index] = "";
      setInputs(newInputs);
      if (index > 0) {
        const prevInput = index - 1;
        inputRefs.current[prevInput]?.focus();
      }
    } else {
      newInputs[index] = text.slice(0, 1);
      setInputs(newInputs);
      if (index < 7) {
        const nextInput = index + 1;
        inputRefs.current[nextInput]?.focus();
      }
    }
    const formattedValue = [
      newInputs.slice(0, 4).join(""),
      newInputs.slice(4, 6).join(""),
      newInputs.slice(6, 8).join(""),
    ].join("/");

    onChange(formattedValue);
  };

  return (
    <View style={styles.inputContainer}>
      {inputs.map((input, index) => (
        <React.Fragment key={index}>
          <TextInput
            ref={(el) => (inputRefs.current[index] = el)}
            value={input}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            style={styles.input}
            placeholder={placeholder[index]}
            id={`input${index}`}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !input) {
                // Nếu đang ấn Backspace và ô hiện tại rỗng
                if (index > 0) {
                  const prevInput = index - 1;
                  const newInputs = [...inputs];
                  newInputs[prevInput] = ""; // Xóa giá trị ô trước đó
                  setInputs(newInputs);
                  inputRefs.current[prevInput]?.focus();

                  // Cập nhật formatted value
                  const formattedValue = [
                    newInputs.slice(0, 4).join(""),
                    newInputs.slice(4, 6).join(""),
                    newInputs.slice(6, 8).join(""),
                  ].join("/");
                  onChange(formattedValue);
                }
              }
            }}
          />
          {(index === 3 || index === 5) && <Text style={styles.slash}>/</Text>}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    textAlign: "center",
  },
  slash: {
    fontSize: 20,
    marginHorizontal: 5,
  },
});

export default BirthdayInput;
