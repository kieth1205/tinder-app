import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { useRegistration } from "@/context/RegistrationContext";
import { STEPS, TOTAL_STEPS } from "./_layout";

const ProfilePassStep = () => {
    const { registrationData, updateRegistrationData, handleRegister } = useRegistration();

    // Initialize state with values from context or empty
    const [password, setPassword] = useState<string>(registrationData.password || "");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [rawProfile, setRawProfile] = useState<string>(registrationData.rawProfile || "");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        if (!rawProfile) {
            newErrors.rawProfile = 'Vui lòng viết một vài điều về bản thân';
        } else if (rawProfile.length < 10) {
            newErrors.rawProfile = 'Hãy viết thêm một chút về bản thân';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateForm()) {
            return;
        }

        // Update context with selected values
        updateRegistrationData('password', password);
        updateRegistrationData('rawProfile', rawProfile);

        await handleRegister().then(() => {
            router.push("/register/SuccessStep");
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar step={STEPS.ProfilePassStep} totalSteps={TOTAL_STEPS} />
            <AuthHeader onBack={() => router.back()} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Hoàn tất đăng ký</Text>
                        <Text style={styles.subtitle}>
                            Hãy tạo mật khẩu và chia sẻ một chút về bản thân.
                        </Text>

                        {/* Password input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Mật khẩu</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Nhập mật khẩu"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}
                        </View>

                        {/* Confirm Password input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Nhập lại mật khẩu"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}
                        </View>

                        {/* Profile description input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Giới thiệu bản thân</Text>
                            <TextInput
                                style={[styles.input, styles.multilineInput]}
                                value={rawProfile}
                                onChangeText={setRawProfile}
                                placeholder="Viết một vài điều về bản thân..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                            {errors.rawProfile && (
                                <Text style={styles.errorText}>{errors.rawProfile}</Text>
                            )}
                        </View>

                        {/* Register button */}
                        <Button
                            style={styles.button}
                            title="Đăng ký"
                            onPress={handleNext}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProfilePassStep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E8E6EA",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 120,
        paddingTop: 12,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        marginTop: 30,
    },
});
