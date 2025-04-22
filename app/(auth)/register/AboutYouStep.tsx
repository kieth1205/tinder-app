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
import { COMMUNICATION_STYLE, EDUCATION, LOVE_LANGUAGE, ZODIAC_SIGN } from "@/types";
import { STEPS, TOTAL_STEPS } from "./_layout";

const AboutYouStep = () => {
    const { registrationData, updateRegistrationData } = useRegistration();

    // Initialize state with values from context or null
    const [selectedCommunicationStyle, setSelectedCommunicationStyle] = useState<COMMUNICATION_STYLE | null>(
        registrationData.communicationStyle || null
    );
    const [selectedLoveLanguage, setSelectedLoveLanguage] = useState<LOVE_LANGUAGE | null>(
        registrationData.loveLanguage || null
    );
    const [selectedEducation, setSelectedEducation] = useState<EDUCATION | null>(
        registrationData.education || null
    );
    const [selectedZodiacSign, setSelectedZodiacSign] = useState<ZODIAC_SIGN | null>(
        registrationData.zodiacSign || null
    );

    // Communication style options
    const communicationStyleOptions: { id: COMMUNICATION_STYLE, label: string }[] = [
        { id: "IT_NHAN_TIN", label: "Ít nhắn tin" },
        { id: "NGHIEN_NHAN_TIN", label: "Nghiện nhắn tin" },
        { id: "THICH_GAP_MAT_TRUC_TIEP", label: "Thích gặp mặt trực tiếp" },
        { id: "THICH_GOI_DIEN", label: "Thích gọi điện" },
        { id: "THICH_GOI_VIDEO", label: "Thích gọi video" },
    ];

    // Love language options
    const loveLanguageOptions: { id: LOVE_LANGUAGE, label: string }[] = [
        { id: "NHUNG_CU_CHI_AU_YEM", label: "Những cử chỉ âu yếm" },
        { id: "NHUNG_HANH_DONG_TINH_TE", label: "Những hành động tinh tế" },
        { id: "NHUNG_LOI_KHEN", label: "Những lời khen" },
        { id: "NHUNG_MON_QUA", label: "Những món quà" },
        { id: "THOI_GIAN_BEN_NHAU", label: "Thời gian bên nhau" },
    ];

    // Education options
    const educationOptions: { id: EDUCATION, label: string }[] = [
        { id: "CU_NHAN", label: "Cử nhân" },
        { id: "DANG_HOC_DAI_HOC", label: "Đang học đại học" },
        { id: "SAU_DAI_HOC", label: "Sau đại học" },
        { id: "TIEN_SI", label: "Tiến sĩ" },
        { id: "THPT", label: "Trung học phổ thông" },
        { id: "THAC_SI", label: "Thạc sĩ" },
        { id: "TRUONG_DAY_NGHE", label: "Trường dạy nghề" },
    ];

    // Zodiac sign options
    const zodiacSignOptions: { id: ZODIAC_SIGN, label: string }[] = [
        { id: "BaoBinh", label: "Bảo Bình" },
        { id: "SongNgu", label: "Song Ngư" },
        { id: "BachDuong", label: "Bạch Dương" },
        { id: "KimNguu", label: "Kim Ngưu" },
        { id: "SongTu", label: "Song Tử" },
        { id: "CuGiai", label: "Cự Giải" },
        { id: "SuTu", label: "Sư Tử" },
        { id: "XuNu", label: "Xử Nữ" },
        { id: "ThienBinh", label: "Thiên Bình" },
        { id: "BoCap", label: "Bọ Cạp" },
        { id: "NhanMa", label: "Nhân Mã" },
        { id: "MaKet", label: "Ma Kết" },
    ];

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!selectedCommunicationStyle) {
            newErrors.communicationStyle = 'Vui lòng chọn phong cách giao tiếp';
        }
        if (!selectedLoveLanguage) {
            newErrors.loveLanguage = 'Vui lòng chọn ngôn ngữ tình yêu';
        }
        if (!selectedEducation) {
            newErrors.education = 'Vui lòng chọn trình độ học vấn';
        }
        if (!selectedZodiacSign) {
            newErrors.zodiacSign = 'Vui lòng chọn cung hoàng đạo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // Update context with selected values
        updateRegistrationData('communicationStyle', selectedCommunicationStyle!);
        updateRegistrationData('loveLanguage', selectedLoveLanguage!);
        updateRegistrationData('education', selectedEducation!);
        updateRegistrationData('zodiacSign', selectedZodiacSign!);

        router.push("/register/InterestStep");
    };

    const selectedAll = selectedCommunicationStyle &&
    selectedLoveLanguage &&
    selectedEducation &&
    selectedZodiacSign;

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar step={STEPS.AboutYouStep} totalSteps={TOTAL_STEPS} />
            <AuthHeader onBack={() => router.back()} />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.content}>
                    <Text style={styles.title}>Điều gì tạo nên phiên bản chân thật nhất - về bạn?</Text>
                    <Text style={styles.subtitle}>
                        Hãy cứ chia sẻ thật nhé. Cân bằng thành mới đôi được chân tình.
                    </Text>

                    {/* Communication Style question */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>Trình độ học vấn của bạn?</Text>
                        {errors.education && <Text style={styles.errorText}>{errors.education}</Text>}
                        <View style={styles.optionsContainer}>
                            {educationOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedEducation === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedEducation(option.id as EDUCATION)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedEducation === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Love Language question */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>Phong cách giao tiếp của bạn?</Text>
                        {errors.communicationStyle && <Text style={styles.errorText}>{errors.communicationStyle}</Text>}
                        <View style={styles.optionsContainer}>
                            {communicationStyleOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedCommunicationStyle === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedCommunicationStyle(option.id as COMMUNICATION_STYLE)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedCommunicationStyle === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Education question */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>Ngôn ngữ tình yêu của bạn?</Text>
                        {errors.loveLanguage && <Text style={styles.errorText}>{errors.loveLanguage}</Text>}
                        <View style={styles.optionsContainer}>
                            {loveLanguageOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedLoveLanguage === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedLoveLanguage(option.id as LOVE_LANGUAGE)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedLoveLanguage === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Zodiac Sign question */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>Cung hoàng đạo của bạn?</Text>
                        {errors.zodiacSign && <Text style={styles.errorText}>{errors.zodiacSign}</Text>}
                        <View style={styles.optionsContainer}>
                            {zodiacSignOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedZodiacSign === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedZodiacSign(option.id as ZODIAC_SIGN)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedZodiacSign === option.id && styles.selectedOptionText
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
                        disabled={!selectedAll}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutYouStep;

const styles = StyleSheet.create({
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 8,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff", // White background as requested
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
        borderBottomWidth: 1,
        borderBottomColor: "#E8E6EA",
        paddingBottom: 24,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 16,
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
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
        // fontWeight: "500",
    },
    button: {
        marginTop: 20,
    },
});
