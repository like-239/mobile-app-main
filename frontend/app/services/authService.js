import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        return token;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Lỗi khi lấy token:', error);
      return error;
    }
  };

  
  
export default getToken;