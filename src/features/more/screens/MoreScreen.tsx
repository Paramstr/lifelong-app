import { StyleSheet } from 'react-native-unistyles';
import { Text, View } from 'react-native';

const MoreScreen = () => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Text style={styles.text}>More Screen</Text>
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

export default MoreScreen;