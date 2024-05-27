import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import API from '../services/GlobalAPI';
const Signup = () => {
    const navigation = useNavigation();

    const [password, setPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState(''); 
   const [totalBalance,setTotalBalance]=('');
    const handlePasswordVisibility = () => {
      if (rightIcon === 'eye-off') {
        setRightIcon('eye');
        setPasswordVisibility(false);
      } else if (rightIcon === 'eye') {
        setRightIcon('eye-off');
        setPasswordVisibility(true);
      }
    };
  
  
    
    const handleSignup = async () => {
     
      try {
        const loginData = {
          username: 'admin',
          password: '123456',
        };
  
      const signupData = {
        username,
        email,
        password,
        totalBalance:''
      };
    
      const authResponse = await API.requestPOST_Login('/auth/login', loginData);
      setToken(authResponse.token)
      console.log(authResponse.token)
      const response = await API.requestSignup('/users/create', signupData);
      if ( response.success) {
       
        console.log('Signup successful:', response.message);
        console.log('User details:', response.user);
        showMessage({
          message: 'Đăng ký thành công',
          type: 'success',
        });
        navigation.navigate('Login');
      } else {
   
        console.log('Signup failed:', response.status);
      
  
      }
    } catch (error) {
    
      console.error('Error during signup:', error);
      
    }
  
    };
  const getAuthToken = async () => {
    const loginData = {
      username: 'Admin',
      password: '123456',
    };
  
    try {
      const authResponse = await API.requestPost_Role('/auth/login', loginData);
      setToken(authResponse)
      if (authResponse  && authResponse.userId) {
        console.log('Login successful:', authResponse);
        setRoleID(authResponse.userId);
        console.log('RoleID:', authResponse.userId); 
  
  
        
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  

    return (
<View style={styles.container}>
    
        <Image
       source={require('../constants/image/Group91.png')} 
       style={styles.logo }
    /> 

     <Text style={styles.SignupText}>Sign up</Text>
     
     <Text style={styles.emailText}>Email Address</Text>
     <TextInput style={styles.menuItem}
      onChangeText={(text) => setEmail(text)}
      value={email}
    > 
     </TextInput>

     <Text style={styles.emailText}>Password</Text>
     <View style={styles.wrapper}>
     <TextInput
    style={{ height: 40, borderColor: '#808080', borderBottomWidth: 1, flex: 1 }}
    secureTextEntry={passwordVisibility}
    value={password}
    onChangeText={text => setPassword(text)}
/>
     <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Feather name={rightIcon} size={25} style={styles.eyeIcon} />
                </TouchableOpacity>
                </View>

     <Text style={styles.emailText}>Username</Text>
     <TextInput style={styles.menuItem}
      onChangeText={(text) => setUsername(text)}
      value={username}
     >
     </TextInput>

     <Pressable
               onPress={() => {
                handleSignup();  
              }}
              style={{
                backgroundColor: '#5063BF',
                borderRadius: 10,
                padding: 15,
                marginTop:35,
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
                Đăng ký
              </Text>
            </Pressable>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{marginTop: 15}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000000',
                  fontSize: 16,

                }}>
                Bạn đã có tài khoản?{' '}
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#808080',
                    fontSize: 16,
                  }}>
                  Đăng nhập
                </Text>
              </Text>
            </TouchableOpacity>
      </View>
    );
  
}
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#FFFFFF',
    flex: 1,
  },
  iconStyle: {
    marginRight: 20,
  },
  logo:{
    marginLeft: 30, 
    marginTop:50,
   
  },
  SignupText:{
    fontWeight: 'bold',
    fontSize:35,
    color:'#000000',
    marginLeft: 30, 
    marginTop:10,
  },
  emailText:{
    marginLeft: 30, 
    marginTop:50,
    fontSize:13,
    fontWeight:'bold'
  },
  menuItem:{
    flexDirection:'row',
    //paddingVertical:13,
    //paddingHorizontal:35,
    borderColor:'#808080',
    borderBottomWidth:1,
    marginTop:10,
    marginHorizontal:20,
    //flex:1
  },
  wrapper:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  borderBottomWidth: 1,
  borderColor: '#808080',
  marginTop: 15,
  marginHorizontal: 20
  },
 } );  
export default Signup; 
