import { easeGradient } from '@/utils/ease-gradient';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_WIDTH * 0.8;

interface TopBlurHeaderProps {
    /**
     * Percentage of the height where the fade starts (0 to 1)
     * @default 0.2
     */
    fadeStart?: number;
    /**
     * Percentage of the height where the fade becomes solid background color (0 to 1)
     * @default 0.9
     */
    fadeEnd?: number;
    /**
     * Blur intensity (0 to 100)
     * @default 30
     */
    blurIntensity?: number;
}

const TopBlurHeader: React.FC<TopBlurHeaderProps> = ({
    fadeStart = 0.2,
    fadeEnd = 0.9,
    blurIntensity = 20,
}) => {
    const { theme } = useUnistyles();

    const { colors, locations } = useMemo(() => {
        return easeGradient({
            colorStops: {
                0: { color: 'transparent' },
                [fadeStart]: { color: 'transparent' },
                [fadeEnd]: { color: theme.colors.background.primary },
                1: { color: theme.colors.background.primary },
            },
        });
    }, [fadeStart, fadeEnd, theme.colors.background.primary]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/header.png')}
                style={styles.image}
                resizeMode="cover"
            />
            <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFill} />
            <LinearGradient
                colors={colors}
                locations={locations}
                style={styles.gradient}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: HEADER_HEIGHT,
        zIndex: -1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
});

export default TopBlurHeader;
