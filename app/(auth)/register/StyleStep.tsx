import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { useRegistration } from "@/context/RegistrationContext";
import { ALCOHOL_CONSUMPTION, SMOKING_PREFERENCE } from "@/types";

const StyleStep = () => {
    const { registrationData, updateRegistrationData } = useRegistration();

    // Initialize state with values from context or null
    const [selectedAlcohol, setSelectedAlcohol] = useState<ALCOHOL_CONSUMPTION | null>(
        registrationData.alcoholConsumption || null
    );
    const [selectedSmoking, setSelectedSmoking] = useState<SMOKING_PREFERENCE | null>(
        registrationData.smoking || null
    );

    // Alcohol consumption options
    const alcoholOptions = [
        { id: "KHONG_DANH_CHO_MINH", label: "Không dành cho mình" },
        { id: "LUON_TINH_TAO", label: "Luôn tỉnh táo" },
        { id: "UONG_CO_TRACH_NGHIEM", label: "Uống có trách nhiệm" },
        { id: "CHI_NHUNG_DIP_DAC_BIET", label: "Chỉ những dịp đặc biệt" },
        { id: "UONG_GIAO_LUU_VAO_CUOI_TUAN", label: "Uống giao lưu vào cuối tuần" },
        { id: "HAU_NHU_MOI_TOI", label: "Hầu như mỗi tối" },
    ];

    // Smoking preference options
    const smokingOptions = [
        { id: "HUT_THUOC_VOI_BAN_BE", label: "Hút thuốc với bạn bè" },
        { id: "HUT_THUOC_KHI_NHAU", label: "Hút thuốc khi nhậu" },
        { id: "KHONG_HUT_THUOC", label: "Không hút thuốc" },
        { id: "HUT_THUOC_THUONG_XUYEN", label: "Hút thuốc thường xuyên" },
        { id: "DANG_CO_GANG_BO", label: "Đang cố gắng bỏ" },
    ];

    const handleNext = () => {
        // Update context with selected values
        if (selectedAlcohol) {
            updateRegistrationData('alcoholConsumption', selectedAlcohol);
        }

        if (selectedSmoking) {
            updateRegistrationData('smoking', selectedSmoking);
        }

        // Navigate to next step
        router.push("/register/PhotosStep");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar step={5} totalSteps={7} />
            <AuthHeader onBack={() => router.back()} />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.content}>
                    <Text style={styles.title}>Cùng trao đổi phong cách sống nhé, test</Text>
                    <Text style={styles.subtitle}>
                        Liệu thói quen của người ấy có giống bạn không? Hãy chia sẻ trước nhé.
                    </Text>

                    {/* Alcohol consumption question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>🍺</Text>
                            <Text style={styles.questionText}>Bạn thường uống rượu bia như thế nào?</Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            {alcoholOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedAlcohol === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedAlcohol(option.id as ALCOHOL_CONSUMPTION)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedAlcohol === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Smoking preference question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>🚬</Text>
                            <Text style={styles.questionText}>Bạn có hay hút thuốc không?</Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            {smokingOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedSmoking === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedSmoking(option.id as SMOKING_PREFERENCE)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedSmoking === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Continue button */}
                    <Button
                        style={styles.button}
                        title="Tiếp tục"
                        onPress={handleNext}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default StyleStep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    questionContainer: {
        marginBottom: 30,
    },
    questionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    questionIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: "#f3f3f3",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    selectedOption: {
        backgroundColor: "#FF4458",
        borderColor: "#FF4458",
    },
    optionText: {
        fontSize: 14,
        color: "#666",
    },
    selectedOptionText: {
        color: "#fff",
        fontWeight: "500",
    },
    button: {
        marginTop: 20,
    },
});
