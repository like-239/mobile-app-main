import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState,useEffect } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API from '../services/GlobalAPI';
import MonthChart from './MonthChart';
import BalanceUpdateModal from './BalanceUpdateModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('chiPhi');
  const [selectedTimeframe, setSelectedTimeframe] = useState('ngay');
  const [token, setToken] = useState('');
  const Moment = require('moment');
  const [monthTransactions,setMonthTransactions]=useState([]);
  const [showMonthChart,setShowMonthChart] = useState(false);
  const [showWeekChart, setShowWeekChart] = useState(false);
  const [showQuaterChart,setShowQuaterChart]=useState(false);
  const [showDayChart,setShowDayChart]=useState(false);
  const [totalBalanceCount, setTotalBalanceCount] = useState(20000000);
const [weekTransactions, setWeekTransactions] = useState([]);
const [quarterTransactions, setQuarterTransactions] = useState([]);
const [dayTransactions, setDayTransactions] = useState([]);
const [isModalVisible, setModalVisible] = useState(false);
const [newTotalBalance, setNewTotalBalance] = useState('');
const [username, setUsername] = useState('');
const [userEmail, setUserEmail] = useState('');
const [password, setPassword] = useState('');
const [userId, setUserId] = useState('');
const [userDataChanged, setUserDataChanged] = useState(false);

useEffect(() => {
  const getUserTotalBalance = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('id');

      // Nếu userId đã thay đổi, lấy lại newTotalBalance
      if (storedUserId !== userId) {
        setUserId(storedUserId);
        const storedTotalBalance = await AsyncStorage.getItem('totalBalance');
        if (storedTotalBalance !== null) {
          setNewTotalBalance(parseInt(storedTotalBalance));
        } else {
          setNewTotalBalance(0);
          console.log('Không tìm thấy giá trị totalBalance trong AsyncStorage');
        }
      }

      // Lấy các thông tin user khác
      const storedUserEmail = await AsyncStorage.getItem('email');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedUserPassword = await AsyncStorage.getItem('password');
      const storedToken = await AsyncStorage.getItem('token');

      // Lấy thông tin user từ API
      const response = await API.requestGET_USER_DETAILS(`/users/details?id=${storedUserId}&token=${storedToken}`);
      console.log('lay user o Home', response.user.totalBalance);

      // Cập nhật state với các thông tin user mới
      setUserEmail(storedUserEmail);
      setUsername(storedUsername);
      setPassword(storedUserPassword);
      setToken(storedToken);
      setUserDataChanged(true);

      // Nếu newTotalBalance chưa được cập nhật từ AsyncStorage
      if (newTotalBalance === '') {
        if (response && response.user && response.user.totalBalance) {
          setNewTotalBalance(response.user.totalBalance);
          await AsyncStorage.setItem('totalBalance', response.user.totalBalance.toString());
        } else {
          setNewTotalBalance(0);
          console.log('Không tìm thấy giá trị totalBalance trong AsyncStorage hoặc từ API');
        }
      }
    } catch (error) {
      console.log('Error getting user totalBalance:', error);
    }
  };

  getUserTotalBalance();
}, [userId, newTotalBalance]); // Khi userId hoặc newTotalBalance thay đổi, hàm này sẽ được gọi lại

const handleTabPress = (tab) => {
  setSelectedTab(tab);
  // Gọi lại hàm lấy dữ liệu dựa trên tab mới
  switch (selectedTimeframe) {
    case 'ngay':
      // Ví dụ: handleGetDayTransactions();
      break;
    case 'tuan':
      handleGetWeekTransactions();
      break;
    case 'thang':
      handleGetMonthTransactions();
      break;
    case 'quy':
      handleGetQuarterTransactions();
      break;
  }
};
 
// Hàm này lọc và trả về các giao dịch dựa trên loại đã cho ('chiPhi' hoặc 'thuNhap')
const filterTransactionsByType = (transactions, type) => {
  return transactions.filter(transaction => 
    (type === 'chiPhi' && transaction.transaction_type === 'chi phí') ||
    (type === 'thuNhap' && transaction.transaction_type === 'thu nhập')
  );
};

  const handleTimeframePress = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setShowMonthChart(timeframe === 'thang');
    setShowWeekChart(timeframe === 'tuan');
    setShowQuaterChart(timeframe=='quy');
    setShowDayChart(timeframe==='ngay');
  };
  
  
  const handleGetDayTransactions = async () => {
    try {
      const loginData = {
        username: 'admin123',
        password: '123456',
      };
      const authResponse = await API.requestPOST_Login('/auth/login', loginData);
      setToken(authResponse.token);
  
      const startOfDay = moment().startOf('day');
      const endOfDay = moment().endOf('day');
  
      const response = await API.requestGET_AllTRANSACTIONS(`/transactions?token=${token}`);
      if (response) {
        const dayTransactions = response.filter(transaction => {
          const transactionDate = moment(transaction.time);
          return transaction.userId === userId && transactionDate.isBetween(startOfDay, endOfDay, undefined, '[]');
        });
  
        const filteredTransactions = filterTransactionsByType(dayTransactions, selectedTab);
        setDayTransactions(filteredTransactions);
        console.log('Day transactions:', filteredTransactions);
      } else {
        console.log('Get failed:', response.status);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  const handleGetWeekTransactions = async () => {
    try {
      const loginData = {
        username: 'admin123',
        password: '123456',
      };
      const authResponse = await API.requestPOST_Login('/auth/login', loginData);
      setToken(authResponse.token);
  
      const startOfWeek = moment().startOf('week');
      const endOfWeek = moment().endOf('week');
    
      const response = await API.requestGET_AllTRANSACTIONS(`/transactions?token=${authResponse.token}`);
      if (response) {
        const weekTransactions = response.filter(transaction => {
          const transactionDate = moment(transaction.time);
          return transaction.userId === userId && transactionDate.isBetween(startOfWeek, endOfWeek, undefined, '[]');
        });
        const filteredTransactions = filterTransactionsByType(weekTransactions, selectedTab);
        setWeekTransactions(filteredTransactions);
        
        console.log('weektransactions', weekTransactions);
      } else {
        console.log('Get failed:', response.status);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  
  const handleGetMonthTransactions = async () => {
    try {
      const loginData = {
        username: 'admin123',
        password: '123456',
      };
      const authResponse = await API.requestPOST_Login('/auth/login', loginData);
      setToken(authResponse.token);
  
      const startOfMonth = moment().startOf('month');
      const endOfMonth = moment().endOf('month');
    
      const response = await API.requestGET_AllTRANSACTIONS(`/transactions?token=${token}`);
      if (response) {
        const monthTransactions = response.filter(transaction => {
          const transactionDate = moment(transaction.time);
          return transaction.userId === userId && transactionDate.isBetween(startOfMonth, endOfMonth, undefined, '[]');
        });
  
        // Lọc giao dịch dựa trên tab hiện tại
        const filteredTransactions = filterTransactionsByType(monthTransactions, selectedTab);
        setMonthTransactions(filteredTransactions);
        //console.log('Filtered month transactions:', filteredTransactions);
      } else {
        console.log('Get failed:', response.status);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  
  const handleGetQuarterTransactions = async (quarter = moment().quarter()) => {
    try {
      const loginData = {
        username: 'admin123',
        password: '123456',
      };
      const authResponse = await API.requestPOST_Login('/auth/login', loginData);
      setToken(authResponse.token);
  
      // Xác định thời gian bắt đầu và kết thúc của quý được chọn
      const startOfQuarter = moment().quarter(quarter).startOf('quarter');
      const endOfQuarter = moment().quarter(quarter).endOf('quarter');
  
      const response = await API.requestGET_AllTRANSACTIONS(`/transactions?token=${authResponse.token}`);
      if (response) {
        // Lọc các giao dịch trong quý từ dữ liệu trả về
        const quarterTransactions = response.filter(transaction => {
          const transactionDate = moment(transaction.time);
          return transaction.userId === userId && transactionDate.isBetween(startOfQuarter, endOfQuarter, undefined, '[]');
        });
        const filteredTransactions = filterTransactionsByType(quarterTransactions, selectedTab);
        setQuarterTransactions(filteredTransactions);
        // Bạn cần thêm state cho quarterTransactions
        console.log('Quarter transactions:', quarterTransactions);
      } else {
        console.log('Get failed:', response.status);
      }
    } catch (error) {
      console.error('Error during data fetch:', error);
    }
  };
  

  const updateTotalBalance = async (amount, transactionType) => {
    let updatedBalance = newTotalBalance;
    if (transactionType === 'thu nhập') {
      updatedBalance += amount;
    } else if (transactionType === 'chi phí') {
      updatedBalance -= amount;
    }
    setNewTotalBalance(updatedBalance);
    console.log(newTotalBalance);
    // Save the new balance to AsyncStorage and database
    await AsyncStorage.setItem('totalBalance', updatedBalance.toString());
    await updateUser(updatedBalance);
  };

  const updateUser = async (updatedBalance) => {
    const updateData={
      username: username,
      password: password,
      email:userEmail,
      recentlyViewedProducts:[],
     id:userId,
      totalBalance:updatedBalance
    }
    const responesUpdate=await API.requestUPDATE_USER(`/users?token=${token}`,updateData)
    if (responseUpdate) {
      console.log('totalBalance sau khi update', responseUpdate.totalBalance);
      // Cập nhật lại state sau khi cập nhật thành công từ cơ sở dữ liệu
      setTotalBalanceCount(responseUpdate.totalBalance);
      setNewTotalBalance(responseUpdate.totalBalance);
    }
   else {
    alert('Please enter a valid number');
  }

    if(responesUpdate){
      console.log('totalBalance sau khi update',responesUpdate.totalBalance);
    }else{
      
    }
  }
  
  
  
  const handleUpdateTotalBalance = async(newBalance) => {
    setModalVisible(true);


    if (!isNaN(newBalance) && newBalance.trim() !== '') {
      setTotalBalanceCount(Number(newBalance));
      const updatedBalance = Number(newBalance);
      setNewTotalBalance(updatedBalance);
      setModalVisible(false);
        // Cập nhật vào AsyncStorage
        await AsyncStorage.setItem('totalBalance', updatedBalance.toString());
        const updateData = {
          username: username,
          password: password,
          email: userEmail,
          recentlyViewedProducts: [],
          id: userId,
          totalBalance: updatedBalance,
        };
        const responseUpdate = await API.requestUPDATE_USER(`/users?token=${token}`, updateData);
        if (responseUpdate) {
          console.log('totalBalance sau khi update', responseUpdate.totalBalance);
          // Cập nhật lại state sau khi cập nhật thành công từ cơ sở dữ liệu
          setTotalBalanceCount(responseUpdate.totalBalance);
          setNewTotalBalance(responseUpdate.totalBalance);
        }
    } else {
      alert('Please enter a valid number');
    }
  };
  const [isEditing, setIsEditing] = useState(false);

  const handleFocus = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    // Thêm logic lưu giá trị vào đây nếu cần
  };
  const handleChange = text => {
    // Bảo đảm chỉ nhận giá trị số
    if (/^\d*$/.test(text)) {
      setTotalBalanceCount(text);
    }
  };
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleOpenUpdateModal = () => {
    setModalVisible(true);
  };
  


  return (
    <View style={styles.Container}>
      <View style={styles.TopContainer}>
        <View style={styles.TopleftContainer}>
          <Image source={require('../constants/image/SideMenuIcon.png')} style={styles.icon} />
        </View>
        <Text style={styles.TotalBalance}>Tổng số dư</Text>
        
        <View style={styles.TopRightContainer}>
          <Image source={require('../constants/image/notice-1-512.png')} style={styles.noticeIcon} />
        </View>
      </View>

      <View style={styles.TotalCountContainer}>

  <BalanceUpdateModal
  isVisible={isModalVisible}
  onSubmit={handleUpdateTotalBalance}
  onCancel={() => setModalVisible(false)}
/>

<Text style={styles.TotalCountContainer}>
  <Text style={styles.TotalBalanceCount}>
  {formatNumberWithCommas(newTotalBalance || 0)}
  </Text>
  <Ionicons
    name={"pencil"}
    size={24}
    color={"gray"}
    onPress={handleOpenUpdateModal}
  />
</Text>

</View>

      <View style={styles.incomeContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'chiPhi' && styles.selectedTab]}
          onPress={() => {
            handleTabPress('chiPhi');
          }}>
          <Text style={styles.income}>CHI PHÍ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'thuNhap' && styles.selectedTab]}
          onPress={() => {
            handleTabPress('thuNhap');
          }}>
          <Text style={styles.income}>THU NHẬP</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'chiPhi' ? (
        <View style={styles.chiPhiScreen}>
          <View style={styles.TimeChoice}>
            <TouchableOpacity
              style={[styles.tab, selectedTimeframe === 'ngay' && styles.selectedTab]}
              onPress={() => {
                handleTimeframePress('ngay');
                handleGetDayTransactions();
                //setShowart(false);
                //setShowWeekChart(false);
              }}>
              <Text style={styles.income}>Ngày</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTimeframe === 'tuan' && styles.selectedTab]}
              onPress={() => {
                handleTimeframePress('tuan');
                //setShowMonthChart(false);
                handleGetWeekTransactions();
                setShowWeekChart(true);
              }}
              >
              <Text style={styles.income}>Tuần</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTimeframe === 'thang' && styles.selectedTab]}
              onPress={() => {
                handleTimeframePress('thang');
                handleGetMonthTransactions();
                //setShowWeekChart(false);
                setShowMonthChart(true);
              }}>
              <Text style={styles.income}>Tháng</Text>
            </TouchableOpacity>

            <TouchableOpacity
  style={[styles.tab, selectedTimeframe === 'quy' && styles.selectedTab]}
  onPress={() => {
    handleTimeframePress('quy');
    handleGetQuarterTransactions(); // Thêm tham số nếu cần để chỉ định quý
  
  }}>
  <Text style={styles.income}>Quý</Text>
</TouchableOpacity>

          </View>

          {showMonthChart && <MonthChart transactions={monthTransactions} />}
          {showDayChart && <MonthChart transactions={dayTransactions} />}

           { showWeekChart   && <MonthChart transactions={weekTransactions}/>}
          {showQuaterChart &&<MonthChart transactions={quarterTransactions}/>}
          <TouchableOpacity onPress={() => navigation.navigate('AddTransaction', { updateTotalBalance })} style={styles.addIconContainer}>
    <Image source={require('../constants/image/add.png')} style={styles.addIcon} />
          
  </TouchableOpacity>
 

        </View>
      ) :   selectedTab === 'thuNhap' && (      
        <View style={styles.chiPhiScreen}>
        <View style={styles.TimeChoice}>
          <TouchableOpacity
            style={[styles.tab, selectedTimeframe === 'ngay' && styles.selectedTab]}
            onPress={() => {
              handleTimeframePress('ngay');
              handleGetDayTransactions();
              //setShowMonthChart(false);
              //setShowWeekChart(false);
            }}>
            <Text style={styles.income}>Ngày</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTimeframe === 'tuan' && styles.selectedTab]}
            onPress={() => {
              handleTimeframePress('tuan');
              //setShowMonthChart(false);
              handleGetWeekTransactions();
              setShowWeekChart(true);
            }}
            >
            <Text style={styles.income}>Tuần</Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTimeframe === 'thang' && styles.selectedTab]}
            onPress={() => {
              handleTimeframePress('thang');
              handleGetMonthTransactions();
              //setShowWeekChart(false);
              setShowMonthChart(true);
            }}>
            <Text style={styles.income}>Tháng</Text>
          </TouchableOpacity>

          <TouchableOpacity
style={[styles.tab, selectedTimeframe === 'quy' && styles.selectedTab]}
onPress={() => {
  handleTimeframePress('quy');
  handleGetQuarterTransactions(); // Thêm tham số nếu cần để chỉ định quý

}}>
<Text style={styles.income}>Quý</Text>
</TouchableOpacity>

        </View>

        {showMonthChart && <MonthChart transactions={monthTransactions} />}
        {showDayChart && <MonthChart transactions={dayTransactions} />}

         { showWeekChart   && <MonthChart transactions={weekTransactions}/>}
        {showQuaterChart &&<MonthChart transactions={quarterTransactions}/>}
        <TouchableOpacity onPress={() => navigation.navigate('AddTransaction', { updateTotalBalance })} style={styles.addIconContainer}>
  <Image source={require('../constants/image/add.png')} style={styles.addIcon} />
        
</TouchableOpacity>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  TopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  TopleftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TopRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  addIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom:20,
    marginTop:-10,
    //paddingTop:20
   
  },
  noticeIcon: {
    width: 30,
    height: 30,
  },
  TotalBalance: {
    fontFamily: 'Courier New',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TotalCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center align the items horizontally
    //marginTop: 20,

  },
  TotalBalanceCount: {
    fontFamily: 'Arial',
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#5163BF',
  },
  income: {
    fontFamily: 'Courier New',
    fontSize: 20,
    fontWeight: 'bold',
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginTop: 15,
  },
  TimeChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  Time: {
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 16,
  },
  chiPhiScreen: {
    backgroundColor: '#ffff',
    flex:1
  },
  thuNhapScreen: {
    backgroundColor: '#ffff',
    flex:1
  },
  addIconContainer: {
    position: 'absolute', // Thiết lập vị trí tuyệt đối để có thể đặt nó trên biểu đồ
    bottom: 20, // Điều chỉnh vị trí theo y
    right: 20, // Điều chỉnh vị trí theo x
    marginTop:-10
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  balanceDisplay: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  balanceText: {
    fontSize: 24,
    color: '#000',
  },
  input: {
    fontSize: 24,
    color: '#000',
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 200, // Đặt chiều rộng tùy theo nhu cầu
  },
});

export default Home;
