import React, { useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    ListRenderItem,
    RefreshControl,
} from 'react-native';

interface GridColumnProps {
    children: React.ReactNode;
    width: string | number;
    height?: number;
    style?: object;
}

export const GridColumn: React.FC<GridColumnProps> = ({ children, width, height, style }) => (
    <View style={[{ 
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    }, style]}>
        {children}
    </View>
);

interface GridRowProps {
    children: React.ReactNode;
    spacing?: number;
    style?: object;
}

export const GridRow: React.FC<GridRowProps> = ({ children, spacing = 0, style }) => (
    <View style={[styles.row, { gap: spacing }, style]}>
        {children}
    </View>
);

// New interface to distinguish between grid items and full-width items
interface GridItem<T> {
    type: 'grid' | 'full';
    data: T | T[];
}

interface GridListProps<T> {
    data: T[];
    renderItem: ListRenderItem<T>;
    renderFullWidth?: (item: T) => React.ReactNode;
    numColumns?: number;
    spacing?: number;
    itemHeight?: number;
    fullWidthItemHeight?: number;
    onEndReached?: () => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    isLoadingMore?: boolean;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement;
    contentContainerStyle?: object;
}

export function GridList<T>({
    data,
    renderItem,
    renderFullWidth,
    numColumns = 2,
    spacing = 8,
    itemHeight,
    fullWidthItemHeight,
    onEndReached,
    onRefresh,
    isLoading = false,
    isLoadingMore = false,
    ListEmptyComponent,
    ListHeaderComponent,
    ListFooterComponent,
    contentContainerStyle,
}: GridListProps<T>) {
    const renderFooter = useCallback(() => {
        if (!isLoadingMore) return ListFooterComponent || null;

        return (
            <View style={styles.loadingMore}>
                <ActivityIndicator size="small" />
            </View>
        );
    }, [isLoadingMore, ListFooterComponent]);

    const renderGridItem = useCallback(({ item, index }: { item: T; index: number }) => {
        const columnWidth = `${100 / numColumns}%`;
        
        return (
            <GridColumn width={columnWidth} height={itemHeight}>
                {renderItem({ item, index } as any)}
            </GridColumn>
        );
    }, [renderItem, numColumns, itemHeight]);

    const renderGridRow = useCallback(({ item }: { item: GridItem<T> }) => {
        if (item.type === 'full' && renderFullWidth) {
            return (
                <View style={{ height: fullWidthItemHeight }}>
                    {renderFullWidth(item.data as T)}
                </View>
            );
        }

        return (
            <GridRow spacing={spacing}>
                {(item.data as T[]).map((rowItem: T, colIndex: number) =>
                    renderGridItem({ item: rowItem, index: colIndex } as any)
                )}
            </GridRow>
        );
    }, [renderGridItem, renderFullWidth, spacing, fullWidthItemHeight]);

    const groupItemsIntoRows = useCallback((items: T[]) => {
        const rows: GridItem<T>[] = [];
        let currentIndex = 0;

        while (currentIndex < items.length) {
            const item = items[currentIndex];
            
            // Check if this item should be rendered full-width
            // You can implement your own logic here to determine if an item should be full-width
            // This example uses a hypothetical isFullWidth property
            if ((item as any).isFullWidth) {
                rows.push({ type: 'full', data: item });
                currentIndex++;
                continue;
            }

            // Regular grid items
            const gridItems = items.slice(currentIndex, currentIndex + numColumns);
            rows.push({ type: 'grid', data: gridItems });
            currentIndex += numColumns;
        }

        return rows;
    }, [numColumns]);

    const groupedData = groupItemsIntoRows(data);

    const getItemLayout = useCallback((data: any, index: number) => {
        const item = data[index];
        const height = item?.type === 'full' ? fullWidthItemHeight ?? 0 : itemHeight ?? 0;
        const offset = index * (height + spacing);
        
        return {
            length: height,
            offset,
            index,
        };
    }, [itemHeight, fullWidthItemHeight, spacing]);

    return (
        <FlatList
            data={groupedData}
            renderItem={renderGridRow}
            getItemLayout={itemHeight && fullWidthItemHeight ? getItemLayout : undefined}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={5}
            contentContainerStyle={[
                styles.container,
                { marginHorizontal: -8 },
                contentContainerStyle
            ]}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshControl={
                onRefresh ? (
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                ) : undefined
            }
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter as any}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    loadingMore: {
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
}); 