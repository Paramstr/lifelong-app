import { Canvas, Circle, Group, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3 from 'd3-shape';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import React, { useMemo } from 'react';
import { Dimensions, Image as RNImage, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRAPH_HEIGHT = 220;
// Parent checks paddingHorizontal=16 (total 32). 
// Card also has padding 16 inside (total 32).
// Total horizontal reduction = 64 approx if we want full width.
// Let's set graph width to fit comfortably.
const CARD_PADDING = 16;
const CONTAINER_PADDING = 16;
const GRAPH_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2) - (CARD_PADDING * 2); 
const PADDING_VERTICAL = 20;

const COLORS = [
  '#eb4d4b', // Brother (Orange/Red)
  '#6ab04c', // Mum (Green)
  '#0984e3', // Dad (Blue)
  '#a29bfe', // Me (Purple)
];

const AVATARS = [
  require('../../../../assets/images/family/brother.jpeg'),
  require('../../../../assets/images/family/mum.jpeg'),
  require('../../../../assets/images/family/dad.jpeg'),
  'https://media.licdn.com/dms/image/v2/D5603AQGL5HeVBT5RBg/profile-displayphoto-crop_800_800/B56ZokggypJYAI-/0/1761549094697?e=1768435200&v=beta&t=CT2foTyMwUfSkCZA8i6I_cNw4v_jWIrcUBNNyXLZlhs', // Me
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Generate Mock Data
const generateData = () => {
  return COLORS.map((color, personIndex) => {
    return Array.from({ length: 7 }).map((_, dayIndex) => ({
      day: DAYS[dayIndex],
      steps: 4000 + Math.random() * 8000 + (personIndex * 1000), // Random steps
      color,
    }));
  });
};

const DATA = generateData();

// Accessor functions
const getX = (index: number) => (index / (DAYS.length - 1)) * GRAPH_WIDTH;
const getY = (value: number, yScale: any) => yScale(value);

export const FamilyStepsGraph = () => {
    // Scales
    const minSteps = 2000;
    const maxSteps = 15000;
  
    const yScale = d3Scale.scaleLinear()
      .domain([minSteps, maxSteps])
      .range([GRAPH_HEIGHT - PADDING_VERTICAL, PADDING_VERTICAL]);
  
    // Create Paths
    const paths = useMemo(() => {
      return DATA.map((personData) => {
        const lineGenerator = d3.line<{ day: string; steps: number; color: string }>()
          .x((_, i) => getX(i))
          .y(d => yScale(d.steps))
          .curve(d3.curveCatmullRom.alpha(0.5));
        
        const d = lineGenerator(personData);
        return {
           path: Skia.Path.MakeFromSVGString(d || '')!,
           color: personData[0].color,
           data: personData
        };
      });
    }, []);

    // Interaction State
    const activeDayIndex = useSharedValue<number | null>(null);
    const touchX = useSharedValue(0);

    const gesture = Gesture.Pan()
    .onChange((e) => {
        touchX.value = e.x;
        const index = Math.round((e.x / GRAPH_WIDTH) * (DAYS.length - 1));
        if (index >= 0 && index < DAYS.length) {
            activeDayIndex.value = index;
        }
    })
    .onFinalize(() => {
        activeDayIndex.value = null;
    });

  return (
    <GlassView style={styles.card} glassEffectStyle="regular">
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.subTitleLabel}>Weekly Steps</Text>
                <SymbolView name="info.circle" tintColor="#999" style={{ width: 14, height: 14, marginLeft: 4 }} />
            </View>
        </View>

        <Text style={styles.summaryText}>Last 7 Days</Text>

        <View style={styles.graphContainer}>
             <GestureDetector gesture={gesture}>
                <Animated.View>
                    <Canvas style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}>
                        {/* Lines and Dots */}
                        <Group>
                            {paths.map((p, i) => (
                                <Group key={i}>
                                    <Path
                                        path={p.path}
                                        style="stroke"
                                        strokeWidth={4}
                                        strokeJoin="round"
                                        strokeCap="round"
                                    >
                                        <LinearGradient
                                            start={vec(0, PADDING_VERTICAL)}
                                            end={vec(0, GRAPH_HEIGHT - PADDING_VERTICAL)}
                                            colors={[p.color, 'rgba(200,200,200,0.5)']}
                                        />
                                    </Path>
                                    {/* Dots for each point */}
                                    {p.data.map((d: any, index: number) => (
                                        <Circle
                                            key={index}
                                            cx={getX(index)}
                                            cy={yScale(d.steps)}
                                            r={5}
                                            color={p.color}
                                            style="fill"
                                        />
                                    ))}
                                    {/* White stroke outline for dots */}
                                    {p.data.map((d: any, index: number) => (
                                         <Circle
                                            key={`outline-${index}`}
                                            cx={getX(index)}
                                            cy={yScale(d.steps)}
                                            r={5}
                                            color="white"
                                            style="stroke"
                                            strokeWidth={2}
                                         />
                                    ))}
                                </Group>
                            ))}
                        </Group>

                        {/* Interactive Cursor Logic would go here (vertical line) */}
                    </Canvas>
                    
                     {/* Avatars - Overlayed Absolute View */}
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        {paths.map((p, i) => {
                             const lastPointY = yScale(p.data[p.data.length - 1].steps);
                             // We can animate this entry if needed, but for now static position
                             return (
                                 <AvatarMarker 
                                    key={i}
                                    y={lastPointY}
                                    color={p.color}
                                    idx={i}
                                    source={AVATARS[i]}
                                 />
                             );
                        })}
                    </View>
                </Animated.View>
             </GestureDetector>
        </View>
        
        {/* X Axis Labels */}
        <View style={styles.xAxis}>
            {DAYS.map((day, i) => (
                <Text key={i} style={styles.axisLabel}>{day}</Text>
            ))}
        </View>
    </GlassView>
  );
};

// Revert to RN Image to avoid crash without rebuild

const AvatarMarker = ({ y, color, source, idx }: { y: number, color: string, idx: number, source: any }) => {
    // Stagger them slightly to the right if needed, but strict prompt said "at the right of the line"
    // Since lines end at GRAPH_WIDTH (width of canvas), we position them there.
    // However, graph width is SCREEN - 48.
    
    // We adjust active Y slightly with a spring for "aliveness"
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: withSpring(y - 16) }], // -16 to center 32px avatar
        };
    });

    return (
        <Animated.View style={[styles.avatarContainer, animatedStyle, { borderColor: color }]}>
            <RNImage source={source} style={styles.avatar} resizeMode="cover" />
        </Animated.View>
    );
};

const styles = StyleSheet.create(theme => ({
  card: {
    // backgroundColor: 'rgba(255,255,255,0.7)', // Glass view handles bg mostly, but regular needs a tint
    borderRadius: 24,
    padding: CARD_PADDING,
    // Margin removed here, handled by wrapper
    // shadowColor: '#000', ... handled by elevation? GlassView might clip shadows on Android
    overflow: 'hidden', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  subTitleLabel: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
  },
  summaryText: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  graphContainer: {
    height: GRAPH_HEIGHT,
    width: GRAPH_WIDTH,
    position: 'relative',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4, // Align with dots roughly
  },
  axisLabel: {
    ...theme.typography.xs,
    color: theme.colors.text.muted,
    width: 30, 
    textAlign: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    right: -12, // Push slightly outside the graph end
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#fff',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  }
}));