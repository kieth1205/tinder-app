import React from "react";
import { StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';

interface SliderProps {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
}

export const SliderComponent = ({ min = 0, max = 100, step = 1, value, onChange }: SliderProps) => {
    return (
        <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={onChange}
            minimumTrackTintColor="#FF5864"
            maximumTrackTintColor="#FFB6C1"
            thumbTintColor="#FF5864"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FEE2E2",
    },
    sliderContainer: {
        width: 250,
        alignItems: "center",
        marginBottom: 20,
    },
    valueText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF5864",
        marginBottom: 10,
    },
    slider: {
        width: "100%",
        height: 40,
    },
    currentValueText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF5864",
        marginVertical: 10,
    },
    button: {
        backgroundColor: "#FF5864",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
