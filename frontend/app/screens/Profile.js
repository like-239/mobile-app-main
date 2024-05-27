import { useNavigation } from '@react-navigation/native';
import React ,{useEffect,useState}from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
const Profile = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [token,setToken]=useState('');
    const LogOut = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('userEmail');
        showMessage({
          message: 'Đăng xuất thành công',
          type: 'success',
        });
        navigation.navigate('Login');
      } catch (error) {
        console.log('Error during logout:', error);
        showMessage({
          message: 'Đã xảy ra lỗi khi đăng xuất',
          type: 'danger',
        });
      }
    };
    const handleLogOut =async()=>{
      Alert.alert(
        'Xác nhận đăng xuất?',
        'Bạn có chắc chắn muốn đăng xuất?',
        [
          { text: 'Hủy bỏ', style: 'cancel' },
          { text: 'Xác nhận', onPress: () =>LogOut() },
        ]
      );
    }
    const handleDeleteAccount = async () => {
      Alert.alert(
        'Xác nhận xóa tài khoản',
        'Bạn có chắc chắn muốn xóa tài khoản? Thao tác này sẽ không thể hoàn tác.',
        [
          { text: 'Hủy bỏ', style: 'cancel' },
          { text: 'Xác nhận', onPress: () => deleteAccount() },
        ]
      )
    };
     
  const deleteAccount = async () => {
    const responses = await API.requestDELETE_USER(`/users/delete?token=${token}&id=${userId}`);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('userEmail');

    navigation.navigate('Login');
  };
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedUserEmail = await AsyncStorage.getItem('email');
        const storedToken = await AsyncStorage.getItem('token');
          setUsername(storedUsername);
          setUserEmail(storedUserEmail);
        setToken(storedToken);
       
      } catch (error) {
        console.log('Error getting user details:', error);
      }
    };

    getUserDetails();
  }, []); 

    return(
      <View style={styles.container}>
        <View style={styles.inforContainer}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#FFFFF'}}>
        <Image
         source={require('../constants/image/back(2).png')} 
         style={styles.backBTN}
        />
        </TouchableOpacity>
       

      <Text style={styles.SignupText}> Thông tin cá nhân</Text>
    
     </View>
<View style={styles.avatarContainer}>
     <Image
       source={require('../constants/image/57.png')} 
       style={styles.avatar }
       
     />
     </View>
      
     <Text style={styles.infor}>Thông tin cá nhân</Text>
     
     <View style={styles.wrapper}>    
              <View style={styles.userName}>
                <Text style={styles.persionalInfor}>Tên</Text>
                  <Text style={styles.inforDetail}>{username}</Text>
              </View>
            </View>

            <View style={styles.wrapper}>
              
              <View style={styles.inputWrapper}>
                
              <Text style={styles.persionalInfor}>Email</Text>
                  <Text  style={styles.inforDetail} >{userEmail}</Text>
              </View>
            </View>

          

            <View style={styles.wrapper}>
              
              <View style={styles.inputWrapper}>
              <Text style={styles.persionalInfor}>Mật khẩu</Text>
                  <Text  style={styles.inforDetail}>********</Text>
              </View>
            </View>

            <Text style={styles.infor}>Chức năng khác</Text>
            <View style={styles.wrapper}>
              
            <TouchableOpacity onPress={handleLogOut}>
    <View style={styles.inputWrapper}>
      <Text style={styles.persionalInfor}>Đăng xuất</Text>
    </View>
  </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>             
            <TouchableOpacity onPress={handleDeleteAccount}>
    <View style={styles.inputWrapper}>
      <Text style={styles.persionalInfor}>Xóa tài khoản</Text>
    </View>
  </TouchableOpacity>
            </View>
      </View>
    )
}
const styles = StyleSheet.create({
  SignupText:{
    fontWeight: 'bold',
    fontSize:22,
    color:'#000000',
    //marginLeft: 30, 
    marginTop:10,
    //textAlign:'center',
    //flex: 1,
    marginRight:100,
    marginLeft:-20
  },
  container:{
    backgroundColor:'#FFFFFF',
    flex: 1,
  },
  avatar:{
    width: 150,
    height: 150,
    borderRadius: 999,
    marginTop: 40,
    resizeMode:"cover",
    borderWidth:2,
    
  },
  avatarContainer:{
    //flex:1,
    alignItems:"center",
    //marginTop: -40,
  marginBottom: 10,
  
  },
  infor:{
    fontSize:20,
    color:'#5265BE',
    fontWeight:'bold',
    marginTop:10,
    paddingLeft:20
  },
  inforDetail:{
    fontSize:16,
    color:'#000000',
    fontWeight:'bold',
    marginTop:10,
    paddingLeft:20
  },
  inforContainer:{
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingHorizontal: 20, 
    marginTop: 50, 
    alignItems:'center',

  },
  label:{
    marginBottom: 20,
    fontFamily: 'regular',
    //fontSize: SIZES.small,
    marginBottom: 5,
    marginEnd: 5,
    //color: COLORS.black,
    fontWeight: 'bold',
  },
  wrapper:{
    marginTop:10
  },
  inputWrapper: {
    backgroundColor: '#F4F4F4',
   
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 25,
    alignItems: 'center',
    //marginTop:10,
    marginHorizontal:10,
    justifyContent: 'space-between', 

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
  backBTN:{
    width:40,
    height:40,
    //paddingTop:25,
    marginTop:18,
    marginLeft:10,
    marginRight:80
  },
  persionalInfor:{
    color:'#5164BF',
    fontSize:14,
    fontWeight:'bold'
  },
  userName:{
    //borderColor: '#808080',
    backgroundColor: '#F4F4F4',
    //borderWidth: 0.5,
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 25,
    alignItems: 'center',
    marginTop:10,
    marginHorizontal:10,
    justifyContent: 'space-between', 
  }
})
export default Profile;
