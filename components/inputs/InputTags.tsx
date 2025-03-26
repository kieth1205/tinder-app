import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

interface IOption {
  value: string;
  label: string;
}

type SelectType = "multiple" | "single";

interface InputTagsProps {
  value: string[] | string;
  items: IOption[];
  initialSelected?: IOption[];
  onSelectedItemsChange?: (items: IOption[]) => void;
  placeholder?: string;
  tagContainerStyle?: any;
  tagTextStyle?: any;
  itemStyle?: any;
  selectedItemStyle?: any;
  selectType?: SelectType;
}

const InputTags = ({
  items,
  value,
  initialSelected = [],
  onSelectedItemsChange,
  tagContainerStyle,
  tagTextStyle,
  selectType = "multiple",
}: InputTagsProps) => {
  const [selectedItems, setSelectedItems] = useState(initialSelected);

  const toggleItem = (item: IOption) => {
    const isSelected = selectedItems.some(
      (selected) => selected.value === item.value
    );
    if (isSelected) {
      const newItems = selectedItems.filter(
        (selected) => selected.value !== item.value
      );
      setSelectedItems(newItems);
      onSelectedItemsChange?.(newItems);
    } else {
      const newItems =
        selectType === "single" ? [item] : [...selectedItems, item];
      setSelectedItems(newItems);
      onSelectedItemsChange?.(newItems);
    }
  };

  const isItemSelected = (item: IOption) =>
    selectedItems.some((selected) => selected.value === item.value);

  const renderTag = (item: IOption) => {
    const selected = isItemSelected(item);
    return (
      <TouchableOpacity
        onPress={() => toggleItem(item)}
        style={[styles.tag, tagContainerStyle, selected && styles.selectedTag]}
      >
        <Text
          style={[
            styles.tagText,
            tagTextStyle,
            selected && styles.selectedTagText,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tags display */}
      <View style={styles.tagsContainer}>
        <FlatList
          data={items}
          scrollEnabled={false}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => renderTag(item)}
          numColumns={3}
          columnWrapperStyle={styles.tagRow}
          ListEmptyComponent={() => (
            <View style={{ height: 100 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Không có dữ liệu
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagsContainer: {
    flex: 1,
  },
  tagRow: {
    justifyContent: "flex-start",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 8,
    margin: 4,
    minWidth: 80,
    justifyContent: "center",
  },
  selectedTag: {
    backgroundColor: "#2196F3",
  },
  tagText: {
    color: "#333",
    fontSize: 14,
  },
  selectedTagText: {
    color: "white",
  },
});

export { InputTags };
