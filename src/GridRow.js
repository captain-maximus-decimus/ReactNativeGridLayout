import React from 'react';
import { View, StyleSheet } from 'react-native';
import GridColumn from './GridColumn'; // Import GridColumn

const GridRow = ({ rowData, numColumns }) => {
  return (
    <View style={styles.row}>
      {rowData.map((item, columnIndex) => (
        <GridColumn key={columnIndex} item={item} numColumns={numColumns} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default GridRow;
