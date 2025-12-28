import { StyleSheet } from 'react-native-unistyles';
import { Text, View } from 'react-native';

const HealthScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Health Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  text: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
  },
}));

export default HealthScreen;