import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import API from '../services/GlobalAPI';
import ProgressBar from './ProgressBar'; // Ensure the path is correct

const BudgetDetails = ({ route }) => {
    const { category, startDate, endDate, cost } = route.params;
    const [spentAmount, setSpentAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(cost);
    const [daysUntilEndOfMonth, setDaysUntilEndOfMonth] = useState(0);
    //const window = useWindowDimensions();
    const [containerHeight, setContainerHeight] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        setContainerHeight(window.height / 2);
    }, [window.height]);

    useEffect(() => {
        setRemainingAmount(cost);
        const today = new Date();
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDaysUntilEndOfMonth((endOfMonth - today) / (1000 * 3600 * 24));

        const getTransaction = async (startDate, endDate, category) => {
            try {
                const loginData = {
                    username: 'admin123',
                    password: '123456',
                };
        
                // Đăng nhập và lấy token
                const authResponse = await API.requestPOST_Login('/auth/login', loginData);
                const token = authResponse.token;
        
                // Lấy tất cả giao dịch
                const response = await API.requestGET_AllTRANSACTIONS(`/transactions?token=${token}`);
                
                if (response) {
                    const Transactions = response.filter(transaction => {
                        const transactionDate = moment(transaction.time);
                        return transaction.transaction_type === 'chi phí' &&
                            transactionDate.isBetween(startDate, endDate, undefined, '[]') &&
                            transaction.category === category;
                    });
                    
                    const spent = Transactions.reduce((sum, transaction) => sum + transaction.cost, 0); // Assuming transactions have 'amount' field
                    setSpentAmount(spent);
                    setRemainingAmount(cost - spent);
                    setTransactions(Transactions);
                    console.log('transactions detail in budgets', Transactions);
                } else {
                    console.log('Get failed:', response.status);
                }
            } catch (error) {
                console.error('Error during fetching transactions:', error);
            }
        };

        getTransaction(startDate, endDate, category);
    }, [cost, startDate, endDate, category]);

    const progress = cost ? (cost - remainingAmount) / cost : 0;

    const handleCreateBudget = () => {
        navigation.navigate('Budget'); // Name of the budget screen to navigate to
    };

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = transaction.time && typeof transaction.time === 'string' ? transaction.time.split('T')[0] : 'Unknown Date';
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                
            <Image
         source={require('../constants/image/back(2).png')} 
         style={styles.backBTN}
        />
                <Text style={styles.title}>Chi tiết Ngân sách</Text>
            </View>
            <View style={styles.categoryView}>
                <Text style={styles.label}>Danh mục: {category}</Text>
            </View>
            <View style={styles.budgetContainer}>
                <View style={styles.detailView}>
                    <Text style={styles.cost}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cost)}</Text>
                    <Text style={styles.startDate}>{new Date(startDate).toLocaleDateString('vi-VN')} đến {new Date(endDate).toLocaleDateString('vi-VN')}</Text>
                </View>
                <Text style={styles.days}>{daysUntilEndOfMonth.toFixed(0)} ngày đến cuối tháng</Text>
                <View style={styles.amountsContainer}>
                    <Text style={styles.amount}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remainingAmount)} còn lại</Text>
                    <Text style={styles.amount}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(spentAmount)} đã chi</Text>
                </View>
                <ProgressBar progress={progress} />
                {/*
                <TouchableOpacity style={styles.button} onPress={handleCreateBudget}>
                    <Text style={styles.buttonText}>Xem các giao dịch</Text>
                </TouchableOpacity>
                */
}
            </View>

            <ScrollView contentContainerStyle={styles.transactionDetailContainer}>
                {transactions.length > 0 ? (
                    Object.entries(groupedTransactions).map(([date, transactions]) => (
                        <View style={styles.wrapper}key={date}>
                            <Text style={styles.date}>{moment(date).format("D MMMM, YYYY")}</Text>
                            {transactions.map((transaction, index) => (
                          
                                <View key={index} style={styles.inputWrapper}>
                                    <Text style={styles.detailText}>{transaction.category} - {transaction.cost} VND - {transaction.note}</Text>
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noTransaction}>Không có giao dịch</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5063BF',
        marginBottom: 5,
        paddingTop: 20,
        marginLeft:-10
    },
    titleContainer: {
        alignItems: 'center',
        paddingTop: 20,
        flexDirection:'row'
    },
    subtitle: {
        fontSize: 18,
        color: '#FFF',
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
        color: '#000000',
        marginBottom: 10,
    },
    startDate: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#5063BF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    budgetContainer: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingTop: 20,
    },
    label: {
        fontFamily: 'bold',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000000',
        marginBottom: 5,
    },
    noTransaction: {
        fontSize: 18,
        color: '#000000',
    },
    detailView: {
        borderRadius: 10,
        backgroundColor: '#8EDFEB',
        height: 100,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cost: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    categoryView: {
        alignItems: 'flex-start',
        paddingTop: 20,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        paddingTop: 10,
        paddingBottom: 5,
    },
    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        width: '90%',
        alignItems:'center',
        fontWeight:'bold'
    },
    transactionDetailContainer:{
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        justifyContent: 'center',
        //alignItems: 'center',
    
        paddingTop: 20,
    },
    inputWrapper: {
        borderColor: '#000000',
        backgroundColor: '#C6E2FF',
        borderWidth: 1,
        height: 55,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop:10,

      },
      wrapper: {
        marginBottom: 20,
      },
      detailText:{
        color:'#000000',
        fontWeight:'bold'
      },
      backBTN:{
        width:40,
        height:40,
        //paddingTop:25,
        marginTop:18,
        marginLeft:10,
        marginRight:80
      },
});

export default BudgetDetails;
