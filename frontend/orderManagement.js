import React,{useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Image,
  StyleProp,
  ViewStyle,
  Touchable,
  TouchableOpacity,
  TextInput,
  Text,
  Button

} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {COLORS, SIZES} from '../MyApp/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const orderManagement =()=>{
  const [showUnpaidOrders, setShowUnpaidOrders] = useState(false); 
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);
  const [sellerName, setSellerName] = useState('John Doe');
  const [productList, setProductList] = useState(['Product 1', 'Product 2', 'Product 3']);
  const [orderList, setOrderList] = useState(['Order 1', 'Order 2', 'Order 3']);

  return(
    <View key={order.id} style={styles.wrapper}>
        <TouchableOpacity
          style={styles.container2}
          onPress={() => handleOrderClick(order)}
        >
          <View style={styles.textContainer}>
            <Text style={styles.productTiltle}>{order.customer}</Text>
            <Text>Total: {order.total}</Text>
            {order.isPaid ? (
              <Text style={{ color: 'green' }}>Paid</Text>
            ) : (
              <Text style={{ color: 'red' }}>Unpaid</Text>
            )}
          </View>
        </TouchableOpacity>
  
      
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => handleCheckout(order)}
        >
          <Text style={styles.checkoutButtonText}>Check-out</Text>
        </TouchableOpacity>
  
      
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleDeleteOrder(order)}
        >
          <Icon name="delete" size={25} color="red" />
        </TouchableOpacity>
      </View>

      
  );



const [unpaidOrders, setUnpaidOrders] = useState([
  { id: '1', customer: 'Customer 1', total: 50, isPaid: false },
  { id: '2', customer: 'Customer 2', total: 30, isPaid: false },
  { id: '3', customer: 'Customer 3', total: 40, isPaid: false },
  { id: '4', customer: 'Customer 4', total: 20, isPaid: false },
  { id: '5', customer: 'Customer 5', total: 60, isPaid: false },
]);

const [completedOrders, setCompletedOrders] = useState([
  { id: '1', customer: 'Customer 1', total: 50, isPaid: true },
  { id: '2', customer: 'Customer 2', total: 30, isPaid: true },
  { id: '3', customer: 'Customer 3', total: 40, isPaid: false },
  { id: '4', customer: 'Customer 4', total: 20, isPaid: false },
  { id: '5', customer: 'Customer 5', total: 60, isPaid: false },
  
]);

const handleToPayPress = () => {
 
  setShowUnpaidOrders(true);
 

};

const handleCompletedPress = () => {
  setShowUnpaidOrders(false); 
  setShowCompletedOrders(true);
};

return (
  <ScrollView style={styles.container}>
    
    <View style={styles.header}>
      <Text style={styles.headerText}>Order management </Text>
    </View>
    <View style={styles.wrapper } >
      <View style={styles.inputWrapper}>
        <View style={styles.infoBottom}>

          <TouchableOpacity style={styles.left} onPress={handleToPayPress}>
            <Text style={styles.tasksDone}>{unpaidOrders.length}</Text>
            <Text style={styles.tasksDone}>Chờ duyệt</Text>
          </TouchableOpacity>

                  
          <TouchableOpacity style={styles.right} onPress={handleCompletedPress}>
          <Text style={styles.tasksDone}>{completedOrders.length}</Text>
            <Text style={styles.tasksDone}>Đã giao</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    
  {showUnpaidOrders && (
      <>      
        {unpaidOrders.map((order) => (
          <View key={order.id} style={styles.wrapper}>
            <TouchableOpacity
              style={styles.container2}
              onPress={() => handleOrderClick(order)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.productTiltle}>{order.customer}</Text>
                <Text>Total: {order.total}</Text>
                {order.isPaid ? (
                  <Text style={{ color: 'green' }}>Paid</Text>
                ) : (
                  <Text style={{ color: 'red' }}>Unpaid</Text>
                )}
              </View>

              <TouchableOpacity
      style={styles.checkoutButton}
      onPress={() => handleCheckout(order)}
    >
      
      <Text style={styles.checkoutButtonText}>Check-out</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeleteOrder(order)}
      >
        <Icon name="webcam-off" size={25} color="red" />
      </TouchableOpacity>
            </TouchableOpacity>
    
    
    
          </View>
        ))}
      </>

    )}

{showCompletedOrders && (
      <>
      
        {completedOrders.map((order) => (
          <View key={order.id} style={styles.wrapper}>
            <TouchableOpacity
              style={styles.container2}
              onPress={() => handleOrderClick(order)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.productTiltle}>{order.customer}</Text>
                <Text>Total: {order.total}</Text>
                {order.isPaid ? (
                  <Text style={{ color: 'green' }}>Paid</Text>
                ) : (
                  <Text style={{ color: 'red' }}>Unpaid</Text>
                )}
              </View>

              <TouchableOpacity
      style={styles.checkoutButton}
      onPress={() => handleCheckout(order)}
    >
      <Text style={styles.checkoutButtonText}>Check-out</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeleteOrder(order)}
      >
        <Icon name="webcam-off" size={25} color="red"  />
      </TouchableOpacity>
            </TouchableOpacity>
            
          </View>
        ))}
        
      </>
    )}
   
                
  
</ScrollView>


);
};
const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    //padding: 20,
    
  },
  container1:{
    flex: 1,
    backgroundColor: COLORS.primary, 
    height: SIZES.height/6,

  },
  container2:{
    
    backgroundColor:COLORS.lightWhite,
    borderWidth:1,
    height:65,
    borderRadius:12,
    flexDirection:'row',
    paddingHorizontal:15,
    alignItems:"center",
    

  },
  textContainer:{
    flex:1,
    marginHorizontal:SIZES.medium
  },
  productTiltle:{
    fontSize:SIZES.medium,
    fontFamily:'bold',
    color:COLORS.primary
  },
  header: {
     //justifyContent: 'center', 
    //alignItems: 'center',
    marginBottom: 20,
    marginTop:20
  },
  headerText: {
    fontWeight: 'bold',
    fontFamily:"bold",
    fontSize:SIZES.xLarge,
    color:COLORS.primary,
    marginBottom:SIZES.xLarge
  },

 
  
  app: {
   marginTop: -50,
   
  },

  
  infoBottom: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
  alignItems: 'center', 
  position: 'relative',
  height: 50,
  width: '80%', 
  marginHorizontal: 'auto',
  
  },
  left: {
    alignItems:'center',
    width:'55%',
    
    
  },

  right: {
    alignItems:'center',
    width:'30%',
    

  },

  tasksDone: {
    fontFamily:'bold',
    color:COLORS.white,
    fontSize:15,
    
    
  },
  wrapper:{
   
    
    marginHorizontal:20,
    paddingTop:20,
    
},
inputWrapper:{
 backgroundColor:COLORS.primary,
  borderWidth:1,
  height:55,
  borderRadius:12,
  flexDirection:'row',
  paddingHorizontal:15,
  alignItems:"center",
  
 
},
  coverImage: {
      
    width: '100%',
    height: SIZES.height/3,
    resizeMode:"cover"
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding:1.5,
  borderWidth:0.4,
  borderRadius:SIZES.medium,
    marginHorizontal:'auto'
  },

  checkoutButtonText: {
    color: COLORS.white,
    fontFamily: 'bold',
    marginHorizontal:20,
    fontWeight:'600',
    fontSize:13,
    lineHeight:26,
  },

  deleteIcon: {
    marginHorizontal:'auto'
  },
orderButtonRight:{
  alignItems: 'center'
}
});

export default orderManagement;
