import { StyleSheet, Text, View } from 'react-native';

export default function SocialTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Social Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
