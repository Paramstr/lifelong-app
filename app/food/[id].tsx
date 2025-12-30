import React, { useState, useEffect } from 'react';
import { FlatList, Image, Text, View, Platform, TouchableOpacity, TextInput, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { EdgeBlurFade } from '@/components/shared/edge-blur-fade';

export default function FoodDetailsScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [focusedMacro, setFocusedMacro] = useState<'calories' | 'protein' | 'carbs' | 'fat' | null>(null);
  const [macros, setMacros] = useState({
    calories: '544',
    protein: '26',
    carbs: '54',
    fat: '27',
  });

  // Animation values
  const contentOpacity = useSharedValue(1);
  const editTransition = useSharedValue(0);
  
  useEffect(() => {
    editTransition.value = withTiming(isEditing ? 1 : 0, { duration: 250 });
    contentOpacity.value = withTiming(isEditing ? 0.1 : 1, { duration: 300 });
    if (isEditing && !focusedMacro) {
        setFocusedMacro('calories');
    }
  }, [isEditing]);

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
    if (!isEditing) {
        setFocusedMacro('calories'); 
    } else {
        setFocusedMacro(null);
    }
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const editButtonStyle = useAnimatedStyle(() => ({
    opacity: 1 - editTransition.value,
    transform: [
      { translateY: editTransition.value * -10 },
      { scale: 1 - editTransition.value * 0.1 }
    ],
  }));

  const doneButtonStyle = useAnimatedStyle(() => ({
    opacity: editTransition.value,
    transform: [
      { translateY: (1 - editTransition.value) * 10 },
      { scale: 0.9 + editTransition.value * 0.1 }
    ],
  }));

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

  const renderMacroInput = (key: keyof typeof macros, label: string) => {
    const isFocused = focusedMacro === key;
    const isOtherFocused = isEditing && focusedMacro && focusedMacro !== key;
    
    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isOtherFocused ? 0.3 : 1, { duration: 200 }),
        };
    });

    return (
        <Animated.View style={[containerStyle]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (isEditing) setFocusedMacro(key);
                }}
                style={[
                    styles.macroInputContainer,
                    isFocused && styles.macroInputContainerFocused
                ]}
            >
                {isEditing ? (
                    <TextInput
                        style={styles.macroInput}
                        value={macros[key]}
                        onChangeText={(v) => setMacros(prev => ({ ...prev, [key]: v }))}
                        keyboardType="numeric"
                        onFocus={() => setFocusedMacro(key)}
                        selectionColor="black"
                        showSoftInputOnFocus={true}
                    />
                ) : (
                    <Text style={styles.macroValue}>{macros[key]}{key !== 'calories' ? 'g' : ''}</Text>
                )}
                <Text style={styles.macroLabel}>{label}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
  };

    return (

      <View style={styles.container}>

        <EdgeBlurFade
          position="top"
          height={80}
          blurIntensity={0}
          fadeColor={theme.colors.background.primary}
          fadeStops={[
              { location: 0, opacity: 1 },
              { location: 0.4, opacity: 0.9 },
              { location: 1, opacity: 0 },
          ]}
          style={{ top: 0, zIndex: 10 }}

        />

        <View style={styles.handle} />
      <View style={styles.scrollWrapper}>
        <FlatList
          data={ingredients}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingTop: 40, paddingBottom: insets.bottom + 32 },
          ]}
          ListHeaderComponent={
            <View>
              <TouchableOpacity style={styles.iconButtonAbsolute} onPress={toggleEdit} activeOpacity={0.8}>
                <View style={styles.iconButtonInner}>
                  <Animated.View style={[styles.iconButtonContent, editButtonStyle]} pointerEvents={isEditing ? 'none' : 'auto'}>
                    <Text style={styles.iconButtonText}>Edit</Text>
                    {Platform.OS === 'ios' ? (
                        <SymbolView
                        name="square.and.pencil"
                        size={16}
                        tintColor="white"
                        resizeMode="scaleAspectFit"
                        style={{ marginTop: -1 }}
                        />
                    ) : (
                        <Ionicons 
                        name="create-outline" 
                        size={18} 
                        color="white" 
                        style={{ marginTop: -1 }}
                        />
                    )}
                  </Animated.View>
                  <Animated.View style={[styles.iconButtonContent, doneButtonStyle]} pointerEvents={isEditing ? 'auto' : 'none'}>
                    <Text style={styles.iconButtonText}>Done</Text>
                    {Platform.OS === 'ios' ? (
                        <SymbolView
                        name="checkmark.circle"
                        size={16}
                        tintColor="white"
                        resizeMode="scaleAspectFit"
                        style={{ marginTop: -1 }}
                        />
                    ) : (
                        <Ionicons 
                        name="checkmark-circle-outline" 
                        size={18} 
                        color="white" 
                        style={{ marginTop: -1 }}
                        />
                    )}
                  </Animated.View>
                </View>
              </TouchableOpacity>

              <View style={styles.metaRow}>
                <View style={styles.metaLeft}>
                  <Text style={styles.metaText}>8:10 AM</Text>
                  <Text style={styles.metaSeparator}>|</Text>
                  <Text style={styles.metaText}>Breakfast</Text>
                </View>
              </View>

              <Text style={styles.title}>Cottage Cheese & Avocado Plate</Text>

              <View style={styles.macroRow}>
                {renderMacroInput('calories', 'cal')}
                <Text style={styles.macroSeparator}>|</Text>
                {renderMacroInput('protein', 'protein')}
                <Text style={styles.macroSeparator}>|</Text>
                {renderMacroInput('carbs', 'carbs')}
                <Text style={styles.macroSeparator}>|</Text>
                {renderMacroInput('fat', 'fat')}
              </View>

              
              <Animated.View style={[styles.heroCard, animatedContentStyle]}>
                <Image
                  source={require('../../assets/images/food/bowl-2.jpg')}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </Animated.View>

              <Animated.View style={[styles.sectionHeader, animatedContentStyle]}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.sectionCount}>{ingredients.length}</Text>
              </Animated.View>
            </View>
          }
          renderItem={({ item }) => (
            <Animated.View style={[styles.row, animatedContentStyle]}>
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
            </Animated.View>
          )}
        />
      </View>
      <EdgeBlurFade
        position="bottom"
        height={insets.bottom + 60}
        blurIntensity={0}
        fadeColor={theme.colors.background.primary}
        fadeStops={[
            { location: 0, opacity: 0 },
            { location: 0.4, opacity: 0.8 },
            { location: 1, opacity: 1 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: theme.colors.border.divider,
    borderRadius: 2.5,
    alignSelf: 'center',
    top: 12,
    position: 'absolute',
    zIndex: 20,
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  iconButtonAbsolute: {
    alignSelf: 'flex-end',
    borderRadius: 24,
    backgroundColor: '#000000',
    marginBottom: 8,
    overflow: 'hidden',
  },
  iconButtonInner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 36,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'absolute',
  },
  iconButtonText: {
    fontSize: 14,
    fontFamily: 'ui-rounded',
    fontWeight: '600',
    color: '#FFFFFF',
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
  macroInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  macroInputContainerFocused: {
    borderBottomColor: theme.colors.text.primary,
  },
  macroInput: {
    fontSize: 15,
    fontFamily: 'ui-rounded',
    fontWeight: '500',
    color: theme.colors.text.primary,
    padding: 0,
    margin: 0,
    minWidth: 20,
    textAlign: 'center',
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
    fontWeight: '400',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  rowMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowKcal: {
    fontSize: 10,
    fontFamily: 'ui-rounded',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  rowMacros: {
    fontSize: 10,
    fontFamily: 'ui-rounded',
    color: theme.colors.text.secondary,
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
