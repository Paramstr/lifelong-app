import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FoodDetailsScreen() {
  const insets = useSafeAreaInsets();
  const ingredients = [
    { id: '1', name: 'Cottage Cheese', calories: 55, protein: 7, carbs: 2, fat: 3, amount: '0.5 cups' },
    { id: '2', name: 'Avocado', calories: 161, protein: 2, carbs: 9, fat: 15, amount: '0.5 whole' },
    { id: '3', name: 'Cherry Tomatoes', calories: 30, protein: 1, carbs: 6, fat: 0, amount: '6 whole' },
    { id: '4', name: 'Radish', calories: 14, protein: 0, carbs: 3, fat: 0, amount: '4 slices' },
    { id: '5', name: 'Cucumber', calories: 12, protein: 1, carbs: 3, fat: 0, amount: '6 slices' },
    { id: '6', name: 'Purple Cabbage', calories: 18, protein: 1, carbs: 4, fat: 0, amount: '0.5 cups' },
    { id: '7', name: 'Microgreens', calories: 5, protein: 1, carbs: 1, fat: 0, amount: '0.25 cups' },
    { id: '8', name: 'Sourdough Toast', calories: 120, protein: 4, carbs: 22, fat: 2, amount: '2 slices' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.scrollWrapper}>
        <FlatList
          data={ingredients}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingTop: 60, paddingBottom: insets.bottom + 32 },
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
                  source={require('../../assets/images/food/bowl-2.jpg')}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
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
                <MaterialCommunityIcons name="bowl-mix-outline" size={20} color="#94A3B8" />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <View style={styles.rowMetaRow}>
                  <Text style={styles.rowKcal}>{item.calories} KCAL</Text>
                  <Text style={styles.rowMacros}>
                    P: {item.protein}G  C: {item.carbs}G  F: {item.fat}G
                  </Text>
                </View>
              </View>
              <View style={styles.stepper}>
                <Text style={styles.stepperAction}>−</Text>
                <View style={styles.stepperValueContainer}>
                  <Text style={styles.stepperValue}>{item.amount}</Text>
                </View>
                <Text style={styles.stepperAction}>+</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'ui-rounded',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  metaSeparator: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  title: {
    fontSize: 24,
    fontFamily: 'ui-rounded',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 28,
  },
  macroValue: {
    fontSize: 15,
    fontFamily: 'ui-rounded',
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  macroLabel: {
    fontSize: 14,
    fontFamily: 'ui-rounded',
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
  macroSeparator: {
    fontSize: 14,
    marginHorizontal: 4,
    color: theme.colors.border.divider,
  },
  heroCard: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.secondary,
    marginBottom: 32,
    aspectRatio: 1,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'ui-rounded',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: 'ui-rounded',
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: theme.colors.border.subtle,
    marginVertical: 4,
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: 'ui-rounded',
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  rowMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowKcal: {
    fontSize: 12,
    fontFamily: 'ui-rounded',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  rowMacros: {
    fontSize: 12,
    fontFamily: 'ui-rounded',
    color: theme.colors.text.muted,
    fontWeight: '400',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepperAction: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontWeight: '400',
  },
  stepperValueContainer: {
    paddingHorizontal: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 12,
    fontFamily: 'ui-rounded',
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
}));


