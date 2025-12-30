import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export default function FoodDetailsScreen() {
  const insets = useSafeAreaInsets();
  const ingredients = [
    { id: '1', name: 'Cottage Cheese', calories: 55, protein: 7, carbs: 2, fat: 3, amount: '0.5 cup' },
    { id: '2', name: 'Avocado', calories: 161, protein: 2, carbs: 9, fat: 15, amount: '0.5 whole' },
    { id: '3', name: 'Cherry Tomatoes', calories: 30, protein: 1, carbs: 6, fat: 0, amount: '6 whole' },
    { id: '4', name: 'Radish', calories: 14, protein: 0, carbs: 3, fat: 0, amount: '4 slices' },
    { id: '5', name: 'Cucumber', calories: 12, protein: 1, carbs: 3, fat: 0, amount: '6 slices' },
    { id: '6', name: 'Purple Cabbage', calories: 18, protein: 1, carbs: 4, fat: 0, amount: '0.5 cup' },
    { id: '7', name: 'Microgreens', calories: 5, protein: 1, carbs: 1, fat: 0, amount: '0.25 cup' },
    { id: '8', name: 'Sourdough Toast', calories: 120, protein: 4, carbs: 22, fat: 2, amount: '2 slices' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#ffffffff', paddingTop: 0}]}>
      <View style={styles.scrollWrapper}>
        <FlatList
          data={ingredients}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={true}
          contentInsetAdjustmentBehavior="never"
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingTop: 40, paddingBottom: insets.bottom + 32 },
          ]}
          ListHeaderComponent={
            <View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>8:10 AM</Text>
                <Text style={styles.metaSeparator}>|</Text>
                <Text style={styles.metaText}>Breakfast</Text>
              </View>

              <Text style={styles.title}>Cottage Cheese & Avocado Plate</Text>

              <View style={styles.macroRow}>
                <Text style={styles.macroValue}>544</Text>
                <Text style={styles.macroLabel}>cal</Text>
                <Text style={styles.macroSeparator}>|</Text>
                <Text style={styles.macroValue}>26g</Text>
                <Text style={styles.macroLabel}>protein</Text>
                <Text style={styles.macroSeparator}>|</Text>
                <Text style={styles.macroValue}>54g</Text>
                <Text style={styles.macroLabel}>carbs</Text>
                <Text style={styles.macroSeparator}>|</Text>
                <Text style={styles.macroValue}>27g</Text>
                <Text style={styles.macroLabel}>fat</Text>
              </View>

              <View style={styles.heroCard}>
                <Image
                  source={require('../../assets/images/eggs-avocado-toast.png')}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
                <View style={styles.cameraButton}>
                  <Text style={styles.cameraButtonText}>CAM</Text>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.sectionCount}>{ingredients.length}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.iconBadge}>
                <Text style={styles.iconBadgeText}>FOOD</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  {item.calories} kcal  P: {item.protein}g  C: {item.carbs}g  F: {item.fat}g
                </Text>
              </View>
              <View style={styles.stepper}>
                <Text style={styles.stepperText}>-</Text>
                <Text style={styles.stepperValue}>{item.amount}</Text>
                <Text style={styles.stepperText}>+</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  metaSeparator: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 10,
  },
  macroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 18,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  macroLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  macroSeparator: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.secondary || '#F3F4F6',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  cameraButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cameraButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sectionCount: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  itemSeparator: {
    height: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary || '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.6,
  },
  rowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  rowMeta: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  stepperValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
}));
