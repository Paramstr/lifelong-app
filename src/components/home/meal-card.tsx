import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface MealCardProps {
  time: string;
  mealType: string;
  title: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  image: ImageSourcePropType;
}

const MealCard: React.FC<MealCardProps> = ({
  time,
  mealType,
  title,
  calories,
  carbs,
  protein,
  fat,
  image,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{time}</Text>
          <Text style={styles.separator}>-</Text>
          <Text style={styles.mealTypeText}>{mealType}</Text>
        </View>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.macrosRow}>
          <Text style={styles.macroItem}><Text style={styles.macroLabel}>cal</Text> {calories}</Text>
          <Text style={styles.macroItem}><Text style={styles.macroLabel}>carbs</Text> {carbs}</Text>
          <Text style={styles.macroItem}><Text style={styles.macroLabel}>protein</Text> {protein}</Text>
          <Text style={styles.macroItem}><Text style={styles.macroLabel}>fat</Text> {fat}</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.mealImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: theme.spacing.md,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.text.muted,
  },
  separator: {
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  mealTypeText: {
    fontSize: 16,
    color: theme.colors.text.muted,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  macrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
    marginTop: 2,
  },
  macroItem: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  macroLabel: {
    color: theme.colors.text.muted,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
}));

export default MealCard;
