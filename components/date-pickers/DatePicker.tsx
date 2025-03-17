import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const formattedDate = value ? format(value, "dd/MM/yyyy") : placeholder;
  const markedDates = value
    ? {
        [format(value, "yyyy-MM-dd")]: {
          selected: true,
          selectedColor: "#0ea5e9",
        },
      }
    : {};

  const handleDayPress = (day: any) => {
    const selectedDate = new Date(day.dateString);
    onChange(selectedDate);
    setOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <Text style={[styles.buttonText, !value && styles.placeholder]}>
          {formattedDate}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Chọn ngày</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                todayTextColor: "#0ea5e9",
                selectedDayBackgroundColor: "#0ea5e9",
                arrowColor: "#0ea5e9",
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  placeholder: {
    color: "rgba(255,255,255,0.6)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
