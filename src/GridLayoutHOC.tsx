import React from 'react';
import { View, StyleSheet } from 'react-native';
import GridRow from './GridRow'; // Assume GridRow and GridColumn are separate components
import GridColumn from './GridColumn';

interface WithGridLayoutProps {
  numColumns?: number;
  spacing?: number;
}

export const WithGridLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function GridLayoutWrapper(props: P & WithGridLayoutProps) {
    const { numColumns = 2, spacing = 8, ...componentProps } = props;

    return (
      <View style={styles.container}>
        <View style={[styles.gridContainer, { gap: spacing }]}>
          <WrappedComponent {...(componentProps as P)} />
        </View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});