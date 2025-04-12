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
import { ALCOHOL_CONSUMPTION, DIETARY_PREFERENCE, EXERCISE_FREQUENCY, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE } from "@/types";
import { STEPS, TOTAL_STEPS } from "./_layout";

const StyleStep = () => {
    const { registrationData, updateRegistrationData } = useRegistration();

    // Initialize state with values from context or null
    const [selectedAlcohol, setSelectedAlcohol] = useState<ALCOHOL_CONSUMPTION | null>(
        registrationData.alcoholConsumption || null
    );
    const [selectedSmoking, setSelectedSmoking] = useState<SMOKING_PREFERENCE | null>(
        registrationData.smoking || null
    );
    const [selectedExercise, setSelectedExercise] = useState<EXERCISE_FREQUENCY | null>(
        registrationData.exerciseHabit || null
    );
    const [selectedPet, setSelectedPet] = useState<PETS | null>(
        registrationData.pets || null
    );
    const [selectedDietaryPreference, setSelectedDietaryPreference] = useState<DIETARY_PREFERENCE | null>(
        registrationData.diet || null
    );
    const [selectedSocialMedia, setSelectedSocialMedia] = useState<SOCIAL_MEDIA_USAGE | null>(
        registrationData.socialMediaActivity || null
    );
    const [selectedSleepPattern, setSelectedSleepPattern] = useState<SLEEP_PATTERN | null>(
        registrationData.sleepHabit || null
    );

    // Alcohol consumption options
    const alcoholOptions: { id: ALCOHOL_CONSUMPTION, label: string }[] = [
        { id: "KHONG_DANH_CHO_MINH", label: "Không dành cho mình" },
        { id: "LUON_TINH_TAO", label: "Luôn tỉnh táo" },
        { id: "UONG_CO_TRACH_NGHIEM", label: "Uống có trách nhiệm" },
        { id: "CHI_NHUNG_DIP_DAC_BIET", label: "Chỉ những dịp đặc biệt" },
        { id: "UONG_GIAO_LUU_VAO_CUOI_TUAN", label: "Uống giao lưu vào cuối tuần" },
        { id: "HAU_NHU_MOI_TOI", label: "Hầu như mỗi tối" },
    ];

    // Smoking preference options
    const smokingOptions: { id: SMOKING_PREFERENCE, label: string }[] = [
        { id: "HUT_THUOC_VOI_BAN_BE", label: "Hút thuốc với bạn bè" },
        { id: "HUT_THUOC_KHI_NHAU", label: "Hút thuốc khi nhậu" },
        { id: "KHONG_HUT_THUOC", label: "Không hút thuốc" },
        { id: "HUT_THUOC_THUONG_XUYEN", label: "Hút thuốc thường xuyên" },
        { id: "DANG_CO_GANG_BO", label: "Đang cố gắng bỏ" },
    ];

    const exerciseHabitOptions: { id: EXERCISE_FREQUENCY, label: string }[] = [
        { id: "HANG_NGAY", label: "Hàng ngày" },
        { id: "THUONG_XUYEN", label: "Hàng tuần" },
        { id: "THINH_THOANG", label: "Hàng tháng" },
        { id: "KHONG_TAP", label: "Không tập" },
    ];

    // Pet options
    const petOptions: { id: PETS, label: string }[] = [
        { id: "CHO", label: "Chó" },
        { id: "MEO", label: "Mèo" },
        { id: "BO_SAT", label: "Bò sát" },
        { id: "DONG_VAT_LUONG_CU", label: "Động vật lưỡng cư" },
        { id: "LOAI_CHIM", label: "Loài chim" },
        { id: "CA", label: "Cá" },
        { id: "RUA", label: "Rùa" },
        { id: "HAMSTER", label: "Hamster" },
        { id: "THO", label: "Thỏ" },
        { id: "KHAC", label: "Khác" },
        { id: "KHONG_NUOI_THU_CUNG", label: "Không nuôi thú cưng" },
        { id: "MUON_NUOI_THU_CUNG", label: "Muốn nuôi thú cưng" },
        { id: "DI_UNG_VOI_DONG_VAT", label: "Dị ứng với động vật" },
    ]

    // Dietary preference options
    const dietaryOptions: { id: DIETARY_PREFERENCE, label: string }[] = [
        { id: "CHI_AN_THIT", label: "Chỉ ăn thịt" },
        { id: "AN_CHAY", label: "Ăn chay" },
        { id: "AN_THUAN_CHAY", label: "Ăn thuần chay (Vegan)" },
        { id: "CHI_AN_HAI_SAN_RAU_CU", label: "Chỉ ăn hải sản và rau củ (Pescatarian)" }, 
        { id: "KHONG_AN_KIENG", label: "Không ăn kiêng" },
        { id: "KHAC", label: "Khác" },
    ];

    // Social media usage options
    const socialMediaOptions: { id: SOCIAL_MEDIA_USAGE, label: string }[] = [
        { id: "INFLUENCER", label: "Tôi là influencer" },
        { id: "HOAT_DONG_TICH_CUC", label: "Hoạt động tích cực" },
        { id: "LUOT_DAO_AM_THAM", label: "Lướt đảo âm thầm" },
        { id: "KHONG_DUNG_MANG", label: "Không dùng mạng xã hội" },
    ];

    // Sleep pattern options
    const sleepPatternOptions: { id: SLEEP_PATTERN, label: string }[] = [
        { id: "DAY_SOM", label: "Dậy sớm" },
        { id: "CU_DEM", label: "Cú đêm" },
        { id: "GIO_GIAC_LINH_HOAT", label: "Giờ giấc linh hoạt" },
    ];

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!selectedAlcohol) {
            newErrors.alcohol = 'Vui lòng chọn thói quen uống rượu';
        }
        if (!selectedSmoking) {
            newErrors.smoking = 'Vui lòng chọn thói quen hút thuốc';
        }
        if (!selectedExercise) {
            newErrors.exercise = 'Vui lòng chọn tần suất tập thể dục';
        }
        if (!selectedPet) {
            newErrors.pet = 'Vui lòng chọn thói quen nuôi thú cưng';
        }
        if (!selectedDietaryPreference) {
            newErrors.diet = 'Vui lòng chọn chế độ ăn';
        }
        if (!selectedSocialMedia) {
            newErrors.socialMedia = 'Vui lòng chọn mức độ sử dụng mạng xã hội';
        }
        if (!selectedSleepPattern) {
            newErrors.sleep = 'Vui lòng chọn thói quen ngủ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // Update context with selected values
        updateRegistrationData('alcoholConsumption', selectedAlcohol!);
        updateRegistrationData('smoking', selectedSmoking!);
        updateRegistrationData('exerciseHabit', selectedExercise!);
        updateRegistrationData('pets', selectedPet!);
        updateRegistrationData('diet', selectedDietaryPreference!);
        updateRegistrationData('socialMediaActivity', selectedSocialMedia!);
        updateRegistrationData('sleepHabit', selectedSleepPattern!);

        // Navigate to next step
        router.push("/register/AboutYouStep");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar step={STEPS.StyleStep} totalSteps={TOTAL_STEPS} />
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
                        {errors.alcohol && <Text style={styles.errorText}>{errors.alcohol}</Text>}

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
                        {errors.smoking && <Text style={styles.errorText}>{errors.smoking}</Text>}

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

                    {/* Exercise habit question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>🏋️‍♂️</Text>
                            <Text style={styles.questionText}>Tần suất tập luyện thể thao của bạn?</Text>
                        </View>
                        {errors.exercise && <Text style={styles.errorText}>{errors.exercise}</Text>}

                        <View style={styles.optionsContainer}>
                            {exerciseHabitOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedExercise === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedExercise(option.id as EXERCISE_FREQUENCY)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedExercise === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Pets question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>🐾</Text>
                            <Text style={styles.questionText}>Thú cưng của bạn?</Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            {petOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedPet === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedPet(option.id as PETS)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedPet === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Dietary preference question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>🍽️</Text>
                            <Text style={styles.questionText}>Chế độ ăn uống của bạn?</Text>
                        </View>
                        {errors.diet && <Text style={styles.errorText}>{errors.diet}</Text>}

                        <View style={styles.optionsContainer}>
                            {dietaryOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedDietaryPreference === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedDietaryPreference(option.id as DIETARY_PREFERENCE)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedDietaryPreference === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Social media usage question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>📱</Text>
                            <Text style={styles.questionText}>Mức độ sử dụng mạng xã hội của bạn?</Text>
                        </View>
                        {errors.socialMedia && <Text style={styles.errorText}>{errors.socialMedia}</Text>}

                        <View style={styles.optionsContainer}>
                            {socialMediaOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedSocialMedia === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedSocialMedia(option.id as SOCIAL_MEDIA_USAGE)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedSocialMedia === option.id && styles.selectedOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Sleep pattern question */}
                    <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionIcon}>😴</Text>
                            <Text style={styles.questionText}>Thói quen ngủ nghỉ của bạn?</Text>
                        </View>
                        {errors.sleep && <Text style={styles.errorText}>{errors.sleep}</Text>}

                        <View style={styles.optionsContainer}>
                            {sleepPatternOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedSleepPattern === option.id && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedSleepPattern(option.id as SLEEP_PATTERN)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedSleepPattern === option.id && styles.selectedOptionText
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
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 8,
    },
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
        borderBottomWidth: 1,
        borderBottomColor: "#E8E6EA",
        paddingBottom: 24,
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
