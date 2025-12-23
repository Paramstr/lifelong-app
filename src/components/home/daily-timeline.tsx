import React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import MealCard from './meal-card';
import ThoughtCard from './thought-card';
import TimelineItem from './timeline-item';

export type TimelineEntry = {
  id: string;
  time: string;
  type: 'meal' | 'thought';
  title?: string;
  mealType?: string;
  calories?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
  image?: ImageSourcePropType;
  thought?: string;
};

interface DailyTimelineProps {
  entries: TimelineEntry[];
}

const DailyTimeline: React.FC<DailyTimelineProps> = ({ entries }) => {
  return (
    <View>
      {entries.map((entry, index) => (
        <TimelineItem key={entry.id} showLine={index !== entries.length - 1}>
          {entry.type === 'meal' ? (
            <MealCard
              time={entry.time}
              mealType={entry.mealType || ''}
              title={entry.title || ''}
              calories={entry.calories || ''}
              carbs={entry.carbs || ''}
              protein={entry.protein || ''}
              fat={entry.fat || ''}
              image={entry.image!}
            />
          ) : (
            <ThoughtCard
              time={entry.time}
              thought={entry.thought || ''}
            />
          )}
        </TimelineItem>
      ))}
    </View>
  );
};

export default DailyTimeline;
