import { ScrollView, StyleSheet } from 'react-native';
import { DemoScreen } from '../src/DemoScreen';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DemoScreen />
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})