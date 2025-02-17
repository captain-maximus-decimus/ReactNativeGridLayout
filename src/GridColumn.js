import React from 'react';
import { View, StyleSheet } from 'react-native';

const GridColumn = ({ item, numColumns }) => {
  return (
    <View style={[styles.column, { flexBasis: `${100 / numColumns}%` }]}>
      {item}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    padding: 5,
  },
});

export default GridColumn;
