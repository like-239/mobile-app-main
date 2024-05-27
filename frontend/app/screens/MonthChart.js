import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import TransactionDetails from './TransactionDetails';
const MonthChart = ({ transactions }) => {
  const navigation = useNavigation();
  const [chartData, setChartData] = useState([]);
  const [totalCost,setTotalCost]=useState([]);
 {<TransactionDetails transactions={transactions}/>}
  // Helper function to format numbers with commas
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Effect to process transaction data into chart-friendly format
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const categories = {};
      const totalAmounts = {};
      let totalCost = 0;

      transactions.forEach((transaction) => {
        const category = transaction.category;
        const cost = transaction.cost;
        if (categories[category]) {
          categories[category]++;
          totalAmounts[category] += cost;
        } else {
          categories[category] = 1;
          totalAmounts[category] = cost;
        }
        totalCost += cost;
      });

      const totalCount = transactions.length;
      const newChartData = Object.keys(categories).map((category, index) => {
        const percentage = ((categories[category] / totalCount) * 100).toFixed(2);
        return {
          key: category,
          value: categories[category],
          percentage: percentage + '%',
          totalAmount: totalAmounts[category],
          svg: { fill: getRandomColor() },
        };
      });
      setTotalCost(totalCost);
      setChartData(newChartData);
    }
  }, [transactions]);

  // Function to generate random colors for chart segments
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Render function for legend items
  const renderLegend = () => {
    return chartData.map((item, index) => (
      <TouchableOpacity 
        key={index}
        style={styles.inputWrapper}
        onPress={() => navigation.navigate('TransactionDetails', { transactions: transactions.filter(transaction => transaction.category === item.key) })}
      >
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.svg.fill, marginRight: 5 }} />
        <Text style={styles.itemText}>
          {`${item.key} (${item.percentage}) - Tổng $${formatNumberWithCommas(item.totalAmount)}đ`}
        </Text>
      </TouchableOpacity>
    ));
  };
  const formatCurrency = (amount) => {
    // Chuyển số tiền thành triệu đồng
    let millionVND = amount / 1000000;
  
    // Định dạng số để có một chữ số thập phân nếu cần
    millionVND = millionVND.toFixed(millionVND % 1 !== 0 ? 1 : 0);
  
    return `${millionVND}tr đ`;
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
  {chartData.length > 0 ? (
    <>
      <PieChart
        style={{ height: 200, width: '100%' }}
        data={chartData}
        innerRadius={'40%'}
        outerRadius={'80%'}
      />
      <View style={styles.centeredText}>
        <Text style={styles.totalCostText}>{formatCurrency(totalCost)}</Text>
      </View>
    </>
  ) : (
    <Text>Chưa có giao dịch nào</Text>
  )}
</View>


      <ScrollView contentContainerStyle={styles.legendContainer}>
        {renderLegend()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    padding: 20,  // Added padding around the legends
  },
  inputWrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#808080',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFF0',
    width: '100%',
  },
  centeredText: {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: [{ translateX: -50 }, { translateY: -10 }],  // Adjust these values based on your layout
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  
  totalCostText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemText:{
    fontFamily: 'regular',
    fontSize: 13.5,
    flex:1,
    color: '#000000',
    //fontWeight: 'bold',
  }
});

export default MonthChart;
