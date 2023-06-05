import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigation from './components/navigation';
import Spending from './components/spending';
import Statistics from './components/statistics';
import Settings from './components/settings';

export default function App() {
  return (
    <View style={styles.container}>
      <Navigation/>
      <Spending/>
      <Statistics/>
      <Settings/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
