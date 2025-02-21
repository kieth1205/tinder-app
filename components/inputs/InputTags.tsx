import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';

interface IOption {
  value: string;
  label: string;
}

type SelectType = 'multiple' | 'single'

interface InputTagsProps {
  value: string[] | string;
  items: IOption[];
  initialSelected?: IOption[];
  onSelectedItemsChange?: (items: IOption[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
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
  searchPlaceholder = 'Tìm kiếm...',
  tagContainerStyle,
  tagTextStyle,
  selectType = 'multiple'
}: InputTagsProps) => {
  const [selectedItems, setSelectedItems] = useState(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (item: IOption) => {
    const isSelected = selectedItems.some(selected => selected.value === item.value);
    if (isSelected) {
      const newItems = selectedItems.filter(selected => selected.value !== item.value);
      setSelectedItems(newItems);
      onSelectedItemsChange?.(newItems);
    } else {
      const newItems = selectType === 'single' ? [item] : [...selectedItems, item];
      setSelectedItems(newItems);
      onSelectedItemsChange?.(newItems);
    }
  };

  const isItemSelected = (item: IOption) =>
    selectedItems.some(selected => selected.value === item.value);

  const renderTag = (item: IOption) => {
    const selected = isItemSelected(item);
    return (
      <TouchableOpacity
        onPress={() => toggleItem(item)}
        style={[
          styles.tag,
          tagContainerStyle,
          selected && styles.selectedTag
        ]}
      >
        <Text style={[
          styles.tagText,
          tagTextStyle,
          selected && styles.selectedTagText
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search input */}
      <TextInput
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: 12,
          borderRadius: 8,
          color: 'white',
          fontSize: 16,
          overflow: 'hidden',
        }}
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#rgba(255,255,255,0.6)"
      />

      {/* Tags display */}
      <View style={styles.tagsContainer}>
        <FlatList
          data={filteredItems}
          scrollEnabled={false}
          keyExtractor={item => item.value.toString()}
          renderItem={({ item }) => renderTag(item)}
          numColumns={3}
          columnWrapperStyle={styles.tagRow}
          ListEmptyComponent={() => <View style={{ height: 100 }} >
            <Text style={{ color: 'white', fontSize: 12, marginTop: 12, textAlign: 'center' }}>Không tìm thấy kết quả</Text>
          </View>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tagsContainer: {
    flex: 1,
  },
  tagRow: {
    justifyContent: 'flex-start',
    marginTop: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 8,
    margin: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  selectedTag: {
    backgroundColor: '#2196F3',
  },
  tagText: {
    color: '#333',
    fontSize: 14,
  },
  selectedTagText: {
    color: 'white',
  }
});

export { InputTags };