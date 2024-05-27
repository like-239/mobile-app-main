import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProgressBar from './ProgressBar';
import API from '../services/GlobalAPI';

const Budget = () => {
  const navigation = useNavigation();
  const [totalBudget, setTotalBudget] = useState('');
  const [category, setCategory] = useState('ăn uống');
  const [timeFrame, setTimeFrame] = useState('month');
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState('');

  const formatDate = (dateString) => {
    return moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD');
  };

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const getUserTotalBalance = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const token = await AsyncStorage.getItem('token');
        const response = await API.requestGet_BudgetDetail(`/budget/details?id=${id}&token=${token}`);
        console.log(id, token);
        console.log('response', response);
      } catch (error) {
        console.log(error);
      }
    };

    getUserTotalBalance();
  }, []);

  // Tính ngày bắt đầu và kết thúc dựa trên lựa chọn thời gian
  const getDateRange = () => {
    const today = moment();
    switch (timeFrame) {
      case 'week':
        return {
          startDate: today.startOf('week').format('DD-MM-YYYY'),
          endDate: today.endOf('week').format('DD-MM-YYYY')
        };
      case 'month':
        return {
          startDate: today.startOf('month').format('DD-MM-YYYY'),
          endDate: today.endOf('month').format('DD-MM-YYYY')
        };
      case 'quarter':
        return {
          startDate: today.startOf('quarter').format('DD-MM-YYYY'),
          endDate: today.endOf('quarter').format('DD-MM-YYYY')
        };
      case 'year':
        return {
          startDate: today.startOf('year').format('DD-MM-YYYY'),
          endDate: today.endOf('year').format('DD-MM-YYYY')
        };
      default:
        return { startDate: '', endDate: '' };
    }
  };

  const handleBudgetChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = formatNumberWithCommas(numericValue);
    setTotalBudget(formattedValue);
  };

  const handleCreateBudget = async () => {
    const { startDate, endDate } = getDateRange();
    setShowProgress(true);
    setProgress(0.5);
    const id = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');
    const budgetData = {
      category,
      cost: totalBudget.replace(/\./g, ''), // Remove commas for the backend
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      userId: id,
      remainingAmount: totalBudget.replace(/\./g, ''),
    };
    setRemainingAmount('');
    console.log(formatDate(startDate));

    const responses = await API.requestCreateBudget(`/budget/create?token=${token}`, budgetData);
    console.log('Budget Data:', budgetData, 'Token:', token);

    console.log(responses);
    setTimeout(() => {
      setProgress(1);
      navigation.navigate('BottomTabNavigation', {
        initialBudget: parseFloat(totalBudget.replace(/\./g, '')),
        spentAmount: 0,
        category,
        timeFrame,
        startDate,
        endDate,
        remainingAmount
      });
      Alert.alert('Budget Created!');
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm ngân sách</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Chọn nhóm</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Ăn uống" value="ăn uống" />
          <Picker.Item label="Giải trí" value="giải trí" />
          <Picker.Item label="Gia đình" value="gia đình" />
          <Picker.Item label="Sức khỏe" value="sức khỏe" />
          <Picker.Item label="Giáo dục" value="giáo dục" />
        </Picker>
      </View>
   
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số tiền</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={totalBudget}
          onChangeText={handleBudgetChange}
          placeholder="Nhập ngân sách"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Chọn khoảng thời gian</Text>
        <Picker
          selectedValue={timeFrame}
          onValueChange={(itemValue) => setTimeFrame(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Tuần này" value="week" />
          <Picker.Item label="Tháng này" value="month" />
          <Picker.Item label="Quý này" value="quarter" />
          <Picker.Item label="Năm này" value="year" />
        </Picker>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Thời gian: {getDateRange().startDate} - {getDateRange().endDate}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateBudget}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5063BF'
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    backgroundColor: '#FFF',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#5063BF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Budget;
