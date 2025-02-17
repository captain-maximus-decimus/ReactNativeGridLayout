import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { GridList } from './src/components/GridList';
import ClubItem from './ClubItem';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  isFullWidth?: boolean;
  description?: string;
}

const BATCH_SIZE = 16; // How many items to fetch at once
const DISPLAY_SIZE = 8; // How many items to display at a time

export default function App() {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  // Refs to store cached data
  const cachedProducts = useRef<Product[]>([]);
  const isFetching = useRef(false);

  const fetchProducts = async (isRefreshing = false) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${BATCH_SIZE}&skip=${(page - 1) * BATCH_SIZE}`
      );
      const data = await response.json();

      // Transform data to include some full-width items
      const transformedProducts = data.products.map((product: Product, index: number) => ({
        ...product,
        // Make every 5th item full-width
        isFullWidth: index % 5 === 0,
        description: index % 5 === 0 ? 'Featured product with full-width display!' : undefined
      }));

      if (isRefreshing) {
        cachedProducts.current = transformedProducts;
        setDisplayedProducts(transformedProducts.slice(0, DISPLAY_SIZE));
      } else {
        cachedProducts.current = [...cachedProducts.current, ...transformedProducts];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    const currentDisplayedCount = displayedProducts.length;
    const cachedCount = cachedProducts.current.length;

    if (currentDisplayedCount < cachedCount) {
      const nextBatch = cachedProducts.current.slice(
        currentDisplayedCount,
        currentDisplayedCount + DISPLAY_SIZE
      );
      setDisplayedProducts(prev => [...prev, ...nextBatch]);
      setIsLoadingMore(false);

      if (cachedCount - currentDisplayedCount <= DISPLAY_SIZE) {
        setPage(prev => prev + 1);
        fetchProducts();
      }
    } else {
      setPage(prev => prev + 1);
      await fetchProducts();
    }
  }, [isLoadingMore, displayedProducts.length]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setPage(1);
    await fetchProducts(true);
  };

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ClubItem/>
  ), []);

  const renderFullWidth = useCallback((item: Product) => (
    <View style={styles.fullWidthContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.fullWidthImage} />
      <View style={styles.fullWidthContent}>
        <Text style={styles.fullWidthTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.fullWidthDescription}>{item.description}</Text>
        )}
        <Text style={styles.fullWidthPrice}>${item.price}</Text>
      </View>
    </View>
  ), []);

  const EmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text>No products found</Text>
    </View>
  ), []);

  React.useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <View style={styles.container}>
      <GridList
        data={displayedProducts}
        renderItem={renderItem}
        renderFullWidth={renderFullWidth}
        spacing={12}
        onEndReached={handleLoadMore}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        ListEmptyComponent={EmptyComponent}
        ListHeaderComponent={
          <Text style={styles.header}>Product Catalog</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // Full-width styles
  fullWidthContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  fullWidthImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  fullWidthContent: {
    padding: 16,
  },
  fullWidthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fullWidthDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  fullWidthPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
