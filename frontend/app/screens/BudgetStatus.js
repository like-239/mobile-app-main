import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,Alert } from 'react-native';
import API from '../services/GlobalAPI';

const BudgetStatus = ({ route }) => {
  const { initialBudget, spentAmount } = route.params || {};
  const [remainingAmount, setRemainingAmount] = useState(initialBudget - spentAmount);
  const [daysUntilEndOfMonth, setDaysUntilEndOfMonth] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const navigation = useNavigation();
  const [latestTransaction, setLatestTransaction] = useState(null);
  const transactionProcessed = useRef(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const window = useWindowDimensions();

  const categoryIcons = {
    'ăn uống': require('../constants/image/eating.png'),
    'giải trí': require('../constants/image/entertainment.png'),
    'sức khỏe': require('../constants/image/health.png
    'giáo dục': require('../constants/image/education.png'),
    'gia đình': require('../constants/image/family.png')
  };

  const getUserTotalBalance = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      const token = await AsyncStorage.getItem('token');

      if (!id || !token) {
        console.error('Missing id or token');
        return;
      }

      const response = await API.requestGet_BudgetDetail(`/budget?token=${token}`);

      if (response && Array.isArray(response)) {
        const userBudgets = response.filter(budget => budget.userId === id);
        setBudgets(userBudgets);
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setContainerHeight(window.height / 8);
  }, [window.height]);

  useEffect(() => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setDaysUntilEndOfMonth((endOfMonth - today) / (1000 * 3600 * 24));
  }, []);

  useEffect(() => {
    if (initialBudget && spentAmount) {
      setRemainingAmount(initialBudget - spentAmount);
    }
  }, [initialBudget, spentAmount]);

  const progress = initialBudget ? spentAmount / initialBudget : 0;

  const handleCreateBudget = () => {
    navigation.navigate('Budget');
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const transaction = await AsyncStorage.getItem('latestTransaction');
        const fetchedTransaction = JSON.parse(transaction);
        if (!latestTransaction || fetchedTransaction.cost !== latestTransaction.cost) {
          const latestTransaction = JSON.parse(transaction);
          setLatestTransaction(latestTransaction);
          const token = await AsyncStorage.getItem('token');
          
          if (latestTransaction !== null && !transactionProcessed.current) {
            for (const budget of budgets) {
              const transactionDate = new Date(latestTransaction.time);
              if (
                budget.category === latestTransaction.category &&
                new Date(budget.startDate) <= transactionDate &&
                new Date(budget.endDate) >= transactionDate
              ) {
                const updatedCost = budget.cost - latestTransaction.cost;
                const budgetUpdateData = {
                  cost: updatedCost,
                  category: budget.category,
                  id: budget._id,
                  startDate: budget.startDate,
                  endDate: budget.endDate,
                  userId: budget.userId
                };
                console.log('budgetUpdateData', budgetUpdateData);
                try {
                  const response = await API.requestSignup(`/budget/update?id=${budget._id}&token=${token}`, budgetUpdateData);
                  if (response.success) {
                    setBudgets(prevBudgets =>
                      prevBudgets.map(b => (b._id === budget._id ? { ...b, cost: updatedCost } : b))
                    );
                  } else {
                    console.error('Failed to update budget');
                  }
                } catch (error) {
                  console.error('Error updating budget:', error);
                }
                transactionProcessed.current = true;
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    };

    fetchTransaction();
  }, [budgets]);

  useFocusEffect(
    useCallback(() => {
      getUserTotalBalance();
    }, [])
  );
  const handleDeleteBudget = async (budgetId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await API.requestDelete_Budget(`/budget/delete?token=${token}&id=${budgetId}`);
      if (response.success) {
        setBudgets(prevBudgets => prevBudgets.filter(b => b._id !== budgetId));
      } else {
        console.error('Failed to delete budget');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const confirmDelete = (budgetId) => {
    Alert.alert(
      "Xóa Ngân sách",
      "Bạn có chắc chắn muốn xóa ngân sách này không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: () => handleDeleteBudget(budgetId),
          style: "destructive"
        }
      ]
    );
  };
  if (budgets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.label}>Bạn chưa tạo ngân sách nào</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateBudget}>
          <Text style={styles.buttonText}>Tạo Ngân sách</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.Container}>
      <View style={[styles.TopContainer, { height: containerHeight }]}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#5063BF'}}>
            <Image source={require('../constants/image/arrow.png')} style={styles.backBTN} />
          </TouchableOpacity>
          <Text style={styles.title}> Ngân sách</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Ngân sách Đang áp dụng</Text>

        {budgets.map((budget) => (
          <TouchableOpacity
            key={budget._id}
            style={styles.wrapper}
            onPress={() =>
              navigation.navigate('BudgetDetails', {
                category: budget.category,
                startDate: budget.startDate,
                endDate: budget.endDate,
                cost: budget.cost,
              })
            }
          >
            <Text style={styles.label}>{new Date(budget.startDate).toLocaleDateString('vi-VN')} đến {new Date(budget.endDate).toLocaleDateString('vi-VN')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconview}>
                <Image
                  source={categoryIcons[budget.category] || require('../constants/image/Group91.png')}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.budgetText}> Danh mục: {budget.category},</Text>
              
              
              <Text style={styles.budgetText}>Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(budget.cost)}</Text>
              <TouchableOpacity onPress={() => confirmDelete(budget._id)}>
                <Image
                  source={require('../constants/image/delete.png')} 
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleCreateBudget} style={styles.addIconContainer}>
          <Image source={require('../constants/image/add.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  TopContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#5063BF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: '100%',
    resizeMode: "cover"
  },
  title: {
    fontWeight: 'bold',
    fontSize: 21,
    color: '#FFFF',
    justifyContent: 'center',
    marginTop: 10,
    textAlign: 'center',
    flex: 1,
    marginLeft: -50
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backBTN: {
    width: 30,
    height: 30,
    marginLeft: -5,
    marginTop: 15
  },
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'regular',
    fontSize: 15,
    marginBottom: 5,
    marginEnd: 5,
    color: '#000000',
    fontWeight: 'bold',
  },
  inputWrapper: {
    borderColor: '#000000',
    backgroundColor: '#FAFAFC',
    borderWidth: 1,
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 35,
    height: 35,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  deleteIcon:{
    width: 25,
    height: 25,
    paddingHorizontal: 10,
    marginHorizontal: 10
  },
  iconview: {
    flexDirection: 'row'
  },
  budgetText: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 1,
    //flex: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 20,
    marginBottom: 10,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    color: 'green',
  },
  days: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#5063BF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  transactionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noTransaction: {
    fontSize: 18,
    color: '#000000',
  },
  addIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  addIconContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default BudgetStatus;
