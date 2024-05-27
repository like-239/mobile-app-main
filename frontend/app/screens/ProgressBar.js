import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
  // Tính toán chiều rộng của phần đã hoàn thành dựa vào tiến trình
  const filledWidth = `${progress * 100}%`;

  return (
    <View style={styles.container}>
      <View style={[styles.filled, { width: filledWidth }]} />
      <Text style={styles.text}>{`${Math.round(progress * 100)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  filled: {
    height: '100%',
    backgroundColor: '#3b5998',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  text: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProgressBar;
