import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

interface PickerProps {
    value: string;
    setValue: (value: string) => void;
    options: { id: string; label: string }[];
}

const Picker: React.FC<PickerProps> = ({
    value,
    setValue,
    options
}) => {
    return (
        <View style={styles.pickerContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.id}
                    style={[
                        styles.pickerButton,
                        value === option.id && styles.pickerButtonSelected,
                    ]}
                    onPress={() => setValue(option.id)}
                >
                    <Text
                        style={[
                            styles.pickerButtonText,
                            value === option.id && styles.pickerButtonTextSelected,
                        ]}
                    >{option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export { Picker };

const styles = StyleSheet.create({
    pickerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
        marginBottom: 8,
        width: "auto"
    },
    pickerButtonText: {
        color: '#666',
    },
    pickerButtonTextSelected: {
        color: 'white',
    },
    pickerButtonSelected: {
        backgroundColor: '#FF4C6D',
        borderColor: '#FF4C6D',
    }
});