import React from "react";
import { Text, View } from "@/components/Themed";
import {
  TextInput as DefaultTextInput,
  TextInputProps as DefaultTextInputProps,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from "react-native";

interface TextInputProps extends DefaultTextInputProps {
  error?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  onEndEditing?: () => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "off" | "email" | "password" | "username";
  autoCorrect?: boolean;
  autoFocus?: boolean;
  inputMode?: "text" | "numeric" | "email" | "tel" | "url";
  maxLength?: number;
  minLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  textAlign?: "left" | "center" | "right";
  textAlignVertical?: "auto" | "top" | "bottom" | "center";
  selectionColor?: string;
  underlineColorAndroid?: string;
  blurOnSubmit?: boolean;
  clearButtonMode?: "never" | "while-editing" | "unless-editing" | "always";
  clearTextOnFocus?: boolean;
  contextMenuHidden?: boolean;
  disableFullscreenUI?: boolean;
  editable?: boolean;
  enablesReturnKeyAutomatically?: boolean;
  spellCheck?: boolean;
  outlineMode?: "top" | "bottom" | "both" | "none";
}

export const TextInput = ({
  style,
  error,
  outlineMode = "both",
  ...props
}: TextInputProps) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
      }}
    >
      <DefaultTextInput
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "white",
          fontSize: 16,
          overflow: "hidden",
          minHeight: 40,
          paddingHorizontal: 10,
          borderWidth: outlineMode === "both" ? 1 : 0,
          borderBottomWidth: ["bottom", "both"].includes(outlineMode) ? 1 : 0,
          borderTopWidth: ["top", "both"].includes(outlineMode) ? 1 : 0,
          placeHolderTextColor: "red",
          ...(style as any),
        }}
        {...props}
      />

      {error && (
        <Text style={{ color: "#ee4d2d", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};
