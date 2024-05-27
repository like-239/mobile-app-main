import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
const TransactionDetails = ({ route }) => {
  const { transactions } = route.params;
  const [containerHeight, setContainerHeight] = useState(0);
  const window = useWindowDimensions();
   const navigation = useNavigation();

  useEffect(() => {
    setContainerHeight(window.height / 8);
  }, [window.height]);

  // Calculate the total cost of all transactions
  const totalCost = transactions.reduce((acc, transaction) => acc + transaction.cost, 0);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.time && typeof transaction.time === 'string' ? transaction.time.split('T')[0] : 'Unknown Date';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  const category = transactions.length > 0 ? transactions[0].category : '';
  return (
    <View style={styles.container}>
      <View style={[styles.TopContainer, { height: containerHeight }]}>
        <View style={styles.titleContainer}>
       
          <Image source={require('../constants/image/arrow.png')} style={styles.backBTN} />
         
          
          <Text style={styles.title}>{category}</Text>
          
        </View>
        
        <Text style={styles.totalCost}>Tổng: {totalCost}</Text>
      </View>
     
      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <View key={date}>
          <Text style={styles.date}>{moment(date).format("D MMMM, YYYY")}</Text>
          {transactions.map((transaction, index) => (
            <View key={index} style={styles.inputWrapper}>
              <Text style={styles.detailText}>{transaction.category} - {transaction.cost} - {transaction.note}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  TopContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#5063BF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: '100%',
    alignItems:'center',
    resizeMode: "cover"
  },
  title: {
    fontWeight: 'bold',
    fontSize: 21,
    color: '#FFFF',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft:70
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  backBTN: {
    width: 30,
    height: 30,
  marginLeft:-120,
    marginTop: 15
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
  inputWrapper: {
    borderColor: '#000000',
    backgroundColor: '#FFFFF0',
    borderWidth: 1,
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  detailText: {
    color: '#000000',
    fontWeight: 'bold'
  },
  totalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFF',
    //padding: 10,

  },
});

export default TransactionDetails;
