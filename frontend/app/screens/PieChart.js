import React from 'react';
import { View ,Text} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Circle, G, Line } from 'react-native-svg';
const PieChartExample = () => {
  const data = [
      {
          key: 1,
          value: 50,
          svg: { fill: '#600080' },
          arc: { outerRadius: '100%', cornerRadius: 10 },
      },
      {
          key: 2,
          value: 10,
          svg: { fill: '#9900cc' },
      },
      {
          key: 3,
          value: 40,
          svg: { fill: '#c61aff' },
      },
  ];

  return (
      <View style={{ height: 300, width: 300, justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
              style={{ height: 240, width: 240 }}
              data={data}
              valueAccessor={({ item }) => item.value}
              outerRadius={'90%'}
              innerRadius={'45%'}
          />
      </View>
  );
};

export default PieChartExample;
