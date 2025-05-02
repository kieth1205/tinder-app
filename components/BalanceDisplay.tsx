import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../constants/vipPackage';

interface BalanceDisplayProps {
  balance: number;
  onAddMoney?: () => void;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, onAddMoney }) => {
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Số dư:</Text>
        <Text style={styles.balance}>{formatCurrency(balance)}</Text>
      </View>
      
      {/* {onAddMoney && (
        <TouchableOpacity style={styles.addButton} onPress={onAddMoney}>
          <Ionicons name="add-circle-outline" size={18} color="#FF4D67" />
          <Text style={styles.addButtonText}>Nạp tiền</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4D67',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 77, 103, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FF4D67',
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default BalanceDisplay;