import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';
import React, { useEffect, useState, } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { showMessage } from "react-native-flash-message";
import API from '../services/GlobalAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddTransaction=({route})=>{
    const navigation = useNavigation();
    const [containerHeight, setContainerHeight] = useState(0);
    const window = useWindowDimensions();
    const [cost, setCost] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [time, setTime] = useState('');
    const [transaction_type, setTransaction_type] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [yesterdayDate, setYesterdayDate] = useState('');
    const [tomorrowDate, setTomorrowDate] = useState('');
    const [token, setToken] = useState(''); 
    const [weekDates, setWeekDates] = useState([]);
    const [userId, setUserId] = useState('');
    const saveTransaction = async (transaction) => {
      try {
          await AsyncStorage.setItem('latestTransaction', JSON.stringify(transaction));
      } catch (error) {
          console.error('Error saving transaction:', error);
      }
  };
    const handleAddTransaction = async () => {
      const amount = parseInt(cost); // Giả định là cost là string, cần chuyển về số
    
      // Gọi hàm tạo giao dịch trước
      const transactionSuccess = await handleCreateTransaction(); // Giả định handleCreateTransaction trả về Promise<boolean>
    
      if (transactionSuccess) {
        console.log('amount',amount)
        console.log(transaction_type)
        if (transaction_type === 'chi phí') {
          await saveTransaction({
              cost: amount,
              category,
              note,
              time,
              transaction_type
          });
          console.log('save transaction',saveTransaction);
      }
        // Cập nhật số dư chỉ khi giao dịch tạo thành công
        route.params.updateTotalBalance
        (amount, transaction_type);
    
        // Sau đó mới quay lại màn hình trước
        navigation.goBack();
      }
    };
    
    const handleCreateTransaction = async () => {
      try {
        const loginData = {
          username: 'admin123',
          password: '123456',
        };
    
        const transactionData = {
          cost,
          category,
          note,
          time,
          transaction_type,
          userId
        };
    
        const authResponse = await API.requestPOST_Login('/auth/login', loginData);
        setToken(authResponse.token);
        const amount = parseInt(cost);
    
        const response = await API.requestPost_Transaction(`/transactions/create?token=${authResponse.token}`, transactionData);
    
        if (response.success) {
          if (response.transaction.transaction_type == 'chi phí') {
            await AsyncStorage.setItem('transactionCost', JSON.stringify(response.transaction.cost));
            await AsyncStorage.setItem('transactionCategory', response.transaction.category);
            await AsyncStorage.setItem('transactionTime', response.transaction.time);
            await saveTransaction({
              cost: amount,
              category,
              note,
              time,
              transaction_type,
              userId
            });
            console.log('save transaction', saveTransaction);
          }
    
          console.log('Create successful:', response.message);
          console.log('Transaction details:', response.transaction.category);
          showMessage({
            message: 'Tạo thành công',
            type: 'success',
          });
    
          // Cập nhật số dư chỉ khi giao dịch tạo thành công
          route.params.updateTotalBalance(amount, transaction_type);
          
          // Quay lại màn hình trước
          navigation.goBack();
        } else {
          console.log('Create failed:', response.status);
        }
      } catch (error) {
        console.error('Error :', error);
      }
    };
    
    const handleCategorySelection = (selectedCategory) => {
      setCategory(selectedCategory); 
  
    };
    const handleExpenseTabPress = () => {
      setTransaction_type('chi phí');
    };
  
    const handleIncomeTabPress = () => {
      setTransaction_type('thu nhập'); 
    };
    useEffect(() => {
      
      const today = Moment().format('DD/MM');
      setCurrentDate(today);
      
      const yesterday = Moment().subtract(1, 'days').format('DD/MM');
      setYesterdayDate(yesterday);
  
  
      const tomorrow = Moment().add(1, 'days').format('DD/MM');
      setTomorrowDate(tomorrow);
    }, []);
    const handleTodayPress = () => {
      const today = Moment().format('YYYY-MM-DD');
      setTime(today);
    };
    
    const handleYesterdayPress = () => {
      const yesterday = Moment().subtract(1, 'days').format('YYYY-MM-DD');
      setTime(yesterday);
    };
    
    const handleTomorrowPress = () => {
      const tomorrow = Moment().add(1, 'days').format('YYYY-MM-DD');
      setTime(tomorrow);
    };
    
    useEffect(() => {
        setContainerHeight(window.height / 6);
    }, [window.height]);
    
      const [selectedTab, setSelectedTab] = useState('chiPhi'); 
    
      const handleTabPress = (tab) => {
        setSelectedTab(tab);
      };
      const getStartOfWeek = (date) => {
        return Moment(date).startOf('week');
    };

    // Hàm để tính toán các ngày trong tuần
    const calculateWeekDates = (startDate) => {
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            weekDates.push(Moment(startDate).add(i, 'days'));
        }
        return weekDates;
    };

    useEffect(() => {
        // Lấy ngày hiện tại
        const today = Moment();
        setCurrentDate(today.format('DD/MM'));

        // Lấy ngày hôm qua
        const yesterday = Moment().subtract(1, 'days');
        setYesterdayDate(yesterday.format('DD/MM'));

        // Lấy ngày bắt đầu của tuần và tính toán các ngày cùng tuần
        const startOfWeek = getStartOfWeek(today);
        const weekDates = calculateWeekDates(startOfWeek);

        // Lưu các ngày cùng tuần vào state
        setWeekDates(weekDates);
    }, []);
    
    useEffect(() => {
      const fetchUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('id');
        setUserId(storedUserId);
      };
      fetchUserId();
    }, []);
    
  const formatNumberWithCommas = (number) => {
    if (!number) return ''; // Trả về chuỗi rỗng nếu number là undefined, null, hoặc rỗng
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

    return(
        <View style={styles.Container}>
            <View style={[styles.TopContainer, { height: containerHeight }]}>
            <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#5063BF'}}>
  <Image source={require('../constants/image/arrow.png')} style={styles.backBTN} />
</TouchableOpacity>
        
            <Text style={styles.title}> Thêm giao dịch</Text>
            </View>

                <View style={styles.coverTransactionText}>
                  <TouchableOpacity
                   style={[styles.tab, selectedTab === 'chiPhi' && styles.selectedTab]}
                   onPress={() => {handleTabPress('chiPhi')
                   handleExpenseTabPress();
                  }}>
<Text style={styles.transactionText}>CHI PHÍ </Text>
                  </TouchableOpacity>
            <TouchableOpacity  
             style={[styles.tab, selectedTab === 'thuNhap' && styles.selectedTab]}
          onPress={() => {
            handleTabPress('thuNhap')
            handleIncomeTabPress();
          }}>
 <Text style={styles.transactionText}> THU NHẬP</Text>
            </TouchableOpacity>           
            </View>


         
           
 {selectedTab === 'chiPhi' ? (
        <View style={styles.chiPhiScreen}>
         
          <View style={styles.moneyContainer}>
            <Text style={styles.unit}>VND</Text>
            <TextInput
    style={styles.moneyInput}
    onChangeText={(text) => {
        const formattedText = text.replace(/\D/g,''); // Xóa bất kỳ ký tự không phải số
        setCost(formattedText);
    }}
    value={formatNumberWithCommas(cost)}
/>

            </View>

          <Text style={styles.category}>Danh mục:</Text>
            <View style={styles.categoryIconTopContainer}>

            <TouchableOpacity style={styles.categoryIconWithText}
             onPress={() => handleCategorySelection('sức khỏe')}
            >
              
        <Image
            source={require('../constants/image/health.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Sức khỏe</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.categoryIconWithText}
    onPress={() => handleCategorySelection('ăn uống')}
    >
        <Image
            source={require('../constants/image/eating.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Ăn uống</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.categoryIconWithText}
    onPress={() => handleCategorySelection('giáo dục')}
    >
        <Image
            source={require('../constants/image/education.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Giáo dục</Text>
    </TouchableOpacity>
        </View>

        <View style={styles.categoryIconBottomContainer}>
        <TouchableOpacity style={styles.categoryIconWithText}
        onPress={() => handleCategorySelection('giải trí')}
        >
        <Image
            source={require('../constants/image/entertainment.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Giải trí</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.categoryIconWithText}
    onPress={() => handleCategorySelection('gia đình')}
    >
        <Image
            source={require('../constants/image/family.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Gia đình</Text>
    </TouchableOpacity>

    <Image
    source={require('../constants/image/add.png')} 
    
    style={styles.addIcon}
  />
        </View>

            <TouchableOpacity style={styles.calendarContainer}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.dateText}>Hôm nay:</Text><Text style={styles.dateText}> {currentDate}</Text>
      </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.dateText}>Hôm qua:</Text><Text style={styles.dateText}> {yesterdayDate}</Text>
      </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.dateText}>Ngày mai:</Text><Text style={styles.dateText}> {tomorrowDate}</Text>
      </TouchableOpacity>
      </View>
  </View>
  <Image
    source={require('../constants/image/calendar.png')}
    style={styles.calendar}
  />
</TouchableOpacity>



            <Text style={styles.note}>Ghi chú:</Text>
     <TextInput style={styles.menuItem} 
     onChangeText={(text) => setNote(text)}
     value={note}
    /> 
    <Pressable
               onPress={() => {
                handleCreateTransaction();  
              
              }}
              style={{
                backgroundColor: '#5063BF',
                borderRadius: 10,
                padding: 15,
                marginTop:15,
                marginLeft:50,
                marginRight:50
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
               THÊM
              </Text>
            </Pressable>{/*
            {weekDates.map((date, index) => (
                <Text key={index}>{date.format('DD/MM')}</Text>
            ))}
          */}
        </View>
      ) : (
        <View style={styles.thuNhapScreen}>
          {/* Giao diện cho thu nhập */}
          <View style={styles.moneyContainer}>
            <Text style={styles.unit}>VND</Text>
            <TextInput style={styles.moneyInput}
      
        onChangeText={(text) => {
            const formattedText = text.replace(/\D/g,''); // Xóa bất kỳ ký tự không phải số
            setCost(formattedText);
        }}
        value={formatNumberWithCommas(cost)}
            ></TextInput>
            </View>

          <Text style={styles.category}>Danh mục:</Text>
            <View style={styles.categoryIconTopContainer}>
           
    <TouchableOpacity style={styles.categoryIconWithText}
     onPress={() => handleCategorySelection('lương')}
    >
  <Image
            source={require('../constants/image/salary.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Lương</Text>
    </TouchableOpacity>
      
    <TouchableOpacity
   tyle={styles.categoryIconWithText}
   onPress={() => handleCategorySelection('việc làm thêm')}
   >
  <Image
            source={require('../constants/image/side-job.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Việc làm thêm</Text>
    </TouchableOpacity>

    <TouchableOpacity
     tyle={styles.categoryIconWithText}
     onPress={() => handleCategorySelection('Đầu tư')}
    >
      <Image
            source={require('../constants/image/investment.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Đầu tư</Text>
    </TouchableOpacity>
        
        </View>

        <View style={styles.categoryIconBottomContainer}>
          <TouchableOpacity
            style={styles.categoryIconWithText}
            onPress={() => handleCategorySelection('Học bổng')}
          >
      <Image
            source={require('../constants/image/scholarship.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Học bổng</Text>
          </TouchableOpacity>
       
       <TouchableOpacity
        style={styles.categoryIconWithText}
        onPress={() => handleCategorySelection('Quà tặng')}
       >
  <Image
            source={require('../constants/image/gift.png')} 
            style={styles.categoryIcon}
        />
        <Text style={styles.categoryText}>Quà tặng</Text>
       </TouchableOpacity>
   

    <Image
    source={require('../constants/image/add.png')} 
    style={styles.addIcon}
  />

            </View>
  <TouchableOpacity style={styles.calendarContainer}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.dateText}>Hôm nay:</Text><Text style={styles.dateText}> {currentDate}</Text>
      </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.dateText}>Hôm qua:</Text><Text style={styles.dateText}> {yesterdayDate}</Text>
      </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.dateText}>Ngày mai:</Text><Text style={styles.dateText}> {tomorrowDate}</Text>
      </TouchableOpacity>
      </View>
  </View>
  <Image
    source={require('../constants/image/calendar.png')}
    style={styles.calendar}
  />
</TouchableOpacity>

        
<Text style={styles.note}>Ghi chú:</Text>
     <TextInput style={styles.menuItem} 
     onChangeText={(text) => setNote(text)}
     value={note}
    /> 
     
    <Pressable
               onPress={() => {
                handleCreateTransaction();  
              }}
              style={{
                backgroundColor: '#5063BF',
                borderRadius: 10,
                padding: 15,
                marginTop:10,
                marginLeft:50,
                marginRight:50
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
               THÊM
              </Text>
            </Pressable>
        </View>
      )}
     
            </View>
           
        </View>
    );
}
const styles = StyleSheet.create({
    Container:{
      backgroundColor:'#FFFFFF',
      flex: 1,
    },
    TopContainer: {
        paddingHorizontal: 20, 
        backgroundColor: "#5163BF", 
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20,
        width: '100%',
    resizeMode:"cover"
      },
      transactionText:{
        fontWeight:'bold',
        fontFamily: 'Arial',
    fontSize:20,
    color:'#FFFF',
        //marginLeft:10,
        paddingLeft:30,
        paddingRight:30
      },
      coverTransactionText:{
        
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
      },
      unit:{
        fontWeight:'bold',
        fontFamily: 'Arial',
    fontSize:20,
    color:'#5163BF',
    marginTop:10,
    
    color:'#5163BF',
    justifyContent:'center',
     alignContent:'center',
      },
      moneyInput:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
      borderBottomWidth: 1,
      borderColor: '#808080',
      marginTop: -5,
      marginLeft:10,
      //marginHorizontal: 10, 
      fontWeight:'bold',
      fontFamily: 'Arial',
  fontSize:20,
    color:'#1E1E1E'
      },
      moneyContainer:{
        flexDirection:'row',
        marginTop: 10,
        //alignItems: 'center',
        justifyContent: 'center', 
      },

      title:{
            fontWeight: 'bold',
            fontSize:21,
            color:'#FFFF',
           justifyContent:'center',
            marginTop:10,
            textAlign:'center',
            flex: 1,
            marginLeft:-50 
      },
      titleContainer:{
        flexDirection: 'row', 
        justifyContent: 'center', 
        //paddingHorizontal: 20, 
        marginTop: 10, 
        alignItems:'center',
        paddingHorizontal: 10, 
      },
      backBTN:{
        width:30,
        height:30,
        marginLeft:-5,
        marginTop:15
      },
      
      category:{
        fontWeight: 'bold',
        fontSize:20,
        color:'#000000',
       paddingTop:20
      },
      categoryIcon:{
        width:65,
        height:65,
        paddingHorizontal:20,
        marginHorizontal:30
      },
      categoryIconTopContainer:{
        flexDirection:'row',
        //paddingHorizontal:40,
        paddingTop:30,
        marginLeft:10,
        marginRight:10
      },
      categoryIconBottomContainer:{
        flexDirection:'row',
        paddingTop:30,
        marginLeft:10,
        marginRight:10
      },
      categoryIconWithText: {
        alignItems: 'center',
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5,
        textAlign: 'center',
        color: '#000000',
    },
    note:{
      marginLeft: 10, 
      marginTop:50,
      fontSize:20,
      fontWeight:'bold',
      color:'#000000'
    },
    menuItem:{
      flexDirection:'row',
      borderColor:'#808080',
      borderBottomWidth:1,
      marginTop:15,     
      marginBottom:10,
      fontWeight:'bold',
      fontFamily: 'Arial',
  fontSize:20,
    color:'#000000'
    },
    addIcon:{
      width: 65,
      height: 65,
      paddingHorizontal:20,
      marginHorizontal:30
     
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#fff',
      marginBottom: 10,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    selectedTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#fff',
    },
    tabText: {
      fontSize: 16,
    },
    chiPhiScreen: {
   
      backgroundColor: '#ffff', 
    },
    thuNhapScreen: {
      backgroundColor: '#ffff', 
    },
    calendar:{
      width: 50,
  height: 50,
  marginLeft: 10,
    },
    calendarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15,
    },
    dateText: {
      fontSize: 16,
      marginTop: 5,
      color: '#000000',
      marginLeft: 10,
       
    },
    dateTextContainer: {
      flexDirection: 'column', // Hiển thị các chú thích theo chiều dọc
    },
})
export default AddTransaction;
